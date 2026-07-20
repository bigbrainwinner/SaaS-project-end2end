'use server';

import { headers } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { createServerSupabaseClient } from '../supabase/server';
import { isSupabaseConfigured } from '../supabase/config';
import {
  checkLimit,
  clientIdFromHeaders,
  writeLimiter,
} from '../ratelimit';
import { toSentenceCase } from '../utils';

// -----------------------------------------------------------------------------
// Types + generic error strings
// -----------------------------------------------------------------------------

const GENERIC_ERROR = 'Something went wrong. Please try again.';
const NOT_AUTHENTICATED = 'You must be signed in.';
const RATE_LIMITED = 'Too many requests. Please wait a moment and try again.';

// -----------------------------------------------------------------------------
// Rate-limit helper
// -----------------------------------------------------------------------------

async function checkWriteRate(userId: string | null): Promise<string | null> {
  const hdrs = await headers();
  const identifier = userId ?? clientIdFromHeaders(hdrs);
  const result = await checkLimit(writeLimiter, `write:${identifier}`);
  return result.ok ? null : RATE_LIMITED;
}

// -----------------------------------------------------------------------------
// Read actions (RLS-gated; no explicit auth check needed)
// -----------------------------------------------------------------------------

export async function fetchOrdersAction(): Promise<{
  success: boolean;
  data?: unknown[];
  error?: string;
}> {
  if (!isSupabaseConfigured()) {
    return { success: true, data: [] };
  }

  try {
    const supabase = await createServerSupabaseClient();
    if (!supabase) return { success: false, error: GENERIC_ERROR };

    const { data, error } = await supabase
      .from('orders')
      .select('*, attachments(*)')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return { success: true, data };
  } catch (err) {
    console.error('[fetchOrdersAction]', err);
    return { success: false, error: GENERIC_ERROR };
  }
}

export async function fetchOrderByIdAction(
  id: string,
): Promise<{ success: boolean; data?: unknown; error?: string }> {
  const IdSchema = z.string().uuid();
  const parsed = IdSchema.safeParse(id);
  if (!parsed.success) return { success: false, error: GENERIC_ERROR };

  if (!isSupabaseConfigured()) {
    return { success: true };
  }

  try {
    const supabase = await createServerSupabaseClient();
    if (!supabase) return { success: false, error: GENERIC_ERROR };

    const { data, error } = await supabase
      .from('orders')
      .select('*, attachments(*)')
      .eq('id', parsed.data)
      .single();

    if (error) throw error;
    return { success: true, data };
  } catch (err) {
    console.error('[fetchOrderByIdAction]', err);
    return { success: false, error: GENERIC_ERROR };
  }
}

// -----------------------------------------------------------------------------
// Create order — zod-validated, rate-limited, file-validated
// -----------------------------------------------------------------------------

const CONTENT_TYPES = [
  'Blog Post',
  'Newsletter Email',
  'Website Copy',
  'Technical Guide',
  'Social Media Post',
  'Whitepaper',
  'Case Study',
] as const;

const OrderInputSchema = z.object({
  title: z.string().trim().min(5).max(200),
  contentType: z.enum(CONTENT_TYPES),
  wordCount: z.coerce.number().int().min(100).max(20_000),
  deadline: z.coerce.date().refine((d) => d.getTime() > Date.now() - 24 * 3600 * 1000, {
    message: 'Deadline must be in the future.',
  }),
  targetAudience: z.string().trim().min(1).max(500),
  toneVoice: z.string().trim().min(1).max(500),
  additionalNotes: z.string().max(5000).optional().default(''),
  keywords: z.array(z.string().trim().min(1).max(50)).max(30),
  referenceLinks: z
    .array(z.string().trim().min(1).max(500))
    .max(20),
});

// Attachment upload constraints
const MAX_ATTACHMENT_BYTES = 10 * 1024 * 1024; // 10 MB per file
const MAX_ATTACHMENTS = 10;
const ALLOWED_ATTACHMENT_MIME = new Set([
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'text/plain',
  'text/markdown',
  'text/csv',
  'image/png',
  'image/jpeg',
  'image/webp',
  'image/gif',
]);

function safeJsonArray(raw: string | null): string[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.map(String) : [];
  } catch {
    return [];
  }
}

export async function createOrderAction(
  formData: FormData,
): Promise<{ success: boolean; data?: unknown; error?: string }> {
  // Pre-flight IP-level rate limit (we don't know the user id yet).
  const preflight = await checkWriteRate(null);
  if (preflight) return { success: false, error: preflight };

  const parsed = OrderInputSchema.safeParse({
    title: formData.get('title'),
    contentType: formData.get('contentType'),
    wordCount: formData.get('wordCount'),
    deadline: formData.get('deadline'),
    targetAudience: formData.get('targetAudience'),
    toneVoice: formData.get('toneVoice'),
    additionalNotes: formData.get('additionalNotes') ?? '',
    keywords: safeJsonArray(formData.get('keywords') as string | null),
    referenceLinks: safeJsonArray(
      formData.get('referenceLinks') as string | null,
    ),
  });

  if (!parsed.success) {
    console.error(
      '[createOrderAction] validation:',
      parsed.error.flatten(),
    );
    return {
      success: false,
      error: 'Some fields are invalid. Please review and try again.',
    };
  }

  const input = parsed.data;
  const title = toSentenceCase(input.title);

  // Validate attachments early — before any DB work.
  const rawFiles = formData.getAll('files') as File[];
  const files = rawFiles.filter((f) => f && f.size > 0 && f.name);
  if (files.length > MAX_ATTACHMENTS) {
    return {
      success: false,
      error: `You can attach at most ${MAX_ATTACHMENTS} files per task.`,
    };
  }
  for (const f of files) {
    if (f.size > MAX_ATTACHMENT_BYTES) {
      return {
        success: false,
        error: `Attachment "${f.name}" exceeds the 10 MB limit.`,
      };
    }
    if (!ALLOWED_ATTACHMENT_MIME.has(f.type)) {
      return {
        success: false,
        error: `Attachment "${f.name}" has an unsupported file type.`,
      };
    }
  }

  if (!isSupabaseConfigured()) {
    // Mock path: nothing to persist; caller falls back to local state.
    return { success: true };
  }

  try {
    const supabase = await createServerSupabaseClient();
    if (!supabase) return { success: false, error: GENERIC_ERROR };

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return { success: false, error: NOT_AUTHENTICATED };

    // Per-user rate limit now that we know the identity.
    const userLimit = await checkWriteRate(user.id);
    if (userLimit) return { success: false, error: userLimit };

    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        user_id: user.id,
        title,
        content_type: input.contentType,
        status: 'Draft',
        deadline: input.deadline.toISOString(),
        word_count: input.wordCount,
        target_audience: input.targetAudience,
        tone_voice: input.toneVoice,
        keywords: input.keywords,
        reference_links: input.referenceLinks,
        additional_notes: input.additionalNotes,
      })
      .select()
      .single();

    if (orderError) throw orderError;

    for (const file of files) {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const rawExt = file.name.split('.').pop() ?? '';
      const ext = rawExt.replace(/[^a-zA-Z0-9]/g, '').slice(0, 10) || 'bin';
      const uniquePath = `${user.id}/${order.id}/${Date.now()}-${Math.random()
        .toString(36)
        .substring(7)}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from('attachments')
        .upload(uniquePath, buffer, {
          contentType: file.type,
        });

      if (uploadError) throw uploadError;

      const { error: attachError } = await supabase
        .from('attachments')
        .insert({
          order_id: order.id,
          file_name: file.name,
          file_path: uniquePath,
          file_size: file.size,
        });

      if (attachError) throw attachError;
    }

    revalidatePath('/orders');
    revalidatePath('/dashboard');
    return { success: true, data: order };
  } catch (err) {
    console.error('[createOrderAction]', err);
    return { success: false, error: GENERIC_ERROR };
  }
}

// -----------------------------------------------------------------------------
// Update profile
// -----------------------------------------------------------------------------

const ProfileSchema = z.object({
  name: z.string().trim().max(100),
  company: z.string().trim().max(100),
  avatarUrl: z
    .string()
    .trim()
    .max(500)
    .refine(
      (v) => v === '' || /^https?:\/\//i.test(v),
      { message: 'Avatar URL must start with http(s):// or be empty.' },
    )
    .optional(),
});

export async function updateProfileAction(profileData: {
  name: string;
  company: string;
  avatarUrl?: string;
}): Promise<{ success: boolean; error?: string }> {
  const parsed = ProfileSchema.safeParse(profileData);
  if (!parsed.success) {
    return { success: false, error: 'Some profile fields are invalid.' };
  }

  if (!isSupabaseConfigured()) {
    return { success: true };
  }

  try {
    const supabase = await createServerSupabaseClient();
    if (!supabase) return { success: false, error: GENERIC_ERROR };

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return { success: false, error: NOT_AUTHENTICATED };

    const rate = await checkWriteRate(user.id);
    if (rate) return { success: false, error: rate };

    const updates: Record<string, unknown> = {
      name: parsed.data.name,
      company: parsed.data.company,
      updated_at: new Date().toISOString(),
    };
    if (parsed.data.avatarUrl !== undefined) {
      updates.avatar_url = parsed.data.avatarUrl;
    }

    const { data: existingProfile } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', user.id)
      .maybeSingle();

    let error;
    if (existingProfile) {
      const res = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id);
      error = res.error;
    } else {
      const res = await supabase.from('profiles').insert({
        id: user.id,
        email: user.email,
        ...updates,
      });
      error = res.error;
    }

    if (error) throw error;
    return { success: true };
  } catch (err) {
    console.error('[updateProfileAction]', err);
    return { success: false, error: GENERIC_ERROR };
  }
}

// -----------------------------------------------------------------------------
// Upload avatar
// -----------------------------------------------------------------------------

const MAX_AVATAR_BYTES = 2 * 1024 * 1024; // 2 MB
const ALLOWED_AVATAR_MIME = new Set([
  'image/png',
  'image/jpeg',
  'image/webp',
]);

export async function uploadAvatarAction(
  formData: FormData,
): Promise<{ success: boolean; url?: string; error?: string }> {
  const file = formData.get('avatar') as File | null;
  if (!file || file.size === 0) {
    return { success: false, error: 'No image file provided.' };
  }
  if (file.size > MAX_AVATAR_BYTES) {
    return { success: false, error: 'Avatar must be under 2 MB.' };
  }
  if (!ALLOWED_AVATAR_MIME.has(file.type)) {
    return {
      success: false,
      error: 'Avatar must be a PNG, JPEG, or WEBP image.',
    };
  }

  if (!isSupabaseConfigured()) {
    // Mock path: return a local blob URL (client-only, non-persistent).
    return { success: true, url: URL.createObjectURL(file) };
  }

  try {
    const supabase = await createServerSupabaseClient();
    if (!supabase) return { success: false, error: GENERIC_ERROR };

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return { success: false, error: NOT_AUTHENTICATED };

    const rate = await checkWriteRate(user.id);
    if (rate) return { success: false, error: rate };

    // Attempt to ensure the bucket exists in case the migration hasn't
    // been applied. Best-effort — swallow errors silently.
    try {
      await supabase.storage.createBucket('avatars', { public: true });
    } catch {
      /* already exists or lacking privilege — expected in most cases */
    }

    const rawExt = file.name.split('.').pop() ?? '';
    const ext = rawExt.replace(/[^a-zA-Z0-9]/g, '').slice(0, 5) || 'png';
    const uniquePath = `${user.id}/${Date.now()}.${ext}`;

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(uniquePath, buffer, {
        contentType: file.type,
        upsert: true,
      });
    if (uploadError) throw uploadError;

    const {
      data: { publicUrl },
    } = supabase.storage.from('avatars').getPublicUrl(uniquePath);

    const { data: existingProfile } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', user.id)
      .maybeSingle();

    let updateError;
    if (existingProfile) {
      const res = await supabase
        .from('profiles')
        .update({
          avatar_url: publicUrl,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);
      updateError = res.error;
    } else {
      const res = await supabase.from('profiles').insert({
        id: user.id,
        email: user.email,
        avatar_url: publicUrl,
        updated_at: new Date().toISOString(),
      });
      updateError = res.error;
    }
    if (updateError) throw updateError;

    return { success: true, url: publicUrl };
  } catch (err) {
    console.error('[uploadAvatarAction]', err);
    return { success: false, error: GENERIC_ERROR };
  }
}

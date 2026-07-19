'use server';

import { createServerSupabaseClient } from '../supabase/server';
import { isSupabaseConfigured } from '../supabase/config';
import { revalidatePath } from 'next/cache';
import { Order, OrderStatus } from '@/types';
import { toSentenceCase } from '../utils';

// Fetch all orders for the current user
export async function fetchOrdersAction(): Promise<{ success: boolean; data?: any[]; error?: string }> {
  if (!isSupabaseConfigured()) {
    return { success: true, data: [] }; // Mocks handled client-side
  }

  try {
    const supabase = await createServerSupabaseClient();
    if (!supabase) throw new Error('Supabase client failed to initialize');

    const { data, error } = await supabase
      .from('orders')
      .select('*, attachments(*)')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return { success: true, data };
  } catch (err: any) {
    console.error('fetchOrdersAction error:', err);
    return { success: false, error: err.message };
  }
}

// Fetch single order by ID
export async function fetchOrderByIdAction(id: string): Promise<{ success: boolean; data?: any; error?: string }> {
  if (!isSupabaseConfigured()) {
    return { success: true };
  }

  try {
    const supabase = await createServerSupabaseClient();
    if (!supabase) throw new Error('Supabase client failed to initialize');

    const { data, error } = await supabase
      .from('orders')
      .select('*, attachments(*)')
      .eq('id', id)
      .single();

    if (error) throw error;

    return { success: true, data };
  } catch (err: any) {
    console.error('fetchOrderByIdAction error:', err);
    return { success: false, error: err.message };
  }
}

// Create order + attachments upload action
export async function createOrderAction(formData: FormData): Promise<{ success: boolean; data?: any; error?: string }> {
  const title = toSentenceCase(formData.get('title') as string);
  const contentType = formData.get('contentType') as string;
  const wordCount = Number(formData.get('wordCount'));
  const deadline = formData.get('deadline') as string;
  const targetAudience = formData.get('targetAudience') as string;
  const toneVoice = formData.get('toneVoice') as string;
  const additionalNotes = formData.get('additionalNotes') as string;
  
  // Parse arrays
  const keywords = JSON.parse((formData.get('keywords') as string) || '[]');
  const referenceLinks = JSON.parse((formData.get('referenceLinks') as string) || '[]');

  // Retrieve files
  const files = formData.getAll('files') as File[];

  if (isSupabaseConfigured()) {
    try {
      const supabase = await createServerSupabaseClient();
      if (!supabase) throw new Error('Supabase client failed to initialize');

      // Get authenticated user ID
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Unauthenticated user attempt');

      // 1. Insert Order Row
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: user.id,
          title,
          content_type: contentType,
          status: 'Draft',
          deadline: new Date(deadline).toISOString(),
          word_count: wordCount,
          target_audience: targetAudience,
          tone_voice: toneVoice,
          keywords,
          reference_links: referenceLinks,
          additional_notes: additionalNotes,
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // 2. Upload attachments if files exist
      if (files && files.length > 0) {
        for (const file of files) {
          // Skip empty placeholder files
          if (file.size === 0 || !file.name) continue;

          // Convert file to array buffer for upload
          const arrayBuffer = await file.arrayBuffer();
          const buffer = Buffer.from(arrayBuffer);

          const fileExt = file.name.split('.').pop();
          const uniquePath = `${user.id}/${order.id}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

          // Upload to 'attachments' bucket
          const { error: uploadError } = await supabase.storage
            .from('attachments')
            .upload(uniquePath, buffer, {
              contentType: file.type,
              duplex: 'half'
            });

          if (uploadError) throw uploadError;

          // Insert Attachment Row
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
      }

      revalidatePath('/orders');
      revalidatePath('/dashboard');

      return { success: true, data: order };
    } catch (err: any) {
      console.error('createOrderAction error:', err);
      return { success: false, error: err.message };
    }
  }

  // Fallback success response for mock state ingestion
  return { success: true };
}

// Update profile details
export async function updateProfileAction(profileData: { name: string; company: string; avatarUrl?: string }): Promise<{ success: boolean; error?: string }> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = await createServerSupabaseClient();
      if (!supabase) throw new Error('Supabase client failed to initialize');

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Unauthenticated user attempt');

      const updates: any = {
        name: profileData.name,
        company: profileData.company,
        updated_at: new Date().toISOString()
      };

      if (profileData.avatarUrl !== undefined) {
        updates.avatar_url = profileData.avatarUrl;
      }

      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id);

      if (error) throw error;

      return { success: true };
    } catch (err: any) {
      console.error('updateProfileAction error:', err);
      return { success: false, error: err.message };
    }
  }

  return { success: true };
}

// Upload avatar photo to public avatars bucket
export async function uploadAvatarAction(formData: FormData): Promise<{ success: boolean; url?: string; error?: string }> {
  const file = formData.get('avatar') as File;
  if (!file) return { success: false, error: 'No image file provided' };

  if (isSupabaseConfigured()) {
    try {
      const supabase = await createServerSupabaseClient();
      if (!supabase) throw new Error('Supabase client failed to initialize');

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Unauthenticated user attempt');

      // Attempt to ensure 'avatars' bucket exists in case migration hasn't run
      try {
        await supabase.storage.createBucket('avatars', { public: true });
      } catch (err) {
        // Silently skip if it fails or already exists
      }

      const fileExt = file.name.split('.').pop() || 'png';
      const uniquePath = `${user.id}/${Date.now()}.${fileExt}`;

      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      // Upload file to the 'avatars' bucket
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(uniquePath, buffer, {
          contentType: file.type,
          upsert: true
        });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(uniquePath);

      // Save public URL to profiles database row
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          avatar_url: publicUrl,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (updateError) throw updateError;

      return { success: true, url: publicUrl };
    } catch (err: any) {
      console.error('uploadAvatarAction error:', err);
      return { success: false, error: err.message || 'Avatar upload failed' };
    }
  }

  // Local Mock fallback: create local blob url
  return { success: true, url: URL.createObjectURL(file) };
}


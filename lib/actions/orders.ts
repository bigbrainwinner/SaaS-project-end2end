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
export async function updateProfileAction(profileData: { name: string; company: string }): Promise<{ success: boolean; error?: string }> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = await createServerSupabaseClient();
      if (!supabase) throw new Error('Supabase client failed to initialize');

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Unauthenticated user attempt');

      const { error } = await supabase
        .from('profiles')
        .update({
          name: profileData.name,
          company: profileData.company,
          updated_at: new Date().toISOString()
        })
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

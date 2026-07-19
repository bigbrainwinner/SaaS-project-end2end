'use server';

import { cookies } from 'next/headers';
import { createServerSupabaseClient } from '../supabase/server';
import { isSupabaseConfigured } from '../supabase/config';

export async function loginAction(formData: Record<string, string>) {
  const email = formData.email;
  const password = formData.password;

  if (!email || !password) {
    return { error: 'Email and password are required' };
  }

  // Live Supabase path
  if (isSupabaseConfigured()) {
    try {
      const supabase = await createServerSupabaseClient();
      if (!supabase) throw new Error('Supabase client failed to initialize');

      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { error: error.message };
      }

      return { success: true };
    } catch (err: any) {
      return { error: err.message || 'An unexpected error occurred during login' };
    }
  }

  // Local Mock path
  const cookieStore = await cookies();
  cookieStore.set('mock_session', 'usr-1', { path: '/' });
  cookieStore.set('mock_user_email', email, { path: '/' });
  return { success: true };
}

export async function signupAction(formData: Record<string, string>) {
  const email = formData.email;
  const password = formData.password;

  if (!email || !password) {
    return { error: 'Email and password are required' };
  }

  // Live Supabase path
  if (isSupabaseConfigured()) {
    try {
      const supabase = await createServerSupabaseClient();
      if (!supabase) throw new Error('Supabase client failed to initialize');

      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/auth/callback`,
          data: {
            name: formData.name || undefined,
            company: formData.company || undefined,
          }
        },
      });

      if (error) {
        return { error: error.message };
      }

      return { success: true, message: 'Check your email to confirm your account' };
    } catch (err: any) {
      return { error: err.message || 'An unexpected error occurred during sign up' };
    }
  }

  // Local Mock path
  const cookieStore = await cookies();
  cookieStore.set('mock_session', 'usr-1', { path: '/' });
  cookieStore.set('mock_user_email', email, { path: '/' });
  return { success: true, message: 'Account created successfully (Simulated)' };
}

export async function logoutAction() {
  // Live Supabase path
  if (isSupabaseConfigured()) {
    try {
      const supabase = await createServerSupabaseClient();
      if (supabase) {
        await supabase.auth.signOut();
      }
    } catch (err) {
      console.error('Logout error:', err);
    }
  }

  // Local Mock path / cleanup anyway
  const cookieStore = await cookies();
  cookieStore.delete('mock_session');
  cookieStore.delete('mock_user_email');
  return { success: true };
}

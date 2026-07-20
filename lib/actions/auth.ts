'use server';

import { cookies } from 'next/headers';
import { z } from 'zod';
import { createServerSupabaseClient } from '../supabase/server';
import { isSupabaseConfigured, isMockAuthAllowed } from '../supabase/config';

/** Generic surface returned to the client. Never include DB internals. */
type AuthResult = { success?: true; message?: string; error?: string };

const GENERIC_LOGIN_ERROR = 'Invalid email or password.';
const GENERIC_SIGNUP_ERROR = 'Unable to create account. Please try again.';
const GENERIC_UNAVAILABLE = 'Service temporarily unavailable. Please try again.';

const LoginSchema = z.object({
  email: z.string().trim().toLowerCase().email().max(254),
  password: z.string().min(1).max(200),
});

const SignupSchema = z.object({
  email: z.string().trim().toLowerCase().email().max(254),
  password: z.string().min(8).max(200),
  name: z.string().trim().min(1).max(100).optional(),
  company: z.string().trim().min(1).max(100).optional(),
});

const MOCK_COOKIE_OPTIONS = {
  path: '/',
  httpOnly: true,
  sameSite: 'lax' as const,
  secure: process.env.NODE_ENV === 'production',
  maxAge: 60 * 60 * 24, // 1 day
};

export async function loginAction(
  formData: Record<string, string>,
): Promise<AuthResult> {
  const parsed = LoginSchema.safeParse(formData);
  if (!parsed.success) {
    return { error: GENERIC_LOGIN_ERROR };
  }
  const { email, password } = parsed.data;

  if (isSupabaseConfigured()) {
    try {
      const supabase = await createServerSupabaseClient();
      if (!supabase) return { error: GENERIC_UNAVAILABLE };

      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        // Never surface Supabase's specific reason (rate-limited,
        // banned, unconfirmed, wrong password) to the client — they
        // let attackers enumerate accounts.
        return { error: GENERIC_LOGIN_ERROR };
      }
      return { success: true };
    } catch (err) {
      console.error('[loginAction] unexpected:', err);
      return { error: GENERIC_UNAVAILABLE };
    }
  }

  if (!isMockAuthAllowed()) {
    // Should be unreachable in production because config.ts throws.
    return { error: GENERIC_UNAVAILABLE };
  }

  const cookieStore = await cookies();
  cookieStore.set('mock_session', 'usr-1', MOCK_COOKIE_OPTIONS);
  cookieStore.set('mock_user_email', email, MOCK_COOKIE_OPTIONS);
  return { success: true };
}

export async function signupAction(
  formData: Record<string, string>,
): Promise<AuthResult> {
  const parsed = SignupSchema.safeParse(formData);
  if (!parsed.success) {
    // Give a small hint on the one thing that's most common to catch
    // (weak password) without leaking full schema errors.
    const flat = parsed.error.flatten();
    if (flat.fieldErrors.password?.length) {
      return { error: 'Password must be at least 8 characters.' };
    }
    if (flat.fieldErrors.email?.length) {
      return { error: 'Please provide a valid email address.' };
    }
    return { error: GENERIC_SIGNUP_ERROR };
  }
  const { email, password, name, company } = parsed.data;

  if (isSupabaseConfigured()) {
    try {
      const supabase = await createServerSupabaseClient();
      if (!supabase) return { error: GENERIC_UNAVAILABLE };

      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${siteUrl}/auth/callback`,
          data: {
            name: name || undefined,
            company: company || undefined,
          },
        },
      });
      if (error) {
        console.error('[signupAction] supabase:', error.message);
        return { error: GENERIC_SIGNUP_ERROR };
      }
      return {
        success: true,
        message: 'Check your email to confirm your account.',
      };
    } catch (err) {
      console.error('[signupAction] unexpected:', err);
      return { error: GENERIC_UNAVAILABLE };
    }
  }

  if (!isMockAuthAllowed()) {
    return { error: GENERIC_UNAVAILABLE };
  }

  const cookieStore = await cookies();
  cookieStore.set('mock_session', 'usr-1', MOCK_COOKIE_OPTIONS);
  cookieStore.set('mock_user_email', email, MOCK_COOKIE_OPTIONS);
  return { success: true, message: 'Account created successfully (Simulated).' };
}

export async function logoutAction(): Promise<AuthResult> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = await createServerSupabaseClient();
      if (supabase) {
        await supabase.auth.signOut();
      }
    } catch (err) {
      console.error('[logoutAction] unexpected:', err);
    }
  }

  const cookieStore = await cookies();
  cookieStore.delete('mock_session');
  cookieStore.delete('mock_user_email');
  return { success: true };
}

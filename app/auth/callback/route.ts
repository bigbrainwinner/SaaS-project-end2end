import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';

/**
 * Only accept `next` values that are relative same-origin paths.
 * A safe value:
 *   - starts with a single "/"
 *   - is NOT protocol-relative ("//evil.com")
 *   - is NOT a Windows-style path ("/\evil.com")
 *   - does NOT contain userinfo separators ("@") that could combine with
 *     the origin into `https://app.example@evil.com`
 */
function safeNextPath(raw: string | null): string {
  const fallback = '/dashboard';
  if (!raw) return fallback;
  if (raw.length > 512) return fallback;
  if (!raw.startsWith('/')) return fallback;
  if (raw.startsWith('//')) return fallback;
  if (raw.startsWith('/\\')) return fallback;
  if (raw.includes('@')) return fallback;
  if (raw.includes('\r') || raw.includes('\n')) return fallback;
  return raw;
}

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = safeNextPath(searchParams.get('next'));

  if (code) {
    const supabase = await createServerSupabaseClient();
    if (supabase) {
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      if (!error) {
        // Build the absolute URL through the URL constructor so any
        // remaining trickery in `next` is normalized away.
        return NextResponse.redirect(new URL(next, origin));
      }
    }
  }

  return NextResponse.redirect(new URL('/auth/login?error=auth_failed', origin));
}

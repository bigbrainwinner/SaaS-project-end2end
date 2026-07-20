import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { isSupabaseConfigured, isMockAuthAllowed } from './lib/supabase/config';
import { authLimiter, checkLimit, clientIdFromHeaders } from './lib/ratelimit';

/**
 * Routes reachable without a session. Everything else defaults to
 * "protected" — a new protected page is automatically covered by the
 * proxy without an explicit list update.
 */
const PUBLIC_EXACT = new Set<string>(['/', '/robots.txt', '/sitemap.xml']);
const PUBLIC_PREFIXES = ['/auth/'];

function isPublicPath(pathname: string): boolean {
  if (PUBLIC_EXACT.has(pathname)) return true;
  return PUBLIC_PREFIXES.some((p) => pathname.startsWith(p));
}

/**
 * Path is an interactive auth screen (login/signup). Authenticated
 * users hitting one of these should be bounced to /dashboard.
 * `/auth/callback` is intentionally excluded — it must always run.
 */
function isAuthLandingPath(pathname: string): boolean {
  return (
    pathname.startsWith('/auth/') &&
    pathname !== '/auth/callback' &&
    !pathname.startsWith('/auth/callback/')
  );
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Rate limit /auth/* traffic. Cheap, runs before any DB work.
  if (pathname.startsWith('/auth/')) {
    const ip = clientIdFromHeaders(request.headers);
    const result = await checkLimit(authLimiter, `auth:${ip}`);
    if (!result.ok) {
      return new NextResponse('Too Many Requests', {
        status: 429,
        headers: { 'Retry-After': String(result.retryAfterSeconds) },
      });
    }
  }

  // 2. Live Supabase path (production and any env that has real creds).
  if (isSupabaseConfigured()) {
    try {
      const { createServerClient } = await import('@supabase/ssr');
      let response = NextResponse.next({
        request: { headers: request.headers },
      });

      const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
          cookies: {
            getAll() {
              return request.cookies.getAll();
            },
            setAll(cookiesToSet) {
              cookiesToSet.forEach(({ name, value }) =>
                request.cookies.set(name, value),
              );
              response = NextResponse.next({ request });
              cookiesToSet.forEach(({ name, value, options }) =>
                response.cookies.set(name, value, options),
              );
            },
          },
        },
      );

      const {
        data: { user },
      } = await supabase.auth.getUser();

      // Default-deny: unauthenticated hitting a non-public path -> login.
      if (!user && !isPublicPath(pathname)) {
        const url = request.nextUrl.clone();
        url.pathname = '/auth/login';
        return NextResponse.redirect(url);
      }

      // Authenticated user on a login/signup screen -> dashboard.
      if (user && isAuthLandingPath(pathname)) {
        const url = request.nextUrl.clone();
        url.pathname = '/dashboard';
        return NextResponse.redirect(url);
      }

      return response;
    } catch (e) {
      // In production we FAIL CLOSED. If Supabase is down we would
      // rather serve 503-ish than accept unsigned mock cookies.
      if (process.env.NODE_ENV === 'production') {
        console.error('[proxy] Supabase auth check failed:', e);
        if (!isPublicPath(pathname)) {
          const url = request.nextUrl.clone();
          url.pathname = '/auth/login';
          url.searchParams.set('error', 'auth_unavailable');
          return NextResponse.redirect(url);
        }
        return NextResponse.next();
      }
      console.error('[proxy] Supabase error, falling back to mock (dev only):', e);
    }
  }

  // 3. Mock-auth path. ONLY reachable in non-production when Supabase
  //    is not configured. In production isMockAuthAllowed() is always
  //    false and this branch is unreachable.
  if (!isMockAuthAllowed()) {
    // Shouldn't happen (config.ts throws on missing prod env vars),
    // but be defensive: fail closed.
    if (!isPublicPath(pathname)) {
      const url = request.nextUrl.clone();
      url.pathname = '/auth/login';
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  const mockSession = request.cookies.get('mock_session')?.value;
  if (!mockSession && !isPublicPath(pathname)) {
    const url = request.nextUrl.clone();
    url.pathname = '/auth/login';
    return NextResponse.redirect(url);
  }
  if (mockSession && isAuthLandingPath(pathname)) {
    const url = request.nextUrl.clone();
    url.pathname = '/dashboard';
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Run on every request except Next.js internals and static files.
     * Static asset extensions are excluded so we don't burn a proxy
     * invocation on every .svg / .png.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|webm|mov|mp4)$).*)',
  ],
};

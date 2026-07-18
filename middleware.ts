import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { isSupabaseConfigured } from './lib/supabase/config';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Define route check boundaries
  const isDashboardRoute = pathname.startsWith('/dashboard') || 
                            pathname.startsWith('/orders') || 
                            pathname.startsWith('/settings');
  const isAuthRoute = pathname.startsWith('/auth');

  // Case 1: Supabase is configured (Production Auth)
  if (isSupabaseConfigured()) {
    try {
      // Import createServerClient dynamically to avoid node modules edge loading issues in mock environments
      const { createServerClient } = await import('@supabase/ssr');
      let response = NextResponse.next({
        request: {
          headers: request.headers,
        },
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
              cookiesToSet.forEach(({ name, value, options }) =>
                request.cookies.set(name, value)
              );
              response = NextResponse.next({
                request,
              });
              cookiesToSet.forEach(({ name, value, options }) =>
                response.cookies.set(name, value, options)
              );
            },
          },
        }
      );

      const { data: { user } } = await supabase.auth.getUser();

      if (!user && isDashboardRoute) {
        const url = request.nextUrl.clone();
        url.pathname = '/auth/login';
        return NextResponse.redirect(url);
      }

      if (user && isAuthRoute) {
        const url = request.nextUrl.clone();
        url.pathname = '/dashboard';
        return NextResponse.redirect(url);
      }

      return response;
    } catch (e) {
      console.error('Middleware Supabase error, falling back to mock auth check:', e);
    }
  }

  // Case 2: Supabase not configured (Graceful Local Mock Auth)
  const mockSession = request.cookies.get('mock_session')?.value;

  if (!mockSession && isDashboardRoute) {
    const url = request.nextUrl.clone();
    url.pathname = '/auth/login';
    return NextResponse.redirect(url);
  }

  if (mockSession && isAuthRoute) {
    const url = request.nextUrl.clone();
    url.pathname = '/dashboard';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to exclude public folders (like /images, /avatars) if any.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};

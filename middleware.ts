import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

// Helper function to fetch profile server-side
async function fetchUserProfile(supabase: ReturnType<typeof createServerClient>) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('questionnaire_completed')
      .eq('id', user.id)
      .single();

    if (error && error.code !== 'PGRST116') {
        console.error("Middleware: Profile fetch error:", error);
        return null; // Treat error as incomplete profile for safety?
    }
    return data; // Can be null if profile doesn't exist yet (PGRST116)
  } catch (error) {
    console.error("Middleware: Unexpected error fetching profile:", error);
    return null;
  }
}

function logSessionInfo(session: any, prefix: string) {
  if (session) {
    console.log(`${prefix} Session found:`);
    console.log(`${prefix} - User ID: ${session.user.id}`);
    console.log(`${prefix} - Email: ${session.user.email}`);
    console.log(`${prefix} - Token expiry: ${new Date(session.expires_at * 1000).toISOString()}`);
  } else {
    console.log(`${prefix} No session found`);
  }
}

export async function middleware(request: NextRequest) {
  const url = new URL(request.url);
  console.log(`[Middleware] Pathname: ${url.pathname}`);
   
  // Log all cookies for debugging
  console.log('[Middleware] Request cookies:');
  const cookieList = request.cookies.getAll();
  console.log(`[Middleware] Total cookies: ${cookieList.length}`);
  
  cookieList.forEach(cookie => {
    // Look specifically for Supabase auth tokens
    if (cookie.name.includes('auth-token')) {
      console.log(`  FOUND AUTH COOKIE: ${cookie.name}`);
    } else {
      console.log(`  ${cookie.name}=${cookie.value.substring(0, 5)}...`);
    }
  });

  // Skip middleware for certain paths - let them be handled directly by client components
  if (url.pathname === '/auth/loading' || 
      url.pathname === '/signin' ||
      url.pathname === '/dashboard' ||
      url.pathname.startsWith('/dashboard/')) {
    console.log(`[Middleware] Skipping middleware for ${url.pathname}`);
    return NextResponse.next();
  }

  let response = NextResponse.next({
    request: { headers: request.headers },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: { // Correct cookie handlers for middleware context
        get(name: string) {
          const cookie = request.cookies.get(name);
          console.log(`[Middleware] Cookie get: ${name} = ${cookie ? 'exists' : 'undefined'}`);
          return cookie?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          console.log(`[Middleware] Cookie set: ${name}`);
          request.cookies.set({ name, value, ...options });
          response = NextResponse.next({ // Recreate response to apply cookie changes
            request: { headers: request.headers },
          });
          response.cookies.set({ name, value, ...options });
        },
        remove(name: string, options: CookieOptions) {
          console.log(`[Middleware] Cookie remove: ${name}`);
          request.cookies.set({ name, value: '', ...options });
          response = NextResponse.next({
            request: { headers: request.headers },
          });
          response.cookies.set({ name, value: '', ...options });
        },
      },
    }
  );
  
  // For all routes, check session normally
  await supabase.auth.refreshSession();
  const { data: { session } } = await supabase.auth.getSession();
  logSessionInfo(session, "[Middleware] Regular route");

  const { pathname } = request.nextUrl;
  const protectedRoutes = ['/post-creation']; // Removed dashboard since we're skipping it
  const authRoutes = ['/signup']; // Removed signin since we're skipping it

  // Redirect logged-in users away from auth pages
  if (session && authRoutes.includes(pathname)) {
    console.log("[Middleware] Session exists, accessing auth page -> Redirecting to /dashboard");
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Protect routes if no session
  if (!session && protectedRoutes.some(route => pathname.startsWith(route))) {
    console.log("[Middleware] No session, accessing protected route -> Redirecting to /signin");
    const redirectUrl = new URL('/signin', request.url);
    return NextResponse.redirect(redirectUrl);
  }

  console.log("[Middleware] Allowing request to proceed.");
  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    '/dashboard/:path*',
    '/post-creation/:path*',
    '/signin',
    '/signup',
    '/auth/loading',
  ],
} 
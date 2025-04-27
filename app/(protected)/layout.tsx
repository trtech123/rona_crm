import { createServerClient } from '@supabase/ssr'; // Correct import for SSR/Server Components
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import React from 'react';
import { Session } from '@supabase/supabase-js'; // Import Session type
// Import the DashboardLayout component
import DashboardLayout from '@/components/dashboard/layout/DashboardLayout'; 
// Assuming you have a Navbar component for protected routes
// import DashboardNavbar from '@/components/dashboard/DashboardNavbar'; 

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  console.log('[Protected Layout] Running...');
  const cookieStore = await cookies(); // Await cookies()

  // Log all cookies received by the layout
  console.log('[Protected Layout] Cookies received:');
  const allCookies = cookieStore.getAll();
  if (allCookies.length === 0) {
    console.log('  (No cookies found)');
  } else {
    allCookies.forEach(cookie => {
      console.log(`  - ${cookie.name}=${cookie.value.substring(0, 15)}...`);
    });
  }

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        // Now use the resolved cookieStore
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        // Server Components don't typically set cookies,
        // but provide handlers if needed for session refresh side-effects
        set(name: string, value: string, options: any) {
          // This might be called by getSession if refresh happens
          // Need to decide if/how to handle cookie setting here
          // For now, log it
          console.warn(`[Protected Layout] Attempted to set cookie: ${name}`);
        },
        remove(name: string, options: any) {
          console.warn(`[Protected Layout] Attempted to remove cookie: ${name}`);
        },
      },
    }
  );

  let session: Session | null = null;
  let sessionError: any = null;

  try {
    console.log('[Protected Layout] Calling getSession()...');
    const { data, error } = await supabase.auth.getSession();
    session = data.session;
    sessionError = error;
    console.log('[Protected Layout] getSession() completed.');
    if (sessionError) {
      console.error('[Protected Layout] Error getting session:', sessionError);
    }
  } catch (e) {
    console.error('[Protected Layout] Exception during getSession():', e);
    sessionError = e;
  }

  if (!session) {
    // Construct the redirect URL. Pass the intended destination as a query parameter.
    const currentPath = ''; // TODO: Figure out how to get current path in server layout if needed for redirect
    // For simplicity, just redirect to signin for now. Middleware handled redirectTo better.
    console.log('[Protected Layout] No session found (or error occurred), redirecting to /signin');
    redirect('/signin'); 
  }

  // If session exists, render the children (the protected page)
  console.log(`[Protected Layout] Session found for user ${session.user.id}, rendering protected route.`);
  
  // Wrap children with the DashboardLayout component instead of the basic structure
  return (
    <DashboardLayout>
      {children} 
    </DashboardLayout>
  );
} 
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { HoogiLandingPage } from "@/components/hoogilandingpage"; // Import the landing page component

export default async function RootPage() {
  const cookieStore = await cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        // No need for set/remove on the server for this specific check
      },
    }
  );

  // Check if the user is logged in
  const { data: { session } } = await supabase.auth.getSession();

  if (session) {
    // If logged in, redirect to the dashboard
    console.log('[Root Page] User logged in, redirecting to /dashboard');
    redirect('/dashboard');
  } else {
    // If logged out, render the public landing page
    console.log('[Root Page] User logged out, rendering landing page');
    return <HoogiLandingPage />;
  }
} 
'use client'; // Convert to Client Component

import React, { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation'; // Import client hooks
import { createBrowserClient } from '@supabase/ssr'; // Use browser client
import DashboardLayout from '@/components/dashboard/layout/DashboardLayout';

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Create Supabase client only once
  const [supabase] = useState(() =>
    createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
  );

  useEffect(() => {
    const checkAuth = async () => {
      console.log('[Protected Layout - Client] Checking auth...');
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        console.log('[Protected Layout - Client] No session, redirecting to /signin');
        router.replace('/signin'); // Use replace to avoid pushing to history
      } else {
        console.log(`[Protected Layout - Client] Session found for user ${session.user.id}`);
        setIsAuthenticated(true);
        setIsLoading(false);
      }
    };

    checkAuth();

    // Optional: Listen for auth changes (login/logout in other tabs)
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
       console.log(`[Protected Layout - Client] Auth state changed: ${event}`);
      if (event === 'SIGNED_OUT') {
        router.replace('/signin');
      } else if (event === 'SIGNED_IN') {
        setIsAuthenticated(true);
        setIsLoading(false);
        // Potentially refresh data or redirect based on new session
      }
    });

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, [supabase, router]);

  if (isLoading) {
    // You can replace this with a proper loading spinner/component
    return <div>Loading authentication...</div>;
  }

  // If authenticated, render based on path
  if (isAuthenticated) {
    // Check if the current path is the root of the protected section
    // NOTE: usePathname() within the (protected) group will return paths relative to that group,
    // so the root page corresponds to pathname '/'
    console.log(`[Protected Layout - Client] Current pathname: ${pathname}`);
    if (pathname === '/') {
      console.log('[Protected Layout - Client] Rendering children directly (root path)');
      return <>{children}</>; // Render only children for the root page
    } else {
      console.log('[Protected Layout - Client] Wrapping children with DashboardLayout');
      // Render children wrapped in DashboardLayout for all other protected pages
      return <DashboardLayout>{children}</DashboardLayout>;
    }
  }

  // Fallback if not loading and not authenticated (should be handled by redirect, but good practice)
  return null;
} 
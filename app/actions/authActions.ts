'use server';

import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { AuthError } from '@supabase/supabase-js';

export async function signInAction(formData: FormData): Promise<{ error: string | null }> {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const cookieStore = await cookies();

  // Validate input
  if (!email || !password) {
    return { error: 'Email and password are required.' };
  }

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: any) {
          try {
            cookieStore.set({ name, value, ...options });
          } catch (error) {
            // The `set` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
        remove(name: string, options: any) {
          try {
            cookieStore.set({ name, value: '', ...options });
          } catch (error) {
            // The `delete` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  );

  try {
    console.log('[signInAction] Attempting sign in for:', email);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error('[signInAction] Supabase sign in error:', error.message);
      // Handle specific errors if needed
      if (error instanceof AuthError && error.message.includes('Invalid login credentials')) {
         return { error: 'Invalid email or password.' };
      }
      return { error: error.message || 'An unknown authentication error occurred.' };
    }

    console.log('[signInAction] Sign in successful for:', email);
    // Sign-in successful, cookie should be set in the response headers by ssr
    return { error: null };

  } catch (error: any) {
    console.error('[signInAction] Unexpected error:', error);
    return { error: error.message || 'An unexpected server error occurred.' };
  }
} 
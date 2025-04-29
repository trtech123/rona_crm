// Use createBrowserClient for client-side components
import { createBrowserClient } from '@supabase/ssr'

// Remove the direct import of createClient
// import { createClient } from '@supabase/supabase-js'

if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  throw new Error('Missing environment variable: NEXT_PUBLIC_SUPABASE_URL')
}

if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  throw new Error('Missing environment variable: NEXT_PUBLIC_SUPABASE_ANON_KEY')
}

// Define placeholder Database type (keep as is or generate proper types)
type Database = {
  public: {
    Tables: {};
    Functions: {};
    Enums: {};
  };
}; 

// Create and export the Supabase client for browser-side usage
// Use createBrowserClient which automatically handles session persistence via cookies
export const supabase = createBrowserClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  // Removed custom options as createBrowserClient handles defaults well
  // You can add back specific global headers if needed, but auth options are managed by the helper
)

// Removed old createClient implementation 
import { createClient } from "@supabase/supabase-js";

// TODO: Replace with your Supabase project URL
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
// TODO: Replace with your Supabase anon key
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true, // Ensure session persists in browser storage (localStorage)
    autoRefreshToken: true, // Automatically refresh the token when expired
    detectSessionInUrl: true, // Detect session from URL (e.g., after email confirmation)
    // You can add storage options here if needed, but localStorage is default
  },
});

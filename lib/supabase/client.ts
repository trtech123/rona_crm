import { createBrowserClient } from '@supabase/ssr'

// Define the type for the environment variables
// These will be populated later with the actual project details
type SupabaseEnv = {
  NEXT_PUBLIC_SUPABASE_URL: string;
  NEXT_PUBLIC_SUPABASE_ANON_KEY: string;
};

// Retrieve Supabase URL and Anon Key from environment variables
// Using placeholder values for now
const env: SupabaseEnv = {
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL ?? 'https://zknjteanegkauzuvfzrp.supabase.co',
  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inprbmp0ZWFuZWdrYXV6dXZmenJwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ3OTU4MzUsImV4cCI6MjA2MDM3MTgzNX0.-ZAFRKGj5xTY1hHNEOpXMvnFEU0xtcOahPxV2gBR1nI',
};

// Validate that the environment variables are set
if (!env.NEXT_PUBLIC_SUPABASE_URL || env.NEXT_PUBLIC_SUPABASE_URL === 'YOUR_SUPABASE_URL_PLACEHOLDER') {
  console.warn(
    'Supabase URL is not set. Please add NEXT_PUBLIC_SUPABASE_URL to your .env.local file.'
  );
}

if (!env.NEXT_PUBLIC_SUPABASE_ANON_KEY || env.NEXT_PUBLIC_SUPABASE_ANON_KEY === 'YOUR_SUPABASE_ANON_KEY_PLACEHOLDER') {
  console.warn(
    'Supabase Anon Key is not set. Please add NEXT_PUBLIC_SUPABASE_ANON_KEY to your .env.local file.'
  );
}

// Create and export the Supabase client for browser-side usage
export const supabase = createBrowserClient<Database>(
  env.NEXT_PUBLIC_SUPABASE_URL!,
  env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Define a placeholder Database type
// TODO: Generate actual types from Supabase schema later
type Database = {
  // Define your tables and types here, or leave empty for now
  public: {
    Tables: {}; // Placeholder
    Functions: {}; // Placeholder
    Enums: {}; // Placeholder
  };
}; 
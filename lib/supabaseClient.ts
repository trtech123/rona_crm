import { createClient } from '@supabase/supabase-js'

// TODO: Replace with your Supabase project URL
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
// TODO: Replace with your Supabase anon key
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey) 
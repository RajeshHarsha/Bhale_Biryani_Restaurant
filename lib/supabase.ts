import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

// Only create a real client if we have the credentials.
// This prevents build-time errors on platforms like Netlify.
export const supabase = (supabaseUrl && supabaseAnonKey)
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null as any;

if (!supabase && typeof window !== "undefined") {
  console.warn("Supabase public client initialized as null. Check NEXT_PUBLIC_SUPABASE_URL.");
}

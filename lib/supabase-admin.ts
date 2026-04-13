import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

/**
 * WARNING: This client bypasses Row Level Security (RLS).
 * MUST ONLY BE USED ON THE SERVER SIDE (API Routes, Server actions).
 * NEVER expose the Service Role Key to the browser.
 */

// Only create a real client if we have the credentials.
// This prevents build-time errors on platforms like Netlify.
export const supabaseAdmin = (supabaseUrl && supabaseServiceKey)
  ? createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })
  : null as any;

if (!supabaseAdmin) {
  // We log this as info rather than error because it's expected during build/CI
  console.info("Supabase Admin client initialized as null. This is normal during build if keys are missing.");
}

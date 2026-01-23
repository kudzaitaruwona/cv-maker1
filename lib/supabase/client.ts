import { createBrowserClient } from "@supabase/ssr";
import { getSupabaseUrl, getSupabasePublishableKey, hasSupabaseEnvVars } from "../env";

/**
 * Create a Supabase client for browser usage.
 * 
 * @throws {Error} If required Supabase environment variables are not set
 */
export function createClient() {
  // Check if env vars are set before attempting to create client
  if (!hasSupabaseEnvVars()) {
    throw new Error(
      "Supabase environment variables are not configured. " +
      "Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY " +
      "in your .env.local file or Vercel project settings."
    );
  }

  return createBrowserClient(
    getSupabaseUrl(),
    getSupabasePublishableKey(),
  );
}

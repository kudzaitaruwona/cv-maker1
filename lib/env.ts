/**
 * Environment variable validation and utilities.
 * Provides safe access to required environment variables with proper error handling.
 */

/**
 * Get Supabase URL with validation.
 * Throws an error if the variable is missing.
 * 
 * @throws {Error} If NEXT_PUBLIC_SUPABASE_URL is not set
 */
export function getSupabaseUrl(): string {
  const value = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!value) {
    throw new Error(
      `Missing required environment variable: NEXT_PUBLIC_SUPABASE_URL.\n\n` +
      `Please set this in your .env.local file:\n` +
      `NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url\n\n` +
      `Or in Vercel: Project Settings > Environment Variables\n\n` +
      `Get your Supabase URL from: https://app.supabase.com/project/_/settings/api`
    );
  }
  return value;
}

/**
 * Get Supabase publishable key with validation.
 * Throws an error if the variable is missing.
 * 
 * @throws {Error} If NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY is not set
 */
export function getSupabasePublishableKey(): string {
  const value = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!value) {
    throw new Error(
      `Missing required environment variable: NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY.\n\n` +
      `Please set this in your .env.local file:\n` +
      `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_supabase_publishable_key\n\n` +
      `Or in Vercel: Project Settings > Environment Variables\n\n` +
      `Get your Supabase key from: https://app.supabase.com/project/_/settings/api`
    );
  }
  return value;
}

/**
 * Check if required Supabase environment variables are set.
 * Returns true if both are present, false otherwise.
 */
export function hasSupabaseEnvVars(): boolean {
  return !!(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
  );
}

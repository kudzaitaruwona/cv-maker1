/**
 * Utility functions for constructing redirect URLs for Supabase authentication.
 * Handles different environments (local, preview, production) safely.
 */

/**
 * Get the application origin URL for redirect purposes.
 * Works in both server and client contexts.
 * 
 * For server-side: Uses environment variables
 * For client-side: Uses window.location.origin
 */
export function getRedirectOrigin(): string {
  // Client-side (browser)
  if (typeof window !== "undefined") {
    return window.location.origin;
  }

  // Server-side: Use Vercel environment variables
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  }

  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  // Local development fallback
  return "http://localhost:3000";
}

/**
 * Construct a redirect URL for Supabase authentication flows.
 * @param path - The path to redirect to (e.g., "/dashboard", "/auth/update-password")
 * @returns Full URL for redirect
 */
export function getRedirectUrl(path: string): string {
  const origin = getRedirectOrigin();
  // Ensure path starts with /
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${origin}${normalizedPath}`;
}

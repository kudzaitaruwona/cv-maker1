import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // cacheComponents: true, // Removed: Incompatible with force-dynamic routes and causes memory issues on Vercel with Next.js 16
};

export default nextConfig;

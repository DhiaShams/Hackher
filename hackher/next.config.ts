import type { NextConfig } from "next";

// Note: next-pwa is not compatible with Turbopack (Next.js 16+)
// For PWA support, we'll need to wait for next-pwa updates or use webpack mode
// To use webpack: npm run dev -- --webpack

const nextConfig: NextConfig = {
  // reactStrictMode: true, // Default is true
};

export default nextConfig;

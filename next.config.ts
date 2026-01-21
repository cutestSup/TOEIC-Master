import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [],
  },
  // PWA optimizations
  compress: true,
  poweredByHeader: false,
  // Optimize fonts
  optimizeFonts: true,
};

export default nextConfig;

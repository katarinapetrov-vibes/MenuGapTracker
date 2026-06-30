import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  basePath: '/MenuGapTracker',
  assetPrefix: '/MenuGapTracker',
  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
  },
  experimental: {
    optimizePackageImports: [
      'date-fns',
      'framer-motion',
      'recharts',
    ],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;

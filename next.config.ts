import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  // Ensure the base path matches the GitHub repo name for Pages
  basePath: '/linkedin-optimizer-pro',
  assetPrefix: '/linkedin-optimizer-pro/',
};

export default nextConfig;

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  basePath: '/linkedin-optimizer-pro',
  assetPrefix: '/linkedin-optimizer-pro/',
  trailingSlash: true, // Crucial for static hosting on GitHub Pages
};

export default nextConfig;

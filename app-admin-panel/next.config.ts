import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**.r2.cloudflarestorage.com' },
      { protocol: 'https', hostname: 'picsum.photos' },
      ...(process.env.CDN_DOMAIN
        ? [{ protocol: 'https' as const, hostname: new URL(process.env.CDN_DOMAIN).hostname }]
        : []),
    ],
  },
};

export default nextConfig;

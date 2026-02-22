import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ['@neondatabase/serverless', '@prisma/adapter-neon'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
};

export default nextConfig;

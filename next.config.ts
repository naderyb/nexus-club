import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "via.placeholder.com",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com", // For Cloudinary images
      },
      {
        protocol: "https",
        hostname: "nexus-admin-bay.vercel.app", // Your admin panel domain
      },
      {
        protocol: "http",
        hostname: "localhost", // For local development
        port: "3001", // Your API port
      },
    ],
  },

  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "https://nexus-admin-bay.vercel.app/api/:path*",
      },
    ];
  },
};

export default nextConfig;

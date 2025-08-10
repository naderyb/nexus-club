import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [
      "nexus-admin-bay.vercel.app",
      "avatars.githubusercontent.com",
      "lh3.googleusercontent.com",
    ],
  },

  typescript: {
    // ✅ Allow production builds even if there are type errors
    ignoreBuildErrors: true,
  },

  eslint: {
    // ✅ Skip ESLint checks during build
    ignoreDuringBuilds: true,
  },

  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "https://nexus-admin-bay.vercel.app/api/:path*", // proxy to your backend
      },
    ];
  },
};

export default nextConfig;

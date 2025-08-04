import type { NextConfig } from "next";

const nextConfig: NextConfig = {

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

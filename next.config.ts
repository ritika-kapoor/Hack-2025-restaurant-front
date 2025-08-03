import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:8080/api/:path*',
      },
      {
        source: '/store/:path*',
        destination: 'http://localhost:8080/store/:path*',
      },
    ];
  },
};

export default nextConfig;

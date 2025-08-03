import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:8080/api/:path*',
      },
      {
        source: '/store/shopRegister',
        destination: 'http://localhost:8080/store/shopRegister',
      },
    ];
  },
};

export default nextConfig;

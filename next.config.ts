import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'pub-608156fee9814c35ad00d461a390e841.r2.dev',
        port: '',
        pathname: '/**',
      },
    ],
  },
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

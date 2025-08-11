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
      // ニュース画像用のドメイン設定
      {
        protocol: 'https',
        hostname: 'newsatcl-pctr.c.yimg.jp',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.yimg.jp',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.yahoo.co.jp',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.asahi.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.nikkei.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.sankei.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.mainichi.jp',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.kyodo.co.jp',
        port: '',
        pathname: '/**',
      },
      // その他の一般的なニュースサイト
      {
        protocol: 'https',
        hostname: '*.jiji.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.reuters.com',
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

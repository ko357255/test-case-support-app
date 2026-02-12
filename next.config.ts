import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  devIndicators: false, // 開発モードのインジケーターを無効化
  // next/image の外部画像許可設定
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
      },
    ],
  },
};

export default nextConfig;

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.klinikease.com.tr',
      },
      {
        protocol: 'https',
        hostname: 'klinikease.com.tr',
      },
      {
        protocol: 'https',
        hostname: 'storage.googleapis.com',
        port: '',
        pathname: '/klinik_ease/**',
      },
    ],
  }
};

export default nextConfig;
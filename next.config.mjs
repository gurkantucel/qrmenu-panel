/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
          {
            protocol: 'https',
            hostname: 'dev-api.tricoreinnovation.com',
            port: '',
            pathname: '/uploads/**',
          },
          {
            protocol: 'https',
            hostname: 'storage.googleapis.com',
            port: '',
            pathname: '/klinikease/**',
          },
        ],
      }
};

export default nextConfig;
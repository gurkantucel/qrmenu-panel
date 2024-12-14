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
        ],
      }
};

export default nextConfig;

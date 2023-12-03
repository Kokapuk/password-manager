/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*',
      },
    ],
  },
  redirects: async () => [
    {
      source: '/',
      destination: '/passwords',
      permanent: true,
    },
  ],
  webpack: (config) => {
    config.resolve.fallback = {
      aws4: false,
    };

    return config;
  },
};

module.exports = nextConfig;

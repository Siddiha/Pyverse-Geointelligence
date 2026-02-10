/** @type {import('next').NextConfig} */
const nextConfig = {
  // Remove the conflicting serverComponentsExternalPackages from experimental
  // and remove transpilePackages to avoid conflict
  webpack: (config) => {
    // Handle canvas for server-side rendering
    config.externals = [...config.externals, { canvas: 'canvas' }];
    return config;
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
      },
    ],
  }
};

module.exports = nextConfig;
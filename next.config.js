/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['three']
  },
  transpilePackages: ['three'],
  webpack: (config) => {
    config.externals = [...config.externals, { canvas: 'canvas' }];
    return config;
  },
  images: {
    domains: ['images.unsplash.com', 'via.placeholder.com']
  }
};

module.exports = nextConfig;
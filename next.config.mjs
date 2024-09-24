/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config) => {
    config.module.rules.push({
      test: /mapbox-gl\.js$/,
      use: ['babel-loader'],
    });
    return config;
  },
  transpilePackages: ['mapbox-gl'],
};

module.exports = nextConfig;

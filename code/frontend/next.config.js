const basePath = '/app';

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: { basePath: basePath },
  basePath: basePath,
  assetPrefix: basePath,
  eslint: { dirs: ['.'] },
  output: 'standalone',
  images: {
    //Specifies the domains that are allowed for images when using the next/image component
    remotePatterns: [
      { protocol: 'https', hostname: 'firebasestorage.googleapis.com' },
    ],
  },
};

module.exports = nextConfig;

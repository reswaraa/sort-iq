/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // Disable ESLint during build process
  eslint: {
    ignoreDuringBuilds: true,
  },

  // Disable type checking during build for faster builds
  typescript: {
    ignoreBuildErrors: true,
  },

  // Your existing config settings like rewrites, etc.
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: process.env.NEXT_PUBLIC_API_URL + '/:path*',
      },
    ];
  },
};

module.exports = nextConfig;

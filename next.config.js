/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["your-supabase-storage-url.com"], // Add Supabase image storage domain
  },
  eslint: {
    ignoreDuringBuilds: true, // Disables ESLint during production builds
  },
};

module.exports = nextConfig;
  
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
<<<<<<< HEAD
  
=======
>>>>>>> 766de7fea7d108cccc619ff1a8809717e1525104

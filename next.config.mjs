/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true, // Speeds up the build
  },
  images: {
    unoptimized: true, // For canvas tools and client side processing
  }
};

export default nextConfig;

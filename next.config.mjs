/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },

  // 🔴 THIS FIX IS REQUIRED FOR pdf-parse
  experimental: {
    serverComponentsExternalPackages: ["pdf-parse"],
  },
}

export default nextConfig

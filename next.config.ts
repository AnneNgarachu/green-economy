import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    domains: ['via.placeholder.com'],
  },
  // Add transpilePackages for xlsx
  transpilePackages: ['xlsx'],
}

export default nextConfig
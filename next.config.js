/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    unoptimized: true,
    domains: [], // Add any image domains you need
    remotePatterns: [] // Add any remote patterns if needed
  },
  // Security headers
  headers: async () => [
    {
      source: '/:path*',
      headers: [
        {
          key: 'X-Frame-Options',
          value: 'DENY'
        },
        {
          key: 'X-Content-Type-Options',
          value: 'nosniff'
        },
        {
          key: 'Permissions-Policy',
          value: 'camera=(), microphone=(), geolocation=()'
        }
      ]
    }
  ],
  // Production optimizations
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  trailingSlash: true,
  experimental: {
    serverActions: {
      enabled: true
    }
  }
}

module.exports = nextConfig

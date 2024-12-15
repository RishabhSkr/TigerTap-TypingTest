/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  swcMinify: true,
  images: {
    unoptimized: true,
    domains: [], // Add any image domains you need
    remotePatterns: [] // Add any remote patterns if needed
  },
  typescript: {
    // Instead of ignoring errors, let's handle them properly
    // ignoreBuildErrors: true,
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
  
  // Environment configuration
  env: {
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  }
}

module.exports = nextConfig

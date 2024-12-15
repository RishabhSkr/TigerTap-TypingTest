import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: '/api/',
    },
    sitemap: 'https://tigertap.vercel.app/sitemap.xml',
    host: 'https://tigertap.vercel.app',
  }
}
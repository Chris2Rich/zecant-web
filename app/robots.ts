import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/app/', '/api/']
    },
    sitemap: 'https://zecant.com/sitemap.xml',
    host: 'https://zecant.com'
  }
}

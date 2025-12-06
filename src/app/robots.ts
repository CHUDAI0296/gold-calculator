import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: '*', allow: '/' }
    ],
    sitemap: 'https://www.goldcalculator.click/sitemap.xml',
    host: 'https://www.goldcalculator.click'
  }
}


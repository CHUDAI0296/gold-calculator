import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const host = 'https://www.goldcalculator.click'
  const disallow = [
    '/about','/contact','/sitemap','/gold-education','/silver-guide','/gold-history',
    '/investment-guide','/refining-services','/dealer-program','/coin-melt-values',
    '/live-karat-prices','/blog','/faq','/privacy'
  ]
  return {
    rules: [
      { userAgent: '*', allow: '/', disallow }
    ],
    sitemap: `${host}/sitemap.xml`,
    host
  }
}
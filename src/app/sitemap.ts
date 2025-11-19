import type { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://www.goldcalculator.click'
  const now = new Date()
  const urls = [
    { url: `${base}/`, changeFrequency: 'daily' as const, priority: 1.0 },
    { url: `${base}/market`, changeFrequency: 'hourly' as const, priority: 0.9 },
    { url: `${base}/calculator`, changeFrequency: 'weekly' as const, priority: 0.9 },
    { url: `${base}/karat-kalculator`, changeFrequency: 'weekly' as const, priority: 0.8 },
    { url: `${base}/metals`, changeFrequency: 'hourly' as const, priority: 0.8 },
    { url: `${base}/news`, changeFrequency: 'hourly' as const, priority: 0.8 },
    { url: `${base}/faq`, changeFrequency: 'monthly' as const, priority: 0.7 },
    { url: `${base}/about`, changeFrequency: 'monthly' as const, priority: 0.6 },
    { url: `${base}/contact`, changeFrequency: 'monthly' as const, priority: 0.5 },
    { url: `${base}/privacy`, changeFrequency: 'yearly' as const, priority: 0.4 },
    { url: `${base}/gold-education`, changeFrequency: 'monthly' as const, priority: 0.6 },
    { url: `${base}/silver-guide`, changeFrequency: 'monthly' as const, priority: 0.6 },
    { url: `${base}/gold-history`, changeFrequency: 'monthly' as const, priority: 0.6 },
    { url: `${base}/investment-guide`, changeFrequency: 'monthly' as const, priority: 0.6 }
  ]
  return urls.map(u => ({ ...u, lastModified: now }))
}
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
    { url: `${base}/news`, changeFrequency: 'hourly' as const, priority: 0.8 }
  ]
  return urls.map(u => ({ ...u, lastModified: now }))
}
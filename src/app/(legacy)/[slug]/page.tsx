import React from 'react'
import JsonLd from '@/components/JsonLd'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

const titles: Record<string, string> = {
  'about': 'About Us',
  'contact': 'Contact Us',
  'sitemap': 'HTML Sitemap',
  'gold-education': 'Gold Education',
  'silver-guide': 'Silver Market Analysis',
  'gold-history': 'Gold Price History',
  'investment-guide': 'Investment Guide',
  'refining-services': 'Refining Services',
  'dealer-program': 'Dealer Program',
  'coin-melt-values': 'Coin Melt Values',
  'live-karat-prices': 'Live Karat Prices',
  'blog': 'Blog',
  'faq': 'FAQ',
  'privacy': 'Privacy Policy'
}

const descriptions: Record<string, string> = {
  'about': 'Learn about Gold Calculator and our mission to provide accurate, real-time pricing tools for precious metals.',
  'contact': 'Get in touch with the Gold Calculator team for support, feedback or partnership inquiries.',
  'sitemap': 'Browse all pages of Gold Calculator including calculators, market charts, news and resources.',
  'gold-education': 'Understand karat, purity, troy ounce, spot price and more with our beginner-friendly gold education.',
  'silver-guide': 'Silver market overview, live pricing basics and investment considerations for new and seasoned investors.',
  'gold-history': 'Explore historical gold price trends and key events that moved the market over time.',
  'investment-guide': 'Practical tips for buying and selling gold, from spot price to premiums and storage.',
  'refining-services': 'Learn how refining fees impact scrap payouts and how to optimize your returns.',
  'dealer-program': 'Tools and pricing for dealers and buyers who need reliable real-time quotes.',
  'coin-melt-values': 'Check melt values for popular gold and silver coins using live market prices.',
  'live-karat-prices': 'See live karat-based gold prices for 10K, 14K, 18K, 22K and 24K.',
  'blog': 'News, tutorials and insights about gold pricing, calculators and precious metals.',
  'faq': 'Answers to common questions about our calculator, live prices and usage.',
  'privacy': 'Read how we collect, use and protect your data on Gold Calculator.'
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const slug = params.slug
  const title = titles[slug] ? `${titles[slug]} – Gold Calculator` : 'Gold Calculator'
  const description = descriptions[slug] || 'Gold pricing tools, calculators and market resources.'
  return {
    title,
    description,
    alternates: { canonical: `https://www.goldcalculator.click/${encodeURIComponent(slug)}` },
    robots: { index: false, follow: true, googleBot: { index: false, follow: true } }
  }
}

export default function LegacyPage({ params }: { params: { slug: string } }){
  const blocked = new Set(['coin-melt-values','live-karat-prices','refining-services','dealer-program','blog','sitemap'])
  if (blocked.has(params.slug)) return notFound()
  const title = titles[params.slug] || 'Page'
  const description = descriptions[params.slug] || 'Gold pricing tools, calculators and market resources.'
  const url = `https://www.goldcalculator.click/${encodeURIComponent(params.slug)}`
  return (
    <div className="container py-5">
      <JsonLd type="webpage" data={{ name: title, description, url }} />
      <JsonLd type="breadcrumbs" data={{ items: [ { name:'Home', url:'/' }, { name: title, url:`/${params.slug}` } ] }} />
      <h1 className="text-center mb-4">{title}</h1>
      <div className="card">
        <div className="card-body">
          <p className="text-muted mb-3">This page has been rebuilt using the new site style. Content will be updated continuously.</p>
          <ul>
            <li>Real-time prices powered by `/api/spot` and `/api/timeseries`</li>
            <li>Unified display mode toggle across pages (现货/CFD)</li>
            <li>Consistent layout and styling with the new theme</li>
          </ul>
          <p className="mt-3">Looking for calculations? Try the <a href="/calculator">Gold Calculator</a> or <a href="/karat-kalculator">Karat Kalculator</a>.</p>
        </div>
      </div>
    </div>
  )
}
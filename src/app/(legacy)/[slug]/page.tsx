import React from 'react'
import JsonLd from '@/components/JsonLd'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import CoinMeltCalculator from '@/components/CoinMeltCalculator'

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
  'coin-melt-values': 'Check silver coin melt value and gold coin melt value using live market prices.',
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
    robots: slug==='coin-melt-values' ? { index: true, follow: true, googleBot: { index: true, follow: true } } : { index: false, follow: true, googleBot: { index: false, follow: true } }
  }
}

export default function LegacyPage({ params }: { params: { slug: string } }){
  const blocked = new Set(['live-karat-prices','refining-services','dealer-program','blog','sitemap'])
  if (blocked.has(params.slug)) return notFound()
  const title = titles[params.slug] || 'Page'
  const description = descriptions[params.slug] || 'Gold pricing tools, calculators and market resources.'
  const url = `https://www.goldcalculator.click/${encodeURIComponent(params.slug)}`
  if (params.slug === 'coin-melt-values') {
    return (
      <div className="container py-5">
        <JsonLd type="webpage" data={{ name: title, description, url, keywords: ["silver coin melt value", "gold coin melt value"] }} />
        <JsonLd type="breadcrumbs" data={{ items: [ { name:'Home', url:'/' }, { name: title, url:`/${params.slug}` } ] }} />
        <h1 className="text-center mb-4">Coin Melt Values</h1>
        <p className="mb-2">Find silver coin melt value using live silver spot prices and known metal content.</p>
        <p className="mb-4">Estimate gold coin melt value by purity and weight with real‑time gold price data.</p>
        <div className="row g-4 mb-4">
          <div className="col-md-6">
            <div className="card h-100">
              <div className="card-body">
                <h2 className="h6">Common Metal Content</h2>
                <ul className="mb-0">
                  <li><strong>90% U.S. Silver Coins</strong>: 0.715 troy oz silver per $1 face</li>
                  <li><strong>40% U.S. Half Dollars</strong> (1965–1970): 0.1479 troy oz silver each</li>
                  <li><strong>U.S. Gold Coins</strong> (common types): purity varies (90% / .9167 / .9999)</li>
                  <li><strong>Sterling Silver</strong>: 92.5% pure silver</li>
                </ul>
                <div className="small text-muted mt-2">Data is indicative; always confirm specific series, mint, and year details.</div>
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="card h-100">
              <div className="card-body">
                <h2 className="h6">Calculate Melt Value</h2>
                <ol className="mb-0">
                  <li>Find the coin's metal content and purity</li>
                  <li>Convert weight to troy ounces</li>
                  <li>Multiply by current spot price</li>
                  <li>Optionally deduct refining fees for scrap scenarios</li>
                </ol>
                <div className="mt-3">
                  <a href="/calculator" className="btn btn-primary btn-sm me-2">Gold Calculator</a>
                  <a href="/metals" className="btn btn-outline-primary btn-sm">Silver & Platinum Calculator</a>
                </div>
              </div>
            </div>
          </div>
        </div>
        <CoinMeltCalculator />
        <div className="alert alert-info mt-4" role="alert">For multiple items, try our <a href="/multi-calculator.html" className="alert-link">Batch Calculator</a>.</div>
      </div>
    )
  }
  return (
    <div className="container py-5">
      <JsonLd type="webpage" data={{ name: title, description, url }} />
      <JsonLd type="breadcrumbs" data={{ items: [ { name:'Home', url:'/' }, { name: title, url:`/${params.slug}` } ] }} />
      <h1 className="text-center mb-4">{title}</h1>
      <div className="card">
        <div className="card-body">
          <div className="text-muted mb-3">This page has been rebuilt using the new site style. Content will be updated continuously.</div>
          <ul>
            <li>Real-time prices powered by `/api/spot` and `/api/timeseries`</li>
            <li>Unified display mode toggle across pages (Spot/CFD)</li>
            <li>Consistent layout and styling with the new theme</li>
          </ul>
          <div className="mt-3">Looking for calculations? Try the <a href="/calculator">Gold Calculator</a> or <a href="/karat-kalculator">Karat Kalculator</a>.</div>
        </div>
      </div>
    </div>
  )
}

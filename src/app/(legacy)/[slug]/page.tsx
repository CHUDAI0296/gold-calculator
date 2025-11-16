import React from 'react'
import JsonLd from '@/components/JsonLd'

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

export default function LegacyPage({ params }: { params: { slug: string } }){
  const title = titles[params.slug] || 'Page'
  return (
    <div className="container py-5">
      <JsonLd type="website" />
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
import React from 'react'
import type { Metadata } from 'next'
import JsonLd from '@/components/JsonLd'

export const metadata: Metadata = {
  title: 'Blog – Gold Calculator',
  description: 'Gold market insights, pricing tips, and calculator updates.',
  alternates: { canonical: 'https://www.goldcalculator.click/blog' },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } }
}

export default function BlogPage(){
  return (
    <div className="container py-5">
      <JsonLd type="webpage" data={{ "@type":"Blog", name: 'Gold Calculator Blog', description: 'Gold market insights, pricing tips, and calculator updates.', url: 'https://www.goldcalculator.click/blog', keywords: ['gold bars weight','14k gold worth per gram','last ten years gold rate','coin melt value'] }} />
      <JsonLd type="breadcrumbs" data={{ items: [ { name:'Home', url:'/' }, { name:'Blog', url:'/blog' } ] }} />
      <h1 className="text-center mb-4">Blog</h1>
      <div className="row g-4">
        <div className="col-md-4">
          <div className="card h-100">
            <div className="card-body">
              <h2 className="h5 mb-2">Understanding gold bars weight</h2>
              <img src="/images/blog/gold-bars.svg" alt="Gold bars weight examples" className="img-fluid rounded mb-3" />
              <p className="mb-2">Common sizes include 1 oz, 50 g, 100 g and 1 kg. To compare value consistently across regions, convert everything to troy ounces (31.1035 g each). Bars are typically .999 or .9999 fine; jewelry pieces vary by karat.</p>
              <p className="mb-3">When estimating, use live spot and multiply by fine content. For bars sold with premium, add or subtract using the calculator’s premium/discount field to reflect market conditions and dealer spreads.</p>
              <a className="btn btn-outline-warning btn-sm" href="/calculator">Estimate with Calculator</a>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card h-100">
            <div className="card-body">
              <h2 className="h5 mb-2">How much is 14K gold worth per gram?</h2>
              <img src="/images/blog/14k-per-gram.svg" alt="14K gold worth per gram" className="img-fluid rounded mb-3" />
              <p className="mb-2">14K purity is 58.5%, meaning each gram contains 0.585 g of pure gold. Set the calculator to grams, select 14K, and the tool returns an instant per‑gram estimate using live spot prices.</p>
              <p className="mb-3">For sell quotes, local buyers may deduct refining fees or apply spreads for smaller lots. Enter a negative premium (e.g., -8%) to approximate a buy price in your market and compare offers fairly.</p>
              <a className="btn btn-outline-warning btn-sm" href="/calculator">Check Per‑Gram Value</a>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card h-100">
            <div className="card-body">
              <h2 className="h5 mb-2">Last ten years gold rate explained</h2>
              <img src="/images/blog/ten-year-rate.svg" alt="Last ten years gold rate" className="img-fluid rounded mb-3" />
              <p className="mb-2">Over ten years, gold reacts to policy cycles, USD strength and real yields. The interaction between inflation expectations and central bank activity often drives multi‑year trends.</p>
              <p className="mb-3">Use extended charts to inspect drawdowns and breakouts, then align purchase plans with moving averages and macro signals. For short‑term views, monitor futures daily pivot points and news flow.</p>
              <a className="btn btn-outline-secondary btn-sm" href="/market">Open Market Charts</a>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-4 mt-4">
        <div className="col-md-6">
          <div className="card h-100">
            <div className="card-body">
              <h2 className="h5 mb-2">Silver coin melt value basics</h2>
              <p className="mb-2">For 90% U.S. silver coins, a $1 face value contains roughly 0.715 troy oz of silver. Multiply by spot to estimate melt, and adjust for dealer spreads as needed.</p>
              <p className="mb-3">Circulated wear and specific series can slightly change fine content. Always confirm details for halves, quarters and dimes, and compare quotes in your local currency.</p>
              <a className="btn btn-outline-primary btn-sm" href="/coin-melt-values">Go to Coin Melt Values</a>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card h-100">
            <div className="card-body">
              <h2 className="h5 mb-2">Gold coin melt value vs. collectible premium</h2>
              <p className="mb-2">Melt value depends on purity and weight; collectible premium adds rarity, condition and demand. For modern bullion, premiums track market supply; vintage coins can differ greatly.</p>
              <p className="mb-3">If you plan to sell, obtain both a melt‑based quote and a numismatic evaluation when applicable. Use live spot math first to anchor expectations and compare fair offers.</p>
              <a className="btn btn-outline-primary btn-sm" href="/coin-melt-values">See Melt Value Guide</a>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-4 mt-4">
        <div className="col-md-6">
          <div className="card h-100">
            <div className="card-body">
              <h2 className="h5 mb-2">How much is a Krugerrand worth?</h2>
              <img src="/images/blog/krugerrand.svg" alt="Krugerrand melt and value" className="img-fluid rounded mb-3" />
              <p className="mb-2">Krugerrand is 22K (~91.67%) gold. Enter weight and select 22K in the calculator to estimate melt value from live spot; add premium to reflect typical market pricing.</p>
              <p className="mb-3">Compare buy/sell spreads across dealers, and consider lot size and condition. For fast quotes, start with per‑ounce melt, then adjust by prevailing premiums.</p>
              <a className="btn btn-outline-warning btn-sm" href="/calculator">Estimate Krugerrand Value</a>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card h-100">
            <div className="card-body">
              <h2 className="h5 mb-2">Futures daily pivot point dashboard</h2>
              <img src="/images/blog/pivot-dashboard.svg" alt="Futures daily pivot points" className="img-fluid rounded mb-3" />
              <p className="mb-2">Daily pivots (P, R1/R2, S1/S2) offer intraday levels to plan entries, exits and risk. Combine pivots with RSI/MACD and trend context to avoid chasing volatility.</p>
              <p className="mb-3">Use the market page for price context and news flow, then align trades around key levels with tight risk controls. Long‑term investors can ignore intraday noise and focus on macro drivers.</p>
              <a className="btn btn-outline-secondary btn-sm" href="/market">Open Market Charts</a>
            </div>
          </div>
        </div>
      </div>

      <JsonLd type="webpage" data={{ "@type":"BlogPosting", headline: 'Understanding gold bars weight', image: 'https://www.goldcalculator.click/images/blog/gold-bars.svg', datePublished: new Date().toISOString(), author: { "@type":"Organization", name: 'Gold Calculator' }, mainEntityOfPage: 'https://www.goldcalculator.click/blog' }} />
      <JsonLd type="webpage" data={{ "@type":"BlogPosting", headline: 'How much is 14K gold worth per gram?', image: 'https://www.goldcalculator.click/images/blog/14k-per-gram.svg', datePublished: new Date().toISOString(), author: { "@type":"Organization", name: 'Gold Calculator' }, mainEntityOfPage: 'https://www.goldcalculator.click/blog' }} />
      <JsonLd type="webpage" data={{ "@type":"BlogPosting", headline: 'Last ten years gold rate explained', image: 'https://www.goldcalculator.click/images/blog/ten-year-rate.svg', datePublished: new Date().toISOString(), author: { "@type":"Organization", name: 'Gold Calculator' }, mainEntityOfPage: 'https://www.goldcalculator.click/blog' }} />
      <JsonLd type="webpage" data={{ "@type":"BlogPosting", headline: 'How much is a Krugerrand worth?', image: 'https://www.goldcalculator.click/images/blog/krugerrand.svg', datePublished: new Date().toISOString(), author: { "@type":"Organization", name: 'Gold Calculator' }, mainEntityOfPage: 'https://www.goldcalculator.click/blog' }} />
      <JsonLd type="webpage" data={{ "@type":"BlogPosting", headline: 'Futures daily pivot point dashboard', image: 'https://www.goldcalculator.click/images/blog/pivot-dashboard.svg', datePublished: new Date().toISOString(), author: { "@type":"Organization", name: 'Gold Calculator' }, mainEntityOfPage: 'https://www.goldcalculator.click/blog' }} />
    </div>
  )
}

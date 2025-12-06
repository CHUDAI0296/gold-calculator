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
      <JsonLd type="webpage" data={{ "@type":"Blog", name: 'Gold Calculator Blog', description: 'Gold market insights, pricing tips, and calculator updates.', url: 'https://www.goldcalculator.click/blog', keywords: ['gold bars weight','14k gold worth per gram','last ten years gold rate'] }} />
      <JsonLd type="breadcrumbs" data={{ items: [ { name:'Home', url:'/' }, { name:'Blog', url:'/blog' } ] }} />
      <h1 className="text-center mb-4">Blog</h1>
      <div className="row g-4">
        <div className="col-md-4">
          <div className="card h-100">
            <div className="card-body">
              <h2 className="h5 mb-2">Understanding gold bars weight</h2>
              <p className="mb-3">Common sizes include 1 oz, 50 g, 100 g and 1 kg. Convert to troy ounces to compare value consistently.</p>
              <a className="btn btn-outline-warning btn-sm" href="/calculator">Estimate with Calculator</a>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card h-100">
            <div className="card-body">
              <h2 className="h5 mb-2">How much is 14K gold worth per gram?</h2>
              <p className="mb-3">14K purity is 58.5%. Select 14K and grams to see an instant per‑gram price based on live spot.</p>
              <a className="btn btn-outline-warning btn-sm" href="/calculator">Check Per‑Gram Value</a>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card h-100">
            <div className="card-body">
              <h2 className="h5 mb-2">Last ten years gold rate explained</h2>
              <p className="mb-3">View long‑term trends, policy cycles and real yields impact using extended charts.</p>
              <a className="btn btn-outline-secondary btn-sm" href="/market">Open Market Charts</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


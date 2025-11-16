import { Metadata } from 'next'
import JsonLd from '@/components/JsonLd'
import CurrentPriceBanner from '@/components/CurrentPriceBanner'

export const metadata: Metadata = {
  title: 'Silver Guide - Pricing, Purity and Valuation Basics',
  description: 'Learn how silver is priced, purity standards, and how to estimate value using live market prices.',
  alternates: { canonical: 'https://www.goldcalculator.click/silver-guide' }
}

export default function SilverGuide(){
  return (
    <div className="container py-5">
      <JsonLd type="website" />
      <h1 className="text-center mb-4">Silver Guide</h1>
      <div className="row g-4">
        <div className="col-lg-8">
          <div className="card">
            <div className="card-body">
              <h2 className="h5">Silver Purity</h2>
              <p>Common silver standards include Sterling Silver (92.5%) and Fine Silver (99.9%).</p>
              <h2 className="h5 mt-4">How Silver is Priced</h2>
              <p>Silver is quoted per troy ounce similar to gold. Use weight × purity × current price to estimate value.</p>
              <div className="mt-3">
                <a href="/metals" className="btn btn-secondary">Use Silver Calculator</a>
              </div>
            </div>
          </div>
        </div>
        <div className="col-lg-4">
          <div className="card mb-4">
            <div className="card-header bg-warning text-dark">
              <h3 className="h6 mb-0">Current Gold Price</h3>
            </div>
            <div className="card-body">
              <CurrentPriceBanner />
            </div>
          </div>
          <div className="card">
            <div className="card-body">
              <h3 className="h6">Related</h3>
              <ul className="mb-0">
                <li><a href="/market">Market Charts</a></li>
                <li><a href="/karat-kalculator">Karat Kalculator</a></li>
                <li><a href="/metals">Other Metals</a></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
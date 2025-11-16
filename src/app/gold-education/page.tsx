import { Metadata } from 'next'
import JsonLd from '@/components/JsonLd'
import CurrentPriceBanner from '@/components/CurrentPriceBanner'

export const metadata: Metadata = {
  title: 'Gold Education - Learn about Gold Purity, Pricing, and Valuation',
  description: 'Comprehensive guide to gold karats, purity, pricing, and how to estimate value using live market prices.',
  alternates: { canonical: 'https://www.goldcalculator.click/gold-education' }
}

export default function GoldEducation(){
  return (
    <div className="container py-5">
      <JsonLd type="website" />
      <h1 className="text-center mb-4">Gold Education</h1>
      <div className="row g-4">
        <div className="col-lg-8">
          <div className="card">
            <div className="card-body">
              <h2 className="h5">Understanding Karat and Purity</h2>
              <p>Karat indicates the proportion of pure gold in an alloy. 24K is pure gold. Common jewelry karats include 22K, 18K, 14K, and 10K.</p>
              <ul>
                <li>24K: 99.9% purity</li>
                <li>22K: 91.6% purity</li>
                <li>18K: 75.0% purity</li>
                <li>14K: 58.5% purity</li>
                <li>10K: 41.7% purity</li>
              </ul>
              <h2 className="h5 mt-4">Price and Market Basics</h2>
              <p>Gold is priced per troy ounce. Our site uses live prices from multiple sources and supports both Spot and CFD display modes for consistency with common charting tools.</p>
              <p>For valuation, multiply weight (in troy ounces) by purity and the current price.</p>
              <div className="mt-3">
                <a href="/calculator" className="btn btn-warning">Try Gold Calculator</a>
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
              <h3 className="h6">Quick Links</h3>
              <ul className="mb-0">
                <li><a href="/market">Market Charts</a></li>
                <li><a href="/karat-kalculator">Karat Kalculator</a></li>
                <li><a href="/metals">Silver & Platinum</a></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
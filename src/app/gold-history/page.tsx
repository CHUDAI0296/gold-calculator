import { Metadata } from 'next'
import JsonLd from '@/components/JsonLd'
import CurrentPriceBanner from '@/components/CurrentPriceBanner'

export const metadata: Metadata = {
  title: 'Gold History - Historical Gold Prices and Context',
  description: 'Overview of historical gold prices, key market events, and links to charts and valuation tools.',
  alternates: { canonical: 'https://www.goldcalculator.click/gold-history' }
}

export default function GoldHistory(){
  return (
    <div className="container py-5">
      <JsonLd type="website" />
      <h1 className="text-center mb-4">Gold Price History</h1>
      <div className="row g-4">
        <div className="col-lg-8">
          <div className="card">
            <div className="card-body">
              <h2 className="h5">Long-term Trends</h2>
              <p>Gold prices have moved through cycles driven by inflation, currency policy, and risk appetite. Use our charts to explore trends.</p>
              <div className="mt-3">
                <a href="/market" className="btn btn-primary">View Charts</a>
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
                <li><a href="/calculator">Gold Calculator</a></li>
                <li><a href="/karat-kalculator">Karat Kalculator</a></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
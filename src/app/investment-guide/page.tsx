import { Metadata } from 'next'
import JsonLd from '@/components/JsonLd'
import CurrentPriceBanner from '@/components/CurrentPriceBanner'

export const metadata: Metadata = {
  title: 'Investment Guide - Using Live Prices to Value Precious Metals',
  description: 'Beginner-friendly investment guide covering live pricing, spreads, and basic valuation workflows for precious metals.',
  alternates: { canonical: 'https://www.goldcalculator.click/investment-guide' }
}

export default function InvestmentGuide(){
  return (
    <div className="container py-5">
      <JsonLd type="website" />
      <h1 className="text-center mb-4">Investment Guide</h1>
      <div className="row g-4">
        <div className="col-lg-8">
          <div className="card">
            <div className="card-body">
              <h2 className="h5">Basics</h2>
              <p>Understand live pricing, bid/ask spreads, and how to estimate fair value for different karats and items.</p>
              <h2 className="h5 mt-4">Workflow</h2>
              <ol>
                <li>Measure weight and select units.</li>
                <li>Determine purity (karat).</li>
                <li>Use current price and apply premium/discount.</li>
              </ol>
              <div className="mt-3">
                <a href="/calculator" className="btn btn-warning">Open Gold Calculator</a>
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
              <h3 className="h6">More Tools</h3>
              <ul className="mb-0">
                <li><a href="/market">Market Charts</a></li>
                <li><a href="/karat-kalculator">Karat Kalculator</a></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
import React from 'react';
import { Metadata } from 'next';
import JsonLd from '@/components/JsonLd';
import CurrentPriceBanner from '@/components/CurrentPriceBanner';
import DisplayModeToggle from '@/components/DisplayModeToggle';

export const metadata: Metadata = {
  title: 'How much is my gold worth today? | Gold Calculator',
  description: 'Enter weight and karat to see today’s value. Quick answers for 1 oz worth, 18K per gram and market trends.',
  alternates: { canonical: 'https://www.goldcalculator.click' },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } }
};

export const dynamic = 'force-dynamic';
export default async function Home() {
  async function getInitialPrice(){
    try {
      const base = process.env.NEXT_PUBLIC_BASE_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000')
      const r = await fetch(`${base}/api/spot/gold`, { cache: 'no-store' })
      const d = await r.json()
      return d && d.price ? d.price : null
    } catch { return null }
  }
  const initialPrice = await getInitialPrice()
  return (
    <React.Fragment>
      <JsonLd type="website" />
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container text-center py-5">
          <h1 className="display-4">How much is my gold worth today?</h1>
          <p className="lead">Enter weight and karat to get a real‑time answer</p>
          <CurrentPriceBanner initialPrice={initialPrice ?? undefined} />
          <div className="d-flex justify-content-center"><DisplayModeToggle /></div>
          <div className="row justify-content-center">
            <div className="col-md-4 mb-3">
              <a href="/calculator" className="btn btn-primary btn-lg w-100">Gold Calculator</a>
            </div>
            <div className="col-md-4 mb-3">
              <a href="/metals" className="btn btn-outline-primary btn-lg w-100">Silver & Platinum</a>
            </div>
            <div className="col-md-4 mb-3">
              <a href="/market" className="btn btn-outline-secondary btn-lg w-100">Market Charts</a>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section py-5 bg-light">
        <div className="container">
          <h2 className="text-center mb-5">Why Use Our Gold Calculator</h2>
          <div className="row">
            <div className="col-md-4 mb-4">
              <div className="feature-box text-center p-4">
                <i className="fas fa-tachometer-alt feature-icon mb-3" aria-hidden="true"></i>
                <h3>Real-Time Prices</h3>
                <p>Our calculator uses up-to-date gold prices to provide accurate valuations.</p>
              </div>
            </div>
            <div className="col-md-4 mb-4">
              <div className="feature-box text-center p-4">
                <i className="fas fa-balance-scale feature-icon mb-3" aria-hidden="true"></i>
                <h3>Multiple Karat Options</h3>
                <p>Calculate values for all gold purities from 8K to 24K.</p>
              </div>
            </div>
            <div className="col-md-4 mb-4">
              <div className="feature-box text-center p-4">
                <i className="fas fa-mobile-alt feature-icon mb-3" aria-hidden="true"></i>
                <h3>Mobile Friendly</h3>
                <p>Use our calculator on any device, anytime, anywhere.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Calculators Section */}
      <section className="calculators-section py-5">
        <div className="container">
          <h2 className="text-center mb-5">Our Precious Metal Calculators</h2>
          <div className="row">
            <div className="col-md-4 mb-4">
              <div className="card h-100">
                <div className="card-header bg-warning text-dark">
                  <h3 className="mb-0">Gold Calculator</h3>
                </div>
                <div className="card-body">
                  <p>Calculate item value by weight and karat with live market prices.</p>
                  <ul>
                    <li>8K to 24K options</li>
                    <li>Multiple weight units</li>
                    <li>Refining charges calculator</li>
                  </ul>
                  <div className="mt-4 d-grid">
                    <a href="/calculator" className="btn btn-warning">Use Gold Calculator</a>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-4 mb-4">
              <div className="card h-100">
                <div className="card-header bg-secondary text-white">
                  <h3 className="mb-0">Silver Calculator</h3>
                </div>
                <div className="card-body">
                  <p>Calculate the value of your sterling silver and other silver items.</p>
                  <ul>
                    <li>Sterling silver (92.5%)</li>
                    <li>Fine silver (99.9%)</li>
                    <li>Custom purity options</li>
                  </ul>
                  <div className="mt-4 d-grid">
                    <a href="/metals" className="btn btn-secondary">Use Silver Calculator</a>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-4 mb-4">
              <div className="card h-100">
                <div className="card-header bg-info text-white">
                  <h3 className="mb-0">Platinum Calculator</h3>
                </div>
                <div className="card-body">
                  <p>Calculate the value of your platinum jewelry and items.</p>
                  <ul>
                    <li>950 Platinum (95.0%)</li>
                    <li>900 Platinum (90.0%)</li>
                    <li>Custom purity options</li>
                  </ul>
                  <div className="mt-4 d-grid">
                    <a href="/metals#platinum" className="btn btn-info">Use Platinum Calculator</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Market Charts Section */}
      <section className="market-section py-5 bg-light">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-6">
              <h2>Track Precious Metal Prices</h2>
              <p>Stay informed with our interactive market charts. Monitor gold, silver, and platinum price trends over time to make informed decisions.</p>
              <ul>
                <li>Historical price charts</li>
                <li>Multiple time ranges (7 days to 1 year)</li>
                <li>Compare different metals</li>
                <li>Market analysis</li>
              </ul>
              <a href="/market" className="btn btn-primary">View Market Charts</a>
            </div>
            <div className="col-md-6">
              <div className="card">
                <div className="card-body text-center">
                  <h4>Precious Metal Price Trends</h4>
                  <div className="chart-preview">
                    <i className="fas fa-chart-line fa-5x my-4" style={{ color: 'var(--gold-primary)' }} role="img" aria-label="Precious metal price trend preview"></i>
                    <p>Interactive charts with historical data</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </React.Fragment>
  );
}

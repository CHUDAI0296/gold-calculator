import React from 'react';
import Script from 'next/script';
import { Metadata } from 'next';
import JsonLd from '@/components/JsonLd';
import CurrentPriceBanner from '@/components/CurrentPriceBanner';
import DisplayModeToggle from '@/components/DisplayModeToggle';

export const metadata: Metadata = {
  title: 'Instant Gold Value Calculator & Market Insights | Gold Calculator',
  description: 'Enter weight and karat to see today’s value. Quick answers for 1 oz worth, 18K per gram and market trends.',
  alternates: { canonical: 'https://www.goldcalculator.click' },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
  openGraph: {
    title: 'Instant Gold Value Calculator & Market Insights | Gold Calculator',
    description: 'Calculate gold value instantly by weight and karat with live prices. See 1 oz and 18K per gram now.',
    url: 'https://www.goldcalculator.click',
    siteName: 'Gold Calculator',
    type: 'website'
  },
  twitter: { card: 'summary', title: 'Gold Calculator – Instant Value', description: 'Get today’s gold price and 18K per gram instantly.' }
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
          <h1 className="display-4">Calculate Your Gold Value Instantly</h1>
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

      <section className="questions-section py-5">
        <div className="container">
          <div className="row">
            <div className="col-md-6 mb-4">
              <div className="card h-100">
                <div className="card-body">
                  <h2 className="mb-2">How do I calculate value?</h2>
                  <p>Enter weight and karat, then see today’s value using live prices.</p>
                  <a href="/calculator" className="btn btn-warning">Calculate Now</a>
                </div>
              </div>
            </div>
            <div className="col-md-6 mb-4">
              <div className="card h-100">
                <div className="card-body">
                  <h2 className="mb-2">How much is 18K worth per gram?</h2>
                  <p>Select 18K and grams to get a per‑gram price in seconds.</p>
                  <a href="/calculator" className="btn btn-outline-warning">Get 18K Price</a>
                </div>
              </div>
            </div>
            <div className="col-md-6 mb-4">
              <div className="card h-100">
                <div className="card-body">
                  <h2 className="mb-2">What's the value of 1 oz right now?</h2>
                  <p>Check real‑time charts with 24h high/low and key indicators.</p>
                  <a href="/market" className="btn btn-primary">View 1 oz Price</a>
                </div>
              </div>
            </div>
            <div className="col-md-6 mb-4">
              <div className="card h-100">
                <div className="card-body">
                  <h2 className="mb-2">How much are silver and platinum today?</h2>
                  <p>See live spot prices in USD/oz with quick updates.</p>
                  <a href="/metals" className="btn btn-outline-secondary">See Other Metals</a>
                </div>
              </div>
            </div>
            <div className="col-md-6 mb-4">
              <div className="card h-100">
                <div className="card-body">
                  <h2 className="mb-2">How much can I sell 1 oz for?</h2>
                  <p>Use the calculator with a discount to estimate real sell quotes.</p>
                  <a href="/calculator" className="btn btn-outline-warning">Estimate Sell Value</a>
                </div>
              </div>
            </div>
            <div className="col-md-6 mb-4">
              <div className="card h-100">
                <div className="card-body">
                  <h2 className="mb-2">Will prices hit $5000 an ounce?</h2>
                  <p>Explore long‑term trends, drivers and technicals on Market.</p>
                  <a href="/market" className="btn btn-primary">Explore Trends</a>
                </div>
              </div>
            </div>
            <div className="col-md-6 mb-4">
              <div className="card h-100">
                <div className="card-body">
                  <h2 className="mb-2">How much is 14K worth per gram?</h2>
                  <p>Select 14K in the calculator to see per‑gram pricing.</p>
                  <a href="/calculator" className="btn btn-outline-warning">Get 14K Price</a>
                </div>
              </div>
            </div>
            <div className="col-md-6 mb-4">
              <div className="card h-100">
                <div className="card-body">
                  <h2 className="mb-2">If I invested $1000 10 years ago, what’s it worth?</h2>
                  <p>Review historical charts and estimate using past spot and today’s price.</p>
                  <a href="/market" className="btn btn-primary">Check History</a>
                </div>
              </div>
            </div>
            <div className="col-md-6 mb-4">
              <div className="card h-100">
                <div className="card-body">
                  <h2 className="mb-2">Is a Costco bar worth it?</h2>
                  <p>Compare premiums vs spot and resale spreads before buying.</p>
                  <a href="/investment-guide" className="btn btn-outline-secondary">Compare Premiums</a>
                </div>
              </div>
            </div>
            <div className="col-md-6 mb-4">
              <div className="card h-100">
                <div className="card-body">
                  <h2 className="mb-2">How much is a Krugerrand worth?</h2>
                  <p>Gold Krugerrand value is based on weight and purity (22K ≈ 91.67%). Use the calculator to estimate today’s price.</p>
                  <a href="/calculator" className="btn btn-outline-warning">Check Krugerrand Value</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="faq-snippet-section py-5 bg-light">
        <div className="container">
          <div className="card">
            <div className="card-body">
              <h2 className="mb-4">Quick answers</h2>
              <div className="mb-3">
                <h2 className="h5">How do I calculate value?</h2>
                <p>Enter weight and karat, choose unit (g/oz/dwt), and get today’s value. Adjust with premium/discount if needed.</p>
              </div>
              <div className="mb-3">
                <h2 className="h5">How much is 18K worth per gram?</h2>
                <p>Select 18K and grams in the calculator to see a per‑gram price based on 58.5% purity and live spot.</p>
              </div>
              <div className="mb-2">
                <h2 className="h5">What's the value of 1 oz right now?</h2>
                <p>Check real‑time price and 24h high/low on the Market page; the calculator uses the same live data for estimates.</p>
              </div>
            </div>
          </div>
        </div>
        <Script id="home-faq-jsonld" type="application/ld+json" strategy="afterInteractive">
          {`
            {
              "@context": "https://schema.org",
              "@type": "FAQPage",
              "mainEntity": [
                {"@type":"Question","name":"How do I calculate value?","acceptedAnswer":{"@type":"Answer","text":"Enter weight and karat, choose unit (g/oz/dwt), and get today’s value. Adjust with premium/discount if needed."}},
                {"@type":"Question","name":"How much is 18K worth per gram?","acceptedAnswer":{"@type":"Answer","text":"Select 18K and grams in the calculator to see a per‑gram price based on 58.5% purity and live spot."}},
                {"@type":"Question","name":"What's the value of 1 oz right now?","acceptedAnswer":{"@type":"Answer","text":"Check real‑time price and 24h high/low on the Market page; the calculator uses the same live data for estimates."}},
                {"@type":"Question","name":"How much is a Krugerrand worth?","acceptedAnswer":{"@type":"Answer","text":"A Gold Krugerrand is 22K (~91.67% purity). Enter weight and select 22K to estimate today’s value using live spot prices."}}
              ]
            }
          `}
        </Script>
      </section>

      {/* Features Section */}
      <section className="features-section py-5 bg-light">
        <div className="container">
          <h2 className="text-center mb-5">How do I calculate item value?</h2>
          <div className="row">
            <div className="col-md-4 mb-4">
              <div className="feature-box text-center p-4">
                <i className="fas fa-tachometer-alt feature-icon mb-3" aria-hidden="true"></i>
                <h3>Real-Time Prices</h3>
                <p>Our calculator uses up-to-date spot prices to provide accurate valuations.</p>
              </div>
            </div>
            <div className="col-md-4 mb-4">
              <div className="feature-box text-center p-4">
                <i className="fas fa-balance-scale feature-icon mb-3" aria-hidden="true"></i>
                <h3>Multiple Karat Options</h3>
                <p>Calculate values for 8K–24K purities.</p>
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
          <h2 className="text-center mb-5">How much is 18K worth per gram?</h2>
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
              <h2>What's the value of 1 oz right now?</h2>
              <p>Stay informed with our interactive market charts. Monitor price trends for precious metals over time to make informed decisions.</p>
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

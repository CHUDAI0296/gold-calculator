import { Metadata } from 'next'
import JsonLd from '@/components/JsonLd'
import Script from 'next/script'

export const metadata: Metadata = {
  title: 'Gold Calculator FAQ – Quick Answers to Common Questions',
  description: 'Clear answers about live prices, karat, units, spot vs CFD, and how to use the calculator.',
  alternates: { canonical: 'https://www.goldcalculator.click/faq' },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } }
}

const faqs = [
  { q: 'What is today’s gold price?', a: 'We aggregate live market data to display today’s gold price in USD per troy ounce. Visit Market for real‑time charts and 24h high/low.' },
  { q: 'How do I calculate how much my gold is worth?', a: 'Enter weight, choose unit (g/oz/dwt), select karat, and optionally add a premium or discount. The result uses live prices and purity to estimate value.' },
  { q: 'What does the premium/discount field do?', a: 'It applies a percentage adjustment. Use positive values for premiums and negative values for discounts (e.g., −5%).' },
  { q: 'What units are supported?', a: 'Grams (g), troy ounces (oz), and pennyweights (dwt). We convert all inputs to troy ounces internally for consistent pricing.' },
  { q: 'What’s the difference between Spot and CFD?', a: 'Spot reflects physical market pricing; CFD is a derivatives quote with faster movements. Use Spot for physical valuation and CFD for trading context.' },
  { q: 'Why might a store quote differ from your result?', a: 'Stores add labor, brand premiums, and buy/sell spreads. Our figure is a market‑based estimate; use premium/discount to approximate real quotes.' },
  { q: 'Do you support silver and platinum?', a: 'Yes. See the Metals page for live silver and platinum prices (USD/oz).' },
  { q: 'Can I use this value for insurance or collateral?', a: 'It’s a helpful reference. Actual underwriting may use different appraisal methods; consult your provider for formal requirements.' },
  { q: 'Where do prices come from and how reliable are they?', a: 'We fetch from multiple sources with timeouts and fallback logic to reduce single‑source failures. See Market for details.' },
  { q: 'How often are prices updated?', a: 'We refresh frequently and prioritize recency. Some sections defer non‑critical requests for faster page loads on mobile.' }
]

function FaqJsonLd(){
  const data = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    'mainEntity': faqs.map(it => ({
      '@type': 'Question',
      'name': it.q,
      'acceptedAnswer': { '@type': 'Answer', 'text': it.a }
    }))
  }
  return (
    <Script id="faq-jsonld" type="application/ld+json" strategy="afterInteractive" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
  )
}

export default function Page(){
  return (
    <div className="container py-5">
      <JsonLd type="webpage" />
      <JsonLd type="breadcrumbs" data={{ items: [ { name:'Home', url:'/' }, { name:'FAQ', url:'/faq' } ] }} />
      <h1 className="text-center mb-4">Gold Calculator FAQ</h1>
      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-body">
              {faqs.map((it, i) => (
                <div key={i} className="mb-4">
                  <h2 className="h5 mb-2">{it.q}</h2>
                  <p>{it.a}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-4 d-flex gap-2">
            <a href="/calculator" className="btn btn-warning">Go to Calculator</a>
            <a href="/market" className="btn btn-primary">View Market Charts</a>
            <a href="/metals" className="btn btn-outline-secondary">See Silver & Platinum</a>
          </div>
        </div>
      </div>
      <FaqJsonLd />
    </div>
  )
}
import { Metadata } from 'next'
import JsonLd from '@/components/JsonLd'

export const metadata: Metadata = {
  title: 'About Us – Who We Are and Why Gold Calculator',
  description: 'Learn who we are, our mission, and how Gold Calculator helps you estimate value with live market prices.',
  alternates: { canonical: 'https://www.goldcalculator.click/about' },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } }
}

export default function Page(){
  return (
    <div className="container py-5">
      <JsonLd type="webpage" />
      <JsonLd type="breadcrumbs" data={{ items: [ { name:'Home', url:'/' }, { name:'About', url:'/about' } ] }} />
      <h1 className="text-center mb-4">Who are we?</h1>
      <div className="card">
        <div className="card-body">
          <p>Gold Calculator provides simple, reliable tools to estimate precious metal values using live market prices. We focus on clarity, speed, and practical answers.</p>
          <h2 className="h5 mt-3">Our mission</h2>
          <ul>
            <li>Deliver quick answers like today’s gold price and per‑gram values.</li>
            <li>Support common units and karats with transparent calculations.</li>
            <li>Offer market context through charts and curated headlines.</li>
          </ul>
          <h2 className="h5 mt-3">What you can do here</h2>
          <ul>
            <li>Calculate value by weight and karat in seconds.</li>
            <li>Check silver and platinum spot prices.</li>
            <li>Review market charts and news for timing and insight.</li>
          </ul>
          <div className="mt-3 d-flex gap-2">
            <a href="/calculator" className="btn btn-warning">Try the Calculator</a>
            <a href="/market" className="btn btn-primary">View Market Charts</a>
            <a href="/faq" className="btn btn-outline-secondary">Read FAQ</a>
          </div>
        </div>
      </div>
    </div>
  )
}
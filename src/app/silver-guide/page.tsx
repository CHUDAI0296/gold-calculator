import { Metadata } from 'next'
import JsonLd from '@/components/JsonLd'

export const metadata: Metadata = {
  title: 'Silver Guide – Live Pricing Basics and Considerations',
  description: 'Learn how silver pricing works, differences from gold, and practical tips for valuation and selling.',
  alternates: { canonical: 'https://www.goldcalculator.click/silver-guide' },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } }
}

export default function Page(){
  return (
    <div className="container py-5">
      <JsonLd type="webpage" />
      <JsonLd type="breadcrumbs" data={{ items: [ { name:'Home', url:'/' }, { name:'Silver Guide', url:'/silver-guide' } ] }} />
      <h1 className="text-center mb-4">Silver Guide</h1>
      <div className="card">
        <div className="card-body">
          <h2 className="h5">Spot vs retail</h2>
          <p>Silver spot is the base market price. Retail items include fabrication costs and premiums, which vary by product and demand.</p>
          <h2 className="h5 mt-3">Purity and hallmark</h2>
          <p>Common purities include 92.5% sterling and 99.9% fine silver. Hallmarks identify purity; valuation scales with purity and weight.</p>
          <h2 className="h5 mt-3">Tips to sell</h2>
          <p>Confirm weight and purity, compare quotes, and consider fees or spreads. Use our calculator and market pages for reference values.</p>
        </div>
      </div>
    </div>
  )
}
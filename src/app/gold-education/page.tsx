import { Metadata } from 'next'
import JsonLd from '@/components/JsonLd'

export const metadata: Metadata = {
  title: 'Gold Education – Karat, Purity, Units and Spot Price',
  description: 'Understand karat, purity, troy ounces, pennyweight, and spot price basics to read and use market prices correctly.',
  alternates: { canonical: 'https://www.goldcalculator.click/gold-education' },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } }
}

export default function Page(){
  return (
    <div className="container py-5">
      <JsonLd type="webpage" />
      <JsonLd type="breadcrumbs" data={{ items: [ { name:'Home', url:'/' }, { name:'Gold Education', url:'/gold-education' } ] }} />
      <h1 className="text-center mb-4">Gold Education</h1>
      <div className="card">
        <div className="card-body">
          <h2 className="h5">Karat and purity</h2>
          <p>Karat indicates purity out of 24. For example, 18K is 75% pure gold. Value scales with purity in the calculation.</p>
          <h2 className="h5 mt-3">Weight units</h2>
          <p>Troy ounce (oz) is the precious metals standard. Grams (g) and pennyweight (dwt) are supported and converted to troy ounces internally.</p>
          <h2 className="h5 mt-3">Spot price</h2>
          <p>The spot price reflects the most recent market trades for physical gold. It changes throughout the day and anchors valuation.</p>
          <h2 className="h5 mt-3">Premiums and discounts</h2>
          <p>Retail items and buybacks include markups or spreads. Use the premium or discount field to adjust calculation toward real quotes.</p>
        </div>
      </div>
    </div>
  )
}
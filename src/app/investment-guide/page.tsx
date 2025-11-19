import { Metadata } from 'next'
import JsonLd from '@/components/JsonLd'

export const metadata: Metadata = {
  title: 'Gold Investment Guide – Practical Tips for Buyers and Sellers',
  description: 'Understand premiums, spreads, storage and timing. Get practical pointers for buying and selling physical gold.',
  alternates: { canonical: 'https://www.goldcalculator.click/investment-guide' },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } }
}

export default function Page(){
  return (
    <div className="container py-5">
      <JsonLd type="webpage" />
      <JsonLd type="breadcrumbs" data={{ items: [ { name:'Home', url:'/' }, { name:'Investment Guide', url:'/investment-guide' } ] }} />
      <h1 className="text-center mb-4">Gold Investment Guide</h1>
      <div className="card">
        <div className="card-body">
          <h2 className="h5">Know your costs</h2>
          <p>Factor in premiums over spot, dealer spreads, shipping and storage. Compare total costs across products and sellers.</p>
          <h2 className="h5 mt-3">Product choice</h2>
          <p>Coins offer liquidity; bars provide lower premiums at larger sizes. Verify authenticity and consider buyback policies.</p>
          <h2 className="h5 mt-3">Timing and risk</h2>
          <p>Use dollar‑cost averaging and avoid leverage for physical holdings. Follow macro drivers and market charts to manage timing.</p>
        </div>
      </div>
    </div>
  )
}
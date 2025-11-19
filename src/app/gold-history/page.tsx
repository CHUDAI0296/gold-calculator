import { Metadata } from 'next'
import JsonLd from '@/components/JsonLd'

export const metadata: Metadata = {
  title: 'Gold Price History – Key Trends and Milestones',
  description: 'Overview of long‑term gold price movements, macro drivers, and events that moved the market.',
  alternates: { canonical: 'https://www.goldcalculator.click/gold-history' },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } }
}

export default function Page(){
  return (
    <div className="container py-5">
      <JsonLd type="webpage" />
      <JsonLd type="breadcrumbs" data={{ items: [ { name:'Home', url:'/' }, { name:'Gold Price History', url:'/gold-history' } ] }} />
      <h1 className="text-center mb-4">Gold Price History</h1>
      <div className="card">
        <div className="card-body">
          <h2 className="h5">Long‑term trend</h2>
          <p>Gold tends to rise during inflationary periods and uncertainty. Over decades, price reflects monetary policy, currency strength, and demand.</p>
          <h2 className="h5 mt-3">Key drivers</h2>
          <p>Real interest rates, central bank purchases, geopolitical risk, and USD movements are frequent drivers of gold price swings.</p>
          <h2 className="h5 mt-3">Reading charts</h2>
          <p>Combine moving averages and momentum with fundamental context. Visit the Market page for interactive charts and indicators.</p>
        </div>
      </div>
    </div>
  )
}
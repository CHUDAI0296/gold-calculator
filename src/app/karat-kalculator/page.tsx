import { Metadata } from 'next'
import JsonLd from '@/components/JsonLd'
import KaratCalculator from '@/components/KaratCalculator'

export const metadata: Metadata = {
  title: 'Karat Kalculator – 10K/14K/18K/22K Gold Value Calculator',
  description: 'Quickly estimate 10K/14K/18K/22K gold value by weight with live market prices. Accurate, mobile friendly and free to use.',
  alternates: { canonical: 'https://www.goldcalculator.click/karat-kalculator' }
}

export default function Page() {
  return (
    <div className="container py-5">
      <JsonLd type="calculator" />
      <KaratCalculator />
    </div>
  )
}
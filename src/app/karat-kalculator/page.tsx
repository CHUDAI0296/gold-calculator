import { Metadata } from 'next'
import JsonLd from '@/components/JsonLd'
import KaratCalculator from '@/components/KaratCalculator'

export const metadata: Metadata = {
  title: 'Karat Kalculator - Gold Karat Value Calculator',
  description: 'Karat Kalculator lets you estimate gold value by weight and karat with real-time prices.',
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
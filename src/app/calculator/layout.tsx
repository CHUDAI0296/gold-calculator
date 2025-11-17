import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Gold Calculator – Scrap Gold Value by Weight & Karat (Live Price)',
  description: 'Enter weight and karat (8K–24K) to get instant scrap gold value using live spot prices. Supports grams, ounces and pennyweights with optional refining fees.',
  alternates: { canonical: 'https://www.goldcalculator.click/calculator' }
}

export default function Layout({ children }: { children: React.ReactNode }){ return children }
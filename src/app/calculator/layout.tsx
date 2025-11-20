import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Gold Calculator – Scrap Gold Value by Weight & Karat (Live Price)',
  description: 'Enter weight and karat (8K–24K) to get today’s value using live prices. Supports grams, ounces and pennyweight with optional fees.',
  alternates: { canonical: 'https://www.goldcalculator.click/calculator' },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } }
}

export default function Layout({ children }: { children: React.ReactNode }){ return children }
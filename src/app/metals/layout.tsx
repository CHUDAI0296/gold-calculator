import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Silver & Platinum Price Today – Live Spot Prices (USD/oz)',
  description: 'Track live silver and platinum prices in USD per ounce. Simple view with quick spot updates and CFD/spot display modes.',
  alternates: { canonical: 'https://www.goldcalculator.click/metals' }
}

export default function Layout({ children }: { children: React.ReactNode }){ return children }
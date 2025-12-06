import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Gold Calculator – gold bars weight & 14k gold worth per gram',
  description: 'Enter gold bars weight and select 14K to see per‑gram value with live prices.',
  alternates: { canonical: 'https://www.goldcalculator.click/calculator' },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } }
}

export default function Layout({ children }: { children: React.ReactNode }){
  return children as React.ReactElement
}

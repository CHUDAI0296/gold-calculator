import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'gold holding',
  description: 'Track item quantities, purity, cost, real-time value and P&L with currency switching.',
  alternates: { canonical: 'https://www.goldcalculator.click/holdings' },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } }
}

export default function HoldingsLayout({ children }: { children: React.ReactNode }){
  return (<>{children}</>)
}

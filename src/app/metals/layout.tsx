import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Silver & Platinum Price Today – Live Spot Prices (USD/oz)',
  description: 'Live spot prices for silver and platinum in USD/oz with quick updates and display modes.',
  alternates: { canonical: 'https://www.goldcalculator.click/metals' },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } }
}

export default function Layout({ children }: { children: React.ReactNode }){ return children }
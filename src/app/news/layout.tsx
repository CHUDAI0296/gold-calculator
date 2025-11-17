import type { Metadata } from 'next'

const title = 'Gold Market News - Live Gold Headlines and Precious Metals Updates'
const description = 'Latest gold market headlines and insights from multiple trusted sources. Follow bullion, futures, central bank buying and price drivers in real time.'

export const metadata: Metadata = {
  title,
  description,
  keywords: ['gold','gold price','gold news','precious metals','bullion','central bank gold','XAU','GLD','Comex'],
  alternates: { canonical: 'https://www.goldcalculator.click/news' },
  openGraph: {
    title,
    description,
    url: 'https://www.goldcalculator.click/news',
    siteName: 'Gold Calculator',
    type: 'website'
  },
  twitter: { card: 'summary', title, description },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } }
}

export default function NewsLayout({ children }: { children: React.ReactNode }){
  return children
}
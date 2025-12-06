import React from "react";
import { Metadata } from 'next'
import JsonLd from '@/components/JsonLd';

function timeAgo(ts: number){
  const diff = Date.now() - ts; const m = 60*1000, h=60*m, d=24*h
  if (diff < h) return `${Math.max(1, Math.round(diff/m))} minutes ago`
  if (diff < d) return `${Math.round(diff/h)} hours ago`
  return `${Math.round(diff/d)} days ago`
}

function extractTags(title: string){
  const t = title.toLowerCase()
  const tags: string[] = []
  const add = (label: string) => { if (!tags.includes(label)) tags.push(label) }
  if (/(fomc|fed|federal reserve)/.test(t)) add('Fed')
  if (/(usd|dxy|fx|dollar)/.test(t)) add('USD')
  if (/(real yield|real yields|treasury|10-year|10 year)/.test(t)) add('Real yields')
  if (/(cpi|inflation|ppi)/.test(t)) add('Inflation')
  if (t.includes('pboc') || /(central bank|reserves)/.test(t)) add('Central banks')
  if (/(gld|etf)/.test(t)) add('GLD/ETF')
  if (/(comex|futures)/.test(t)) add('Futures')
  if (/(geopolitic|war|conflict|middle east)/.test(t)) add('Geopolitics')
  return tags.slice(0,4)
}


export default async function NewsPage({ searchParams }: { searchParams?: { [key:string]: string | string[] | undefined } }){
  const limitParam = typeof searchParams?.limit === 'string' ? parseInt(searchParams!.limit, 10) : 20
  const limit = Math.min(30, Math.max(5, Number.isFinite(limitParam) ? limitParam : 20))
  const topic = typeof searchParams?.q === 'string' ? searchParams!.q : ''
  const base = 'gold,bullion,gold price,Comex,XAU,GLD,central bank gold'
  const query = topic ? `${base},${topic}` : base
  const r = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ''}/api/news?q=${encodeURIComponent(query)}&limit=${limit}`, { cache: 'no-store' })
  const items: {title:string;source:string;published:number;desc?:string}[] = await r.json()

  return (
    <div className="container py-5">
      <JsonLd type="news" />
      <JsonLd type="breadcrumbs" data={{ items: [ { name:'Home', url: '/' }, { name:'Market News', url: '/news' } ] }} />
      <h1 className="text-center mb-4">Gold Market News</h1>
      <p className="text-muted text-center mb-4">Latest headlines related to bullion and precious metals, displayed directly on this page.</p>
      <div className="row g-3">
        {(!items || items.length===0) ? (
          <div className="text-center">No recent gold-related headlines.</div>
        ) : (
          <>
            {items.map((n,i)=> (
              <div className="col-12" key={i}>
                <div className="card h-100">
                  <div className="card-body">
                    <div className="h5 mb-2">{n.title}</div>
                    {extractTags(n.title).length > 0 && (
                      <div className="d-flex flex-wrap gap-1 mb-2">
                        {extractTags(n.title).map((tag, j) => (
                          <span key={j} className="badge bg-secondary">{tag}</span>
                        ))}
                      </div>
                    )}
                    {n.desc && (<div className="mt-2">{n.desc}</div>)}
                    <div className="text-muted small mt-2">{n.source} • {timeAgo(n.published)}</div>
                  </div>
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  )
}
export const metadata: Metadata = {
  title: 'Gold Market News – What’s moving prices today? | Gold Calculator',
  description: 'Latest gold news covering Fed policy, USD strength, real yields and central bank demand.',
  alternates: { canonical: 'https://www.goldcalculator.click/news' },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
  openGraph: {
    title: 'Gold Market News – What’s moving prices today?',
    description: 'Track headlines impacting gold: Fed, USD, real yields, central banks.',
    url: 'https://www.goldcalculator.click/news',
    siteName: 'Gold Calculator',
    type: 'website'
  },
  twitter: { card: 'summary', title: 'Gold Market News', description: 'What’s moving gold prices today: Fed, USD, yields, central banks.' }
}

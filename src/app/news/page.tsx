import React from "react";
import JsonLd from '@/components/JsonLd';

function timeAgo(ts: number){
  const diff = Date.now() - ts; const m = 60*1000, h=60*m, d=24*h
  if (diff < h) return `${Math.max(1, Math.round(diff/m))} minutes ago`
  if (diff < d) return `${Math.round(diff/h)} hours ago`
  return `${Math.round(diff/d)} days ago`
}

export default async function NewsPage({ searchParams }: { searchParams?: { [key:string]: string | string[] | undefined } }){
  const limitParam = typeof searchParams?.limit === 'string' ? parseInt(searchParams!.limit, 10) : 10
  const limit = Math.min(30, Math.max(5, Number.isFinite(limitParam) ? limitParam : 10))
  const query = 'gold,bullion,gold price,Comex,XAU,GLD,central bank gold'
  const r = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ''}/api/news?q=${encodeURIComponent(query)}&limit=${limit}`, { cache: 'no-store' })
  const items: {title:string;link:string;source:string;published:number}[] = await r.json()

  const nextLimit = Math.min(limit + 10, 30)

  return (
    <div className="container py-5">
      <JsonLd type="news" />
      <JsonLd type="breadcrumbs" data={{ items: [ { name:'Home', url: '/' }, { name:'Market News', url: '/news' } ] }} />
      <h1 className="text-center mb-4">Gold Market News</h1>
      <p className="text-muted text-center mb-4">Latest headlines related to bullion and precious metals.</p>
      <div className="row g-3">
        {(!items || items.length===0) ? (
          <div className="text-center">No recent gold-related headlines.</div>
        ) : (
          <>
            {items.map((n,i)=> (
              <div className="col-12" key={i}>
                <div className="card h-100">
                  <div className="card-body">
                    <a href={n.link} target="_blank" rel="noopener noreferrer" className="h5 d-block mb-2">{n.title}</a>
                    <div className="text-muted small">{n.source} • {timeAgo(n.published)}</div>
                  </div>
                </div>
              </div>
            ))}
            <div className="col-12 text-center">
              <a className="btn btn-outline-secondary" href={`/news?limit=${nextLimit}`}>Load more</a>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
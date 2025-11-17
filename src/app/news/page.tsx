"use client";
import React from "react";
import JsonLd from '@/components/JsonLd';

function timeAgo(ts: number){
  const diff = Date.now() - ts; const m = 60*1000, h=60*m, d=24*h
  if (diff < h) return `${Math.max(1, Math.round(diff/m))} minutes ago`
  if (diff < d) return `${Math.round(diff/h)} hours ago`
  return `${Math.round(diff/d)} days ago`
}

export default function NewsPage(){
  const [items, setItems] = React.useState<{title:string;link:string;source:string;published:number}[]>([])
  const [loading, setLoading] = React.useState(true)
  const [limit, setLimit] = React.useState(10)

  React.useEffect(()=>{
    const load = async ()=>{
      try{
        const r = await fetch(`/api/news?q=gold,黄金,金价,bullion,伦敦金,金条,央行购金,Comex,XAU,GLD,金矿&limit=${limit}` , { cache: 'no-store' })
        const d = await r.json()
        if (Array.isArray(d)) setItems(d)
      } finally { setLoading(false) }
    }
    load()
  },[limit])

  return (
    <div className="container py-5">
      <JsonLd type="news" />
      <JsonLd type="breadcrumbs" data={{ items: [ { name:'Home', url: '/' }, { name:'Market News', url: '/news' } ] }} />
      <h1 className="text-center mb-4">Gold Market News</h1>
      <p className="text-muted text-center mb-4">Latest headlines related to bullion and precious metals.</p>
      <div className="row g-3">
        {loading ? (
          <div className="text-center">Loading news...</div>
        ) : items.length===0 ? (
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
              <button className="btn btn-outline-secondary" onClick={()=> setLimit(v=> Math.min(v+10, 30))}>Load more</button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
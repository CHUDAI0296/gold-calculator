'use client';
import React, { useState, useEffect, useMemo } from 'react';
export default function MarketStats() {
  const [price, setPrice] = useState<number|null>(null)
  const [high, setHigh] = useState<number|null>(null)
  const [low, setLow] = useState<number|null>(null)
  const [change, setChange] = useState<number|null>(null)
  const [mode, setMode] = useState<string>('cfd')

  const m = useMemo(()=>{
    return mode === 'cfd' ? 2 : 1
  }, [mode])

  useEffect(()=>{
    try { const v = localStorage.getItem('price_display_mode') || 'cfd'; setMode(v) } catch {}
    const load = async ()=>{
      try {
        const r = await fetch('/api/spot/gold', { cache: 'no-store' })
        const d = await r.json()
        if (d && d.price) setPrice(d.price)
      } catch {}
      try {
        const end = new Date(); const start = new Date(end.getTime() - 24*60*60*1000)
        const s = start.toISOString().slice(0,10); const e = end.toISOString().slice(0,10)
        const rr = await fetch(`/api/timeseries?start_date=${s}&end_date=${e}&metal=XAU`, { cache: 'no-store' })
        const dd = await rr.json()
        if (Array.isArray(dd) && dd.length){
          const prices = dd.map((x:any)=>x.price)
          setHigh(Math.max(...prices))
          setLow(Math.min(...prices))
          if (prices.length>=2){ const ch = prices[prices.length-1] - prices[0]; setChange(ch) }
        }
      } catch {}
    }
    load()
    const onMode = (e: any) => { if (e && e.detail) setMode(e.detail) }
    window.addEventListener('price_display_mode_change', onMode as any)
    return () => { window.removeEventListener('price_display_mode_change', onMode as any) }
  }, [])

  return (
    <div className="bg-white rounded-lg shadow-md h-full">
      <div className="bg-warning text-dark p-4 rounded-t-lg">
        <h2 className="text-lg font-semibold m-0">Market Statistics</h2>
      </div>
      <div className="p-4">
        <div className="mb-3 text-2xl" style={{ minHeight: 32 }}>
          <span style={{ display:'inline-block', width:'10ch' }}>{price!=null ? `$${(price*m).toFixed(2)}` : 'Loading...'}</span>
          <span className="text-sm text-gray-500"> USD/oz</span>
        </div>
        <table className="w-full">
          <tbody className="divide-y divide-gray-200">
            <tr>
              <th className="py-2 text-left">24h High</th>
              <td className="py-2">{high!=null? `$${(high*m).toFixed(2)}` : 'Loading...'}</td>
            </tr>
            <tr>
              <th className="py-2 text-left">24h Low</th>
              <td className="py-2">{low!=null? `$${(low*m).toFixed(2)}` : 'Loading...'}</td>
            </tr>
            <tr>
              <th className="py-2 text-left">24h Change</th>
              <td className="py-2">{change!=null? `${(change*m).toFixed(2)} (${price && change ? ((change/price)*100).toFixed(2):'--'}%)` : 'Loading...'}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}
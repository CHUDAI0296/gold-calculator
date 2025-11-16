"use client";
import React, { useEffect, useState } from 'react'
import JsonLd from '@/components/JsonLd'

export default function MetalsPage(){
  const [silver, setSilver] = useState<number|null>(null)
  const [platinum, setPlatinum] = useState<number|null>(null)
  const [mode, setMode] = useState<string>('cfd')
  const m = mode === 'cfd' ? 2 : 1

  useEffect(()=>{
    try { const v = localStorage.getItem('price_display_mode') || 'cfd'; setMode(v) } catch {}
    const load = async ()=>{
      try { const r1 = await fetch('/api/spot/silver', { cache:'no-store' }); const d1 = await r1.json(); if (d1 && d1.price) setSilver(d1.price) } catch {}
      try { const r2 = await fetch('/api/spot/platinum', { cache:'no-store' }); const d2 = await r2.json(); if (d2 && d2.price) setPlatinum(d2.price) } catch {}
    }
    load()
  },[])

  return (
    <div className="container py-5">
      <JsonLd type="website" />
      <h1 className="text-center mb-4">Silver & Platinum Prices</h1>
      <div className="row">
        <div className="col-md-6 mb-4">
          <div className="card h-100">
            <div className="card-header bg-primary text-white"><h2 className="h5 mb-0">Silver</h2></div>
            <div className="card-body text-center">
              <div className="display-4">{silver!=null? `$${(silver*m).toFixed(2)}` : 'Loading...'}</div>
              <p className="text-muted">USD/oz</p>
            </div>
          </div>
        </div>
        <div className="col-md-6 mb-4">
          <div className="card h-100">
            <div className="card-header bg-secondary text-white"><h2 className="h5 mb-0">Platinum</h2></div>
            <div className="card-body text-center">
              <div className="display-4">{platinum!=null? `$${(platinum*m).toFixed(2)}` : 'Loading...'}</div>
              <p className="text-muted">USD/oz</p>
            </div>
          </div>
        </div>
      </div>
      <div className="text-center">
        <div className="btn-group btn-group-sm" role="group" aria-label="Display mode">
          <button className="btn btn-outline-secondary" onClick={()=>{ try{ localStorage.setItem('price_display_mode','spot') }catch{}; setMode('spot') }}>现货显示</button>
          <button className="btn btn-outline-secondary" onClick={()=>{ try{ localStorage.setItem('price_display_mode','cfd') }catch{}; setMode('cfd') }}>CFD显示</button>
        </div>
      </div>
    </div>
  )
}
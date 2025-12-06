"use client";
import React, { useEffect, useState } from "react";

type Metal = "silver" | "platinum";
type Row = { id: number; weight: number; unit: "g"|"oz"; purity: number };

function toOz(weight: number, unit: "g"|"oz"){ return unit === 'g' ? weight * 0.03215 : weight }

export default function MetalCalculator({ metal }: { metal: Metal }){
  const [rows, setRows] = useState<Row[]>([{ id:1, weight: 0, unit: 'g', purity: 92.5 }]);
  const [spot, setSpot] = useState<number | null>(null);
  const [displayCurrency, setDisplayCurrency] = useState<string>('USD');
  const [fx, setFx] = useState<Record<string, number>>({ USD: 1 });
  const [lastSpotAt, setLastSpotAt] = useState<string | null>(null);
  const [lastFxAt, setLastFxAt] = useState<string | null>(null);

  const loadSpot = async () => {
    try {
      const r = await fetch(`/api/spot/${metal}`, { cache: 'no-store' });
      const d = await r.json();
      const p = d && d.price ? d.price : null;
      if (p!=null){ setSpot(p); const now = new Date().toISOString(); setLastSpotAt(now); try { localStorage.setItem(`spot_${metal}_usd`, String(p)); localStorage.setItem(`spot_${metal}_usd_at`, now) } catch {} }
    } catch {}
  }

  useEffect(()=>{ loadSpot(); fetch('/api/fx?symbols=USD,CNY,GBP,EUR', { cache: 'no-store' }).then(r=>r.json()).then(d=>{ if(d&&d.rates){ setFx(d.rates); const now = new Date().toISOString(); setLastFxAt(now); try{ localStorage.setItem('fx_cache', JSON.stringify(d.rates)); localStorage.setItem('fx_cache_at', now) }catch{} } }).catch(()=>{}); }, [metal]);
  useEffect(()=>{ try { const v = localStorage.getItem('display_currency'); if(v) setDisplayCurrency(v) } catch {} ; try { const s = localStorage.getItem(`spot_${metal}_usd`); const at = localStorage.getItem(`spot_${metal}_usd_at`); if(s){ const n = parseFloat(s); if(isFinite(n)) setSpot(n); } if(at) setLastSpotAt(at) } catch {} ; try { const fxc = localStorage.getItem('fx_cache'); const fxa = localStorage.getItem('fx_cache_at'); if(fxc){ const obj = JSON.parse(fxc); if(obj && typeof obj==='object') setFx(obj) } if(fxa) setLastFxAt(fxa) } catch {} }, [metal]);
  useEffect(()=>{ const id = setInterval(()=>{ loadSpot(); fetch('/api/fx?symbols=USD,CNY,GBP,EUR', { cache:'no-store' }).then(r=>r.json()).then(d=>{ if(d&&d.rates){ setFx(d.rates); const now = new Date().toISOString(); setLastFxAt(now); try{ localStorage.setItem('fx_cache', JSON.stringify(d.rates)); localStorage.setItem('fx_cache_at', now) }catch{} } }).catch(()=>{}) }, 30000); return ()=>clearInterval(id) }, [metal]);

  const addRow = () => { const id = Math.max(0, ...rows.map(r=>r.id)) + 1; setRows(prev=>[...prev, { id, weight: 0, unit:'g', purity: 99.9 }]) }
  const removeRow = (id: number) => setRows(prev=>prev.filter(r=>r.id!==id))

  const rate = fx[displayCurrency] || 1
  const totals = (() => {
    const fineOz = rows.reduce((acc, r)=> acc + toOz(Number(r.weight)||0, r.unit) * (Math.max(0, Math.min(100, Number(r.purity))) / 100), 0)
    const valUsd = (Number(spot)||0) * fineOz
    return { fineOz, value: valUsd * rate }
  })()
  const format = (n: number) => n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })

  return (
    <div className="card h-100">
      <div className="card-header"><h2 className="h6 mb-0">{metal === 'silver' ? 'Silver Calculator' : 'Platinum Calculator'}</h2></div>
      <div className="card-body">
        <div className="d-flex align-items-center justify-content-between mb-3">
          <div className="btn-group btn-group-sm" role="group">
            {['USD','CNY','GBP','EUR'].map(c => (
              <button key={c} className={`btn btn-outline-secondary${displayCurrency===c?' active':''}`} onClick={() => { setDisplayCurrency(c); try { localStorage.setItem('display_currency', c); } catch {} }}> {c} </button>
            ))}
          </div>
          <div className="small text-muted">Spot updated {lastSpotAt ? new Date(lastSpotAt).toLocaleString() : '-'} | FX updated {lastFxAt ? new Date(lastFxAt).toLocaleString() : '-'}</div>
        </div>

        <div className="table-responsive">
          <table className="table align-middle">
            <thead>
              <tr>
                <th>Weight</th>
                <th>Unit</th>
                <th>Purity (%)</th>
                <th>Fine oz</th>
                <th>Value</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {rows.map(r=>{
                const w = Number(r.weight) || 0
                const p = Math.max(0, Math.min(100, Number(r.purity)))
                const fineOz = toOz(w, r.unit) * (p/100)
                const val = fineOz * ((Number(spot)||0) * rate)
                return (
                  <tr key={r.id}>
                    <td style={{ minWidth: 160 }}>
                      <input type="number" className="form-control" value={r.weight} onChange={e=> setRows(rows.map(x=> x.id===r.id ? { ...x, weight: parseFloat(e.target.value||'0') } : x))} step="0.01" />
                    </td>
                    <td style={{ minWidth: 120 }}>
                      <select className="form-select" value={r.unit} onChange={e=> setRows(rows.map(x=> x.id===r.id ? { ...x, unit: (e.target.value === 'g' ? 'g' : 'oz') } : x))}>
                        <option value="g">g</option>
                        <option value="oz">oz</option>
                      </select>
                    </td>
                    <td style={{ minWidth: 160 }}>
                      <div className="input-group">
                        <span className="input-group-text">%</span>
                        <input type="number" className="form-control" value={r.purity} onChange={e=> setRows(rows.map(x=> x.id===r.id ? { ...x, purity: parseFloat(e.target.value||'0') } : x))} step="0.1" />
                        <button className="btn btn-outline-secondary" type="button" onClick={()=> setRows(rows.map(x=> x.id===r.id ? { ...x, purity: 92.5 } : x))}>Sterling</button>
                        <button className="btn btn-outline-secondary" type="button" onClick={()=> setRows(rows.map(x=> x.id===r.id ? { ...x, purity: 99.9 } : x))}>Fine</button>
                      </div>
                    </td>
                    <td>{format(fineOz)}</td>
                    <td>{displayCurrency} {format(val)}</td>
                    <td><button className="btn btn-outline-danger btn-sm" onClick={()=>removeRow(r.id)}>Delete</button></td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        <div className="d-flex justify-content-between align-items-center">
          <button type="button" className="btn btn-primary" onClick={addRow}>Add Row</button>
          <div className="text-end">
            <div className="mb-1">Fine {metal}: {format(totals.fineOz)} oz</div>
            <div className="fw-bold">Total: {displayCurrency} {format(totals.value)}</div>
          </div>
        </div>
      </div>
    </div>
  )
}


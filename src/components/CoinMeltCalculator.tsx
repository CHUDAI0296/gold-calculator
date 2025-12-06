"use client";
import React, { useEffect, useState } from "react";

type PresetKey = "US90SilverFace" | "US40HalfCount" | "SterlingSilverGrams" | "FineGold1ozCount" | "GoldEagle1ozCount" | "Platinum1ozCount";
type Metal = "gold" | "silver" | "platinum";

type Row = {
  id: number;
  preset: PresetKey;
  amount: number;
};

const presets: Record<PresetKey, { label: string; metal: Metal; placeholder: string; computeFineOz: (amount: number) => number }> = {
  US90SilverFace: { label: "90% U.S. Silver (face $)", metal: "silver", placeholder: "Face value ($)", computeFineOz: (v) => v * 0.715 },
  US40HalfCount: { label: "40% Half Dollars (count)", metal: "silver", placeholder: "Coins count", computeFineOz: (v) => v * 0.1479 },
  SterlingSilverGrams: { label: "Sterling Silver (grams)", metal: "silver", placeholder: "Weight (g)", computeFineOz: (v) => v * 0.03215 * 0.925 },
  FineGold1ozCount: { label: "Fine Gold 1 oz (count)", metal: "gold", placeholder: "Coins count", computeFineOz: (v) => v * 1 },
  GoldEagle1ozCount: { label: "US Gold Eagle 1 oz (count)", metal: "gold", placeholder: "Coins count", computeFineOz: (v) => v * 0.9167 },
  Platinum1ozCount: { label: "Platinum 1 oz (count)", metal: "platinum", placeholder: "Coins count", computeFineOz: (v) => v * 1 },
};

export default function CoinMeltCalculator() {
  const [rows, setRows] = useState<Row[]>([{ id: 1, preset: "US90SilverFace", amount: 0 }]);
  const [goldSpot, setGoldSpot] = useState<number | null>(null);
  const [silverSpot, setSilverSpot] = useState<number | null>(null);
  const [platinumSpot, setPlatinumSpot] = useState<number | null>(null);
  const [displayCurrency, setDisplayCurrency] = useState<string>("USD");
  const [fx, setFx] = useState<Record<string, number>>({ USD: 1 });
  const [lastSpotAt, setLastSpotAt] = useState<string | null>(null);
  const [lastFxAt, setLastFxAt] = useState<string | null>(null);

  const fetchSpot = async (metal: Metal) => {
    try {
      const r = await fetch(`/api/spot/${metal}`, { cache: "no-store" });
      const d = await r.json();
      const p = d && d.price ? d.price : null;
      if (p != null) {
        const now = new Date().toISOString();
        if (metal === "gold") setGoldSpot(p);
        if (metal === "silver") setSilverSpot(p);
        if (metal === "platinum") setPlatinumSpot(p);
        setLastSpotAt(now);
        try {
          localStorage.setItem(`spot_${metal}_usd`, String(p));
          localStorage.setItem(`spot_${metal}_usd_at`, now);
        } catch {}
      }
    } catch {}
  };

  useEffect(() => {
    ["gold", "silver", "platinum"].forEach(m => fetchSpot(m as Metal));
    fetch("/api/fx?symbols=USD,CNY,GBP,EUR", { cache: "no-store" })
      .then(r => r.json())
      .then(d => { if (d && d.rates) { setFx(d.rates); const now = new Date().toISOString(); setLastFxAt(now); try { localStorage.setItem("fx_cache", JSON.stringify(d.rates)); localStorage.setItem("fx_cache_at", now); } catch {} } })
      .catch(() => setFx({ USD: 1 }));
  }, []);

  useEffect(() => {
    try {
      const ds = localStorage.getItem("display_currency");
      if (ds) setDisplayCurrency(ds);
      ["gold","silver","platinum"].forEach(m => {
        const v = localStorage.getItem(`spot_${m}_usd`);
        const at = localStorage.getItem(`spot_${m}_usd_at`);
        if (v) {
          const num = parseFloat(v);
          if (isFinite(num)) {
            if (m === "gold") setGoldSpot(num);
            if (m === "silver") setSilverSpot(num);
            if (m === "platinum") setPlatinumSpot(num);
            if (at) setLastSpotAt(at);
          }
        }
      });
      const fxc = localStorage.getItem("fx_cache");
      const fxcAt = localStorage.getItem("fx_cache_at");
      if (fxc) { const obj = JSON.parse(fxc); if (obj && typeof obj === "object") setFx(obj); }
      if (fxcAt) setLastFxAt(fxcAt);
    } catch {}
  }, []);

  useEffect(() => {
    const id = setInterval(() => {
      ["gold", "silver", "platinum"].forEach(m => fetchSpot(m as Metal));
      fetch("/api/fx?symbols=USD,CNY,GBP,EUR", { cache: "no-store" })
        .then(r => r.json()).then(d => { if (d && d.rates) { setFx(d.rates); const now = new Date().toISOString(); setLastFxAt(now); try { localStorage.setItem("fx_cache", JSON.stringify(d.rates)); localStorage.setItem("fx_cache_at", now); } catch {} } })
        .catch(() => {});
    }, 30000);
    return () => clearInterval(id);
  }, []);

  const addRow = () => {
    const id = Math.max(0, ...rows.map(r => r.id)) + 1;
    setRows(prev => [...prev, { id, preset: "US90SilverFace", amount: 0 }]);
  };

  const removeRow = (id: number) => setRows(prev => prev.filter(r => r.id !== id));

  const computeTotals = () => {
    const rate = fx[displayCurrency] || 1;
    let fineGold = 0, fineSilver = 0, finePlatinum = 0;
    rows.forEach(r => {
      const p = presets[r.preset];
      if (!p) return;
      const amt = Number(r.amount);
      const fine = Number.isFinite(amt) ? p.computeFineOz(amt) : 0;
      if (p.metal === "gold") fineGold += fine;
      if (p.metal === "silver") fineSilver += fine;
      if (p.metal === "platinum") finePlatinum += fine;
    });
    const goldValUsd = (Number(goldSpot) || 0) * fineGold;
    const silverValUsd = (Number(silverSpot) || 0) * fineSilver;
    const platinumValUsd = (Number(platinumSpot) || 0) * finePlatinum;
    const totalUsd = goldValUsd + silverValUsd + platinumValUsd;
    return {
      fineGold,
      fineSilver,
      finePlatinum,
      goldVal: goldValUsd * rate,
      silverVal: silverValUsd * rate,
      platinumVal: platinumValUsd * rate,
      total: totalUsd * rate,
    };
  };

  const format = (n: number) => n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const formatSafe = (n: number) => {
    const v = Number(n);
    return Number.isFinite(v) ? format(v) : format(0);
  };

  return (
    <div className="card">
      <div className="card-header bg-warning text-dark"><h2 className="h6 mb-0">Melt Value Calculator</h2></div>
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
                <th>Preset</th>
                <th>Amount</th>
                <th>Fine oz</th>
                <th>Value</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {rows.map(r => {
                const p = presets[r.preset];
                const amt = Number(r.amount);
                const fine = Number.isFinite(amt) ? p.computeFineOz(amt) : 0;
                const rate = fx[displayCurrency] || 1;
                const spot = p.metal === "gold" ? (goldSpot || 0) : p.metal === "silver" ? (silverSpot || 0) : (platinumSpot || 0);
                const val = fine * spot * rate;
                return (
                  <tr key={r.id}>
                    <td style={{ minWidth: 260 }}>
                      <select className="form-select" value={r.preset} onChange={e => setRows(rows.map(x => x.id===r.id ? { ...x, preset: e.target.value as PresetKey, amount: 0 } : x))}>
                        {Object.keys(presets).map(k => (
                          <option key={k} value={k}>{presets[k as PresetKey].label}</option>
                        ))}
                      </select>
                    </td>
                    <td style={{ minWidth: 220 }}>
                      <div className="input-group">
                        <span className="input-group-text">{p.placeholder}</span>
                        <input type="number" className="form-control" value={r.amount} onChange={e => setRows(rows.map(x => x.id===r.id ? { ...x, amount: parseFloat(e.target.value||"0") } : x))} step="0.01" />
                      </div>
                    </td>
                    <td>{formatSafe(fine)}</td>
                    <td>{displayCurrency} {formatSafe(val)}</td>
                    <td>
                      <button className="btn btn-outline-danger btn-sm" onClick={() => removeRow(r.id)}>Delete</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="d-flex justify-content-between align-items-center">
          <button type="button" className="btn btn-warning" onClick={addRow}>Add Item</button>
          {(() => { const totals = computeTotals(); return (
            <div className="text-end">
              <div className="mb-1">Fine Gold: {formatSafe(totals.fineGold)} oz | Value: {displayCurrency} {formatSafe(totals.goldVal)}</div>
              <div className="mb-1">Fine Silver: {formatSafe(totals.fineSilver)} oz | Value: {displayCurrency} {formatSafe(totals.silverVal)}</div>
              <div className="mb-1">Fine Platinum: {formatSafe(totals.finePlatinum)} oz | Value: {displayCurrency} {formatSafe(totals.platinumVal)}</div>
              <div className="fw-bold">Total: {displayCurrency} {formatSafe(totals.total)}</div>
            </div>
          ); })()}
        </div>
      </div>
    </div>
  );
}

"use client";
import React, { useEffect, useState, useMemo } from "react";

export default function CurrentPriceBanner({ initialPrice }: { initialPrice?: number }) {
  const [price, setPrice] = useState<number | null>(initialPrice ?? null);
  const [mode, setMode] = useState<string>("cfd");
  const [lastUpdated, setLastUpdated] = useState<string>("");

  const m = useMemo(() => (mode === "cfd" ? 2 : 1), [mode]);

  useEffect(() => {
    try { const v = localStorage.getItem("price_display_mode") || "cfd"; setMode(v); } catch {}
    const load = async () => {
      try {
        const r = await fetch("/api/spot/gold", { cache: "no-store" });
        const d = await r.json();
        if (d && d.price) { setPrice(d.price); setLastUpdated(new Date().toLocaleString()); }
      } catch {}
    };
    try {
      const ric = (window as any).requestIdleCallback as undefined | ((cb: Function, opts?: any)=>void);
      if (typeof ric === 'function') ric(load, { timeout: 1500 }); else setTimeout(load, 600);
    } catch { setTimeout(load, 600) }
    const onMode = (e: any) => { if (e && e.detail) setMode(e.detail); };
    window.addEventListener('price_display_mode_change', onMode as any);
    return () => { window.removeEventListener('price_display_mode_change', onMode as any); };
  }, []);

  return (
    <div className="gold-price-display my-4 text-center">
      <h3>Current Gold Price</h3>
      <div className="price-box" style={{ minHeight: 32 }}>
        {price != null ? (
          <span suppressHydrationWarning style={{ display:'inline-block', width:'14ch' }}>{`$${(price * m).toFixed(2)} USD/oz`}</span>
        ) : (
          <span style={{ display:'inline-block', width:'14ch' }}>Loading...</span>
        )}
      </div>
      <p className="small text-muted" suppressHydrationWarning style={{ minHeight: 20 }}>Last updated: {lastUpdated}</p>
    </div>
  );
}
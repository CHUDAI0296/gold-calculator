"use client";
import React, { useEffect, useMemo, useState } from "react";

export default function CalculatorPriceDisplay() {
  const [price, setPrice] = useState<number | null>(null);
  const [mode, setMode] = useState<string>("cfd");
  const [lastUpdated, setLastUpdated] = useState<string>("");
  const m = useMemo(() => (mode === "cfd" ? 2 : 1), [mode]);

  useEffect(() => {
    try {
      const v = localStorage.getItem("price_display_mode") || "cfd";
      setMode(v);
    } catch {}
    const load = async () => {
      try {
        const r = await fetch("/api/spot/gold", { cache: "no-store" });
        const d = await r.json();
        if (d && d.price) { setPrice(d.price); setLastUpdated(new Date().toLocaleString()); }
      } catch {}
    };
    load();
  }, []);

  return (
    <div className="price-display text-center">
      <span className="display-4">
        {price != null ? `$${(price * m).toFixed(2)}` : "Loading..."}
      </span>
      <p className="text-muted">USD per troy ounce</p>
      <p className="small" suppressHydrationWarning>Last updated: {lastUpdated}</p>
      <div className="btn-group btn-group-sm" role="group" aria-label="Display mode">
        <button className="btn btn-outline-secondary" onClick={() => { try { localStorage.setItem("price_display_mode", "spot"); } catch {} ; setMode("spot"); }}>现货显示</button>
        <button className="btn btn-outline-secondary" onClick={() => { try { localStorage.setItem("price_display_mode", "cfd"); } catch {} ; setMode("cfd"); }}>CFD显示</button>
      </div>
    </div>
  );
}
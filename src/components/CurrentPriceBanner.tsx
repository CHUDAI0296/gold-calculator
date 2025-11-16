"use client";
import React, { useEffect, useState, useMemo } from "react";

export default function CurrentPriceBanner({ initialPrice }: { initialPrice?: number }) {
  const [price, setPrice] = useState<number | null>(initialPrice ?? null);
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
    <div className="gold-price-display my-4 text-center">
      <h3>Current Gold Price</h3>
      <div className="price-box">
        {price != null ? <span suppressHydrationWarning>{`$${(price * m).toFixed(2)} USD/oz`}</span> : <span>Loading...</span>}
      </div>
      <p className="small text-muted" suppressHydrationWarning>Last updated: {lastUpdated}</p>
    </div>
  );
}
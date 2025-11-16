"use client";
import React, { useEffect, useState } from "react";

export default function KaratCalculator() {
  const [goldPrice, setGoldPrice] = useState<number | null>(null);
  const [displayMode, setDisplayMode] = useState<string>("cfd");
  const [calculatedValue, setCalculatedValue] = useState<number>(0);

  const displayMultiplier = displayMode === "cfd" ? 2 : 1;

  const getGoldPrice = async () => {
    try {
      const r = await fetch("/api/spot/gold", { cache: "no-store" });
      const d = await r.json();
      return d && d.price ? d.price : null;
    } catch {
      return null;
    }
  };

  useEffect(() => {
    try {
      const m = localStorage.getItem("price_display_mode") || "cfd";
      setDisplayMode(m);
    } catch {}
    getGoldPrice().then((p) => setGoldPrice(p));
  }, []);

  const calculateValue = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const weight = parseFloat((form.querySelector("#weight") as HTMLInputElement).value);
    const unit = (form.querySelector("#weightUnit") as HTMLSelectElement).value;
    const karat = parseInt((form.querySelector("#karat") as HTMLSelectElement).value);
    const premium = parseFloat((form.querySelector("#premium") as HTMLInputElement).value);
    if (!goldPrice || isNaN(weight)) return;
    let oz = weight;
    if (unit === "g") oz = weight * 0.03215;
    else if (unit === "dwt") oz = weight * 0.05;
    const purity = karat / 24;
    let value = oz * goldPrice * purity;
    if (!isNaN(premium)) value = value * (1 + premium / 100);
    setCalculatedValue(value);
  };

  return (
    <div className="container py-5">
      <h1 className="text-center mb-4">Karat Kalculator</h1>
      <div className="row">
        <div className="col-md-6 mb-4">
          <div className="card">
            <div className="card-header bg-warning text-dark"><h2 className="h5 mb-0">Current Gold Price</h2></div>
            <div className="card-body">
              <div className="price-display text-center">
                <span className="display-4">{goldPrice != null ? `$${(goldPrice * displayMultiplier).toFixed(2)}` : "Loading..."}</span>
                <p className="text-muted">USD per troy ounce</p>
                <div className="btn-group btn-group-sm" role="group" aria-label="Display mode">
                  <button className="btn btn-outline-secondary" onClick={() => { try { localStorage.setItem("price_display_mode", "spot"); } catch {} setDisplayMode("spot"); }}>现货显示</button>
                  <button className="btn btn-outline-secondary" onClick={() => { try { localStorage.setItem("price_display_mode", "cfd"); } catch {} setDisplayMode("cfd"); }}>CFD显示</button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-6 mb-4">
          <div className="card">
            <div className="card-header bg-warning text-dark"><h2 className="h5 mb-0">Calculator Settings</h2></div>
            <div className="card-body">
              <form onSubmit={calculateValue}>
                <div className="mb-3">
                  <label htmlFor="weight" className="form-label">Weight</label>
                  <div className="input-group">
                    <input type="number" className="form-control" id="weight" step="0.01" min="0" required />
                    <select className="form-select" id="weightUnit">
                      <option value="g">Grams</option>
                      <option value="oz">Troy Ounces</option>
                      <option value="dwt">Pennyweight</option>
                    </select>
                  </div>
                </div>
                <div className="mb-3">
                  <label htmlFor="karat" className="form-label">Karat</label>
                  <select className="form-select" id="karat" defaultValue="24">
                    <option value="24">24K (99.9%)</option>
                    <option value="22">22K (91.6%)</option>
                    <option value="18">18K (75.0%)</option>
                    <option value="14">14K (58.5%)</option>
                    <option value="10">10K (41.7%)</option>
                    <option value="9">9K (37.5%)</option>
                  </select>
                </div>
                <div className="mb-3">
                  <label htmlFor="premium" className="form-label">Premium/Discount</label>
                  <div className="input-group">
                    <input type="number" className="form-control" id="premium" defaultValue="0" />
                    <span className="input-group-text">%</span>
                  </div>
                </div>
                <button type="submit" className="btn btn-warning w-100">Calculate Value</button>
              </form>
            </div>
          </div>
        </div>
      </div>
      <div className="card">
        <div className="card-header bg-success text-white"><h2 className="h5 mb-0">Estimated Value</h2></div>
        <div className="card-body text-center">
          <div className="display-4">${(calculatedValue * displayMultiplier).toFixed(2)}</div>
          <p className="text-muted mt-2">Based on current market price</p>
        </div>
      </div>
    </div>
  );
}
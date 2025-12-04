"use client";
import React, { useEffect, useMemo, useState } from "react";
import JsonLd from "@/components/JsonLd";
import { supabase } from "@/lib/supabaseClient";

type Holding = {
  id: number;
  quantity: number;
  unit: "oz" | "g";
  karat?: number;
  purchaseAmount: number;
  currency: string;
  fxRateToUsd: number;
  purchaseDate: string;
  vendor?: string;
  note?: string;
};

function toOz(q: number, unit: "oz" | "g") {
  return unit === "oz" ? q : q * 0.03215;
}

function format(n: number) {
  return n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function formatSafe(n: number) {
  const v = Number(n);
  return Number.isFinite(v) ? format(v) : format(0);
}

export default function HoldingsPage() {
  const [goldPrice, setGoldPrice] = useState<number | null>(null);
  const [fx, setFx] = useState<Record<string, number>>({ USD: 1 });
  const [displayCurrency, setDisplayCurrency] = useState<string>('USD');
  const [goldPriceCached, setGoldPriceCached] = useState<number | null>(null);
  const [lastSpotAt, setLastSpotAt] = useState<string | null>(null);
  const [lastFxAt, setLastFxAt] = useState<string | null>(null);
  const [spotLive, setSpotLive] = useState<boolean>(false);
  const [fxLive, setFxLive] = useState<boolean>(false);

  const refreshSpot = async () => {
    try {
      const r = await fetch("/api/spot/gold", { cache: "no-store" });
      const d = await r.json();
      const p = d && d.price ? d.price : null;
      setGoldPrice(p);
      if (p != null) {
        try {
          localStorage.setItem("gold_spot_usd", String(p));
          const now = new Date().toISOString();
          localStorage.setItem("gold_spot_usd_at", now);
          setGoldPriceCached(p);
          setLastSpotAt(now);
          setSpotLive(true);
        } catch {}
        return;
      }
    } catch {}
    try {
      const yr = await fetch("https://query1.finance.yahoo.com/v8/finance/chart/GC=F?range=1d&interval=1m&includePrePost=false", { cache: "no-store" });
      if (yr.ok) {
        const yd = await yr.json();
        const res = yd && yd.chart && yd.chart.result && yd.chart.result[0];
        const quote = res && res.indicators && res.indicators.quote && res.indicators.quote[0];
        const closes = quote && quote.close;
        let last = null as number | null;
        if (Array.isArray(closes)) {
          for (let i = closes.length - 1; i >= 0; i--) {
            if (typeof closes[i] === "number" && isFinite(closes[i])) { last = closes[i] as number; break; }
          }
        }
        if (last != null) {
          setGoldPrice(last);
          try {
            localStorage.setItem("gold_spot_usd", String(last));
            const now = new Date().toISOString();
            localStorage.setItem("gold_spot_usd_at", now);
            setGoldPriceCached(last);
            setLastSpotAt(now);
            setSpotLive(true);
          } catch {}
        }
      }
    } catch {}
  };
  const [items, setItems] = useState<Holding[]>([
    { id: 1, quantity: 1, unit: "oz", karat: 24, purchaseAmount: 1900, currency: "USD", fxRateToUsd: 1, purchaseDate: "2025-09-01", vendor: "Example Dealer" }
  ]);
  const [form, setForm] = useState<Holding>({ id: 0, quantity: 1, unit: "oz", karat: 24, purchaseAmount: 1900, currency: "USD", fxRateToUsd: 1, purchaseDate: new Date().toISOString().slice(0,10), vendor: "", note: "" });
  const [search, setSearch] = useState<string>("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [edit, setEdit] = useState<Holding | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [authEmail, setAuthEmail] = useState<string>("");
  const [authSending, setAuthSending] = useState<boolean>(false);

  const loadHoldings = async (uid: string) => {
    const { data } = await supabase.from("holdings").select("id,quantity,unit,karat,purchase_amount,currency,purchase_date,vendor,note").eq("user_id", uid).order("purchase_date", { ascending: false });
    if (Array.isArray(data)) {
      const arr: Holding[] = data.map((r: any) => ({ id: r.id, quantity: r.quantity || 0, unit: (r.unit === "g" ? "g" : "oz"), karat: r.karat ?? 24, purchaseAmount: r.purchase_amount || 0, currency: (r.currency || "USD").toUpperCase(), fxRateToUsd: 1, purchaseDate: r.purchase_date || new Date().toISOString().slice(0,10), vendor: r.vendor || "", note: r.note || "" }));
      setItems(arr);
    }
  };

  useEffect(() => {
    refreshSpot().catch(()=>{});
    fetch("/api/fx?symbols=USD,CNY,GBP,EUR", { cache: "no-store" })
      .then(r => r.json()).then(d => { if (d && d.rates) { setFx(d.rates); try { localStorage.setItem("fx_cache", JSON.stringify(d.rates)); const now = new Date().toISOString(); localStorage.setItem("fx_cache_at", now); setLastFxAt(now); setFxLive(true); } catch {} } })
      .catch(() => setFx({ USD: 1 }));
    supabase.auth.getSession().then(({ data }) => {
      const uid = data.session?.user?.id || null;
      setUserId(uid);
      if (uid) loadHoldings(uid);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      const uid = session?.user?.id || null;
      setUserId(uid);
      if (uid) loadHoldings(uid);
    });
    return () => { sub?.subscription.unsubscribe(); };
  }, []);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("gold_holdings");
      if (raw) {
        const arr = JSON.parse(raw);
        if (Array.isArray(arr)) setItems(arr);
      }
      const c = localStorage.getItem("display_currency");
      if (c) setDisplayCurrency(c);
      const gp = localStorage.getItem("gold_spot_usd");
      if (gp) { const v = parseFloat(gp); if (isFinite(v)) setGoldPriceCached(v) }
      const gpAt = localStorage.getItem("gold_spot_usd_at");
      if (gpAt) setLastSpotAt(gpAt);
      const fxc = localStorage.getItem("fx_cache");
      if (fxc) { const obj = JSON.parse(fxc); if (obj && typeof obj === 'object') setFx(obj) }
      const fxcAt = localStorage.getItem("fx_cache_at");
      if (fxcAt) setLastFxAt(fxcAt);
      setSpotLive(false);
      setFxLive(false);
    } catch {}
  }, []);

  useEffect(() => {
    try { localStorage.setItem("gold_holdings", JSON.stringify(items)); } catch {}
  }, [items]);

  useEffect(() => {
    try { localStorage.setItem("display_currency", displayCurrency); } catch {}
  }, [displayCurrency]);

  useEffect(() => {
    const id = setInterval(() => {
      refreshSpot().catch(()=>{});
      fetch("/api/fx?symbols=USD,CNY,GBP,EUR", { cache: "no-store" })
        .then(r => r.json()).then(d => { if (d && d.rates) { setFx(d.rates); try { localStorage.setItem("fx_cache", JSON.stringify(d.rates)); const now = new Date().toISOString(); localStorage.setItem("fx_cache_at", now); setLastFxAt(now); setFxLive(true); } catch {} } })
        .catch(() => {});
    }, 30000);
    return () => clearInterval(id);
  }, []);

  const totals = useMemo(() => {
    const fineOz = items.reduce((acc, it) => acc + toOz(it.quantity, it.unit) * (it.karat ? it.karat / 24 : 1), 0);
    const costUsd = items.reduce((acc, it) => acc + (it.purchaseAmount / (fx[it.currency || 'USD'] || 1)), 0);
    const spot = goldPrice ?? goldPriceCached;
    const currentValueUsd = spot != null ? fineOz * spot : 0;
    const pnlUsd = currentValueUsd - costUsd;
    const rate = fx[displayCurrency] || 1;
    return {
      fineOz,
      costUsd,
      currentValue: currentValueUsd * rate,
      pnl: pnlUsd * rate,
      pct: costUsd > 0 ? pnlUsd / costUsd : 0
    };
  }, [items, goldPrice, goldPriceCached, fx, displayCurrency]);

  const addItem = () => {
    if (userId) {
      const payload = { user_id: userId, quantity: form.quantity, unit: form.unit, karat: form.karat ?? 24, purchase_amount: form.purchaseAmount, currency: form.currency || "USD", purchase_date: form.purchaseDate, vendor: form.vendor || "", note: form.note || "" };
      supabase.from("holdings").insert(payload).select("id").then(({ data }) => {
        const id = data && data[0] && data[0].id ? Number(data[0].id) : Math.max(0, ...items.map(i => i.id)) + 1;
        setItems(prev => [...prev, { ...form, id }]);
      });
    } else {
      setItems(prev => {
        const id = Math.max(0, ...prev.map(i => i.id)) + 1;
        return [...prev, { ...form, id }];
      });
    }
    setForm({ id: 0, quantity: 1, unit: "oz", karat: 24, purchaseAmount: 0, currency: "USD", fxRateToUsd: 1, purchaseDate: new Date().toISOString().slice(0,10), vendor: "", note: "" });
  };

  const removeItem = (id: number) => {
    if (userId) { supabase.from("holdings").delete().eq("id", id).eq("user_id", userId).then(() => {}); }
    setItems(prev => prev.filter(i => i.id !== id));
  };

  const startEdit = (it: Holding) => {
    setEditingId(it.id);
    setEdit({ ...it });
  };

  const saveEdit = () => {
    if (editingId == null || !edit) return;
    setItems(items.map(i => i.id === editingId ? { ...edit, id: i.id } : i));
    if (userId) {
      const payload = { quantity: edit.quantity, unit: edit.unit, karat: edit.karat ?? 24, purchase_amount: edit.purchaseAmount, currency: edit.currency || "USD", purchase_date: edit.purchaseDate, vendor: edit.vendor || "", note: edit.note || "" };
      supabase.from("holdings").update(payload).eq("id", editingId).eq("user_id", userId).then(() => {});
    }
    setEditingId(null);
    setEdit(null);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEdit(null);
  };


  return (
    <div className="container py-5">
      <JsonLd type="webpage" />
      <JsonLd type="breadcrumbs" data={{ items: [ { name:"Home", url:"/" }, { name:"My Gold Holdings", url:"/holdings" } ] }} />
      <h1 className="text-center mb-4">My Gold Holdings</h1>

      <div className="row g-3 mb-4">
        <div className="col-md-3">
          <div className="card h-100">
            <div className="card-body">
              <div className="text-muted">Fine Gold (oz)</div>
              <div className="display-6">{format(totals.fineOz)}</div>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card h-100">
            <div className="card-body">
              <div className="d-flex align-items-baseline justify-content-between">
                <div className="text-muted">Cost</div>
                <div className="btn-group btn-group-sm" role="group" aria-label="Currency">
                  {['USD','CNY','GBP','EUR'].map(c => (
                    <button key={c} className={`btn btn-outline-secondary${displayCurrency===c?' active':''}`} onClick={()=>setDisplayCurrency(c)}>{c}</button>
                  ))}
                </div>
              </div>
              <div className="display-6">{displayCurrency} {formatSafe(totals.costUsd * (fx[displayCurrency]||1))}</div>
              <div className="small text-muted mt-1">FX updated {lastFxAt ? new Date(lastFxAt).toLocaleString() : '-'} <span className={`badge ${fxLive?'bg-success':'bg-secondary'} ms-2`}>{fxLive?'Live':'Cached'}</span></div>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card h-100">
            <div className="card-body">
              <div className="text-muted">Current Value</div>
              <div className="display-6">{`${displayCurrency} ${formatSafe(totals.currentValue)}`}</div>
              <div className="small text-muted mt-1">Spot updated {lastSpotAt ? new Date(lastSpotAt).toLocaleString() : '-'} <span className={`badge ${spotLive?'bg-success':'bg-secondary'} ms-2`}>{spotLive?'Live':'Cached'}</span></div>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className={`card h-100 ${totals.pnl>=0?"border-success":"border-danger"}`}>
            <div className="card-body">
              <div className="d-flex align-items-baseline gap-2">
                <div className="text-muted">P&L</div>
                <span className={`badge ${totals.pnl>=0?"bg-success":"bg-danger"}`}>{Number.isFinite(totals.pct)?(totals.pct*100).toFixed(2):"0.00"}%</span>
              </div>
              <div className="display-6">{displayCurrency} {formatSafe(totals.pnl)}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="card mb-4">
        <div className="card-body">
          {userId ? (
            <div className="d-flex align-items-center justify-content-between">
              <div>Signed in</div>
              <button className="btn btn-outline-secondary btn-sm" onClick={()=>supabase.auth.signOut().then(()=>{ setItems([]); })}>Sign out</button>
            </div>
          ) : (
            <div className="row g-2 align-items-end">
              <div className="col-md-6">
                <label className="form-label">Email</label>
                <input type="email" className="form-control" placeholder="Enter email to sign in" value={authEmail} onChange={e=>setAuthEmail(e.target.value)} />
              </div>
              <div className="col-md-3">
                <button type="button" className="btn btn-primary w-100" disabled={authSending || !authEmail} onClick={()=>{ setAuthSending(true); supabase.auth.signInWithOtp({ email: authEmail, options: { emailRedirectTo: typeof window!=='undefined'? window.location.origin + '/holdings' : undefined } }).finally(()=>setAuthSending(false)); }}>Send magic link</button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="card mb-4">
        <div className="card-header bg-warning text-dark"><h2 className="h5 mb-0">Add Holding</h2></div>
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-3">
              <label className="form-label">Quantity</label>
              <div className="input-group">
                <input type="number" className="form-control" value={form.quantity} onChange={e=>setForm({...form, quantity: parseFloat(e.target.value||"0")})} step="0.001" />
                <select className="form-select" value={form.unit} onChange={e=>setForm({...form, unit: e.target.value as Holding["unit"]})}>
                  <option value="oz">Troy Ounces</option>
                  <option value="g">Grams</option>
                </select>
              </div>
            </div>
            <div className="col-md-2">
              <label className="form-label">Karat</label>
              <select className="form-select" value={form.karat ?? 24} onChange={e=>setForm({...form, karat: parseInt(e.target.value)})}>
                <option value={24}>24K</option>
                <option value={22}>22K</option>
                <option value={18}>18K</option>
                <option value={14}>14K</option>
                <option value={10}>10K</option>
              </select>
            </div>
            <div className="col-md-3">
              <label className="form-label">Purchase Total</label>
              <div className="input-group">
                <span className="input-group-text">{form.currency}</span>
                <input type="number" className="form-control" value={form.purchaseAmount} onChange={e=>setForm({...form, purchaseAmount: parseFloat(e.target.value||"0")})} step="0.01" />
              </div>
            </div>
            <div className="col-md-2">
              <label className="form-label">Currency</label>
              <select className="form-select" value={form.currency || 'USD'} onChange={e=>setForm({...form, currency: e.target.value})}>
                <option value="USD">USD</option>
                <option value="CNY">CNY</option>
                <option value="GBP">GBP</option>
                <option value="EUR">EUR</option>
              </select>
            </div>
            <div className="col-md-3">
              <label className="form-label">Purchase Date</label>
              <input type="date" className="form-control" value={form.purchaseDate} onChange={e=>setForm({...form, purchaseDate: e.target.value})} />
            </div>
            <div className="col-md-3">
              <label className="form-label">Vendor</label>
              <input type="text" className="form-control" value={form.vendor || ""} onChange={e=>setForm({...form, vendor: e.target.value})} />
            </div>
            <div className="col-md-4">
              <label className="form-label">Note</label>
              <input type="text" className="form-control" value={form.note || ""} onChange={e=>setForm({...form, note: e.target.value})} />
            </div>
            <div className="col-md-2 align-self-end">
              <button type="button" className="btn btn-warning w-100" onClick={addItem}>Add</button>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header"><h2 className="h5 mb-0">Holdings</h2></div>
        <div className="card-body">
          <div className="mb-3">
            <input type="text" className="form-control" placeholder="Search vendor/note/date/currency" value={search} onChange={e=>setSearch(e.target.value)} />
          </div>
          <div className="table-responsive">
            <table className="table table-striped align-middle">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Quantity</th>
                  <th>Karat</th>
                  <th>Fine oz</th>
                  <th>Cost (USD)</th>
                  <th>Current Value</th>
                  <th>P&L</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {items.filter(it => {
                  const t = search.trim().toLowerCase();
                  if (!t) return true;
                  return (
                    (it.vendor || "").toLowerCase().includes(t) ||
                    (it.note || "").toLowerCase().includes(t) ||
                    (it.currency || "").toLowerCase().includes(t) ||
                    String(it.purchaseDate || "").toLowerCase().includes(t)
                  );
                }).map(it => {
                  const row = editingId===it.id && edit ? edit : it;
                  const fine = toOz(row.quantity, row.unit) * (row.karat ? row.karat/24 : 1);
                  const usdCost = row.purchaseAmount / (fx[row.currency || 'USD'] || 1);
                  const spot = goldPrice ?? goldPriceCached;
                  const curUsd = spot!=null ? fine * spot : 0;
                  const pnlUsd = curUsd - usdCost;
                  const rate = fx[displayCurrency] || 1;
                  const cost = usdCost * rate;
                  const cur = curUsd * rate;
                  const pnl = pnlUsd * rate;
                  return (
                    <tr key={it.id}>
                      <td>
                        {editingId===it.id && edit ? (
                          <input type="date" className="form-control form-control-sm" value={row.purchaseDate} onChange={e=>setEdit({ ...row, purchaseDate: e.target.value })} />
                        ) : (
                          row.purchaseDate
                        )}
                      </td>
                      <td>
                        {editingId===it.id && edit ? (
                          <div className="input-group input-group-sm">
                            <input type="number" className="form-control" value={row.quantity} onChange={e=>setEdit({ ...row, quantity: parseFloat(e.target.value||"0") })} step="0.001" />
                            <select className="form-select" value={row.unit} onChange={e=>setEdit({ ...row, unit: e.target.value as Holding["unit"] })}>
                              <option value="oz">Troy Ounces</option>
                              <option value="g">Grams</option>
                            </select>
                          </div>
                        ) : (
                          <>{format(row.quantity)} {row.unit.toUpperCase()}</>
                        )}
                      </td>
                      <td>
                        {editingId===it.id && edit ? (
                          <select className="form-select form-select-sm" value={row.karat ?? 24} onChange={e=>setEdit({ ...row, karat: parseInt(e.target.value) })}>
                            <option value={24}>24K</option>
                            <option value={22}>22K</option>
                            <option value={18}>18K</option>
                            <option value={14}>14K</option>
                            <option value={10}>10K</option>
                          </select>
                        ) : (
                          <>{row.karat ?? 24}K</>
                        )}
                      </td>
                      <td>{format(fine)}</td>
                      <td>
                        {editingId===it.id && edit ? (
                          <>
                            <div className="input-group input-group-sm">
                              <span className="input-group-text">{row.currency}</span>
                              <input type="number" className="form-control" value={row.purchaseAmount} onChange={e=>setEdit({ ...row, purchaseAmount: parseFloat(e.target.value||"0") })} step="0.01" />
                              <select className="form-select" value={row.currency || 'USD'} onChange={e=>setEdit({ ...row, currency: e.target.value })}>
                                <option value="USD">USD</option>
                                <option value="CNY">CNY</option>
                                <option value="GBP">GBP</option>
                                <option value="EUR">EUR</option>
                              </select>
                            </div>
                            <div className="small text-muted mt-1">{displayCurrency} {format(cost)} ({row.currency})</div>
                          </>
                        ) : (
                          <>{displayCurrency} {format(cost)} <span className="text-muted">({row.currency})</span></>
                        )}
                      </td>
                      <td>{`${displayCurrency} ${format(cur)}`}</td>
                      <td><span className={`badge ${pnl>=0?"bg-success":"bg-danger"}`}>{pnl>=0?"+":"-"}{format(Math.abs(pnl))}</span></td>
                      <td>
                        {editingId===it.id && edit ? (
                          <div className="btn-group btn-group-sm">
                            <button className="btn btn-success" onClick={saveEdit}>Save</button>
                            <button className="btn btn-secondary" onClick={cancelEdit}>Cancel</button>
                          </div>
                        ) : (
                          <>
                            <button className="btn btn-outline-primary btn-sm me-2" onClick={()=>startEdit(it)}>Edit</button>
                            <button className="btn btn-outline-danger btn-sm" onClick={()=>removeItem(it.id)}>Delete</button>
                          </>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

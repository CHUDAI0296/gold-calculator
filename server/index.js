const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());

function parseUSD(val){
  if (typeof val === 'number') return val;
  if (val && typeof val === 'object') return val.USD || val.usd || Number(Object.values(val)[0]);
  return null;
}

app.get('/api/gold/timeseries', async (req, res) => {
  try {
    const { start_date, end_date } = req.query;
    const nasdaqKey = process.env.NASDAQ_API_KEY;
    if (nasdaqKey) {
      try {
        const urlNasdaq = `https://data.nasdaq.com/api/v3/datasets/LBMA/GOLD.json?api_key=${encodeURIComponent(nasdaqKey)}&start_date=${encodeURIComponent(start_date)}&end_date=${encodeURIComponent(end_date)}`;
        const nr = await fetch(urlNasdaq, { headers: { 'Accept': 'application/json' } });
        if (nr.ok) {
          const nd = await nr.json();
          const dataset = nd && nd.dataset;
          const rows = dataset && dataset.data || [];
          const out = [];
          for (const row of rows) {
            const dateStr = row[0];
            const am = typeof row[1] === 'number' ? row[1] : parseFloat(row[1]);
            const pm = typeof row[2] === 'number' ? row[2] : parseFloat(row[2]);
            const price = isFinite(pm) ? pm : (isFinite(am) ? am : null);
            if (price) {
              const ts = new Date(dateStr).getTime() / 1000;
              out.push({ price: parseFloat(price), timestamp: ts, date: new Date(ts*1000).toISOString() });
            }
          }
          return res.json(out.sort((a,b)=>a.timestamp-b.timestamp));
        }
      } catch (e) {}
    }
    const freeUrl = `https://api.exchangerate.host/timeseries?start_date=${encodeURIComponent(start_date)}&end_date=${encodeURIComponent(end_date)}&base=XAU&symbols=USD`;
    const fr = await fetch(freeUrl, { headers:{ 'Accept':'application/json' } });
    if (!fr.ok) return res.status(fr.status).json({ error: 'upstream_error' });
    const d2 = await fr.json();
    const out2 = [];
    if (d2 && d2.rates){
      Object.keys(d2.rates).sort().forEach(k => {
        const val = d2.rates[k] && d2.rates[k].USD;
        if (val){ const ts = new Date(k).getTime()/1000; out2.push({ price: parseFloat(val), timestamp: ts, date: new Date(ts*1000).toISOString() }); }
      });
    }
    res.json(out2);
  } catch (e){
    res.status(500).json({ error: 'server_error' });
  }
});

app.get('/api/timeseries', async (req, res) => {
  try {
    const { start_date, end_date, metal } = req.query;
    const map = { XAU: 'XAU', XAG: 'XAG', XPT: 'XPT', gold: 'XAU', silver: 'XAG', platinum: 'XPT' };
    const base = map[(metal || 'XAU')];
    const nasdaqKey = process.env.NASDAQ_API_KEY;
    if (base === 'XAU' && nasdaqKey) {
      try {
        const urlNasdaq = `https://data.nasdaq.com/api/v3/datasets/LBMA/GOLD.json?api_key=${encodeURIComponent(nasdaqKey)}&start_date=${encodeURIComponent(start_date)}&end_date=${encodeURIComponent(end_date)}`;
        const nr = await fetch(urlNasdaq, { headers: { 'Accept': 'application/json' } });
        if (nr.ok) {
          const nd = await nr.json();
          const dataset = nd && nd.dataset;
          const rows = dataset && dataset.data || [];
          const out = [];
          for (const row of rows) {
            const dateStr = row[0];
            const am = typeof row[1] === 'number' ? row[1] : parseFloat(row[1]);
            const pm = typeof row[2] === 'number' ? row[2] : parseFloat(row[2]);
            const price = isFinite(pm) ? pm : (isFinite(am) ? am : null);
            if (price) {
              const ts = new Date(dateStr).getTime() / 1000;
              out.push({ price: parseFloat(price), timestamp: ts, date: new Date(ts*1000).toISOString() });
            }
          }
          return res.json(out.sort((a,b)=>a.timestamp-b.timestamp));
        }
      } catch (e) {}
    }
    const freeUrl = `https://api.exchangerate.host/timeseries?start_date=${encodeURIComponent(start_date)}&end_date=${encodeURIComponent(end_date)}&base=${base}&symbols=USD`;
    const fr = await fetch(freeUrl, { headers:{ 'Accept':'application/json' } });
    if (!fr.ok) return res.status(fr.status).json({ error: 'upstream_error' });
    const d2 = await fr.json();
    const out2 = [];
    if (d2 && d2.rates){
      Object.keys(d2.rates).sort().forEach(k => {
        const val = d2.rates[k] && d2.rates[k].USD;
        if (val){ const ts = new Date(k).getTime()/1000; out2.push({ price: parseFloat(val), timestamp: ts, date: new Date(ts*1000).toISOString() }); }
      });
    }
    res.json(out2);
  } catch (e){
    res.status(500).json({ error: 'server_error' });
  }
});

app.get('/api/spot/:metal', async (req, res) => {
  try {
    const metalMap = { gold: { symbol: 'XAU', metalsLive: 'gold' }, silver: { symbol: 'XAG', metalsLive: 'silver' }, platinum: { symbol: 'XPT', metalsLive: 'platinum' } };
    const m = metalMap[req.params.metal];
    if (!m) return res.status(400).json({ error: 'invalid_metal' });
    const goldToken = process.env.GOLDAPI_TOKEN;
    const endpoints = [];
    if (goldToken) {
      endpoints.push({ url: `https://api.goldapi.net/v1/price/${m.symbol}/USD`, headers: { 'x-access-token': goldToken, 'Accept':'application/json' } });
      endpoints.push({ url: `https://www.goldapi.io/api/${m.symbol}/USD`, headers: { 'x-access-token': goldToken, 'Accept':'application/json' } });
    }
    endpoints.push({ url: `https://api.metals.live/v1/spot/${m.metalsLive}`, headers: { 'Accept':'application/json' } });
    endpoints.push({ url: `https://api.exchangerate.host/latest?base=${m.symbol}&symbols=USD`, headers: { 'Accept':'application/json' } });
    for (const ep of endpoints){
      try {
        const r = await fetch(ep.url, { headers: ep.headers });
        if (!r.ok) continue;
        const data = await r.json();
        let price = null;
        if (Array.isArray(data)){
          const last = data[data.length-1];
          if (typeof last === 'number') price = last;
          else if (Array.isArray(last)){ const nums = last.filter(v => typeof v === 'number'); if (nums.length) price = nums[nums.length-1]; }
          else if (last && typeof last === 'object'){ price = last.price || parseFloat(last.USD || last.usd || Object.values(last)[0]); }
        } else {
          price = data.price || data.rate || (data.rates && data.rates.USD) || parseFloat(data.USD || data.usd);
        }
        if (price) return res.json({ price: parseFloat(price) });
      } catch(e){ continue; }
    }
    res.status(502).json({ error: 'no_price' });
  } catch(e){
    res.status(500).json({ error: 'server_error' });
  }
});
app.get('/api/spot/gold', async (req, res) => {
  try {
    const goldToken = process.env.GOLDAPI_TOKEN;
    const endpoints = [];
    if (goldToken) {
      endpoints.push({ url: 'https://api.goldapi.net/v1/price/XAU/USD', headers: { 'x-access-token': goldToken, 'Accept':'application/json' } });
      endpoints.push({ url: 'https://www.goldapi.io/api/XAU/USD', headers: { 'x-access-token': goldToken, 'Accept':'application/json' } });
    }
    endpoints.push({ url: 'https://api.metals.live/v1/spot/gold', headers: { 'Accept':'application/json' } });
    endpoints.push({ url: 'https://api.exchangerate.host/latest?base=XAU&symbols=USD', headers: { 'Accept':'application/json' } });
    for (const ep of endpoints){
      try {
        const r = await fetch(ep.url, { headers: ep.headers });
        if (!r.ok) continue;
        const data = await r.json();
        let price = null;
        if (Array.isArray(data)){
          const last = data[data.length-1];
          if (typeof last === 'number') price = last;
          else if (Array.isArray(last)){ const nums = last.filter(v => typeof v === 'number'); if (nums.length) price = nums[nums.length-1]; }
          else if (last && typeof last === 'object'){ price = last.price || parseUSD(last); }
        } else {
          price = data.price || data.rate || (data.rates && data.rates.USD) || parseUSD(data);
        }
        if (price) return res.json({ price: parseFloat(price) });
      } catch(e){ continue; }
    }
    res.status(502).json({ error: 'no_price' });
  } catch(e){
    res.status(500).json({ error: 'server_error' });
  }
});

app.get('/api/status', (req, res) => {
  res.json({
    goldapi: !!process.env.GOLDAPI_TOKEN,
    nasdaq: !!process.env.NASDAQ_API_KEY,
    metalprice: !!process.env.METALPRICE_API_KEY
  });
});

// Candlestick data via Yahoo Finance (GC=F)
app.get('/api/gold/candles', async (req, res) => {
  try {
    const days = parseInt(req.query.days || '30', 10);
    let range = '1mo', interval = '1d';
    if (days <= 7) { range = '7d'; interval = '1h'; }
    else if (days <= 30) { range = '1mo'; interval = '1d'; }
    else if (days <= 90) { range = '3mo'; interval = '1d'; }
    else if (days <= 365) { range = '1y'; interval = '1d'; }
    else { range = '2y'; interval = '1d'; }

    const url = `https://query1.finance.yahoo.com/v8/finance/chart/GC=F?range=${range}&interval=${interval}&includePrePost=false`;
    const r = await fetch(url, { headers: { 'Accept': 'application/json' } });
    if (!r.ok) return res.status(r.status).json({ error: 'upstream_error' });
    const data = await r.json();
    const result = data && data.chart && data.chart.result && data.chart.result[0];
    if (!result) return res.status(502).json({ error: 'no_result' });
    const timestamps = result.timestamp || [];
    const quote = result.indicators && result.indicators.quote && result.indicators.quote[0] || {};
    const out = [];
    for (let i = 0; i < timestamps.length; i++) {
      const o = quote.open && quote.open[i];
      const h = quote.high && quote.high[i];
      const l = quote.low && quote.low[i];
      const c = quote.close && quote.close[i];
      if ([o,h,l,c].every(v => typeof v === 'number' && isFinite(v))) {
        out.push({ time: timestamps[i], open: o, high: h, low: l, close: c });
      }
    }
    res.json(out);
  } catch (e) {
    res.status(500).json({ error: 'server_error' });
  }
});

const port = process.env.PORT || 3001;
app.listen(port, () => { console.log(`server_started:${port}`); });
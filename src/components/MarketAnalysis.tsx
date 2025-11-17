"use client";
import React from "react";

function computeSMA(values: number[], period: number) {
  if (values.length < period) return null;
  const slice = values.slice(values.length - period);
  const sum = slice.reduce((a, b) => a + b, 0);
  return sum / period;
}

function computeEMA(values: number[], period: number) {
  if (values.length < period) return null;
  const k = 2 / (period + 1);
  let ema = values[0];
  for (let i = 1; i < values.length; i++) ema = values[i] * k + ema * (1 - k);
  return ema;
}

function computeMACD(values: number[]) {
  const ema12 = computeEMA(values, 12);
  const ema26 = computeEMA(values, 26);
  if (ema12 == null || ema26 == null) return null;
  const macd = ema12 - ema26;
  const signal = computeEMA(values.map((_, i) => {
    const sub = values.slice(0, i + 1);
    const e12 = computeEMA(sub, 12);
    const e26 = computeEMA(sub, 26);
    return e12 != null && e26 != null ? e12 - e26 : 0;
  }), 9);
  if (signal == null) return null;
  return { macd, signal, hist: macd - signal };
}

function computeRSI(values: number[], period = 14) {
  if (values.length <= period) return null;
  let gains = 0, losses = 0;
  for (let i = values.length - period; i < values.length; i++) {
    const diff = values[i] - values[i - 1];
    if (diff >= 0) gains += diff; else losses -= diff;
  }
  const avgGain = gains / period;
  const avgLoss = losses / period;
  if (avgLoss === 0) return 100;
  const rs = avgGain / avgLoss;
  return 100 - 100 / (1 + rs);
}

export default function MarketAnalysis() {
  const [rsi, setRsi] = React.useState<number | null>(null);
  const [macd, setMacd] = React.useState<{ macd: number; signal: number; hist: number } | null>(null);
  const [ma, setMa] = React.useState<number | null>(null);
  const [news, setNews] = React.useState<string>("Loading market news...");
  const [mode, setMode] = React.useState<string>('cfd');

  React.useEffect(() => {
    const load = async () => {
      try {
        try { const v = localStorage.getItem('price_display_mode') || 'cfd'; setMode(v) } catch {}
        const end = new Date();
        const start = new Date(end.getTime() - 90 * 24 * 60 * 60 * 1000);
        const s = start.toISOString().slice(0, 10);
        const e = end.toISOString().slice(0, 10);
        const r = await fetch(`/api/timeseries?start_date=${s}&end_date=${e}&metal=XAU`, { cache: "no-store" });
        const d = await r.json();
        if (Array.isArray(d) && d.length) {
          const prices = d.map((x: any) => x.price).filter((x: any) => typeof x === "number");
          const sma50 = computeSMA(prices, 50);
          const rsi14 = computeRSI(prices, 14);
          const macdVal = computeMACD(prices);
          if (sma50 != null) setMa(parseFloat(sma50.toFixed(2)));
          if (rsi14 != null) setRsi(parseFloat(rsi14.toFixed(2)));
          if (macdVal != null) setMacd({ macd: parseFloat(macdVal.macd.toFixed(2)), signal: parseFloat(macdVal.signal.toFixed(2)), hist: parseFloat(macdVal.hist.toFixed(2)) });
        }
      } catch {}
      // 简单新闻占位：提示用户稍后更新
      setNews("News feed will be updated soon.");
    };
    load();
  }, []);

  const m = mode === 'cfd' ? 2 : 1;

  return (
    <div className="bg-white rounded-lg shadow-md h-full">
      <div className="bg-warning text-dark p-4 rounded-t-lg">
        <h2 className="text-lg font-semibold m-0">Market Analysis</h2>
      </div>
      <div className="p-4">
        <div className="mb-6">
          <h3 className="text-base font-semibold mb-2">Technical Indicators</h3>
          <ul className="space-y-2">
            <li>RSI: <span className="text-gray-600">{rsi != null ? rsi : "Loading..."}</span></li>
            <li>MACD: <span className="text-gray-600">{macd != null ? `${(macd.macd*m).toFixed(2)} / ${(macd.signal*m).toFixed(2)} (${(macd.hist*m).toFixed(2)})` : "Loading..."}</span></li>
            <li>Moving Average: <span className="text-gray-600">{ma != null ? (ma*m).toFixed(2) : "Loading..."}</span></li>
          </ul>
        </div>
        <div>
          <h3 className="text-base font-semibold mb-2">Market News</h3>
          <div className="text-sm text-gray-600">{news}</div>
        </div>
      </div>
    </div>
  );
}
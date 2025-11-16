'use client';

import React from 'react';

interface TradingViewProps {
  containerId: string;
  height?: number;
}

declare global {
  interface Window {
    TradingView: {
      widget: new (config: any) => any;
    };
  }
}

export default function TradingView({ containerId, height = 400 }: TradingViewProps) {
  const initializeTradingView = () => {
    try {
      const script = document.createElement('script');
      script.src = 'https://s3.tradingview.com/tv.js';
      script.async = true;
      let fallbackTimer: number | undefined;
      const startFallback = () => {
        const cdn = document.createElement('script');
        cdn.src = 'https://cdn.jsdelivr.net/npm/lightweight-charts@4.2.0/dist/lightweight-charts.standalone.production.js';
        cdn.async = true;
        cdn.onload = async () => {
          try {
            const el = document.getElementById(containerId);
            if (!el || !(window as any).LightweightCharts) return;
            const chart = (window as any).LightweightCharts.createChart(el, { width: el.clientWidth, height, layout: { background: { color: '#ffffff' }, textColor: '#333' }, grid: { vertLines: { color: '#eee' }, horzLines: { color: '#eee' } }, timeScale: { borderColor: '#ccc' }, rightPriceScale: { borderColor: '#ccc' } });
            const series = chart.addCandlestickSeries({ upColor: '#26a69a', downColor: '#ef5350', borderDownColor: '#ef5350', borderUpColor: '#26a69a', wickDownColor: '#ef5350', wickUpColor: '#26a69a' });
            const resp = await fetch('/api/gold-candles?days=30', { cache: 'no-store' });
            const data = await resp.json();
            if (Array.isArray(data)) series.setData(data);
          } catch {}
        };
        document.head.appendChild(cdn);
      };
      script.onload = () => {
        if (fallbackTimer) window.clearTimeout(fallbackTimer);
        if (typeof window.TradingView === 'undefined') { startFallback(); return; }

        new window.TradingView.widget({
          autosize: true,
          symbol: 'TVC:GOLD',
          interval: 'D',
          timezone: 'Etc/UTC',
          theme: 'light',
          style: '1',
          locale: 'en',
          toolbar_bg: '#f1f3f6',
          enable_publishing: false,
          allow_symbol_change: false,
          container_id: containerId,
          save_image: false
        });
      };

      script.onerror = () => {
        startFallback();
      };

      fallbackTimer = window.setTimeout(() => startFallback(), 4000);
      document.head.appendChild(script);
    } catch (error) {
      const el = document.getElementById(containerId);
      if (!el) return;
    }
  };

  React.useEffect(() => {
    initializeTradingView();
  }, []);

  return <div id={containerId} style={{ height: `${height}px` }} data-testid="tradingview-container" />;
}
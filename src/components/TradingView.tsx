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
      let didFallback = false;
      const startFallback = () => {
        if (didFallback) return;
        didFallback = true;
        try {
          const el = document.getElementById(containerId);
          if (!el) return;
          el.innerHTML = '';
          const wrap = document.createElement('div');
          wrap.className = 'tradingview-widget-container';
          const inner = document.createElement('div');
          inner.className = 'tradingview-widget-container__widget';
          inner.style.height = `${height}px`;
          wrap.appendChild(inner);
          const scr = document.createElement('script');
          scr.type = 'text/javascript';
          scr.src = 'https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js';
          scr.async = true;
          scr.innerHTML = JSON.stringify({
            autosize: true,
            symbol: 'TVC:GOLD',
            interval: 'D',
            timezone: 'Etc/UTC',
            theme: 'light',
            style: '1',
            locale: 'en',
            toolbar_bg: '#f1f3f6',
            enable_publishing: false,
            allow_symbol_change: false
          });
          wrap.appendChild(scr);
          el.appendChild(wrap);
        } catch {}
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

        window.setTimeout(() => {
          try {
            const el = document.getElementById(containerId);
            if (!el) { startFallback(); return; }
            const hasIframe = !!el.querySelector('iframe');
            if (!hasIframe) startFallback();
          } catch { startFallback(); }
        }, 5000);
        // 强制兜底：8秒后仍未兜底则执行兜底
        window.setTimeout(() => { startFallback(); }, 8000);
      };

      script.onerror = () => {
        startFallback();
      };

      fallbackTimer = window.setTimeout(() => startFallback(), 3000);
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
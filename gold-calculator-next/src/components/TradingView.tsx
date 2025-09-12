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
      script.onload = () => {
        if (typeof window.TradingView === 'undefined') {
          console.error('TradingView is not loaded');
          return;
        }

        new window.TradingView.widget({
          autosize: true,
          symbol: 'GOLD',
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
        console.error('Failed to load TradingView script');
      };

      document.head.appendChild(script);
    } catch (error) {
      console.error('Error initializing TradingView:', error);
    }
  };

  React.useEffect(() => {
    initializeTradingView();
  }, []);

  return <div id={containerId} style={{ height: `${height}px` }} data-testid="tradingview-container" />;
}
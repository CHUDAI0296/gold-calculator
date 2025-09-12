'use client';

interface MarketData {
  price: number;
  timestamp: number;
}

class MarketChart {
  private tradingViewWidget: any;
  private historicalData: MarketData[];

  constructor() {
    this.historicalData = [];
    this.initializeTradingView();
    this.initializeEventListeners();
    this.loadMarketData();
    this.loadMarketNews();
  }

  private initializeTradingView(): void {
    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/tv.js';
    script.async = true;
    script.onload = () => {
      if (typeof TradingView !== 'undefined') {
        new TradingView.widget({
          "width": "100%",
          "height": 400,
          "symbol": "GOLD",
          "interval": "D",
          "timezone": "Etc/UTC",
          "theme": "light",
          "style": "1",
          "locale": "en",
          "toolbar_bg": "#f1f3f6",
          "enable_publishing": false,
          "allow_symbol_change": false,
          "container_id": "priceChart"
        });
      }
    };
    document.head.appendChild(script);
  }

  private initializeEventListeners(): void {
    const periodButtons = document.querySelectorAll('[data-period]');
    periodButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        const period = (e.target as HTMLElement).getAttribute('data-period');
        this.updateChartPeriod(period);
        
        // 更新按钮状态
        periodButtons.forEach(btn => btn.classList.remove('active'));
        (e.target as HTMLElement).classList.add('active');
      });
    });
  }

  private async loadMarketData(): Promise<void> {
    try {
      const response = await fetch('https://api.metals.live/v1/spot/gold');
      const data = await response.json();
      this.updateMarketStats(data[0]);
    } catch (error) {
      console.error('Error loading market data:', error);
    }
  }

  private updateMarketStats(data: any): void {
    if (!data) return;

    // 更新市场统计数据
    const elements = {
      '24hHigh': document.getElementById('24hHigh'),
      '24hLow': document.getElementById('24hLow'),
      '24hChange': document.getElementById('24hChange'),
      'volume': document.getElementById('volume'),
      'rsiValue': document.getElementById('rsiValue'),
      'macdValue': document.getElementById('macdValue'),
      'maValue': document.getElementById('maValue')
    };

    if (elements['24hHigh']) elements['24hHigh'].textContent = `$${data.high.toFixed(2)}`;
    if (elements['24hLow']) elements['24hLow'].textContent = `$${data.low.toFixed(2)}`;
    if (elements['24hChange']) {
      const change = ((data.price - data.open) / data.open * 100).toFixed(2);
      elements['24hChange'].textContent = `${change}%`;
      elements['24hChange'].className = parseFloat(change) >= 0 ? 'text-success' : 'text-danger';
    }
    if (elements['volume']) elements['volume'].textContent = `$${(data.volume / 1000000).toFixed(2)}M`;

    // 更新技术指标
    if (elements['rsiValue']) elements['rsiValue'].textContent = this.calculateRSI(data.price).toFixed(2);
    if (elements['macdValue']) elements['macdValue'].textContent = this.calculateMACD(data.price).toFixed(2);
    if (elements['maValue']) elements['maValue'].textContent = `$${this.calculateMA(data.price).toFixed(2)}`;
  }

  private calculateRSI(price: number): number {
    // 简化的RSI计算
    return 50 + (Math.random() * 20 - 10); // 模拟值
  }

  private calculateMACD(price: number): number {
    // 简化的MACD计算
    return (Math.random() * 2 - 1); // 模拟值
  }

  private calculateMA(price: number): number {
    // 简化的移动平均线计算
    return price * (1 + (Math.random() * 0.02 - 0.01)); // 模拟值
  }

  private updateChartPeriod(period: string | null): void {
    if (!period) return;
    
    // 更新TradingView图表的时间周期
    if (this.tradingViewWidget) {
      const intervals: { [key: string]: string } = {
        '1d': '60',
        '1w': 'D',
        '1m': 'W',
        '1y': 'M'
      };
      this.tradingViewWidget.setInterval(intervals[period]);
    }
  }

  private async loadMarketNews(): Promise<void> {
    const newsContainer = document.getElementById('marketNews');
    if (!newsContainer) return;

    try {
      // 这里应该替换为实际的新闻API
      const mockNews = [
        {
          title: 'Gold Prices Surge Amid Global Economic Uncertainty',
          date: new Date().toLocaleDateString(),
          source: 'Financial Times'
        },
        {
          title: 'Central Banks Continue Gold Buying Spree',
          date: new Date().toLocaleDateString(),
          source: 'Reuters'
        },
        {
          title: 'Gold Mining Stocks Rally on Production Reports',
          date: new Date().toLocaleDateString(),
          source: 'Bloomberg'
        }
      ];

      newsContainer.innerHTML = mockNews.map(news => `
        <a href="#" class="list-group-item list-group-item-action">
          <div class="d-flex w-100 justify-content-between">
            <h5 class="mb-1">${news.title}</h5>
            <small class="text-muted">${news.date}</small>
          </div>
          <small class="text-muted">Source: ${news.source}</small>
        </a>
      `).join('');

    } catch (error) {
      console.error('Error loading market news:', error);
      newsContainer.innerHTML = '<p class="text-center text-muted">Failed to load market news</p>';
    }
  }
}

// 当DOM加载完成后初始化图表
document.addEventListener('DOMContentLoaded', () => {
  new MarketChart();
});
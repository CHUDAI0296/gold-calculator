import { Metadata } from 'next';
import JsonLd from '@/components/JsonLd';
import TradingView from '@/components/TradingView';
import MarketStats from '@/components/MarketStats';
import MarketAnalysis from '@/components/MarketAnalysis';
import DisplayModeToggle from '@/components/DisplayModeToggle';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Gold Market Charts – Real‑Time Price, Trends and Technicals',
  description: 'Interactive gold price charts with 24h high/low, MACD/RSI, moving averages and market headlines. Analyze trends to time your trades better.',
  alternates: {
    canonical: 'https://www.goldcalculator.click/market'
  },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } }
};

export default function Market() {
  return (
    <div className="market-page">
      <JsonLd type="market" />
      <div className="container py-5 relative">
      <h1 className="text-center mb-4">Gold Market Charts</h1>
      <div className="flex justify-center mb-3"><DisplayModeToggle /></div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        <div className="md:col-span-8">
          <div className="bg-white rounded-lg shadow-md h-full">
            <div className="bg-warning text-dark p-4 rounded-t-lg">
              <h2 className="text-lg font-semibold m-0">Gold Price Chart</h2>
            </div>
            <div className="p-4">
              <TradingView containerId="priceChart" height={400} />
            </div>
          </div>
        </div>
        <div className="md:col-span-4">
          <MarketStats />
        </div>
      </div>
      <div className="mt-4">
        <MarketAnalysis />
      </div>

      {/* Market news is rendered inside MarketAnalysis now */}
      </div>
    </div>
  );
}
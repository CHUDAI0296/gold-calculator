import { Metadata } from 'next';
import JsonLd from '@/components/JsonLd';
import TradingView from '@/components/TradingView';
import MarketStats from '@/components/MarketStats';
import MarketAnalysis from '@/components/MarketAnalysis';

export const metadata: Metadata = {
  title: 'Gold Market Charts - Live Gold Price Charts and Analysis',
  description: 'View real-time gold price charts, historical data, and market analysis. Track gold price trends and make informed investment decisions.',
  alternates: {
    canonical: 'https://www.goldcalculator.click/market'
  }
};

export default function Market() {
  return (
    <div className="market-page">
      <JsonLd type="market" />
      <div className="container py-5 relative">
      <h1 className="text-center mb-4">Gold Market Charts</h1>

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

      <div className="mt-4">
        <div className="bg-white rounded-lg shadow-md">
          <div className="bg-warning text-dark p-4 rounded-t-lg">
            <h2 className="text-lg font-semibold m-0">Market News</h2>
          </div>
          <div className="p-4">
            <div id="marketNews" className="divide-y divide-gray-200">
              {/* News items will be dynamically inserted here */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
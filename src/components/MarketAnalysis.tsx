'use client';

export default function MarketAnalysis() {
  return (
    <div className="bg-white rounded-lg shadow-md h-full">
      <div className="bg-warning text-dark p-4 rounded-t-lg">
        <h2 className="text-lg font-semibold m-0">Market Analysis</h2>
      </div>
      <div className="p-4">
        <div className="mb-6">
          <h3 className="text-base font-semibold mb-2">Technical Indicators</h3>
          <ul className="space-y-2">
            <li>RSI: <span id="rsi" className="text-gray-600">Loading...</span></li>
            <li>MACD: <span id="macd" className="text-gray-600">Loading...</span></li>
            <li>Moving Average: <span id="ma" className="text-gray-600">Loading...</span></li>
          </ul>
        </div>
        <div>
          <h3 className="text-base font-semibold mb-2">Market News</h3>
          <div id="marketNews" className="text-sm text-gray-600">
            Loading market news...
          </div>
        </div>
      </div>
    </div>
  );
}
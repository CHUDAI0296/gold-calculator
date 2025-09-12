import { Metadata } from 'next';
import JsonLd from '@/components/JsonLd';

export const metadata: Metadata = {
  title: 'Gold Market Charts - Live Gold Price Charts and Analysis',
  description: 'View real-time gold price charts, historical data, and market analysis. Track gold price trends and make informed investment decisions.',
  alternates: {
    canonical: 'https://www.goldcalculator.click/market'
  }
};

export default async function Market() {
  // 获取历史金价数据
  const getHistoricalData = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/historical-price?period=1m', {
        next: { revalidate: 3600 } // 1小时缓存
      });
      return await response.json();
    } catch (error) {
      console.error('Error fetching historical data:', error);
      return null;
    }
  };

  const historicalData = await getHistoricalData();

  return (
    <>
      <JsonLd type="market" />
      <div className="container py-5">
      <h1 className="text-center mb-4">Gold Market Charts</h1>

      <div className="row">
        <div className="col-12 mb-4">
          <div className="card">
            <div className="card-header bg-warning text-dark d-flex justify-content-between align-items-center">
              <h2 className="h5 mb-0">Live Gold Price Chart</h2>
              <div className="btn-group">
                <button className="btn btn-sm btn-outline-dark" data-period="1d">1D</button>
                <button className="btn btn-sm btn-outline-dark" data-period="1w">1W</button>
                <button className="btn btn-sm btn-outline-dark active" data-period="1m">1M</button>
                <button className="btn btn-sm btn-outline-dark" data-period="1y">1Y</button>
              </div>
            </div>
            <div className="card-body">
              <div id="priceChart" style={{ height: '400px' }}>
                {/* TradingView Widget will be inserted here */}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-md-6 mb-4">
          <div className="card h-100">
            <div className="card-header bg-warning text-dark">
              <h2 className="h5 mb-0">Market Statistics</h2>
            </div>
            <div className="card-body">
              <table className="table">
                <tbody>
                  <tr>
                    <th>24h High</th>
                    <td id="24hHigh">Loading...</td>
                  </tr>
                  <tr>
                    <th>24h Low</th>
                    <td id="24hLow">Loading...</td>
                  </tr>
                  <tr>
                    <th>24h Change</th>
                    <td id="24hChange">Loading...</td>
                  </tr>
                  <tr>
                    <th>Volume</th>
                    <td id="volume">Loading...</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="col-md-6 mb-4">
          <div className="card h-100">
            <div className="card-header bg-warning text-dark">
              <h2 className="h5 mb-0">Market Analysis</h2>
            </div>
            <div className="card-body">
              <div className="mb-3">
                <h3 className="h6">Technical Indicators</h3>
                <div id="technicalIndicators">
                  <div className="d-flex justify-content-between mb-2">
                    <span>RSI (14)</span>
                    <span id="rsiValue">Loading...</span>
                  </div>
                  <div className="d-flex justify-content-between mb-2">
                    <span>MACD</span>
                    <span id="macdValue">Loading...</span>
                  </div>
                  <div className="d-flex justify-content-between">
                    <span>Moving Average (20)</span>
                    <span id="maValue">Loading...</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="h6">Market Sentiment</h3>
                <div id="marketSentiment">
                  <div className="progress mb-2">
                    <div className="progress-bar bg-success" role="progressbar" style={{ width: '60%' }}>
                      Bullish 60%
                    </div>
                  </div>
                  <div className="progress">
                    <div className="progress-bar bg-danger" role="progressbar" style={{ width: '40%' }}>
                      Bearish 40%
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-header bg-warning text-dark">
              <h2 className="h5 mb-0">Market News</h2>
            </div>
            <div className="card-body">
              <div id="marketNews" className="list-group list-group-flush">
                {/* News items will be dynamically inserted here */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
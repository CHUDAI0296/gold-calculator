'use client';

export default function MarketStats() {
  return (
    <div className="bg-white rounded-lg shadow-md h-full">
      <div className="bg-warning text-dark p-4 rounded-t-lg">
        <h2 className="text-lg font-semibold m-0">Market Statistics</h2>
      </div>
      <div className="p-4">
        <table className="w-full">
          <tbody className="divide-y divide-gray-200">
            <tr>
              <th className="py-2 text-left">24h High</th>
              <td id="24hHigh" className="py-2">Loading...</td>
            </tr>
            <tr>
              <th className="py-2 text-left">24h Low</th>
              <td id="24hLow" className="py-2">Loading...</td>
            </tr>
            <tr>
              <th className="py-2 text-left">24h Change</th>
              <td id="24hChange" className="py-2">Loading...</td>
            </tr>
            <tr>
              <th className="py-2 text-left">Volume</th>
              <td id="volume" className="py-2">Loading...</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
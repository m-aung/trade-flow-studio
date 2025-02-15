import React from 'react';
import { useMarketData } from '../hooks/useMarketData';
import Card from '../components/ui/Card';

const Dashboard: React.FC = () => {
  const btcData = useMarketData('BTC-USD');
  const ethData = useMarketData('ETH-USD');

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card title="Market Overview">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span>BTC/USD</span>
              <span className="font-mono">{btcData?.price || 'Loading...'}</span>
            </div>
            <div className="flex justify-between items-center">
              <span>ETH/USD</span>
              <span className="font-mono">{ethData?.price || 'Loading...'}</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard; 
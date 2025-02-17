import { useState, useEffect } from 'react';
import { useWebSocket } from './useWebSocket';

interface MarketData {
  symbol: string;
  price: number;
  timestamp: Date;
}

export const useMarketData = (symbol: string) => {
  const [marketData, setMarketData] = useState<MarketData | null>(null);
  const { socket, isConnected } = useWebSocket();

  useEffect(() => {
    if (!socket || !isConnected) return;

    // Subscribe to market data updates
    socket.emit('subscribeMarketData', { symbol });

    const handleMarketUpdate = (data: { symbol: string; data: MarketData }) => {
      if (data.symbol === symbol) {
        setMarketData({
          ...data.data,
          timestamp: new Date(data.data.timestamp)
        });
      }
    };

    socket.on('marketUpdate', handleMarketUpdate);

    return () => {
      socket.off('marketUpdate', handleMarketUpdate);
      socket.emit('unsubscribeMarketData', { symbol });
    };
  }, [symbol, socket, isConnected]);

  return marketData;
};

export default useMarketData; 
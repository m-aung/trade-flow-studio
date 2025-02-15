import { useState, useEffect } from 'react';
import { useWebSocket } from './useWebSocket';
import { Socket } from 'socket.io-client';

interface MarketData {
  symbol: string;
  price: number;
  timestamp: Date;
}

export const useMarketData = (symbol: string) => {
  const [marketData, setMarketData] = useState<MarketData | null>(null);
  const { socket } = useWebSocket();

  useEffect(() => {
    if (!socket) return;

    // Subscribe to market data updates
    socket.on('marketUpdate', (data: { symbol: string; data: MarketData }) => {
      if (data.symbol === symbol) {
        setMarketData({
          ...data.data,
          timestamp: new Date(data.data.timestamp)
        });
      }
    });

    // Request initial market data
    socket.emit('subscribeMarketData', { symbol });

    return () => {
      socket.off('marketUpdate');
      socket.emit('unsubscribeMarketData', { symbol });
    };
  }, [symbol, socket]);

  return marketData;
}; 
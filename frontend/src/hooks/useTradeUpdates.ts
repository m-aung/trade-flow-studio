import { useState, useEffect } from 'react';
import { useWebSocket } from './useWebSocket';

interface Trade {
  trade_id: string;
  symbol: string;
  type: 'BUY' | 'SELL';
  quantity: number;
  price: number;
  status: 'PENDING' | 'COMPLETED' | 'CANCELLED';
  executed_at?: Date;
}

interface TradeUpdate {
  type: 'UPDATE';
  data: Trade;
}

export const useTradeUpdates = () => {
  const [trades, setTrades] = useState<Trade[]>([]);
  const { sendMessage } = useWebSocket();

  useEffect(() => {
    const socket = socketRef.current;
    if (!socket) return;

    socket.on('tradeUpdate', (update: TradeUpdate) => {
      setTrades(prevTrades => {
        const index = prevTrades.findIndex(t => t.trade_id === update.data.trade_id);
        if (index === -1) {
          return [...prevTrades, update.data];
        }
        const newTrades = [...prevTrades];
        newTrades[index] = update.data;
        return newTrades;
      });
    });

    socket.on('tradeExecution', ({ tradeId, status }) => {
      setTrades(prevTrades => 
        prevTrades.map(trade => 
          trade.trade_id === tradeId 
            ? { ...trade, status } 
            : trade
        )
      );
    });

    return () => {
      socket.off('tradeUpdate');
      socket.off('tradeExecution');
    };
  }, []);

  return trades;
}; 
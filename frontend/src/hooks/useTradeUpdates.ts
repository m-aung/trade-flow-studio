import { useState, useEffect } from 'react';
import { useWebSocket } from './useWebSocket';

export type TradeStatus = 'PENDING' | 'COMPLETED' | 'CANCELLED';

interface Trade {
  trade_id: string;
  symbol: string;
  type: 'BUY' | 'SELL';
  quantity: number;
  price: number;
  status: TradeStatus;
  executed_at?: Date;
}

interface TradeUpdate {
  type: 'UPDATE';
  data: Trade;
}

interface TradeExecution {
  tradeId: string;
  status: TradeStatus;
}

export const useTradeUpdates = () => {
  const [trades, setTrades] = useState<Trade[]>([]);
  const { socket, isConnected } = useWebSocket();

  useEffect(() => {
    if (!socket || !isConnected) return;

    const handleTradeUpdate = (update: TradeUpdate) => {
      setTrades(prevTrades => {
        const index = prevTrades.findIndex(t => t.trade_id === update.data.trade_id);
        if (index === -1) {
          return [...prevTrades, update.data];
        }
        const newTrades = [...prevTrades];
        newTrades[index] = update.data;
        return newTrades;
      });
    };

    const handleTradeExecution = ({ tradeId, status }: TradeExecution) => {
      setTrades(prevTrades => 
        prevTrades.map(trade => 
          trade.trade_id === tradeId 
            ? { ...trade, status, executed_at: new Date() } 
            : trade
        )
      );
    };

    socket.on('tradeUpdate', handleTradeUpdate);
    socket.on('tradeExecution', handleTradeExecution);

    return () => {
      socket.off('tradeUpdate', handleTradeUpdate);
      socket.off('tradeExecution', handleTradeExecution);
    };
  }, [socket, isConnected]);

  return trades;
};

export default useTradeUpdates; 
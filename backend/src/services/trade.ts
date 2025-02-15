import { Trade } from '../models/trade';
import { wsService } from '../app';
import { AppError } from '../utils/error-handler';
import { MarketDataService } from './market-data';

export class TradeService {
  private marketDataService = MarketDataService.getInstance();

  async executeTrade(tradeId: string) {
    const trade = await Trade.findByPk(tradeId);
    
    if (!trade) {
      throw new AppError(404, 'Trade not found');
    }

    const marketData = this.marketDataService.getMarketData(trade.symbol);
    if (!marketData) {
      throw new AppError(400, 'Market data not available');
    }

    try {
      trade.status = 'COMPLETED';
      trade.executed_at = new Date();
      await trade.save();

      // Emit trade execution notification
      wsService.emitTradeExecution(trade.user_id, trade.trade_id, 'COMPLETED');
      wsService.emitTradeUpdate(trade);

      return trade;
    } catch (error) {
      trade.status = 'CANCELLED';
      await trade.save();
      wsService.emitTradeExecution(trade.user_id, trade.trade_id, 'FAILED');
      throw new AppError(500, 'Trade execution failed');
    }
  }
} 
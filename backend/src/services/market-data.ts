import { wsService } from '../app';

export class MarketDataService {
  private static instance: MarketDataService;
  private marketData: Map<string, any> = new Map();

  private constructor() {
    this.initializeMarketDataStream();
  }

  public static getInstance(): MarketDataService {
    if (!MarketDataService.instance) {
      MarketDataService.instance = new MarketDataService();
    }
    return MarketDataService.instance;
  }

  private initializeMarketDataStream() {
    // Simulate market data updates
    setInterval(() => {
      this.marketData.forEach((data, symbol) => {
        const newPrice = this.simulateNewPrice(data.price);
        const newData = {
          ...data,
          price: newPrice,
          timestamp: new Date()
        };
        this.marketData.set(symbol, newData);
        wsService.emitMarketUpdate(symbol, newData);
      });
    }, 1000);
  }

  private simulateNewPrice(currentPrice: number): number {
    const change = (Math.random() - 0.5) * 0.002; // +/- 0.2%
    return currentPrice * (1 + change);
  }

  public addSymbol(symbol: string, initialPrice: number) {
    this.marketData.set(symbol, {
      price: initialPrice,
      timestamp: new Date()
    });
  }

  public getMarketData(symbol: string) {
    return this.marketData.get(symbol);
  }
} 
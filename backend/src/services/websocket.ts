import { Server } from 'socket.io';
import { Server as HttpServer } from 'http';
import { Trade } from '../models/trade';
import { verifyToken } from '../middleware/auth';

export class WebSocketService {
  private io: Server;

  constructor(server: HttpServer) {
    this.io = new Server(server, {
      cors: {
        origin: process.env.FRONTEND_URL || 'http://localhost:3000',
        methods: ['GET', 'POST']
      }
    });

    this.initialize();
  }

  private initialize() {
    this.io.use(async (socket, next) => {
      try {
        const token = socket.handshake.auth.token;
        if (!token) {
          throw new Error('Authentication error');
        }

        const decoded = await verifyToken(token);
        socket.data.user = decoded;
        next();
      } catch (error) {
        next(new Error('Authentication error'));
      }
    });

    this.io.on('connection', (socket) => {
      console.log(`Client connected: ${socket.id}`);

      // Join user-specific room
      const userId = socket.data.user.userId;
      socket.join(`user:${userId}`);

      socket.on('disconnect', () => {
        console.log(`Client disconnected: ${socket.id}`);
      });
    });
  }

  // Emit trade updates to specific users
  public emitTradeUpdate(trade: Trade) {
    this.io.to(`user:${trade.user_id}`).emit('tradeUpdate', {
      type: 'UPDATE',
      data: trade
    });
  }

  // Emit market data updates to all connected clients
  public emitMarketUpdate(symbol: string, data: any) {
    this.io.emit('marketUpdate', {
      symbol,
      data
    });
  }

  // Emit trade execution notification
  public emitTradeExecution(userId: string, tradeId: string, status: string) {
    this.io.to(`user:${userId}`).emit('tradeExecution', {
      tradeId,
      status
    });
  }
} 
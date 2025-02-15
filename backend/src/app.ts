import express, { Express, Request, Response, NextFunction } from 'express';
import { createServer } from 'http';
import cors from 'cors';
import dotenv from 'dotenv';
import { initializeDatabase } from './config/database-init';
import { WebSocketService } from './services/websocket';

// Load environment variables
dotenv.config();

// Import routes
import authRoutes from './routes/auth';
import userRoutes from './routes/users';
import tradeRoutes from './routes/trades';

const app: Express = express();
const httpServer = createServer(app);
export const wsService = new WebSocketService(httpServer);

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Initialize database
initializeDatabase().catch(error => {
  console.error('Failed to initialize database:', error);
  process.exit(1);
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/trades', tradeRoutes);

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({
    status: 'error',
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Update server startup
const PORT = process.env.PORT || 4000;

httpServer.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app; 
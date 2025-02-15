import { Router, Request, Response } from 'express';
import { body } from 'express-validator';
import authMiddleware from '../middleware/auth';
import { validate } from '../middleware/validation';
import Trade from '../models/trade';
import { ApiResponse } from '../types';
import { handleError, AppError } from '../utils/error-handler';

const router = Router();

// Validation middleware for trade creation
const createTradeValidation = [
  body('symbol').notEmpty().trim().toUpperCase(),
  body('type').isIn(['BUY', 'SELL']),
  body('quantity').isFloat({ min: 0.00000001 }),
  body('price').isFloat({ min: 0 })
];

// Get user trades
router.get('/', authMiddleware, async (req: Request, res: Response) => {
  try {
    const trades = await Trade.findAll({
      where: { user_id: req.user?.userId },
      order: [['created_at', 'DESC']]
    });

    const response: ApiResponse = {
      status: 'success',
      data: trades
    };

    res.json(response);
  } catch (error) {
    handleError(res, error);
  }
});

// Create new trade
router.post('/', 
  authMiddleware, 
  validate(createTradeValidation),
  async (req: Request, res: Response) => {
    try {
      const { symbol, type, quantity, price } = req.body;

      const trade = await Trade.create({
        user_id: req.user!.userId,
        symbol,
        type,
        quantity,
        price,
        status: 'PENDING'
      });

      const response: ApiResponse = {
        status: 'success',
        message: 'Trade created successfully',
        data: trade
      };

      res.status(201).json(response);
    } catch (error) {
      handleError(res, error);
    }
  }
);

// Get trade by ID
router.get('/:tradeId', authMiddleware, async (req: Request, res: Response) => {
  try {
    const trade = await Trade.findOne({
      where: { 
        trade_id: req.params.tradeId,
        user_id: req.user?.userId
      }
    });

    if (!trade) {
      throw new AppError(404, 'Trade not found');
    }

    const response: ApiResponse = {
      status: 'success',
      data: trade
    };

    res.json(response);
  } catch (error) {
    handleError(res, error);
  }
});

// Cancel trade
router.post('/:tradeId/cancel', authMiddleware, async (req: Request, res: Response) => {
  try {
    const trade = await Trade.findOne({
      where: { 
        trade_id: req.params.tradeId,
        user_id: req.user?.userId,
        status: 'PENDING'
      }
    });

    if (!trade) {
      throw new AppError(404, 'Trade not found or cannot be cancelled');
    }

    trade.status = 'CANCELLED';
    await trade.save();

    const response: ApiResponse = {
      status: 'success',
      message: 'Trade cancelled successfully',
      data: trade
    };

    res.json(response);
  } catch (error) {
    handleError(res, error);
  }
});

export default router; 
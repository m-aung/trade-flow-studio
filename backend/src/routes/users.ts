import { Router, Request, Response } from 'express';
import User from '../models/user';
import authMiddleware from '../middleware/auth';
import { ApiResponse, UserResponse } from '../types';

const router = Router();

// Get all users (admin only)
router.get('/', authMiddleware, async (req: Request, res: Response) => {
  try {
    if (req.user?.role !== 'admin') {
      return res.status(403).json({
        status: 'error',
        message: 'Unauthorized access'
      });
    }

    const users = await User.findAll({
      attributes: ['user_id', 'email', 'role', 'first_name', 'last_name', 'status']
    });

    const response: ApiResponse<UserResponse[]> = {
      status: 'success',
      data: users.map(user => ({
        id: user.user_id,
        email: user.email,
        role: user.role,
        first_name: user.first_name,
        last_name: user.last_name,
        status: user.status
      }))
    };

    res.json(response);
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch users'
    });
  }
});

// Get user profile
router.get('/profile', authMiddleware, async (req: Request, res: Response) => {
  try {
    const user = await User.findByPk(req.user?.userId);
    
    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found'
      });
    }

    const response: ApiResponse<UserResponse> = {
      status: 'success',
      data: {
        id: user.user_id,
        email: user.email,
        role: user.role,
        first_name: user.first_name,
        last_name: user.last_name,
        status: user.status
      }
    };

    res.json(response);
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch user profile'
    });
  }
});

export default router; 
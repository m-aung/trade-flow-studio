import { Router, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/user';

const router = Router();

router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid credentials'
      });
    }

    const isValid = await user.validatePassword(password);
    if (!isValid) {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid credentials'
      });
    }

    const token = jwt.sign(
      { userId: user.user_id, email: user.email, role: user.role },
      process.env.JWT_SECRET!,
      { expiresIn: '24h' }
    );

    res.json({
      status: 'success',
      data: {
        token,
        user: {
          id: user.user_id,
          email: user.email,
          role: user.role
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Login failed'
    });
  }
});

export default router; 
import { Response } from 'express';
import { ApiResponse } from '../types';

export class AppError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public status: string = 'error'
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export const handleError = (res: Response, error: any): void => {
  if (error instanceof AppError) {
    const response: ApiResponse = {
      status: error.status,
      message: error.message
    };
    res.status(error.statusCode).json(response);
  } else {
    // Handle unexpected errors
    console.error('Unexpected error:', error);
    const response: ApiResponse = {
      status: 'error',
      message: 'An unexpected error occurred',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    };
    res.status(500).json(response);
  }
}; 
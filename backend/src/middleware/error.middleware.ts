import { Request, Response, NextFunction } from 'express';

export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  console.error('ErrorHandler details:', error);
  res.status(500).json({
    message: error.message || 'An unexpected error occurred',
    stack: process.env.NODE_ENV === 'production' ? undefined : error.stack,
  });
};

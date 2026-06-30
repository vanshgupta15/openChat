import { Request, Response, NextFunction } from 'express';

export const logger = (req: Request, res: Response, next: NextFunction): void => {
  console.log(`in logger middleware - [${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
};

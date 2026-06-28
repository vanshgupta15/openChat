import { Request, Response, NextFunction } from 'express';

export const notFound = (req: Request, res: Response, next: NextFunction): void => {
  res.status(404).json({ message: `Resource not found - ${req.originalUrl}` });
};

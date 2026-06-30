import { Request, Response, NextFunction } from 'express';

export const notFound = (req: Request, res: Response, next: NextFunction): void => {
  console.warn(`[notFound.middleware.ts:notFound] 404 resource not found: ${req.method} ${req.originalUrl}`);
  res.status(404).json({ message: `Resource not found - ${req.originalUrl}` });
};

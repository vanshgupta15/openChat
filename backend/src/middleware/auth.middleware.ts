import { Request, Response, NextFunction } from 'express';
import * as authService from '../services/auth.service';

export interface AuthenticatedRequest extends Request {
  user?: any;
}

export const verifyFirebaseToken = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  console.log('in auth middleware in verifyFirebaseToken method - Verifying authorization token...');
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    console.warn('verifyFirebaseToken - Missing or invalid Authorization header.');
    res.status(401).json({ message: 'Unauthorized: No token provided' });
    return;
  }

  const token = authHeader.split('Bearer ')[1];
  try {
    const decodedToken = await authService.verifyIdToken(token);
    const user = authService.extractUser(decodedToken);
    (req as any).user = user;
    console.log(`verifyFirebaseToken - Token verified successfully for UID: ${user.uid}`);
    next();
  } catch (error) {
    console.error('verifyFirebaseToken - Token verification failed:', error);
    res.status(401).json({ message: 'Unauthorized: Invalid token' });
  }
};

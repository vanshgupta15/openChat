import { Request, Response, NextFunction } from 'express';
import * as authService from '../services/auth.service';

export const getCurrentUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  console.log('in auth controller in getCurrentUser method - Request received for current user.');
  try {
    const user = (req as any).user;
    if (!user) {
      res.status(401).json({ message: 'User not authenticated' });
      return;
    }
    const currentUser = await authService.getCurrentUser(user);
    res.status(200).json(currentUser);
  } catch (error) {
    console.error('in auth controller in getCurrentUser method - Error retrieving user:', error);
    next(error);
  }
};

export const getFirebaseConfig = (req: Request, res: Response): void => {
  console.log('in auth controller in getFirebaseConfig method - Fetching public client config.');
  res.status(200).json({
    apiKey: process.env.FIREBASE_API_KEY || '',
    authDomain: process.env.FIREBASE_AUTH_DOMAIN || '',
    projectId: process.env.FIREBASE_PROJECT_ID || '',
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET || '',
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID || '',
    appId: process.env.FIREBASE_APP_ID || '',
    measurementId: process.env.FIREBASE_MEASUREMENT_ID || '',
  });
};

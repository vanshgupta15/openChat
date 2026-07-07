import { Router } from 'express';
import * as authController from '../controllers/auth.controller';
import { verifyFirebaseToken } from '../middleware/auth.middleware';

export const registerAuthRoutes = (): Router => {
  const router = Router();
  
  // Public route to get Firebase client configuration
  router.get('/config', authController.getFirebaseConfig);
  
  // Protected route to get current user details
  router.get('/me', verifyFirebaseToken, authController.getCurrentUser);
  
  return router;
};
export default registerAuthRoutes;

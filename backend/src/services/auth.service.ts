import { getFirebaseAdmin } from '../config/firebase';
import { AuthenticatedUser } from '../types/auth.types';

export const verifyIdToken = async (token: string): Promise<any> => {
  console.log('in auth service in verifyIdToken method - Verifying ID token...');
  const admin = getFirebaseAdmin();
  return await admin.auth().verifyIdToken(token);
};

export const extractUser = (decodedToken: any): AuthenticatedUser => {
  console.log(`in auth service in extractUser method - Extracting user data from token for UID: ${decodedToken.uid}`);
  return {
    uid: decodedToken.uid,
    email: decodedToken.email,
    displayName: decodedToken.name || decodedToken.email || 'Anonymous',
    photoURL: decodedToken.picture || '',
  };
};

export const getCurrentUser = async (user: AuthenticatedUser): Promise<AuthenticatedUser> => {
  console.log(`in auth service in getCurrentUser method - Getting current user details for: ${user.uid}`);
  return user;
};

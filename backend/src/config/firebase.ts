import { initializeApp, cert, applicationDefault } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

let firebaseApp: any = null;

export const initializeFirebase = (): void => {
  console.log('in firebase config layer in initializeFirebase method - Initializing Firebase Admin SDK...');
  try {
    const projectId = process.env.FIREBASE_PROJECT_ID;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

    if (!projectId || !clientEmail || !privateKey) {
      console.warn('Firebase credentials missing from environment variables. Attempting application default credentials...');
      firebaseApp = initializeApp({
        credential: applicationDefault(),
      });
    } else {
      firebaseApp = initializeApp({
        credential: cert({
          projectId,
          clientEmail,
          privateKey,
        }),
      });
      console.log('in firebase config layer in initializeFirebase method - Initialized with certificate credentials.');
    }
    console.log('in firebase config layer in initializeFirebase method - Firebase Admin SDK initialized successfully.');
  } catch (error) {
    console.error('in firebase config layer in initializeFirebase method - Error initializing Firebase Admin SDK:', error);
  }
};

export const getFirebaseAdmin = (): any => {
  if (!firebaseApp) {
    console.error('in firebase config layer in getFirebaseAdmin method - Firebase Admin has not been initialized!');
    throw new Error('Firebase Admin has not been initialized');
  }
  return {
    auth: () => getAuth(firebaseApp)
  };
};


import * as admin from 'firebase-admin';

let firebaseAdmin: any = null;

export const initializeFirebase = (): void => {
  console.log('in firebase config layer in initializeFirebase method - Initializing Firebase Admin SDK...');
  try {
    const adminAny = admin as any;
    const projectId = process.env.FIREBASE_PROJECT_ID;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

    if (!projectId || !clientEmail || !privateKey) {
      console.warn('Firebase credentials missing from environment variables. Attempting application default credentials...');
      adminAny.initializeApp({
        credential: adminAny.credential.applicationDefault(),
      });
    } else {
      adminAny.initializeApp({
        credential: adminAny.credential.cert({
          projectId,
          clientEmail,
          privateKey,
        }),
      });
      console.log('in firebase config layer in initializeFirebase method - Initialized with certificate credentials.');
    }
    firebaseAdmin = adminAny;
    console.log('in firebase config layer in initializeFirebase method - Firebase Admin SDK initialized successfully.');
  } catch (error) {
    console.error('in firebase config layer in initializeFirebase method - Error initializing Firebase Admin SDK:', error);
  }
};

export const getFirebaseAdmin = (): any => {
  if (!firebaseAdmin) {
    console.error('in firebase config layer in getFirebaseAdmin method - Firebase Admin has not been initialized!');
    throw new Error('Firebase Admin has not been initialized');
  }
  return firebaseAdmin;
};

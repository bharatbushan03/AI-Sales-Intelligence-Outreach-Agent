import { getApps, initializeApp, cert, getApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';
import { env } from './env';

const formatPrivateKey = (key: string) => {
  try {
    return key.replace(/\\n/g, '\n');
  } catch {
    return key;
  }
};

const app =
  getApps().length === 0
    ? initializeApp({
        credential: cert({
          projectId: env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
          clientEmail: env.FIREBASE_CLIENT_EMAIL,
          privateKey: formatPrivateKey(env.FIREBASE_PRIVATE_KEY),
        }),
      })
    : getApp();

const adminDb = getFirestore(app);
const adminAuth = getAuth(app);

export { adminDb, adminAuth };

import { getApps, initializeApp, cert, getApp, App } from 'firebase-admin/app';
import { getFirestore, Firestore } from 'firebase-admin/firestore';
import { getAuth, Auth } from 'firebase-admin/auth';
import { env } from './env';

const formatPrivateKey = (key: string) => {
  try {
    return key.replace(/\\n/g, '\n');
  } catch {
    return key;
  }
};

let adminDb: Firestore;
let adminAuth: Auth;

try {
  const app: App =
    getApps().length === 0
      ? initializeApp({
          credential: cert({
            projectId: env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
            clientEmail: env.FIREBASE_CLIENT_EMAIL,
            privateKey: formatPrivateKey(env.FIREBASE_PRIVATE_KEY),
          }),
        })
      : getApp();

  adminDb = getFirestore(app);
  adminAuth = getAuth(app);
} catch (error) {
  console.warn(
    'Firebase Admin initialization failed. Using mock interfaces for build/fallback.',
    error,
  );

  const mockQuery = {
    where: () => mockQuery,
    orderBy: () => mockQuery,
    limit: () => mockQuery,
    get: async () => ({ docs: [] }),
    doc: () => ({
      get: async () => ({ exists: false, data: () => ({}) }),
      set: async () => ({}),
      add: async () => ({ id: 'mock-id' }),
      update: async () => ({}),
      delete: async () => ({}),
    }),
    add: async () => ({ id: 'mock-id' }),
  };

  adminDb = {
    collection: () => mockQuery,
  } as unknown as Firestore;

  adminAuth = {} as unknown as Auth;
}

export { adminDb, adminAuth };

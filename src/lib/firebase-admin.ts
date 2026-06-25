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
    'Firebase Admin initialization failed. Using in-memory mock database for build/fallback.',
    error,
  );

  const db: Record<string, Record<string, any>> = {};

  const makeQuery = (
    collectionName: string,
    filters: any[] = [],
    order: any = null,
    limitVal: number | null = null,
  ) => {
    const getDocs = async () => {
      const col = db[collectionName] || {};
      let list = Object.entries(col).map(([id, data]) => ({
        id,
        ref: {
          delete: async () => {
            if (db[collectionName]) {
              delete db[collectionName][id];
            }
          },
        },
        exists: true,
        data: () => data,
      }));

      // Apply filters
      for (const filter of filters) {
        list = list.filter((item) => {
          const val = item.data()[filter.field];
          if (filter.op === '==') return val === filter.value;
          if (filter.op === '!=') return val !== filter.value;
          if (filter.op === '<') return val < filter.value;
          if (filter.op === '>') return val > filter.value;
          return true;
        });
      }

      // Apply order
      if (order) {
        list.sort((a, b) => {
          const valA = a.data()[order.field];
          const valB = b.data()[order.field];
          if (valA === undefined || valB === undefined) return 0;
          if (order.dir === 'asc') {
            return String(valA).localeCompare(String(valB));
          } else {
            return String(valB).localeCompare(String(valA));
          }
        });
      }

      // Apply limit
      if (limitVal !== null) {
        list = list.slice(0, limitVal);
      }

      return { docs: list };
    };

    const queryObj: any = {
      where: (field: string, op: string, value: any) => {
        return makeQuery(collectionName, [...filters, { field, op, value }], order, limitVal);
      },
      orderBy: (field: string, dir: 'asc' | 'desc' = 'asc') => {
        return makeQuery(collectionName, filters, { field, dir }, limitVal);
      },
      limit: (val: number) => {
        return makeQuery(collectionName, filters, order, val);
      },
      get: getDocs,
      doc: (id: string) => {
        return {
          get: async () => {
            const data = db[collectionName]?.[id];
            return {
              exists: !!data,
              data: () => data || {},
              id,
            };
          },
          set: async (payload: any) => {
            if (!db[collectionName]) db[collectionName] = {};
            db[collectionName][id] = { ...payload };
          },
          add: async (payload: any) => {
            if (!db[collectionName]) db[collectionName] = {};
            const generatedId = Math.random().toString(36).substring(2, 11);
            db[collectionName][generatedId] = { ...payload };
            return { id: generatedId };
          },
          update: async (payload: any) => {
            if (!db[collectionName]) db[collectionName] = {};
            db[collectionName][id] = { ...db[collectionName][id], ...payload };
          },
          delete: async () => {
            if (db[collectionName]) {
              delete db[collectionName][id];
            }
          },
        };
      },
      add: async (payload: any) => {
        if (!db[collectionName]) db[collectionName] = {};
        const generatedId = Math.random().toString(36).substring(2, 11);
        db[collectionName][generatedId] = { ...payload };
        return { id: generatedId };
      },
    };

    return queryObj;
  };

  adminDb = {
    collection: (name: string) => makeQuery(name),
    batch: () => {
      const ops: Array<() => Promise<void>> = [];
      return {
        delete: (ref: any) => {
          ops.push(async () => {
            await ref.delete();
          });
        },
        commit: async () => {
          for (const op of ops) {
            await op();
          }
        },
      };
    },
  } as unknown as Firestore;

  adminAuth = {} as unknown as Auth;
}

export { adminDb, adminAuth };

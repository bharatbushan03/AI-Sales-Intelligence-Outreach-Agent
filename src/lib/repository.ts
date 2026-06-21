import { adminDb } from './firebase-admin';
import {
  CollectionReference,
  Query,
  WhereFilterOp,
  QueryDocumentSnapshot,
} from 'firebase-admin/firestore';

export class FirestoreRepository<
  T extends { id?: string; createdAt?: unknown; updatedAt?: unknown },
> {
  constructor(protected collectionName: string) {}

  protected get collection(): CollectionReference {
    return adminDb.collection(this.collectionName);
  }

  /**
   * Retrieves a single document by its unique ID.
   */
  async get(id: string): Promise<T | null> {
    const doc = await this.collection.doc(id).get();
    if (!doc.exists) return null;
    return { id: doc.id, ...doc.data() } as T;
  }

  /**
   * Creates or overwrites a document with a specified ID.
   */
  async create(id: string, data: Omit<T, 'id' | 'createdAt' | 'updatedAt'>): Promise<T> {
    const timestamp = new Date();
    const payload = {
      ...data,
      createdAt: timestamp,
      updatedAt: timestamp,
    };
    await this.collection.doc(id).set(payload);
    return { id, ...payload } as unknown as T;
  }

  /**
   * Appends a new document to the collection with an auto-generated ID.
   */
  async add(data: Omit<T, 'id' | 'createdAt' | 'updatedAt'>): Promise<T> {
    const timestamp = new Date();
    const payload = {
      ...data,
      createdAt: timestamp,
      updatedAt: timestamp,
    };
    const ref = await this.collection.add(payload);
    return { id: ref.id, ...payload } as unknown as T;
  }

  /**
   * Partially updates an existing document.
   */
  async update(
    id: string,
    data: Partial<Omit<T, 'id' | 'createdAt' | 'updatedAt'>>,
  ): Promise<void> {
    await this.collection.doc(id).update({
      ...data,
      updatedAt: new Date(),
    });
  }

  /**
   * Deletes a document from the collection.
   */
  async delete(id: string): Promise<void> {
    await this.collection.doc(id).delete();
  }

  /**
   * Queries documents with filters, sorting, and limits.
   */
  async list(
    filters?: Array<{
      field: string;
      operator: WhereFilterOp;
      value: unknown;
    }>,
    orderByField?: string,
    orderDirection: 'asc' | 'desc' = 'asc',
    limit?: number,
  ): Promise<T[]> {
    let query: Query = this.collection;

    if (filters) {
      for (const filter of filters) {
        query = query.where(filter.field, filter.operator, filter.value);
      }
    }

    if (orderByField) {
      query = query.orderBy(orderByField, orderDirection);
    }

    if (limit) {
      query = query.limit(limit);
    }

    const snapshot = await query.get();
    return snapshot.docs.map(
      (doc: QueryDocumentSnapshot) =>
        ({
          id: doc.id,
          ...doc.data(),
        }) as T,
    );
  }
}
export default FirestoreRepository;

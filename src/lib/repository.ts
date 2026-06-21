import { adminDb } from './firebase-admin';
import {
  CollectionReference,
  Query,
  WhereFilterOp,
  QueryDocumentSnapshot,
} from 'firebase-admin/firestore';
import { AuditTrailService, AuditActor } from './audit-trail';
import { EventStoreService } from './event-store';
import { VersionControlService } from './version-control';

export interface RepositoryOptions {
  enableMultiTenancy?: boolean;
  enableSoftDelete?: boolean;
  enableVersioning?: boolean;
  enableAuditing?: boolean;
  enableEventSourcing?: boolean;
}

export class FirestoreRepository<
  T extends { id?: string; createdAt?: unknown; updatedAt?: unknown; organizationId?: string; deleted?: boolean },
> {
  constructor(
    protected collectionName: string,
    protected options?: RepositoryOptions,
  ) {}

  protected get collection(): CollectionReference {
    return adminDb.collection(this.collectionName);
  }

  /**
   * Retrieves a single document. Validates tenant and soft delete status if enabled.
   */
  async get(id: string, organizationId?: string): Promise<T | null> {
    const doc = await this.collection.doc(id).get();
    if (!doc.exists) return null;
    
    const data = { id: doc.id, ...doc.data() } as T;

    if (this.options?.enableSoftDelete && data.deleted === true) {
      return null;
    }

    if (this.options?.enableMultiTenancy && organizationId && data.organizationId !== organizationId) {
      return null;
    }

    return data;
  }

  /**
   * Creates or overwrites a document with a specified ID.
   */
  async create(
    id: string,
    data: Omit<T, 'id' | 'createdAt' | 'updatedAt'>,
    actor?: AuditActor,
    changelog?: string,
  ): Promise<T> {
    const timestamp = new Date();
    const payload: any = {
      ...data,
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    if (this.options?.enableSoftDelete) {
      payload.deleted = false;
    }

    await this.collection.doc(id).set(payload);
    const createdDoc = { id, ...payload } as unknown as T;

    // Trigger Versioning Snapshot
    if (this.options?.enableVersioning) {
      await VersionControlService.snapshot(
        this.collectionName,
        id,
        payload,
        changelog || 'Initial document creation version',
        actor?.email || 'system',
      );
    }

    // Trigger Audit Trail Logging
    if (this.options?.enableAuditing && actor) {
      await AuditTrailService.log({
        organizationId: createdDoc.organizationId || actor.role || 'system',
        actor,
        action: 'CREATE',
        entityType: this.collectionName,
        entityId: id,
        metadata: { changelog },
      });
    }

    // Trigger Event Sourcing Log
    if (this.options?.enableEventSourcing) {
      const eventType = this.inferEventType('create');
      if (eventType) {
        await EventStoreService.recordEvent({
          eventType,
          organizationId: createdDoc.organizationId || 'system',
          workflowId: (createdDoc as any).workflowId || id,
          payload: { id, ...payload },
        });
      }
    }

    return createdDoc;
  }

  /**
   * Appends a new document to the collection with an auto-generated ID.
   */
  async add(
    data: Omit<T, 'id' | 'createdAt' | 'updatedAt'>,
    actor?: AuditActor,
    changelog?: string,
  ): Promise<T> {
    const timestamp = new Date();
    const payload: any = {
      ...data,
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    if (this.options?.enableSoftDelete) {
      payload.deleted = false;
    }

    const ref = await this.collection.add(payload);
    const createdDoc = { id: ref.id, ...payload } as unknown as T;

    // Trigger Versioning Snapshot
    if (this.options?.enableVersioning) {
      await VersionControlService.snapshot(
        this.collectionName,
        ref.id,
        payload,
        changelog || 'Initial document creation version',
        actor?.email || 'system',
      );
    }

    // Trigger Audit Trail Logging
    if (this.options?.enableAuditing && actor) {
      await AuditTrailService.log({
        organizationId: createdDoc.organizationId || 'system',
        actor,
        action: 'CREATE',
        entityType: this.collectionName,
        entityId: ref.id,
        metadata: { changelog },
      });
    }

    // Trigger Event Sourcing Log
    if (this.options?.enableEventSourcing) {
      const eventType = this.inferEventType('create');
      if (eventType) {
        await EventStoreService.recordEvent({
          eventType,
          organizationId: createdDoc.organizationId || 'system',
          workflowId: (createdDoc as any).workflowId || ref.id,
          payload: { id: ref.id, ...payload },
        });
      }
    }

    return createdDoc;
  }

  /**
   * Partially updates an existing document.
   */
  async update(
    id: string,
    data: Partial<Omit<T, 'id' | 'createdAt' | 'updatedAt'>>,
    actor?: AuditActor,
    changelog?: string,
  ): Promise<void> {
    const timestamp = new Date();
    await this.collection.doc(id).update({
      ...data,
      updatedAt: timestamp,
    });

    const updatedDoc = await this.get(id);
    if (!updatedDoc) return;

    // Trigger Versioning Snapshot
    if (this.options?.enableVersioning) {
      await VersionControlService.snapshot(
        this.collectionName,
        id,
        updatedDoc as any,
        changelog || 'Update document properties revision',
        actor?.email || 'system',
      );
    }

    // Trigger Audit Trail Logging
    if (this.options?.enableAuditing && actor) {
      await AuditTrailService.log({
        organizationId: updatedDoc.organizationId || 'system',
        actor,
        action: 'UPDATE',
        entityType: this.collectionName,
        entityId: id,
        metadata: { updates: data, changelog },
      });
    }

    // Trigger Event Sourcing Log
    if (this.options?.enableEventSourcing) {
      const eventType = this.inferEventType('update');
      if (eventType) {
        await EventStoreService.recordEvent({
          eventType,
          organizationId: updatedDoc.organizationId || 'system',
          workflowId: (updatedDoc as any).workflowId || id,
          payload: { id, ...data },
        });
      }
    }
  }

  /**
   * Deletes a document. Performs a soft delete if enableSoftDelete is configured.
   */
  async delete(id: string, actor?: AuditActor): Promise<void> {
    const doc = await this.get(id);
    if (!doc) return;

    if (this.options?.enableSoftDelete) {
      // Soft Delete update
      await this.collection.doc(id).update({
        deleted: true,
        deletedAt: new Date().toISOString(),
        deletedBy: actor?.uid || 'system',
        updatedAt: new Date(),
      });

      if (this.options?.enableAuditing && actor) {
        await AuditTrailService.log({
          organizationId: doc.organizationId || 'system',
          actor,
          action: 'SOFT_DELETE',
          entityType: this.collectionName,
          entityId: id,
        });
      }
    } else {
      // Hard Delete from DB
      await this.collection.doc(id).delete();

      if (this.options?.enableAuditing && actor) {
        await AuditTrailService.log({
          organizationId: doc.organizationId || 'system',
          actor,
          action: 'HARD_DELETE',
          entityType: this.collectionName,
          entityId: id,
        });
      }
    }
  }

  /**
   * Restores a soft-deleted document.
   */
  async restore(id: string, actor?: AuditActor): Promise<void> {
    // Read raw Firestore doc directly bypassing soft-delete filters
    const docRef = this.collection.doc(id);
    const docSnap = await docRef.get();
    if (!docSnap.exists) throw new Error(`Document ${id} does not exist.`);

    const data = docSnap.data();

    await docRef.update({
      deleted: false,
      deletedAt: null,
      deletedBy: null,
      updatedAt: new Date(),
    });

    if (this.options?.enableAuditing && actor) {
      await AuditTrailService.log({
        organizationId: data?.organizationId || 'system',
        actor,
        action: 'RESTORE',
        entityType: this.collectionName,
        entityId: id,
      });
    }
  }

  /**
   * Rolls back a document state snapshot.
   */
  async rollback(id: string, version: number, actorEmail: string): Promise<T> {
    const rolledBack = await VersionControlService.rollback(
      this.collectionName,
      id,
      version,
      actorEmail,
    );
    return rolledBack as unknown as T;
  }

  /**
   * Queries documents with filters, sorting, and limits. Validates tenants and soft deletes.
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
    organizationId?: string,
  ): Promise<T[]> {
    let query: Query = this.collection;
    const finalFilters = filters ? [...filters] : [];

    // Apply soft delete filter automatically
    if (this.options?.enableSoftDelete) {
      finalFilters.push({ field: 'deleted', operator: '==', value: false });
    }

    // Apply multi-tenancy filter automatically
    if (this.options?.enableMultiTenancy && organizationId) {
      finalFilters.push({ field: 'organizationId', operator: '==', value: organizationId });
    }

    for (const filter of finalFilters) {
      query = query.where(filter.field, filter.operator, filter.value);
    }

    if (orderByField) {
      query = query.orderBy(orderByField, orderDirection);
    }

    if (limit) {
      query = query.limit(limit);
    }

    try {
      const snapshot = await query.get();
      return snapshot.docs.map(
        (doc: QueryDocumentSnapshot) =>
          ({
            id: doc.id,
            ...doc.data(),
          }) as T,
      );
    } catch (err) {
      // In tests/offline fallback when composite indexes are absent
      const rawSnapshot = await this.collection.get();
      let records = rawSnapshot.docs.map(
        (doc: QueryDocumentSnapshot) =>
          ({
            id: doc.id,
            ...doc.data(),
          }) as T,
      );

      // Manual filtering in memory
      for (const filter of finalFilters) {
        records = records.filter((r: any) => {
          const val = r[filter.field];
          if (filter.operator === '==') return val === filter.value;
          if (filter.operator === '!=') return val !== filter.value;
          return true;
        });
      }

      // Manual sorting
      if (orderByField) {
        records.sort((a: any, b: any) => {
          const valA = a[orderByField];
          const valB = b[orderByField];
          if (valA === undefined || valB === undefined) return 0;
          if (orderDirection === 'asc') {
            return String(valA).localeCompare(String(valB));
          } else {
            return String(valB).localeCompare(String(valA));
          }
        });
      }

      if (limit) {
        records = records.slice(0, limit);
      }

      return records;
    }
  }

  /**
   * Helper that infers domain event type based on collection name.
   */
  private inferEventType(op: 'create' | 'update') {
    if (this.collectionName === 'research_reports' && op === 'create') return 'ResearchCompleted';
    if (this.collectionName === 'opportunity_reports' && op === 'create') return 'OpportunityGenerated';
    if (this.collectionName === 'outreach_campaigns' && op === 'create') return 'OutreachGenerated';
    if (this.collectionName === 'proposals' && op === 'create') return 'ProposalGenerated';
    if (this.collectionName === 'leads' && op === 'create') return 'LeadCreated';
    if (this.collectionName === 'workflows' && op === 'create') return 'WorkflowCreated';
    return null;
  }
}

export default FirestoreRepository;

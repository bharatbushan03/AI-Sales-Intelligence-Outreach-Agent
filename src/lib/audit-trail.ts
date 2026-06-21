import { adminDb } from './firebase-admin';

export interface AuditActor {
  uid: string;
  email: string;
  role: string;
}

export interface AuditEvent {
  id?: string;
  organizationId: string;
  actor: AuditActor;
  action: string;
  entityType: string;
  entityId: string;
  timestamp: string;
  metadata?: Record<string, any>;
}

export class AuditTrailService {
  private static get collection() {
    return adminDb.collection('audit_logs');
  }

  /**
   * Appends an immutable audit event to Firestore.
   */
  public static async log(event: Omit<AuditEvent, 'timestamp'>): Promise<string> {
    const timestamp = new Date().toISOString();
    const payload = {
      ...event,
      timestamp,
    };
    const ref = await this.collection.add(payload);
    return ref.id;
  }

  /**
   * Retrieves audit logs for a specific organization sorted by timestamp descending.
   */
  public static async listForOrg(
    organizationId: string,
    limit = 100,
  ): Promise<AuditEvent[]> {
    try {
      const snapshot = await this.collection
        .where('organizationId', '==', organizationId)
        .orderBy('timestamp', 'desc')
        .limit(limit)
        .get();

      return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<AuditEvent, 'id'>),
      }));
    } catch {
      // Fallback if index isn't created yet or under test environment
      const snapshot = await this.collection
        .where('organizationId', '==', organizationId)
        .limit(limit)
        .get();

      const list = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<AuditEvent, 'id'>),
      }));

      return list.sort((a, b) => b.timestamp.localeCompare(a.timestamp));
    }
  }
}

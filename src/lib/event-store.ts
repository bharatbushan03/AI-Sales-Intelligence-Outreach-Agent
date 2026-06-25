import { adminDb } from './firebase-admin';

export interface DomainEvent {
  id?: string;
  eventType:
    | 'WorkflowCreated'
    | 'ResearchCompleted'
    | 'OpportunityGenerated'
    | 'OutreachGenerated'
    | 'ProposalGenerated'
    | 'LeadCreated';
  organizationId: string;
  workflowId: string;
  payload: Record<string, any>;
  timestamp: string;
}

export class EventStoreService {
  private static get collection() {
    return adminDb.collection('domain_events');
  }

  /**
   * Appends a domain event to the log store.
   */
  public static async recordEvent(event: Omit<DomainEvent, 'timestamp'>): Promise<string> {
    const timestamp = new Date().toISOString();
    const payload = {
      ...event,
      timestamp,
    };
    const ref = await this.collection.add(payload);
    return ref.id;
  }

  /**
   * Retrieves events for a specific workflow.
   */
  public static async getEventsForWorkflow(workflowId: string): Promise<DomainEvent[]> {
    const snapshot = await this.collection.where('workflowId', '==', workflowId).get();

    const list = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as Omit<DomainEvent, 'id'>),
    }));

    return list.sort((a, b) => a.timestamp.localeCompare(b.timestamp));
  }

  /**
   * Lists events for an organization.
   */
  public static async listForOrg(organizationId: string, limit = 100): Promise<DomainEvent[]> {
    try {
      const snapshot = await this.collection
        .where('organizationId', '==', organizationId)
        .orderBy('timestamp', 'desc')
        .limit(limit)
        .get();

      return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<DomainEvent, 'id'>),
      }));
    } catch {
      const snapshot = await this.collection
        .where('organizationId', '==', organizationId)
        .limit(limit)
        .get();

      const list = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<DomainEvent, 'id'>),
      }));

      return list.sort((a, b) => b.timestamp.localeCompare(a.timestamp));
    }
  }
}

import { describe, it, expect, beforeEach } from 'vitest';
import { FirestoreRepository } from '../src/lib/repository';
import { AuditTrailService, AuditActor } from '../src/lib/audit-trail';
import { EventStoreService } from '../src/lib/event-store';
import { VersionControlService } from '../src/lib/version-control';

interface TestDoc {
  id?: string;
  name: string;
  organizationId?: string;
  deleted?: boolean;
  createdAt?: unknown;
  updatedAt?: unknown;
}

describe('Firestore Production-Grade Database Architecture', () => {
  // Config repositories for test runs
  const testRepository = new FirestoreRepository<TestDoc>('test_collection', {
    enableMultiTenancy: true,
    enableSoftDelete: true,
    enableVersioning: true,
    enableAuditing: true,
    enableEventSourcing: true,
  });

  const actor: AuditActor = {
    uid: 'user_test_sdr',
    email: 'sdr@stripe.com',
    role: 'Sales Rep',
  };

  beforeEach(async () => {
    // Clean database mock state before each test if running live/mock
    // Since Firebase-Admin resolves empty list in test fallbacks, our manual fallback filter arrays will start empty
  });

  describe('1. Tenant Isolation Framework', () => {
    it('should scope list queries by organizationId when multi-tenancy is active', async () => {
      // Create docs for two different tenants
      const stripeDoc = await testRepository.create('doc_stripe_1', {
        name: 'Stripe Account Details',
        organizationId: 'org_stripe',
      }, actor);

      const hubspotDoc = await testRepository.create('doc_hubspot_1', {
        name: 'HubSpot Account Details',
        organizationId: 'org_hubspot',
      }, actor);

      expect(stripeDoc.organizationId).toBe('org_stripe');
      expect(hubspotDoc.organizationId).toBe('org_hubspot');

      // List with org_stripe filter should return only Stripe doc
      const stripeList = await testRepository.list(undefined, undefined, undefined, undefined, 'org_stripe');
      expect(stripeList.some(d => d.id === 'doc_stripe_1')).toBe(true);
      expect(stripeList.some(d => d.id === 'doc_hubspot_1')).toBe(false);

      // List with org_hubspot filter should return only HubSpot doc
      const hubspotList = await testRepository.list(undefined, undefined, undefined, undefined, 'org_hubspot');
      expect(hubspotList.some(d => d.id === 'doc_hubspot_1')).toBe(true);
      expect(hubspotList.some(d => d.id === 'doc_stripe_1')).toBe(false);
    });

    it('should bypass scoping for global admin access searches', async () => {
      // Listing without tenant org context returns all documents
      const allDocs = await testRepository.list();
      expect(allDocs.length).toBeGreaterThanOrEqual(2);
    });
  });

  describe('2. Soft Delete Framework', () => {
    it('should intercept delete calls and update deleted flag rather than hard purge', async () => {
      await testRepository.create('doc_to_delete', {
        name: 'Temporary lead document',
        organizationId: 'org_stripe',
      }, actor);

      // Verify active
      const fetchedActive = await testRepository.get('doc_to_delete', 'org_stripe');
      expect(fetchedActive).not.toBeNull();
      expect(fetchedActive?.deleted).toBe(false);

      // Perform soft delete
      await testRepository.delete('doc_to_delete', actor);

      // Fetching should now filter out soft deleted items
      const fetchedDeleted = await testRepository.get('doc_to_delete', 'org_stripe');
      expect(fetchedDeleted).toBeNull();

      const activeList = await testRepository.list(undefined, undefined, undefined, undefined, 'org_stripe');
      expect(activeList.some(d => d.id === 'doc_to_delete')).toBe(false);
    });

    it('should restore a soft deleted document successfully', async () => {
      // Restore the document
      await testRepository.restore('doc_to_delete', actor);

      const fetchedRestored = await testRepository.get('doc_to_delete', 'org_stripe');
      expect(fetchedRestored).not.toBeNull();
      expect(fetchedRestored?.deleted).toBe(false);
    });
  });

  describe('3. Version History & Rollback System', () => {
    it('should record historical snapshots upon updates', async () => {
      const docId = 'doc_versioned_1';
      await testRepository.create(docId, {
        name: 'SOW Version 1',
        organizationId: 'org_stripe',
      }, actor, 'Created initial SOW proposal');

      // Update doc
      await testRepository.update(docId, {
        name: 'SOW Version 2 (Revised pricing)',
      }, actor, 'Revised proposal scope');

      // Fetch versions
      const versions = await VersionControlService.getVersions('test_collection', docId);
      expect(versions.length).toBe(2);
      expect(versions[0].version).toBe(2);
      expect(versions[1].version).toBe(1);
    });

    it('should rollback document values to a target revision index', async () => {
      const docId = 'doc_versioned_1';
      const rolledBack = await testRepository.rollback(docId, 1, 'admin@stripe.com');
      
      expect(rolledBack.name).toBe('SOW Version 1');

      const currentDoc = await testRepository.get(docId, 'org_stripe');
      expect(currentDoc?.name).toBe('SOW Version 1');
    });
  });

  describe('4. Immutable Audit Trail Logging', () => {
    it('should log audit trail events on mutations', async () => {
      const logs = await AuditTrailService.listForOrg('org_stripe', 10);
      expect(logs.length).toBeGreaterThan(0);
      // Logs should contain actors and action metadata
      const createLog = logs.find(l => l.action === 'CREATE' && l.entityId === 'doc_stripe_1');
      expect(createLog).toBeDefined();
      expect(createLog?.actor.uid).toBe('user_test_sdr');
    });
  });

  describe('5. Event Sourcing Layer', () => {
    it('should capture B2B domain events inside event log history', async () => {
      // Since test_collection isn't research_reports/leads/etc, create event directly to test record-retrieval flow
      const eventId = await EventStoreService.recordEvent({
        eventType: 'LeadCreated',
        organizationId: 'org_stripe',
        workflowId: 'wf_test_123',
        payload: { email: 'client@stripe.com' },
      });

      expect(eventId).toBeDefined();

      const events = await EventStoreService.listForOrg('org_stripe');
      expect(events.length).toBeGreaterThan(0);
      expect(events.some(e => e.eventType === 'LeadCreated')).toBe(true);
    });
  });
});

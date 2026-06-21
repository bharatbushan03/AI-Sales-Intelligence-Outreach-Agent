import { describe, it, expect, beforeEach, vi } from 'vitest';
import { AgentMessagingBus } from '../src/agents/memory/message-bus';
import { KnowledgeGraphManager } from '../src/agents/memory/knowledge-graph';
import { MemoryRetrievalEngine } from '../src/agents/memory/retrieval-engine';
import { ContextRouter } from '../src/agents/memory/context-router';
import { AgentMessage, KnowledgeNode, KnowledgeEdge, SharedMemoryModel } from '../src/agents/memory/types';

describe('Shared Memory and Agent Communication Layer', () => {
  
  describe('Agent Messaging Bus (Pub/Sub)', () => {
    const bus = AgentMessagingBus.getInstance();

    beforeEach(() => {
      bus.clearSubscriptions();
    });

    it('should subscribe and trigger callbacks when a message is published', async () => {
      let receivedMsg: AgentMessage | null = null;
      
      bus.subscribe('market_insight', (msg) => {
        receivedMsg = msg;
      });

      const payload = { company: 'Stripe', detail: 'Expanding enterprise suite' };
      await bus.publish('ResearchAgent', 'market_insight', payload);

      expect(receivedMsg).toBeDefined();
      expect(receivedMsg!.sender).toBe('ResearchAgent');
      expect(receivedMsg!.topic).toBe('market_insight');
      expect(receivedMsg!.payload).toEqual(payload);
    });

    it('should broadcast message alerts to the broadcast topic', async () => {
      let receivedMsg: AgentMessage | null = null;
      
      bus.subscribe('broadcast', (msg) => {
        receivedMsg = msg;
      });

      const payload = { event: 'system_boot' };
      await bus.broadcast('ManagerAgent', payload);

      expect(receivedMsg).toBeDefined();
      expect(receivedMsg!.sender).toBe('ManagerAgent');
      expect(receivedMsg!.topic).toBe('broadcast');
    });

    it('should handle direct message subscriptions correctly', async () => {
      let receivedMsg: AgentMessage | null = null;
      
      bus.subscribe('direct:OpportunityAgent', (msg) => {
        receivedMsg = msg;
      });

      const payload = { task: 'Analyze HubSpot output' };
      await bus.directMessage('ResearchAgent', 'OpportunityAgent', payload);

      expect(receivedMsg).toBeDefined();
      expect(receivedMsg!.sender).toBe('ResearchAgent');
      expect(receivedMsg!.topic).toBe('direct:OpportunityAgent');
      expect(receivedMsg!.payload).toEqual(payload);
    });

    it('should retrieve message histories', async () => {
      const history = await bus.getHistory('market_insight', 5);
      expect(Array.isArray(history)).toBe(true);
    });
  });

  describe('Knowledge Graph Manager', () => {
    const graphManager = KnowledgeGraphManager.getInstance();

    it('should return a valid empty fallback graph', async () => {
      const graph = await graphManager.getGraph();
      expect(graph).toBeDefined();
      expect(Array.isArray(graph.nodes)).toBe(true);
      expect(Array.isArray(graph.edges)).toBe(true);
    });

    it('should compile structured mock graph details for Stripe', () => {
      const mock = graphManager.getMockGraph('Stripe');
      expect(mock.nodes.some(n => n.id === 'competitor_adyen')).toBe(true);
      expect(mock.edges.some(e => e.relationship === 'competes_with')).toBe(true);
    });

    it('should compile structured mock graph details for HubSpot', () => {
      const mock = graphManager.getMockGraph('HubSpot');
      expect(mock.nodes.some(n => n.id === 'competitor_salesforce')).toBe(true);
      expect(mock.edges.some(e => e.relationship === 'experiences_pain')).toBe(true);
    });

    it('should merge node and edge lists uniquely on update', async () => {
      const newNodes: KnowledgeNode[] = [
        { id: 'acme', label: 'Acme Corp', type: 'company' },
        { id: 'saas', label: 'B2B SaaS', type: 'industry' }
      ];
      const newEdges: KnowledgeEdge[] = [
        { source: 'acme', target: 'saas', relationship: 'belongs_to' }
      ];

      const updated = await graphManager.updateGraph(newNodes, newEdges);
      expect(updated.nodes.some(n => n.id === 'acme')).toBe(true);
      expect(updated.edges.some(e => e.source === 'acme' && e.target === 'saas')).toBe(true);
    });

    it('should query connections of a specific node', async () => {
      const mockGraph = {
        nodes: [
          { id: 'acme', label: 'Acme Corp', type: 'company' as const },
          { id: 'saas', label: 'B2B SaaS', type: 'industry' as const }
        ],
        edges: [
          { source: 'acme', target: 'saas', relationship: 'belongs_to' }
        ],
        lastUpdated: new Date().toISOString(),
      };
      
      const spy = vi.spyOn(graphManager, 'getGraph').mockResolvedValue(mockGraph);
      
      const connections = await graphManager.queryConnections('acme');
      expect(connections.nodes.length).toBeGreaterThan(0);
      expect(connections.edges.length).toBeGreaterThan(0);
      expect(connections.nodes.some(n => n.id === 'saas')).toBe(true);
      
      spy.mockRestore();
    });
  });

  describe('Memory Retrieval Engine (Ranking)', () => {
    const engine = new MemoryRetrievalEngine(null); // Offline heuristic mode

    it('should rank items based on goal keyword similarities', async () => {
      const userGoal = 'Research billing and payments software';
      const items = [
        { text: 'Analytics dashboard logs', createdAt: new Date().toISOString() },
        { text: 'Billing decline rates and payment integrations', createdAt: new Date().toISOString() }
      ];

      const ranked = await engine.retrieve(userGoal, items, 5);
      expect(ranked[0].text).toContain('Billing decline rates');
      expect(ranked[0].score).toBeGreaterThanOrEqual(ranked[1].score);
    });

    it('should apply recency bonus factor to recent items', async () => {
      const userGoal = 'CRM leads sync pipelines';
      const items = [
        { text: 'CRM leads pipeline', createdAt: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000).toISOString() }, // 40 days old
        { text: 'CRM leads pipeline', createdAt: new Date().toISOString() } // Fresh
      ];

      const ranked = await engine.retrieve(userGoal, items, 5);
      expect(ranked[0].score).toBeGreaterThan(ranked[1].score);
    });
  });

  describe('Context Router & Orchestrator Hooks', () => {
    const router = new ContextRouter(null); // Offline mode

    it('should assemble structured memory context packs on routeContext', async () => {
      const memory = await router.routeContext('user_123', 'Analyze Stripe.com', 'Stripe');
      expect(memory.workflowId).toBeDefined();
      expect(memory.companyName).toBe('Stripe');
      expect(memory.userGoal).toBe('Analyze Stripe.com');
    });

    it('should persist completed workflow execution runs on saveWorkflowRun', async () => {
      const runPayload: SharedMemoryModel = {
        workflowId: 'wf_test_123',
        userGoal: 'Research stripe',
        companyName: 'Stripe',
        research: {
          company: {
            name: 'Stripe',
            website: 'stripe.com',
            description: 'desc',
            location: 'SF',
            employeeCount: 100,
            estimatedRevenue: '1B',
            founded: '2010',
            businessModel: 'B2B',
            targetCustomers: ['Enterprise'],
            marketPosition: 'Leader',
            logo: '',
          },
          industry: { classification: 'Fintech', vertical: 'Payments', tags: [] },
          products: [],
          competitors: [],
          opportunities: [],
          risks: [],
          recommendations: [],
          summary: 'desc',
          signals: { hiringSignal: '', growthIndicator: '' },
          metadata: { workflowId: 'wf_test_123', timestamp: '' },
        },
      };

      await expect(
        router.saveWorkflowRun('wf_test_123', 'user_123', 'Research stripe', runPayload)
      ).resolves.not.toThrow();
    });
  });
});

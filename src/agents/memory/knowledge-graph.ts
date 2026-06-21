import { KnowledgeGraph, KnowledgeNode, KnowledgeEdge } from './types';
import { knowledgeGraphRepository } from '../../lib/repositories';
import { logger } from '../../utils/logger';

export class KnowledgeGraphManager {
  private static instance: KnowledgeGraphManager;

  private constructor() {}

  public static getInstance(): KnowledgeGraphManager {
    if (!KnowledgeGraphManager.instance) {
      KnowledgeGraphManager.instance = new KnowledgeGraphManager();
    }
    return KnowledgeGraphManager.instance;
  }

  /**
   * Retrieves the current knowledge graph from Firestore, or returns a default layout.
   */
  public async getGraph(): Promise<KnowledgeGraph> {
    try {
      const graphs = await knowledgeGraphRepository.list(undefined, 'lastUpdated', 'desc', 1);
      if (graphs.length > 0) {
        return graphs[0];
      }
    } catch (err) {
      logger.error('Failed to load knowledge graph from repository, using fallback empty graph', err);
    }

    return {
      nodes: [],
      edges: [],
      lastUpdated: new Date().toISOString(),
    };
  }

  /**
   * Overwrites or adds new nodes and edges, updating the single state record in Firestore.
   */
  public async updateGraph(newNodes: KnowledgeNode[], newEdges: KnowledgeEdge[]): Promise<KnowledgeGraph> {
    try {
      const graph = await this.getGraph();
      
      // Merge nodes uniquely by ID
      const nodeMap = new Map<string, KnowledgeNode>();
      graph.nodes.forEach(n => nodeMap.set(n.id, n));
      newNodes.forEach(n => nodeMap.set(n.id, n));

      // Merge edges uniquely by source-target-relationship key
      const edgeMap = new Map<string, KnowledgeEdge>();
      graph.edges.forEach(e => edgeMap.set(`${e.source}-${e.target}-${e.relationship}`, e));
      newEdges.forEach(e => edgeMap.set(`${e.source}-${e.target}-${e.relationship}`, e));

      const updatedGraph: KnowledgeGraph = {
        id: graph.id || undefined,
        nodes: Array.from(nodeMap.values()),
        edges: Array.from(edgeMap.values()),
        lastUpdated: new Date().toISOString(),
      };

      if (updatedGraph.id) {
        await knowledgeGraphRepository.update(updatedGraph.id, {
          nodes: updatedGraph.nodes,
          edges: updatedGraph.edges,
          lastUpdated: updatedGraph.lastUpdated,
        });
      } else {
        const saved = await knowledgeGraphRepository.add(updatedGraph);
        updatedGraph.id = saved.id;
      }

      return updatedGraph;
    } catch (err) {
      logger.error('Failed to update knowledge graph in database', err);
      return {
        nodes: newNodes,
        edges: newEdges,
        lastUpdated: new Date().toISOString(),
      };
    }
  }

  /**
   * Generates a fully populated mock strategic knowledge graph for visual demo dashboard use.
   */
  public getMockGraph(companyName: string): KnowledgeGraph {
    const name = companyName.toLowerCase();
    
    // Core nodes
    const nodes: KnowledgeNode[] = [
      { id: 'target_co', label: companyName, type: 'company' },
      { id: 'industry_node', label: 'B2B Software SaaS', type: 'industry' },
    ];

    const edges: KnowledgeEdge[] = [
      { source: 'target_co', target: 'industry_node', relationship: 'belongs_to' },
    ];

    if (name.includes('stripe')) {
      nodes.push(
        { id: 'fintech_node', label: 'Payment Fintech', type: 'industry' },
        { id: 'competitor_adyen', label: 'Adyen', type: 'competitor' },
        { id: 'competitor_paypal', label: 'PayPal', type: 'competitor' },
        { id: 'pain_decline', label: 'Localized Decline Rates', type: 'pain-point' },
        { id: 'opp_routing', label: 'Payment Routing Optimization', type: 'opportunity' },
      );
      edges.push(
        { source: 'target_co', target: 'fintech_node', relationship: 'belongs_to' },
        { source: 'target_co', target: 'competitor_adyen', relationship: 'competes_with' },
        { source: 'target_co', target: 'competitor_paypal', relationship: 'competes_with' },
        { source: 'target_co', target: 'pain_decline', relationship: 'experiences_pain' },
        { source: 'pain_decline', target: 'opp_routing', relationship: 'resolved_by' },
      );
    } else if (name.includes('hubspot')) {
      nodes.push(
        { id: 'crm_node', label: 'CRM Sales Space', type: 'industry' },
        { id: 'competitor_salesforce', label: 'Salesforce', type: 'competitor' },
        { id: 'pain_sync', label: 'Enterprise Data Sync Lag', type: 'pain-point' },
        { id: 'opp_middleware', label: 'High-Performance Sync Pipeline', type: 'opportunity' },
      );
      edges.push(
        { source: 'target_co', target: 'crm_node', relationship: 'belongs_to' },
        { source: 'target_co', target: 'competitor_salesforce', relationship: 'competes_with' },
        { source: 'target_co', target: 'pain_sync', relationship: 'experiences_pain' },
        { source: 'pain_sync', target: 'opp_middleware', relationship: 'resolved_by' },
      );
    } else if (name.includes('salesforce')) {
      nodes.push(
        { id: 'crm_node', label: 'CRM Sales Space', type: 'industry' },
        { id: 'competitor_hubspot', label: 'HubSpot', type: 'competitor' },
        { id: 'competitor_microsoft', label: 'Dynamics 365', type: 'competitor' },
        { id: 'pain_grounding', label: 'Einstein Context Grounding Latency', type: 'pain-point' },
        { id: 'opp_connector', label: 'Einstein Metadata Connectors', type: 'opportunity' },
      );
      edges.push(
        { source: 'target_co', target: 'crm_node', relationship: 'belongs_to' },
        { source: 'target_co', target: 'competitor_hubspot', relationship: 'competes_with' },
        { source: 'target_co', target: 'competitor_microsoft', relationship: 'competes_with' },
        { source: 'target_co', target: 'pain_grounding', relationship: 'experiences_pain' },
        { source: 'pain_grounding', target: 'opp_connector', relationship: 'resolved_by' },
      );
    } else {
      nodes.push(
        { id: 'competitor_generic', label: 'Standard Industry Competitor', type: 'competitor' },
        { id: 'pain_scaling', label: 'Headcount Workflow Bottlenecks', type: 'pain-point' },
        { id: 'opp_automation', label: 'Low-Code Integration Pipelines', type: 'opportunity' },
      );
      edges.push(
        { source: 'target_co', target: 'competitor_generic', relationship: 'competes_with' },
        { source: 'target_co', target: 'pain_scaling', relationship: 'experiences_pain' },
        { source: 'pain_scaling', target: 'opp_automation', relationship: 'resolved_by' },
      );
    }

    return {
      nodes,
      edges,
      lastUpdated: new Date().toISOString(),
    };
  }

  /**
   * Retrieves adjacent nodes and edges directly connected to the specified node ID.
   */
  public async queryConnections(nodeId: string): Promise<{ nodes: KnowledgeNode[]; edges: KnowledgeEdge[] }> {
    const graph = await this.getGraph();
    const connectedEdges = graph.edges.filter(e => e.source === nodeId || e.target === nodeId);
    const connectedNodeIds = new Set<string>();
    
    connectedNodeIds.add(nodeId);
    connectedEdges.forEach(e => {
      connectedNodeIds.add(e.source);
      connectedNodeIds.add(e.target);
    });

    const connectedNodes = graph.nodes.filter(n => connectedNodeIds.has(n.id));

    return {
      nodes: connectedNodes,
      edges: connectedEdges,
    };
  }
}
export default KnowledgeGraphManager;

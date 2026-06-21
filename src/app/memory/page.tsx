'use client';

import React, { useState, useEffect } from 'react';
import {
  Brain,
  Database,
  Network,
  History,
  MessageSquare,
  Cpu,
  Search,
  Building,
  TrendingUp,
  Clock,
  ArrowRight,
  ChevronRight,
  Info,
  ShieldCheck,
  Eye,
  X,
  RefreshCw,
  Zap,
} from 'lucide-react';

type TabName = 'graph' | 'workflows' | 'companies' | 'messages' | 'performance';

interface WorkflowRecord {
  id?: string;
  workflowId: string;
  userId: string;
  userGoal: string;
  agentOutputs: Record<string, unknown>;
  intermediateResults: Record<string, unknown>;
  finalResults?: Record<string, unknown>;
  status: string;
  createdAt: string;
  updatedAt: string;
}

interface CompanyRecord {
  id?: string;
  companyName: string;
  domain: string;
  profile?: Record<string, unknown>;
  opportunities?: Record<string, unknown>[];
  outreachPlans?: Record<string, unknown>[];
  crmData?: Record<string, unknown>;
  proposals?: Record<string, unknown>[];
  lastUpdated: string;
}

interface AgentRecord {
  id?: string;
  agentName: string;
  executionsCount: number;
  discoveredCompetitors: string[];
  analyzedCompanies: string[];
  performanceMetrics: {
    averageLatencyMs: number;
    successRate: number;
    lastExecutedAt: string;
  };
}

interface MessageRecord {
  id?: string;
  timestamp: string;
  sender: string;
  topic: string;
  payload: Record<string, unknown>;
}

interface GraphNode {
  id: string;
  label: string;
  type: 'company' | 'competitor' | 'industry' | 'pain-point' | 'opportunity' | 'campaign' | 'proposal';
}

interface GraphEdge {
  source: string;
  target: string;
  relationship: string;
}

interface GraphData {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

export default function MemoryDashboardPage() {
  const [activeTab, setActiveTab] = useState<TabName>('graph');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [workflows, setWorkflows] = useState<WorkflowRecord[]>([]);
  const [companies, setCompanies] = useState<CompanyRecord[]>([]);
  const [agents, setAgents] = useState<AgentRecord[]>([]);
  const [messages, setMessages] = useState<MessageRecord[]>([]);
  const [graph, setGraph] = useState<GraphData>({ nodes: [], edges: [] });
  
  // Selection states
  const [selectedWorkflow, setSelectedWorkflow] = useState<WorkflowRecord | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [selectedCompany, setSelectedCompany] = useState<CompanyRecord | null>(null);
  const [activeGraphCompany, setActiveGraphCompany] = useState<string>('Stripe');
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
  
  // Inspector states
  const [isInspectorOpen, setIsInspectorOpen] = useState(false);
  const [inspectorTitle, setInspectorTitle] = useState('');
  const [inspectorData, setInspectorData] = useState<unknown>(null);

  // Filter messages
  const [msgTopicFilter, setMsgTopicFilter] = useState<string>('all');

  const fetchData = React.useCallback(async (showProgress = true) => {
    if (showProgress) setLoading(true);
    else setRefreshing(true);
    
    try {
      const [wfRes, compRes, agentRes, msgRes, graphRes] = await Promise.all([
        fetch('/api/memory?type=workflows'),
        fetch('/api/memory?type=companies'),
        fetch('/api/memory?type=agents'),
        fetch('/api/memory?type=messages'),
        fetch(`/api/memory?type=graph&companyName=${activeGraphCompany}`),
      ]);

      const [wf, comp, age, msg, gr] = await Promise.all([
        wfRes.json(),
        compRes.json(),
        agentRes.json(),
        msgRes.json(),
        graphRes.json(),
      ]);

      if (wf.success) setWorkflows(wf.data);
      if (comp.success) setCompanies(comp.data);
      if (age.success) setAgents(age.data);
      if (msg.success) setMessages(msg.data);
      if (gr.success) setGraph(gr.data);
    } catch (error) {
      console.error('Failed to retrieve intelligence memory context:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [activeGraphCompany]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchData();
  }, [fetchData]);

  const handleOpenInspector = (title: string, data: unknown) => {
    setInspectorTitle(title);
    setInspectorData(data);
    setIsInspectorOpen(true);
  };

  // Node position map generator for SVG knowledge graph layout
  const getNodePositions = () => {
    const positions: Record<string, { x: number; y: number }> = {};
    if (graph.nodes.length === 0) return positions;

    // Find company node or default center
    const companyNode = graph.nodes.find(n => n.type === 'company') || graph.nodes[0];
    const center = { x: 350, y: 250 };
    positions[companyNode.id] = center;

    // Place remaining nodes in radial layout around center
    const peripheralNodes = graph.nodes.filter(n => n.id !== companyNode.id);
    const radius = 180;
    
    peripheralNodes.forEach((node, idx) => {
      const angle = (idx / peripheralNodes.length) * 2 * Math.PI;
      positions[node.id] = {
        x: center.x + radius * Math.cos(angle),
        y: center.y + radius * Math.sin(angle),
      };
    });

    return positions;
  };

  const nodePositions = getNodePositions();

  const getNodeColor = (type: GraphNode['type']) => {
    switch (type) {
      case 'company': return 'fill-indigo-650 stroke-indigo-400';
      case 'competitor': return 'fill-rose-950/70 stroke-rose-500/80';
      case 'industry': return 'fill-emerald-950/70 stroke-emerald-500/80';
      case 'pain-point': return 'fill-amber-950/70 stroke-amber-500/80';
      case 'opportunity': return 'fill-cyan-950/70 stroke-cyan-500/80';
      case 'campaign': return 'fill-violet-950/70 stroke-violet-500/80';
      case 'proposal': return 'fill-pink-950/70 stroke-pink-500/80';
      default: return 'fill-slate-800 stroke-slate-600';
    }
  };

  const getTopicBadgeColor = (topic: string) => {
    if (topic === 'broadcast') return 'bg-indigo-950/80 text-indigo-400 border-indigo-900/50';
    if (topic.startsWith('direct:')) return 'bg-cyan-950/80 text-cyan-400 border-cyan-900/50';
    if (topic === 'market_insight') return 'bg-emerald-950/80 text-emerald-400 border-emerald-900/50';
    return 'bg-slate-900 text-slate-400 border-slate-850';
  };

  return (
    <div className="space-y-8 text-slate-100 pb-16">
      {/* Header Panel */}
      <div className="flex flex-col justify-between gap-4 border-b border-slate-800 pb-5 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white md:text-4xl flex items-center gap-3">
            <Brain className="h-9 w-9 text-indigo-500" />
            Memory Intelligence Hub
          </h1>
          <p className="mt-2 text-sm text-slate-400">
            Inspect B2B sales memory routing, live messaging bus activities, and company graph relationships.
          </p>
        </div>
        <button
          onClick={() => fetchData(false)}
          disabled={loading || refreshing}
          className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800 px-4 py-2.5 text-sm font-semibold text-slate-200 transition-all duration-200 hover:bg-slate-700 disabled:opacity-50"
        >
          <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
          Refresh Memory
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-slate-800/80 bg-slate-900/40 p-6 flex items-center justify-between">
          <div className="space-y-1.5">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Workflow Runs</span>
            <div className="text-2xl font-bold text-white">{workflows.length}</div>
          </div>
          <History className="h-8 w-8 text-indigo-500 opacity-60" />
        </div>
        <div className="rounded-2xl border border-slate-800/80 bg-slate-900/40 p-6 flex items-center justify-between">
          <div className="space-y-1.5">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Company Profiles</span>
            <div className="text-2xl font-bold text-white">{companies.length}</div>
          </div>
          <Building className="h-8 w-8 text-emerald-500 opacity-60" />
        </div>
        <div className="rounded-2xl border border-slate-800/80 bg-slate-900/40 p-6 flex items-center justify-between">
          <div className="space-y-1.5">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Graph Nodes</span>
            <div className="text-2xl font-bold text-white">{graph.nodes.length}</div>
          </div>
          <Network className="h-8 w-8 text-cyan-500 opacity-60" />
        </div>
        <div className="rounded-2xl border border-slate-800/80 bg-slate-900/40 p-6 flex items-center justify-between">
          <div className="space-y-1.5">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Bus Events Logged</span>
            <div className="text-2xl font-bold text-white">{messages.length}</div>
          </div>
          <MessageSquare className="h-8 w-8 text-violet-500 opacity-60" />
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="grid gap-8 lg:grid-cols-4">
        {/* Navigation Tabs (Sidebar Layout style) */}
        <div className="lg:col-span-1 space-y-2">
          {[
            { id: 'graph', label: 'Knowledge Graph', icon: Network, desc: 'Browse node linkages' },
            { id: 'workflows', label: 'Workflow Memory', icon: History, desc: 'Traces and run results' },
            { id: 'companies', label: 'Company Contexts', icon: Building, desc: 'Stored accounts details' },
            { id: 'messages', label: 'Agent Message Bus', icon: MessageSquare, desc: 'Live event pub/sub' },
            { id: 'performance', label: 'Agent Metrics', icon: Cpu, desc: 'Latencies & execution rates' },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabName)}
                className={`w-full text-left rounded-2xl border p-4 flex items-center gap-3.5 transition-all duration-200 ${
                  isActive
                    ? 'border-indigo-500/80 bg-indigo-950/30 text-indigo-300 shadow-md'
                    : 'border-slate-850 bg-slate-900/20 text-slate-400 hover:bg-slate-900/50 hover:text-slate-200'
                }`}
              >
                <Icon className={`h-6 w-6 shrink-0 ${isActive ? 'text-indigo-400' : 'text-slate-500'}`} />
                <div className="overflow-hidden">
                  <div className="font-semibold text-sm leading-snug">{tab.label}</div>
                  <div className="text-[10px] text-slate-500 truncate">{tab.desc}</div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Workspace Display Viewports */}
        <div className="lg:col-span-3 min-h-[550px] rounded-3xl border border-slate-800 bg-slate-900/20 p-6 md:p-8 flex flex-col justify-between">
          {loading ? (
            <div className="flex-1 flex flex-col items-center justify-center space-y-4">
              <Brain className="h-10 w-10 animate-bounce text-indigo-400" />
              <div className="text-slate-400 text-sm font-semibold">Crawl memory indexes...</div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col">
              
              {/* TAB 1: KNOWLEDGE GRAPH EXPLORER */}
              {activeTab === 'graph' && (
                <div className="flex-1 flex flex-col space-y-6">
                  <div className="flex flex-col sm:flex-row justify-between gap-4 border-b border-slate-800/80 pb-4">
                    <div>
                      <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        <Network className="h-5 w-5 text-indigo-400" /> Relational Knowledge Graph
                      </h2>
                      <p className="text-xs text-slate-400 mt-1">
                        Linked associations generated across research profiles, risks, and campaigns.
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-400 font-medium">Focus Account:</span>
                      <select
                        value={activeGraphCompany}
                        onChange={(e) => setActiveGraphCompany(e.target.value)}
                        className="rounded-xl border border-slate-800 bg-slate-950 px-3 py-1.5 text-xs text-slate-200 focus:border-indigo-500 focus:outline-none"
                      >
                        {companies.length > 0 ? (
                          companies.map((c) => (
                            <option key={c.companyName} value={c.companyName}>{c.companyName}</option>
                          ))
                        ) : (
                          <>
                            <option value="Stripe">Stripe</option>
                            <option value="HubSpot">HubSpot</option>
                            <option value="Salesforce">Salesforce</option>
                          </>
                        )}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 flex-1 items-stretch">
                    {/* SVG Viewer */}
                    <div className="xl:col-span-2 relative rounded-2xl border border-slate-800/60 bg-slate-950/60 min-h-[400px] flex items-center justify-center overflow-hidden">
                      {graph.nodes.length === 0 ? (
                        <div className="text-xs text-slate-500 italic">No connections registered.</div>
                      ) : (
                        <svg className="w-full h-full min-h-[450px]" viewBox="0 0 700 500">
                          <defs>
                            <marker id="arrow" viewBox="0 0 10 10" refX="22" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                              <path d="M 0 0 L 10 5 L 0 10 z" fill="#475569" />
                            </marker>
                          </defs>

                          {/* Edges Lines */}
                          {graph.edges.map((edge, idx) => {
                            const sourcePos = nodePositions[edge.source];
                            const targetPos = nodePositions[edge.target];
                            if (!sourcePos || !targetPos) return null;
                            
                            const midX = (sourcePos.x + targetPos.x) / 2;
                            const midY = (sourcePos.y + targetPos.y) / 2;
                            
                            return (
                              <g key={`edge-${idx}`}>
                                <line
                                  x1={sourcePos.x}
                                  y1={sourcePos.y}
                                  x2={targetPos.x}
                                  y2={targetPos.y}
                                  stroke="#334155"
                                  strokeWidth="2"
                                  strokeDasharray="4,4"
                                  className="stroke-slate-700"
                                  markerEnd="url(#arrow)"
                                />
                                <rect
                                  x={midX - 45}
                                  y={midY - 10}
                                  width="90"
                                  height="18"
                                  rx="4"
                                  fill="#0f172a"
                                  stroke="#1e293b"
                                  strokeWidth="1"
                                />
                                <text
                                  x={midX}
                                  y={midY + 2}
                                  textAnchor="middle"
                                  fill="#94a3b8"
                                  fontSize="9"
                                  fontWeight="600"
                                >
                                  {edge.relationship.toUpperCase()}
                                </text>
                              </g>
                            );
                          })}

                          {/* Nodes Circles */}
                          {graph.nodes.map((node) => {
                            const pos = nodePositions[node.id];
                            if (!pos) return null;
                            const isSelected = selectedNode?.id === node.id;
                            
                            return (
                              <g
                                key={node.id}
                                className="cursor-pointer group"
                                onClick={() => setSelectedNode(node)}
                              >
                                <circle
                                  cx={pos.x}
                                  cy={pos.y}
                                  r={node.type === 'company' ? '28' : '22'}
                                  className={`transition-all duration-300 ${getNodeColor(node.type)} ${
                                    isSelected
                                      ? 'stroke-indigo-400 stroke-[3px] scale-110 shadow-lg'
                                      : 'stroke-slate-700 hover:stroke-indigo-500 hover:scale-105'
                                  }`}
                                />
                                <text
                                  x={pos.x}
                                  y={pos.y + 4}
                                  textAnchor="middle"
                                  fill="#f8fafc"
                                  fontSize={node.type === 'company' ? '9' : '8'}
                                  fontWeight="bold"
                                  className="pointer-events-none drop-shadow"
                                >
                                  {node.label.length > 10 ? `${node.label.substring(0, 8)}...` : node.label}
                                </text>
                                <title>{`${node.label} (${node.type})`}</title>
                              </g>
                            );
                          })}
                        </svg>
                      )}
                    </div>

                    {/* Details Inspector Panel */}
                    <div className="rounded-2xl border border-slate-800/80 bg-slate-900/40 p-5 flex flex-col justify-between">
                      {selectedNode ? (
                        <div className="space-y-4">
                          <div className="border-b border-slate-800 pb-3">
                            <span className="rounded bg-indigo-950 border border-indigo-900 px-2 py-0.5 text-[9px] font-bold text-indigo-400 uppercase">
                              {selectedNode.type}
                            </span>
                            <h3 className="text-lg font-bold text-white mt-2">{selectedNode.label}</h3>
                            <p className="text-xs text-slate-500 mt-0.5">ID: {selectedNode.id}</p>
                          </div>

                          <div className="space-y-3 text-xs text-slate-400">
                            <div>
                              <span className="font-semibold text-slate-200">Relationships:</span>
                              <div className="mt-2 space-y-1">
                                {graph.edges
                                  .filter(e => e.source === selectedNode.id || e.target === selectedNode.id)
                                  .map((e, idx) => (
                                    <div key={idx} className="flex items-center gap-1 bg-slate-950/40 p-2 rounded-lg border border-slate-850">
                                      <span className="text-slate-200 font-medium">
                                        {e.source === selectedNode.id ? 'Self' : e.source}
                                      </span>
                                      <span className="text-indigo-400 font-mono text-[10px]">{`[${e.relationship}]`}</span>
                                      <span className="text-slate-200 font-medium">
                                        {e.target === selectedNode.id ? 'Self' : e.target}
                                      </span>
                                    </div>
                                  ))}
                              </div>
                            </div>
                          </div>

                          <button
                            onClick={() => handleOpenInspector(`Graph Node: ${selectedNode.label}`, selectedNode)}
                            className="w-full flex items-center justify-center gap-1.5 rounded-xl border border-slate-700 hover:border-slate-600 bg-slate-950 px-3 py-2 text-xs font-semibold"
                          >
                            <Eye className="h-3.5 w-3.5" /> View JSON
                          </button>
                        </div>
                      ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-center p-6 text-slate-500">
                          <Info className="h-8 w-8 text-slate-600 mb-2" />
                          <p className="text-xs">Click a node on the knowledge graph network to view details and metadata.</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: WORKFLOW MEMORY TIMELINE */}
              {activeTab === 'workflows' && (
                <div className="flex-1 flex flex-col space-y-6">
                  <div>
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                      <History className="h-5 w-5 text-indigo-400" /> Historical Workflow executions
                    </h2>
                    <p className="text-xs text-slate-400 mt-1">
                      Check execution plan details, agent step traces, and output variables.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 flex-1 items-stretch">
                    {/* List Table */}
                    <div className="xl:col-span-1 rounded-2xl border border-slate-800/80 bg-slate-950/40 overflow-y-auto max-h-[450px] p-2 space-y-2">
                      {workflows.length === 0 ? (
                        <p className="text-xs text-slate-500 italic p-4">No workflow executions found.</p>
                      ) : (
                        workflows.map((wf) => (
                          <button
                            key={wf.workflowId}
                            onClick={() => setSelectedWorkflow(wf)}
                            className={`w-full rounded-xl border p-4 text-left transition-all ${
                              selectedWorkflow?.workflowId === wf.workflowId
                                ? 'border-indigo-500 bg-indigo-950/20'
                                : 'border-slate-850 bg-slate-900/10 hover:bg-slate-900/30'
                            }`}
                          >
                            <div className="flex justify-between items-center">
                              <span className="font-semibold text-xs text-indigo-400 font-mono">{wf.workflowId}</span>
                              <span className="rounded bg-emerald-950 border border-emerald-900/30 px-1.5 py-0.5 text-[8px] font-bold text-emerald-400 uppercase">
                                {wf.status}
                              </span>
                            </div>
                            <p className="mt-2 text-xs font-semibold text-slate-200 line-clamp-2">{wf.userGoal}</p>
                            <div className="mt-2 flex justify-between items-center text-[10px] text-slate-500">
                              <span>User: {wf.userId}</span>
                              <span>{new Date(wf.createdAt).toLocaleDateString()}</span>
                            </div>
                          </button>
                        ))
                      )}
                    </div>

                    {/* Step timeline / details */}
                    <div className="xl:col-span-2 rounded-2xl border border-slate-800 bg-slate-900/40 p-5 flex flex-col justify-between">
                      {selectedWorkflow ? (
                        <div className="space-y-6 flex-1 flex flex-col justify-between">
                          <div>
                            <div className="flex justify-between items-start border-b border-slate-800 pb-3">
                              <div>
                                <h3 className="text-md font-bold text-white">Workflow Run Timeline</h3>
                                <p className="text-xs text-slate-400 mt-1">Goal: &quot;{selectedWorkflow.userGoal}&quot;</p>
                              </div>
                              <button
                                onClick={() => handleOpenInspector(`Workflow Memory: ${selectedWorkflow.workflowId}`, selectedWorkflow)}
                                className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-950 px-2 py-1 text-[10px] font-semibold"
                              >
                                <Eye className="h-3.5 w-3.5" /> Inspect Raw
                              </button>
                            </div>

                            {/* Agent output list timeline */}
                            <div className="mt-6 space-y-4 max-h-[300px] overflow-y-auto pr-1">
                              {Object.entries(selectedWorkflow.agentOutputs).map(([agentKey, outputVal], idx) => {
                                if (!outputVal) return null;
                                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                const val = outputVal as any;
                                return (
                                  <div key={agentKey} className="flex gap-3 items-start border-l-2 border-slate-800 pl-4 py-1 relative">
                                    <div className="absolute -left-[5px] top-2 h-2.5 w-2.5 rounded-full bg-indigo-500" />
                                    <div className="space-y-1.5 flex-1">
                                      <div className="flex justify-between items-center">
                                        <strong className="text-xs text-slate-200 capitalize">{agentKey} Agent</strong>
                                        <span className="text-[10px] text-slate-500">Step {idx + 1}</span>
                                      </div>
                                      <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-850/80 text-xs text-slate-400">
                                        {agentKey === 'research' && (
                                          <div>
                                            <div className="font-semibold text-slate-200">{val.company?.name || 'Company Profile'}</div>
                                            <p className="line-clamp-2 mt-1">{val.summary}</p>
                                          </div>
                                        )}
                                        {agentKey === 'opportunity' && (
                                          <div>
                                            <div className="font-semibold text-slate-200">Opportunities Scored</div>
                                            <p className="line-clamp-2 mt-1">Total score: {val.overallFitScore || 'N/A'}</p>
                                          </div>
                                        )}
                                        {agentKey === 'outreach' && (
                                          <div>
                                            <div className="font-semibold text-slate-200">Campaign Sequences</div>
                                            <p className="line-clamp-2 mt-1">{val.emailVariants?.[0]?.subject || 'Variants generated'}</p>
                                          </div>
                                        )}
                                        {agentKey === 'crm' && (
                                          <div>
                                            <div className="font-semibold text-slate-200">Log synced in CRM</div>
                                            <p className="line-clamp-2 mt-1">{val.activityLogged?.description || 'Sync confirmation'}</p>
                                          </div>
                                        )}
                                        {agentKey === 'proposal' && (
                                          <div>
                                            <div className="font-semibold text-slate-200">SOW Proposals</div>
                                            <p className="line-clamp-2 mt-1">{val.sow?.scope || 'Scope of Work defined'}</p>
                                          </div>
                                        )}
                                      </div>
                                      <button
                                        onClick={() => handleOpenInspector(`${agentKey} output`, val)}
                                        className="text-[10px] text-indigo-400 hover:underline flex items-center gap-0.5"
                                      >
                                        Inspect output <ChevronRight className="h-3 w-3" />
                                      </button>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                          
                          <div className="text-[10px] text-slate-500 pt-4 border-t border-slate-800">
                            Created: {new Date(selectedWorkflow.createdAt).toLocaleString()} | Updated: {new Date(selectedWorkflow.updatedAt).toLocaleString()}
                          </div>
                        </div>
                      ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-center p-6 text-slate-500">
                          <History className="h-8 w-8 text-slate-600 mb-2" />
                          <p className="text-xs">Select an execution run from the left panel to inspect detailed agent step traces.</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: COMPANY MEMORY KNOWLEDGE BASE */}
              {activeTab === 'companies' && (
                <div className="flex-1 flex flex-col space-y-6">
                  <div>
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                      <Building className="h-5 w-5 text-indigo-400" /> Account Knowledge Base
                    </h2>
                    <p className="text-xs text-slate-400 mt-1">
                      Browse company profile memory records, CRM pipelines, and draft proposals history.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {companies.length === 0 ? (
                      <p className="text-xs text-slate-500 italic">No account records found in company_memory.</p>
                    ) : (
                      companies.map((co) => (
                        <div
                          key={co.companyName}
                          className="border border-slate-850 rounded-2xl bg-slate-950/30 p-5 flex flex-col justify-between space-y-4 hover:border-slate-700 transition-all duration-200"
                        >
                          <div>
                            <div className="flex justify-between items-start">
                              <h3 className="font-bold text-md text-white">{co.companyName}</h3>
                              <span className="text-[10px] font-mono text-slate-500">{co.domain}</span>
                            </div>
                            <p className="text-xs text-slate-400 mt-2 line-clamp-3">
                              {(co.profile?.description as string) || 'No descriptive overview generated.'}
                            </p>
                          </div>

                          <div className="grid grid-cols-2 gap-2 border-t border-slate-850 pt-3 text-[10px] text-slate-500">
                            <div>Opportunities: <span className="text-slate-350 font-semibold">{co.opportunities?.length || 0}</span></div>
                            <div>Outreach variant: <span className="text-slate-350 font-semibold">{co.outreachPlans?.length || 0}</span></div>
                            <div>SOW Proposal: <span className="text-slate-350 font-semibold">{co.proposals?.length || 0}</span></div>
                            <div>CRM updates: <span className="text-slate-350 font-semibold">{co.crmData ? 'Active' : 'Empty'}</span></div>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleOpenInspector(`Company memory: ${co.companyName}`, co)}
                              className="flex-1 flex items-center justify-center gap-1.5 rounded-xl border border-slate-800 hover:border-slate-700 bg-slate-950 py-2 text-xs font-semibold"
                            >
                              <Eye className="h-3.5 w-3.5" /> View Memory
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* TAB 4: AGENT MESSAGING BUS LOGS */}
              {activeTab === 'messages' && (
                <div className="flex-1 flex flex-col space-y-6">
                  <div className="flex flex-col sm:flex-row justify-between gap-4 border-b border-slate-800 pb-4">
                    <div>
                      <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        <MessageSquare className="h-5 w-5 text-indigo-400" /> Messaging Bus Event Logs
                      </h2>
                      <p className="text-xs text-slate-400 mt-1">
                        Review the real-time messages exchanged and broadcasted between active agents.
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-400 font-medium">Topic Filter:</span>
                      <select
                        value={msgTopicFilter}
                        onChange={(e) => setMsgTopicFilter(e.target.value)}
                        className="rounded-xl border border-slate-800 bg-slate-950 px-3 py-1.5 text-xs text-slate-200 focus:border-indigo-500 focus:outline-none"
                      >
                        <option value="all">All Topics</option>
                        <option value="broadcast">Broadcasts</option>
                        <option value="market_insight">Market Insights</option>
                        <option value="direct">Direct Messages</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-3 overflow-y-auto max-h-[450px] pr-1">
                    {messages.length === 0 ? (
                      <p className="text-xs text-slate-500 italic">No agent messages logged in database.</p>
                    ) : (
                      messages
                        .filter((msg) => {
                          if (msgTopicFilter === 'all') return true;
                          if (msgTopicFilter === 'broadcast') return msg.topic === 'broadcast';
                          if (msgTopicFilter === 'market_insight') return msg.topic === 'market_insight';
                          if (msgTopicFilter === 'direct') return msg.topic.startsWith('direct:');
                          return true;
                        })
                        .map((msg, idx) => (
                          <div
                            key={msg.id || idx}
                            className="border border-slate-850/80 rounded-xl bg-slate-950/40 p-4 space-y-2 hover:border-slate-700 transition-all duration-200"
                          >
                            <div className="flex flex-wrap justify-between items-center gap-2">
                              <div className="flex items-center gap-2 text-xs">
                                <span className="font-bold text-slate-200">{msg.sender}</span>
                                <ArrowRight className="h-3 w-3 text-slate-500" />
                                <span className={`border rounded px-2 py-0.5 font-mono text-[9px] ${getTopicBadgeColor(msg.topic)}`}>
                                  {msg.topic}
                                </span>
                              </div>
                              <span className="text-[10px] text-slate-500">{new Date(msg.timestamp).toLocaleTimeString()}</span>
                            </div>

                            <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-850 text-xs text-slate-350 leading-relaxed max-h-[80px] overflow-hidden truncate">
                              {JSON.stringify(msg.payload)}
                            </div>

                            <div className="flex justify-end">
                              <button
                                onClick={() => handleOpenInspector(`Agent Message Payload`, msg.payload)}
                                className="text-[10px] text-indigo-400 hover:underline flex items-center gap-0.5"
                              >
                                View full payload <ChevronRight className="h-3 w-3" />
                              </button>
                            </div>
                          </div>
                        ))
                    )}
                  </div>
                </div>
              )}

              {/* TAB 5: AGENT PERFORMANCE VIEWER */}
              {activeTab === 'performance' && (
                <div className="flex-1 flex flex-col space-y-6">
                  <div>
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                      <Cpu className="h-5 w-5 text-indigo-400" /> Agent Metrics & Performance
                    </h2>
                    <p className="text-xs text-slate-400 mt-1">
                      Check execution count limits, historical latency rates, and reliability stats.
                    </p>
                  </div>

                  <div className="rounded-2xl border border-slate-800 bg-slate-950/40 overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className="border-b border-slate-800 bg-slate-900/60 text-slate-400 font-semibold">
                            <th className="p-4">Agent Name</th>
                            <th className="p-4">Total Runs</th>
                            <th className="p-4 text-center">Success Rate</th>
                            <th className="p-4 text-center">Avg Latency</th>
                            <th className="p-4">Discovered Competitors</th>
                            <th className="p-4">Last Active</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/80">
                          {agents.length === 0 ? (
                            <tr>
                              <td colSpan={6} className="p-4 text-center text-slate-500 italic">No agent performance metrics registered.</td>
                            </tr>
                          ) : (
                            agents.map((ag) => (
                              <tr key={ag.agentName} className="hover:bg-slate-900/20 text-slate-300">
                                <td className="p-4 font-bold text-white flex items-center gap-2">
                                  <ShieldCheck className="h-4 w-4 text-indigo-400" />
                                  {ag.agentName}
                                </td>
                                <td className="p-4 font-semibold text-slate-200">{ag.executionsCount}</td>
                                <td className="p-4 text-center">
                                  <span className={`inline-block px-2 py-0.5 rounded-full border text-[10px] font-bold ${
                                    ag.performanceMetrics.successRate >= 0.9
                                      ? 'bg-emerald-950/80 border-emerald-900 text-emerald-400'
                                      : 'bg-amber-950/80 border-amber-900 text-amber-400'
                                  }`}>
                                    {Math.round(ag.performanceMetrics.successRate * 100)}%
                                  </span>
                                </td>
                                <td className="p-4 text-center font-mono text-slate-400 font-medium">
                                  {ag.performanceMetrics.averageLatencyMs}ms
                                </td>
                                <td className="p-4 max-w-[200px] truncate" title={ag.discoveredCompetitors.join(', ')}>
                                  {ag.discoveredCompetitors.length > 0 ? (
                                    <span className="bg-slate-950 px-2 py-1 rounded text-slate-400">
                                      {ag.discoveredCompetitors.slice(0, 3).join(', ')}
                                      {ag.discoveredCompetitors.length > 3 && '...'}
                                    </span>
                                  ) : (
                                    <span className="text-slate-600">-</span>
                                  )}
                                </td>
                                <td className="p-4 text-slate-500 text-[10px]">
                                  {new Date(ag.performanceMetrics.lastExecutedAt).toLocaleString()}
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

            </div>
          )}
        </div>
      </div>

      {/* Slide-out Context Inspector Drawer */}
      {isInspectorOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={() => setIsInspectorOpen(false)}
          />
          <aside className="relative w-full max-w-2xl bg-slate-900 border-l border-slate-800 flex flex-col h-full shadow-2xl z-50">
            {/* Header */}
            <div className="flex justify-between items-center p-5 border-b border-slate-800 bg-slate-950">
              <div className="flex items-center gap-2">
                <Database className="h-5 w-5 text-indigo-400" />
                <h3 className="font-bold text-md text-white">{inspectorTitle}</h3>
              </div>
              <button
                onClick={() => setIsInspectorOpen(false)}
                className="text-slate-400 hover:text-slate-200 border border-slate-800 rounded-lg p-1 hover:bg-slate-850"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Code Content */}
            <div className="flex-1 overflow-auto p-6 font-mono text-xs text-indigo-200 bg-slate-950/80">
              <pre className="whitespace-pre-wrap">
                {JSON.stringify(inspectorData, null, 2)}
              </pre>
            </div>
            
            {/* Footer */}
            <div className="p-4 border-t border-slate-800 bg-slate-900 flex justify-end">
              <button
                onClick={() => setIsInspectorOpen(false)}
                className="rounded-xl bg-slate-850 hover:bg-slate-800 text-xs font-semibold px-4 py-2"
              >
                Close Inspector
              </button>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}

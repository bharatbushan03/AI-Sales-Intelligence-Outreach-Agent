'use client';

import React, { useState, useRef, useCallback, useEffect, useMemo } from 'react';
import {
  Network,
  Search,
  ZoomIn,
  ZoomOut,
  Move,
  X,
  Info,
  Layers,
  Building2,
  Crosshair,
  TrendingUp,
  Briefcase,
  Megaphone,
} from 'lucide-react';

type NodeType = 'company' | 'competitor' | 'opportunity' | 'industry' | 'campaign';

interface GraphNode {
  id: string;
  label: string;
  type: NodeType;
  description: string;
}

interface GraphEdge {
  source: string;
  target: string;
  relationship: string;
}

interface NodePosition {
  x: number;
  y: number;
}

const NODE_META: Record<NodeType, { label: string; icon: React.ComponentType<{ className?: string }>; color: string; stroke: string; glow: string }> = {
  company: { label: 'Company', icon: Building2, color: '#312e81', stroke: '#6366f1', glow: 'rgba(99,102,241,0.25)' },
  competitor: { label: 'Competitor', icon: Crosshair, color: '#881337', stroke: '#f43f5e', glow: 'rgba(244,63,94,0.25)' },
  opportunity: { label: 'Opportunity', icon: TrendingUp, color: '#064e3b', stroke: '#34d399', glow: 'rgba(52,211,153,0.25)' },
  industry: { label: 'Industry', icon: Briefcase, color: '#3b0764', stroke: '#a78bfa', glow: 'rgba(167,139,250,0.25)' },
  campaign: { label: 'Campaign', icon: Megaphone, color: '#78350f', stroke: '#fbbf24', glow: 'rgba(251,191,36,0.25)' },
};

const MOCK_NODES: GraphNode[] = [
  { id: 'stripe', label: 'Stripe', type: 'company', description: 'Leading payment processing platform handling billions in transactions annually for internet businesses.' },
  { id: 'hubspot', label: 'HubSpot', type: 'company', description: 'CRM and marketing automation platform for scaling businesses with inbound methodology.' },
  { id: 'salesforce', label: 'Salesforce', type: 'company', description: 'Enterprise CRM platform with comprehensive sales intelligence and workflow automation.' },
  { id: 'adyen', label: 'Adyen', type: 'competitor', description: 'Global payment company offering a unified commerce platform for omnichannel businesses.' },
  { id: 'mailchimp', label: 'Mailchimp', type: 'competitor', description: 'Email marketing and automation platform popular with small to medium businesses.' },
  { id: 'pipedrive', label: 'Pipedrive', type: 'competitor', description: 'Sales CRM platform built for SMB sales teams with pipeline management focus.' },
  { id: 'payments-industry', label: 'Payments', type: 'industry', description: 'Digital payment processing and financial technology infrastructure sector.' },
  { id: 'crm-industry', label: 'CRM', type: 'industry', description: 'Customer relationship management software market serving enterprise and SMB segments.' },
  { id: 'martech-industry', label: 'Marketing Tech', type: 'industry', description: 'Marketing technology and automation software landscape for digital engagement.' },
  { id: 'enterprise-deal', label: 'Enterprise Deal', type: 'opportunity', description: '$500K ARR enterprise agreement with tiered pricing and dedicated support.' },
  { id: 'upselling', label: 'Upsell Growth', type: 'opportunity', description: 'Expansion revenue opportunity from existing customer base via cross-sell and upsell.' },
  { id: 'expansion', label: 'Market Expansion', type: 'opportunity', description: 'New vertical and geographic market expansion into adjacent industry segments.' },
  { id: 'q1-campaign', label: 'Q1 Outreach', type: 'campaign', description: 'Q1 outbound prospecting campaign targeting enterprise accounts in fintech.' },
  { id: 'product-launch', label: 'Launch 2026', type: 'campaign', description: 'New product launch campaign with multi-channel distribution and demo-driven outreach.' },
  { id: 'retargeting', label: 'Retargeting', type: 'campaign', description: 'Retargeting campaign for warm leads in the pipeline with personalized content.' },
];

const MOCK_EDGES: GraphEdge[] = [
  { source: 'stripe', target: 'payments-industry', relationship: 'operates_in' },
  { source: 'stripe', target: 'adyen', relationship: 'competes_with' },
  { source: 'stripe', target: 'enterprise-deal', relationship: 'targets' },
  { source: 'stripe', target: 'q1-campaign', relationship: 'campaign_for' },
  { source: 'hubspot', target: 'crm-industry', relationship: 'operates_in' },
  { source: 'hubspot', target: 'mailchimp', relationship: 'competes_with' },
  { source: 'hubspot', target: 'upselling', relationship: 'targets' },
  { source: 'hubspot', target: 'retargeting', relationship: 'campaign_for' },
  { source: 'salesforce', target: 'crm-industry', relationship: 'operates_in' },
  { source: 'salesforce', target: 'pipedrive', relationship: 'competes_with' },
  { source: 'salesforce', target: 'expansion', relationship: 'targets' },
  { source: 'salesforce', target: 'product-launch', relationship: 'campaign_for' },
  { source: 'mailchimp', target: 'martech-industry', relationship: 'operates_in' },
  { source: 'pipedrive', target: 'martech-industry', relationship: 'operates_in' },
  { source: 'adyen', target: 'payments-industry', relationship: 'operates_in' },
  { source: 'martech-industry', target: 'product-launch', relationship: 'related_to' },
  { source: 'crm-industry', target: 'retargeting', relationship: 'related_to' },
  { source: 'payments-industry', target: 'upselling', relationship: 'related_to' },
  { source: 'enterprise-deal', target: 'q1-campaign', relationship: 'supported_by' },
  { source: 'expansion', target: 'retargeting', relationship: 'supported_by' },
];

function computeLayout(nodes: GraphNode[]): Record<string, NodePosition> {
  const positions: Record<string, NodePosition> = {};
  const cx = 400;
  const cy = 300;

  const groups: Record<string, GraphNode[]> = {};
  for (const n of nodes) {
    if (!groups[n.type]) groups[n.type] = [];
    groups[n.type].push(n);
  }

  const ringConfig: { type: NodeType; radius: number; offset: number }[] = [
    { type: 'industry', radius: 90, offset: -Math.PI / 2 },
    { type: 'company', radius: 180, offset: -Math.PI / 2 },
    { type: 'competitor', radius: 280, offset: 0 },
    { type: 'opportunity', radius: 270, offset: Math.PI / 4 },
    { type: 'campaign', radius: 290, offset: Math.PI / 3 },
  ];

  for (const config of ringConfig) {
    const typeNodes = groups[config.type];
    if (!typeNodes) continue;
    typeNodes.forEach((node, i) => {
      const angle = config.offset + (2 * Math.PI * i) / typeNodes.length;
      positions[node.id] = {
        x: cx + config.radius * Math.cos(angle),
        y: cy + config.radius * Math.sin(angle),
      };
    });
  }

  return positions;
}

export default function KnowledgeGraphPage() {
  const [nodes] = useState<GraphNode[]>(MOCK_NODES);
  const [edges] = useState<GraphEdge[]>(MOCK_EDGES);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
  const [typeFilter, setTypeFilter] = useState<NodeType | 'all'>('all');
  const [showLegend, setShowLegend] = useState(true);

  const [viewport, setViewport] = useState({ x: 0, y: 0, scale: 1 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const svgContainerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const nodePositions = useMemo(() => computeLayout(nodes), [nodes]);

  const filteredNodeIds = useMemo(() => {
    if (!searchQuery && typeFilter === 'all') return null;
    return new Set(
      nodes
        .filter((n) => {
          if (typeFilter !== 'all' && n.type !== typeFilter) return false;
          if (
            searchQuery &&
            !n.label.toLowerCase().includes(searchQuery.toLowerCase())
          )
            return false;
          return true;
        })
        .map((n) => n.id),
    );
  }, [nodes, searchQuery, typeFilter]);

  const handleZoomIn = () =>
    setViewport((v) => ({ ...v, scale: Math.min(v.scale * 1.4, 5) }));
  const handleZoomOut = () =>
    setViewport((v) => ({ ...v, scale: Math.max(v.scale / 1.4, 0.15) }));
  const handleResetView = () => setViewport({ x: 0, y: 0, scale: 1 });

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (
        e.target === svgRef.current ||
        (e.target instanceof SVGElement && e.target.tagName === 'svg')
      ) {
        setIsDragging(true);
        setDragStart({ x: e.clientX - viewport.x, y: e.clientY - viewport.y });
      }
    },
    [viewport.x, viewport.y],
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (isDragging) {
        setViewport((v) => ({
          ...v,
          x: e.clientX - dragStart.x,
          y: e.clientY - dragStart.y,
        }));
      }
    },
    [isDragging, dragStart],
  );

  const handleMouseUp = useCallback(() => setIsDragging(false), []);

  useEffect(() => {
    const container = svgContainerRef.current;
    if (!container) return;

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const delta = e.deltaY > 0 ? 0.88 : 1 / 0.88;
      setViewport((v) => ({
        ...v,
        scale: Math.max(0.15, Math.min(5, v.scale * delta)),
      }));
    };

    container.addEventListener('wheel', onWheel, { passive: false });
    return () => container.removeEventListener('wheel', onWheel);
  }, []);

  const handleNodeClick = useCallback(
    (node: GraphNode) => {
      setSelectedNode((prev) => (prev?.id === node.id ? null : node));
    },
    [],
  );

  const connectedEdges = useMemo(() => {
    if (!selectedNode) return [];
    return edges.filter(
      (e) => e.source === selectedNode.id || e.target === selectedNode.id,
    );
  }, [selectedNode, edges]);

  const getConnectedNode = (edge: GraphEdge, currentNodeId: string) => {
    const connectedId =
      edge.source === currentNodeId ? edge.target : edge.source;
    return nodes.find((n) => n.id === connectedId);
  };

  const isNodeVisible = (nodeId: string) => {
    if (!filteredNodeIds) return true;
    return filteredNodeIds.has(nodeId);
  };

  const nodeTypeCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const n of nodes) {
      counts[n.type] = (counts[n.type] || 0) + 1;
    }
    return counts;
  }, [nodes]);

  return (
    <div className="flex h-full flex-col space-y-6 pb-8 text-slate-100">
      <div className="flex flex-col justify-between gap-4 border-b border-slate-800 pb-5 md:flex-row md:items-center">
        <div>
          <h1 className="flex items-center gap-3 text-3xl font-bold tracking-tight text-white md:text-4xl">
            <Network className="h-9 w-9 text-indigo-500" />
            Interactive Knowledge Graph
          </h1>
          <p className="mt-2 text-sm text-slate-400">
            Explore relationships between companies, competitors, opportunities,
            industries, and campaigns.
          </p>
        </div>
      </div>

      <div className="grid flex-1 grid-cols-1 gap-6 xl:grid-cols-4">
        <div className="flex flex-col space-y-4 xl:col-span-3">
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search nodes..."
                className="w-full rounded-xl border border-slate-800 bg-slate-950 py-2.5 pl-10 pr-4 text-sm text-slate-200 placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            <select
              value={typeFilter}
              onChange={(e) =>
                setTypeFilter(e.target.value as NodeType | 'all')
              }
              className="rounded-xl border border-slate-800 bg-slate-950 px-3 py-2.5 text-sm text-slate-200 focus:border-indigo-500 focus:outline-none"
            >
              <option value="all">All Types</option>
              <option value="company">Companies</option>
              <option value="competitor">Competitors</option>
              <option value="opportunity">Opportunities</option>
              <option value="industry">Industries</option>
              <option value="campaign">Campaigns</option>
            </select>

            <div className="flex items-center gap-1 rounded-xl border border-slate-800 bg-slate-950 p-1">
              <button
                onClick={handleZoomIn}
                title="Zoom in"
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-slate-200"
              >
                <ZoomIn className="h-4 w-4" />
              </button>
              <button
                onClick={handleZoomOut}
                title="Zoom out"
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-slate-200"
              >
                <ZoomOut className="h-4 w-4" />
              </button>
              <button
                onClick={handleResetView}
                title="Reset view"
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-slate-200"
              >
                <Move className="h-4 w-4" />
              </button>
              <span className="border-l border-slate-800 px-2 text-[10px] text-slate-600 tabular-nums">
                {Math.round(viewport.scale * 100)}%
              </span>
            </div>

            <button
              onClick={() => setShowLegend(!showLegend)}
              className={`flex items-center gap-2 rounded-xl border px-3 py-2.5 text-sm transition-all ${
                showLegend
                  ? 'border-indigo-500/50 bg-indigo-950/30 text-indigo-300'
                  : 'border-slate-800 bg-slate-950 text-slate-400 hover:text-slate-200'
              }`}
            >
              <Layers className="h-4 w-4" />
              Legend
            </button>
          </div>

          <div
            ref={svgContainerRef}
            className="relative min-h-[500px] flex-1 overflow-hidden rounded-2xl border border-slate-800 bg-slate-950/60"
          >
            <div className="pointer-events-none absolute right-3 bottom-3 z-10 flex items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-900/80 px-2.5 py-1 text-[10px] text-slate-500">
              <Move className="h-3 w-3" />
              Drag to pan · Scroll to zoom
            </div>

            {showLegend && (
              <div className="pointer-events-none absolute left-3 top-3 z-10 space-y-1.5 rounded-xl border border-slate-800 bg-slate-900/90 px-3 py-2.5 backdrop-blur-sm">
                <span className="text-[10px] font-semibold tracking-wider text-slate-500 uppercase">
                  Legend
                </span>
                {(Object.keys(NODE_META) as NodeType[]).map((type) => {
                  const meta = NODE_META[type];
                  return (
                    <div key={type} className="flex items-center gap-2 text-xs">
                      <span
                        className="inline-block h-2.5 w-2.5 rounded-full"
                        style={{ backgroundColor: meta.stroke }}
                      />
                      <span className="text-slate-400">{meta.label}</span>
                      <span className="text-[10px] text-slate-600">
                        ({nodeTypeCounts[type] || 0})
                      </span>
                    </div>
                  );
                })}
              </div>
            )}

            <svg
              ref={svgRef}
              className="h-full w-full cursor-grab active:cursor-grabbing"
              viewBox="0 0 800 600"
              preserveAspectRatio="xMidYMid meet"
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
            >
              <defs>
                {(Object.keys(NODE_META) as NodeType[]).map((type) => (
                  <filter key={type} id={`glow-${type}`}>
                    <feDropShadow
                      dx="0"
                      dy="0"
                      stdDeviation="6"
                      floodColor={NODE_META[type].glow}
                    />
                  </filter>
                ))}
              </defs>

              <g
                transform={`translate(${viewport.x}, ${viewport.y}) scale(${viewport.scale})`}
              >
                {edges.map((edge, idx) => {
                  const sourcePos = nodePositions[edge.source];
                  const targetPos = nodePositions[edge.target];
                  if (!sourcePos || !targetPos) return null;

                  const midX = (sourcePos.x + targetPos.x) / 2;
                  const midY = (sourcePos.y + targetPos.y) / 2;
                  const isConnectedToSelected =
                    selectedNode &&
                    (edge.source === selectedNode.id ||
                      edge.target === selectedNode.id);
                  const isDimmed =
                    selectedNode && !isConnectedToSelected;

                  return (
                    <g key={`edge-${idx}`}>
                      <line
                        x1={sourcePos.x}
                        y1={sourcePos.y}
                        x2={targetPos.x}
                        y2={targetPos.y}
                        stroke={isConnectedToSelected ? '#6366f1' : '#334155'}
                        strokeWidth={isConnectedToSelected ? 2.5 : 1.5}
                        strokeDasharray="5,4"
                        className={
                          isDimmed
                            ? 'opacity-20 transition-opacity duration-300'
                            : 'transition-opacity duration-300'
                        }
                      />
                      <rect
                        x={midX - 52}
                        y={midY - 9}
                        width="104"
                        height="18"
                        rx="4"
                        fill={isDimmed ? '#0f172a' : '#0f172a'}
                        stroke={isConnectedToSelected ? '#6366f1' : '#1e293b'}
                        strokeWidth="1"
                        className={
                          isDimmed
                            ? 'opacity-30 transition-opacity duration-300'
                            : 'transition-opacity duration-300'
                        }
                      />
                      <text
                        x={midX}
                        y={midY + 3.5}
                        textAnchor="middle"
                        fill={isConnectedToSelected ? '#a5b4fc' : '#64748b'}
                        fontSize="8"
                        fontWeight="600"
                        className={
                          isDimmed
                            ? 'opacity-30 transition-opacity duration-300'
                            : 'transition-opacity duration-300'
                        }
                      >
                        {edge.relationship.replace(/_/g, ' ')}
                      </text>
                    </g>
                  );
                })}

                {nodes.map((node) => {
                  const pos = nodePositions[node.id];
                  if (!pos) return null;

                  const meta = NODE_META[node.type];
                  const isSelected = selectedNode?.id === node.id;
                  const isHovered = hoveredNodeId === node.id;
                  const isConnectedToSelected =
                    selectedNode &&
                    edges.some(
                      (e) =>
                        (e.source === selectedNode.id &&
                          e.target === node.id) ||
                        (e.target === selectedNode.id &&
                          e.source === node.id),
                    );
                  const isDimmed =
                    selectedNode &&
                    !isSelected &&
                    !isConnectedToSelected;
                  const visible =
                    !filteredNodeIds || filteredNodeIds.has(node.id);
                  const radius =
                    node.type === 'company' ? 24 : node.type === 'industry' ? 20 : 18;

                  if (!visible) return null;

                  return (
                    <g
                      key={node.id}
                      className="cursor-pointer transition-opacity duration-300"
                      style={{ opacity: isDimmed ? 0.2 : 1 }}
                      onClick={() => handleNodeClick(node)}
                      onMouseEnter={() => setHoveredNodeId(node.id)}
                      onMouseLeave={() => setHoveredNodeId(null)}
                    >
                      <circle
                        cx={pos.x}
                        cy={pos.y}
                        r={radius}
                        fill={meta.color}
                        stroke={
                          isSelected
                            ? '#e2e8f0'
                            : isHovered
                              ? meta.stroke
                              : meta.stroke
                        }
                        strokeWidth={isSelected ? 3 : isHovered ? 2.5 : 2}
                        filter={
                          isSelected
                            ? `url(#glow-${node.type})`
                            : undefined
                        }
                        className={
                          isSelected
                            ? 'drop-shadow-lg'
                            : 'hover:brightness-125'
                        }
                        style={{
                          transition:
                            'stroke-width 0.2s, filter 0.2s, stroke 0.2s',
                        }}
                      />
                      <text
                        x={pos.x}
                        y={pos.y + 4}
                        textAnchor="middle"
                        fill="#f8fafc"
                        fontSize={
                          node.type === 'company'
                            ? 10
                            : node.type === 'industry'
                              ? 9
                              : 8
                        }
                        fontWeight="bold"
                        className="pointer-events-none select-none"
                        style={{
                          textShadow:
                            '0 1px 3px rgba(0,0,0,0.8), 0 0 6px rgba(0,0,0,0.5)',
                        }}
                      >
                        {node.label.length > 10
                          ? node.label.slice(0, 9) + '...'
                          : node.label}
                      </text>
                      <title>
                        {node.label} ({meta.label})
                        {!!filteredNodeIds && !visible
                          ? ' (hidden by filter)'
                          : ''}
                      </title>
                    </g>
                  );
                })}
              </g>
            </svg>
          </div>
        </div>

        <div className="flex flex-col space-y-4">
          {selectedNode ? (
            <div className="animate-in slide-in-from-right rounded-2xl border border-slate-800 bg-slate-900/40 p-5">
              <div className="flex items-start justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  {(() => {
                    const Icon = NODE_META[selectedNode.type].icon;
                    return (
                      <Icon
                        className="h-5 w-5"
                        style={{ color: NODE_META[selectedNode.type].stroke }}
                      />
                    );
                  })()}
                  <div>
                    <span
                      className="rounded border px-2 py-0.5 text-[9px] font-bold uppercase"
                      style={{
                        borderColor: NODE_META[selectedNode.type].stroke + '40',
                        backgroundColor:
                          NODE_META[selectedNode.type].color + '80',
                        color: NODE_META[selectedNode.type].stroke,
                      }}
                    >
                      {NODE_META[selectedNode.type].label}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedNode(null)}
                  className="rounded-lg p-1 text-slate-500 hover:bg-slate-800 hover:text-slate-300"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <h3 className="mt-3 text-lg font-bold text-white">
                {selectedNode.label}
              </h3>
              <p className="mt-1 text-xs leading-relaxed text-slate-400">
                {selectedNode.description}
              </p>

              {connectedEdges.length > 0 && (
                <div className="mt-5 space-y-3">
                  <span className="text-xs font-semibold tracking-wide text-slate-500 uppercase">
                    Connections ({connectedEdges.length})
                  </span>
                  <div className="space-y-2">
                    {connectedEdges.map((edge, idx) => {
                      const connectedNode = getConnectedNode(
                        edge,
                        selectedNode.id,
                      );
                      if (!connectedNode) return null;
                      const meta = NODE_META[connectedNode.type];
                      return (
                        <button
                          key={idx}
                          onClick={() => handleNodeClick(connectedNode)}
                          className="flex w-full items-center gap-2.5 rounded-xl border border-slate-800 bg-slate-950/40 p-3 text-left transition-all hover:border-slate-700 hover:bg-slate-900/60"
                        >
                          <span
                            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full"
                            style={{ backgroundColor: meta.color + '80' }}
                          >
                            {(() => {
                              const Icon = meta.icon;
                              return (
                                <Icon
                                  className="h-3.5 w-3.5"
                                  style={{ color: meta.stroke }}
                                />
                              );
                            })()}
                          </span>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-1.5">
                              <span className="truncate text-xs font-semibold text-slate-200">
                                {connectedNode.label}
                              </span>
                              <span className="shrink-0 text-[9px] text-slate-600">
                                ({meta.label})
                              </span>
                            </div>
                            <div className="mt-0.5 text-[10px] text-indigo-400">
                              {edge.relationship.replace(/_/g, ' ')}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-1 flex-col items-center justify-center rounded-2xl border border-slate-800 bg-slate-900/20 p-8 text-center">
              <div className="mb-4 rounded-full border border-slate-800 bg-slate-900/60 p-4">
                <Network className="h-8 w-8 text-slate-600" />
              </div>
              <Info className="mb-3 h-5 w-5 text-slate-600" />
              <p className="text-sm text-slate-500">
                Click any node on the graph to inspect its details and
                relationships.
              </p>
              <p className="mt-2 text-xs text-slate-600">
                Use the search and filter to find specific nodes.
              </p>
            </div>
          )}

          <div className="rounded-2xl border border-slate-800 bg-slate-900/20 p-4">
            <h4 className="text-xs font-semibold tracking-wide text-slate-500 uppercase">
              Graph Summary
            </h4>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <div className="rounded-lg border border-slate-800 bg-slate-950/40 p-2.5 text-center">
                <div className="text-lg font-bold text-white">
                  {nodes.length}
                </div>
                <div className="text-[10px] text-slate-500">Nodes</div>
              </div>
              <div className="rounded-lg border border-slate-800 bg-slate-950/40 p-2.5 text-center">
                <div className="text-lg font-bold text-white">
                  {edges.length}
                </div>
                <div className="text-[10px] text-slate-500">Edges</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

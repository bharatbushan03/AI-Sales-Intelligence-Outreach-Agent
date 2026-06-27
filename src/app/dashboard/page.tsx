'use client';

import { useState, useEffect } from 'react';
import {
  Activity,
  ArrowUpRight,
  Banknote,
  Bot,
  Clock,
  MessageCircle,
  Shield,
  TrendingUp,
  Users,
  Zap,
  Target,
  Brain,
  Database,
  FileText,
  BarChart3,
  DollarSign,
  CheckCircle2,
  AlertTriangle,
  Gauge,
  Radio,
  PieChart,
  LineChart,
  Layers,
  Orbit,
  Globe,
  Sparkles,
  Workflow,
  Cpu,
  UserCheck,
  Timer,
  AlertCircle,
} from 'lucide-react';

interface Metric {
  label: string;
  value: string;
  change: string;
  positive: boolean;
  icon: React.ReactNode;
}
interface PipelineStage {
  name: string;
  count: number;
  value: string;
  color: string;
}
interface AgentMetric {
  name: string;
  status: string;
  tasks: number;
  score: number;
  color: string;
}

const METRICS: Metric[] = [
  {
    label: 'Pipeline Value',
    value: '$4.2M',
    change: '+18.5%',
    positive: true,
    icon: <Banknote className="h-5 w-5" />,
  },
  {
    label: 'Active Opportunities',
    value: '156',
    change: '+12 this week',
    positive: true,
    icon: <Target className="h-5 w-5" />,
  },
  {
    label: 'Conversion Rate',
    value: '32.4%',
    change: '+4.2%',
    positive: true,
    icon: <TrendingUp className="h-5 w-5" />,
  },
  {
    label: 'Avg Deal Size',
    value: '$87K',
    change: '+$12K',
    positive: true,
    icon: <DollarSign className="h-5 w-5" />,
  },
  {
    label: 'AI Agents Active',
    value: '8',
    change: '100% uptime',
    positive: true,
    icon: <Bot className="h-5 w-5" />,
  },
  {
    label: 'Proposals Pending',
    value: '24',
    change: '8 this week',
    positive: true,
    icon: <FileText className="h-5 w-5" />,
  },
  {
    label: 'Outreach Sent',
    value: '1,847',
    change: '+23% rate',
    positive: true,
    icon: <MessageCircle className="h-5 w-5" />,
  },
  {
    label: 'Forecast Revenue',
    value: '$6.8M',
    change: '+$1.2M',
    positive: true,
    icon: <BarChart3 className="h-5 w-5" />,
  },
];

const PIPELINE: PipelineStage[] = [
  { name: 'Discovery', count: 48, value: '$1.8M', color: 'from-sky-500 to-blue-600' },
  { name: 'Qualification', count: 36, value: '$1.2M', color: 'from-blue-500 to-indigo-600' },
  { name: 'Proposal', count: 28, value: '$980K', color: 'from-indigo-500 to-purple-600' },
  { name: 'Negotiation', count: 18, value: '$650K', color: 'from-purple-500 to-pink-600' },
  { name: 'Closing', count: 12, value: '$420K', color: 'from-emerald-500 to-teal-600' },
];

const AGENTS: AgentMetric[] = [
  {
    name: 'Manager Agent',
    status: 'active',
    tasks: 156,
    score: 98,
    color: 'from-violet-500 to-purple-600',
  },
  {
    name: 'Research Agent',
    status: 'active',
    tasks: 234,
    score: 96,
    color: 'from-blue-500 to-indigo-600',
  },
  {
    name: 'Opportunity Agent',
    status: 'active',
    tasks: 189,
    score: 94,
    color: 'from-amber-500 to-orange-600',
  },
  {
    name: 'Outreach Agent',
    status: 'active',
    tasks: 312,
    score: 92,
    color: 'from-emerald-500 to-teal-600',
  },
  {
    name: 'CRM Agent',
    status: 'active',
    tasks: 178,
    score: 97,
    color: 'from-cyan-500 to-blue-600',
  },
  {
    name: 'Proposal Agent',
    status: 'active',
    tasks: 145,
    score: 95,
    color: 'from-rose-500 to-pink-600',
  },
];

const RECENT_WINS = [
  { company: 'TechCorp Inc.', value: '$240K', agent: 'Research + Outreach', time: '2h ago' },
  { company: 'DataFlow Systems', value: '$180K', agent: 'Opportunity + Proposal', time: '5h ago' },
  { company: 'CloudNine SaaS', value: '$320K', agent: 'Full Pipeline', time: '1d ago' },
  { company: 'Vertex Analytics', value: '$95K', agent: 'CRM + Outreach', time: '2d ago' },
];

function Sparkline({ data, color }: { data: number[]; color: string }) {
  const h = 40;
  const w = 120;
  const max = Math.max(...data, 1);
  const pts = data.map((v, i) => `${(i / (data.length - 1)) * w},${h - (v / max) * h}`).join(' ');
  return (
    <svg width={w} height={h} className="opacity-60">
      <polyline fill="none" stroke={color} strokeWidth="2" points={pts} />
    </svg>
  );
}

export default function ExecutiveCommandCenter() {
  const [timeRange, setTimeRange] = useState<'24h' | '7d' | '30d'>('7d');
  const [mounted, setMounted] = useState(false);
  const [animatedValues, setAnimatedValues] = useState(METRICS.map(() => 0));

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    METRICS.forEach((_, i) => {
      setTimeout(() => {
        setAnimatedValues((prev) => {
          const n = [...prev];
          n[i] = 100;
          return n;
        });
      }, i * 150);
    });
  }, [mounted]);

  const totalPipeline = PIPELINE.reduce(
    (s, p) => s + parseInt(p.value.replace(/[$,K]/g, '')) * (p.value.includes('M') ? 1000 : 1),
    0,
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950/20 p-4 md:p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* === HEADER === */}
        <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/20">
                <LayoutDashboard className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-100 md:text-3xl">
                  Executive Command Center
                </h1>
                <p className="text-sm text-slate-500">
                  Real-time B2B sales intelligence platform overview
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900/80 p-1">
            {(['24h', '7d', '30d'] as const).map((r) => (
              <button
                key={r}
                onClick={() => setTimeRange(r)}
                className={`rounded-lg px-4 py-1.5 text-xs font-semibold transition-all ${timeRange === r ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'}`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        {/* === STATUS BANNER === */}
        <div className="flex items-center justify-between rounded-xl border border-emerald-700/30 bg-gradient-to-r from-emerald-900/30 via-emerald-800/20 to-emerald-900/30 p-4">
          <div className="flex items-center gap-3">
            <div className="relative">
              <CheckCircle2 className="h-6 w-6 text-emerald-400" />
              <span className="absolute -top-1 -right-1 h-2 w-2 animate-ping rounded-full bg-emerald-400" />
            </div>
            <div>
              <p className="text-sm font-semibold text-emerald-300">All Systems Operational</p>
              <p className="text-xs text-emerald-400/70">
                6 agents active · 1,847 outreach sent today · $4.2M pipeline
              </p>
            </div>
          </div>
          <div className="hidden items-center gap-3 text-xs text-slate-500 md:flex">
            <span className="flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Live
            </span>
            <span className="flex items-center gap-1">
              <Cpu className="h-3 w-3" /> 42% capacity
            </span>
          </div>
        </div>

        {/* === METRICS GRID === */}
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {METRICS.map((metric, i) => (
            <div
              key={metric.label}
              className="group relative overflow-hidden rounded-xl border border-slate-800 bg-slate-900/60 p-4 backdrop-blur-sm transition-all hover:border-slate-700"
            >
              <div className="absolute top-0 right-0 h-24 w-24 translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br from-white/[0.02] to-transparent" />
              <div className="mb-3 flex items-start justify-between">
                <div className="rounded-lg bg-slate-800/50 p-2 text-indigo-400">{metric.icon}</div>
                <Sparkline
                  data={[30, 45, 38, 52, 48, 65, 55, 72, 68, 85, 78, 95]}
                  color="#818cf8"
                />
              </div>
              <p className="mb-1 text-xs text-slate-500">{metric.label}</p>
              <div className="flex items-baseline gap-2">
                <span
                  className={`text-xl font-bold text-slate-100 transition-all duration-1000 ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'}`}
                  style={{ transitionDelay: `${i * 100}ms` }}
                >
                  {metric.value}
                </span>
                <span
                  className={`text-xs font-semibold ${metric.positive ? 'text-emerald-400' : 'text-red-400'}`}
                >
                  {metric.change}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* === PIPELINE & CHARTS === */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          {/* Pipeline View */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur-sm lg:col-span-2">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="flex items-center gap-2 text-sm font-semibold text-slate-200">
                <Layers className="h-4 w-4 text-indigo-400" /> Sales Pipeline
              </h2>
              <span className="text-xs text-slate-500">
                Total: ${totalPipeline.toLocaleString()}K
              </span>
            </div>
            <div className="space-y-3">
              {PIPELINE.map((stage, i) => (
                <div key={stage.name} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span
                        className="h-2 w-2 rounded-full bg-gradient-to-br"
                        style={{
                          background:
                            stage.color === 'from-sky-500 to-blue-600'
                              ? 'linear-gradient(135deg, #0ea5e9, #2563eb)'
                              : '',
                        }}
                      />
                      <span className="font-medium text-slate-300">{stage.name}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-slate-400">{stage.count} deals</span>
                      <span className="w-16 text-right font-semibold text-slate-200">
                        {stage.value}
                      </span>
                    </div>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-slate-800">
                    <div
                      className={`h-full rounded-full bg-gradient-to-r ${stage.color} transition-all duration-1000`}
                      style={{ width: `${(stage.count / PIPELINE[0].count) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Revenue Forecast */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur-sm">
            <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold text-slate-200">
              <DollarSign className="h-4 w-4 text-amber-400" /> Revenue Forecast
            </h2>
            <div className="space-y-4">
              {[
                {
                  label: 'Conservative',
                  value: '$4.2M',
                  pct: 65,
                  color: 'from-slate-500 to-slate-400',
                },
                {
                  label: 'Expected',
                  value: '$6.8M',
                  pct: 85,
                  color: 'from-indigo-500 to-purple-600',
                },
                {
                  label: 'Best Case',
                  value: '$9.5M',
                  pct: 100,
                  color: 'from-emerald-500 to-teal-600',
                },
              ].map((f) => (
                <div key={f.label} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400">{f.label}</span>
                    <span className="font-bold text-slate-200">{f.value}</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-slate-800">
                    <div
                      className={`h-full rounded-full bg-gradient-to-r ${f.color} transition-all duration-1000`}
                      style={{ width: `${f.pct}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-5 border-t border-slate-800 pt-4">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>Confidence Interval</span>
                <span className="text-emerald-400">85%</span>
              </div>
            </div>
          </div>
        </div>

        {/* === AGENT PERFORMANCE === */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-sm font-semibold text-slate-200">
              <Bot className="h-4 w-4 text-emerald-400" /> AI Agent Performance
            </h2>
            <span className="text-xs font-semibold text-emerald-400">All agents operational</span>
          </div>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
            {AGENTS.map((agent) => (
              <div
                key={agent.name}
                className="rounded-xl border border-slate-700/50 bg-slate-800/40 p-4 transition-all hover:border-slate-600/50"
              >
                <div className="mb-3 flex items-center gap-2">
                  <div
                    className={`h-2 w-2 rounded-full ${agent.status === 'active' ? 'bg-emerald-500' : 'bg-slate-600'}`}
                  />
                  <span className="truncate text-xs font-medium text-slate-300">{agent.name}</span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-[10px] text-slate-500">
                    <span>Tasks</span>
                    <span className="font-mono text-slate-300">{agent.tasks}</span>
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-slate-500">
                    <span>Score</span>
                    <span className="font-bold text-emerald-400">{agent.score}%</span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-slate-800">
                    <div
                      className={`h-full rounded-full bg-gradient-to-r ${agent.color} transition-all duration-1000`}
                      style={{ width: `${agent.score}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* === BOTTOM ROW: Recent Wins + Activity === */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {/* Recent Wins */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur-sm">
            <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold text-slate-200">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" /> Recent Wins
            </h2>
            <div className="space-y-3">
              {RECENT_WINS.map((win, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between rounded-lg border border-slate-700/30 bg-slate-800/30 p-3 transition-all hover:border-slate-600/30"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500/20 to-teal-500/20">
                      <Trophy className="h-4 w-4 text-emerald-400" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-200">{win.company}</p>
                      <p className="text-[10px] text-slate-500">
                        {win.agent} · {win.time}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-emerald-400">{win.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Activity Feed */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur-sm">
            <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold text-slate-200">
              <Activity className="h-4 w-4 text-indigo-400" /> Live Activity
            </h2>
            <div className="space-y-2.5">
              {[
                {
                  agent: 'Research Agent',
                  action: 'Completed analysis of TechCorp',
                  time: '2 min ago',
                },
                {
                  agent: 'Proposal Agent',
                  action: 'Generated proposal for DataFlow',
                  time: '5 min ago',
                },
                { agent: 'CRM Agent', action: 'Synced 12 leads to Salesforce', time: '8 min ago' },
                {
                  agent: 'Outreach Agent',
                  action: 'Sent 45 personalized emails',
                  time: '12 min ago',
                },
                {
                  agent: 'Opportunity Agent',
                  action: 'Identified 3 new opportunities',
                  time: '15 min ago',
                },
              ].map((act, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 rounded-lg p-2.5 transition-all hover:bg-slate-800/30"
                >
                  <div className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-500" />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-slate-300">
                      <span className="font-semibold text-indigo-400">{act.agent}</span>{' '}
                      {act.action}
                    </p>
                  </div>
                  <span className="shrink-0 text-[10px] text-slate-600">{act.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* === SYSTEM HEALTH === */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-4 backdrop-blur-sm">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5">
                <Gauge className="h-3.5 w-3.5" /> System Health:{' '}
                <span className="font-semibold text-emerald-400">98.7%</span>
              </span>
              <span className="flex items-center gap-1.5">
                <Timer className="h-3.5 w-3.5" /> Avg Response:{' '}
                <span className="font-semibold text-slate-300">1.2s</span>
              </span>
              <span className="flex items-center gap-1.5">
                <Database className="h-3.5 w-3.5" /> Memory:{' '}
                <span className="font-semibold text-slate-300">2.4GB / 8GB</span>
              </span>
            </div>
            <span className="hidden items-center gap-1 text-emerald-400 md:flex">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" /> All systems
              nominal
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function LayoutDashboard(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <rect width="7" height="9" x="3" y="3" rx="1" />
      <rect width="7" height="5" x="14" y="3" rx="1" />
      <rect width="7" height="9" x="14" y="12" rx="1" />
      <rect width="7" height="5" x="3" y="16" rx="1" />
    </svg>
  );
}
function Trophy(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5C7 4 6 2 6 2" />
      <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5C17 4 18 2 18 2" />
      <path d="M6 2h12" />
      <path d="M6 6h12" />
      <path d="M12 12v8" />
      <path d="M8 20h8" />
    </svg>
  );
}

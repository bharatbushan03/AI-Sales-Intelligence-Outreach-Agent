'use client';

import { useState, useEffect } from 'react';
import {
  Activity, ArrowUpRight, Banknote, Bot, Clock, MessageCircle, Shield, TrendingUp, Users,
  Zap, Target, Brain, Database, FileText, BarChart3, DollarSign, CheckCircle2,
  AlertTriangle, Gauge, Radio, PieChart, LineChart, Layers, Orbit, Globe,
  Sparkles, Workflow, Cpu, UserCheck, Timer, AlertCircle
} from 'lucide-react';

interface Metric { label: string; value: string; change: string; positive: boolean; icon: React.ReactNode; }
interface PipelineStage { name: string; count: number; value: string; color: string; }
interface AgentMetric { name: string; status: string; tasks: number; score: number; color: string; }

const METRICS: Metric[] = [
  { label: 'Pipeline Value', value: '$4.2M', change: '+18.5%', positive: true, icon: <Banknote className="w-5 h-5" /> },
  { label: 'Active Opportunities', value: '156', change: '+12 this week', positive: true, icon: <Target className="w-5 h-5" /> },
  { label: 'Conversion Rate', value: '32.4%', change: '+4.2%', positive: true, icon: <TrendingUp className="w-5 h-5" /> },
  { label: 'Avg Deal Size', value: '$87K', change: '+$12K', positive: true, icon: <DollarSign className="w-5 h-5" /> },
  { label: 'AI Agents Active', value: '8', change: '100% uptime', positive: true, icon: <Bot className="w-5 h-5" /> },
  { label: 'Proposals Pending', value: '24', change: '8 this week', positive: true, icon: <FileText className="w-5 h-5" /> },
  { label: 'Outreach Sent', value: '1,847', change: '+23% rate', positive: true, icon: <MessageCircle className="w-5 h-5" /> },
  { label: 'Forecast Revenue', value: '$6.8M', change: '+$1.2M', positive: true, icon: <BarChart3 className="w-5 h-5" /> },
];

const PIPELINE: PipelineStage[] = [
  { name: 'Discovery', count: 48, value: '$1.8M', color: 'from-sky-500 to-blue-600' },
  { name: 'Qualification', count: 36, value: '$1.2M', color: 'from-blue-500 to-indigo-600' },
  { name: 'Proposal', count: 28, value: '$980K', color: 'from-indigo-500 to-purple-600' },
  { name: 'Negotiation', count: 18, value: '$650K', color: 'from-purple-500 to-pink-600' },
  { name: 'Closing', count: 12, value: '$420K', color: 'from-emerald-500 to-teal-600' },
];

const AGENTS: AgentMetric[] = [
  { name: 'Manager Agent', status: 'active', tasks: 156, score: 98, color: 'from-violet-500 to-purple-600' },
  { name: 'Research Agent', status: 'active', tasks: 234, score: 96, color: 'from-blue-500 to-indigo-600' },
  { name: 'Opportunity Agent', status: 'active', tasks: 189, score: 94, color: 'from-amber-500 to-orange-600' },
  { name: 'Outreach Agent', status: 'active', tasks: 312, score: 92, color: 'from-emerald-500 to-teal-600' },
  { name: 'CRM Agent', status: 'active', tasks: 178, score: 97, color: 'from-cyan-500 to-blue-600' },
  { name: 'Proposal Agent', status: 'active', tasks: 145, score: 95, color: 'from-rose-500 to-pink-600' },
];

const RECENT_WINS = [
  { company: 'TechCorp Inc.', value: '$240K', agent: 'Research + Outreach', time: '2h ago' },
  { company: 'DataFlow Systems', value: '$180K', agent: 'Opportunity + Proposal', time: '5h ago' },
  { company: 'CloudNine SaaS', value: '$320K', agent: 'Full Pipeline', time: '1d ago' },
  { company: 'Vertex Analytics', value: '$95K', agent: 'CRM + Outreach', time: '2d ago' },
];

function Sparkline({ data, color }: { data: number[]; color: string }) {
  const h = 40; const w = 120;
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

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (!mounted) return;
    METRICS.forEach((_, i) => {
      setTimeout(() => {
        setAnimatedValues(prev => { const n = [...prev]; n[i] = 100; return n; });
      }, i * 150);
    });
  }, [mounted]);

  const totalPipeline = PIPELINE.reduce((s, p) => s + parseInt(p.value.replace(/[$,K]/g, '')) * (p.value.includes('M') ? 1000 : 1), 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950/20 p-4 md:p-6">
      <div className="mx-auto max-w-7xl space-y-6">

        {/* === HEADER === */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                <LayoutDashboard className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-slate-100">Executive Command Center</h1>
                <p className="text-sm text-slate-500">Real-time B2B sales intelligence platform overview</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-slate-900/80 rounded-xl p-1 border border-slate-800">
            {(['24h', '7d', '30d'] as const).map(r => (
              <button key={r} onClick={() => setTimeRange(r)}
                className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-all ${timeRange === r ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'}`}>
                {r}
              </button>
            ))}
          </div>
        </div>

        {/* === STATUS BANNER === */}
        <div className="bg-gradient-to-r from-emerald-900/30 via-emerald-800/20 to-emerald-900/30 rounded-xl p-4 border border-emerald-700/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <CheckCircle2 className="w-6 h-6 text-emerald-400" />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-emerald-400 rounded-full animate-ping" />
            </div>
            <div>
              <p className="text-sm font-semibold text-emerald-300">All Systems Operational</p>
              <p className="text-xs text-emerald-400/70">6 agents active · 1,847 outreach sent today · $4.2M pipeline</p>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-3 text-xs text-slate-500">
            <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Live</span>
            <span className="flex items-center gap-1"><Cpu className="w-3 h-3" /> 42% capacity</span>
          </div>
        </div>

        {/* === METRICS GRID === */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {METRICS.map((metric, i) => (
            <div key={metric.label} className="group relative bg-slate-900/60 backdrop-blur-sm rounded-xl p-4 border border-slate-800 hover:border-slate-700 transition-all overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-white/[0.02] to-transparent rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="flex items-start justify-between mb-3">
                <div className="p-2 rounded-lg bg-slate-800/50 text-indigo-400">{metric.icon}</div>
                <Sparkline data={[30, 45, 38, 52, 48, 65, 55, 72, 68, 85, 78, 95]} color="#818cf8" />
              </div>
              <p className="text-xs text-slate-500 mb-1">{metric.label}</p>
              <div className="flex items-baseline gap-2">
                <span className={`text-xl font-bold text-slate-100 transition-all duration-1000 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}
                  style={{ transitionDelay: `${i * 100}ms` }}>
                  {metric.value}
                </span>
                <span className={`text-xs font-semibold ${metric.positive ? 'text-emerald-400' : 'text-red-400'}`}>
                  {metric.change}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* === PIPELINE & CHARTS === */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Pipeline View */}
          <div className="lg:col-span-2 bg-slate-900/60 backdrop-blur-sm rounded-xl p-5 border border-slate-800">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
                <Layers className="w-4 h-4 text-indigo-400" /> Sales Pipeline
              </h2>
              <span className="text-xs text-slate-500">Total: ${totalPipeline.toLocaleString()}K</span>
            </div>
            <div className="space-y-3">
              {PIPELINE.map((stage, i) => (
                <div key={stage.name} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-gradient-to-br" style={{ background: stage.color === 'from-sky-500 to-blue-600' ? 'linear-gradient(135deg, #0ea5e9, #2563eb)' : '' }} />
                      <span className="text-slate-300 font-medium">{stage.name}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-slate-400">{stage.count} deals</span>
                      <span className="text-slate-200 font-semibold w-16 text-right">{stage.value}</span>
                    </div>
                  </div>
                  <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
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
          <div className="bg-slate-900/60 backdrop-blur-sm rounded-xl p-5 border border-slate-800">
            <h2 className="text-sm font-semibold text-slate-200 flex items-center gap-2 mb-4">
              <DollarSign className="w-4 h-4 text-amber-400" /> Revenue Forecast
            </h2>
            <div className="space-y-4">
              {[
                { label: 'Conservative', value: '$4.2M', pct: 65, color: 'from-slate-500 to-slate-400' },
                { label: 'Expected', value: '$6.8M', pct: 85, color: 'from-indigo-500 to-purple-600' },
                { label: 'Best Case', value: '$9.5M', pct: 100, color: 'from-emerald-500 to-teal-600' },
              ].map(f => (
                <div key={f.label} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400">{f.label}</span>
                    <span className="text-slate-200 font-bold">{f.value}</span>
                  </div>
                  <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full bg-gradient-to-r ${f.color} transition-all duration-1000`} style={{ width: `${f.pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-5 pt-4 border-t border-slate-800">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>Confidence Interval</span>
                <span className="text-emerald-400">85%</span>
              </div>
            </div>
          </div>
        </div>

        {/* === AGENT PERFORMANCE === */}
        <div className="bg-slate-900/60 backdrop-blur-sm rounded-xl p-5 border border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
              <Bot className="w-4 h-4 text-emerald-400" /> AI Agent Performance
            </h2>
            <span className="text-xs text-emerald-400 font-semibold">All agents operational</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {AGENTS.map(agent => (
              <div key={agent.name} className="bg-slate-800/40 rounded-xl p-4 border border-slate-700/50 hover:border-slate-600/50 transition-all">
                <div className="flex items-center gap-2 mb-3">
                  <div className={`w-2 h-2 rounded-full ${agent.status === 'active' ? 'bg-emerald-500' : 'bg-slate-600'}`} />
                  <span className="text-xs font-medium text-slate-300 truncate">{agent.name}</span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-[10px] text-slate-500">
                    <span>Tasks</span>
                    <span className="font-mono text-slate-300">{agent.tasks}</span>
                  </div>
                  <div className="flex justify-between text-[10px] text-slate-500 items-center">
                    <span>Score</span>
                    <span className="font-bold text-emerald-400">{agent.score}%</span>
                  </div>
                  <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full bg-gradient-to-r ${agent.color} transition-all duration-1000`} style={{ width: `${agent.score}%` }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* === BOTTOM ROW: Recent Wins + Activity === */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Recent Wins */}
          <div className="bg-slate-900/60 backdrop-blur-sm rounded-xl p-5 border border-slate-800">
            <h2 className="text-sm font-semibold text-slate-200 flex items-center gap-2 mb-4">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Recent Wins
            </h2>
            <div className="space-y-3">
              {RECENT_WINS.map((win, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-slate-800/30 rounded-lg border border-slate-700/30 hover:border-slate-600/30 transition-all">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500/20 to-teal-500/20 flex items-center justify-center">
                      <Trophy className="w-4 h-4 text-emerald-400" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-200">{win.company}</p>
                      <p className="text-[10px] text-slate-500">{win.agent} · {win.time}</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-emerald-400">{win.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Activity Feed */}
          <div className="bg-slate-900/60 backdrop-blur-sm rounded-xl p-5 border border-slate-800">
            <h2 className="text-sm font-semibold text-slate-200 flex items-center gap-2 mb-4">
              <Activity className="w-4 h-4 text-indigo-400" /> Live Activity
            </h2>
            <div className="space-y-2.5">
              {[
                { agent: 'Research Agent', action: 'Completed analysis of TechCorp', time: '2 min ago' },
                { agent: 'Proposal Agent', action: 'Generated proposal for DataFlow', time: '5 min ago' },
                { agent: 'CRM Agent', action: 'Synced 12 leads to Salesforce', time: '8 min ago' },
                { agent: 'Outreach Agent', action: 'Sent 45 personalized emails', time: '12 min ago' },
                { agent: 'Opportunity Agent', action: 'Identified 3 new opportunities', time: '15 min ago' },
              ].map((act, i) => (
                <div key={i} className="flex items-start gap-3 p-2.5 rounded-lg hover:bg-slate-800/30 transition-all">
                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-slate-300"><span className="font-semibold text-indigo-400">{act.agent}</span> {act.action}</p>
                  </div>
                  <span className="text-[10px] text-slate-600 shrink-0">{act.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* === SYSTEM HEALTH === */}
        <div className="bg-slate-900/40 backdrop-blur-sm rounded-xl p-4 border border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5"><Gauge className="w-3.5 h-3.5" /> System Health: <span className="text-emerald-400 font-semibold">98.7%</span></span>
              <span className="flex items-center gap-1.5"><Timer className="w-3.5 h-3.5" /> Avg Response: <span className="text-slate-300 font-semibold">1.2s</span></span>
              <span className="flex items-center gap-1.5"><Database className="w-3.5 h-3.5" /> Memory: <span className="text-slate-300 font-semibold">2.4GB / 8GB</span></span>
            </div>
            <span className="hidden md:flex items-center gap-1 text-emerald-400"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> All systems nominal</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function LayoutDashboard(props: React.SVGProps<SVGSVGElement>) {
  return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect width="7" height="9" x="3" y="3" rx="1" /><rect width="7" height="5" x="14" y="3" rx="1" /><rect width="7" height="9" x="14" y="12" rx="1" /><rect width="7" height="5" x="3" y="16" rx="1" />
  </svg>;
}
function Trophy(props: React.SVGProps<SVGSVGElement>) {
  return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5C7 4 6 2 6 2" /><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5C17 4 18 2 18 2" /><path d="M6 2h12" /><path d="M6 6h12" /><path d="M12 12v8" /><path d="M8 20h8" />
  </svg>;
}

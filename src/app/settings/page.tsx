'use client';

import React, { useState } from 'react';
import {
  History,
  Clock,
  GitBranch,
  RotateCcw,
  Brain,
  Target,
  TrendingUp,
  Activity,
  Search,
  ChevronRight,
  Building,
  CheckCircle2,
  XCircle,
  Loader2,
  Sparkles,
  BarChart3,
  Users,
  MessageSquare,
  ArrowUpRight,
  Eye,
  X,
} from 'lucide-react';

interface AgentRun {
  agent: string;
  duration: string;
  status: 'success' | 'failed';
  insights: string[];
}

interface TimelineRun {
  id: string;
  company: string;
  date: string;
  duration: string;
  status: 'success' | 'failed' | 'running';
  opportunityScore: number;
  previousScore?: number;
  agents: AgentRun[];
  insights: string[];
  outreachMessage?: string;
  previousOutreach?: string;
}

const timelineData: TimelineRun[] = [
  {
    id: 'wf-001',
    company: 'TechCorp',
    date: '2026-06-25',
    duration: '12m 34s',
    status: 'success',
    opportunityScore: 87,
    previousScore: 72,
    agents: [
      { agent: 'Research', duration: '4m 12s', status: 'success', insights: ['Identified 3 key decision makers', 'Mapped org structure'] },
      { agent: 'Opportunity', duration: '3m 08s', status: 'success', insights: ['Scored 87/100 overall fit', 'High intent signal detected'] },
      { agent: 'Outreach', duration: '5m 14s', status: 'success', insights: ['Generated 4 email variants', 'A/B test ready'] },
    ],
    insights: ['Strong product-market fit', 'Budget allocated for Q3', 'Competitor弱点 identified'],
    outreachMessage: 'Personalized cold outreach with case studies referencing their stack',
  },
  {
    id: 'wf-002',
    company: 'TechCorp',
    date: '2026-06-18',
    duration: '15m 22s',
    status: 'success',
    opportunityScore: 72,
    previousScore: 58,
    agents: [
      { agent: 'Research', duration: '5m 01s', status: 'success', insights: ['Basic company profile', 'Industry overview'] },
      { agent: 'Opportunity', duration: '4m 30s', status: 'success', insights: ['Scored 72/100', 'Moderate fit'] },
      { agent: 'Outreach', duration: '5m 51s', status: 'success', insights: ['2 email drafts created'] },
    ],
    insights: ['Mid-size account with growth potential', 'No direct competitor engagement yet'],
    outreachMessage: 'Generic outreach highlighting platform benefits',
  },
  {
    id: 'wf-003',
    company: 'TechCorp',
    date: '2026-06-10',
    duration: '18m 45s',
    status: 'success',
    opportunityScore: 58,
    agents: [
      { agent: 'Research', duration: '6m 20s', status: 'success', insights: ['Domain verified', 'Tech stack detected'] },
      { agent: 'Opportunity', duration: '7m 10s', status: 'success', insights: ['Scored 58/100', 'Early stage exploration'] },
      { agent: 'Outreach', duration: '5m 15s', status: 'success', insights: ['1 draft generated'] },
    ],
    insights: ['Initial contact established', 'Exploring use cases'],
    outreachMessage: 'Standard introduction email',
  },
  {
    id: 'wf-004',
    company: 'Salesforce',
    date: '2026-06-24',
    duration: '8m 12s',
    status: 'success',
    opportunityScore: 94,
    previousScore: 85,
    agents: [
      { agent: 'Research', duration: '2m 45s', status: 'success', insights: ['Comprehensive profile already exists', 'Updated recent news'] },
      { agent: 'Opportunity', duration: '2m 50s', status: 'success', insights: ['Scored 94/100', 'Renewal opportunity window'] },
      { agent: 'Outreach', duration: '2m 37s', status: 'success', insights: ['5 personalized variants', 'Timing optimized'] },
    ],
    insights: ['Existing customer - expansion opportunity', 'New department budget approved'],
    outreachMessage: 'Executive summary with ROI calculator personalized by department',
  },
  {
    id: 'wf-005',
    company: 'Salesforce',
    date: '2026-06-15',
    duration: '10m 30s',
    status: 'success',
    opportunityScore: 85,
    agents: [
      { agent: 'Research', duration: '3m 20s', status: 'success', insights: ['Updated org changes', 'New leadership identified'] },
      { agent: 'Opportunity', duration: '3m 45s', status: 'success', insights: ['Scored 85/100', 'Expansion signals strong'] },
      { agent: 'Outreach', duration: '3m 25s', status: 'success', insights: ['3 variants generated'] },
    ],
    insights: ['Usage metrics show 40% underutilization', 'Upsell opportunity in adjacent product'],
    outreachMessage: 'Product expansion pitch focused on underutilized features',
  },
  {
    id: 'wf-006',
    company: 'HubSpot',
    date: '2026-06-22',
    duration: '5m 18s',
    status: 'failed',
    opportunityScore: 0,
    agents: [
      { agent: 'Research', duration: '2m 10s', status: 'success', insights: ['Basic info retrieved'] },
      { agent: 'Opportunity', duration: '3m 08s', status: 'failed', insights: ['API rate limit exceeded'] },
    ],
    insights: ['Partial data collected - retry recommended'],
  },
  {
    id: 'wf-007',
    company: 'Stripe',
    date: '2026-06-20',
    duration: '22m 14s',
    status: 'running',
    opportunityScore: 0,
    agents: [
      { agent: 'Research', duration: '8m 30s', status: 'success', insights: ['Deep research completed', 'Competitor landscape mapped'] },
      { agent: 'Opportunity', duration: '13m 44s', status: 'success', insights: ['Scoring in progress...'] },
    ],
    insights: ['Complex enterprise evaluation underway'],
  },
];

const groupedByMonth: Record<string, TimelineRun[]> = {};

timelineData.forEach((run) => {
  const monthKey = run.date.slice(0, 7);
  if (!groupedByMonth[monthKey]) groupedByMonth[monthKey] = [];
  groupedByMonth[monthKey].push(run);
});

const monthLabels: Record<string, string> = {
  '2026-06': 'June 2026',
  '2026-05': 'May 2026',
  '2026-04': 'April 2026',
  '2026-03': 'March 2026',
};

function InsightBadge({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-md border border-slate-700/60 bg-slate-800/40 px-2 py-0.5 text-[10px] font-medium text-slate-300">
      <Sparkles className="h-2.5 w-2.5 text-indigo-400" />
      {label}
    </span>
  );
}

function ScoreDiff({ current, previous }: { current: number; previous?: number }) {
  if (!previous) return null;
  const diff = current - previous;
  const improved = diff > 0;
  return (
    <span
      className={`inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-[10px] font-bold ${
        improved
          ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800/50'
          : 'bg-rose-950/60 text-rose-400 border border-rose-800/50'
      }`}
    >
      <TrendingUp className={`h-3 w-3 ${improved ? '' : 'rotate-180'}`} />
      {improved ? '+' : ''}
      {diff}
    </span>
  );
}

const monthKeys = Object.keys(groupedByMonth).sort().reverse();

export default function MemoryTimeMachinePage() {
  const [selectedRun, setSelectedRun] = useState<TimelineRun | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredMonths = monthKeys
    .map((month) => ({
      month,
      runs: groupedByMonth[month].filter(
        (r) =>
          r.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
          r.insights.some((i) => i.toLowerCase().includes(searchQuery.toLowerCase())),
      ),
    }))
    .filter((m) => m.runs.length > 0);

  return (
    <div className="space-y-8 pb-16 text-slate-100">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 border-b border-slate-800 pb-5 md:flex-row md:items-center">
        <div>
          <h1 className="flex items-center gap-3 text-3xl font-bold tracking-tight text-white md:text-4xl">
            <History className="h-9 w-9 text-indigo-500" />
            Memory Time Machine
          </h1>
          <p className="mt-2 text-sm text-slate-400">
            Trace workflow history, compare knowledge evolution, and watch opportunity scores improve
            over time.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Search companies or insights..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-56 rounded-xl border border-slate-800 bg-slate-950 py-2 pl-9 pr-3 text-sm text-slate-200 placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
            />
          </div>
          <button className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800 px-4 py-2.5 text-sm font-semibold text-slate-200 transition-all duration-200 hover:bg-slate-700">
            <RotateCcw className="h-4 w-4" />
            Refresh
          </button>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="flex items-center justify-between rounded-2xl border border-slate-800/80 bg-slate-900/40 p-6">
          <div className="space-y-1.5">
            <span className="text-xs font-semibold tracking-wider text-slate-500 uppercase">
              Total Runs
            </span>
            <div className="text-2xl font-bold text-white">{timelineData.length}</div>
          </div>
          <Activity className="h-8 w-8 text-indigo-500 opacity-60" />
        </div>
        <div className="flex items-center justify-between rounded-2xl border border-slate-800/80 bg-slate-900/40 p-6">
          <div className="space-y-1.5">
            <span className="text-xs font-semibold tracking-wider text-slate-500 uppercase">
              Companies
            </span>
            <div className="text-2xl font-bold text-white">
              {new Set(timelineData.map((r) => r.company)).size}
            </div>
          </div>
          <Building className="h-8 w-8 text-emerald-500 opacity-60" />
        </div>
        <div className="flex items-center justify-between rounded-2xl border border-slate-800/80 bg-slate-900/40 p-6">
          <div className="space-y-1.5">
            <span className="text-xs font-semibold tracking-wider text-slate-500 uppercase">
              Avg Score
            </span>
            <div className="text-2xl font-bold text-white">
              {Math.round(
                timelineData
                  .filter((r) => r.opportunityScore > 0)
                  .reduce((acc, r) => acc + r.opportunityScore, 0) /
                  Math.max(timelineData.filter((r) => r.opportunityScore > 0).length, 1),
              )}
            </div>
          </div>
          <Target className="h-8 w-8 text-cyan-500 opacity-60" />
        </div>
        <div className="flex items-center justify-between rounded-2xl border border-slate-800/80 bg-slate-900/40 p-6">
          <div className="space-y-1.5">
            <span className="text-xs font-semibold tracking-wider text-slate-500 uppercase">
              Knowledge Gained
            </span>
            <div className="text-2xl font-bold text-white">
              {timelineData.reduce((acc, r) => acc + r.insights.length, 0)}
            </div>
          </div>
          <Brain className="h-8 w-8 text-violet-500 opacity-60" />
        </div>
      </div>

      {/* Main Timeline */}
      <div className="relative">
        {/* Vertical Timeline Line */}
        <div className="absolute left-[19px] top-0 bottom-0 w-0.5 bg-gradient-to-b from-indigo-500/60 via-slate-700/40 to-slate-800/20" />

        <div className="space-y-10">
          {filteredMonths.map(({ month, runs }) => (
            <div key={month}>
              {/* Month Marker */}
              <div className="sticky top-0 z-10 mb-6 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full border border-indigo-500/30 bg-indigo-950/80 shadow-lg shadow-indigo-900/20">
                  <Clock className="h-5 w-5 text-indigo-400" />
                </div>
                <h2 className="text-lg font-bold tracking-wide text-white">
                  {monthLabels[month] || month}
                </h2>
                <span className="rounded-full border border-slate-700 bg-slate-800/60 px-2.5 py-0.5 text-[10px] font-semibold text-slate-400">
                  {runs.length} run{runs.length > 1 ? 's' : ''}
                </span>
              </div>

              {/* Runs for this month */}
              <div className="ml-14 space-y-5">
                {runs.map((run) => (
                  <button
                    key={run.id}
                    onClick={() => setSelectedRun(run)}
                    className={`group relative w-full rounded-2xl border p-5 text-left transition-all duration-200 ${
                      selectedRun?.id === run.id
                        ? 'border-indigo-500/70 bg-indigo-950/20 shadow-lg shadow-indigo-900/10'
                        : 'border-slate-800/70 bg-slate-900/30 hover:border-slate-700 hover:bg-slate-900/50'
                    }`}
                  >
                    {/* Timeline dot connector */}
                    <div className="absolute -left-[3.15rem] top-7 h-3.5 w-3.5 rounded-full border-2 border-slate-700 bg-slate-900 transition-colors group-hover:border-indigo-500" />

                    {/* Run Header */}
                    <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                      <div className="flex items-center gap-3">
                        <Building className="h-5 w-5 text-indigo-400" />
                        <span className="text-lg font-bold text-white">{run.company}</span>
                        <ScoreDiff current={run.opportunityScore} previous={run.previousScore} />
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1.5 text-xs text-slate-500">
                          <Clock className="h-3.5 w-3.5" />
                          {run.duration}
                        </span>
                        {run.status === 'success' && (
                          <span className="inline-flex items-center gap-1 rounded-full border border-emerald-800/50 bg-emerald-950/60 px-2.5 py-0.5 text-[10px] font-bold text-emerald-400">
                            <CheckCircle2 className="h-3 w-3" />
                            Success
                          </span>
                        )}
                        {run.status === 'failed' && (
                          <span className="inline-flex items-center gap-1 rounded-full border border-rose-800/50 bg-rose-950/60 px-2.5 py-0.5 text-[10px] font-bold text-rose-400">
                            <XCircle className="h-3 w-3" />
                            Failed
                          </span>
                        )}
                        {run.status === 'running' && (
                          <span className="inline-flex items-center gap-1 rounded-full border border-amber-800/50 bg-amber-950/60 px-2.5 py-0.5 text-[10px] font-bold text-amber-400">
                            <Loader2 className="h-3 w-3 animate-spin" />
                            Running
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Date */}
                    <div className="mt-2 text-xs text-slate-500">
                      {new Date(run.date).toLocaleDateString('en-US', {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </div>

                    {/* Opportunity Score Bar */}
                    {run.opportunityScore > 0 && (
                      <div className="mt-4 space-y-1.5">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="font-semibold text-slate-400">Opportunity Score</span>
                          <span className="font-bold text-white">{run.opportunityScore}/100</span>
                        </div>
                        <div className="h-2 w-full overflow-hidden rounded-full bg-slate-800">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-indigo-600 to-indigo-400 transition-all duration-700"
                            style={{ width: `${run.opportunityScore}%` }}
                          />
                        </div>
                      </div>
                    )}

                    {/* Agents Involved */}
                    <div className="mt-4 flex flex-wrap items-center gap-2">
                      <GitBranch className="h-3.5 w-3.5 text-slate-500" />
                      {run.agents.map((a) => (
                        <span
                          key={a.agent}
                          className={`inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-[10px] font-medium ${
                            a.status === 'success'
                              ? 'border-emerald-800/30 bg-emerald-950/30 text-emerald-400'
                              : 'border-rose-800/30 bg-rose-950/30 text-rose-400'
                          }`}
                        >
                          {a.agent}
                        </span>
                      ))}
                    </div>

                    {/* Insights */}
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {run.insights.map((insight, idx) => (
                        <InsightBadge key={idx} label={insight} />
                      ))}
                    </div>

                    {/* Comparison indicator */}
                    {run.previousScore && (
                      <div className="mt-3 flex items-center gap-2 rounded-lg border border-indigo-900/30 bg-indigo-950/20 px-3 py-2">
                        <BarChart3 className="h-4 w-4 text-indigo-400" />
                        <span className="text-[11px] text-slate-300">
                          <strong className="text-indigo-300">+{run.opportunityScore - run.previousScore}pt score increase</strong>{' '}
                          from previous run — outreach strategy improved
                        </span>
                      </div>
                    )}

                    {/* Expand hint */}
                    <div className="mt-3 flex items-center gap-1 text-[10px] text-slate-600 transition-colors group-hover:text-slate-400">
                      Click to view details <ChevronRight className="h-3 w-3" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Detail Drawer */}
      {selectedRun && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={() => setSelectedRun(null)}
          />
          <aside className="relative z-50 flex h-full w-full max-w-xl flex-col border-l border-slate-800 bg-slate-900 shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-800 bg-slate-950 p-5">
              <div className="flex items-center gap-3">
                <Building className="h-5 w-5 text-indigo-400" />
                <div>
                  <h3 className="text-md font-bold text-white">{selectedRun.company}</h3>
                  <p className="text-xs text-slate-400">
                    {new Date(selectedRun.date).toLocaleDateString('en-US', {
                      weekday: 'short',
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedRun(null)}
                className="rounded-lg border border-slate-800 p-1.5 text-slate-400 transition-colors hover:bg-slate-800 hover:text-slate-200"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Status & Duration */}
              <div className="flex items-center gap-4">
                {selectedRun.status === 'success' && (
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-800/50 bg-emerald-950/60 px-3 py-1 text-xs font-bold text-emerald-400">
                    <CheckCircle2 className="h-3.5 w-3.5" /> Success
                  </span>
                )}
                {selectedRun.status === 'failed' && (
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-rose-800/50 bg-rose-950/60 px-3 py-1 text-xs font-bold text-rose-400">
                    <XCircle className="h-3.5 w-3.5" /> Failed
                  </span>
                )}
                {selectedRun.status === 'running' && (
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-800/50 bg-amber-950/60 px-3 py-1 text-xs font-bold text-amber-400">
                    <Loader2 className="h-3.5 w-3.5 animate-spin" /> Running
                  </span>
                )}
                <span className="flex items-center gap-1.5 text-xs text-slate-400">
                  <Clock className="h-3.5 w-3.5" /> {selectedRun.duration}
                </span>
                <span className="flex items-center gap-1.5 text-xs text-slate-400">
                  <GitBranch className="h-3.5 w-3.5" /> {selectedRun.agents.length} agents
                </span>
              </div>

              {/* Score Card */}
              {selectedRun.opportunityScore > 0 && (
                <div className="rounded-2xl border border-slate-800 bg-slate-950/50 p-5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Target className="h-5 w-5 text-indigo-400" />
                      <span className="text-sm font-semibold text-slate-200">
                        Opportunity Score
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      {selectedRun.previousScore && (
                        <span className="text-sm text-slate-500 line-through">
                          {selectedRun.previousScore}
                        </span>
                      )}
                      <span className="text-2xl font-bold text-white">
                        {selectedRun.opportunityScore}
                      </span>
                      <span className="text-sm text-slate-400">/100</span>
                    </div>
                  </div>
                  <div className="mt-3 h-2.5 w-full overflow-hidden rounded-full bg-slate-800">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-indigo-600 to-indigo-400"
                      style={{ width: `${selectedRun.opportunityScore}%` }}
                    />
                  </div>
                  {selectedRun.previousScore && (
                    <div className="mt-3 flex items-center gap-2 text-xs text-emerald-400">
                      <TrendingUp className="h-4 w-4" />
                      <span>
                        Improved by{' '}
                        <strong>{selectedRun.opportunityScore - selectedRun.previousScore} points</strong>{' '}
                        from previous run
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* Agent Steps */}
              <div>
                <h4 className="mb-3 flex items-center gap-2 text-sm font-bold text-white">
                  <Users className="h-4 w-4 text-indigo-400" /> Agent Execution Steps
                </h4>
                <div className="space-y-3">
                  {selectedRun.agents.map((agent, idx) => (
                    <div
                      key={agent.agent}
                      className="relative flex items-start gap-3 rounded-xl border border-slate-800/60 bg-slate-950/30 p-4"
                    >
                      <div
                        className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-[10px] font-bold ${
                          agent.status === 'success'
                            ? 'border-emerald-800/50 bg-emerald-950/50 text-emerald-400'
                            : 'border-rose-800/50 bg-rose-950/50 text-rose-400'
                        }`}
                      >
                        {idx + 1}
                      </div>
                      <div className="flex-1 space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-semibold text-slate-200">
                            {agent.agent} Agent
                          </span>
                          <span className="flex items-center gap-1 text-[10px] text-slate-500">
                            <Clock className="h-3 w-3" /> {agent.duration}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {agent.insights.map((insight, i) => (
                            <InsightBadge key={i} label={insight} />
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Insights */}
              <div>
                <h4 className="mb-3 flex items-center gap-2 text-sm font-bold text-white">
                  <Brain className="h-4 w-4 text-indigo-400" /> Insights Generated
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {selectedRun.insights.map((insight, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700/50 bg-slate-800/30 px-3 py-1.5 text-xs text-slate-300"
                    >
                      <Sparkles className="h-3 w-3 text-indigo-400" />
                      {insight}
                    </span>
                  ))}
                </div>
              </div>

              {/* Outreach Evolution */}
              {selectedRun.outreachMessage && (
                <div>
                  <h4 className="mb-3 flex items-center gap-2 text-sm font-bold text-white">
                    <MessageSquare className="h-4 w-4 text-indigo-400" /> Outreach Strategy
                  </h4>
                  <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-4">
                    <div className="text-xs text-slate-300 leading-relaxed">
                      {selectedRun.outreachMessage}
                    </div>
                    {selectedRun.previousOutreach && (
                      <div className="mt-3 border-t border-slate-800 pt-3">
                        <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide">
                          Previous Strategy
                        </span>
                        <p className="mt-1 text-xs text-slate-500 line-through">
                          {selectedRun.previousOutreach}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Knowledge Evolution Summary */}
              {selectedRun.previousScore && (
                <div className="rounded-2xl border border-indigo-900/30 bg-indigo-950/15 p-5">
                  <h4 className="mb-2 flex items-center gap-2 text-sm font-bold text-indigo-300">
                    <ArrowUpRight className="h-4 w-4" /> Knowledge Evolution
                  </h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Compared to the previous run, the system gained{' '}
                    <strong className="text-indigo-300">
                      {selectedRun.insights.length} new insights
                    </strong>{' '}
                    about {selectedRun.company}. The opportunity score improved by{' '}
                    <strong className="text-emerald-400">
                      {selectedRun.opportunityScore - (selectedRun.previousScore || 0)} points
                    </strong>
                    , reflecting deeper research and more targeted outreach.
                  </p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between border-t border-slate-800 bg-slate-950/50 p-4">
              <span className="text-[10px] text-slate-500">Run ID: {selectedRun.id}</span>
              <button
                onClick={() => setSelectedRun(null)}
                className="rounded-xl border border-slate-700 bg-slate-800 px-4 py-2 text-xs font-semibold text-slate-200 transition-colors hover:bg-slate-700"
              >
                Close
              </button>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}

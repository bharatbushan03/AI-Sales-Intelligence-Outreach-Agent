'use client';

import React, { useState, useEffect } from 'react';
import {
  Lightbulb,
  Search,
  Bot,
  History,
  RefreshCw,
  AlertCircle,
  FileDown,
  TrendingUp,
  Users,
  ShieldAlert,
  Award,
  Zap,
  Target,
  FileText,
  HelpCircle,
} from 'lucide-react';
import { OpportunityReport } from '@/agents/specialists/opportunity/types';

type ActiveTabName = 'summary' | 'pains' | 'signals' | 'triggers' | 'recommendations';

export default function OpportunitiesPage() {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [progressStep, setProgressStep] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const [report, setReport] = useState<OpportunityReport | null>(null);
  const [history, setHistory] = useState<OpportunityReport[]>([]);
  const [activeTab, setActiveTab] = useState<ActiveTabName>('summary');

  const fetchHistoryData = async () => {
    try {
      const res = await fetch('/api/opportunities');
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        return data.data;
      }
    } catch (err) {
      console.error('Failed to load opportunity history', err);
    }
    return [];
  };

  // Load history on mount
  useEffect(() => {
    let active = true;
    fetchHistoryData().then((data) => {
      if (active) {
        setHistory(data);
      }
    });
    return () => {
      active = false;
    };
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError(null);
    setReport(null);
    setProgressStep(1);

    // Simulate pipeline stage loading changes
    const timer1 = setTimeout(() => setProgressStep(2), 1500);
    const timer2 = setTimeout(() => setProgressStep(3), 3000);
    const timer3 = setTimeout(() => setProgressStep(4), 4500);
    const timer4 = setTimeout(() => setProgressStep(5), 6000);
    const timer5 = setTimeout(() => setProgressStep(6), 7500);

    try {
      const res = await fetch('/api/opportunities', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: query.trim() }),
      });

      const data = await res.json();

      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
      clearTimeout(timer5);

      if (!res.ok || !data.success) {
        throw new Error(data.error?.message || 'Failed to complete opportunity analysis.');
      }

      setReport(data.data);
      setQuery('');
      // Reload history list
      fetchHistoryData().then(setHistory);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'An unexpected server error occurred.';
      setError(errorMsg);
    } finally {
      setLoading(false);
      setProgressStep(0);
    }
  };

  const loadReport = (selected: OpportunityReport) => {
    setReport(selected);
    setError(null);
    setActiveTab('summary');
  };

  const getScoreBadgeColor = (score: number) => {
    if (score >= 85) return 'text-emerald-400 bg-emerald-950/40 border-emerald-900/50';
    if (score >= 70) return 'text-amber-400 bg-amber-950/40 border-amber-900/50';
    return 'text-rose-400 bg-rose-950/40 border-rose-900/50';
  };

  const getImpactBadgeColor = (impact: string) => {
    switch (impact.toLowerCase()) {
      case 'high':
        return 'bg-rose-950/40 text-rose-400 border-rose-900/50';
      case 'medium':
        return 'bg-amber-950/40 text-amber-400 border-amber-900/50';
      default:
        return 'bg-slate-900/80 text-slate-400 border-slate-800';
    }
  };

  const getLevelColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'critical':
        return 'bg-red-950/40 text-red-400 border-red-900/50';
      case 'high':
        return 'bg-orange-950/40 text-orange-400 border-orange-900/50';
      case 'medium':
        return 'bg-amber-950/40 text-amber-400 border-amber-900/50';
      default:
        return 'bg-slate-900/80 text-slate-400 border-slate-800';
    }
  };

  return (
    <div className="space-y-8 text-slate-100 print:bg-white print:text-black">
      {/* Header Panel */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5 print:hidden">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white md:text-4xl">Revenue Opportunity Workspace</h1>
          <p className="mt-2 text-sm text-slate-400">
            Identify latent target pain points, score transactional opportunities, and discover custom strategic recommendations.
          </p>
        </div>
        {report && (
          <button
            onClick={() => window.print()}
            className="flex items-center gap-2 px-4 py-2.5 bg-slate-800 border border-slate-700 hover:bg-slate-700 text-slate-200 rounded-xl text-sm font-semibold transition-all duration-200"
          >
            <FileDown className="h-4 w-4" /> Export Report (PDF)
          </button>
        )}
      </div>

      <div className="grid gap-8 lg:grid-cols-4 print:grid-cols-1">
        {/* Search Drawer & History */}
        <div className="lg:col-span-1 space-y-6 print:hidden">
          {/* Search Card */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 space-y-4">
            <h2 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
              <Bot className="h-4.5 w-4.5 text-indigo-400 animate-pulse" /> Trigger Analysis
            </h2>

            <form onSubmit={handleSearch} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
                  Account Name or Domain
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    disabled={loading}
                    placeholder="e.g. stripe.com or Notion"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 pl-3 pr-10 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 disabled:opacity-50"
                  />
                  <Search className="absolute right-3 top-3 h-4 w-4 text-slate-500" />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || !query.trim()}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 text-white rounded-xl text-sm font-semibold transition-all duration-200 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" /> Processing...
                  </>
                ) : (
                  'Run Audit'
                )}
              </button>
            </form>
          </div>

          {/* History Card */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/30 p-6 space-y-4">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <History className="h-4 w-4" /> Strategic History
            </h3>
            {history.length === 0 ? (
              <p className="text-xs text-slate-500 italic">No reports generated.</p>
            ) : (
              <div className="space-y-2 overflow-y-auto max-h-80 pr-1">
                {history.map((hist, idx) => (
                  <button
                    key={idx}
                    onClick={() => loadReport(hist)}
                    className={`w-full text-left p-3 rounded-xl border text-xs transition-all ${
                      report?.id === hist.id
                        ? 'bg-indigo-950/40 border-indigo-500 text-indigo-200'
                        : 'bg-slate-900/20 border-slate-850 text-slate-400 hover:bg-slate-900/60 hover:text-slate-200'
                    }`}
                  >
                    <div className="flex justify-between items-center gap-1">
                      <div className="font-semibold truncate">{hist.company?.name}</div>
                      <span className="text-[10px] font-bold text-slate-500 shrink-0">
                        {hist.overallOpportunityScore}%
                      </span>
                    </div>
                    <div className="text-[10px] text-slate-500 mt-1">
                      {new Date(hist.metadata?.timestamp || '').toLocaleDateString()}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Workspace Display Area */}
        <div className="lg:col-span-3 space-y-6 print:col-span-1">
          {/* Loading state container */}
          {loading && (
            <div className="rounded-2xl border border-slate-800 bg-slate-900/20 p-12 text-center flex flex-col items-center justify-center space-y-6 print:hidden">
              <Bot className="h-12 w-12 text-indigo-400 animate-bounce" />
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-white">Running Strategic Consulting Audit</h3>
                <p className="text-sm text-slate-400 max-w-sm mx-auto">
                  Google Gemini Agent is executing multi-stage analysis, evaluating company parameters and scoring opportunities.
                </p>
              </div>

              {/* Progress Stage Tracker */}
              <div className="w-full max-w-xs text-left space-y-2 text-xs border-t border-slate-800/80 pt-4">
                {[
                  '1. Detecting structural organizational challenges...',
                  '2. Crawling active expansion growth indicators...',
                  '3. Mapping high-urgency business buying triggers...',
                  '4. Calculating weighted priority scoring metrics...',
                  '5. Formulating consulting value propositions...',
                  '6. Synthesizing executive briefs and summary implications...',
                ].map((step, idx) => {
                  const stepNum = idx + 1;
                  const isActive = progressStep === stepNum;
                  const isDone = progressStep > stepNum;
                  return (
                    <div
                      key={idx}
                      className={`flex items-center gap-2 ${
                        isDone
                          ? 'text-emerald-400'
                          : isActive
                            ? 'text-indigo-400 font-semibold animate-pulse'
                            : 'text-slate-600'
                      }`}
                    >
                      <div className="h-2 w-2 rounded-full bg-current" />
                      <span>{step}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && !loading && (
            <div className="rounded-2xl border border-rose-900/30 bg-rose-950/20 p-6 flex items-start gap-3.5 print:hidden">
              <AlertCircle className="h-6 w-6 text-rose-400 shrink-0" />
              <div>
                <h3 className="text-sm font-semibold text-rose-200">Analysis Aborted</h3>
                <p className="text-xs text-rose-400 mt-1">{error}</p>
              </div>
            </div>
          )}

          {/* Empty state */}
          {!report && !loading && !error && (
            <div className="rounded-2xl border border-dashed border-slate-800 bg-slate-900/10 p-20 text-center flex flex-col items-center justify-center space-y-4 print:hidden">
              <Lightbulb className="h-10 w-10 text-slate-600" />
              <div>
                <h3 className="text-md font-semibold text-slate-300">Opportunity Workspace Empty</h3>
                <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
                  Run an audit on a target company name or domain in the New Audit drawer to compile McKinsey-style opportunities.
                </p>
              </div>
            </div>
          )}

          {/* Core Report Content Display */}
          {report && !loading && (
            <div className="space-y-6 print:space-y-8">
              {/* Scorecard Summary Row */}
              <div className="grid gap-4 grid-cols-2 lg:grid-cols-4 print:grid-cols-4">
                <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/40 space-y-2">
                  <div className="text-xs text-slate-400 font-medium uppercase tracking-wider flex items-center gap-1.5">
                    <Target className="h-4 w-4 text-indigo-400" /> Overall Opportunity
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-extrabold text-white print:text-black">
                      {report.overallOpportunityScore}%
                    </span>
                  </div>
                </div>

                <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/40 space-y-2">
                  <div className="text-xs text-slate-400 font-medium uppercase tracking-wider flex items-center gap-1.5">
                    <Zap className="h-4 w-4 text-amber-400" /> Sales Triggers
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-extrabold text-white print:text-black">
                      {report.salesTriggers?.length || 0}
                    </span>
                    <span className="text-xs text-slate-500">Active</span>
                  </div>
                </div>

                <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/40 space-y-2">
                  <div className="text-xs text-slate-400 font-medium uppercase tracking-wider flex items-center gap-1.5">
                    <ShieldAlert className="h-4 w-4 text-rose-400" /> Latent Pain Points
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-extrabold text-white print:text-black">
                      {report.painPoints?.length || 0}
                    </span>
                    <span className="text-xs text-slate-500">Detected</span>
                  </div>
                </div>

                <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/40 space-y-2">
                  <div className="text-xs text-slate-400 font-medium uppercase tracking-wider flex items-center gap-1.5">
                    <Award className="h-4 w-4 text-emerald-400" /> Target Account
                  </div>
                  <div className="text-lg font-bold text-white print:text-black truncate mt-1">
                    {report.company?.name}
                  </div>
                </div>
              </div>

              {/* Priority matrix block */}
              <div className="rounded-2xl border border-slate-800 bg-slate-900/20 p-6 space-y-4">
                <h3 className="text-sm font-semibold text-slate-200">Opportunities Priority Matrix</h3>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 print:grid-cols-1">
                  {report.opportunities?.map((opp, idx) => {
                    let priorityLabel = 'Medium Opportunity';
                    let priorityStyle = 'border-slate-800 text-slate-300 bg-slate-900/60';
                    if (opp.score >= 90) {
                      priorityLabel = 'Critical Opportunity';
                      priorityStyle = 'border-red-900/40 text-red-300 bg-red-950/20';
                    } else if (opp.score >= 80) {
                      priorityLabel = 'High Value Opportunity';
                      priorityStyle = 'border-orange-900/40 text-orange-300 bg-orange-950/20';
                    } else if (opp.score < 70) {
                      priorityLabel = 'Low Opportunity';
                      priorityStyle = 'border-slate-850 text-slate-400 bg-slate-900/20';
                    }
                    return (
                      <div
                        key={idx}
                        className={`p-4 rounded-xl border flex flex-col justify-between space-y-3 ${priorityStyle}`}
                      >
                        <div className="space-y-1">
                          <div className="text-[10px] uppercase font-bold tracking-wider opacity-80">
                            {priorityLabel}
                          </div>
                          <h4 className="text-sm font-bold truncate">{opp.opportunityName}</h4>
                        </div>
                        <p className="text-xs opacity-75 leading-relaxed line-clamp-3">
                          {opp.rationale}
                        </p>
                        <div className="flex items-center justify-between border-t border-current/10 pt-2.5 text-xs font-semibold">
                          <span>Fit Match Score</span>
                          <span>{opp.score}%</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Tab navigation links */}
              <div className="flex border-b border-slate-800 print:hidden">
                {[
                  { id: 'summary', label: 'Consulting Summary' },
                  { id: 'pains', label: 'Pain Points' },
                  { id: 'signals', label: 'Growth Signals' },
                  { id: 'triggers', label: 'Sales Triggers' },
                  { id: 'recommendations', label: 'Outreach Prep' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as ActiveTabName)}
                    className={`px-5 py-3.5 text-xs font-semibold transition-all border-b-2 -mb-[2px] ${
                      activeTab === tab.id
                        ? 'border-indigo-500 text-indigo-400'
                        : 'border-transparent text-slate-500 hover:text-slate-300'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Tab outputs */}
              <div className="bg-slate-900/10 rounded-2xl border border-slate-800 p-6 md:p-8 print:border-none print:p-0">
                {/* 1. Summary Tab */}
                {(activeTab === 'summary' || typeof window === 'undefined') && (
                  <div className="space-y-6 print:block">
                    <h3 className="hidden print:block text-lg font-bold border-b pb-2 mb-4">
                      Strategic Consulting Analysis
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                          Executive Briefing
                        </h4>
                        <p className="text-sm text-slate-300 leading-relaxed mt-2.5 print:text-slate-700">
                          {report.executiveSummary}
                        </p>
                      </div>

                      <div className="pt-6 border-t border-slate-800/80 space-y-4">
                        <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                          Consulting Insights
                        </h4>
                        <div className="space-y-4">
                          {report.executiveInsights?.map((ins, idx) => (
                            <div
                              key={idx}
                              className="p-4 rounded-xl border border-slate-800 bg-slate-950/40 space-y-2.5 print:border-none print:p-0"
                            >
                              <div className="flex justify-between items-center">
                                <strong className="text-sm text-indigo-300 print:text-black">
                                  {ins.insight}
                                </strong>
                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${getScoreBadgeColor(ins.confidence)}`}>
                                  {ins.confidence}% Confidence
                                </span>
                              </div>
                              <div className="text-xs text-slate-400">
                                <span className="font-semibold text-slate-500">Supporting Evidence:</span> {ins.evidence}
                              </div>
                              <div className="text-xs text-slate-400 border-l-2 border-indigo-500 pl-3">
                                <span className="font-semibold text-indigo-400">Strategic Implication:</span> {ins.implication}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 2. Pain Points Tab */}
                {(activeTab === 'pains' || typeof window === 'undefined') && (
                  <div className="space-y-6 print:block print:mt-8">
                    <h3 className="hidden print:block text-lg font-bold border-b pb-2 mb-4">
                      Latent Pain Points
                    </h3>
                    <div className="space-y-4">
                      {report.painPoints?.map((p, idx) => (
                        <div
                          key={idx}
                          className="p-5 rounded-xl border border-slate-800 bg-slate-950/40 flex justify-between items-start gap-4 print:border-none print:p-0"
                        >
                          <div className="space-y-2">
                            <div className="flex items-center gap-3">
                              <h4 className="text-sm font-bold text-slate-200 print:text-black">{p.title}</h4>
                              <span className={`px-2 py-0.5 rounded text-[9px] font-bold border uppercase tracking-wider ${getImpactBadgeColor(p.businessImpact)}`}>
                                {p.businessImpact} Impact
                              </span>
                            </div>
                            <p className="text-xs text-slate-400 leading-relaxed print:text-slate-700">{p.explanation}</p>
                            <div className="text-[10px] text-slate-500">
                              <span className="font-semibold uppercase tracking-wider">Evidence:</span> {p.evidence}
                            </div>
                          </div>
                          <span className={`px-2 py-1 rounded text-xs font-mono font-bold ${getScoreBadgeColor(p.confidenceScore)} shrink-0`}>
                            {p.confidenceScore}% Conf
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 3. Growth Signals Tab */}
                {(activeTab === 'signals' || typeof window === 'undefined') && (
                  <div className="space-y-6 print:block print:mt-8">
                    <h3 className="hidden print:block text-lg font-bold border-b pb-2 mb-4">
                      Corporate Growth Signals
                    </h3>
                    <div className="space-y-4">
                      {report.growthSignals?.map((sig, idx) => (
                        <div
                          key={idx}
                          className="p-5 rounded-xl border border-slate-800 bg-slate-950/40 space-y-3.5 print:border-none print:p-0"
                        >
                          <div className="flex justify-between items-center">
                            <h4 className="text-sm font-bold text-emerald-400 print:text-black flex items-center gap-1.5">
                              <TrendingUp className="h-4 w-4 shrink-0" /> {sig.signal}
                            </h4>
                            <span className={`px-2.5 py-0.5 rounded text-xs font-mono font-bold ${getScoreBadgeColor(sig.confidence)}`}>
                              {sig.confidence}% Conf
                            </span>
                          </div>
                          <p className="text-xs text-slate-400 leading-relaxed">
                            <strong className="text-slate-500 uppercase tracking-wide text-[10px]">Market Significance:</strong> {sig.significance}
                          </p>
                          <div className="p-3.5 rounded-lg bg-indigo-950/15 border border-indigo-900/30 text-xs text-indigo-300 flex items-start gap-2.5 print:border-none print:bg-transparent print:p-0">
                            <Target className="h-4 w-4 shrink-0 text-indigo-400 mt-0.5" />
                            <div>
                              <strong className="font-semibold">Recommended Sales Approach:</strong>
                              <p className="text-slate-450 mt-1 print:text-slate-700">{sig.recommendedApproach}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 4. Sales Triggers Tab */}
                {(activeTab === 'triggers' || typeof window === 'undefined') && (
                  <div className="space-y-6 print:block print:mt-8">
                    <h3 className="hidden print:block text-lg font-bold border-b pb-2 mb-4">
                      Active Sales Triggers
                    </h3>
                    <div className="grid gap-4 md:grid-cols-2 print:grid-cols-1">
                      {report.salesTriggers?.map((trg, idx) => (
                        <div
                          key={idx}
                          className="p-5 rounded-xl border border-slate-850 bg-slate-950/40 space-y-3 flex flex-col justify-between print:border-none print:p-0"
                        >
                          <div className="space-y-2">
                            <div className="flex justify-between items-center gap-2 border-b border-slate-900 pb-2">
                              <span className={`px-2 py-0.5 rounded text-[9px] font-bold border uppercase tracking-wider ${getLevelColor(trg.opportunityLevel)}`}>
                                {trg.opportunityLevel} Priority
                              </span>
                              <span className={`px-2 py-0.5 rounded text-[9px] font-bold border uppercase tracking-wider ${getLevelColor(trg.urgency)}`}>
                                {trg.urgency} Urgency
                              </span>
                            </div>
                            <h4 className="text-sm font-bold text-slate-200 print:text-black flex items-start gap-1.5">
                              <Zap className="h-4 w-4 text-amber-400 mt-0.5 shrink-0" />
                              <span>{trg.trigger}</span>
                            </h4>
                          </div>
                          <div className="pt-3 border-t border-slate-900 space-y-1.5">
                            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Suggested Outreach Angle</span>
                            <p className="text-xs text-slate-400 leading-relaxed print:text-slate-700">{trg.suggestedOutreachAngle}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 5. Recommendations Tab */}
                {(activeTab === 'recommendations' || typeof window === 'undefined') && (
                  <div className="space-y-8 print:block print:mt-8">
                    <h3 className="hidden print:block text-lg font-bold border-b pb-2 mb-4">
                      Strategic Recommendations & Pitch Assets
                    </h3>
                    {report.recommendations?.map((rec, idx) => (
                      <div key={idx} className="space-y-6 first:mt-0 mt-8 border-t first:border-t-0 border-slate-800 pt-6 first:pt-0">
                        <div className="flex items-start gap-3">
                          <div className="h-7 w-7 rounded-full bg-indigo-950 border border-indigo-900 flex items-center justify-center font-bold text-xs text-indigo-400 shrink-0 print:border-none">
                            {idx + 1}
                          </div>
                          <div>
                            <h4 className="text-sm font-bold text-indigo-300 print:text-black">Proposed Business Offering</h4>
                            <p className="text-xs text-slate-400 leading-relaxed mt-1">{rec.solution}</p>
                          </div>
                        </div>

                        {/* Value propositions & messaging */}
                        <div className="grid gap-4 md:grid-cols-2">
                          <div className="p-4 rounded-xl border border-slate-900 bg-slate-950/60">
                            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider flex items-center gap-1.5">
                              <Target className="h-3.5 w-3.5 text-indigo-400" /> Messaging Themes
                            </span>
                            <ul className="mt-2.5 space-y-1.5 text-xs text-slate-450 list-disc pl-4">
                              {rec.messagingThemes?.map((theme, i) => (
                                <li key={i}>{theme}</li>
                              ))}
                            </ul>
                          </div>

                          <div className="p-4 rounded-xl border border-slate-900 bg-slate-950/60">
                            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider flex items-center gap-1.5">
                              <Users className="h-3.5 w-3.5 text-emerald-400" /> Value Propositions
                            </span>
                            <ul className="mt-2.5 space-y-1.5 text-xs text-slate-450 list-disc pl-4">
                              {rec.valueProps?.map((prop, i) => (
                                <li key={i}>{prop}</li>
                              ))}
                            </ul>
                          </div>
                        </div>

                        {/* Executive talking points & Discovery questions */}
                        <div className="grid gap-4 md:grid-cols-2">
                          <div className="p-4 rounded-xl border border-slate-900 bg-slate-950/60">
                            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider flex items-center gap-1.5">
                              <FileText className="h-3.5 w-3.5 text-indigo-400" /> Executive Talking Points
                            </span>
                            <ul className="mt-2.5 space-y-2 text-xs text-slate-450 list-decimal pl-4 leading-normal">
                              {rec.talkingPoints?.map((pt, i) => (
                                <li key={i}>{pt}</li>
                              ))}
                            </ul>
                          </div>

                          <div className="p-4 rounded-xl border border-slate-900 bg-slate-950/60">
                            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider flex items-center gap-1.5">
                              <HelpCircle className="h-3.5 w-3.5 text-indigo-400" /> Discovery Call Questions
                            </span>
                            <ul className="mt-2.5 space-y-2 text-xs text-slate-450 list-decimal pl-4 leading-normal">
                              {rec.discoveryQuestions?.map((q, i) => (
                                <li key={i}>{q}</li>
                              ))}
                            </ul>
                          </div>
                        </div>

                        {/* Objection handling block */}
                        {rec.objectionPrep && rec.objectionPrep.length > 0 && (
                          <div className="rounded-xl border border-slate-900 bg-slate-950/40 p-4 space-y-3.5">
                            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Anticipated Objections & Handling</span>
                            <div className="space-y-3 divide-y divide-slate-900">
                              {rec.objectionPrep.map((obj, i) => (
                                <div key={i} className="pt-3 first:pt-0 space-y-1">
                                  <div className="text-xs font-semibold text-rose-400 flex items-start gap-1">
                                    <span className="font-bold">Q:</span>
                                    <span>{obj.objection}</span>
                                  </div>
                                  <div className="text-xs text-slate-400 flex items-start gap-1 pl-4 border-l-2 border-emerald-500">
                                    <span className="font-bold text-emerald-400">A:</span>
                                    <p className="print:text-slate-700">{obj.response}</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

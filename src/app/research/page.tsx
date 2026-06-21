'use client';

import React, { useState, useEffect } from 'react';
import {
  Search,
  Bot,
  Layers,
  Users,
  AlertTriangle,
  Lightbulb,
  FileDown,
  History,
  TrendingUp,
  Calendar,
  DollarSign,
  Building,
  CheckCircle,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';
import { ResearchReport } from '@/agents/specialists/research/types';

type TabName = 'overview' | 'products' | 'competitors' | 'opportunities' | 'recommendations';

export default function ResearchPage() {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [progressStep, setProgressStep] = useState(0);
  const [error, setError] = useState<string | null>(null);
  
  const [report, setReport] = useState<ResearchReport | null>(null);
  const [history, setHistory] = useState<ResearchReport[]>([]);
  const [activeTab, setActiveTab] = useState<TabName>('overview');

  const fetchHistoryData = async () => {
    try {
      const res = await fetch('/api/research');
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        return data.data;
      }
    } catch (err) {
      console.error('Failed to load history', err);
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
    const timer1 = setTimeout(() => setProgressStep(2), 2000);
    const timer2 = setTimeout(() => setProgressStep(3), 4000);
    const timer3 = setTimeout(() => setProgressStep(4), 6000);
    const timer4 = setTimeout(() => setProgressStep(5), 8000);

    try {
      const res = await fetch('/api/research', {
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

      if (!res.ok || !data.success) {
        throw new Error(data.error?.message || 'Failed to complete research pipeline.');
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

  const loadReport = (selected: ResearchReport) => {
    setReport(selected);
    setError(null);
    setActiveTab('overview');
  };

  const getConfidenceBadgeColor = (score: number) => {
    if (score >= 85) return 'bg-emerald-950 text-emerald-400 border-emerald-900/50';
    if (score >= 70) return 'bg-amber-950 text-amber-400 border-amber-900/50';
    return 'bg-rose-950 text-rose-400 border-rose-900/50';
  };

  return (
    <div className="space-y-8 text-slate-100 print:bg-white print:text-black">
      {/* Header Panel */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5 print:hidden">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white md:text-4xl">Intelligence Research Hub</h1>
          <p className="mt-2 text-sm text-slate-400">
            Profile companies and crawl competitor databases to identify scored growth hooks.
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
        {/* Left Hand: Search Form & History List */}
        <div className="lg:col-span-1 space-y-6 print:hidden">
          {/* Form */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 space-y-4">
            <h2 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
              <Bot className="h-4.5 w-4.5 text-indigo-400" /> New Account Research
            </h2>

            <form onSubmit={handleSearch} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
                  Company Name or URL
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    disabled={loading}
                    placeholder="e.g. stripe.com or HubSpot"
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
                  'Start Analysis'
                )}
              </button>
            </form>
          </div>

          {/* History */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/30 p-6 space-y-4">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <History className="h-4 w-4" /> Research History
            </h3>
            {history.length === 0 ? (
              <p className="text-xs text-slate-500 italic">No reports found.</p>
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
                    <div className="font-semibold truncate">{hist.company?.name}</div>
                    <div className="text-[10px] text-slate-500 mt-1">
                      {new Date(hist.metadata?.timestamp || '').toLocaleDateString()}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Hand: Workspace Report Display / Loading States */}
        <div className="lg:col-span-3 space-y-6 print:col-span-1">
          {/* Loading Container */}
          {loading && (
            <div className="rounded-2xl border border-slate-800 bg-slate-900/20 p-12 text-center flex flex-col items-center justify-center space-y-6 print:hidden">
              <Bot className="h-12 w-12 text-indigo-400 animate-bounce" />
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-white">Running Multi-Stage Crawler</h3>
                <p className="text-sm text-slate-400 max-w-sm mx-auto">
                  Gemini Agent is executing real-time search grounding and compiling company intelligence reports.
                </p>
              </div>

              {/* Steps Progress Checklist */}
              <div className="w-full max-w-xs text-left space-y-2 text-xs border-t border-slate-800/80 pt-4">
                {[
                  '1. Retrieving general company metadata...',
                  '2. Parsing product directories & pricing packages...',
                  '3. Mapping competitor landscapes...',
                  '4. Discovering opportunities and risk indexes...',
                  '5. Formatting structured analytical synthesis...',
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

          {/* Error Container */}
          {error && !loading && (
            <div className="rounded-2xl border border-rose-900/30 bg-rose-950/20 p-6 flex items-start gap-3.5 print:hidden">
              <AlertCircle className="h-6 w-6 text-rose-400 shrink-0" />
              <div>
                <h3 className="text-sm font-semibold text-rose-200">Analysis Pipeline Aborted</h3>
                <p className="text-xs text-rose-400 mt-1">{error}</p>
              </div>
            </div>
          )}

          {/* Empty State */}
          {!report && !loading && !error && (
            <div className="rounded-2xl border border-dashed border-slate-800 bg-slate-900/10 p-20 text-center flex flex-col items-center justify-center space-y-4 print:hidden">
              <Bot className="h-10 w-10 text-slate-600" />
              <div>
                <h3 className="text-md font-semibold text-slate-300">No Target Active</h3>
                <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
                  Type a website URL or company name in the New Account Research drawer to generate actionable sales profiles.
                </p>
              </div>
            </div>
          )}

          {/* Report Display Layout */}
          {report && !loading && (
            <div className="space-y-6 print:space-y-10">
              {/* Profile Card Header */}
              <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 md:p-8 flex flex-col md:flex-row justify-between gap-6 print:border-none print:bg-transparent print:p-0">
                <div className="flex items-center gap-5">
                  {report.company?.logo && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={report.company.logo}
                      alt="Logo"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                      className="h-16 w-16 rounded-2xl bg-white border border-slate-800 p-2 object-contain print:border-none"
                    />
                  )}
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-3">
                      <h2 className="text-2xl font-bold text-white print:text-black">
                        {report.company?.name}
                      </h2>
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-950 text-indigo-400 border border-indigo-900/50 print:hidden">
                        {report.company?.marketPosition || 'Active Target'}
                      </span>
                    </div>
                    <a
                      href={`https://${report.company?.website}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-indigo-400 hover:underline print:text-slate-600"
                    >
                      {report.company?.website}
                    </a>
                    <p className="text-xs text-slate-400 max-w-xl leading-relaxed print:text-slate-700">
                      {report.company?.description}
                    </p>
                  </div>
                </div>

                {/* Metadata badges */}
                <div className="grid grid-cols-2 gap-4 shrink-0 min-w-[200px] text-xs text-slate-400 print:grid-cols-4 print:w-full print:mt-4 print:border-t print:pt-4">
                  <div className="flex items-center gap-2 bg-slate-900/60 p-2.5 rounded-xl border border-slate-850 print:border-none print:p-0">
                    <Building className="h-4 w-4 text-slate-500" />
                    <div>
                      <div className="text-[10px] text-slate-500 uppercase font-semibold">Location</div>
                      <div className="text-slate-200 font-medium truncate print:text-black">
                        {report.company?.location || 'Unknown'}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 bg-slate-900/60 p-2.5 rounded-xl border border-slate-850 print:border-none print:p-0">
                    <Users className="h-4 w-4 text-slate-500" />
                    <div>
                      <div className="text-[10px] text-slate-500 uppercase font-semibold">Headcount</div>
                      <div className="text-slate-200 font-medium print:text-black">
                        {report.company?.employeeCount || 'N/A'}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 bg-slate-900/60 p-2.5 rounded-xl border border-slate-850 print:border-none print:p-0">
                    <DollarSign className="h-4 w-4 text-slate-500" />
                    <div>
                      <div className="text-[10px] text-slate-500 uppercase font-semibold">Revenue</div>
                      <div className="text-slate-200 font-medium print:text-black">
                        {report.company?.estimatedRevenue || 'N/A'}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 bg-slate-900/60 p-2.5 rounded-xl border border-slate-850 print:border-none print:p-0">
                    <Calendar className="h-4 w-4 text-slate-500" />
                    <div>
                      <div className="text-[10px] text-slate-500 uppercase font-semibold">Founded</div>
                      <div className="text-slate-200 font-medium print:text-black">
                        {report.company?.founded || 'N/A'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tabs Panel Selector */}
              <div className="flex border-b border-slate-800 print:hidden">
                {[
                  { id: 'overview', label: 'Company Overview' },
                  { id: 'products', label: 'Products & Signals' },
                  { id: 'competitors', label: 'Competitor Landscape' },
                  { id: 'opportunities', label: 'Opportunities & Risks' },
                  { id: 'recommendations', label: 'Outreach Hooks' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as TabName)}
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

              {/* Tab Outputs */}
              <div className="bg-slate-900/10 rounded-2xl border border-slate-800 p-6 md:p-8 print:border-none print:p-0">
                {/* 1. Overview Tab */}
                {(activeTab === 'overview' || typeof window === 'undefined') && (
                  <div className="space-y-6 print:block">
                    <h3 className="hidden print:block text-lg font-bold border-b pb-2 mb-4">
                      Executive Summary
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                          Executive Synthesis
                        </h4>
                        <p className="text-sm text-slate-350 leading-relaxed mt-2 print:text-slate-700">
                          {report.summary}
                        </p>
                      </div>
                      <div className="grid gap-6 md:grid-cols-2 pt-4">
                        <div>
                          <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                            <Layers className="h-4 w-4 text-slate-500" /> Industry Taxonomy
                          </h4>
                          <div className="mt-3 flex flex-wrap gap-2">
                            <span className="px-3 py-1 rounded-xl bg-slate-900 border border-slate-800 text-xs text-indigo-300 print:text-black">
                              {report.industry?.classification}
                            </span>
                            <span className="px-3 py-1 rounded-xl bg-slate-900 border border-slate-800 text-xs text-emerald-300 print:text-black">
                              {report.industry?.vertical}
                            </span>
                          </div>
                          <div className="mt-4 flex flex-wrap gap-1.5">
                            {report.industry?.tags?.map((tag, i) => (
                              <span
                                key={i}
                                className="px-2 py-0.5 rounded-lg bg-slate-950 text-[10px] text-slate-400 border border-slate-900"
                              >
                                #{tag}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div>
                          <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                            <Users className="h-4 w-4 text-slate-500" /> Business Parameters
                          </h4>
                          <ul className="mt-3 space-y-2 text-xs text-slate-350">
                            <li>
                              <strong className="text-slate-500">Business Model:</strong>{' '}
                              {report.company?.businessModel}
                            </li>
                            <li>
                              <strong className="text-slate-500">Target Segment:</strong>{' '}
                              {report.company?.targetCustomers?.join(', ')}
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 2. Products Tab */}
                {(activeTab === 'products' || typeof window === 'undefined') && (
                  <div className="space-y-6 print:block print:mt-8">
                    <h3 className="hidden print:block text-lg font-bold border-b pb-2 mb-4">
                      Products & Offerings
                    </h3>
                    <div className="space-y-4">
                      <div className="divide-y divide-slate-800">
                        {report.products?.map((prod, idx) => (
                          <div key={idx} className="py-4 first:pt-0 last:pb-0 flex justify-between items-start gap-4">
                            <div className="space-y-1">
                              <h4 className="text-sm font-semibold text-slate-200 print:text-black">
                                {prod.name}
                              </h4>
                              <p className="text-xs text-slate-400 max-w-2xl print:text-slate-700">
                                {prod.description}
                              </p>
                            </div>
                            <span className="px-2.5 py-1 rounded-xl bg-slate-950 border border-slate-900 text-xs font-mono text-slate-400 shrink-0 print:border-none print:p-0">
                              {prod.pricing}
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* Signals Sub-panel */}
                      {report.signals && (
                        <div className="mt-8 pt-6 border-t border-slate-800 grid gap-6 md:grid-cols-2 print:grid-cols-1">
                          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-900">
                            <h4 className="text-xs font-semibold text-indigo-400 uppercase tracking-wide flex items-center gap-1.5">
                              <TrendingUp className="h-4 w-4" /> Hiring Intent Indicators
                            </h4>
                            <p className="text-xs text-slate-400 leading-relaxed mt-2.5">
                              {report.signals.hiringSignal}
                            </p>
                          </div>
                          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-900">
                            <h4 className="text-xs font-semibold text-emerald-400 uppercase tracking-wide flex items-center gap-1.5">
                              <CheckCircle className="h-4 w-4" /> Headcount & Growth Signals
                            </h4>
                            <p className="text-xs text-slate-400 leading-relaxed mt-2.5">
                              {report.signals.growthIndicator}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* 3. Competitors Tab */}
                {(activeTab === 'competitors' || typeof window === 'undefined') && (
                  <div className="space-y-6 print:block print:mt-8">
                    <h3 className="hidden print:block text-lg font-bold border-b pb-2 mb-4">
                      Competitor Analysis
                    </h3>
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 print:grid-cols-1">
                      {report.competitors?.map((comp, idx) => (
                        <div
                          key={idx}
                          className="p-5 rounded-xl border border-slate-850 bg-slate-950/40 space-y-4 print:border-none print:p-0"
                        >
                          <div className="flex justify-between items-center border-b border-slate-900 pb-2.5">
                            <strong className="text-slate-200 print:text-black">{comp.name}</strong>
                            <span className="text-[10px] text-slate-500 uppercase tracking-wider">
                              {comp.relationship}
                            </span>
                          </div>
                          <div className="space-y-2 text-xs">
                            <div className="p-3.5 rounded-lg bg-emerald-950/20 border border-emerald-900/20">
                              <span className="font-semibold text-emerald-400">Competitive Advantage:</span>
                              <p className="text-slate-400 mt-1 leading-normal print:text-slate-700">
                                {comp.advantage}
                              </p>
                            </div>
                            <div className="p-3.5 rounded-lg bg-rose-950/20 border border-rose-900/20">
                              <span className="font-semibold text-rose-400">Relative Vulnerability:</span>
                              <p className="text-slate-400 mt-1 leading-normal print:text-slate-700">
                                {comp.disadvantage}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 4. Opportunities Tab */}
                {(activeTab === 'opportunities' || typeof window === 'undefined') && (
                  <div className="space-y-8 print:block print:mt-8">
                    <h3 className="hidden print:block text-lg font-bold border-b pb-2 mb-4">
                      Sales Opportunities & Risks
                    </h3>
                    
                    {/* Opportunities */}
                    <div className="space-y-4">
                      <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                        <Lightbulb className="h-4.5 w-4.5 text-indigo-400" /> Scored Sales Hooks
                      </h4>
                      <div className="grid gap-4 md:grid-cols-2 print:grid-cols-1">
                        {report.opportunities?.map((opp, idx) => (
                          <div
                            key={idx}
                            className="p-5 rounded-xl border border-slate-850 bg-slate-950/40 flex justify-between gap-4 print:border-none print:p-0"
                          >
                            <div className="space-y-1.5">
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-950 text-indigo-400 uppercase">
                                {opp.type}
                              </span>
                              <p className="text-xs text-slate-300 leading-relaxed print:text-slate-700">
                                {opp.insight}
                              </p>
                              <div className="text-[10px] text-slate-500">Source: {opp.source}</div>
                            </div>
                            <div
                              className={`shrink-0 h-11 w-11 rounded-full border flex flex-col items-center justify-center font-bold text-xs ${getConfidenceBadgeColor(
                                opp.confidence,
                              )}`}
                            >
                              <span>{opp.confidence}%</span>
                              <span className="text-[7px] uppercase font-medium">Conf</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Risks */}
                    <div className="space-y-4 pt-6 border-t border-slate-800">
                      <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                        <AlertTriangle className="h-4.5 w-4.5 text-amber-400" /> Account Risk Index
                      </h4>
                      <div className="grid gap-4 md:grid-cols-2 print:grid-cols-1">
                        {report.risks?.map((risk, idx) => (
                          <div
                            key={idx}
                            className="p-5 rounded-xl border border-slate-850 bg-slate-950/40 flex justify-between gap-4 print:border-none print:p-0"
                          >
                            <div className="space-y-1.5">
                              <p className="text-xs text-slate-300 leading-relaxed print:text-slate-700">
                                {risk.insight}
                              </p>
                              <div className="text-[10px] text-slate-500">Source: {risk.source}</div>
                            </div>
                            <div
                              className={`shrink-0 h-11 w-11 rounded-full border flex flex-col items-center justify-center font-bold text-xs ${getConfidenceBadgeColor(
                                risk.confidence,
                              )}`}
                            >
                              <span>{risk.confidence}%</span>
                              <span className="text-[7px] uppercase font-medium">Conf</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* 5. Recommendations Tab */}
                {(activeTab === 'recommendations' || typeof window === 'undefined') && (
                  <div className="space-y-6 print:block print:mt-8">
                    <h3 className="hidden print:block text-lg font-bold border-b pb-2 mb-4">
                      Sales Rep Recommendations
                    </h3>
                    <div className="space-y-4">
                      <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                        Strategic Outreach Angles
                      </h4>
                      <ul className="space-y-3">
                        {report.recommendations?.map((rec, idx) => (
                          <li
                            key={idx}
                            className="p-4 rounded-xl bg-indigo-950/15 border border-indigo-900/35 text-slate-300 text-xs leading-relaxed flex items-start gap-3 print:border-none print:bg-transparent print:p-0"
                          >
                            <span className="h-5 w-5 rounded-full bg-indigo-950 border border-indigo-900 flex items-center justify-center text-[10px] font-bold text-indigo-400 shrink-0 print:border-none">
                              {idx + 1}
                            </span>
                            <span className="print:text-slate-700">{rec}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
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

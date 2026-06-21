'use client';

import React, { useState, useEffect } from 'react';
import {
  Mail,
  Users,
  ShieldAlert,
  Copy,
  Check,
  Send,
  History,
  RefreshCw,
  AlertCircle,
  Bot,
  Search,
  FileDown,
  Award,
  Zap,
  CheckCircle,
  MessageSquare,
} from 'lucide-react';
import { OutreachPackage, ColdEmailVariant, FollowUpStep } from '@/agents/specialists/outreach/types';

type ActiveTabName = 'emails' | 'campaigns' | 'personas' | 'callPrep' | 'objections' | 'summary';

export default function OutreachPage() {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [progressStep, setProgressStep] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const [report, setReport] = useState<OutreachPackage | null>(null);
  const [history, setHistory] = useState<OutreachPackage[]>([]);
  const [activeTab, setActiveTab] = useState<ActiveTabName>('emails');

  // Local state for editable drafts
  const [selectedEmailIdx, setSelectedEmailIdx] = useState(0);
  const [localEmails, setLocalEmails] = useState<ColdEmailVariant[]>([]);
  const [localFollowUps, setLocalFollowUps] = useState<FollowUpStep[]>([]);
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [syncingCrm, setSyncingCrm] = useState<string | null>(null);

  const fetchHistoryData = async () => {
    try {
      const res = await fetch('/api/outreach');
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        return data.data;
      }
    } catch (err) {
      console.error('Failed to load outreach history', err);
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
    const timer1 = setTimeout(() => setProgressStep(2), 1200);
    const timer2 = setTimeout(() => setProgressStep(3), 2400);
    const timer3 = setTimeout(() => setProgressStep(4), 3600);
    const timer4 = setTimeout(() => setProgressStep(5), 4800);
    const timer5 = setTimeout(() => setProgressStep(6), 6000);
    const timer6 = setTimeout(() => setProgressStep(7), 7200);
    const timer7 = setTimeout(() => setProgressStep(8), 8400);

    try {
      const res = await fetch('/api/outreach', {
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
      clearTimeout(timer6);
      clearTimeout(timer7);

      if (!res.ok || !data.success) {
        throw new Error(data.error?.message || 'Failed to complete outreach generation.');
      }

      const campaignData = data.data;
      setReport(campaignData);
      setLocalEmails(campaignData.coldEmails || []);
      setLocalFollowUps(campaignData.followUpSequence || []);
      setSelectedEmailIdx(0);
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

  const loadReport = (selected: OutreachPackage) => {
    setReport(selected);
    setLocalEmails(selected.coldEmails || []);
    setLocalFollowUps(selected.followUpSequence || []);
    setSelectedEmailIdx(0);
    setError(null);
    setActiveTab('emails');
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const handleCrmSync = async (type: string, id: string) => {
    setSyncingCrm(id);
    // Simulate CRM activity log latency
    await new Promise((resolve) => setTimeout(resolve, 800));
    setSyncingCrm(null);
    alert(`Successfully synced and queued ${type} in CRM!`);
  };

  const handleEmailBodyChange = (index: number, val: string) => {
    const updated = [...localEmails];
    updated[index] = {
      ...updated[index],
      fullBody: val,
    };
    setLocalEmails(updated);
  };

  const handleEmailSubjectChange = (index: number, val: string) => {
    const updated = [...localEmails];
    updated[index] = {
      ...updated[index],
      subject: val,
    };
    setLocalEmails(updated);
  };

  const handleFollowUpChange = (index: number, val: string) => {
    const updated = [...localFollowUps];
    updated[index] = {
      ...updated[index],
      message: val,
    };
    setLocalFollowUps(updated);
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-emerald-400 bg-emerald-950/40 border-emerald-900/50';
    if (score >= 75) return 'text-indigo-400 bg-indigo-950/40 border-indigo-900/50';
    return 'text-amber-400 bg-amber-950/40 border-amber-900/50';
  };

  return (
    <div className="space-y-8 text-slate-100 print:bg-white print:text-black">
      {/* Header Panel */}
      <div className="flex flex-col justify-between gap-4 border-b border-slate-800 pb-5 md:flex-row md:items-center print:hidden">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white md:text-4xl">
            Outreach Workspace
          </h1>
          <p className="mt-2 text-sm text-slate-400">
            Build multi-channel outbound sequences, personalize email variants, prepare discovery meetings, and handle objections.
          </p>
        </div>
        {report && (
          <button
            onClick={() => window.print()}
            className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800 px-4 py-2.5 text-sm font-semibold text-slate-200 transition-all duration-200 hover:bg-slate-700"
          >
            <FileDown className="h-4 w-4" /> Export Package (PDF)
          </button>
        )}
      </div>

      <div className="grid gap-8 lg:grid-cols-4 print:grid-cols-1">
        {/* Sidebar Controls */}
        <div className="space-y-6 lg:col-span-1 print:hidden">
          {/* Search Card */}
          <div className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900/40 p-6">
            <h2 className="flex items-center gap-2 text-sm font-semibold text-slate-200">
              <Bot className="h-4.5 w-4.5 animate-pulse text-indigo-400" /> Generate Campaigns
            </h2>

            <form onSubmit={handleSearch} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold tracking-wide text-slate-400 uppercase">
                  Account Name or Domain
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    disabled={loading}
                    placeholder="e.g. stripe.com or Notion"
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 py-2.5 pr-10 pl-3 text-sm text-slate-200 focus:border-indigo-500 focus:outline-none disabled:opacity-50"
                  />
                  <Search className="absolute top-3 right-3 h-4 w-4 text-slate-500" />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || !query.trim()}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition-all duration-200 hover:bg-indigo-500 disabled:bg-slate-800 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" /> Processing...
                  </>
                ) : (
                  'Build Sequence'
                )}
              </button>
            </form>
          </div>

          {/* History Card */}
          <div className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900/30 p-6">
            <h3 className="flex items-center gap-2 text-xs font-semibold tracking-wider text-slate-400 uppercase">
              <History className="h-4 w-4" /> Outreach Archives
            </h3>
            {history.length === 0 ? (
              <p className="text-xs text-slate-500 italic">No sequences created.</p>
            ) : (
              <div className="max-h-80 space-y-2 overflow-y-auto pr-1">
                {history.map((hist, idx) => (
                  <button
                    key={idx}
                    onClick={() => loadReport(hist)}
                    className={`w-full rounded-xl border p-3 text-left text-xs transition-all ${
                      report?.id === hist.id
                        ? 'border-indigo-500 bg-indigo-950/40 text-indigo-200'
                        : 'border-slate-850 bg-slate-900/20 text-slate-400 hover:bg-slate-900/60 hover:text-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-1">
                      <div className="truncate font-semibold">{hist.company?.name}</div>
                      <span className="shrink-0 text-[10px] font-bold text-slate-500">
                        Score: {hist.outreachScore}
                      </span>
                    </div>
                    <div className="mt-1 text-[10px] text-slate-500">
                      {new Date(hist.metadata?.timestamp || '').toLocaleDateString()}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Display Area */}
        <div className="space-y-6 lg:col-span-3 print:col-span-1">
          {/* Loading stage tracker */}
          {loading && (
            <div className="flex flex-col items-center justify-center space-y-6 rounded-2xl border border-slate-800 bg-slate-900/20 p-12 text-center print:hidden">
              <Bot className="h-12 w-12 animate-bounce text-indigo-400" />
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-white">
                  Executing Outbound Sequence Agent
                </h3>
                <p className="mx-auto max-w-sm text-sm text-slate-400">
                  Synthesizing persona maps, writing contextual email sequences, and generating multi-channel timelines.
                </p>
              </div>

              <div className="w-full max-w-xs space-y-2 border-t border-slate-800/80 pt-4 text-left text-xs">
                {[
                  '1. Analyzing target executive roles and stakeholder priorities...',
                  '2. Tailoring business-pain and technical messaging themes...',
                  '3. Writing human-grade cold email variant drafts...',
                  '4. Constructing multi-step follow-up structures...',
                  '5. Planning timeline schedules across channels...',
                  '6. Preparing discovery meeting plans and objections list...',
                  '7. Evaluating copy quality score and summarizing outlook...',
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
                            ? 'animate-pulse font-semibold text-indigo-400'
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
            <div className="flex items-start gap-3.5 rounded-2xl border border-rose-900/30 bg-rose-950/20 p-6 print:hidden">
              <AlertCircle className="h-6 w-6 shrink-0 text-rose-400" />
              <div>
                <h3 className="text-sm font-semibold text-rose-200">Execution Aborted</h3>
                <p className="mt-1 text-xs text-rose-400">{error}</p>
              </div>
            </div>
          )}

          {/* Empty state */}
          {!report && !loading && !error && (
            <div className="flex flex-col items-center justify-center space-y-4 rounded-2xl border border-dashed border-slate-800 bg-slate-900/10 p-20 text-center print:hidden">
              <Mail className="h-10 w-10 text-slate-600" />
              <div>
                <h3 className="text-md font-semibold text-slate-300">
                  Outreach Workspace Empty
                </h3>
                <p className="mx-auto mt-1 max-w-xs text-xs text-slate-500">
                  Provide a domain or brand name to trigger high-impact customized copy, touchpoint calendars, and handling models.
                </p>
              </div>
            </div>
          )}

          {/* Core Content */}
          {report && !loading && (
            <div className="space-y-6 print:space-y-8">
              {/* Scorecard Summary Row */}
              <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 print:grid-cols-4">
                <div className="space-y-2 rounded-2xl border border-slate-800 bg-slate-900/40 p-5">
                  <div className="flex items-center gap-1.5 text-xs font-medium tracking-wider text-slate-400 uppercase">
                    <Award className="h-4 w-4 text-indigo-400" /> Quality Score
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className={`text-3xl font-extrabold print:text-black ${getScoreColor(report.outreachScore)}`}>
                      {report.outreachScore}%
                    </span>
                  </div>
                </div>

                <div className="space-y-2 rounded-2xl border border-slate-800 bg-slate-900/40 p-5">
                  <div className="flex items-center gap-1.5 text-xs font-medium tracking-wider text-slate-400 uppercase">
                    <Mail className="h-4 w-4 text-amber-400" /> Cold Variants
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-extrabold text-white print:text-black">
                      {report.coldEmails?.length || 0}
                    </span>
                    <span className="text-xs text-slate-500">Drafted</span>
                  </div>
                </div>

                <div className="space-y-2 rounded-2xl border border-slate-800 bg-slate-900/40 p-5">
                  <div className="flex items-center gap-1.5 text-xs font-medium tracking-wider text-slate-400 uppercase">
                    <Users className="h-4 w-4 text-emerald-400" /> Target Stakeholders
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-extrabold text-white print:text-black">
                      {report.targetPersonas?.length || 0}
                    </span>
                    <span className="text-xs text-slate-500">Mapped</span>
                  </div>
                </div>

                <div className="space-y-2 rounded-2xl border border-slate-800 bg-slate-900/40 p-5">
                  <div className="flex items-center gap-1.5 text-xs font-medium tracking-wider text-slate-400 uppercase">
                    <Zap className="h-4 w-4 text-purple-400" /> Prospect Account
                  </div>
                  <div className="mt-1 truncate text-lg font-bold text-white print:text-black">
                    {report.company?.name}
                  </div>
                </div>
              </div>

              {/* Tab Navigation */}
              <div className="flex border-b border-slate-800 overflow-x-auto print:hidden">
                {[
                  { id: 'emails', label: 'Email Generator' },
                  { id: 'campaigns', label: 'Campaign Builder' },
                  { id: 'personas', label: 'Persona Explorer' },
                  { id: 'callPrep', label: 'Call Preparation' },
                  { id: 'objections', label: 'Objection Library' },
                  { id: 'summary', label: 'Outreach Summary' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as ActiveTabName)}
                    className={`-mb-[2px] border-b-2 px-5 py-3.5 text-xs font-semibold whitespace-nowrap transition-all ${
                      activeTab === tab.id
                        ? 'border-indigo-500 text-indigo-400'
                        : 'border-transparent text-slate-500 hover:text-slate-300'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Tab Views */}
              <div className="rounded-2xl border border-slate-800 bg-slate-900/10 p-6 md:p-8 print:border-none print:p-0">
                {/* 1. Emails & Follow-up Tab */}
                {(activeTab === 'emails' || typeof window === 'undefined') && (
                  <div className="space-y-8 print:block">
                    <h3 className="mb-4 hidden border-b pb-2 text-lg font-bold print:block">
                      Personalized Email Campaign Assets
                    </h3>

                    {/* Cold Email Variants Panel */}
                    <div className="space-y-4 print:hidden">
                      <div className="flex flex-wrap gap-2">
                        {localEmails.map((email, idx) => (
                          <button
                            key={idx}
                            onClick={() => setSelectedEmailIdx(idx)}
                            className={`rounded-xl border px-4 py-2 text-xs font-semibold transition-all ${
                              selectedEmailIdx === idx
                                ? 'border-indigo-500 bg-indigo-950/40 text-indigo-300'
                                : 'border-slate-800 bg-slate-900/30 text-slate-400 hover:bg-slate-900/60'
                            }`}
                          >
                            {email.variantName}
                          </button>
                        ))}
                      </div>

                      {localEmails[selectedEmailIdx] && (
                        <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-5 space-y-4">
                          <div className="space-y-2">
                            <label className="text-[10px] font-bold tracking-wider text-slate-500 uppercase">
                              Subject Line
                            </label>
                            <input
                              type="text"
                              value={localEmails[selectedEmailIdx].subject}
                              onChange={(e) => handleEmailSubjectChange(selectedEmailIdx, e.target.value)}
                              className="w-full rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 text-xs text-slate-200 focus:border-indigo-500 focus:outline-none"
                            />
                          </div>

                          <div className="space-y-2">
                            <label className="text-[10px] font-bold tracking-wider text-slate-500 uppercase">
                              Email Body (Editable)
                            </label>
                            <textarea
                              rows={10}
                              value={localEmails[selectedEmailIdx].fullBody}
                              onChange={(e) => handleEmailBodyChange(selectedEmailIdx, e.target.value)}
                              className="w-full rounded-lg border border-slate-800 bg-slate-900 p-3 font-sans text-xs leading-relaxed text-slate-200 focus:border-indigo-500 focus:outline-none"
                            />
                          </div>

                          <div className="flex gap-3">
                            <button
                              onClick={() =>
                                copyToClipboard(
                                  `Subject: ${localEmails[selectedEmailIdx].subject}\n\n${localEmails[selectedEmailIdx].fullBody}`,
                                  `email_${selectedEmailIdx}`
                                )
                              }
                              className="flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800 px-3.5 py-2 text-xs font-semibold text-slate-200 transition-colors hover:bg-slate-700"
                            >
                              {copiedText === `email_${selectedEmailIdx}` ? (
                                <>
                                  <Check className="h-4 w-4 text-emerald-400" /> Copied!
                                </>
                              ) : (
                                <>
                                  <Copy className="h-4 w-4" /> Copy Email
                                </>
                              )}
                            </button>
                            <button
                              onClick={() => handleCrmSync('Cold Email Template', `email_${selectedEmailIdx}`)}
                              disabled={syncingCrm === `email_${selectedEmailIdx}`}
                              className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-3.5 py-2 text-xs font-semibold text-white transition-colors hover:bg-indigo-500 disabled:opacity-50"
                            >
                              {syncingCrm === `email_${selectedEmailIdx}` ? (
                                <RefreshCw className="h-4 w-4 animate-spin" />
                              ) : (
                                <Send className="h-4 w-4" />
                              )}
                              Approve & Sync CRM
                            </button>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Print Display for Cold Emails */}
                    <div className="hidden print:block space-y-6">
                      {localEmails.map((email, idx) => (
                        <div key={idx} className="space-y-2 border-b pb-4">
                          <h4 className="font-bold text-sm">{email.variantName}</h4>
                          <p className="text-xs"><strong>Subject:</strong> {email.subject}</p>
                          <p className="text-xs whitespace-pre-wrap mt-2">{email.fullBody}</p>
                        </div>
                      ))}
                    </div>

                    {/* Follow-Up Sequence */}
                    <div className="space-y-4">
                      <h4 className="text-md font-bold text-slate-200">5-Touch Follow-Up Sequence</h4>
                      <div className="grid gap-4 md:grid-cols-5 print:grid-cols-1">
                        {localFollowUps.map((step, idx) => (
                          <div
                            key={idx}
                            className="flex flex-col justify-between rounded-xl border border-slate-850 bg-slate-950/40 p-4 space-y-3"
                          >
                            <div>
                              <div className="flex items-center justify-between">
                                <span className="rounded-full bg-slate-900 border border-slate-800 px-2 py-0.5 text-[10px] font-bold text-slate-400">
                                  Day {step.day}
                                </span>
                              </div>
                              <div className="mt-2 text-[10px] font-bold text-indigo-400 leading-tight">
                                {step.objective}
                              </div>
                              <textarea
                                value={step.message}
                                onChange={(e) => handleFollowUpChange(idx, e.target.value)}
                                rows={6}
                                className="mt-2.5 w-full bg-transparent text-[11px] leading-relaxed text-slate-400 border-none resize-none focus:outline-none focus:ring-0"
                              />
                            </div>
                            <div className="border-t border-slate-900 pt-2.5 flex items-center justify-between text-[10px] text-slate-500">
                              <span>CTA: &quot;{step.cta}&quot;</span>
                              <button
                                onClick={() => copyToClipboard(step.message, `fup_${idx}`)}
                                className="p-1 hover:text-slate-250 transition-colors"
                              >
                                {copiedText === `fup_${idx}` ? (
                                  <CheckCircle className="h-3.5 w-3.5 text-emerald-400" />
                                ) : (
                                  <Copy className="h-3.5 w-3.5" />
                                )}
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* 2. Campaigns Builder Tab */}
                {(activeTab === 'campaigns' || typeof window === 'undefined') && (
                  <div className="space-y-6 print:block">
                    <h3 className="mb-4 hidden border-b pb-2 text-lg font-bold print:block">
                      Multi-Channel Outbound Campaign Schedule
                    </h3>
                    <div className="space-y-4">
                      {report.campaigns?.map((step, idx) => {
                        let channelColor = 'text-blue-400 bg-blue-950/20 border-blue-900/30';
                        if (step.channel.toLowerCase() === 'linkedin') {
                          channelColor = 'text-sky-400 bg-sky-950/20 border-sky-900/30';
                        } else if (step.channel.toLowerCase() === 'phone') {
                          channelColor = 'text-amber-400 bg-amber-950/20 border-amber-900/30';
                        } else if (step.channel.toLowerCase() === 'follow-up') {
                          channelColor = 'text-emerald-400 bg-emerald-950/20 border-emerald-900/30';
                        }

                        return (
                          <div
                            key={idx}
                            className="flex flex-col md:flex-row md:items-center justify-between gap-4 rounded-xl border border-slate-800 bg-slate-950/40 p-5 print:border-none print:p-0"
                          >
                            <div className="flex items-start gap-4">
                              <div className="flex flex-col items-center justify-center rounded-lg border border-slate-800 bg-slate-900 p-2.5 w-16 shrink-0 print:border-none print:p-0">
                                <span className="text-[10px] font-bold text-slate-500 uppercase">Touch</span>
                                <span className="text-sm font-bold text-white print:text-black">{step.timeline}</span>
                              </div>
                              <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                  <span className={`rounded border px-2 py-0.5 text-[9px] font-bold uppercase ${channelColor}`}>
                                    {step.channel}
                                  </span>
                                  <h4 className="text-xs font-semibold text-slate-400 uppercase">
                                    {step.objective}
                                  </h4>
                                </div>
                                <p className="text-sm font-bold text-slate-200 print:text-black">
                                  {step.messageTheme}
                                </p>
                              </div>
                            </div>
                            <div className="border-t border-slate-900 md:border-t-0 pt-3 md:pt-0 text-left md:text-right shrink-0">
                              <span className="text-[10px] font-bold tracking-wider text-slate-500 uppercase">
                                Target CTA Action
                              </span>
                              <p className="text-xs text-indigo-400 font-medium mt-0.5 print:text-slate-700">
                                {step.cta}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* LinkedIn Message Panel */}
                    <div className="mt-8 border-t border-slate-800 pt-6 space-y-4">
                      <h4 className="text-md font-bold text-slate-250 flex items-center gap-2">
                        <MessageSquare className="h-4.5 w-4.5 text-sky-400" /> LinkedIn Outreach Scripts
                      </h4>
                      <div className="grid gap-4 md:grid-cols-2 print:grid-cols-1">
                        {report.linkedInMessages?.map((msg, idx) => (
                          <div key={idx} className="rounded-xl border border-slate-900 bg-slate-950/60 p-4 space-y-2">
                            <div className="flex items-center justify-between border-b border-slate-900 pb-2">
                              <span className="text-xs font-bold text-sky-400">{msg.type}</span>
                              <button
                                onClick={() => copyToClipboard(msg.message, `ln_${idx}`)}
                                className="text-slate-500 hover:text-slate-350"
                              >
                                {copiedText === `ln_${idx}` ? (
                                  <CheckCircle className="h-4 w-4 text-emerald-400" />
                                ) : (
                                  <Copy className="h-4 w-4" />
                                )}
                              </button>
                            </div>
                            <p className="text-xs text-slate-400 leading-relaxed print:text-slate-700">
                              {msg.message}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* 3. Persona Explorer Tab */}
                {(activeTab === 'personas' || typeof window === 'undefined') && (
                  <div className="space-y-6 print:block">
                    <h3 className="mb-4 hidden border-b pb-2 text-lg font-bold print:block">
                      Target Stakeholder Persona Maps
                    </h3>
                    <div className="grid gap-6 md:grid-cols-2 print:grid-cols-1">
                      {report.targetPersonas?.map((persona, idx) => {
                        let influenceColor = 'text-blue-400 bg-blue-950/20 border-blue-900/30';
                        if (persona.decisionInfluence?.toLowerCase() === 'high') {
                          influenceColor = 'text-rose-400 bg-rose-950/20 border-rose-900/30';
                        } else if (persona.decisionInfluence?.toLowerCase() === 'medium') {
                          influenceColor = 'text-amber-400 bg-amber-950/20 border-amber-900/30';
                        }

                        return (
                          <div
                            key={idx}
                            className="rounded-xl border border-slate-800 bg-slate-955/40 p-5 space-y-4 print:border-none print:p-0"
                          >
                            <div className="flex items-center justify-between border-b border-slate-900 pb-3">
                              <h4 className="text-sm font-bold text-white print:text-black">
                                {persona.role}
                              </h4>
                              <span className={`rounded border px-2.5 py-0.5 text-[9px] font-bold uppercase ${influenceColor}`}>
                                {persona.decisionInfluence} Influence
                              </span>
                            </div>

                            <div className="space-y-3 text-xs">
                              <div>
                                <span className="font-semibold text-slate-500">Business Priorities:</span>
                                <ul className="list-disc pl-4 mt-1 space-y-1 text-slate-400">
                                  {persona.priorities?.map((p, i) => <li key={i}>{p}</li>)}
                                </ul>
                              </div>

                              <div>
                                <span className="font-semibold text-slate-500">Key Challenges:</span>
                                <ul className="list-disc pl-4 mt-1 space-y-1 text-slate-400">
                                  {persona.likelyChallenges?.map((c, i) => <li key={i}>{c}</li>)}
                                </ul>
                              </div>

                              <div className="border-t border-slate-900 pt-3">
                                <span className="font-semibold text-indigo-400">Preferred Messaging Theme:</span>
                                <p className="mt-1 text-slate-400 leading-relaxed italic">
                                  &quot;{persona.preferredMessaging}&quot;
                                </p>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* 4. Call Preparation Tab */}
                {(activeTab === 'callPrep' || typeof window === 'undefined') && (
                  <div className="space-y-6 print:block">
                    <h3 className="mb-4 hidden border-b pb-2 text-lg font-bold print:block">
                      Discovery Call Preparation Brief
                    </h3>

                    {report.discoveryCallPlan && (
                      <div className="space-y-6">
                        <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-5 space-y-2">
                          <h4 className="text-xs font-bold text-indigo-400 uppercase tracking-wider">
                            Call Objective
                          </h4>
                          <p className="text-sm font-bold text-white leading-normal print:text-black">
                            {report.discoveryCallPlan.callObjective}
                          </p>
                        </div>

                        <div className="grid gap-6 md:grid-cols-2">
                          <div className="rounded-xl border border-slate-900 bg-slate-950/60 p-4 space-y-2">
                            <span className="text-[10px] font-bold tracking-wider text-slate-500 uppercase">
                              Agenda Steps
                            </span>
                            <ul className="list-decimal pl-4 text-xs text-slate-400 space-y-2">
                              {report.discoveryCallPlan.agenda?.map((step, idx) => <li key={idx}>{step}</li>)}
                            </ul>
                          </div>

                          <div className="rounded-xl border border-slate-900 bg-slate-950/60 p-4 space-y-2">
                            <span className="text-[10px] font-bold tracking-wider text-slate-500 uppercase">
                              Qualification Questions
                            </span>
                            <ul className="list-disc pl-4 text-xs text-slate-400 space-y-2">
                              {report.discoveryCallPlan.qualificationQuestions?.map((q, idx) => (
                                <li key={idx} className="leading-relaxed">{q}</li>
                              ))}
                            </ul>
                          </div>
                        </div>

                        <div className="grid gap-6 md:grid-cols-2">
                          <div className="rounded-xl border border-slate-900 bg-slate-950/60 p-4 space-y-2">
                            <span className="text-[10px] font-bold tracking-wider text-slate-500 uppercase">
                              Discovery Questions
                            </span>
                            <ul className="list-disc pl-4 text-xs text-slate-400 space-y-2">
                              {report.discoveryCallPlan.discoveryQuestions?.map((q, idx) => (
                                <li key={idx} className="leading-relaxed">{q}</li>
                              ))}
                            </ul>
                          </div>

                          <div className="rounded-xl border border-slate-900 bg-slate-950/60 p-4 space-y-2">
                            <span className="text-[10px] font-bold tracking-wider text-slate-500 uppercase">
                              Deep Pain Exploration
                            </span>
                            <ul className="list-disc pl-4 text-xs text-slate-400 space-y-2">
                              {report.discoveryCallPlan.painPointQuestions?.map((q, idx) => (
                                <li key={idx} className="leading-relaxed">{q}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* 5. Objection Library Tab */}
                {(activeTab === 'objections' || typeof window === 'undefined') && (
                  <div className="space-y-6 print:block">
                    <h3 className="mb-4 hidden border-b pb-2 text-lg font-bold print:block">
                      Objection Handling Library
                    </h3>
                    <div className="grid gap-4 md:grid-cols-2 print:grid-cols-1">
                      {report.objections?.map((obj, idx) => (
                        <div
                          key={idx}
                          className="rounded-xl border border-slate-800 bg-slate-950/40 p-5 space-y-3 print:border-none print:p-0"
                        >
                          <div className="flex items-center gap-2 border-b border-slate-900 pb-2">
                            <ShieldAlert className="h-4 w-4 text-rose-400 shrink-0" />
                            <h4 className="text-sm font-bold text-slate-200 print:text-black">
                              Objection: &quot;{obj.objection}&quot;
                            </h4>
                          </div>

                          <div className="space-y-2 text-xs">
                            <div className="bg-slate-900/60 rounded-lg p-3 border-l-2 border-emerald-500 text-slate-350 leading-relaxed print:bg-transparent print:border-none print:p-0">
                              <span className="font-bold text-emerald-400 block mb-1">Recommended Response:</span>
                              <p className="italic">&quot;{obj.recommendedResponse}&quot;</p>
                            </div>
                            <p className="text-[10px] text-slate-500 leading-normal">
                              <span className="font-bold uppercase tracking-wider">Rationale:</span>{' '}
                              {obj.rationale}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 6. Summary Tab */}
                {(activeTab === 'summary' || typeof window === 'undefined') && (
                  <div className="space-y-6 print:block">
                    <h3 className="mb-4 hidden border-b pb-2 text-lg font-bold print:block">
                      Outreach Campaign Strategy Brief
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-xs font-semibold tracking-wider text-slate-400 uppercase">
                          Executive Outlook
                        </h4>
                        <p className="mt-2.5 text-sm leading-relaxed text-slate-300 print:text-slate-700">
                          {report.executiveSummary}
                        </p>
                      </div>

                      <div className="space-y-4 border-t border-slate-800/80 pt-6">
                        <h4 className="text-xs font-semibold tracking-wider text-slate-400 uppercase">
                          Messaging Framework Themes
                        </h4>
                        <div className="grid gap-4 md:grid-cols-2 print:grid-cols-1">
                          {report.messagingStrategy?.map((theme, idx) => (
                            <div
                              key={idx}
                              className="rounded-xl border border-slate-800 bg-slate-950/40 p-4 space-y-2 print:border-none print:p-0"
                            >
                              <div className="flex items-center justify-between">
                                <strong className="text-sm text-indigo-300 print:text-black">
                                  {theme.messageTheme}
                                </strong>
                              </div>
                              <div className="text-xs text-slate-400">
                                <span className="font-semibold text-slate-500">Target Segment:</span>{' '}
                                {theme.audience}
                              </div>
                              <div className="text-xs text-slate-400">
                                <span className="font-semibold text-slate-500">Business Value:</span>{' '}
                                {theme.businessValue}
                              </div>
                              <div className="border-t border-slate-900 pt-2 text-xs text-slate-400 italic">
                                <span className="font-semibold text-indigo-400">Call To Action:</span>{' '}
                                {theme.callToAction}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
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

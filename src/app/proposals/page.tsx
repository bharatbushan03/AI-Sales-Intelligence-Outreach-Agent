'use client';

import React, { useState, useEffect } from 'react';
import {
  FileText,
  TrendingUp,
  Clock,
  Bot,
  RefreshCw,
  ShieldAlert,
  ClipboardList,
  Eye,
  Download,
  Calendar,
  Layers,
  Presentation,
  CheckCircle,
  Edit2,
  Save,
  ChevronLeft,
  ChevronRight,
  FileCode,
  Sparkles,
} from 'lucide-react';
import { ProposalPackage } from '@/agents/specialists/proposal/types';

type ActiveTab = 'proposal' | 'businessCase' | 'roi' | 'roadmap' | 'slides';

export default function ProposalsWorkspace() {
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState<ActiveTab>('proposal');

  // Search query for generating proposals
  const [query, setQuery] = useState('');

  // History list and selected proposal
  const [history, setHistory] = useState<ProposalPackage[]>([]);
  const [selectedProposal, setSelectedProposal] = useState<ProposalPackage | null>(null);

  // Edit mode state
  const [editMode, setEditMode] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editSubtitle, setEditSubtitle] = useState('');
  const [editExecSummary, setEditExecSummary] = useState('');
  const [editProposedSolution, setEditProposedSolution] = useState('');

  // Interactive ROI Calculator states
  const [calcInvestment, setCalcInvestment] = useState(25000);
  const [calcSavings, setCalcSavings] = useState(75000);
  const [calcRevenue, setCalcRevenue] = useState(150000);
  const [calcPayback, setCalcPayback] = useState('6 months');

  // Slide navigator index
  const [activeSlideIdx, setActiveSlideIdx] = useState(0);

  const fetchProposalsHistory = async (): Promise<ProposalPackage[]> => {
    try {
      const res = await fetch('/api/proposals');
      const data = await res.json();
      if (data.success && data.data) {
        return data.data;
      }
    } catch (err) {
      console.error('Failed to load proposals ledger', err);
    }
    return [];
  };

  const applySelectedProposal = (proposal: ProposalPackage | null) => {
    setSelectedProposal(proposal);
    if (proposal) {
      setEditTitle(proposal.proposal.coverPage.title);
      setEditSubtitle(proposal.proposal.coverPage.subtitle);
      setEditExecSummary(proposal.proposal.executiveSummary);
      setEditProposedSolution(proposal.proposal.proposedSolution);

      setCalcInvestment(proposal.roiAnalysis.estimatedInvestment);
      setCalcSavings(proposal.roiAnalysis.projectedSavings);
      setCalcRevenue(proposal.roiAnalysis.projectedRevenueImpact);
      setCalcPayback(proposal.roiAnalysis.paybackPeriod);
      setActiveSlideIdx(0);
    }
  };

  useEffect(() => {
    let active = true;
    fetchProposalsHistory().then((list) => {
      if (active) {
        setHistory(list);
        if (list.length > 0) {
          applySelectedProposal(list[0]);
        }
        setLoading(false);
      }
    });
    return () => {
      active = false;
    };
  }, []);

  const handleGenerateProposal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setGenerating(true);
    try {
      const res = await fetch('/api/proposals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: query.trim() }),
      });

      const data = await res.json();
      if (res.ok && data.success && data.data) {
        const newPackage = data.data as ProposalPackage;
        setQuery('');
        const updatedList = await fetchProposalsHistory();
        setHistory(updatedList);
        applySelectedProposal(newPackage);
        alert(`Enterprise proposal for "${newPackage.metadata.companyName}" generated and saved successfully!`);
      } else {
        throw new Error(data.error || 'Failed to complete proposal generation.');
      }
    } catch (err) {
      console.error(err);
      alert(`Pipeline error: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setGenerating(false);
    }
  };

  // ROI Calculator live formulas
  const totalFinancialBenefit = calcSavings + calcRevenue;
  const netProfit = totalFinancialBenefit - calcInvestment;
  const calculatedRoiPct = calcInvestment > 0 ? Math.round((netProfit / calcInvestment) * 100) : 0;

  // Save edits locally
  const handleSaveEdits = () => {
    if (!selectedProposal) return;

    const updated: ProposalPackage = {
      ...selectedProposal,
      proposal: {
        ...selectedProposal.proposal,
        coverPage: {
          ...selectedProposal.proposal.coverPage,
          title: editTitle,
          subtitle: editSubtitle,
        },
        executiveSummary: editExecSummary,
        proposedSolution: editProposedSolution,
      },
      roiAnalysis: {
        ...selectedProposal.roiAnalysis,
        estimatedInvestment: calcInvestment,
        projectedSavings: calcSavings,
        projectedRevenueImpact: calcRevenue,
        paybackPeriod: calcPayback,
        roiPercentage: calculatedRoiPct,
      },
    };

    setSelectedProposal(updated);
    setHistory((prev) => prev.map((item) => (item.id === selectedProposal.id ? updated : item)));
    setEditMode(false);
  };

  // Export to Markdown
  const handleExportMarkdown = () => {
    if (!selectedProposal) return;
    const { proposal, businessCase, roiAnalysis, metadata } = selectedProposal;

    const mdContent = `# ${proposal.coverPage.title}
## ${proposal.coverPage.subtitle}

**Prepared for:** ${proposal.coverPage.preparedFor}
**Prepared by:** ${proposal.coverPage.preparedBy}
**Date:** ${proposal.coverPage.date}

---

## 1. Executive Summary
${proposal.executiveSummary}

## 2. Company Understanding & Challenges Identified
${proposal.companyUnderstanding}

### Challenges:
${proposal.challengesIdentified.map((c) => `* ${c}`).join('\n')}

## 3. Proposed Solution Architecture
${proposal.proposedSolution}

### Expected Outcomes:
${proposal.expectedOutcomes.map((o) => `* ${o}`).join('\n')}

## 4. Business Case Justification
*   **Current State:** ${businessCase.currentState}
*   **Future State:** ${businessCase.futureState}
*   **Business Impact:** ${businessCase.businessImpact}

## 5. Financial ROI Analysis
*   **Estimated Setup Investment:** $${roiAnalysis.estimatedInvestment.toLocaleString()}
*   **Projected Operational Savings:** $${roiAnalysis.projectedSavings.toLocaleString()}
*   **Projected Revenue Uplift Impact:** $${roiAnalysis.projectedRevenueImpact.toLocaleString()}
*   **Net Projected Benefit:** $${(roiAnalysis.projectedSavings + roiAnalysis.projectedRevenueImpact - roiAnalysis.estimatedInvestment).toLocaleString()}
*   **Payback Timeframe Window:** ${roiAnalysis.paybackPeriod}
*   **ROI Percentage Return:** ${roiAnalysis.roiPercentage}%

### Financial Assumptions:
${roiAnalysis.assumptions.map((a) => `* ${a}`).join('\n')}
`;

    const blob = new Blob([mdContent], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `proposal_${metadata.companyName.toLowerCase()}_draft.md`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Export to DOCX Schema (JSON Representation download)
  const handleExportDocxSchema = () => {
    if (!selectedProposal) return;
    const blob = new Blob([JSON.stringify(selectedProposal, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `proposal_${selectedProposal.metadata.companyName.toLowerCase()}_docx_schema.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Print styled layout (Trigger window.print)
  const handleTriggerPrint = () => {
    window.print();
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-emerald-400 border-emerald-950 bg-emerald-950/20';
    if (score >= 80) return 'text-indigo-400 border-indigo-950 bg-indigo-950/20';
    return 'text-amber-400 border-amber-950 bg-amber-950/20';
  };

  return (
    <div className="space-y-8 text-slate-100 print:bg-white print:text-black">
      {/* Header Panel */}
      <div className="flex flex-col justify-between gap-4 border-b border-slate-800 pb-5 md:flex-row md:items-center print:hidden">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white md:text-4xl">
            Enterprise Proposal Workspace
          </h1>
          <p className="mt-2 text-sm text-slate-400">
            Generate Bain & Deloitte-tier proposals, model customized financial ROI, map roadmap deliverables, and compile pitch presentations.
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <form onSubmit={handleGenerateProposal} className="flex gap-2">
            <input
              type="text"
              required
              disabled={generating}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g. stripe.com or Notion"
              className="rounded-xl border border-slate-800 bg-slate-900 px-4 py-2.5 text-xs font-medium text-slate-200 focus:border-indigo-500 focus:outline-none disabled:opacity-50 w-48 sm:w-60"
            />
            <button
              type="submit"
              disabled={generating || !query.trim()}
              className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-indigo-500 disabled:opacity-50"
            >
              {generating ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
              {generating ? 'Compiling...' : 'Build Proposal'}
            </button>
          </form>
        </div>
      </div>

      {loading && (
        <div className="flex flex-col items-center justify-center p-16 space-y-4 rounded-2xl border border-slate-800 bg-slate-900/10 print:hidden">
          <Bot className="h-10 w-10 animate-bounce text-indigo-400" />
          <p className="text-sm text-slate-400">Retrieving proposal dossiers from ledger database...</p>
        </div>
      )}

      {!loading && !selectedProposal && (
        <div className="flex flex-col items-center justify-center p-16 space-y-4 rounded-2xl border border-slate-850 bg-slate-900/10 text-center print:hidden">
          <FileText className="h-12 w-12 text-slate-600" />
          <h3 className="text-md font-bold text-slate-300">No Proposals Generated Yet</h3>
          <p className="text-xs text-slate-500 max-w-sm">
            Enter a domain name in the build search bar above to trigger the autonomous multi-agent proposal synthesis pipeline.
          </p>
        </div>
      )}

      {!loading && selectedProposal && (
        <div className="grid gap-6 lg:grid-cols-4 print:grid-cols-1">
          {/* Main workspace panel */}
          <div className="space-y-6 lg:col-span-3 print:col-span-1">
            {/* Header controls (Print, Export, Edit, Save) */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-850 pb-4 print:hidden">
              <div className="flex gap-2 overflow-x-auto pb-1">
                {[
                  { id: 'proposal', label: 'Proposal Builder', icon: FileText },
                  { id: 'businessCase', label: 'Business Case', icon: Layers },
                  { id: 'roi', label: 'ROI Calculator', icon: TrendingUp },
                  { id: 'roadmap', label: 'Roadmap Viewer', icon: Clock },
                  { id: 'slides', label: 'Presentation Pitch', icon: Presentation },
                ].map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => {
                        setActiveTab(tab.id as ActiveTab);
                        setEditMode(false);
                      }}
                      className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-semibold whitespace-nowrap transition-all border ${
                        activeTab === tab.id
                          ? 'border-indigo-500 bg-indigo-600/15 text-indigo-400'
                          : 'border-slate-800 bg-slate-900/40 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      {tab.label}
                    </button>
                  );
                })}
              </div>

              <div className="flex items-center gap-2">
                {activeTab === 'proposal' && (
                  <>
                    {!editMode ? (
                      <button
                        onClick={() => setEditMode(true)}
                        className="flex items-center gap-1.5 rounded-xl border border-slate-750 bg-slate-800 px-3 py-1.8 text-xs font-medium text-slate-200 hover:bg-slate-700"
                      >
                        <Edit2 className="h-3.5 w-3.5" /> Edit Section
                      </button>
                    ) : (
                      <button
                        onClick={handleSaveEdits}
                        className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-3 py-1.8 text-xs font-semibold text-white hover:bg-emerald-500"
                      >
                        <Save className="h-3.5 w-3.5" /> Save Edits
                      </button>
                    )}
                  </>
                )}

                <button
                  onClick={handleTriggerPrint}
                  className="flex items-center gap-1.5 rounded-xl border border-slate-750 bg-slate-800 px-3 py-1.8 text-xs font-medium text-slate-200 hover:bg-slate-700"
                >
                  <Eye className="h-3.5 w-3.5" /> Print/PDF
                </button>
                <div className="relative group">
                  <button className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-3 py-1.8 text-xs font-semibold text-white hover:bg-indigo-500">
                    <Download className="h-3.5 w-3.5" /> Export
                  </button>
                  <div className="absolute right-0 top-full mt-1.5 hidden group-hover:block z-10 w-40 rounded-xl border border-slate-800 bg-slate-950 p-2 shadow-xl">
                    <button
                      onClick={handleExportMarkdown}
                      className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.8 text-left text-xs text-slate-300 hover:bg-slate-900"
                    >
                      <FileText className="h-3.5 w-3.5 text-indigo-400" /> Markdown (.md)
                    </button>
                    <button
                      onClick={handleExportDocxSchema}
                      className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.8 text-left text-xs text-slate-300 hover:bg-slate-900"
                    >
                      <FileCode className="h-3.5 w-3.5 text-purple-400" /> DOCX Schema (.json)
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* TAB VIEWS */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/10 p-6 md:p-8 print:border-none print:p-0">
              
              {/* Cover Page Details (Shared across proposal view) */}
              {activeTab === 'proposal' && (
                <div className="space-y-6">
                  {/* Cover Page */}
                  <div className="rounded-2xl border border-slate-800 bg-slate-950/40 p-8 text-center space-y-4 print:border-slate-200 print:text-black">
                    {!editMode ? (
                      <>
                        <h2 className="text-xl md:text-3xl font-extrabold tracking-tight text-white print:text-black">
                          {selectedProposal.proposal.coverPage.title}
                        </h2>
                        <p className="text-sm text-slate-400 max-w-xl mx-auto leading-relaxed print:text-gray-700">
                          {selectedProposal.proposal.coverPage.subtitle}
                        </p>
                      </>
                    ) : (
                      <div className="space-y-3 max-w-xl mx-auto text-left">
                        <div className="space-y-1">
                          <label className="text-[10px] text-slate-500 font-bold uppercase">Proposal Title</label>
                          <input
                            type="text"
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                            className="w-full rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 text-xs text-slate-250 focus:border-indigo-500 focus:outline-none"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] text-slate-500 font-bold uppercase">Proposal Subtitle</label>
                          <textarea
                            rows={2}
                            value={editSubtitle}
                            onChange={(e) => setEditSubtitle(e.target.value)}
                            className="w-full rounded-lg border border-slate-800 bg-slate-900 p-3 text-xs text-slate-250 focus:border-indigo-500 focus:outline-none"
                          />
                        </div>
                      </div>
                    )}

                    <div className="border-t border-slate-900 pt-6 grid grid-cols-2 gap-4 text-xs max-w-md mx-auto text-slate-450 print:border-gray-200">
                      <div>
                        <div className="font-semibold text-slate-500 uppercase tracking-wider text-[10px]">Prepared For</div>
                        <div className="font-bold text-slate-200 mt-1 print:text-black">{selectedProposal.proposal.coverPage.preparedFor}</div>
                      </div>
                      <div>
                        <div className="font-semibold text-slate-500 uppercase tracking-wider text-[10px]">Prepared By</div>
                        <div className="font-bold text-slate-200 mt-1 print:text-black">{selectedProposal.proposal.coverPage.preparedBy}</div>
                      </div>
                      <div className="col-span-2 pt-2">
                        <div className="font-semibold text-slate-500 uppercase tracking-wider text-[10px]">Date Generated</div>
                        <div className="font-bold text-indigo-400 mt-0.5 font-mono print:text-black">{selectedProposal.proposal.coverPage.date}</div>
                      </div>
                    </div>
                  </div>

                  {/* Sections */}
                  <div className="space-y-6 pt-4 text-xs md:text-sm">
                    {/* Executive Summary Section */}
                    <div className="space-y-2">
                      <h3 className="text-md font-bold text-indigo-400 uppercase tracking-wider">1. Executive Summary</h3>
                      {!editMode ? (
                        <p className="text-slate-350 leading-relaxed print:text-black">{selectedProposal.proposal.executiveSummary}</p>
                      ) : (
                        <textarea
                          rows={4}
                          value={editExecSummary}
                          onChange={(e) => setEditExecSummary(e.target.value)}
                          className="w-full rounded-lg border border-slate-800 bg-slate-900 p-3 text-xs text-slate-250 focus:border-indigo-500 focus:outline-none"
                        />
                      )}
                    </div>

                    {/* Understanding & Challenges */}
                    <div className="space-y-3">
                      <h3 className="text-md font-bold text-indigo-400 uppercase tracking-wider">2. Client Context & Challenges</h3>
                      <p className="text-slate-350 leading-relaxed print:text-black">{selectedProposal.proposal.companyUnderstanding}</p>
                      <div className="rounded-xl border border-slate-850 bg-slate-950/20 p-4 space-y-2">
                        <div className="font-bold text-slate-400 uppercase tracking-wider text-[9px]">Key Friction Points Identified:</div>
                        <ul className="list-disc pl-5 space-y-1.5 text-slate-350 print:text-black">
                          {selectedProposal.proposal.challengesIdentified.map((challenge, idx) => (
                            <li key={idx}>{challenge}</li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Proposed Solution */}
                    <div className="space-y-3">
                      <h3 className="text-md font-bold text-indigo-400 uppercase tracking-wider">3. Proposed Solution Architecture</h3>
                      {!editMode ? (
                        <p className="text-slate-350 leading-relaxed print:text-black">{selectedProposal.proposal.proposedSolution}</p>
                      ) : (
                        <textarea
                          rows={4}
                          value={editProposedSolution}
                          onChange={(e) => setEditProposedSolution(e.target.value)}
                          className="w-full rounded-lg border border-slate-800 bg-slate-900 p-3 text-xs text-slate-250 focus:border-indigo-500 focus:outline-none"
                        />
                      )}
                      <div className="grid gap-4 md:grid-cols-2 pt-2">
                        <div className="rounded-xl border border-slate-850 bg-slate-950/20 p-4 space-y-2">
                          <div className="font-bold text-emerald-400 uppercase tracking-wider text-[9px]">Expected Performance Outcomes:</div>
                          <ul className="list-disc pl-5 space-y-1 text-slate-400 print:text-black">
                            {selectedProposal.proposal.expectedOutcomes.map((o, idx) => <li key={idx}>{o}</li>)}
                          </ul>
                        </div>
                        <div className="rounded-xl border border-slate-850 bg-slate-950/20 p-4 space-y-2">
                          <div className="font-bold text-rose-400 uppercase tracking-wider text-[9px]">Risks & Mitigation Framework:</div>
                          <div className="space-y-2 text-xs">
                            {selectedProposal.proposal.risksMitigation.map((item, idx) => (
                              <div key={idx} className="border-l-2 border-rose-900/50 pl-2">
                                <span className="font-bold text-slate-300 print:text-black">{item.risk}: </span>
                                <span className="text-slate-500 print:text-gray-700">{item.mitigation}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* ROI Summary & Roadmap Summary */}
                    <div className="grid gap-6 md:grid-cols-2 pt-4">
                      <div className="space-y-2">
                        <h4 className="font-bold text-slate-300 uppercase tracking-wider text-[11px]">4. Financial Model Summary</h4>
                        <p className="text-slate-400 leading-relaxed print:text-black">{selectedProposal.proposal.roiAnalysisSummary}</p>
                      </div>
                      <div className="space-y-2">
                        <h4 className="font-bold text-slate-300 uppercase tracking-wider text-[11px]">5. Next Steps Alignment</h4>
                        <ul className="list-decimal pl-5 space-y-1 text-slate-400 print:text-black">
                          {selectedProposal.proposal.nextSteps.map((s, idx) => <li key={idx}>{s}</li>)}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Business Case */}
              {activeTab === 'businessCase' && (
                <div className="space-y-6">
                  <h3 className="text-md font-bold text-indigo-400 uppercase tracking-wider">McKinsey-tier Strategic Business Case</h3>
                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="rounded-xl border border-slate-800 bg-slate-950/30 p-5 space-y-2 print:border-slate-200">
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Baseline Operations (Current State)</h4>
                      <p className="text-xs text-slate-300 leading-relaxed print:text-black">{selectedProposal.businessCase.currentState}</p>
                    </div>
                    <div className="rounded-xl border border-slate-800 bg-slate-950/30 p-5 space-y-2 print:border-slate-200">
                      <h4 className="text-xs font-bold text-indigo-400 uppercase tracking-widest">Optimized Benchmark (Future State)</h4>
                      <p className="text-xs text-slate-300 leading-relaxed print:text-black">{selectedProposal.businessCase.futureState}</p>
                    </div>
                  </div>

                  <div className="rounded-xl border border-slate-800 bg-slate-950/10 p-5 space-y-4 print:border-slate-200">
                    <div className="space-y-1">
                      <h4 className="text-xs font-bold text-slate-350 uppercase">Business Friction Challenges</h4>
                      <ul className="list-disc pl-5 text-xs text-slate-400 space-y-1 print:text-black">
                        {selectedProposal.businessCase.challenges.map((c, i) => <li key={i}>{c}</li>)}
                      </ul>
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-xs font-bold text-slate-350 uppercase">Strategic Implication</h4>
                      <p className="text-xs text-slate-400 leading-relaxed print:text-black">{selectedProposal.businessCase.businessImpact}</p>
                    </div>
                    <div className="space-y-2">
                      <h4 className="text-xs font-bold text-emerald-400 uppercase">Competitive Advantages Realized</h4>
                      <div className="grid gap-3 sm:grid-cols-2 text-xs">
                        {selectedProposal.businessCase.strategicBenefits.map((b, i) => (
                          <div key={i} className="flex gap-2 items-start border-l border-emerald-950 bg-emerald-950/5 p-2 rounded-lg print:border-slate-200">
                            <CheckCircle className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                            <span className="text-slate-400 print:text-black">{b}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ROI Calculator */}
              {activeTab === 'roi' && (
                <div className="space-y-6">
                  <h3 className="text-md font-bold text-indigo-400 uppercase tracking-wider">Interactive Financial ROI Projections</h3>
                  <div className="grid gap-6 md:grid-cols-3 print:grid-cols-3">
                    <div className="rounded-xl border border-slate-800 bg-slate-950/20 p-5 space-y-1 print:border-slate-200">
                      <span className="text-[10px] text-slate-500 font-bold uppercase">Estimated Investment</span>
                      <div className="text-2xl font-bold text-white print:text-black">${calcInvestment.toLocaleString()}</div>
                      <input
                        type="range"
                        min={10000}
                        max={250000}
                        step={5000}
                        value={calcInvestment}
                        onChange={(e) => setCalcInvestment(Number(e.target.value))}
                        className="w-full mt-2 accent-indigo-500 print:hidden"
                      />
                    </div>
                    <div className="rounded-xl border border-slate-800 bg-slate-950/20 p-5 space-y-1 print:border-slate-200">
                      <span className="text-[10px] text-slate-500 font-bold uppercase">Projected Operational Savings</span>
                      <div className="text-2xl font-bold text-white print:text-black">${calcSavings.toLocaleString()}</div>
                      <input
                        type="range"
                        min={20000}
                        max={500000}
                        step={5000}
                        value={calcSavings}
                        onChange={(e) => setCalcSavings(Number(e.target.value))}
                        className="w-full mt-2 accent-indigo-500 print:hidden"
                      />
                    </div>
                    <div className="rounded-xl border border-slate-800 bg-slate-950/20 p-5 space-y-1 print:border-slate-200">
                      <span className="text-[10px] text-slate-500 font-bold uppercase">Projected Revenue Impact</span>
                      <div className="text-2xl font-bold text-white print:text-black">${calcRevenue.toLocaleString()}</div>
                      <input
                        type="range"
                        min={50000}
                        max={1000000}
                        step={10000}
                        value={calcRevenue}
                        onChange={(e) => setCalcRevenue(Number(e.target.value))}
                        className="w-full mt-2 accent-indigo-500 print:hidden"
                      />
                    </div>
                  </div>

                  {/* Calculator outcomes */}
                  <div className="grid gap-6 md:grid-cols-2 pt-4">
                    <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-6 space-y-4 print:border-slate-200">
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Financial Yield Modeling</h4>
                      <div className="space-y-2 text-xs">
                        <div className="flex justify-between border-b border-slate-900 pb-2 print:border-slate-250">
                          <span className="text-slate-500">Gross 12-Month Financial Yield:</span>
                          <span className="font-bold text-slate-200 print:text-black">${totalFinancialBenefit.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between border-b border-slate-900 pb-2 print:border-slate-250">
                          <span className="text-slate-500">Net 12-Month Profit Value:</span>
                          <span className="font-bold text-emerald-400">${netProfit.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between border-b border-slate-900 pb-2 print:border-slate-250">
                          <span className="text-slate-500">Calculated ROI Percentage:</span>
                          <span className="font-bold text-indigo-400 font-mono">{calculatedRoiPct}%</span>
                        </div>
                        <div className="flex justify-between pt-1">
                          <span className="text-slate-500">Payback Period Timeframe:</span>
                          <input
                            type="text"
                            value={calcPayback}
                            onChange={(e) => setCalcPayback(e.target.value)}
                            className="bg-transparent text-right font-bold text-slate-200 focus:outline-none border-b border-slate-850 text-xs w-24"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="rounded-xl border border-slate-800 bg-slate-950/10 p-6 space-y-3 print:border-slate-200">
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Calculated Assumptions</h4>
                      <ul className="list-disc pl-5 text-xs text-slate-400 space-y-1.5 print:text-black">
                        {selectedProposal.roiAnalysis.assumptions.map((ass, i) => (
                          <li key={i}>{ass}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {/* Roadmap Viewer */}
              {activeTab === 'roadmap' && (
                <div className="space-y-6">
                  <h3 className="text-md font-bold text-indigo-400 uppercase tracking-wider">Implementation Delivery Roadmap</h3>
                  {/* Horizontal Phase Grid */}
                  <div className="grid gap-4 md:grid-cols-4 print:grid-cols-2">
                    {selectedProposal.implementationRoadmap.map((phase, idx) => (
                      <div key={idx} className="rounded-xl border border-slate-850 bg-slate-950/30 p-5 space-y-3 flex flex-col justify-between print:border-slate-200">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between border-b border-slate-900 pb-2 print:border-slate-250">
                            <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider font-mono">{phase.timeline}</span>
                            <span className="rounded bg-slate-900 border border-slate-800 text-slate-500 px-1.5 py-0.2 text-[8px] font-bold">
                              Phase {idx + 1}
                            </span>
                          </div>
                          <h4 className="text-xs font-bold text-white leading-snug print:text-black">{phase.phase}</h4>
                          <p className="text-[10px] text-slate-400 leading-normal line-clamp-3">{phase.objectives}</p>
                        </div>

                        <div className="space-y-2 pt-2 border-t border-slate-900/50 print:border-slate-250">
                          <div className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">Deliverables:</div>
                          <ul className="list-disc pl-3 text-[9px] text-slate-500 space-y-0.5 leading-tight print:text-gray-700">
                            {phase.deliverables.map((del, i) => <li key={i} className="truncate">{del}</li>)}
                          </ul>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Presentation Outlines */}
              {activeTab === 'slides' && (
                <div className="space-y-6">
                  <h3 className="text-md font-bold text-indigo-400 uppercase tracking-wider">Sales Presentation Slide Outline</h3>
                  
                  {/* Slide Container (Mock presentation preview) */}
                  <div className="grid gap-6 md:grid-cols-3">
                    <div className="md:col-span-2 space-y-4">
                      {/* Interactive slide card */}
                      <div className="relative rounded-2xl border border-slate-800 bg-slate-950 p-8 h-80 flex flex-col justify-between shadow-2xl transition-all print:border-slate-200">
                        <div className="space-y-4">
                          <div className="flex justify-between items-center text-[10px] text-slate-650">
                            <span className="font-bold tracking-widest uppercase">Pitch Slide Deck</span>
                            <span>Slide {activeSlideIdx + 1} of {selectedProposal.presentationOutline.length}</span>
                          </div>
                          <h2 className="text-lg md:text-2xl font-extrabold text-white tracking-tight border-b border-slate-900 pb-3 print:text-black">
                            {selectedProposal.presentationOutline[activeSlideIdx]?.slideTitle}
                          </h2>
                          <ul className="list-disc pl-6 space-y-2 text-xs md:text-sm text-slate-300 print:text-black">
                            {selectedProposal.presentationOutline[activeSlideIdx]?.keyPoints.map((pt, i) => (
                              <li key={i}>{pt}</li>
                            ))}
                          </ul>
                        </div>

                        {/* Controls */}
                        <div className="flex justify-between items-center pt-4 border-t border-slate-900 print:hidden">
                          <button
                            disabled={activeSlideIdx === 0}
                            onClick={() => setActiveSlideIdx((prev) => prev - 1)}
                            className="flex items-center gap-1.5 rounded-lg border border-slate-800 px-3 py-1.5 text-xs text-slate-400 hover:bg-slate-900 disabled:opacity-30"
                          >
                            <ChevronLeft className="h-4 w-4" /> Back
                          </button>
                          <button
                            disabled={activeSlideIdx === selectedProposal.presentationOutline.length - 1}
                            onClick={() => setActiveSlideIdx((prev) => prev + 1)}
                            className="flex items-center gap-1.5 rounded-lg border border-slate-800 px-3 py-1.5 text-xs text-slate-400 hover:bg-slate-900 disabled:opacity-30"
                          >
                            Next <ChevronRight className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="md:col-span-1 space-y-3">
                      <div className="rounded-2xl border border-slate-800 bg-slate-950/40 p-5 space-y-3 h-full flex flex-col justify-between print:border-slate-200">
                        <div className="space-y-3">
                          <h4 className="text-xs font-bold text-indigo-400 uppercase tracking-widest">Presenter Speaker Script</h4>
                          <p className="text-xs text-slate-400 leading-relaxed font-serif italic print:text-gray-700">
                            &quot;{selectedProposal.presentationOutline[activeSlideIdx]?.speakerNotes}&quot;
                          </p>
                        </div>
                        <div className="border-t border-slate-900 pt-3 text-[10px] text-slate-500">
                          Slide guides are generated dynamically based on value propositions, targeting high-conversion metrics.
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right sidebar metrics & history */}
          <div className="space-y-6 lg:col-span-1 print:hidden">
            {/* Scored scorecard */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 space-y-4">
              <h3 className="flex items-center gap-2 text-xs font-semibold tracking-wider text-slate-400 uppercase">
                <ShieldAlert className="h-4.5 w-4.5 text-indigo-400 shrink-0" /> Proposal Audit Quality
              </h3>
              <div className="flex items-center gap-4">
                <div className={`rounded-xl border px-4 py-2 font-mono font-extrabold text-2xl ${getScoreColor(selectedProposal.qualityScore)}`}>
                  {selectedProposal.qualityScore}/100
                </div>
                <div className="text-[10px] text-slate-400 leading-normal">
                  Weighted score calculated based on personalization, ROI clarity, SOW milestones, and strategic relevance.
                </div>
              </div>
            </div>

            {/* Recommendations */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/30 p-6 space-y-4">
              <h3 className="flex items-center gap-2 text-xs font-semibold tracking-wider text-slate-400 uppercase">
                <ClipboardList className="h-4.5 w-4.5 text-amber-400 shrink-0" /> Next Actions Queue
              </h3>
              <div className="space-y-3 text-xs leading-normal">
                {selectedProposal.recommendations.map((rec, idx) => (
                  <div key={idx} className="flex gap-2 border-l border-amber-950 pl-3 text-slate-300">
                    <p>{rec}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Version / Generation history drawer */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/30 p-6 space-y-4">
              <h3 className="flex items-center gap-2 text-xs font-semibold tracking-wider text-slate-400 uppercase">
                <Calendar className="h-4.5 w-4.5 text-slate-450 shrink-0" /> Proposals History
              </h3>
              {history.length === 0 ? (
                <p className="text-xs text-slate-500 italic">No proposals cataloged.</p>
              ) : (
                <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1">
                  {history.map((pkg) => (
                    <button
                      key={pkg.id}
                      onClick={() => {
                        applySelectedProposal(pkg);
                        setEditMode(false);
                      }}
                      className={`flex w-full flex-col text-left rounded-xl border p-3 space-y-1 transition-all ${
                        selectedProposal.id === pkg.id
                          ? 'border-indigo-500 bg-indigo-950/20'
                          : 'border-slate-850 bg-slate-950/40 hover:border-slate-700'
                      }`}
                    >
                      <h4 className="text-xs font-bold text-white truncate">{pkg.proposal.coverPage.title}</h4>
                      <div className="flex items-center justify-between text-[10px] text-slate-550 pt-1 border-t border-slate-900/20">
                        <span className="font-semibold text-slate-400">{pkg.metadata.companyName}</span>
                        <span className="font-mono">{new Date(pkg.metadata.timestamp).toLocaleDateString()}</span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

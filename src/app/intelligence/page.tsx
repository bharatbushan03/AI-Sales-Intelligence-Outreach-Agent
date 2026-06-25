'use client';

import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  TrendingUp,
  Cpu,
  Layers,
  ShieldCheck,
  Database,
  GitCompare,
  History,
  Edit3,
  Coins,
  Clock,
  CheckCircle,
  AlertTriangle,
  AlertCircle,
  Info,
  ChevronRight,
} from 'lucide-react';

interface PromptDefinition {
  id: string;
  name: string;
  description: string;
  template: string;
  systemInstruction?: string;
  fewShots?: string[];
  outputInstructions?: string;
  version: number;
  isActive: boolean;
}

interface PromptVersion {
  id: string;
  promptId: string;
  version: number;
  template: string;
  systemInstruction?: string;
  changelog: string;
  createdAt: string;
}

interface EvaluationResult {
  id: string;
  promptId: string;
  agentName: string;
  overallScore: number;
  metrics: {
    relevance: number;
    accuracy: number;
    completeness: number;
    personalization: number;
    businessValue: number;
    actionability: number;
  };
  critique: string;
  improvements: string[];
  createdAt: string;
}

interface QualityScorecard {
  id: string;
  agentName: string;
  successRate: number;
  averageQuality: number;
  runsCount: number;
  lastExecutedAt: string;
}

interface TokenUsage {
  id: string;
  promptId: string;
  agentName: string;
  workflowId: string;
  promptTokens: number;
  responseTokens: number;
  estimatedCost: number;
  latencyMs: number;
  createdAt: string;
}

interface ResponseCache {
  id: string;
  cacheKey: string;
  promptId: string;
  text: string;
  createdAt: string;
  expiresAt: string;
}

interface HallucinationReport {
  id: string;
  promptId: string;
  confidence: number;
  unsupportedClaims: Array<{
    statement: string;
    evidence: string;
    confidence: number;
    sourceReference?: string;
  }>;
  contradictions: string[];
  status: 'passed' | 'warning' | 'failed';
  createdAt: string;
}

export default function AIIntelligenceDashboard() {
  const [activeTab, setActiveTab] = useState<
    'registry' | 'analytics' | 'evaluations' | 'hallucinations' | 'cache'
  >('registry');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Core data states
  const [prompts, setPrompts] = useState<PromptDefinition[]>([]);
  const [versions, setVersions] = useState<PromptVersion[]>([]);
  const [evaluations, setEvaluations] = useState<EvaluationResult[]>([]);
  const [scorecards, setScorecards] = useState<QualityScorecard[]>([]);
  const [tokenUsage, setTokenUsage] = useState<TokenUsage[]>([]);
  const [cacheEntries, setCacheEntries] = useState<ResponseCache[]>([]);
  const [hallucinations, setHallucinations] = useState<HallucinationReport[]>([]);

  // Prompt Editing/Comparing states
  const [selectedPrompt, setSelectedPrompt] = useState<PromptDefinition | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '',
    description: '',
    template: '',
    systemInstruction: '',
    fewShots: '',
    outputInstructions: '',
    changelog: '',
  });

  const [comparePromptId, setComparePromptId] = useState<string>('');
  const [versionA, setVersionA] = useState<number | ''>('');
  const [versionB, setVersionB] = useState<number | ''>('');
  const [compareResult, setCompareResult] = useState<{
    promptA?: { template: string; systemInstruction: string; version: number };
    promptB?: { template: string; systemInstruction: string; version: number };
  } | null>(null);

  // Fetch all metrics & registry data
  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/intelligence');
      if (!res.ok) {
        throw new Error(`Error: ${res.statusText}`);
      }
      const payload = await res.json();
      if (payload.success && payload.data) {
        setPrompts(payload.data.prompts || []);
        setVersions(payload.data.versions || []);
        setEvaluations(payload.data.evaluations || []);
        setScorecards(payload.data.scorecards || []);
        setTokenUsage(payload.data.tokenUsage || []);
        setCacheEntries(payload.data.cache || []);
        setHallucinations(payload.data.hallucinations || []);
        setError(null);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load intelligence metrics.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Set default selection when prompts load
  useEffect(() => {
    if (prompts.length > 0 && !selectedPrompt) {
      setSelectedPrompt(prompts[0]);
      setComparePromptId(prompts[0].id);
    }
  }, [prompts, selectedPrompt]);

  // Update edit form when selection changes
  useEffect(() => {
    if (selectedPrompt) {
      setEditForm({
        name: selectedPrompt.name,
        description: selectedPrompt.description,
        template: selectedPrompt.template,
        systemInstruction: selectedPrompt.systemInstruction || '',
        fewShots: selectedPrompt.fewShots?.join('\n') || '',
        outputInstructions: selectedPrompt.outputInstructions || '',
        changelog: '',
      });
      // Pick available versions for comparison
      const promptVers = versions.filter((v) => v.promptId === selectedPrompt.id);
      if (promptVers.length >= 2) {
        setVersionA(promptVers[0].version);
        setVersionB(promptVers[1].version);
      } else if (promptVers.length === 1) {
        setVersionA(promptVers[0].version);
        setVersionB('');
      } else {
        setVersionA('');
        setVersionB('');
      }
    }
  }, [selectedPrompt, versions]);

  // Handle visual version comparison
  useEffect(() => {
    if (comparePromptId && versionA !== '') {
      const matchA = versions.find(
        (v) => v.promptId === comparePromptId && v.version === Number(versionA),
      );
      const matchB = versions.find(
        (v) => v.promptId === comparePromptId && v.version === Number(versionB),
      );

      // Fallback if not found in historical versions (might be active definition)
      const activePrompt = prompts.find((p) => p.id === comparePromptId);

      const aData = matchA
        ? {
            template: matchA.template,
            systemInstruction: matchA.systemInstruction || '',
            version: matchA.version,
          }
        : activePrompt && activePrompt.version === Number(versionA)
          ? {
              template: activePrompt.template,
              systemInstruction: activePrompt.systemInstruction || '',
              version: activePrompt.version,
            }
          : undefined;

      const bData = matchB
        ? {
            template: matchB.template,
            systemInstruction: matchB.systemInstruction || '',
            version: matchB.version,
          }
        : activePrompt && activePrompt.version === Number(versionB)
          ? {
              template: activePrompt.template,
              systemInstruction: activePrompt.systemInstruction || '',
              version: activePrompt.version,
            }
          : undefined;

      setCompareResult({
        promptA: aData,
        promptB: bData,
      });
    } else {
      setCompareResult(null);
    }
  }, [comparePromptId, versionA, versionB, versions, prompts]);

  const handleSavePrompt = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPrompt) return;

    try {
      setSaving(true);
      const res = await fetch('/api/intelligence', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'UPDATE_PROMPT',
          promptId: selectedPrompt.id,
          name: editForm.name,
          description: editForm.description,
          template: editForm.template,
          systemInstruction: editForm.systemInstruction,
          fewShots: editForm.fewShots.split('\n').filter(Boolean),
          outputInstructions: editForm.outputInstructions,
          changelog:
            editForm.changelog || `Updated template to version ${selectedPrompt.version + 1}`,
        }),
      });

      if (!res.ok) throw new Error('Failed to update prompt template');
      const updated = await res.json();

      if (updated.success) {
        setIsEditing(false);
        await fetchData();
        // Update selection
        const refreshed = prompts.find((p) => p.id === selectedPrompt.id) || updated.data;
        setSelectedPrompt(refreshed);
      }
    } catch (err: any) {
      alert(err.message || 'Failed to save prompt update');
    } finally {
      setSaving(false);
    }
  };

  // Calculations for analytics overview
  const totalCost = tokenUsage.reduce((acc, curr) => acc + (curr.estimatedCost || 0), 0);
  const totalTokens = tokenUsage.reduce(
    (acc, curr) => acc + (curr.promptTokens || 0) + (curr.responseTokens || 0),
    0,
  );
  const averageLatency =
    tokenUsage.length > 0
      ? Math.round(
          tokenUsage.reduce((acc, curr) => acc + (curr.latencyMs || 0), 0) / tokenUsage.length,
        )
      : 0;

  const totalRuns = tokenUsage.length;
  // Cache hits from cache entries vs total runs
  const totalCacheHits = cacheEntries.length; // Approximate active cached count

  return (
    <div className="space-y-8 text-slate-100">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white md:text-4xl">
            AI Intelligence & Prompt Operations
          </h1>
          <p className="mt-2 text-sm text-slate-400">
            Enterprise registry, structured output schema validations, self-critique metrics, A/B
            checks, and cost governance.
          </p>
        </div>
        <button
          onClick={fetchData}
          className="self-start rounded-xl border border-slate-800 bg-slate-900 px-4 py-2 text-xs font-semibold text-slate-300 transition-all hover:bg-slate-800"
        >
          Refresh Live Metrics
        </button>
      </div>

      {error && (
        <div className="flex items-center gap-3 rounded-xl border border-red-900 bg-red-950/50 p-4 text-sm text-red-400">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Tabs Menu */}
      <div className="flex border-b border-slate-800">
        {[
          { id: 'registry', label: 'Prompt Registry', icon: Layers },
          { id: 'analytics', label: 'Token & Cost Governance', icon: Coins },
          { id: 'evaluations', label: 'Quality Scorecards & Evaluations', icon: ShieldCheck },
          { id: 'hallucinations', label: 'Hallucination Reports', icon: AlertTriangle },
          { id: 'cache', label: 'Cache Performance', icon: Database },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 border-b-2 px-5 py-4 text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? 'border-indigo-500 text-indigo-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Icon className="h-4 w-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent" />
        </div>
      ) : (
        <div className="space-y-6">
          {/* TAB 1: PROMPT REGISTRY */}
          {activeTab === 'registry' && (
            <div className="grid gap-6 lg:grid-cols-12">
              {/* Sidebar List */}
              <div className="space-y-3 lg:col-span-4">
                <span className="text-xs font-semibold tracking-wider text-slate-500 uppercase">
                  Registered Prompts
                </span>
                <div className="space-y-2">
                  {prompts.map((prompt) => {
                    const isSelected = selectedPrompt?.id === prompt.id;
                    return (
                      <button
                        key={prompt.id}
                        onClick={() => {
                          setSelectedPrompt(prompt);
                          setIsEditing(false);
                        }}
                        className={`w-full rounded-xl border p-4 text-left transition-all ${
                          isSelected
                            ? 'border-indigo-500/80 bg-slate-900/80 shadow-md shadow-indigo-600/5'
                            : 'border-slate-800 bg-slate-900/30 hover:bg-slate-900/50'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-semibold text-slate-200">
                            {prompt.name}
                          </span>
                          <span className="rounded-full bg-slate-800 px-2 py-0.5 font-mono text-[10px] text-slate-400">
                            v{prompt.version}
                          </span>
                        </div>
                        <p className="mt-1 line-clamp-1 text-xs text-slate-400">
                          {prompt.description}
                        </p>
                        <span className="mt-2 inline-block font-mono text-[10px] text-indigo-400">
                          {prompt.id}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Detail view & Editor */}
              <div className="lg:col-span-8">
                {selectedPrompt ? (
                  <div className="space-y-6 rounded-2xl border border-slate-800 bg-slate-900/40 p-6">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                      <div>
                        <h2 className="text-lg font-semibold text-white">{selectedPrompt.name}</h2>
                        <span className="font-mono text-xs text-indigo-400">
                          {selectedPrompt.id}
                        </span>
                      </div>
                      {!isEditing && (
                        <button
                          onClick={() => setIsEditing(true)}
                          className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3.5 py-1.5 text-xs font-semibold text-white transition-all hover:bg-indigo-500"
                        >
                          <Edit3 className="h-3.5 w-3.5" /> Edit Template
                        </button>
                      )}
                    </div>

                    {isEditing ? (
                      <form onSubmit={handleSavePrompt} className="space-y-4">
                        <div className="grid gap-4 sm:grid-cols-2">
                          <div>
                            <label className="mb-1 block text-xs font-medium text-slate-400">
                              Friendly Name
                            </label>
                            <input
                              type="text"
                              value={editForm.name}
                              onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                              className="w-full rounded-lg border border-slate-700 bg-slate-900/60 px-3.5 py-2 text-sm text-slate-200 focus:border-indigo-500 focus:outline-none"
                              required
                            />
                          </div>
                          <div>
                            <label className="mb-1 block text-xs font-medium text-slate-400">
                              Description
                            </label>
                            <input
                              type="text"
                              value={editForm.description}
                              onChange={(e) =>
                                setEditForm({ ...editForm, description: e.target.value })
                              }
                              className="w-full rounded-lg border border-slate-700 bg-slate-900/60 px-3.5 py-2 text-sm text-slate-200 focus:border-indigo-500 focus:outline-none"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="mb-1 block text-xs font-medium text-slate-400">
                            System Instructions
                          </label>
                          <textarea
                            value={editForm.systemInstruction}
                            onChange={(e) =>
                              setEditForm({ ...editForm, systemInstruction: e.target.value })
                            }
                            rows={4}
                            className="w-full rounded-lg border border-slate-700 bg-slate-900/60 px-3.5 py-2 font-mono text-xs text-indigo-300 focus:border-indigo-500 focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="mb-1 block text-xs font-medium text-slate-400">
                            Prompt Template
                          </label>
                          <textarea
                            value={editForm.template}
                            onChange={(e) => setEditForm({ ...editForm, template: e.target.value })}
                            rows={4}
                            className="w-full rounded-lg border border-slate-700 bg-slate-900/60 px-3.5 py-2 font-mono text-xs text-slate-200 focus:border-indigo-500 focus:outline-none"
                            required
                          />
                        </div>

                        <div>
                          <label className="mb-1 block text-xs font-medium text-slate-400">
                            Few Shots Examples (one per line)
                          </label>
                          <textarea
                            value={editForm.fewShots}
                            onChange={(e) => setEditForm({ ...editForm, fewShots: e.target.value })}
                            rows={3}
                            placeholder="Input: ... \nOutput: ..."
                            className="w-full rounded-lg border border-slate-700 bg-slate-900/60 px-3.5 py-2 font-mono text-xs text-slate-300 focus:border-indigo-500 focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="mb-1 block text-xs font-medium text-slate-400">
                            Output Schema Instructions
                          </label>
                          <input
                            type="text"
                            value={editForm.outputInstructions}
                            onChange={(e) =>
                              setEditForm({ ...editForm, outputInstructions: e.target.value })
                            }
                            placeholder="e.g. Return valid JSON conforming to specified schemas."
                            className="w-full rounded-lg border border-slate-700 bg-slate-900/60 px-3.5 py-2 text-xs text-slate-200 focus:border-indigo-500 focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="mb-1 block text-xs font-medium text-indigo-400">
                            Changelog (Required to bump version)
                          </label>
                          <input
                            type="text"
                            value={editForm.changelog}
                            onChange={(e) =>
                              setEditForm({ ...editForm, changelog: e.target.value })
                            }
                            placeholder="Describe changes made in this revision..."
                            className="w-full rounded-lg border border-indigo-900/50 bg-indigo-950/20 px-3.5 py-2 text-sm text-slate-200 focus:border-indigo-500 focus:outline-none"
                            required
                          />
                        </div>

                        <div className="flex justify-end gap-3 pt-2">
                          <button
                            type="button"
                            onClick={() => setIsEditing(false)}
                            className="rounded-lg border border-slate-700 px-4 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-800"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            disabled={saving}
                            className="rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-500 disabled:bg-indigo-800"
                          >
                            {saving ? 'Saving Version...' : 'Deploy Version'}
                          </button>
                        </div>
                      </form>
                    ) : (
                      <div className="space-y-5">
                        <div>
                          <span className="text-xs font-semibold text-slate-400 uppercase">
                            Description
                          </span>
                          <p className="mt-1 text-sm text-slate-300">
                            {selectedPrompt.description}
                          </p>
                        </div>

                        {selectedPrompt.systemInstruction && (
                          <div>
                            <span className="text-xs font-semibold text-slate-400 uppercase">
                              System Instruction
                            </span>
                            <pre className="mt-1.5 overflow-x-auto rounded-lg border border-slate-800 bg-slate-950/50 p-3 font-mono text-[11px] whitespace-pre-wrap text-indigo-300">
                              {selectedPrompt.systemInstruction}
                            </pre>
                          </div>
                        )}

                        <div>
                          <span className="text-xs font-semibold text-slate-400 uppercase">
                            Active Template
                          </span>
                          <pre className="mt-1.5 overflow-x-auto rounded-lg border border-slate-800 bg-slate-950/50 p-3 font-mono text-[11px] whitespace-pre-wrap text-emerald-300">
                            {selectedPrompt.template}
                          </pre>
                        </div>

                        {selectedPrompt.fewShots && selectedPrompt.fewShots.length > 0 && (
                          <div>
                            <span className="text-xs font-semibold text-slate-400 uppercase">
                              Few Shot Examples
                            </span>
                            <div className="mt-1.5 space-y-2">
                              {selectedPrompt.fewShots.map((shot, i) => (
                                <pre
                                  key={i}
                                  className="overflow-x-auto rounded-lg border border-slate-800 bg-slate-950/30 p-3 font-mono text-[11px] whitespace-pre-wrap text-slate-400"
                                >
                                  {shot}
                                </pre>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Visual Version comparison section */}
                        <div className="space-y-4 border-t border-slate-800 pt-6">
                          <div className="flex items-center gap-2 text-sm font-semibold text-slate-200">
                            <GitCompare className="h-4 w-4 text-indigo-400" /> A/B Version
                            Comparison Diff
                          </div>
                          <div className="flex flex-wrap items-end gap-4">
                            <div>
                              <label className="mb-1 block text-[10px] text-slate-400">
                                Select Version A
                              </label>
                              <select
                                value={versionA}
                                onChange={(e) =>
                                  setVersionA(e.target.value ? Number(e.target.value) : '')
                                }
                                className="rounded-lg border border-slate-800 bg-slate-950 px-3 py-1.5 text-xs text-slate-300 focus:outline-none"
                              >
                                <option value="">None</option>
                                {versions
                                  .filter((v) => v.promptId === selectedPrompt.id)
                                  .map((v) => (
                                    <option key={v.id} value={v.version}>
                                      v{v.version}
                                    </option>
                                  ))}
                                <option value={selectedPrompt.version}>
                                  v{selectedPrompt.version} (Active)
                                </option>
                              </select>
                            </div>
                            <div>
                              <label className="mb-1 block text-[10px] text-slate-400">
                                Select Version B
                              </label>
                              <select
                                value={versionB}
                                onChange={(e) =>
                                  setVersionB(e.target.value ? Number(e.target.value) : '')
                                }
                                className="rounded-lg border border-slate-800 bg-slate-950 px-3 py-1.5 text-xs text-slate-300 focus:outline-none"
                              >
                                <option value="">None</option>
                                {versions
                                  .filter((v) => v.promptId === selectedPrompt.id)
                                  .map((v) => (
                                    <option key={v.id} value={v.version}>
                                      v{v.version}
                                    </option>
                                  ))}
                                <option value={selectedPrompt.version}>
                                  v{selectedPrompt.version} (Active)
                                </option>
                              </select>
                            </div>
                          </div>

                          {compareResult && compareResult.promptA && compareResult.promptB && (
                            <div className="grid gap-4 md:grid-cols-2">
                              <div className="space-y-2 rounded-xl border border-slate-800 bg-slate-950/40 p-4">
                                <span className="text-[10px] font-semibold tracking-wider text-indigo-400 uppercase">
                                  Version A (v{compareResult.promptA.version})
                                </span>
                                <div className="max-h-48 overflow-y-auto rounded-lg border border-slate-800 bg-slate-950 p-2.5 font-mono text-[11px] whitespace-pre-wrap text-slate-300">
                                  {compareResult.promptA.template}
                                </div>
                              </div>
                              <div className="space-y-2 rounded-xl border border-slate-800 bg-slate-950/40 p-4">
                                <span className="text-[10px] font-semibold tracking-wider text-emerald-400 uppercase">
                                  Version B (v{compareResult.promptB.version})
                                </span>
                                <div className="max-h-48 overflow-y-auto rounded-lg border border-slate-800 bg-slate-950 p-2.5 font-mono text-[11px] whitespace-pre-wrap text-slate-300">
                                  {compareResult.promptB.template}
                                </div>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Version History Log */}
                        <div className="space-y-3 border-t border-slate-800 pt-6">
                          <div className="flex items-center gap-2 text-sm font-semibold text-slate-200">
                            <History className="h-4 w-4 text-indigo-400" /> Version Registry Logs
                          </div>
                          <div className="divide-y divide-slate-800/80">
                            {versions
                              .filter((v) => v.promptId === selectedPrompt.id)
                              .map((v) => (
                                <div
                                  key={v.id}
                                  className="flex items-start justify-between py-2.5 text-xs"
                                >
                                  <div>
                                    <span className="font-mono font-semibold text-slate-200">
                                      v{v.version}
                                    </span>
                                    <p className="mt-0.5 text-slate-400">{v.changelog}</p>
                                  </div>
                                  <span className="font-mono text-[10px] text-slate-500">
                                    {new Date(v.createdAt).toLocaleString()}
                                  </span>
                                </div>
                              ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="rounded-2xl border border-slate-800 bg-slate-900/20 p-12 text-center text-slate-500">
                    No prompt registry records available. Select or create one.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: ANALYTICS & GOVERNANCE */}
          {activeTab === 'analytics' && (
            <div className="space-y-6">
              {/* Metrics Grid */}
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold tracking-wider text-indigo-400 uppercase">
                      Estimated Total Cost
                    </span>
                    <Coins className="h-5 w-5 text-indigo-400" />
                  </div>
                  <div className="mt-4">
                    <span className="text-3xl font-bold text-white">${totalCost.toFixed(4)}</span>
                    <p className="mt-1 text-[10px] text-slate-500">
                      Based on prompt & response tokens
                    </p>
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold tracking-wider text-emerald-400 uppercase">
                      Total Tokens Consumed
                    </span>
                    <Cpu className="h-5 w-5 text-emerald-400" />
                  </div>
                  <div className="mt-4">
                    <span className="text-3xl font-bold text-white">
                      {totalTokens.toLocaleString()}
                    </span>
                    <p className="mt-1 text-[10px] text-slate-500">
                      Cumulative prompt + completion
                    </p>
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold tracking-wider text-amber-400 uppercase">
                      Average Latency
                    </span>
                    <Clock className="h-5 w-5 text-amber-400" />
                  </div>
                  <div className="mt-4">
                    <span className="text-3xl font-bold text-white">{averageLatency}ms</span>
                    <p className="mt-1 text-[10px] text-slate-500">Avg execution time per prompt</p>
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold tracking-wider text-rose-400 uppercase">
                      Platform Executions
                    </span>
                    <Sparkles className="h-5 w-5 text-rose-400" />
                  </div>
                  <div className="mt-4">
                    <span className="text-3xl font-bold text-white">{totalRuns}</span>
                    <p className="mt-1 text-[10px] text-slate-500">Workflow trigger counts</p>
                  </div>
                </div>
              </div>

              {/* Logs table */}
              <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6">
                <h2 className="mb-4 text-lg font-semibold text-slate-200">
                  Prompt Execution & Governance Logs
                </h2>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-800 font-semibold tracking-wider text-slate-400 uppercase">
                        <th className="pr-4 pb-3">Timestamp</th>
                        <th className="px-4 pb-3">Agent Name</th>
                        <th className="px-4 pb-3 font-mono">Prompt ID</th>
                        <th className="px-4 pb-3 text-right">Tokens</th>
                        <th className="px-4 pb-3 text-right">Latency</th>
                        <th className="pb-3 pl-4 text-right">Cost</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 text-slate-300">
                      {tokenUsage.map((usage) => (
                        <tr key={usage.id} className="hover:bg-slate-900/25">
                          <td className="py-3.5 pr-4 text-slate-500">
                            {new Date(usage.createdAt).toLocaleTimeString()}
                          </td>
                          <td className="px-4 py-3.5 font-medium text-slate-200">
                            {usage.agentName}
                          </td>
                          <td className="px-4 py-3.5 font-mono text-indigo-400">
                            {usage.promptId}
                          </td>
                          <td className="px-4 py-3.5 text-right font-mono">
                            {(usage.promptTokens + usage.responseTokens).toLocaleString()}
                          </td>
                          <td className="px-4 py-3.5 text-right font-mono text-amber-400">
                            {usage.latencyMs}ms
                          </td>
                          <td className="py-3.5 pl-4 text-right font-mono text-emerald-400">
                            ${usage.estimatedCost.toFixed(5)}
                          </td>
                        </tr>
                      ))}
                      {tokenUsage.length === 0 && (
                        <tr>
                          <td colSpan={6} className="py-8 text-center text-slate-500">
                            No logs registered yet. Run workflows to generate token analytics.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: QUALITY SCORECARDS & EVALUATIONS */}
          {activeTab === 'evaluations' && (
            <div className="space-y-6">
              {/* Scorecard Matrix */}
              <div className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900/40 p-6">
                <h2 className="text-lg font-semibold text-slate-200">
                  Agent Quality Scorecard Matrix
                </h2>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
                  {[
                    'ResearchAgent',
                    'OpportunityAgent',
                    'OutreachAgent',
                    'CrmAgent',
                    'ProposalAgent',
                  ].map((agentName) => {
                    const sc = scorecards.find((s) => s.agentName === agentName);
                    // Mock fallbacks if no runs yet
                    const displaySuccess = sc ? Math.round(sc.successRate * 100) : 100;
                    const displayQuality = sc ? Math.round(sc.averageQuality) : 85;
                    const displayRuns = sc ? sc.runsCount : 0;

                    return (
                      <div
                        key={agentName}
                        className="space-y-3 rounded-xl border border-slate-800 bg-slate-950 p-5"
                      >
                        <span className="text-xs font-semibold text-slate-200">{agentName}</span>
                        <div className="flex items-baseline justify-between">
                          <span className="text-2xl font-bold text-white">
                            {displayQuality}/100
                          </span>
                          <span className="text-[10px] font-semibold text-emerald-400">
                            {displaySuccess}% SR
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-[10px] text-slate-500">
                          <span>Runs: {displayRuns}</span>
                          <span>Quality Grade</span>
                        </div>
                        <div className="bg-slate-850 h-1.5 w-full overflow-hidden rounded-full">
                          <div
                            className={`h-full rounded-full ${
                              displayQuality >= 80
                                ? 'bg-emerald-500'
                                : displayQuality >= 60
                                  ? 'bg-amber-500'
                                  : 'bg-rose-500'
                            }`}
                            style={{ width: `${displayQuality}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Individual Evaluation Results */}
              <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6">
                <h2 className="mb-4 text-lg font-semibold text-slate-200">
                  Live Evaluation Audit Trail
                </h2>
                <div className="space-y-4">
                  {evaluations.map((result) => (
                    <div
                      key={result.id}
                      className="space-y-4 rounded-xl border border-slate-800 bg-slate-950 p-5"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-900 pb-3">
                        <div className="flex items-center gap-3">
                          <span className="rounded-lg border border-indigo-900 bg-indigo-950 px-2.5 py-1 text-xs font-semibold text-indigo-400">
                            {result.agentName}
                          </span>
                          <span className="font-mono text-xs text-slate-400">
                            {result.promptId}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-slate-500">Overall Score:</span>
                          <span className="text-sm font-bold text-emerald-400">
                            {result.overallScore} / 100
                          </span>
                        </div>
                      </div>

                      {/* Six-factor quality score framework */}
                      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
                        {[
                          { label: 'Relevance', value: result.metrics.relevance },
                          { label: 'Accuracy', value: result.metrics.accuracy },
                          { label: 'Completeness', value: result.metrics.completeness },
                          { label: 'Personalization', value: result.metrics.personalization },
                          { label: 'Business Value', value: result.metrics.businessValue },
                          { label: 'Actionability', value: result.metrics.actionability },
                        ].map((metric) => (
                          <div
                            key={metric.label}
                            className="rounded-lg border border-slate-900 bg-slate-900/50 p-2.5 text-center"
                          >
                            <span className="block text-[9px] font-semibold tracking-wider text-slate-500 uppercase">
                              {metric.label}
                            </span>
                            <span className="mt-1 block text-sm font-bold text-slate-200">
                              {metric.value}
                            </span>
                          </div>
                        ))}
                      </div>

                      {result.critique && (
                        <div className="rounded-lg border border-slate-900 bg-slate-900/30 p-3 text-xs">
                          <span className="mb-1 block font-semibold text-indigo-400">
                            Self-Critique Review
                          </span>
                          <p className="leading-relaxed text-slate-300">{result.critique}</p>
                        </div>
                      )}

                      {result.improvements && result.improvements.length > 0 && (
                        <div className="text-xs">
                          <span className="mb-1.5 block font-semibold text-emerald-400">
                            Actionable Self-Correction Improvements
                          </span>
                          <ul className="list-disc space-y-1 pl-5 text-slate-400">
                            {result.improvements.map((imp, idx) => (
                              <li key={idx}>{imp}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  ))}
                  {evaluations.length === 0 && (
                    <div className="py-8 text-center text-sm text-slate-500">
                      No quality audit logs registered yet. Runs will show evaluator checklists.
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: HALLUCINATION REPORTS */}
          {activeTab === 'hallucinations' && (
            <div className="space-y-6">
              <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6">
                <h2 className="mb-4 text-lg font-semibold text-slate-200">
                  Hallucination & Grounding Reports
                </h2>
                <div className="space-y-4">
                  {hallucinations.map((rep) => {
                    const isPassed = rep.status === 'passed';
                    const isWarning = rep.status === 'warning';
                    return (
                      <div
                        key={rep.id}
                        className={`space-y-4 rounded-xl border p-5 ${
                          isPassed
                            ? 'border-slate-800 bg-slate-950'
                            : isWarning
                              ? 'border-amber-900/60 bg-amber-950/5'
                              : 'border-red-900/60 bg-red-950/5'
                        }`}
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-900/60 pb-3">
                          <div className="flex items-center gap-3">
                            <span className="font-mono text-xs text-indigo-400">
                              {rep.promptId}
                            </span>
                            <span className="text-[10px] text-slate-500">
                              {new Date(rep.createdAt).toLocaleString()}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            {isPassed ? (
                              <span className="flex items-center gap-1 rounded-full border border-emerald-900/50 bg-emerald-950/50 px-2.5 py-0.5 text-xs font-semibold text-emerald-400">
                                <CheckCircle className="h-3 w-3" /> Grounded & Verified
                              </span>
                            ) : (
                              <span
                                className={`flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${
                                  isWarning
                                    ? 'border-amber-900/50 bg-amber-950/50 text-amber-400'
                                    : 'border-red-900/50 bg-red-950/50 text-red-400'
                                }`}
                              >
                                <AlertTriangle className="h-3 w-3" /> Potential Hallucination
                              </span>
                            )}
                            <span className="font-mono text-xs font-bold text-slate-200">
                              Confidence: {Math.round(rep.confidence * 100)}%
                            </span>
                          </div>
                        </div>

                        {rep.unsupportedClaims && rep.unsupportedClaims.length > 0 ? (
                          <div className="space-y-3">
                            <span className="block text-xs font-semibold text-slate-400">
                              Claims Grounding Check:
                            </span>
                            <div className="space-y-2">
                              {rep.unsupportedClaims.map((claim, idx) => (
                                <div
                                  key={idx}
                                  className="space-y-2 rounded-lg border border-slate-900 bg-slate-900/40 p-3 text-xs"
                                >
                                  <div className="flex items-start justify-between gap-2">
                                    <p className="font-medium text-slate-200">
                                      "{claim.statement}"
                                    </p>
                                    <span
                                      className={`shrink-0 rounded px-2 py-0.5 text-[9px] font-semibold ${
                                        claim.confidence >= 0.8
                                          ? 'border border-emerald-900 bg-emerald-950 text-emerald-400'
                                          : claim.confidence >= 0.5
                                            ? 'border border-amber-900 bg-amber-950 text-amber-400'
                                            : 'border border-red-900 bg-red-950 text-red-400'
                                      }`}
                                    >
                                      {Math.round(claim.confidence * 100)}% Match
                                    </span>
                                  </div>
                                  <div className="grid gap-2 text-[11px] sm:grid-cols-2">
                                    <div>
                                      <span className="block font-semibold text-slate-500">
                                        Evidence
                                      </span>
                                      <p className="mt-0.5 text-slate-400">{claim.evidence}</p>
                                    </div>
                                    {claim.sourceReference && (
                                      <div>
                                        <span className="block font-semibold text-slate-500">
                                          Reference Source
                                        </span>
                                        <p className="mt-0.5 truncate text-slate-400">
                                          {claim.sourceReference}
                                        </p>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        ) : (
                          <p className="text-xs text-slate-400">
                            Zero unsupported claims or anomalies identified. Response is perfectly
                            grounded in retrieved data.
                          </p>
                        )}

                        {rep.contradictions && rep.contradictions.length > 0 && (
                          <div className="space-y-1.5 border-t border-slate-900/60 pt-3 text-xs">
                            <span className="block font-semibold text-red-400">
                              Logical Contradictions Identified:
                            </span>
                            <ul className="list-disc space-y-1 pl-5 text-slate-400">
                              {rep.contradictions.map((c, i) => (
                                <li key={i}>{c}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    );
                  })}

                  {hallucinations.length === 0 && (
                    <div className="py-8 text-center text-sm text-slate-500">
                      No hallucination warnings recorded. Agent outputs are currently fully
                      grounded.
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: CACHE PERFORMANCE */}
          {activeTab === 'cache' && (
            <div className="space-y-6">
              {/* Cache Stats Widget */}
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold tracking-wider text-indigo-400 uppercase">
                      Cached Query Outputs
                    </span>
                    <Database className="h-5 w-5 text-indigo-400" />
                  </div>
                  <div className="mt-4">
                    <span className="text-3xl font-bold text-white">{cacheEntries.length}</span>
                    <p className="mt-1 text-[10px] text-slate-500">
                      Currently stored active schemas
                    </p>
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold tracking-wider text-emerald-400 uppercase">
                      Average Cache Speed
                    </span>
                    <Clock className="h-5 w-5 text-emerald-400" />
                  </div>
                  <div className="mt-4">
                    <span className="text-3xl font-bold text-white">&lt;20ms</span>
                    <p className="mt-1 text-[10px] text-slate-500">Latency on cache hits</p>
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold tracking-wider text-amber-400 uppercase">
                      Estimated Savings
                    </span>
                    <Coins className="h-5 w-5 text-amber-400" />
                  </div>
                  <div className="mt-4">
                    <span className="text-3xl font-bold text-white">
                      ${(cacheEntries.length * 0.0075).toFixed(4)}
                    </span>
                    <p className="mt-1 text-[10px] text-slate-500">
                      Saved by bypassing redundant generations
                    </p>
                  </div>
                </div>
              </div>

              {/* Cache lists */}
              <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6">
                <div className="mb-4 flex items-center gap-2">
                  <Database className="h-5 w-5 text-indigo-400" />
                  <h2 className="text-lg font-semibold text-slate-200">
                    Active Gemini Response Cache Map
                  </h2>
                </div>
                <div className="space-y-3">
                  {cacheEntries.map((entry) => (
                    <div
                      key={entry.id}
                      className="space-y-2 rounded-xl border border-slate-800 bg-slate-950 p-4"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-900 pb-2">
                        <div className="flex items-center gap-2.5">
                          <span className="bg-slate-850 rounded px-2 py-0.5 font-mono text-[10px] text-slate-400">
                            Key: {entry.cacheKey.substring(0, 16)}...
                          </span>
                          <span className="font-mono text-xs text-indigo-400">
                            {entry.promptId}
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-500">
                          Expires: {new Date(entry.expiresAt).toLocaleTimeString()}
                        </span>
                      </div>
                      <div className="text-xs">
                        <span className="block font-semibold text-slate-500">
                          Cached Output Text Snippet
                        </span>
                        <pre className="mt-1 max-h-16 truncate overflow-y-auto rounded border border-slate-900/80 bg-slate-900/30 p-2 font-mono text-[10px] text-slate-400">
                          {entry.text}
                        </pre>
                      </div>
                    </div>
                  ))}
                  {cacheEntries.length === 0 && (
                    <div className="py-8 text-center text-sm text-slate-500">
                      No active cache entries. Run specialist workflows to populate caching maps.
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

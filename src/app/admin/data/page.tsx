'use client';

import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  RefreshCw,
  History,
  Building,
  Users,
  Database,
  Trash2,
  Plus,
  Play,
  RotateCcw,
  Search,
  ChevronRight,
  Info,
  Calendar,
  AlertTriangle,
  UserCheck,
  Shield,
  Sliders,
} from 'lucide-react';

type TabName = 'workflows' | 'audits' | 'inspector' | 'organizations' | 'retention';

export default function AdminDataConsolePage() {
  const [activeTab, setActiveTab] = useState<TabName>('workflows');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Data states
  const [workflows, setWorkflows] = useState<any[]>([]);
  const [steps, setSteps] = useState<any[]>([]);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [organizations, setOrganizations] = useState<any[]>([]);
  const [usersList, setUsersList] = useState<any[]>([]);

  // Selection states
  const [selectedWorkflow, setSelectedWorkflow] = useState<any | null>(null);
  const [selectedAuditLog, setSelectedAuditLog] = useState<any | null>(null);

  // Retention configurations
  const [retentionDays, setRetentionDays] = useState<number>(30);
  const [purging, setPurging] = useState(false);

  // Create Org inputs
  const [newOrgName, setNewOrgName] = useState('');
  const [newOrgId, setNewOrgId] = useState('');
  const [creatingOrg, setCreatingOrg] = useState(false);

  // Update Role inputs
  const [targetUserId, setTargetUserId] = useState('');
  const [targetRole, setTargetRole] = useState('Sales Rep');
  const [targetOrgId, setTargetOrgId] = useState('');
  const [updatingRole, setUpdatingRole] = useState(false);

  // Inspector inputs
  const [inspectorColName, setInspectorColName] = useState('workflows');
  const [inspectorDocId, setInspectorDocId] = useState('');
  const [versions, setVersions] = useState<any[]>([]);
  const [loadingVersions, setLoadingVersions] = useState(false);
  const [softDeletedItems, setSoftDeletedItems] = useState<any[]>([]);
  const [loadingSoftDeleted, setLoadingSoftDeleted] = useState(false);

  const headers = {
    'x-user-id': 'mock-admin-999', // Simulate admin access in frontend console
  };

  const fetchData = async (showProgress = true) => {
    if (showProgress) setLoading(true);
    else setRefreshing(true);
    setErrorMessage(null);

    try {
      const response = await fetch('/api/admin/data', { headers });
      const resData = await response.json();

      if (!response.ok) {
        throw new Error(resData.message || 'Failed to load administrative console data');
      }

      const { data } = resData;
      setWorkflows(data.workflows || []);
      setSteps(data.steps || []);
      setAuditLogs(data.auditLogs || []);
      setEvents(data.events || []);
      setOrganizations(data.organizations || []);
      setUsersList(data.users || []);

      // If a workflow is selected, refresh its reference
      if (selectedWorkflow) {
        const updatedWf = (data.workflows || []).find((w: any) => w.workflowId === selectedWorkflow.workflowId);
        if (updatedWf) setSelectedWorkflow(updatedWf);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Connection failure to administrative endpoint');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const fetchVersions = async () => {
    if (!inspectorDocId) return;
    setLoadingVersions(true);
    setVersions([]);
    setErrorMessage(null);
    try {
      const response = await fetch(`/api/admin/data?type=versions&collectionName=${inspectorColName}&documentId=${inspectorDocId}`, { headers });
      const resData = await response.json();
      if (!response.ok) {
        throw new Error(resData.message || 'Failed to fetch document versions');
      }
      setVersions(resData.data.versions || []);
    } catch (err: any) {
      setErrorMessage(err.message);
    } finally {
      setLoadingVersions(false);
    }
  };

  const fetchSoftDeleted = async () => {
    setLoadingSoftDeleted(true);
    setSoftDeletedItems([]);
    setErrorMessage(null);
    try {
      const response = await fetch(`/api/admin/data?type=soft_deleted`, { headers });
      const resData = await response.json();
      if (!response.ok) {
        throw new Error(resData.message || 'Failed to fetch soft deleted items');
      }
      setSoftDeletedItems(resData.data.softDeletedList || []);
    } catch (err: any) {
      setErrorMessage(err.message);
    } finally {
      setLoadingSoftDeleted(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (activeTab === 'inspector') {
      fetchSoftDeleted();
    }
  }, [activeTab]);

  const showToast = (msg: string, isError = false) => {
    if (isError) {
      setErrorMessage(msg);
      setSuccessMessage(null);
    } else {
      setSuccessMessage(msg);
      setErrorMessage(null);
    }
    setTimeout(() => {
      setErrorMessage(null);
      setSuccessMessage(null);
    }, 5500);
  };

  const handleRestore = async (collection: string, id: string) => {
    if (!confirm(`Are you sure you want to restore document ${id} in collection ${collection}?`)) return;
    try {
      const response = await fetch('/api/admin/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...headers },
        body: JSON.stringify({ action: 'RESTORE', collection, id }),
      });
      const resData = await response.json();
      if (!response.ok) throw new Error(resData.message);
      showToast(`Document ${id} successfully restored.`);
      fetchSoftDeleted();
      fetchData(false);
    } catch (err: any) {
      showToast(err.message, true);
    }
  };

  const handleRollback = async (collection: string, id: string, version: number) => {
    if (!confirm(`Rollback document ${id} to version ${version}? Current state will be snapshotted as a new version.`)) return;
    try {
      const response = await fetch('/api/admin/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...headers },
        body: JSON.stringify({ action: 'ROLLBACK', collection, id, version }),
      });
      const resData = await response.json();
      if (!response.ok) throw new Error(resData.message);
      showToast(`Successfully rolled back to version ${version}.`);
      fetchVersions();
      fetchData(false);
    } catch (err: any) {
      showToast(err.message, true);
    }
  };

  const handlePurge = async () => {
    if (!confirm(`WARNING: This will permanently delete all workflows and audit logs older than ${retentionDays} days. This action is irreversible. Proceed?`)) return;
    setPurging(true);
    try {
      const response = await fetch('/api/admin/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...headers },
        body: JSON.stringify({ action: 'PURGE', retentionDays }),
      });
      const resData = await response.json();
      if (!response.ok) throw new Error(resData.message);
      showToast(`Purge complete. Workflows deleted: ${resData.data.purgedWorkflows}, Audits deleted: ${resData.data.purgedAudits}.`);
      fetchData(false);
    } catch (err: any) {
      showToast(err.message, true);
    } finally {
      setPurging(false);
    }
  };

  const handleCreateOrg = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newOrgName || !newOrgId) return;
    setCreatingOrg(true);
    try {
      const response = await fetch('/api/admin/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...headers },
        body: JSON.stringify({ action: 'CREATE_ORGANIZATION', name: newOrgName, id: newOrgId }),
      });
      const resData = await response.json();
      if (!response.ok) throw new Error(resData.message);
      showToast(`Organization "${newOrgName}" registered.`);
      setNewOrgId('');
      setNewOrgName('');
      fetchData(false);
    } catch (err: any) {
      showToast(err.message, true);
    } finally {
      setCreatingOrg(false);
    }
  };

  const handleUpdateRole = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetUserId || !targetRole) return;
    setUpdatingRole(true);
    try {
      const response = await fetch('/api/admin/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...headers },
        body: JSON.stringify({
          action: 'UPDATE_USER_ROLE',
          targetUserId,
          role: targetRole,
          organizationId: targetOrgId || undefined,
        }),
      });
      const resData = await response.json();
      if (!response.ok) throw new Error(resData.message);
      showToast(`User ${targetUserId} role updated to ${targetRole}.`);
      setTargetUserId('');
      setTargetOrgId('');
      fetchData(false);
    } catch (err: any) {
      showToast(err.message, true);
    } finally {
      setUpdatingRole(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'completed': return 'bg-emerald-950/80 text-emerald-400 border-emerald-900/50';
      case 'failed': return 'bg-rose-950/80 text-rose-400 border-rose-900/50';
      case 'running': return 'bg-indigo-950/80 text-indigo-400 border-indigo-900/50';
      default: return 'bg-slate-900 text-slate-400 border-slate-800';
    }
  };

  return (
    <div className="space-y-8 text-slate-100 pb-16">
      {/* Messages */}
      {successMessage && (
        <div className="fixed top-6 right-6 z-50 rounded-xl border border-emerald-900 bg-emerald-950/90 p-4 text-emerald-300 shadow-2xl backdrop-blur flex items-center gap-3">
          <ShieldCheck className="h-5 w-5" />
          <span>{successMessage}</span>
        </div>
      )}
      {errorMessage && (
        <div className="fixed top-6 right-6 z-50 rounded-xl border border-rose-900 bg-rose-950/90 p-4 text-rose-300 shadow-2xl backdrop-blur flex items-center gap-3 animate-bounce">
          <AlertTriangle className="h-5 w-5" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Header Panel */}
      <div className="flex flex-col justify-between gap-4 border-b border-slate-800 pb-5 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white md:text-4xl flex items-center gap-3">
            <ShieldCheck className="h-9 w-9 text-indigo-500" />
            Admin Data Console
          </h1>
          <p className="mt-2 text-sm text-slate-400">
            Audit trailing, tenant control, event stream inspector, and soft-delete recovery framework.
          </p>
        </div>
        <button
          onClick={() => fetchData(false)}
          disabled={loading || refreshing}
          className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800 px-4 py-2.5 text-sm font-semibold text-slate-200 transition-all duration-200 hover:bg-slate-700 disabled:opacity-50"
        >
          <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
          Refresh Console
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Workflows</span>
            <div className="text-2xl font-bold text-white">{workflows.length}</div>
          </div>
          <History className="h-8 w-8 text-indigo-500 opacity-60" />
        </div>
        <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Tenants Managed</span>
            <div className="text-2xl font-bold text-white">{organizations.length}</div>
          </div>
          <Building className="h-8 w-8 text-emerald-500 opacity-60" />
        </div>
        <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Audit Events</span>
            <div className="text-2xl font-bold text-white">{auditLogs.length}</div>
          </div>
          <Database className="h-8 w-8 text-cyan-500 opacity-60" />
        </div>
        <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">User Count</span>
            <div className="text-2xl font-bold text-white">{usersList.length}</div>
          </div>
          <Users className="h-8 w-8 text-violet-500 opacity-60" />
        </div>
      </div>

      {/* Main Layout Tabs */}
      <div className="grid gap-8 lg:grid-cols-4">
        <div className="lg:col-span-1">
          <div className="flex flex-col gap-2 rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
            <span className="px-3 pb-2 text-xs font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-850">
              Admin Views
            </span>
            <button
              onClick={() => setActiveTab('workflows')}
              className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-200 ${
                activeTab === 'workflows' ? 'bg-indigo-650 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
              }`}
            >
              <History className="h-4 w-4" />
              Workflow Explorer
            </button>
            <button
              onClick={() => setActiveTab('audits')}
              className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-200 ${
                activeTab === 'audits' ? 'bg-indigo-650 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
              }`}
            >
              <Database className="h-4 w-4" />
              Audit Trail Viewer
            </button>
            <button
              onClick={() => setActiveTab('inspector')}
              className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-200 ${
                activeTab === 'inspector' ? 'bg-indigo-650 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
              }`}
            >
              <RotateCcw className="h-4 w-4" />
              Data Inspector
            </button>
            <button
              onClick={() => setActiveTab('organizations')}
              className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-200 ${
                activeTab === 'organizations' ? 'bg-indigo-650 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
              }`}
            >
              <Building className="h-4 w-4" />
              Organization Manager
            </button>
            <button
              onClick={() => setActiveTab('retention')}
              className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-200 ${
                activeTab === 'retention' ? 'bg-indigo-650 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
              }`}
            >
              <Sliders className="h-4 w-4" />
              Retention Manager
            </button>
          </div>
        </div>

        {/* Tab Contents */}
        <div className="lg:col-span-3 space-y-6">
          {loading ? (
            <div className="flex h-64 flex-col items-center justify-center gap-3 rounded-2xl border border-slate-850 bg-slate-900/20">
              <RefreshCw className="h-8 w-8 animate-spin text-indigo-500" />
              <span className="text-sm font-medium text-slate-400">Loading Firestore console metrics...</span>
            </div>
          ) : (
            <>
              {/* Tab 1: Workflows */}
              {activeTab === 'workflows' && (
                <div className="space-y-6">
                  <div className="rounded-2xl border border-slate-800 bg-slate-900/20 overflow-hidden">
                    <div className="border-b border-slate-800 bg-slate-900/60 px-6 py-4 flex items-center justify-between">
                      <h2 className="text-lg font-bold text-white">Workflow Run History</h2>
                      <span className="rounded-full bg-slate-800 px-3 py-1 text-xs font-semibold text-slate-400 border border-slate-705">
                        Showing {workflows.length} Records
                      </span>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="border-b border-slate-800 bg-slate-900/30 text-xs font-bold uppercase tracking-wider text-slate-400">
                            <th className="px-6 py-3.5">Workflow ID</th>
                            <th className="px-6 py-3.5">Goal</th>
                            <th className="px-6 py-3.5">Tenant Org</th>
                            <th className="px-6 py-3.5">Status</th>
                            <th className="px-6 py-3.5">Created At</th>
                            <th className="px-6 py-3.5 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800 text-sm text-slate-200">
                          {workflows.length === 0 ? (
                            <tr>
                              <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                                No workflows executed or persisted yet.
                              </td>
                            </tr>
                          ) : (
                            workflows.map((wf) => (
                              <tr
                                key={wf.id}
                                className={`transition-all duration-150 hover:bg-slate-800/40 cursor-pointer ${
                                  selectedWorkflow?.workflowId === wf.workflowId ? 'bg-slate-850/80 border-l-2 border-l-indigo-500' : ''
                                }`}
                                onClick={() => setSelectedWorkflow(wf)}
                              >
                                <td className="px-6 py-4 font-mono font-medium text-slate-100">{wf.workflowId}</td>
                                <td className="px-6 py-4 max-w-xs truncate" title={wf.goal}>{wf.goal}</td>
                                <td className="px-6 py-4 text-xs font-medium text-slate-400">{wf.organizationId}</td>
                                <td className="px-6 py-4">
                                  <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${getStatusColor(wf.status)}`}>
                                    {wf.status}
                                  </span>
                                </td>
                                <td className="px-6 py-4 text-slate-400 text-xs">
                                  {new Date(wf.createdAt).toLocaleString()}
                                </td>
                                <td className="px-6 py-4 text-right">
                                  <ChevronRight className="inline-block h-5 w-5 text-slate-500" />
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Selected Workflow Inspection Panel */}
                  {selectedWorkflow && (
                    <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 space-y-6">
                      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-800 pb-4 gap-4">
                        <div>
                          <h3 className="text-xl font-bold text-white flex items-center gap-2">
                            <span>Inspection Details:</span>
                            <span className="font-mono text-indigo-400">{selectedWorkflow.workflowId}</span>
                          </h3>
                          <p className="text-slate-400 text-sm mt-1">{selectedWorkflow.goal}</p>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              showToast(`Replaying workflow "${selectedWorkflow.workflowId}"... (Mock Trigger)`);
                            }}
                            className="flex items-center gap-2 rounded-xl bg-indigo-650 hover:bg-indigo-700 text-white text-xs font-bold px-4 py-2"
                          >
                            <Play className="h-3.5 w-3.5" />
                            Replay Run
                          </button>
                          <button
                            onClick={() => setSelectedWorkflow(null)}
                            className="rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 px-3.5 py-2 text-xs text-slate-300"
                          >
                            Close
                          </button>
                        </div>
                      </div>

                      {/* Detail Widgets */}
                      <div className="grid gap-4 md:grid-cols-3">
                        <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 space-y-1">
                          <div className="text-xs text-slate-500 uppercase font-semibold">User Actor</div>
                          <div className="text-sm font-semibold">{selectedWorkflow.userId}</div>
                        </div>
                        <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 space-y-1">
                          <div className="text-xs text-slate-500 uppercase font-semibold">Execution Time</div>
                          <div className="text-sm font-semibold">{(selectedWorkflow.metadata?.durationMs / 1000).toFixed(2)}s</div>
                        </div>
                        <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 space-y-1">
                          <div className="text-xs text-slate-500 uppercase font-semibold">Agents Executed</div>
                          <div className="text-sm font-semibold">{selectedWorkflow.agentsExecuted?.join(', ') || 'None'}</div>
                        </div>
                      </div>

                      {/* Timeline & Outputs */}
                      <div className="grid gap-6 md:grid-cols-2">
                        <div className="space-y-3">
                          <h4 className="text-sm font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-indigo-400" />
                            Execution Timeline
                          </h4>
                          <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 max-h-80 overflow-y-auto space-y-4">
                            {selectedWorkflow.executionTimeline?.map((evt: any, idx: number) => (
                              <div key={evt.id || idx} className="relative pl-6 border-l border-slate-800 last:pb-0 pb-4">
                                <div className="absolute -left-1.5 top-1 h-3 w-3 rounded-full bg-slate-800 border-2 border-indigo-400" />
                                <div className="text-xs text-slate-400">{new Date(evt.timestamp).toLocaleTimeString()}</div>
                                <div className="text-sm font-medium text-slate-200 mt-0.5">{evt.message}</div>
                                {evt.durationMs && <div className="text-xs text-indigo-400 font-semibold mt-0.5">Took {evt.durationMs}ms</div>}
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="space-y-3">
                          <h4 className="text-sm font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                            <Database className="h-4 w-4 text-emerald-400" />
                            Result Payload
                          </h4>
                          <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 max-h-80 overflow-y-auto">
                            <pre className="text-xs text-slate-300 font-mono overflow-x-auto whitespace-pre-wrap">
                              {JSON.stringify(selectedWorkflow.outputs || {}, null, 2)}
                            </pre>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Tab 2: Audit Logs */}
              {activeTab === 'audits' && (
                <div className="space-y-6">
                  <div className="rounded-2xl border border-slate-800 bg-slate-900/20 overflow-hidden">
                    <div className="border-b border-slate-800 bg-slate-900/60 px-6 py-4 flex items-center justify-between">
                      <h2 className="text-lg font-bold text-white">Immutable Security Audit Trail</h2>
                      <span className="rounded-full bg-slate-800 px-3 py-1 text-xs font-semibold text-slate-400 border border-slate-705">
                        {auditLogs.length} Entries Logged
                      </span>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="border-b border-slate-800 bg-slate-900/30 text-xs font-bold uppercase tracking-wider text-slate-400">
                            <th className="px-6 py-3.5">Actor</th>
                            <th className="px-6 py-3.5">Action</th>
                            <th className="px-6 py-3.5">Entity</th>
                            <th className="px-6 py-3.5">Entity ID</th>
                            <th className="px-6 py-3.5">Timestamp</th>
                            <th className="px-6 py-3.5 text-right">Details</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800 text-sm text-slate-200">
                          {auditLogs.length === 0 ? (
                            <tr>
                              <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                                No audit events logged.
                              </td>
                            </tr>
                          ) : (
                            auditLogs.map((log) => (
                              <tr
                                key={log.id}
                                className="transition-all duration-150 hover:bg-slate-800/40 cursor-pointer"
                                onClick={() => setSelectedAuditLog(log)}
                              >
                                <td className="px-6 py-4">
                                  <div className="flex flex-col">
                                    <span className="font-semibold text-slate-100">{log.actor?.email}</span>
                                    <span className="text-xs text-slate-400">{log.actor?.role}</span>
                                  </div>
                                </td>
                                <td className="px-6 py-4">
                                  <span className={`inline-flex rounded-full border px-2 py-0.5 text-xs font-bold ${
                                    log.action === 'RESTORE' || log.action === 'CREATE' ? 'bg-emerald-950/80 text-emerald-400 border-emerald-900/30' :
                                    log.action === 'ROLLBACK' || log.action === 'UPDATE' ? 'bg-amber-950/80 text-amber-400 border-amber-900/30' :
                                    'bg-rose-950/80 text-rose-400 border-rose-900/30'
                                  }`}>
                                    {log.action}
                                  </span>
                                </td>
                                <td className="px-6 py-4 font-medium text-slate-300">{log.entityType}</td>
                                <td className="px-6 py-4 font-mono text-xs text-slate-400">{log.entityId}</td>
                                <td className="px-6 py-4 text-xs text-slate-400">
                                  {new Date(log.timestamp).toLocaleString()}
                                </td>
                                <td className="px-6 py-4 text-right">
                                  <Info className="inline-block h-4 w-4 text-indigo-400" />
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Audit Details Modal Overlay */}
                  {selectedAuditLog && (
                    <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 space-y-4">
                      <div className="flex items-center justify-between border-b border-slate-850 pb-3">
                        <h3 className="text-lg font-bold text-white flex items-center gap-2">
                          <Shield className="h-5 w-5 text-indigo-400" />
                          Audit Metadata Inspector
                        </h3>
                        <button
                          onClick={() => setSelectedAuditLog(null)}
                          className="rounded-xl border border-slate-700 bg-slate-850 hover:bg-slate-800 px-3 py-1.5 text-xs"
                        >
                          Dismiss
                        </button>
                      </div>
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                          <div className="text-xs text-slate-500 uppercase font-semibold">Event UUID</div>
                          <div className="text-sm font-mono text-slate-200 mt-0.5">{selectedAuditLog.id}</div>
                        </div>
                        <div>
                          <div className="text-xs text-slate-500 uppercase font-semibold">Organization / Tenant</div>
                          <div className="text-sm font-mono text-slate-200 mt-0.5">{selectedAuditLog.organizationId}</div>
                        </div>
                      </div>
                      <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
                        <div className="text-xs text-slate-500 uppercase font-semibold mb-2">Event Metadata Context</div>
                        <pre className="text-xs text-indigo-300 font-mono overflow-x-auto whitespace-pre-wrap">
                          {JSON.stringify(selectedAuditLog.metadata || {}, null, 2)}
                        </pre>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Tab 3: Data Inspector (Rollbacks & Soft Deletes) */}
              {activeTab === 'inspector' && (
                <div className="space-y-6">
                  {/* Soft Delete Framework Restorations */}
                  <div className="rounded-2xl border border-slate-800 bg-slate-900/20 overflow-hidden">
                    <div className="border-b border-slate-800 bg-slate-900/60 px-6 py-4">
                      <h2 className="text-lg font-bold text-white flex items-center gap-2">
                        <Trash2 className="h-5 w-5 text-rose-500" />
                        Soft Deleted Documents Pool
                      </h2>
                    </div>

                    {loadingSoftDeleted ? (
                      <div className="p-8 text-center text-slate-400">Loading trash bin...</div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                          <thead>
                            <tr className="border-b border-slate-800 bg-slate-900/30 text-xs font-bold uppercase tracking-wider text-slate-400">
                              <th className="px-6 py-3.5">Collection</th>
                              <th className="px-6 py-3.5">Document ID</th>
                              <th className="px-6 py-3.5">Deleted By</th>
                              <th className="px-6 py-3.5">Deleted At</th>
                              <th className="px-6 py-3.5 text-right">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-800 text-sm text-slate-200">
                            {softDeletedItems.length === 0 ? (
                              <tr>
                                <td colSpan={5} className="px-6 py-10 text-center text-slate-500">
                                  No soft deleted records in database bin.
                                </td>
                              </tr>
                            ) : (
                              softDeletedItems.map((item) => (
                                <tr key={item.id} className="hover:bg-slate-800/20">
                                  <td className="px-6 py-4 font-semibold text-indigo-400">{item.collectionName}</td>
                                  <td className="px-6 py-4 font-mono text-xs">{item.id}</td>
                                  <td className="px-6 py-4 text-slate-400">{item.deletedBy || 'system'}</td>
                                  <td className="px-6 py-4 text-xs text-slate-400">
                                    {item.deletedAt ? new Date(item.deletedAt).toLocaleString() : 'N/A'}
                                  </td>
                                  <td className="px-6 py-4 text-right">
                                    <button
                                      onClick={() => handleRestore(item.collectionName, item.id)}
                                      className="rounded-xl border border-emerald-900 bg-emerald-950/60 hover:bg-emerald-900 text-emerald-400 text-xs font-bold px-3.5 py-1.5"
                                    >
                                      Restore
                                    </button>
                                  </td>
                                </tr>
                              ))
                            )}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>

                  {/* Document Version Control Snapshots */}
                  <div className="rounded-2xl border border-slate-800 bg-slate-900/20 p-6 space-y-6">
                    <h2 className="text-lg font-bold text-white flex items-center gap-2">
                      <History className="h-5 w-5 text-indigo-400" />
                      Document Version History Inspector
                    </h2>

                    <div className="grid gap-4 md:grid-cols-3 items-end">
                      <div className="space-y-2">
                        <label className="text-xs text-slate-400 font-semibold uppercase">Collection Name</label>
                        <select
                          value={inspectorColName}
                          onChange={(e) => setInspectorColName(e.target.value)}
                          className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-slate-200"
                        >
                          <option value="workflows">workflows</option>
                          <option value="leads">leads</option>
                          <option value="opportunity_reports">opportunity_reports</option>
                          <option value="outreach_campaigns">outreach_campaigns</option>
                          <option value="proposals">proposals</option>
                        </select>
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs text-slate-400 font-semibold uppercase">Document ID</label>
                        <input
                          type="text"
                          value={inspectorDocId}
                          onChange={(e) => setInspectorDocId(e.target.value)}
                          placeholder="e.g. wf_xyz123"
                          className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-slate-200"
                        />
                      </div>

                      <button
                        onClick={fetchVersions}
                        disabled={loadingVersions || !inspectorDocId}
                        className="rounded-xl bg-indigo-650 hover:bg-indigo-700 text-white font-bold px-5 py-2.5 text-sm transition disabled:opacity-50"
                      >
                        {loadingVersions ? 'Loading...' : 'Inspect Versions'}
                      </button>
                    </div>

                    {versions.length > 0 && (
                      <div className="rounded-xl border border-slate-800 bg-slate-950/80 overflow-hidden mt-4">
                        <div className="overflow-x-auto">
                          <table className="w-full text-left border-collapse text-sm">
                            <thead>
                              <tr className="border-b border-slate-800 bg-slate-900/40 text-xs font-bold uppercase tracking-wider text-slate-400">
                                <th className="px-6 py-3.5">Version</th>
                                <th className="px-6 py-3.5">Changelog</th>
                                <th className="px-6 py-3.5">Created By</th>
                                <th className="px-6 py-3.5">Created At</th>
                                <th className="px-6 py-3.5 text-right">Actions</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800 text-slate-200">
                              {versions.map((ver) => (
                                <tr key={ver.id} className="hover:bg-slate-800/10">
                                  <td className="px-6 py-4 font-bold text-indigo-400">v{ver.version}</td>
                                  <td className="px-6 py-4 max-w-sm truncate" title={ver.changelog}>{ver.changelog}</td>
                                  <td className="px-6 py-4 text-slate-400">{ver.createdBy}</td>
                                  <td className="px-6 py-4 text-xs text-slate-400">
                                    {new Date(ver.createdAt).toLocaleString()}
                                  </td>
                                  <td className="px-6 py-4 text-right">
                                    <button
                                      onClick={() => handleRollback(inspectorColName, inspectorDocId, ver.version)}
                                      className="rounded-xl border border-amber-900 bg-amber-950/60 hover:bg-amber-900 text-amber-400 text-xs font-bold px-3 py-1.5"
                                    >
                                      Rollback
                                    </button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Tab 4: Organization & User Manager */}
              {activeTab === 'organizations' && (
                <div className="space-y-6">
                  <div className="grid gap-6 md:grid-cols-2">
                    {/* Add Org Form */}
                    <div className="rounded-2xl border border-slate-800 bg-slate-900/20 p-6 space-y-4">
                      <h2 className="text-lg font-bold text-white flex items-center gap-2">
                        <Building className="h-5 w-5 text-indigo-400" />
                        Create Organization
                      </h2>
                      <form onSubmit={handleCreateOrg} className="space-y-3">
                        <div className="space-y-1">
                          <label className="text-xs text-slate-400 font-medium">Organization ID</label>
                          <input
                            type="text"
                            value={newOrgId}
                            onChange={(e) => setNewOrgId(e.target.value)}
                            placeholder="e.g. org_stripe"
                            className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-slate-200"
                            required
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs text-slate-400 font-medium">Display Name</label>
                          <input
                            type="text"
                            value={newOrgName}
                            onChange={(e) => setNewOrgName(e.target.value)}
                            placeholder="e.g. Stripe Inc."
                            className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-slate-200"
                            required
                          />
                        </div>
                        <button
                          type="submit"
                          disabled={creatingOrg}
                          className="w-full rounded-xl bg-indigo-650 hover:bg-indigo-700 text-white font-bold py-2 text-sm transition"
                        >
                          {creatingOrg ? 'Creating...' : 'Register Org'}
                        </button>
                      </form>
                    </div>

                    {/* Update Role Form */}
                    <div className="rounded-2xl border border-slate-800 bg-slate-900/20 p-6 space-y-4">
                      <h2 className="text-lg font-bold text-white flex items-center gap-2">
                        <UserCheck className="h-5 w-5 text-violet-500" />
                        Assign Role & Tenant
                      </h2>
                      <form onSubmit={handleUpdateRole} className="space-y-3">
                        <div className="space-y-1">
                          <label className="text-xs text-slate-400 font-medium">Target User ID</label>
                          <input
                            type="text"
                            value={targetUserId}
                            onChange={(e) => setTargetUserId(e.target.value)}
                            placeholder="e.g. user_stripe_rep"
                            className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-slate-200"
                            required
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs text-slate-400 font-medium">Organization Tenant</label>
                          <select
                            value={targetOrgId}
                            onChange={(e) => setTargetOrgId(e.target.value)}
                            className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-slate-200"
                          >
                            <option value="">Select Tenant Organization</option>
                            {organizations.map((org) => (
                              <option key={org.id} value={org.id}>{org.name || org.id}</option>
                            ))}
                          </select>
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs text-slate-400 font-medium">Role Designation</label>
                          <select
                            value={targetRole}
                            onChange={(e) => setTargetRole(e.target.value)}
                            className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-slate-200"
                          >
                            <option value="Admin">Admin</option>
                            <option value="Manager">Manager</option>
                            <option value="Sales Rep">Sales Rep</option>
                            <option value="Viewer">Viewer</option>
                          </select>
                        </div>
                        <button
                          type="submit"
                          disabled={updatingRole}
                          className="w-full rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-bold py-2 text-sm transition"
                        >
                          {updatingRole ? 'Updating...' : 'Update Settings'}
                        </button>
                      </form>
                    </div>
                  </div>

                  {/* Registered Users List */}
                  <div className="rounded-2xl border border-slate-800 bg-slate-900/20 overflow-hidden">
                    <div className="border-b border-slate-800 bg-slate-900/60 px-6 py-4">
                      <h2 className="text-lg font-bold text-white">Registered Users & Role Matrix</h2>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="border-b border-slate-800 bg-slate-900/30 text-xs font-bold uppercase tracking-wider text-slate-400">
                            <th className="px-6 py-3.5">User ID</th>
                            <th className="px-6 py-3.5">Email</th>
                            <th className="px-6 py-3.5">Tenant Org ID</th>
                            <th className="px-6 py-3.5 text-right font-bold">Role</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800 text-sm text-slate-200">
                          {usersList.length === 0 ? (
                            <tr>
                              <td colSpan={4} className="px-6 py-8 text-center text-slate-500">
                                No users registered in this tenant environment.
                              </td>
                            </tr>
                          ) : (
                            usersList.map((user) => (
                              <tr key={user.id} className="hover:bg-slate-800/10">
                                <td className="px-6 py-4 font-mono font-medium text-slate-100">{user.id}</td>
                                <td className="px-6 py-4 text-slate-450">{user.email || 'N/A'}</td>
                                <td className="px-6 py-4 font-medium text-slate-400">{user.organizationId || 'System'}</td>
                                <td className="px-6 py-4 text-right">
                                  <span className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-semibold ${
                                    user.role === 'Admin' ? 'bg-indigo-950 text-indigo-400 border-indigo-900/50' :
                                    user.role === 'Manager' ? 'bg-emerald-950 text-emerald-400 border-emerald-900/50' :
                                    user.role === 'Sales Rep' ? 'bg-cyan-950 text-cyan-400 border-cyan-900/50' :
                                    'bg-slate-900 text-slate-450 border-slate-800'
                                  }`}>
                                    {user.role || 'Sales Rep'}
                                  </span>
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

              {/* Tab 5: Data Retention Manager */}
              {activeTab === 'retention' && (
                <div className="space-y-6">
                  <div className="rounded-2xl border border-slate-800 bg-slate-900/20 p-6 space-y-6">
                    <h2 className="text-lg font-bold text-white flex items-center gap-2">
                      <Sliders className="h-5 w-5 text-indigo-400" />
                      Retention Policies & Archival Controls
                    </h2>

                    <div className="grid gap-6 md:grid-cols-2">
                      <div className="space-y-4">
                        <p className="text-slate-400 text-sm leading-relaxed">
                          Define standard retention limits for system event streams and analytics workflows.
                          Manual trigger purges delete audit records and workflow histories older than the specified limit.
                        </p>

                        <div className="space-y-2">
                          <label className="text-xs text-slate-400 font-semibold uppercase">Retention Range (Days)</label>
                          <div className="flex gap-3">
                            <input
                              type="number"
                              value={retentionDays}
                              onChange={(e) => setRetentionDays(Math.max(0, parseInt(e.target.value) || 0))}
                              className="w-32 rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-slate-200"
                              min={1}
                            />
                            <button
                              onClick={handlePurge}
                              disabled={purging}
                              className="rounded-xl bg-rose-650 hover:bg-rose-700 text-white font-bold px-5 py-2 text-sm flex items-center gap-2 transition disabled:opacity-50"
                            >
                              <Trash2 className="h-4 w-4" />
                              {purging ? 'Purging...' : 'Execute Manual Purge'}
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 space-y-3">
                        <h3 className="text-sm font-bold text-white flex items-center gap-2">
                          <Info className="h-4 w-4 text-indigo-400" />
                          Retention Strategy Rules
                        </h3>
                        <ul className="text-xs text-slate-400 space-y-2 list-disc list-inside">
                          <li>Audit logs have a legal compliance window of 365 days.</li>
                          <li>Intermediate workflow execution step inputs/outputs can be archived after 30 days.</li>
                          <li>Soft-deleted objects remain restoreable indefinitely unless purged.</li>
                          <li>Purges are immutable, hard deletions from Firestore collections.</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

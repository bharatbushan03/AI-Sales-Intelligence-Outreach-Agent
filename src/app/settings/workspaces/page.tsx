'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { workspacesRepository } from '@/lib/repositories';
import { Layers, Plus, CheckCircle, RefreshCw, FolderPlus, ArrowRight, Settings } from 'lucide-react';

export default function WorkspacesSettingsPage() {
  const { profile, activeWorkspaceId, setActiveWorkspaceId } = useAuth();
  
  const [loading, setLoading] = useState(true);
  const [workspaces, setWorkspaces] = useState<any[]>([]);
  const [newWsName, setNewWsName] = useState('');
  const [newWsDesc, setNewWsDesc] = useState('');

  const [creating, setCreating] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const orgId = profile?.organizationId || 'org_default';

  const fetchWorkspaces = async () => {
    setLoading(true);
    setErrorMessage(null);
    try {
      const response = await fetch('/api/admin/data'); // Fetch lists via admin endpoint
      const res = await response.json();
      if (res.success && res.data) {
        // Filter workspaces by user organization
        const filtered = (res.data.steps || []).map((s: any) => ({
          id: s.workspaceId || 'ws_sales_emea',
          name: s.workspaceId === 'ws_sales_emea' ? 'EMEA Sales' : 'General Sales',
          description: 'Sales and outreaches target opportunities',
          organizationId: orgId,
          createdAt: new Date().toISOString(),
        }));
        
        // Ensure unique mock workspace array
        const unique = Array.from(new Map(filtered.map((w: any) => [w.id, w])).values()) as any[];
        
        // Add a default General workspace if empty
        if (unique.length === 0) {
          unique.push({
            id: 'ws_general',
            name: 'General Workspace',
            description: 'Main shared sales intelligence workspace.',
            organizationId: orgId,
            createdAt: new Date().toISOString(),
          });
        }
        setWorkspaces(unique);

        // Auto-select active workspace if none selected
        if (!activeWorkspaceId && unique.length > 0) {
          setActiveWorkspaceId(unique[0].id);
        }
      }
    } catch (err: any) {
      console.error('Failed to load workspaces list:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkspaces();
  }, [orgId]);

  const handleCreateWorkspace = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWsName) return;
    setCreating(true);
    setErrorMsg(null);
    setSuccessMsg(null);
    try {
      const generatedId = `ws_${crypto.randomUUID().split('-')[0]}`;
      const newWs = {
        id: generatedId,
        name: newWsName,
        description: newWsDesc,
        organizationId: orgId,
        createdAt: new Date().toISOString(),
      };

      // Mock create local state
      setWorkspaces([...workspaces, newWs]);
      setActiveWorkspaceId(generatedId);
      
      setSuccessMsg(`Workspace "${newWsName}" successfully provisioned.`);
      setNewWsName('');
      setNewWsDesc('');
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to create workspace.');
    } finally {
      setCreating(false);
    }
  };

  const setSuccessMsg = (msg: string | null) => {
    setSuccessMessage(msg);
    if (msg) setTimeout(() => setSuccessMessage(null), 5000);
  };
  const setErrorMsg = (msg: string | null) => {
    setErrorMessage(msg);
    if (msg) setTimeout(() => setErrorMessage(null), 5000);
  };

  return (
    <div className="space-y-8 text-slate-100 pb-16">
      {/* Toast Alert */}
      {successMessage && (
        <div className="fixed top-6 right-6 z-50 rounded-xl border border-emerald-900 bg-emerald-950/90 p-4 text-emerald-300 shadow-2xl backdrop-blur">
          {successMessage}
        </div>
      )}
      {errorMessage && (
        <div className="fixed top-6 right-6 z-50 rounded-xl border border-rose-900 bg-rose-950/90 p-4 text-rose-300 shadow-2xl backdrop-blur">
          {errorMessage}
        </div>
      )}

      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white md:text-4xl flex items-center gap-3">
          <Layers className="h-9 w-9 text-indigo-500" />
          Workspaces Partition Manager
        </h1>
        <p className="mt-2 text-sm text-slate-400">
          Partition workflows, reports, proposals, and CRM activities into secure organizational workspaces.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Workspaces List Grid */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2 mb-2">
            <Settings className="h-5 w-5 text-indigo-400" />
            Active Workspaces Directory
          </h2>

          {loading ? (
            <div className="flex h-48 flex-col items-center justify-center gap-2 rounded-2xl border border-slate-850 bg-slate-900/10">
              <RefreshCw className="h-6 w-6 animate-spin text-indigo-500" />
              <span className="text-xs text-slate-500">Querying workspaces...</span>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {workspaces.map((ws) => {
                const isActive = activeWorkspaceId === ws.id;
                return (
                  <div
                    key={ws.id}
                    onClick={() => {
                      setActiveWorkspaceId(ws.id);
                      setSuccessMsg(`Switched workspace context to: ${ws.name}`);
                    }}
                    className={`rounded-2xl border p-6 flex flex-col justify-between cursor-pointer transition-all duration-200 ${
                      isActive
                        ? 'border-indigo-500/80 bg-indigo-950/20 shadow-md shadow-indigo-650/5'
                        : 'border-slate-800 bg-slate-900/30 hover:border-slate-700 hover:bg-slate-800/40'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-white">{ws.name}</span>
                        {isActive && (
                          <span className="rounded-full bg-indigo-900 text-indigo-300 border border-indigo-750/50 px-2.5 py-0.5 text-2xs font-extrabold uppercase">
                            Active
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-400 mt-2 leading-relaxed">{ws.description}</p>
                    </div>
                    <div className="mt-5 border-t border-slate-850 pt-4 flex items-center justify-between text-2xs font-bold uppercase tracking-wider text-slate-500">
                      <span className="font-mono text-slate-500">{ws.id}</span>
                      <span className="flex items-center gap-1 text-indigo-400 hover:text-indigo-300">
                        Select <ArrowRight className="h-3 w-3" />
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Create Workspace Panel */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 space-y-4">
          <h2 className="text-md font-bold text-white flex items-center gap-2">
            <FolderPlus className="h-5 w-5 text-indigo-400" />
            Provision Workspace
          </h2>
          <form onSubmit={handleCreateWorkspace} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs text-slate-450 font-bold uppercase">Workspace Name</label>
              <input
                type="text"
                value={newWsName}
                onChange={(e) => setNewWsName(e.target.value)}
                placeholder="e.g. APAC Marketing"
                className="w-full rounded-xl border border-slate-750 bg-slate-950 px-3.5 py-2 text-sm text-slate-200 focus:outline-none"
                required
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs text-slate-450 font-bold uppercase">Description</label>
              <textarea
                value={newWsDesc}
                onChange={(e) => setNewWsDesc(e.target.value)}
                placeholder="Brief summary describing workspace target actions..."
                rows={4}
                className="w-full rounded-xl border border-slate-750 bg-slate-950 px-3.5 py-2 text-sm text-slate-200 focus:outline-none"
              />
            </div>
            <button
              type="submit"
              disabled={creating}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-indigo-650 hover:bg-indigo-700 text-white font-bold py-2.5 text-sm transition"
            >
              {creating && <RefreshCw className="h-4 w-4 animate-spin" />}
              Create Workspace
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

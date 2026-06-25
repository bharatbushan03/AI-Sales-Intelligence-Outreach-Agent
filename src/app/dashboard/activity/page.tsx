'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import {
  Clock,
  Info,
  CheckCircle,
  AlertTriangle,
  ArrowRight,
  User,
  RefreshCw,
  Zap,
} from 'lucide-react';

export default function ActivityFeedPage() {
  const { profile } = useAuth();

  const [loading, setLoading] = useState(true);
  const [activities, setActivities] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const orgId = profile?.organizationId || 'org_default';

  const fetchActivities = async (showProgress = true) => {
    if (showProgress) setLoading(true);
    else setRefreshing(true);
    try {
      const response = await fetch('/api/admin/data'); // Retrieve feed data via admin context
      const res = await response.json();
      if (res.success && res.data) {
        // Query mock details
        const list = (res.data.auditLogs || []).map((log: any) => ({
          id: log.id,
          userName: log.actor?.email?.split('@')[0] || 'Teammate',
          action: log.action,
          details: `Performed a security data mutation: ${log.action} action on collection "${log.entityType}".`,
          timestamp: log.timestamp,
        }));

        // Add onboarding default mock activity item
        list.push({
          id: 'act_onboarding',
          userName: 'Owner',
          action: 'ONBOARDING_COMPLETED',
          details: 'Registered organization tenant workspace and created General Sales hub.',
          timestamp: new Date(Date.now() - 3600000).toISOString(),
        });

        setActivities(list.sort((a: any, b: any) => b.timestamp.localeCompare(a.timestamp)));
      }
    } catch (err) {
      console.error('Failed to retrieve activity feed logs:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, [orgId]);

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'ONBOARDING_COMPLETED':
        return <Zap className="h-5 w-5 text-indigo-400" />;
      case 'CREATE':
      case 'RESTORE':
        return <CheckCircle className="text-emerald-450 h-5 w-5" />;
      case 'ROLLBACK':
      case 'UPDATE':
        return <Info className="h-5 w-5 text-amber-400" />;
      default:
        return <AlertTriangle className="h-5 w-5 text-rose-400" />;
    }
  };

  return (
    <div className="space-y-8 pb-16 text-slate-100">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-5">
        <div>
          <h1 className="flex items-center gap-3 text-3xl font-bold tracking-tight text-white md:text-4xl">
            <Clock className="h-9 w-9 text-indigo-500" />
            Workspace Activity Log
          </h1>
          <p className="mt-2 text-sm text-slate-400">
            Realtime activity feed detailing team members mutations, workflow completions, and
            security logs.
          </p>
        </div>
        <button
          onClick={() => fetchActivities(false)}
          disabled={loading || refreshing}
          className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800 px-4 py-2 text-sm font-semibold text-slate-200 hover:bg-slate-700 disabled:opacity-50"
        >
          <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
          Refresh Feed
        </button>
      </div>

      {loading ? (
        <div className="border-slate-850 flex h-64 flex-col items-center justify-center gap-2 rounded-2xl border bg-slate-900/10">
          <RefreshCw className="h-7 w-7 animate-spin text-indigo-500" />
          <span className="text-xs text-slate-500">Querying timeline events...</span>
        </div>
      ) : (
        <div className="max-w-3xl rounded-2xl border border-slate-800 bg-slate-900/20 p-6 md:p-8">
          <div className="border-slate-850 relative space-y-8 border-l pl-6">
            {activities.map((act) => (
              <div key={act.id} className="group relative pl-6">
                {/* Timeline node icon */}
                <div className="absolute top-0.5 -left-10 flex h-7 w-7 items-center justify-center rounded-xl border border-slate-800 bg-slate-950 transition group-hover:border-slate-700">
                  {getActionIcon(act.action)}
                </div>
                <div className="text-slate-450 flex items-center gap-2 text-xs font-bold tracking-wider uppercase">
                  <User className="inline h-3 w-3 text-slate-500" />
                  <span className="font-semibold text-slate-300">{act.userName}</span>
                  <span className="text-slate-500">•</span>
                  <span>{new Date(act.timestamp).toLocaleTimeString()}</span>
                  <span className="text-slate-500">•</span>
                  <span>{new Date(act.timestamp).toLocaleDateString()}</span>
                </div>
                <h4 className="mt-1 text-sm font-bold text-slate-200">
                  {act.action.replace('_', ' ')}
                </h4>
                <p className="mt-1 text-xs leading-relaxed text-slate-400">{act.details}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

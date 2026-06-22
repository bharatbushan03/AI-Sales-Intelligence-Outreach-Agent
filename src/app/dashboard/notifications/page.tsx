'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Bell, CheckCircle, RefreshCw, Eye, AlertTriangle, ShieldCheck, Mail, Calendar } from 'lucide-react';

export default function NotificationsPage() {
  const { profile } = useAuth();
  
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);

  const orgId = profile?.organizationId || 'org_default';

  const fetchNotifications = async (showProgress = true) => {
    if (showProgress) setLoading(true);
    else setRefreshing(true);
    try {
      const response = await fetch('/api/admin/data');
      const res = await response.json();
      if (res.success && res.data) {
        // Build mock notifications
        const list = [
          {
            id: 'notif_onboard',
            title: 'Welcome to your SaaS Agent Platform!',
            message: 'You have registered successfully. Explore leads, opportunities, outreach campaigns, and proposals.',
            type: 'system',
            read: false,
            createdAt: new Date(Date.now() - 3600000).toISOString(),
          },
          {
            id: 'notif_invite',
            title: 'Team Member Invited',
            message: 'An invitation link was generated successfully for rep@stripe.com.',
            type: 'invite',
            read: false,
            createdAt: new Date().toISOString(),
          }
        ];
        
        // If workflows have run, simulate notification completion
        if (res.data.workflows?.length > 0) {
          list.push({
            id: 'notif_wf',
            title: 'Workflow Execution Finished',
            message: `Workflow ${res.data.workflows[0].workflowId} completed with status: ${res.data.workflows[0].status}.`,
            type: 'workflow',
            read: false,
            createdAt: res.data.workflows[0].createdAt,
          });
        }
        
        setNotifications(list.sort((a, b) => b.createdAt.localeCompare(a.createdAt)));
      }
    } catch (err) {
      console.error('Failed to load notifications:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [orgId]);

  const handleMarkAsRead = (id: string) => {
    setNotifications(
      notifications.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const handleMarkAllRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
  };

  const getNotifIcon = (type: string) => {
    switch (type) {
      case 'workflow':
        return <CheckCircle className="h-5 w-5 text-indigo-400" />;
      case 'invite':
        return <Mail className="h-5 w-5 text-violet-455 text-violet-400" />;
      default:
        return <Bell className="h-5 w-5 text-emerald-450 text-emerald-400" />;
    }
  };

  return (
    <div className="space-y-8 text-slate-100 pb-16">
      {/* Header */}
      <div className="flex justify-between items-center border-b border-slate-800 pb-5">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white md:text-4xl flex items-center gap-3">
            <Bell className="h-9 w-9 text-indigo-500" />
            In-App Notifications
          </h1>
          <p className="mt-2 text-sm text-slate-400">
            Audit team invites, agent trace completions, and crm reminder alerts.
          </p>
        </div>
        <div className="flex gap-2.5">
          <button
            onClick={handleMarkAllRead}
            disabled={notifications.every((n) => n.read)}
            className="rounded-xl border border-slate-700 bg-slate-800/80 px-4 py-2 text-xs font-bold hover:bg-slate-700 transition disabled:opacity-50"
          >
            Mark All Read
          </button>
          <button
            onClick={() => fetchNotifications(false)}
            disabled={loading || refreshing}
            className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800 px-4 py-2 text-sm font-semibold text-slate-200 hover:bg-slate-700 disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex h-64 flex-col items-center justify-center gap-2 rounded-2xl border border-slate-850 bg-slate-900/10">
          <RefreshCw className="h-7 w-7 animate-spin text-indigo-500" />
          <span className="text-xs text-slate-500">Querying inbox...</span>
        </div>
      ) : (
        <div className="max-w-3xl space-y-4">
          {notifications.length === 0 ? (
            <div className="text-center py-12 rounded-2xl border border-slate-800 bg-slate-900/10 text-slate-500 text-sm">
              Your inbox is completely clear.
            </div>
          ) : (
            notifications.map((notif) => (
              <div
                key={notif.id}
                className={`rounded-2xl border p-5 flex gap-4 transition-all duration-150 ${
                  notif.read
                    ? 'border-slate-850 bg-slate-900/10 opacity-70'
                    : 'border-indigo-900/30 bg-indigo-950/10 border-l-4 border-l-indigo-500'
                }`}
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-950 border border-slate-850">
                  {getNotifIcon(notif.type)}
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between gap-4">
                    <h3 className="text-sm font-bold text-slate-250 text-slate-200">{notif.title}</h3>
                    <span className="text-3xs font-bold text-slate-500 flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {new Date(notif.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">{notif.message}</p>
                  
                  {!notif.read && (
                    <div className="pt-2 flex justify-end">
                      <button
                        onClick={() => handleMarkAsRead(notif.id)}
                        className="text-xs text-indigo-400 hover:text-indigo-300 font-bold flex items-center gap-1.5"
                      >
                        <Eye className="h-3.5 w-3.5" /> Mark as Read
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

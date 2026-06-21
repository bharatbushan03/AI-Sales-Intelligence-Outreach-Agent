import React from 'react';
import { CheckCircle, RefreshCw } from 'lucide-react';

export default function CrmPage() {
  return (
    <div className="space-y-8 text-slate-100">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white md:text-4xl">CRM Integrity Hub</h1>
          <p className="mt-2 text-sm text-slate-400">
            Monitor and sync local agent data mappings directly to your third-party CRM records.
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-500 transition-colors">
          <RefreshCw className="h-4 w-4 animate-spin-slow" /> Force Database Sync
        </button>
      </div>

      <div className="rounded-2xl border border-slate-800 bg-slate-900/30 p-6 space-y-6">
        <h2 className="text-md font-semibold text-slate-200">Integration Connection Status</h2>
        
        <div className="grid gap-6 md:grid-cols-2">
          <div className="p-5 rounded-xl bg-slate-900/50 border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3.5">
              <div className="p-2.5 rounded-lg bg-orange-950/50 border border-orange-900/50 text-orange-400 font-bold text-sm">HS</div>
              <div>
                <span className="text-sm font-semibold text-slate-200">HubSpot Connector</span>
                <p className="text-xs text-emerald-400 mt-0.5 flex items-center gap-1">
                  <CheckCircle className="h-3.5 w-3.5" /> Connected
                </p>
              </div>
            </div>
            <span className="text-xs text-slate-500 font-medium">Last Sync: 10 mins ago</span>
          </div>

          <div className="p-5 rounded-xl bg-slate-900/50 border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3.5">
              <div className="p-2.5 rounded-lg bg-sky-950/50 border border-sky-900/50 text-sky-400 font-bold text-sm">SF</div>
              <div>
                <span className="text-sm font-semibold text-slate-200">Salesforce Link</span>
                <p className="text-xs text-emerald-400 mt-0.5 flex items-center gap-1">
                  <CheckCircle className="h-3.5 w-3.5" /> Connected
                </p>
              </div>
            </div>
            <span className="text-xs text-slate-500 font-medium">Last Sync: 1 hour ago</span>
          </div>
        </div>

        {/* Sync logs table */}
        <div className="mt-8 border-t border-slate-800 pt-6">
          <h3 className="text-sm font-semibold text-slate-300">Recent Action Logs</h3>
          <div className="mt-4 space-y-3 font-mono text-xs text-slate-400">
            <p className="flex justify-between border-b border-slate-850 pb-2">
              <span>[15:20:10] CRM_AGENT: Successfully updated lead status to &quot;OUTREACHED&quot; for stripe.com</span>
              <span className="text-slate-600">ID: stripe-sync-998</span>
            </p>
            <p className="flex justify-between border-b border-slate-850 pb-2">
              <span>[15:20:12] CRM_AGENT: Created new communication event logs in HubSpot calendar</span>
              <span className="text-slate-600">ID: hubspot-evt-291</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

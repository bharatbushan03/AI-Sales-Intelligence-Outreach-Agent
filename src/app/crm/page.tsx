import React from 'react';
import { CheckCircle, RefreshCw } from 'lucide-react';

export default function CrmPage() {
  return (
    <div className="space-y-8 text-slate-100">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white md:text-4xl">
            CRM Integrity Hub
          </h1>
          <p className="mt-2 text-sm text-slate-400">
            Monitor and sync local agent data mappings directly to your third-party CRM records.
          </p>
        </div>
        <button className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-indigo-500">
          <RefreshCw className="animate-spin-slow h-4 w-4" /> Force Database Sync
        </button>
      </div>

      <div className="space-y-6 rounded-2xl border border-slate-800 bg-slate-900/30 p-6">
        <h2 className="text-md font-semibold text-slate-200">Integration Connection Status</h2>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-900/50 p-5">
            <div className="flex items-center gap-3.5">
              <div className="rounded-lg border border-orange-900/50 bg-orange-950/50 p-2.5 text-sm font-bold text-orange-400">
                HS
              </div>
              <div>
                <span className="text-sm font-semibold text-slate-200">HubSpot Connector</span>
                <p className="mt-0.5 flex items-center gap-1 text-xs text-emerald-400">
                  <CheckCircle className="h-3.5 w-3.5" /> Connected
                </p>
              </div>
            </div>
            <span className="text-xs font-medium text-slate-500">Last Sync: 10 mins ago</span>
          </div>

          <div className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-900/50 p-5">
            <div className="flex items-center gap-3.5">
              <div className="rounded-lg border border-sky-900/50 bg-sky-950/50 p-2.5 text-sm font-bold text-sky-400">
                SF
              </div>
              <div>
                <span className="text-sm font-semibold text-slate-200">Salesforce Link</span>
                <p className="mt-0.5 flex items-center gap-1 text-xs text-emerald-400">
                  <CheckCircle className="h-3.5 w-3.5" /> Connected
                </p>
              </div>
            </div>
            <span className="text-xs font-medium text-slate-500">Last Sync: 1 hour ago</span>
          </div>
        </div>

        {/* Sync logs table */}
        <div className="mt-8 border-t border-slate-800 pt-6">
          <h3 className="text-sm font-semibold text-slate-300">Recent Action Logs</h3>
          <div className="mt-4 space-y-3 font-mono text-xs text-slate-400">
            <p className="border-slate-850 flex justify-between border-b pb-2">
              <span>
                [15:20:10] CRM_AGENT: Successfully updated lead status to &quot;OUTREACHED&quot; for
                stripe.com
              </span>
              <span className="text-slate-600">ID: stripe-sync-998</span>
            </p>
            <p className="border-slate-850 flex justify-between border-b pb-2">
              <span>
                [15:20:12] CRM_AGENT: Created new communication event logs in HubSpot calendar
              </span>
              <span className="text-slate-600">ID: hubspot-evt-291</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

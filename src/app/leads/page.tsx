import React from 'react';
import { Plus, Search } from 'lucide-react';

export default function LeadsPage() {
  return (
    <div className="space-y-8 text-slate-100">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white md:text-4xl">
            Lead Database
          </h1>
          <p className="mt-2 text-sm text-slate-400">
            View, filter, and manage prospect accounts currently processing in the pipeline.
          </p>
        </div>
        <button className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition-colors duration-200 hover:bg-indigo-500">
          <Plus className="h-4 w-4" /> Add Lead
        </button>
      </div>

      <div className="rounded-2xl border border-slate-800 bg-slate-900/30 p-6">
        {/* Filter Toolbar */}
        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute top-2.5 left-3 h-5 w-5 text-slate-500" />
            <input
              type="text"
              placeholder="Search companies, URLs, status..."
              className="w-full rounded-xl border border-slate-800 bg-slate-950 py-2 pr-4 pl-10 text-sm text-slate-200 focus:border-indigo-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Leads Table */}
        <div className="mt-6 overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-slate-800 text-xs font-semibold tracking-wider text-slate-400 uppercase">
                <th className="px-3 py-4">Company</th>
                <th className="px-3 py-4">Website</th>
                <th className="px-3 py-4">Status</th>
                <th className="px-3 py-4">Opportunity Score</th>
                <th className="px-3 py-4">Last Checked</th>
              </tr>
            </thead>
            <tbody className="divide-slate-850 divide-y text-sm text-slate-300">
              {[
                {
                  name: 'Stripe',
                  url: 'stripe.com',
                  status: 'RESEARCHED',
                  score: 92,
                  date: '1 hour ago',
                },
                {
                  name: 'HubSpot',
                  url: 'hubspot.com',
                  status: 'OUTREACHED',
                  score: 85,
                  date: '4 hours ago',
                },
                {
                  name: 'Salesforce',
                  url: 'salesforce.com',
                  status: 'PENDING_RESEARCH',
                  score: 78,
                  date: 'Yesterday',
                },
                {
                  name: 'ZoomInfo',
                  url: 'zoominfo.com',
                  status: 'MEETING_SCHEDULED',
                  score: 94,
                  date: '2 days ago',
                },
              ].map((lead, idx) => (
                <tr key={idx} className="hover:bg-slate-900/20">
                  <td className="px-3 py-4 font-semibold text-slate-200">{lead.name}</td>
                  <td className="px-3 py-4 text-slate-400">{lead.url}</td>
                  <td className="px-3 py-4">
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                        lead.status === 'MEETING_SCHEDULED'
                          ? 'border border-emerald-900/50 bg-emerald-950 text-emerald-400'
                          : lead.status === 'OUTREACHED'
                            ? 'border border-indigo-900/50 bg-indigo-950 text-indigo-400'
                            : lead.status === 'RESEARCHED'
                              ? 'border border-blue-900/50 bg-blue-950 text-blue-400'
                              : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {lead.status}
                    </span>
                  </td>
                  <td className="px-3 py-4 font-medium text-slate-200">{lead.score}/100</td>
                  <td className="px-3 py-4 text-slate-400">{lead.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

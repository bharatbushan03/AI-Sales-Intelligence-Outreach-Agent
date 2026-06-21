import React from 'react';
import { Plus, Search } from 'lucide-react';

export default function LeadsPage() {
  return (
    <div className="space-y-8 text-slate-100">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white md:text-4xl">Lead Database</h1>
          <p className="mt-2 text-sm text-slate-400">
            View, filter, and manage prospect accounts currently processing in the pipeline.
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-500 transition-colors duration-200">
          <Plus className="h-4 w-4" /> Add Lead
        </button>
      </div>

      <div className="rounded-2xl border border-slate-800 bg-slate-900/30 p-6">
        {/* Filter Toolbar */}
        <div className="flex gap-4 items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-slate-500" />
            <input
              type="text"
              placeholder="Search companies, URLs, status..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 pl-10 pr-4 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        {/* Leads Table */}
        <div className="mt-6 overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 text-xs font-semibold uppercase tracking-wider">
                <th className="py-4 px-3">Company</th>
                <th className="py-4 px-3">Website</th>
                <th className="py-4 px-3">Status</th>
                <th className="py-4 px-3">Opportunity Score</th>
                <th className="py-4 px-3">Last Checked</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-850 text-slate-300 text-sm">
              {[
                { name: 'Stripe', url: 'stripe.com', status: 'RESEARCHED', score: 92, date: '1 hour ago' },
                { name: 'HubSpot', url: 'hubspot.com', status: 'OUTREACHED', score: 85, date: '4 hours ago' },
                { name: 'Salesforce', url: 'salesforce.com', status: 'PENDING_RESEARCH', score: 78, date: 'Yesterday' },
                { name: 'ZoomInfo', url: 'zoominfo.com', status: 'MEETING_SCHEDULED', score: 94, date: '2 days ago' },
              ].map((lead, idx) => (
                <tr key={idx} className="hover:bg-slate-900/20">
                  <td className="py-4 px-3 font-semibold text-slate-200">{lead.name}</td>
                  <td className="py-4 px-3 text-slate-400">{lead.url}</td>
                  <td className="py-4 px-3">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                      lead.status === 'MEETING_SCHEDULED' ? 'bg-emerald-950 text-emerald-400 border border-emerald-900/50' :
                      lead.status === 'OUTREACHED' ? 'bg-indigo-950 text-indigo-400 border border-indigo-900/50' :
                      lead.status === 'RESEARCHED' ? 'bg-blue-950 text-blue-400 border border-blue-900/50' :
                      'bg-slate-800 text-slate-400'
                    }`}>
                      {lead.status}
                    </span>
                  </td>
                  <td className="py-4 px-3 font-medium text-slate-200">{lead.score}/100</td>
                  <td className="py-4 px-3 text-slate-400">{lead.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

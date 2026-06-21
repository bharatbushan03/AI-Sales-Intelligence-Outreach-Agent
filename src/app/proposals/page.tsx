import React from 'react';
import { FileText, Eye, Download } from 'lucide-react';

export default function ProposalsPage() {
  return (
    <div className="space-y-8 text-slate-100">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white md:text-4xl">
            Client Proposals
          </h1>
          <p className="mt-2 text-sm text-slate-400">
            Generate and export tailored B2B agreement proposals directly to Google Drive as Google
            Docs.
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[
          {
            company: 'Stripe',
            tier: 'Enterprise Custom',
            date: 'Generated today',
            status: 'DRAFT',
          },
          {
            company: 'HubSpot',
            tier: 'Growth Monthly',
            date: 'Generated yesterday',
            status: 'DRAFT',
          },
          { company: 'Salesforce', tier: 'Standard Tier', date: '2 days ago', status: 'COMPLETED' },
        ].map((prop, index) => (
          <div
            key={index}
            className="flex h-56 flex-col justify-between rounded-2xl border border-slate-800 bg-slate-900/30 p-6"
          >
            <div>
              <div className="flex items-center justify-between">
                <FileText className="h-6 w-6 text-indigo-400" />
                <span
                  className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                    prop.status === 'COMPLETED'
                      ? 'border border-emerald-900/50 bg-emerald-950 text-emerald-400'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {prop.status}
                </span>
              </div>
              <h3 className="text-md mt-4 font-semibold text-slate-200">
                Proposal for {prop.company}
              </h3>
              <p className="mt-1 text-xs text-slate-500">Tier structure: {prop.tier}</p>
            </div>

            <div className="border-slate-850 mt-4 flex items-center justify-between border-t pt-4">
              <span className="text-xs text-slate-500">{prop.date}</span>
              <div className="flex gap-2">
                <button className="rounded-lg border border-slate-800 p-1.5 text-slate-400 hover:bg-slate-800 hover:text-slate-200">
                  <Eye className="h-4 w-4" />
                </button>
                <button className="rounded-lg border border-slate-800 p-1.5 text-slate-400 hover:bg-slate-800 hover:text-slate-200">
                  <Download className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

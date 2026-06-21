import React from 'react';
import { Bot, Radio } from 'lucide-react';

export default function ResearchPage() {
  return (
    <div className="space-y-8 text-slate-100">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white md:text-4xl">Intelligence Research Hub</h1>
        <p className="mt-2 text-sm text-slate-400">
          Trigger deep scraping, tech stack analyses, and latest news queries on target URLs.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Research Input Form */}
        <div className="lg:col-span-1 space-y-6">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 space-y-4">
            <h2 className="text-md font-semibold text-slate-200">Start Lead Analysis</h2>
            
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Prospect Website</label>
              <input
                type="text"
                placeholder="e.g. stripe.com"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 px-4 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-500 transition-colors duration-200">
              <Bot className="h-4 w-4" /> Trigger Research Agent
            </button>
          </div>
        </div>

        {/* Dynamic Log Traces preview */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6">
            <h2 className="text-md font-semibold text-slate-200">Live Agent Activity stream</h2>
            <div className="mt-4 p-4 rounded-xl bg-slate-950 border border-slate-900 font-mono text-xs text-indigo-400 space-y-2.5">
              <div className="flex items-center gap-2">
                <Radio className="h-3 w-3 text-emerald-400 animate-ping" />
                <span className="text-slate-500">[15:30:12]</span>
                <span>ResearchAgent: Registered workspace listener initialized</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-slate-500">[15:30:13]</span>
                <span>ResearchAgent: Executing Google Search Grounding for stripe.com</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-slate-500">[15:30:14]</span>
                <span>ResearchAgent: Crawling news feeds: 2 documents parsed</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-slate-500">[15:30:15]</span>
                <span>ResearchAgent: Stored structured intelligence payload in Firestore db</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

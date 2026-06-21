import React from 'react';
import { Bot, Sparkles, TrendingUp, Users } from 'lucide-react';

export default function DashboardPage() {
  return (
    <div className="space-y-8 text-slate-100">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white md:text-4xl">Platform Dashboard</h1>
        <p className="mt-2 text-sm text-slate-400">
          Monitor your autonomous multi-agent pipeline status, active pipelines, and generated leads metrics.
        </p>
      </div>

      {/* Grid Widgets */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wider">Total Leads Managed</span>
            <Users className="h-5 w-5 text-indigo-400" />
          </div>
          <div className="mt-4">
            <span className="text-3xl font-bold text-white">124</span>
            <div className="mt-1 flex items-center gap-1 text-xs text-emerald-400">
              <TrendingUp className="h-3 w-3" />
              <span>+18% since last week</span>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">Active Agents</span>
            <Bot className="h-5 w-5 text-emerald-400" />
          </div>
          <div className="mt-4">
            <span className="text-3xl font-bold text-white">6 / 6</span>
            <span className="ml-2 text-xs text-slate-400 font-medium">All systems online</span>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider">Campaign Response</span>
            <Sparkles className="h-5 w-5 text-amber-400" />
          </div>
          <div className="mt-4">
            <span className="text-3xl font-bold text-white">34.2%</span>
            <span className="ml-2 text-xs text-emerald-400 font-semibold">+4.1% avg. lift</span>
          </div>
        </div>
      </div>

      {/* Agent Registries Panel */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6">
        <h2 className="text-lg font-semibold text-slate-200">Registered Specialists Status</h2>
        <div className="mt-4 divide-y divide-slate-800">
          {[
            { name: 'ManagerAgent', desc: 'Central orchestrator planning dynamic steps via Gemini 1.5 Pro', type: 'Coordinator' },
            { name: 'ResearchAgent', desc: 'Queries real-time search grounding and scrapes tech profiles', type: 'Specialist' },
            { name: 'OpportunityAgent', desc: 'Identifies pain points and maps product values using Vertex AI Search', type: 'Specialist' },
            { name: 'OutreachAgent', desc: 'Drafts emails and social messages localized to prospect profiles', type: 'Specialist' },
            { name: 'CrmAgent', desc: 'Coordinates Firestore updates, action logging, and followups', type: 'Specialist' },
            { name: 'ProposalAgent', desc: 'Compiles custom solution PDFs and drafts drive documents', type: 'Specialist' },
          ].map((agent, index) => (
            <div key={index} className="flex items-center justify-between py-3.5">
              <div>
                <span className="text-sm font-semibold text-slate-200">{agent.name}</span>
                <p className="text-xs text-slate-400 mt-0.5">{agent.desc}</p>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-950 text-indigo-400 border border-indigo-900/50">
                {agent.type}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

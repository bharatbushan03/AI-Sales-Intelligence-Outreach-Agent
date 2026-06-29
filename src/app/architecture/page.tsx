import React from 'react';
import { Network, Database, Brain, ArrowDown, Activity, Settings, User } from 'lucide-react';

export default function ArchitecturePage() {
  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-slate-100">System Architecture</h1>
        <p className="mx-auto mt-4 max-w-2xl text-slate-400">
          Interactive visualization of the Multi-Agent B2B Sales Engine powered by Google Gemini and
          Firebase.
        </p>
      </div>

      <div className="mx-auto flex w-full max-w-4xl flex-col items-center gap-8">
        {/* User Layer */}
        <div className="flex flex-col items-center">
          <div className="flex items-center gap-4 rounded-2xl border border-indigo-500/30 bg-indigo-500/10 p-6 shadow-lg shadow-indigo-500/5">
            <User className="h-8 w-8 text-indigo-400" />
            <h2 className="text-xl font-semibold text-indigo-100">User / Executive</h2>
          </div>
          <ArrowDown className="my-4 h-8 w-8 text-slate-600" />
        </div>

        {/* Manager Layer */}
        <div className="flex flex-col items-center">
          <div className="flex w-96 items-center justify-center gap-4 rounded-2xl border border-blue-500/30 bg-blue-500/10 p-6 shadow-lg shadow-blue-500/5">
            <Settings className="h-8 w-8 text-blue-400" />
            <h2 className="text-xl font-semibold text-blue-100">Manager Agent</h2>
          </div>
          <ArrowDown className="my-4 h-8 w-8 text-slate-600" />
        </div>

        {/* Specialist Layer */}
        <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-4">
          <div className="flex flex-col items-center gap-2 rounded-xl border border-slate-700 bg-slate-800/50 p-4 text-center">
            <Brain className="h-6 w-6 text-purple-400" />
            <span className="font-medium text-slate-200">Research Agent</span>
            <p className="text-xs text-slate-400">SEC Filings, News, Signals</p>
          </div>
          <div className="flex flex-col items-center gap-2 rounded-xl border border-slate-700 bg-slate-800/50 p-4 text-center">
            <Activity className="h-6 w-6 text-emerald-400" />
            <span className="font-medium text-slate-200">Opportunity Agent</span>
            <p className="text-xs text-slate-400">Scoring & Pain Points</p>
          </div>
          <div className="flex flex-col items-center gap-2 rounded-xl border border-slate-700 bg-slate-800/50 p-4 text-center">
            <Network className="h-6 w-6 text-orange-400" />
            <span className="font-medium text-slate-200">Outreach Agent</span>
            <p className="text-xs text-slate-400">Personalized Sequences</p>
          </div>
          <div className="flex flex-col items-center gap-2 rounded-xl border border-slate-700 bg-slate-800/50 p-4 text-center">
            <Database className="h-6 w-6 text-cyan-400" />
            <span className="font-medium text-slate-200">CRM Agent</span>
            <p className="text-xs text-slate-400">HubSpot/Salesforce Sync</p>
          </div>
        </div>

        <ArrowDown className="my-4 h-8 w-8 text-slate-600" />

        {/* Storage Layer */}
        <div className="flex w-full justify-center gap-12">
          <div className="flex flex-col items-center gap-4">
            <div className="flex w-64 items-center justify-center gap-4 rounded-2xl border border-orange-500/30 bg-orange-500/10 p-6 shadow-lg shadow-orange-500/5">
              <Database className="h-8 w-8 text-orange-400" />
              <h2 className="text-xl font-semibold text-orange-100">Firebase</h2>
            </div>
            <p className="text-sm text-slate-400">Auth, Firestore, Storage</p>
          </div>

          <div className="flex flex-col items-center gap-4">
            <div className="flex w-64 items-center justify-center gap-4 rounded-2xl border border-blue-500/30 bg-blue-500/10 p-6 shadow-lg shadow-blue-500/5">
              <Brain className="h-8 w-8 text-blue-400" />
              <h2 className="text-xl font-semibold text-blue-100">Google Gemini</h2>
            </div>
            <p className="text-sm text-slate-400">LLM Inference Engine</p>
          </div>
        </div>
      </div>
    </div>
  );
}

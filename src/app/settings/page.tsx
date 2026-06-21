import React from 'react';
import { Save, Key } from 'lucide-react';

export default function SettingsPage() {
  return (
    <div className="space-y-8 text-slate-100">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white md:text-4xl">Platform Settings</h1>
        <p className="mt-2 text-sm text-slate-400">
          Configure API credentials, Google Cloud properties, and agent system defaults.
        </p>
      </div>

      <div className="rounded-2xl border border-slate-800 bg-slate-900/30 p-6 space-y-6">
        <h2 className="text-md font-semibold text-slate-200 flex items-center gap-2">
          <Key className="h-5 w-5 text-indigo-400" /> API Credentials Manager
        </h2>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Gemini API Token</label>
            <input
              type="password"
              placeholder="••••••••••••••••••••••••••••"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 px-4 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Firebase Project ID</label>
            <input
              type="text"
              placeholder="e.g. b2b-agent-platform-prod"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 px-4 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        <div className="pt-6 border-t border-slate-800 flex justify-end">
          <button className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-500 transition-colors">
            <Save className="h-4 w-4" /> Save Settings
          </button>
        </div>
      </div>
    </div>
  );
}

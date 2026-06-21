import React from 'react';
import { Save, Key } from 'lucide-react';

export default function SettingsPage() {
  return (
    <div className="space-y-8 text-slate-100">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white md:text-4xl">
          Platform Settings
        </h1>
        <p className="mt-2 text-sm text-slate-400">
          Configure API credentials, Google Cloud properties, and agent system defaults.
        </p>
      </div>

      <div className="space-y-6 rounded-2xl border border-slate-800 bg-slate-900/30 p-6">
        <h2 className="text-md flex items-center gap-2 font-semibold text-slate-200">
          <Key className="h-5 w-5 text-indigo-400" /> API Credentials Manager
        </h2>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold tracking-wide text-slate-400 uppercase">
              Gemini API Token
            </label>
            <input
              type="password"
              placeholder="••••••••••••••••••••••••••••"
              className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-slate-200 focus:border-indigo-500 focus:outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold tracking-wide text-slate-400 uppercase">
              Firebase Project ID
            </label>
            <input
              type="text"
              placeholder="e.g. b2b-agent-platform-prod"
              className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-slate-200 focus:border-indigo-500 focus:outline-none"
            />
          </div>
        </div>

        <div className="flex justify-end border-t border-slate-800 pt-6">
          <button className="flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-indigo-500">
            <Save className="h-4 w-4" /> Save Settings
          </button>
        </div>
      </div>
    </div>
  );
}

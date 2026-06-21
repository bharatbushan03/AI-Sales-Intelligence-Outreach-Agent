import React from 'react';
import Link from 'next/link';
import { Bot, ArrowRight, ShieldCheck, Zap, Layers } from 'lucide-react';

export default function WelcomePage() {
  return (
    <div className="max-w-4xl mx-auto space-y-10 py-6 text-slate-100">
      {/* Hero Section */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-950 border border-indigo-900 text-indigo-400 text-xs font-semibold">
          <Bot className="h-4 w-4" /> Powered by Google Gemini & Vertex AI
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight text-white md:text-5xl leading-none">
          Autonomous B2B Sales <span className="text-indigo-400">Intelligence Platform</span>
        </h1>
        <p className="max-w-2xl mx-auto text-base text-slate-400">
          Orchestrate specialized AI agents to automate prospect research, synthesize opportunity analyses, generate outreach campaigns, and log data to CRMs seamlessly.
        </p>
        <div className="pt-4">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl transition-all shadow-lg shadow-indigo-600/10"
          >
            Enter Platform Dashboard <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

      {/* Core Pillars Feature Grid */}
      <div className="grid gap-6 md:grid-cols-3 pt-6">
        <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/40 space-y-3">
          <div className="h-10 w-10 rounded-xl bg-indigo-950 flex items-center justify-center text-indigo-400 border border-indigo-900/50">
            <Zap className="h-5 w-5" />
          </div>
          <h3 className="font-semibold text-slate-200 text-sm">Dynamic Orchestration</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            The Manager Agent parses goal intents and constructs execution workflows dynamically using Gemini reasoning models.
          </p>
        </div>

        <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/40 space-y-3">
          <div className="h-10 w-10 rounded-xl bg-emerald-950 flex items-center justify-center text-emerald-400 border border-emerald-900/50">
            <Layers className="h-5 w-5" />
          </div>
          <h3 className="font-semibold text-slate-200 text-sm">Grounded Intelligence</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Specialist agents ground analytical inferences using real-time search queries and uploaded enterprise files.
          </p>
        </div>

        <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/40 space-y-3">
          <div className="h-10 w-10 rounded-xl bg-amber-950 flex items-center justify-center text-amber-400 border border-amber-900/50">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <h3 className="font-semibold text-slate-200 text-sm">Enterprise Foundations</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Designed with secure client/admin SDK credentials, database isolation, and automated validation rules.
          </p>
        </div>
      </div>
    </div>
  );
}

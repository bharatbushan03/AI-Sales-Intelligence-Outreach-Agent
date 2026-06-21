import React from 'react';
import Link from 'next/link';
import { Bot, ArrowRight, ShieldCheck, Zap, Layers } from 'lucide-react';

export default function WelcomePage() {
  return (
    <div className="mx-auto max-w-4xl space-y-10 py-6 text-slate-100">
      {/* Hero Section */}
      <div className="space-y-4 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-indigo-900 bg-indigo-950 px-3 py-1 text-xs font-semibold text-indigo-400">
          <Bot className="h-4 w-4" /> Powered by Google Gemini & Vertex AI
        </div>
        <h1 className="text-4xl leading-none font-extrabold tracking-tight text-white md:text-5xl">
          Autonomous B2B Sales <span className="text-indigo-400">Intelligence Platform</span>
        </h1>
        <p className="mx-auto max-w-2xl text-base text-slate-400">
          Orchestrate specialized AI agents to automate prospect research, synthesize opportunity
          analyses, generate outreach campaigns, and log data to CRMs seamlessly.
        </p>
        <div className="pt-4">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 font-semibold text-white shadow-lg shadow-indigo-600/10 transition-all hover:bg-indigo-500"
          >
            Enter Platform Dashboard <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

      {/* Core Pillars Feature Grid */}
      <div className="grid gap-6 pt-6 md:grid-cols-3">
        <div className="space-y-3 rounded-2xl border border-slate-800 bg-slate-900/40 p-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-indigo-900/50 bg-indigo-950 text-indigo-400">
            <Zap className="h-5 w-5" />
          </div>
          <h3 className="text-sm font-semibold text-slate-200">Dynamic Orchestration</h3>
          <p className="text-xs leading-relaxed text-slate-400">
            The Manager Agent parses goal intents and constructs execution workflows dynamically
            using Gemini reasoning models.
          </p>
        </div>

        <div className="space-y-3 rounded-2xl border border-slate-800 bg-slate-900/40 p-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-emerald-900/50 bg-emerald-950 text-emerald-400">
            <Layers className="h-5 w-5" />
          </div>
          <h3 className="text-sm font-semibold text-slate-200">Grounded Intelligence</h3>
          <p className="text-xs leading-relaxed text-slate-400">
            Specialist agents ground analytical inferences using real-time search queries and
            uploaded enterprise files.
          </p>
        </div>

        <div className="space-y-3 rounded-2xl border border-slate-800 bg-slate-900/40 p-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-amber-900/50 bg-amber-950 text-amber-400">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <h3 className="text-sm font-semibold text-slate-200">Enterprise Foundations</h3>
          <p className="text-xs leading-relaxed text-slate-400">
            Designed with secure client/admin SDK credentials, database isolation, and automated
            validation rules.
          </p>
        </div>
      </div>
    </div>
  );
}

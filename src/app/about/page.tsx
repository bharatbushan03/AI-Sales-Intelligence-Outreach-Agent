import React from 'react';
import { Lightbulb, Target, Rocket, ShieldCheck, Zap } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-8 p-6">
      <div className="mb-4 text-center">
        <h1 className="text-4xl font-bold text-slate-100">About the Project</h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-400">
          Revolutionizing B2B outreach with autonomous AI agents.
        </p>
      </div>

      <div className="space-y-8">
        <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <div className="mb-4 flex items-center gap-3">
            <Target className="h-6 w-6 text-rose-400" />
            <h2 className="text-2xl font-semibold text-slate-100">Problem Statement</h2>
          </div>
          <p className="leading-relaxed text-slate-300">
            Modern B2B sales teams spend over 60% of their time on non-revenue generating tasks:
            manual research, CRM data entry, drafting generic emails, and piecing together context
            across disconnected tools. This leads to low conversion rates, burnout, and missed
            revenue targets.
          </p>
        </section>

        <section className="rounded-2xl border border-indigo-500/30 bg-indigo-900/20 p-6">
          <div className="mb-4 flex items-center gap-3">
            <Lightbulb className="h-6 w-6 text-indigo-400" />
            <h2 className="text-2xl font-semibold text-indigo-100">Our Solution</h2>
          </div>
          <p className="leading-relaxed text-indigo-200">
            A Multi-Agent System powered by Google Gemini that operates as a fully autonomous sales
            development representative (SDR) and solutions engineer. It conducts deep research on
            companies, scores intent, drafts hyper-personalized proposals, and executes
            multi-channel outreach—all orchestrated by an Executive Manager Agent.
          </p>
        </section>

        <section className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <div className="mb-4 flex items-center gap-3">
              <Zap className="h-6 w-6 text-yellow-400" />
              <h2 className="text-xl font-semibold text-slate-100">Business Impact</h2>
            </div>
            <ul className="list-inside list-disc space-y-3 text-slate-300">
              <li>10x increase in outbound volume</li>
              <li>300% higher reply rates via deep personalization</li>
              <li>Zero manual CRM data entry</li>
              <li>Instant scalable sales operations</li>
            </ul>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <div className="mb-4 flex items-center gap-3">
              <Rocket className="h-6 w-6 text-emerald-400" />
              <h2 className="text-xl font-semibold text-slate-100">Future Roadmap</h2>
            </div>
            <ul className="list-inside list-disc space-y-3 text-slate-300">
              <li>Voice AI for live cold calling</li>
              <li>Native LinkedIn Automation integration</li>
              <li>Automated meeting scheduling & calendar sync</li>
              <li>Predictive churn prevention models</li>
            </ul>
          </div>
        </section>

        <section className="flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <div>
            <h2 className="mb-2 text-xl font-semibold text-slate-100">Google Cloud ecosystem</h2>
            <p className="text-slate-400">Proudly built on Google Gemini & Firebase</p>
          </div>
          <ShieldCheck className="h-12 w-12 text-blue-400 opacity-50" />
        </section>
      </div>
    </div>
  );
}

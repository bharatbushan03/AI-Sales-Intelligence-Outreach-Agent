import React from 'react';
import Link from 'next/link';
import {
  Bot,
  ArrowRight,
  ShieldCheck,
  Zap,
  Layers,
  Brain,
  Target,
  BarChart3,
  Radio,
  Play,
  Network,
  Presentation,
  History,
  Sparkles,
} from 'lucide-react';

const WOW_FEATURES = [
  {
    href: '/war-room',
    icon: Zap,
    label: 'Sales War Room',
    desc: '5 autonomous agents collaborate live in real-time',
    color: 'from-yellow-500 to-orange-500',
    badge: 'WOW',
  },
  {
    href: '/intelligence',
    icon: Brain,
    label: 'Executive AI Copilot',
    desc: 'Strategy consultant answering "Should we target Stripe?"',
    color: 'from-violet-500 to-purple-500',
    badge: 'AI',
  },
  {
    href: '/research',
    icon: Target,
    label: 'One-Click Intel',
    desc: 'Enter URL → full company intelligence in seconds',
    color: 'from-emerald-500 to-teal-500',
    badge: '1-CLICK',
  },
  {
    href: '/proposals',
    icon: Presentation,
    label: 'Boardroom Mode',
    desc: 'CEO briefing, market position, revenue strategy deck',
    color: 'from-rose-500 to-pink-500',
    badge: 'DECK',
  },
  {
    href: '/memory',
    icon: Network,
    label: 'Knowledge Graph',
    desc: 'Explore company-competitor-opportunity relationships',
    color: 'from-cyan-500 to-blue-500',
    badge: 'GRAPH',
  },
  {
    href: '/analytics',
    icon: BarChart3,
    label: 'Predictive Revenue',
    desc: 'Best/Expected/Conservative case forecasting',
    color: 'from-amber-500 to-orange-500',
    badge: 'AI',
  },
  {
    href: '/workflow-visualizer',
    icon: Radio,
    label: 'Agent Visualizer',
    desc: 'See agent-to-agent messages flow in real-time',
    color: 'from-indigo-500 to-purple-500',
    badge: 'LIVE',
  },
  {
    href: '/settings',
    icon: History,
    label: 'Memory Time Machine',
    desc: 'Browse how agent knowledge evolved over time',
    color: 'from-teal-500 to-cyan-500',
    badge: 'HIST',
  },
  {
    href: '/dashboard',
    icon: LayoutDashboard,
    label: 'Command Center',
    desc: 'Premium executive dashboard for pipeline & KPIs',
    color: 'from-blue-500 to-indigo-500',
    badge: 'PRO',
  },
  {
    href: '/opportunities',
    icon: Play,
    label: 'Demo Mode',
    desc: 'Guided judge walkthrough of the entire platform',
    color: 'from-red-500 to-rose-500',
    badge: 'DEMO',
  },
];

export default function WelcomePage() {
  return (
    <div className="mx-auto max-w-6xl space-y-12 py-6 text-slate-100">
      {/* Hero Section */}
      <div className="space-y-6 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-indigo-900 bg-indigo-950/50 px-4 py-1.5 text-xs font-semibold text-indigo-400">
          <Sparkles className="h-3.5 w-3.5" /> Google AI Ecosystem · Gemini · Firebase · Cloud Run
        </div>
        <h1 className="text-4xl leading-tight font-black tracking-tight text-white md:text-6xl">
          Autonomous B2B Sales
          <br />
          <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Intelligence Platform
          </span>
        </h1>
        <p className="mx-auto max-w-2xl text-base text-slate-400">
          10 multi-agent AI features. One unforgettable demo. Orchestrate specialized agents to
          automate research, discover opportunities, generate outreach, and close deals — all
          powered by Google Gemini.
        </p>
        <div className="flex items-center justify-center gap-3 pt-2">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 font-semibold text-white shadow-lg shadow-indigo-600/20 transition-all hover:bg-indigo-500 hover:shadow-indigo-600/30"
          >
            Enter Platform <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/opportunities"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800/50 px-6 py-3 font-semibold text-slate-200 transition-all hover:bg-slate-700"
          >
            <Play className="h-4 w-4" /> Demo Mode
          </Link>
        </div>
      </div>

      {/* Wow Features Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {WOW_FEATURES.map((f) => {
          const Icon = f.icon;
          return (
            <Link
              key={f.href}
              href={f.href}
              className="group relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/40 p-5 transition-all hover:scale-[1.02] hover:border-slate-700 hover:bg-slate-900/60"
            >
              <div className="absolute top-0 right-0 h-32 w-32 translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br from-white/[0.02] to-transparent" />
              <div className="flex items-start gap-3.5">
                <div
                  className={`h-10 w-10 rounded-xl bg-gradient-to-br ${f.color} flex shrink-0 items-center justify-center shadow-lg`}
                >
                  <Icon className="h-5 w-5 text-white" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-semibold text-slate-200">{f.label}</h3>
                    <span
                      className={`rounded px-1.5 py-0.5 text-[8px] font-bold ${
                        f.badge === 'WOW'
                          ? 'bg-yellow-500/20 text-yellow-400'
                          : f.badge === 'AI'
                            ? 'bg-indigo-500/20 text-indigo-400'
                            : f.badge === 'DEMO'
                              ? 'bg-rose-500/20 text-rose-400'
                              : f.badge === 'LIVE'
                                ? 'bg-cyan-500/20 text-cyan-400'
                                : 'bg-emerald-500/20 text-emerald-400'
                      }`}
                    >
                      {f.badge}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-slate-500">{f.desc}</p>
                </div>
                <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-slate-600 transition-all group-hover:translate-x-0.5 group-hover:text-slate-400" />
              </div>
            </Link>
          );
        })}
      </div>

      {/* Google Technology Stack */}
      <div className="rounded-2xl border border-indigo-900/30 bg-indigo-950/20 p-6 text-center">
        <p className="mb-3 text-xs font-semibold tracking-widest text-indigo-400 uppercase">
          Powered By
        </p>
        <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400">
          <span className="flex items-center gap-1.5">
            <Bot className="h-3.5 w-3.5 text-indigo-400" /> Gemini
          </span>
          <span className="flex items-center gap-1.5">
            <Database className="h-3.5 w-3.5 text-indigo-400" /> Firebase
          </span>
          <span className="flex items-center gap-1.5">
            <Layers className="h-3.5 w-3.5 text-indigo-400" /> Firestore
          </span>
          <span className="flex items-center gap-1.5">
            <Cloud className="h-3.5 w-3.5 text-indigo-400" /> Cloud Run
          </span>
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="h-3.5 w-3.5 text-indigo-400" /> Google Cloud
          </span>
        </div>
      </div>
    </div>
  );
}

function LayoutDashboard(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <rect width="7" height="9" x="3" y="3" rx="1" />
      <rect width="7" height="5" x="14" y="3" rx="1" />
      <rect width="7" height="9" x="14" y="12" rx="1" />
      <rect width="7" height="5" x="3" y="16" rx="1" />
    </svg>
  );
}
function Database(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <ellipse cx="12" cy="5" rx="9" ry="3" />
      <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
      <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
    </svg>
  );
}
function Cloud(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z" />
    </svg>
  );
}

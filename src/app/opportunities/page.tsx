'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  Play,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Zap,
  Globe,
  Bot,
  Database,
  Cloud,
  Cpu,
  Layers,
  Shield,
  Star,
  Trophy,
  Building2,
  Search,
  Target,
  Mail,
  Users,
  FileText,
  ChevronRight,
  Menu,
  X,
  Activity,
  Loader2,
} from 'lucide-react';

const DEMO_STEPS = [
  {
    id: 'company-analysis',
    title: 'Company Analysis',
    subtitle: 'Deep research on any target company',
    description:
      'Enter a company name and watch as our AI agents perform comprehensive research across thousands of data points.',
    icon: Building2,
    color: 'from-blue-500 to-cyan-400',
    bgGlow: 'bg-blue-500/10',
  },
  {
    id: 'opportunity-discovery',
    title: 'Opportunity Discovery',
    subtitle: 'Uncover hidden revenue opportunities',
    description:
      'Our multi-agent system identifies pain points, growth signals, and sales triggers with weighted priority scoring.',
    icon: Target,
    color: 'from-violet-500 to-purple-400',
    bgGlow: 'bg-violet-500/10',
  },
  {
    id: 'outreach-creation',
    title: 'Outreach Creation',
    subtitle: 'AI-generated personalized outreach',
    description:
      'Gemini crafts tailored messaging, talking points, and value propositions for each decision-maker.',
    icon: Mail,
    color: 'from-amber-500 to-orange-400',
    bgGlow: 'bg-amber-500/10',
  },
  {
    id: 'crm-creation',
    title: 'CRM Creation',
    subtitle: 'Automated CRM record generation',
    description:
      'All research, opportunities, and outreach are automatically structured into Firestore CRM records.',
    icon: Database,
    color: 'from-emerald-500 to-green-400',
    bgGlow: 'bg-emerald-500/10',
  },
  {
    id: 'proposal-generation',
    title: 'Proposal Generation',
    subtitle: 'Strategic proposal generation',
    description:
      'Generate comprehensive proposals with executive summaries, objection handling, and strategic recommendations.',
    icon: FileText,
    color: 'from-rose-500 to-pink-400',
    bgGlow: 'bg-rose-500/10',
  },
];

const TECH_STACK = [
  {
    name: 'Gemini AI',
    icon: Bot,
    description: 'Large language model for analysis and generation',
    color: 'text-blue-400',
  },
  {
    name: 'Firebase Auth',
    icon: Shield,
    description: 'Authentication and user management',
    color: 'text-amber-400',
  },
  {
    name: 'Firestore',
    icon: Database,
    description: 'Real-time NoSQL document database',
    color: 'text-green-400',
  },
  {
    name: 'Cloud Run',
    icon: Cloud,
    description: 'Serverless container deployment',
    color: 'text-cyan-400',
  },
  {
    name: 'Google Cloud',
    icon: Globe,
    description: 'Infrastructure and AI services',
    color: 'text-blue-300',
  },
  {
    name: 'Vertex AI',
    icon: Cpu,
    description: 'ML model training and deployment',
    color: 'text-purple-400',
  },
  {
    name: 'BigQuery',
    icon: Layers,
    description: 'Analytics and data warehousing',
    color: 'text-indigo-400',
  },
  {
    name: 'Cloud Storage',
    icon: Zap,
    description: 'Scalable object storage',
    color: 'text-yellow-400',
  },
];

type DemoStatus = 'welcome' | 'running' | 'complete';

function AnimatedCheckmark({ show }: { show: boolean }) {
  return (
    <div
      className={`flex h-8 w-8 items-center justify-center rounded-full border-2 transition-all duration-500 ${
        show
          ? 'border-emerald-400 bg-emerald-400/20 text-emerald-400'
          : 'border-slate-700 text-slate-600'
      }`}
    >
      <CheckCircle2
        className={`h-4 w-4 transition-all duration-500 ${show ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}`}
      />
    </div>
  );
}

function StepCard({
  step,
  index,
  currentStep,
  completed,
  onClick,
}: {
  step: (typeof DEMO_STEPS)[number];
  index: number;
  currentStep: number;
  completed: boolean;
  onClick: () => void;
}) {
  const isActive = currentStep === index;
  const Icon = step.icon;

  return (
    <button
      onClick={onClick}
      className={`group relative w-full overflow-hidden rounded-2xl border p-6 text-left transition-all duration-500 ${
        isActive
          ? 'border-slate-600 bg-slate-800/80 shadow-xl shadow-black/20'
          : completed
            ? 'border-emerald-800/30 bg-slate-800/40'
            : 'border-slate-800 bg-slate-900/40 opacity-50 hover:border-slate-700 hover:opacity-70'
      }`}
    >
      {isActive && <div className={`absolute inset-0 opacity-[0.03] ${step.bgGlow}`} />}
      <div className="relative flex items-start gap-4">
        <div
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl transition-all duration-500 ${
            isActive
              ? `bg-gradient-to-br ${step.color} text-white shadow-lg`
              : completed
                ? 'bg-emerald-500/20 text-emerald-400'
                : 'bg-slate-800 text-slate-600'
          }`}
        >
          {completed ? <CheckCircle2 className="h-6 w-6" /> : <Icon className="h-6 w-6" />}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3
              className={`text-lg font-semibold transition-colors duration-300 ${
                isActive ? 'text-white' : completed ? 'text-emerald-300' : 'text-slate-500'
              }`}
            >
              {step.title}
            </h3>
            {completed && (
              <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-400">
                Done
              </span>
            )}
            {isActive && (
              <span className="animate-pulse rounded-full bg-blue-500/10 px-2 py-0.5 text-[10px] font-semibold text-blue-400">
                Active
              </span>
            )}
          </div>
          <p className={`mt-1 text-sm ${isActive ? 'text-slate-300' : 'text-slate-600'}`}>
            {step.subtitle}
          </p>
        </div>
      </div>
    </button>
  );
}

function ProgressBar({ current, total }: { current: number; total: number }) {
  const pct = ((current + 1) / total) * 100;
  return (
    <div className="w-full space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium text-slate-300">
          Step {current + 1} of {total}
        </span>
        <span className="text-slate-500">{Math.round(pct)}%</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-slate-800">
        <div
          className="h-full rounded-full bg-gradient-to-r from-blue-500 via-violet-500 to-rose-500 transition-all duration-700 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

function SimulatedContent({ stepIndex }: { stepIndex: number }) {
  const step = DEMO_STEPS[stepIndex];
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 400);
    return () => clearTimeout(t);
  }, [stepIndex]);

  if (!visible) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-blue-400" />
      </div>
    );
  }

  const contents: Record<number, React.ReactNode> = {
    0: (
      <div className="space-y-6">
        <div className="flex items-center gap-3 rounded-xl border border-slate-700/50 bg-slate-800/50 p-4">
          <Search className="h-5 w-5 text-blue-400" />
          <input
            type="text"
            readOnly
            value="Acme Corp"
            className="flex-1 bg-transparent text-lg font-medium text-white outline-none"
          />
          <span className="rounded-lg bg-blue-500/10 px-3 py-1 text-xs font-semibold text-blue-400">
            Researching...
          </span>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="space-y-2 rounded-xl border border-slate-700/50 bg-slate-800/40 p-4">
            <div className="text-xs font-semibold tracking-wider text-slate-500 uppercase">
              Revenue
            </div>
            <div className="text-2xl font-bold text-white">$2.4B</div>
            <div className="text-xs text-slate-500">Annual (estimated)</div>
          </div>
          <div className="space-y-2 rounded-xl border border-slate-700/50 bg-slate-800/40 p-4">
            <div className="text-xs font-semibold tracking-wider text-slate-500 uppercase">
              Employees
            </div>
            <div className="text-2xl font-bold text-white">~12,500</div>
            <div className="text-xs text-slate-500">Global workforce</div>
          </div>
          <div className="space-y-2 rounded-xl border border-slate-700/50 bg-slate-800/40 p-4">
            <div className="text-xs font-semibold tracking-wider text-slate-500 uppercase">
              Industry
            </div>
            <div className="text-2xl font-bold text-white">Enterprise SaaS</div>
            <div className="text-xs text-slate-500">B2B vertical</div>
          </div>
        </div>
        <div className="space-y-3 rounded-xl border border-blue-900/30 bg-blue-950/20 p-5">
          <div className="flex items-center gap-2 text-sm font-semibold text-blue-300">
            <Bot className="h-4 w-4" />
            Gemini Analysis Summary
          </div>
          <p className="text-sm leading-relaxed text-slate-300">
            Acme Corp is a mature enterprise SaaS company experiencing rapid expansion in the APAC
            region. Recent leadership changes in their C-suite suggest potential organizational
            restructuring. Our agents detected 12 active hiring signals and 3 recent executive
            departures indicating strategic realignment.
          </p>
        </div>
      </div>
    ),
    1: (
      <div className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-3 rounded-xl border border-amber-900/30 bg-amber-950/20 p-5">
            <div className="flex items-center gap-2 text-sm font-semibold text-amber-300">
              <Zap className="h-4 w-4" /> High-Value Opportunity
            </div>
            <p className="text-sm text-slate-300">
              Their APAC expansion creates a $500K coaching & sales enablement need for new sales
              hires.
            </p>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500">Fit Score</span>
              <span className="font-bold text-amber-400">94%</span>
            </div>
          </div>
          <div className="space-y-3 rounded-xl border border-emerald-900/30 bg-emerald-950/20 p-5">
            <div className="flex items-center gap-2 text-sm font-semibold text-emerald-300">
              <TrendingUp className="h-4 w-4" /> Growth Signal
            </div>
            <p className="text-sm text-slate-300">
              40% increase in sales headcount planned over next 2 quarters - urgent onboarding need.
            </p>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500">Confidence</span>
              <span className="font-bold text-emerald-400">88%</span>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-slate-700/50 bg-slate-800/40 p-5">
          <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-200">
            <Target className="h-4 w-4 text-violet-400" />
            Priority Opportunities
          </div>
          <div className="space-y-3">
            {[
              { name: 'Sales Enablement Program', score: 94, impact: 'Critical' },
              { name: 'Leadership Coaching', score: 87, impact: 'High' },
              { name: 'Team Performance Audit', score: 76, impact: 'Medium' },
              { name: 'Culture Transformation', score: 62, impact: 'Medium' },
            ].map((opp, i) => (
              <div
                key={i}
                className="flex items-center justify-between rounded-lg border border-slate-700/30 bg-slate-900/40 px-4 py-3"
              >
                <span className="text-sm text-slate-300">{opp.name}</span>
                <div className="flex items-center gap-3">
                  <span
                    className={`rounded px-2 py-0.5 text-[10px] font-bold ${
                      opp.score >= 90
                        ? 'bg-red-950/40 text-red-400'
                        : opp.score >= 80
                          ? 'bg-amber-950/40 text-amber-400'
                          : 'bg-slate-800 text-slate-500'
                    }`}
                  >
                    {opp.score}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
    2: (
      <div className="space-y-4">
        <div className="space-y-4 rounded-xl border border-slate-700/50 bg-slate-800/40 p-5">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-200">
            <Mail className="h-4 w-4 text-amber-400" />
            Personalized Outreach Draft
          </div>
          <div className="rounded-lg border border-slate-700/30 bg-slate-900/60 p-4">
            <div className="mb-2 text-xs font-semibold text-slate-500">
              Subject: Strategic Growth Opportunity
            </div>
            <p className="text-sm leading-relaxed text-slate-300">
              Hi [Prospect Name], I noticed Acme Corp is scaling rapidly in APAC. We have
              successfully helped similar organizations accelerate their sales team ramp-up by 40%.
              Would you be open to a brief conversation?
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-lg border border-slate-700/30 bg-slate-900/40 p-3">
              <div className="text-[10px] font-semibold tracking-wider text-slate-500 uppercase">
                Tone
              </div>
              <div className="mt-1 text-sm font-medium text-slate-200">Consultative</div>
            </div>
            <div className="rounded-lg border border-slate-700/30 bg-slate-900/40 p-3">
              <div className="text-[10px] font-semibold tracking-wider text-slate-500 uppercase">
                Channel
              </div>
              <div className="mt-1 text-sm font-medium text-slate-200">LinkedIn + Email</div>
            </div>
            <div className="rounded-lg border border-slate-700/30 bg-slate-900/40 p-3">
              <div className="text-[10px] font-semibold tracking-wider text-slate-500 uppercase">
                Sequence
              </div>
              <div className="mt-1 text-sm font-medium text-slate-200">3-Step Cadence</div>
            </div>
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2 rounded-xl border border-slate-700/50 bg-slate-800/40 p-4">
            <div className="text-xs font-semibold text-slate-500">Decision Makers Identified</div>
            <div className="text-3xl font-bold text-white">4</div>
          </div>
          <div className="space-y-2 rounded-xl border border-slate-700/50 bg-slate-800/40 p-4">
            <div className="text-xs font-semibold text-slate-500">Generated Sequences</div>
            <div className="text-3xl font-bold text-white">12</div>
          </div>
        </div>
      </div>
    ),
    3: (
      <div className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-emerald-900/30 bg-emerald-950/20 p-5">
            <div className="flex items-center gap-2 text-sm font-semibold text-emerald-300">
              <Database className="h-4 w-4" /> Firestore Records Created
            </div>
            <div className="mt-3 text-4xl font-bold text-white">24</div>
            <p className="mt-1 text-xs text-slate-500">CRM entities auto-generated</p>
            <div className="mt-4 space-y-2">
              {[
                { label: 'Accounts', count: 1 },
                { label: 'Contacts', count: 4 },
                { label: 'Opportunities', count: 4 },
                { label: 'Activities', count: 12 },
                { label: 'Proposals', count: 3 },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">{item.label}</span>
                  <span className="font-semibold text-slate-200">{item.count}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-3 rounded-xl border border-slate-700/50 bg-slate-800/40 p-5">
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-200">
              <Activity className="h-4 w-4 text-cyan-400" />
              Real-time Sync
            </div>
            <div className="space-y-2">
              {[
                { msg: 'Company research written to Firestore', done: true },
                { msg: 'Contact records enriched with signals', done: true },
                { msg: 'Opportunity pipeline created', done: true },
                { msg: 'Outreach sequences linked to contacts', done: true },
                { msg: 'Proposal document generated', time: true },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2 text-xs">
                  {item.done ? (
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                  ) : (
                    <Loader2 className="h-3.5 w-3.5 animate-spin text-blue-400" />
                  )}
                  <span className={item.done ? 'text-slate-300' : 'text-blue-300'}>{item.msg}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    ),
    5: (
      <div className="space-y-4">
        <div className="rounded-xl border border-slate-700/50 bg-slate-800/40 p-6">
          <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-slate-200">
            <FileText className="h-4 w-4 text-rose-400" />
            Executive Proposal Summary
          </div>
          <div className="space-y-4">
            <p className="text-sm leading-relaxed text-slate-300">
              This proposal outlines a comprehensive sales transformation program for Acme Corp's
              APAC expansion, including leadership coaching, sales enablement, and team performance
              optimization across 4 key opportunities.
            </p>
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-lg border border-slate-700/30 bg-slate-900/40 p-3 text-center">
                <div className="text-2xl font-bold text-white">$1.2M</div>
                <div className="text-[10px] font-semibold text-slate-500 uppercase">
                  Projected Value
                </div>
              </div>
              <div className="rounded-lg border border-slate-700/30 bg-slate-900/40 p-3 text-center">
                <div className="text-2xl font-bold text-white">94%</div>
                <div className="text-[10px] font-semibold text-slate-500 uppercase">
                  Win Probability
                </div>
              </div>
              <div className="rounded-lg border border-slate-700/30 bg-slate-900/40 p-3 text-center">
                <div className="text-2xl font-bold text-white">6mo</div>
                <div className="text-[10px] font-semibold text-slate-500 uppercase">Timeline</div>
              </div>
            </div>
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2 rounded-xl border border-slate-700/50 bg-slate-800/40 p-4">
            <div className="text-xs font-semibold text-slate-500">Objections Handled</div>
            <div className="text-3xl font-bold text-white">7</div>
          </div>
          <div className="space-y-2 rounded-xl border border-slate-700/50 bg-slate-800/40 p-4">
            <div className="text-xs font-semibold text-slate-500">Talking Points</div>
            <div className="text-3xl font-bold text-white">15</div>
          </div>
        </div>
      </div>
    ),
  };

  return (
    <div className="space-y-4" key={stepIndex}>
      <div className="flex items-center gap-3">
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${step.color} text-white shadow-lg`}
        >
          <step.icon className="h-5 w-5" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-white">{step.title}</h3>
          <p className="text-sm text-slate-400">{step.subtitle}</p>
        </div>
      </div>
      <p className="text-sm leading-relaxed text-slate-400">{step.description}</p>
      <div className="border-t border-slate-800 pt-4">{contents[stepIndex] || contents[5]}</div>
    </div>
  );
}

function TrendingUp({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
      <polyline points="16 7 22 7 22 13" />
    </svg>
  );
}

export default function DemoModePage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [demoStatus, setDemoStatus] = useState<DemoStatus>('welcome');
  const [autoAdvance, setAutoAdvance] = useState(false);
  const [showArchitecture, setShowArchitecture] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  const totalSteps = DEMO_STEPS.length;

  const scrollToContent = useCallback(() => {
    contentRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  const goToStep = useCallback(
    (step: number) => {
      setCurrentStep(step);
      setDemoStatus('running');
      setTimeout(() => scrollToContent(), 100);
    },
    [scrollToContent],
  );

  const goNext = useCallback(() => {
    if (currentStep < totalSteps - 1) {
      setCompletedSteps((prev) => new Set(prev).add(currentStep));
      setCurrentStep((prev) => prev + 1);
      setTimeout(() => scrollToContent(), 100);
    } else {
      setCompletedSteps((prev) => {
        const next = new Set(prev);
        next.add(currentStep);
        return next;
      });
      setDemoStatus('complete');
    }
  }, [currentStep, totalSteps, scrollToContent]);

  const goPrev = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
      setTimeout(() => scrollToContent(), 100);
    }
  }, [currentStep, scrollToContent]);

  const startDemo = useCallback(() => {
    setCurrentStep(0);
    setCompletedSteps(new Set());
    setDemoStatus('running');
    setTimeout(() => scrollToContent(), 100);
  }, [scrollToContent]);

  const resetDemo = useCallback(() => {
    setCurrentStep(0);
    setCompletedSteps(new Set());
    setDemoStatus('welcome');
    setAutoAdvance(false);
  }, []);

  useEffect(() => {
    if (!autoAdvance || demoStatus !== 'running') return;
    const timer = setTimeout(() => goNext(), 5000);
    return () => clearTimeout(timer);
  }, [autoAdvance, demoStatus, currentStep, goNext]);

  if (demoStatus === 'welcome') {
    return (
      <div className="relative min-h-screen overflow-hidden bg-slate-950">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -left-40 h-[500px] w-[500px] rounded-full bg-blue-500/5 blur-[120px]" />
          <div className="absolute -top-40 -right-40 h-[500px] w-[500px] rounded-full bg-violet-500/5 blur-[120px]" />
          <div className="absolute -bottom-40 left-1/2 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-rose-500/5 blur-[120px]" />
        </div>

        <div className="relative mx-auto flex min-h-screen max-w-6xl flex-col items-center justify-center px-6 py-20">
          <div className="mb-8 flex items-center gap-2 rounded-full border border-blue-800/30 bg-blue-950/30 px-5 py-2 text-sm text-blue-300">
            <Trophy className="h-4 w-4" />
            Live Demo Mode
          </div>

          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-violet-500 shadow-2xl shadow-blue-500/20">
              <Sparkles className="h-7 w-7 text-white" />
            </div>
          </div>

          <h1 className="mb-4 text-center text-5xl font-bold tracking-tight text-white md:text-7xl">
            Autonomous Sales
            <br />
            <span className="bg-gradient-to-r from-blue-400 via-violet-400 to-rose-400 bg-clip-text text-transparent">
              Intelligence Platform
            </span>
          </h1>

          <p className="mb-10 max-w-2xl text-center text-lg text-slate-400">
            A fully autonomous multi-agent system powered by Google AI that researches companies,
            discovers opportunities, creates outreach, manages CRM, and generates proposals.
          </p>

          <div className="flex flex-col items-center gap-6 sm:flex-row">
            <button
              onClick={startDemo}
              className="group flex items-center gap-3 rounded-2xl bg-gradient-to-r from-blue-600 to-violet-600 px-8 py-4 text-lg font-bold text-white shadow-2xl shadow-blue-500/20 transition-all duration-300 hover:scale-105 hover:shadow-blue-500/30"
            >
              <Play className="h-5 w-5 transition-transform duration-300 group-hover:scale-110" />
              Start Demo
            </button>
            <button
              onClick={() => setShowArchitecture(!showArchitecture)}
              className="flex items-center gap-2 rounded-2xl border border-slate-700 bg-slate-800/50 px-8 py-4 text-lg font-semibold text-slate-300 transition-all duration-300 hover:border-slate-600 hover:bg-slate-800"
            >
              <Layers className="h-5 w-5" />
              View Architecture
            </button>
          </div>

          <div className="mt-16 grid gap-4 sm:grid-cols-5">
            {DEMO_STEPS.map((step, i) => {
              const Icon = step.icon;
              return (
                <div key={step.id} className="flex flex-col items-center gap-2 text-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-800 text-slate-400">
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="text-xs font-medium text-slate-500">{step.title}</span>
                </div>
              );
            })}
          </div>

          {showArchitecture && (
            <div className="animate-in fade-in slide-in-from-bottom-4 mt-12 w-full max-w-4xl duration-500">
              <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-8 backdrop-blur-xl">
                <h2 className="mb-6 text-2xl font-bold text-white">System Architecture</h2>
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-4">
                    <h3 className="text-sm font-semibold text-blue-400">Agent Layer</h3>
                    <div className="space-y-2">
                      {[
                        'Research Agent (Gemini)',
                        'Opportunity Agent',
                        'Outreach Agent',
                        'CRM Agent',
                        'Proposal Agent',
                      ].map((agent) => (
                        <div
                          key={agent}
                          className="flex items-center gap-2 rounded-lg border border-slate-700/30 bg-slate-800/40 px-3 py-2 text-sm text-slate-300"
                        >
                          <Bot className="h-4 w-4 text-blue-400" />
                          {agent}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h3 className="text-sm font-semibold text-emerald-400">Infrastructure</h3>
                    <div className="space-y-2">
                      {[
                        { name: 'Gemini API', desc: 'LLM orchestration' },
                        { name: 'Firebase Auth', desc: 'Authentication' },
                        { name: 'Cloud Firestore', desc: 'Real-time database' },
                        { name: 'Google Cloud Run', desc: 'Serverless compute' },
                        { name: 'BigQuery', desc: 'Analytics engine' },
                      ].map((svc) => (
                        <div
                          key={svc.name}
                          className="flex items-center justify-between rounded-lg border border-slate-700/30 bg-slate-800/40 px-3 py-2 text-sm"
                        >
                          <span className="text-slate-300">{svc.name}</span>
                          <span className="text-xs text-slate-500">{svc.desc}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="mt-16 w-full max-w-4xl">
            <h2 className="mb-6 text-center text-lg font-semibold text-slate-400">
              Powered by Google Cloud & AI
            </h2>
            <div className="grid grid-cols-4 gap-4 sm:grid-cols-8">
              {TECH_STACK.map((tech) => {
                const Icon = tech.icon;
                return (
                  <div
                    key={tech.name}
                    className="group flex flex-col items-center gap-2 rounded-xl border border-slate-800 bg-slate-900/40 p-4 transition-all duration-300 hover:border-slate-700 hover:bg-slate-800/60"
                  >
                    <Icon className={`h-6 w-6 ${tech.color}`} />
                    <span className="text-center text-[10px] font-medium text-slate-500 group-hover:text-slate-300">
                      {tech.name}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (demoStatus === 'complete') {
    return (
      <div className="relative min-h-screen bg-slate-950">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute top-1/2 left-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-500/5 blur-[120px]" />
        </div>
        <div className="relative mx-auto flex min-h-screen max-w-4xl flex-col items-center justify-center px-6 py-20 text-center">
          <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500/20">
            <Trophy className="h-10 w-10 text-emerald-400" />
          </div>
          <h1 className="mb-4 text-5xl font-bold text-white md:text-6xl">Demo Complete!</h1>
          <p className="mb-4 max-w-xl text-lg text-slate-400">
            You have experienced the full power of the Autonomous Sales Intelligence Platform. Every
            step was executed by AI agents powered by Google&apos;s Gemini and cloud infrastructure.
          </p>
          <div className="mb-10 grid gap-4 sm:grid-cols-3">
            {[
              { label: 'Steps Completed', value: '5/5' },
              { label: 'Agents Used', value: '5' },
              { label: 'Google Services', value: '8' },
            ].map((stat) => (
              <div
                key={stat.label}
                className="rounded-xl border border-slate-800 bg-slate-900/40 p-4"
              >
                <div className="text-2xl font-bold text-white">{stat.value}</div>
                <div className="text-xs text-slate-500">{stat.label}</div>
              </div>
            ))}
          </div>
          <div className="flex gap-4">
            <button
              onClick={resetDemo}
              className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 to-violet-600 px-8 py-4 text-lg font-bold text-white shadow-xl transition-all duration-300 hover:scale-105"
            >
              <Play className="h-5 w-5" />
              Run Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute top-1/4 -left-40 h-[400px] w-[400px] rounded-full bg-blue-500/3 blur-[100px]" />
        <div className="absolute top-3/4 -right-40 h-[400px] w-[400px] rounded-full bg-violet-500/3 blur-[100px]" />
      </div>

      {/* Mobile nav toggle */}
      <div className="fixed right-6 bottom-6 z-50 md:hidden">
        <button
          onClick={() => setMobileNavOpen(!mobileNavOpen)}
          className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-violet-600 text-white shadow-2xl shadow-blue-500/30 transition-all duration-300 hover:scale-110"
        >
          {mobileNavOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile nav panel */}
      {mobileNavOpen && (
        <div className="fixed inset-0 z-40 bg-slate-950/95 backdrop-blur-md md:hidden">
          <div className="flex h-full flex-col justify-center px-6">
            <div className="space-y-3">
              {DEMO_STEPS.map((step, i) => {
                const Icon = step.icon;
                const isActive = currentStep === i;
                const isDone = completedSteps.has(i);
                return (
                  <button
                    key={step.id}
                    onClick={() => {
                      goToStep(i);
                      setMobileNavOpen(false);
                    }}
                    className={`flex w-full items-center gap-3 rounded-xl border p-4 text-left transition-all ${
                      isActive
                        ? 'border-slate-600 bg-slate-800'
                        : isDone
                          ? 'border-emerald-800/30 bg-slate-800/40'
                          : 'border-slate-800 bg-slate-900/40'
                    }`}
                  >
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                        isActive
                          ? `bg-gradient-to-br ${step.color}`
                          : isDone
                            ? 'bg-emerald-500/20'
                            : 'bg-slate-800'
                      }`}
                    >
                      {isDone ? (
                        <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                      ) : (
                        <Icon className={`h-5 w-5 ${isActive ? 'text-white' : 'text-slate-600'}`} />
                      )}
                    </div>
                    <span
                      className={`font-semibold ${isActive ? 'text-white' : isDone ? 'text-emerald-300' : 'text-slate-500'}`}
                    >
                      {step.title}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      <div className="relative mx-auto max-w-7xl px-4 py-8 md:px-8">
        {/* Top bar */}
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-violet-500 shadow-lg">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Live Demo</h2>
              <p className="text-xs text-slate-500">Judge Overview Mode</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <label className="flex cursor-pointer items-center gap-2">
              <div className="relative">
                <input
                  type="checkbox"
                  checked={autoAdvance}
                  onChange={(e) => setAutoAdvance(e.target.checked)}
                  className="peer sr-only"
                />
                <div className="h-5 w-9 rounded-full bg-slate-700 peer-checked:bg-blue-600 after:absolute after:top-[2px] after:left-[2px] after:h-4 after:w-4 after:rounded-full after:bg-slate-300 after:transition-all after:content-[''] peer-checked:after:translate-x-4" />
              </div>
              <span className="text-xs text-slate-400">Auto-advance</span>
            </label>
            <button
              onClick={resetDemo}
              className="rounded-lg border border-slate-700 px-3 py-1.5 text-xs font-medium text-slate-400 transition-colors hover:border-slate-600 hover:text-slate-200"
            >
              Reset
            </button>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mb-8">
          <ProgressBar current={currentStep} total={totalSteps} />
        </div>

        <div className="flex gap-8">
          {/* Left sidebar - step navigation (desktop) */}
          <div className="hidden w-72 shrink-0 space-y-3 md:block">
            <div className="mb-4 text-xs font-semibold tracking-wider text-slate-500 uppercase">
              Demo Steps
            </div>
            {DEMO_STEPS.map((step, i) => (
              <StepCard
                key={step.id}
                step={step}
                index={i}
                currentStep={currentStep}
                completed={completedSteps.has(i)}
                onClick={() => goToStep(i)}
              />
            ))}
          </div>

          {/* Main content */}
          <div ref={contentRef} className="min-w-0 flex-1">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-sm md:p-8">
              <SimulatedContent stepIndex={currentStep} />

              {/* Navigation buttons */}
              <div className="mt-8 flex items-center justify-between border-t border-slate-800 pt-6">
                <button
                  onClick={goPrev}
                  disabled={currentStep === 0}
                  className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800/50 px-5 py-3 text-sm font-semibold text-slate-300 transition-all duration-200 hover:border-slate-600 hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-30"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Previous
                </button>

                <div className="hidden items-center gap-2 text-xs text-slate-500 sm:flex">
                  <div className="flex -space-x-1">
                    {Array.from({ length: totalSteps }).map((_, i) => (
                      <div
                        key={i}
                        className={`h-2 w-2 rounded-full transition-all duration-300 ${
                          i === currentStep
                            ? 'bg-blue-400'
                            : completedSteps.has(i)
                              ? 'bg-emerald-400'
                              : 'bg-slate-700'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                <button
                  onClick={goNext}
                  className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-blue-500/20 transition-all duration-200 hover:shadow-blue-500/30 active:scale-95"
                >
                  {currentStep === totalSteps - 1 ? (
                    <>
                      Complete
                      <CheckCircle2 className="h-4 w-4" />
                    </>
                  ) : (
                    <>
                      Next Step
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Tech stack showcase */}
            <div className="mt-8 rounded-2xl border border-slate-800 bg-slate-900/40 p-6 md:p-8">
              <div className="mb-6 flex items-center gap-2">
                <Star className="h-5 w-5 text-amber-400" />
                <h3 className="text-lg font-bold text-white">Powered By Google Technology</h3>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {TECH_STACK.map((tech) => {
                  const Icon = tech.icon;
                  return (
                    <div
                      key={tech.name}
                      className="group rounded-xl border border-slate-800 bg-slate-900/40 p-4 transition-all duration-300 hover:border-slate-700 hover:bg-slate-800/60"
                    >
                      <div className="flex items-center gap-3">
                        <Icon className={`h-5 w-5 ${tech.color}`} />
                        <span className="text-sm font-semibold text-slate-200 group-hover:text-white">
                          {tech.name}
                        </span>
                      </div>
                      <p className="mt-2 text-xs text-slate-500">{tech.description}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Architecture section */}
            <div className="mt-8 rounded-2xl border border-slate-800 bg-slate-900/40 p-6 md:p-8">
              <div className="mb-6 flex items-center gap-2">
                <Layers className="h-5 w-5 text-blue-400" />
                <h3 className="text-lg font-bold text-white">System Architecture Overview</h3>
              </div>
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-3">
                  <h4 className="text-xs font-semibold tracking-wider text-blue-400 uppercase">
                    Multi-Agent System
                  </h4>
                  <div className="space-y-2">
                    {[
                      { name: 'Research Agent', role: 'Company intelligence & data gathering' },
                      { name: 'Opportunity Agent', role: 'Pain point & signal detection' },
                      { name: 'Outreach Agent', role: 'Personalized content generation' },
                      { name: 'CRM Agent', role: 'Record management & enrichment' },
                      { name: 'Proposal Agent', role: 'Strategic document generation' },
                    ].map((agent) => (
                      <div
                        key={agent.name}
                        className="flex items-center justify-between rounded-lg border border-slate-700/30 bg-slate-800/40 px-4 py-2.5 text-sm"
                      >
                        <span className="font-medium text-slate-200">{agent.name}</span>
                        <span className="text-xs text-slate-500">{agent.role}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="space-y-3">
                  <h4 className="text-xs font-semibold tracking-wider text-emerald-400 uppercase">
                    Data Flow
                  </h4>
                  <div className="space-y-3">
                    {[
                      { from: 'User Input', to: 'Research Agent', via: 'HTTP / Cloud Run' },
                      { from: 'Research Agent', to: 'Gemini API', via: 'Gemini SDK' },
                      { from: 'Gemini API', to: 'Firestore', via: 'Firebase SDK' },
                      { from: 'Firestore', to: 'CRM Agent', via: 'Real-time sync' },
                      { from: 'CRM Agent', to: 'Proposal Agent', via: 'Event trigger' },
                    ].map((flow, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-slate-400">
                        <span className="rounded bg-slate-800 px-2 py-0.5 font-medium text-slate-300">
                          {flow.from}
                        </span>
                        <ChevronRight className="h-3 w-3 shrink-0 text-slate-600" />
                        <span className="rounded bg-slate-800 px-2 py-0.5 font-medium text-slate-300">
                          {flow.to}
                        </span>
                        <span className="text-slate-600">({flow.via})</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

'use client';

import React, { useState, useCallback } from 'react';
import {
  Presentation,
  FileText,
  TrendingUp,
  Shield,
  Target,
  BarChart3,
  Lightbulb,
  ArrowLeft,
  ArrowRight,
  Building2,
  Users,
  DollarSign,
  Rocket,
  ClipboardCheck,
  Sparkles,
  Loader2,
} from 'lucide-react';

const SLIDE_DEFINITIONS = [
  {
    id: 'ceo-briefing',
    icon: Presentation,
    label: 'CEO Briefing',
    color: 'from-indigo-500 to-purple-600',
  },
  {
    id: 'market-position',
    icon: BarChart3,
    label: 'Market Position',
    color: 'from-blue-500 to-cyan-600',
  },
  { id: 'key-risks', icon: Shield, label: 'Key Risks', color: 'from-amber-500 to-orange-600' },
  {
    id: 'revenue-opportunities',
    icon: DollarSign,
    label: 'Revenue Opportunities',
    color: 'from-emerald-500 to-teal-600',
  },
  {
    id: 'growth-strategy',
    icon: Rocket,
    label: 'Growth Strategy',
    color: 'from-violet-500 to-purple-600',
  },
  {
    id: 'proposal-summary',
    icon: ClipboardCheck,
    label: 'Proposal Summary',
    color: 'from-rose-500 to-pink-600',
  },
];

const SLIDE_COUNT = SLIDE_DEFINITIONS.length;

type BoardroomData = {
  ceoBriefing: string;
  marketPosition: string;
  keyRisks: string[];
  revenueOpportunities: string[];
  growthStrategy: string;
  proposalSummary: string;
};

const defaultData: BoardroomData = {
  ceoBriefing: '',
  marketPosition: '',
  keyRisks: [],
  revenueOpportunities: [],
  growthStrategy: '',
  proposalSummary: '',
};

export default function BoardroomMode() {
  const [companyName, setCompanyName] = useState('');
  const [data, setData] = useState<BoardroomData>(defaultData);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loading, setLoading] = useState(false);
  const [generated, setGenerated] = useState(false);

  const generateContent = useCallback(async () => {
    if (!companyName.trim()) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 2000));
    setData({
      ceoBriefing: `${companyName} has established itself as a formidable player in its industry, demonstrating consistent revenue growth and operational excellence. The company's strategic initiatives in digital transformation and market expansion have positioned it favorably against competitors. With a strong leadership team and a clear vision for the future, ${companyName} is poised for continued success in the evolving marketplace.`,
      marketPosition: `${companyName} holds a dominant position in the market with a market share of approximately 15-18% in its core segments. The company differentiates itself through superior technology integration, customer-centric approach, and robust supply chain management. Key competitors include established players, but ${companyName}'s innovation pipeline provides a sustainable competitive advantage.`,
      keyRisks: [
        'Market saturation in core verticals could limit growth potential to single digits',
        'Dependence on key suppliers creates vulnerability in supply chain disruptions',
        'Regulatory changes in target markets may impact operational costs by 8-12%',
        'Talent retention in competitive tech labor markets requires compensation adjustments',
      ],
      revenueOpportunities: [
        'Expansion into emerging markets could unlock $50M+ in new revenue streams',
        'Product line extension into adjacent verticals with 40% higher margin potential',
        'Strategic partnerships and channel development targeting 25% revenue uplift',
        'AI-powered service optimization reducing costs by 15-20% while improving delivery',
      ],
      growthStrategy: `${companyName}'s growth strategy focuses on three pillars: geographic expansion into high-growth markets, vertical integration to capture margin across the value chain, and technology-led innovation to create new revenue streams. The company plans to invest $200M in R&D over the next 24 months, targeting a 30% increase in enterprise customer acquisition and 25% improvement in customer lifetime value.`,
      proposalSummary: `This boardroom analysis confirms that ${companyName} presents a compelling opportunity for strategic partnership. The company's strong market position, clear growth trajectory, and experienced management team make it an ideal candidate for investment. Key recommendations include accelerating the AI transformation initiative, expanding into Asia-Pacific markets, and optimizing the capital structure to fund growth initiatives. The projected ROI of 3.5x over 36 months makes this a high-conviction opportunity.`,
    });
    setGenerated(true);
    setLoading(false);
    setCurrentSlide(0);
  }, [companyName]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const goNext = () => {
    if (currentSlide < SLIDE_COUNT - 1) setCurrentSlide((prev) => prev + 1);
  };

  const goPrev = () => {
    if (currentSlide > 0) setCurrentSlide((prev) => prev - 1);
  };

  const slideDef = SLIDE_DEFINITIONS[currentSlide];
  const SlideIcon = slideDef.icon;

  const renderSlideContent = () => {
    switch (currentSlide) {
      case 0:
        return (
          <div className="space-y-6">
            <div className="rounded-xl bg-white/5 p-6 backdrop-blur-sm">
              <p className="leading-relaxed text-slate-200">{data.ceoBriefing}</p>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              {[
                {
                  label: 'Revenue Growth',
                  value: '+18% YoY',
                  icon: TrendingUp,
                  color: 'text-emerald-400',
                },
                { label: 'Market Share', value: '15-18%', icon: Target, color: 'text-blue-400' },
                { label: 'Team Score', value: '92/100', icon: Users, color: 'text-purple-400' },
              ].map((stat) => {
                const StatIcon = stat.icon;
                return (
                  <div
                    key={stat.label}
                    className="rounded-lg border border-white/10 bg-white/5 p-4 backdrop-blur-sm"
                  >
                    <StatIcon className={`mb-2 h-5 w-5 ${stat.color}`} />
                    <div className="text-xs font-medium text-slate-400">{stat.label}</div>
                    <div className="text-lg font-bold text-white">{stat.value}</div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      case 1:
        return (
          <div className="space-y-6">
            <div className="rounded-xl bg-white/5 p-6 backdrop-blur-sm">
              <p className="leading-relaxed text-slate-200">{data.marketPosition}</p>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {[
                {
                  label: 'Competitive Advantage',
                  value: 'Technology Leadership',
                  icon: Lightbulb,
                  color: 'text-cyan-400',
                },
                {
                  label: 'Market Segment',
                  value: 'Enterprise B2B',
                  icon: Target,
                  color: 'text-indigo-400',
                },
                {
                  label: 'Growth Rate',
                  value: '22% CAGR',
                  icon: TrendingUp,
                  color: 'text-emerald-400',
                },
                { label: 'Customer NPS', value: '72', icon: Users, color: 'text-blue-400' },
              ].map((item) => {
                const ItemIcon = item.icon;
                return (
                  <div
                    key={item.label}
                    className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/5 p-4 backdrop-blur-sm"
                  >
                    <ItemIcon className={`h-8 w-8 ${item.color}`} />
                    <div>
                      <div className="text-xs font-medium text-slate-400">{item.label}</div>
                      <div className="text-sm font-bold text-white">{item.value}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-4">
            {data.keyRisks.map((risk, i) => (
              <div
                key={i}
                className="flex items-start gap-4 rounded-xl border border-amber-500/20 bg-amber-500/5 p-5 backdrop-blur-sm transition-all hover:border-amber-500/30"
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-amber-500/10">
                  <span className="text-sm font-bold text-amber-400">{i + 1}</span>
                </div>
                <p className="pt-1 text-sm leading-relaxed text-slate-200">{risk}</p>
              </div>
            ))}
          </div>
        );
      case 3:
        return (
          <div className="space-y-4">
            {data.revenueOpportunities.map((opp, i) => (
              <div
                key={i}
                className="flex items-start gap-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-5 backdrop-blur-sm transition-all hover:border-emerald-500/30"
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-500/10">
                  <DollarSign className="h-4 w-4 text-emerald-400" />
                </div>
                <p className="pt-1 text-sm leading-relaxed text-slate-200">{opp}</p>
              </div>
            ))}
          </div>
        );
      case 4:
        return (
          <div className="space-y-6">
            <div className="rounded-xl bg-white/5 p-6 backdrop-blur-sm">
              <p className="leading-relaxed text-slate-200">{data.growthStrategy}</p>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              {[
                { label: 'R&D Investment', value: '$200M', sub: 'Over 24 months', icon: Lightbulb },
                {
                  label: 'Customer Target',
                  value: '+30%',
                  sub: 'Enterprise acquisition',
                  icon: Users,
                },
                {
                  label: 'LTV Improvement',
                  value: '+25%',
                  sub: 'Customer lifetime value',
                  icon: TrendingUp,
                },
              ].map((item) => {
                const ItemIcon = item.icon;
                return (
                  <div
                    key={item.label}
                    className="rounded-lg border border-violet-500/20 bg-violet-500/5 p-5 backdrop-blur-sm"
                  >
                    <ItemIcon className="mb-3 h-6 w-6 text-violet-400" />
                    <div className="text-2xl font-extrabold text-white">{item.value}</div>
                    <div className="mt-1 text-xs font-medium text-slate-400">{item.label}</div>
                    <div className="text-[10px] text-slate-500">{item.sub}</div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      case 5:
        return (
          <div className="space-y-6">
            <div className="rounded-xl bg-gradient-to-br from-rose-500/10 to-pink-500/10 p-6 backdrop-blur-sm">
              <p className="leading-relaxed text-slate-200">{data.proposalSummary}</p>
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              {[
                { label: 'Projected ROI', value: '3.5x', sub: 'Over 36 months', icon: TrendingUp },
                {
                  label: 'Confidence Level',
                  value: 'High',
                  sub: 'Based on analysis',
                  icon: Shield,
                },
                {
                  label: 'Time to Value',
                  value: '6-9 months',
                  sub: 'Implementation phase',
                  icon: Target,
                },
                {
                  label: 'Strategic Fit',
                  value: 'Strong',
                  sub: 'Portfolio alignment',
                  icon: Lightbulb,
                },
              ].map((item) => {
                const ItemIcon = item.icon;
                return (
                  <div
                    key={item.label}
                    className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/5 p-4 backdrop-blur-sm"
                  >
                    <ItemIcon className="h-8 w-8 text-rose-400" />
                    <div>
                      <div className="text-lg font-bold text-white">{item.value}</div>
                      <div className="text-xs text-slate-400">{item.label}</div>
                      <div className="text-[10px] text-slate-500">{item.sub}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="mx-auto max-w-6xl space-y-8 p-6">
      <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white md:text-4xl">
            AI Boardroom Mode
          </h1>
          <p className="mt-2 text-sm text-slate-400">
            Executive presentation deck generated by AI for boardroom-ready strategic analysis
          </p>
        </div>
      </div>

      {!generated && (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-8 backdrop-blur-xl">
          <div className="mx-auto max-w-2xl text-center">
            <Building2 className="mx-auto mb-4 h-12 w-12 text-indigo-400" />
            <h2 className="mb-2 text-xl font-bold text-white">Enter Company Name</h2>
            <p className="mb-8 text-sm text-slate-400">
              Generate a comprehensive boardroom-ready presentation with executive analysis, market
              insights, risk assessment, and strategic recommendations.
            </p>
            <div className="flex gap-3">
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="e.g. Acme Corp, TechGlobal Inc."
                className="flex-1 rounded-xl border border-slate-700 bg-slate-800/50 px-5 py-3 text-sm text-white placeholder-slate-500 backdrop-blur-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                onKeyDown={(e) => e.key === 'Enter' && generateContent()}
              />
              <button
                onClick={generateContent}
                disabled={loading || !companyName.trim()}
                className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-3 text-sm font-semibold text-white transition-all hover:from-indigo-500 hover:to-purple-500 disabled:opacity-50"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Sparkles className="h-4 w-4" />
                )}
                {loading ? 'Generating...' : 'Generate Boardroom Deck'}
              </button>
            </div>
          </div>
        </div>
      )}

      {loading && (
        <div className="flex flex-col items-center justify-center space-y-4 rounded-2xl border border-slate-800 bg-slate-900/30 p-20">
          <Loader2 className="h-10 w-10 animate-spin text-indigo-400" />
          <p className="text-sm text-slate-400">
            AI agents are analyzing {companyName} and preparing boardroom materials...
          </p>
        </div>
      )}

      {generated && !loading && (
        <div className="space-y-6">
          <div className="flex items-center justify-center gap-2">
            {SLIDE_DEFINITIONS.map((def, idx) => {
              const DotIcon = def.icon;
              return (
                <button
                  key={def.id}
                  onClick={() => goToSlide(idx)}
                  className={`flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium transition-all ${
                    idx === currentSlide
                      ? 'border-indigo-500 bg-indigo-500/20 text-indigo-300'
                      : 'border-slate-700 bg-slate-800/50 text-slate-500 hover:border-slate-600'
                  }`}
                >
                  <DotIcon className="h-3 w-3" />
                  <span className="hidden sm:inline">{def.label}</span>
                </button>
              );
            })}
          </div>

          <div className="text-center text-xs font-medium text-slate-500">
            Slide {currentSlide + 1} of {SLIDE_COUNT}
          </div>

          <div className="relative overflow-hidden rounded-2xl border border-slate-700/50 bg-gradient-to-br from-slate-900 via-slate-900/95 to-slate-800/90 p-1 shadow-2xl backdrop-blur-2xl">
            <div className="rounded-xl bg-slate-950/60 p-8 backdrop-blur-xl">
              <div className="mb-8 flex items-center gap-4 border-b border-white/5 pb-6">
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${slideDef.color} shadow-lg`}
                >
                  <SlideIcon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <div className="text-xs font-medium tracking-widest text-slate-400 uppercase">
                    Executive Briefing
                  </div>
                  <h2 className="text-2xl font-bold text-white">{slideDef.label}</h2>
                </div>
              </div>

              <div key={currentSlide} className="animate-fadeIn min-h-[320px]">
                {renderSlideContent()}
              </div>

              <div className="mt-8 flex items-center justify-between border-t border-white/5 pt-6">
                <button
                  onClick={goPrev}
                  disabled={currentSlide === 0}
                  className="flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-800/50 px-4 py-2 text-sm font-medium text-slate-300 backdrop-blur-sm transition-all hover:bg-slate-700/50 hover:text-white disabled:opacity-30 disabled:hover:bg-slate-800/50 disabled:hover:text-slate-300"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Previous
                </button>
                <div className="flex items-center gap-2">
                  {Array.from({ length: SLIDE_COUNT }).map((_, i) => (
                    <button
                      key={i}
                      onClick={() => goToSlide(i)}
                      className={`h-2 w-2 rounded-full transition-all ${
                        i === currentSlide ? 'w-6 bg-indigo-500' : 'bg-slate-600 hover:bg-slate-500'
                      }`}
                    />
                  ))}
                </div>
                <button
                  onClick={goNext}
                  disabled={currentSlide === SLIDE_COUNT - 1}
                  className="flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-800/50 px-4 py-2 text-sm font-medium text-slate-300 backdrop-blur-sm transition-all hover:bg-slate-700/50 hover:text-white disabled:opacity-30 disabled:hover:bg-slate-800/50 disabled:hover:text-slate-300"
                >
                  Next
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          <div className="flex justify-center">
            <button
              onClick={() => {
                setGenerated(false);
                setData(defaultData);
                setCompanyName('');
              }}
              className="flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-800/50 px-4 py-2 text-xs font-medium text-slate-400 backdrop-blur-sm transition-all hover:border-slate-600 hover:text-slate-200"
            >
              <FileText className="h-4 w-4" />
              New Analysis
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

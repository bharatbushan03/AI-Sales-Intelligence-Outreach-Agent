'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  TrendingUp,
  DollarSign,
  BarChart3,
  Target,
  Activity,
  Gauge,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  Layers,
  CheckCircle2,
  ChevronRight,
} from 'lucide-react';

// ─── Types ───────────────────────────────────────────────────────────────────

type ScenarioKey = 'best' | 'expected' | 'conservative';

interface ScenarioData {
  key: ScenarioKey;
  label: string;
  projectedRevenue: number;
  confidence: number;
  growth: number;
  keyDrivers: string[];
  color: string;
  gradient: string;
  monthlyProjection: number[];
}

interface MarketSignal {
  label: string;
  value: number;
  trend: 'up' | 'down';
  change: number;
}

interface OpportunityScore {
  category: string;
  score: number;
  potential: number;
}

interface IndustryTrend {
  sector: string;
  growthRate: number;
  momentum: 'high' | 'medium' | 'low';
  color: string;
}

interface PipelineStage {
  name: string;
  value: number;
  count: number;
  color: string;
}

// ─── Data ────────────────────────────────────────────────────────────────────

const scenarios: ScenarioData[] = [
  {
    key: 'best',
    label: 'Best Case',
    projectedRevenue: 4850000,
    confidence: 72,
    growth: 34.8,
    keyDrivers: [
      'Enterprise expansion deals closing early',
      'High-value pipeline conversion >40%',
      'Q4 seasonal uplift in SaaS procurement',
    ],
    color: '#22c55e',
    gradient: 'from-emerald-500/20 to-emerald-500/5',
    monthlyProjection: [320000, 380000, 410000, 450000, 490000, 520000, 480000, 510000, 560000, 590000, 620000, 680000],
  },
  {
    key: 'expected',
    label: 'Expected Case',
    projectedRevenue: 3750000,
    confidence: 88,
    growth: 18.2,
    keyDrivers: [
      'Steady mid-market deal velocity',
      'Historical conversion rates maintained',
      'Renewal book at 92% retention',
    ],
    color: '#6366f1',
    gradient: 'from-indigo-500/20 to-indigo-500/5',
    monthlyProjection: [260000, 285000, 300000, 320000, 340000, 355000, 310000, 335000, 365000, 385000, 395000, 420000],
  },
  {
    key: 'conservative',
    label: 'Conservative Case',
    projectedRevenue: 2850000,
    confidence: 95,
    growth: 6.5,
    keyDrivers: [
      'Delayed enterprise procurement cycles',
      'Pipeline coverage at minimum threshold',
      'Conservative close-rate assumptions',
    ],
    color: '#f59e0b',
    gradient: 'from-amber-500/20 to-amber-500/5',
    monthlyProjection: [210000, 220000, 230000, 240000, 250000, 260000, 235000, 245000, 255000, 265000, 270000, 285000],
  },
];

const marketSignals: MarketSignal[] = [
  { label: 'Intent Score', value: 87, trend: 'up', change: 5.2 },
  { label: 'Engagement Rate', value: 64, trend: 'up', change: 3.8 },
  { label: 'Competitor Activity', value: 42, trend: 'down', change: -2.1 },
  { label: 'Budget Availability', value: 73, trend: 'up', change: 7.4 },
];

const opportunityScores: OpportunityScore[] = [
  { category: 'Enterprise', score: 82, potential: 2100000 },
  { category: 'Mid-Market', score: 74, potential: 1200000 },
  { category: 'SMB', score: 61, potential: 450000 },
  { category: 'Strategic', score: 91, potential: 3100000 },
];

const industryTrends: IndustryTrend[] = [
  { sector: 'SaaS / Cloud', growthRate: 22.4, momentum: 'high', color: '#22c55e' },
  { sector: 'FinTech', growthRate: 18.7, momentum: 'high', color: '#6366f1' },
  { sector: 'Healthcare IT', growthRate: 14.2, momentum: 'medium', color: '#f59e0b' },
  { sector: 'Manufacturing', growthRate: 8.9, momentum: 'low', color: '#ef4444' },
];

const pipelineStages: PipelineStage[] = [
  { name: 'Discovery', value: 1200000, count: 24, color: '#6366f1' },
  { name: 'Qualified', value: 2100000, count: 18, color: '#22c55e' },
  { name: 'Proposal', value: 1800000, count: 12, color: '#f59e0b' },
  { name: 'Negotiation', value: 950000, count: 7, color: '#ef4444' },
  { name: 'Closing', value: 650000, count: 4, color: '#ec4899' },
];

// ─── Utilities ──────────────────────────────────────────────────────────────

function formatCurrency(value: number): string {
  if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`;
  return `$${value.toLocaleString()}`;
}

function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

// ─── Animated Counter ────────────────────────────────────────────────────────

function AnimatedCounter({
  end,
  suffix = '',
  prefix = '',
  duration = 1500,
  decimals = 0,
}: {
  end: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
  decimals?: number;
}) {
  const [value, setValue] = useState(0);
  const ref = useRef<number | null>(null);

  useEffect(() => {
    const startTime = performance.now();
    const startVal = 0;

    function animate(now: number) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = easeOutCubic(progress);
      setValue(startVal + (end - startVal) * eased);
      if (progress < 1) {
        ref.current = requestAnimationFrame(animate);
      }
    }

    ref.current = requestAnimationFrame(animate);
    return () => {
      if (ref.current) cancelAnimationFrame(ref.current);
    };
  }, [end, duration]);

  return (
    <span>
      {prefix}
      {decimals > 0 ? value.toFixed(decimals) : Math.round(value).toLocaleString()}
      {suffix}
    </span>
  );
}

// ─── Animated Progress Bar ───────────────────────────────────────────────────

function AnimatedProgressBar({
  value,
  color,
  label,
  showValue = true,
}: {
  value: number;
  color: string;
  label?: string;
  showValue?: boolean;
}) {
  const [width, setWidth] = useState(0);
  const ref = useRef<number | null>(null);

  useEffect(() => {
    const startTime = performance.now();
    const startVal = 0;
    const duration = 1200;

    function animate(now: number) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = easeOutCubic(progress);
      setWidth(startVal + (value - startVal) * eased);
      if (progress < 1) {
        ref.current = requestAnimationFrame(animate);
      }
    }

    ref.current = requestAnimationFrame(animate);
    return () => {
      if (ref.current) cancelAnimationFrame(ref.current);
    };
  }, [value]);

  return (
    <div className="space-y-1.5">
      {(label || showValue) && (
        <div className="flex items-center justify-between text-xs">
          {label && <span className="text-slate-400">{label}</span>}
          {showValue && (
            <span className="font-semibold text-slate-200" style={{ color }}>
              {Math.round(width)}%
            </span>
          )}
        </div>
      )}
      <div className="h-2 overflow-hidden rounded-full bg-slate-800">
        <div
          className="h-full rounded-full transition-all duration-100"
          style={{ width: `${width}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
}

// ─── Revenue Forecast Chart (Bar Chart) ──────────────────────────────────────

function RevenueForecastChart({
  scenarios,
}: {
  scenarios: ScenarioData[];
}) {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const maxVal = Math.max(...scenarios.flatMap((s) => s.monthlyProjection));
  const chartHeight = 200;
  const chartWidth = 600;
  const barWidth = chartWidth / months.length / 3.5;
  const groupGap = 2;

  return (
    <svg viewBox={`0 0 ${chartWidth} ${chartHeight + 40}`} className="w-full" preserveAspectRatio="xMidYMid meet">
      {[0, 0.25, 0.5, 0.75, 1].map((frac) => (
        <g key={frac}>
          <line
            x1={0}
            y1={chartHeight - chartHeight * frac}
            x2={chartWidth}
            y2={chartHeight - chartHeight * frac}
            stroke="#1e293b"
            strokeWidth={1}
          />
          <text
            x={-5}
            y={chartHeight - chartHeight * frac + 4}
            textAnchor="end"
            className="fill-slate-500 text-[9px]"
          >
            {formatCurrency(maxVal * frac)}
          </text>
        </g>
      ))}

      {months.map((_, mi) => (
        <g key={mi}>
          {scenarios.map((sc, si) => {
            const x = mi * (chartWidth / months.length) + si * (barWidth + groupGap) + (chartWidth / months.length - scenarios.length * (barWidth + groupGap)) / 2;
            const barH = (sc.monthlyProjection[mi] / maxVal) * chartHeight;
            return (
              <g key={sc.key}>
                <rect
                  x={x}
                  y={chartHeight - barH}
                  width={barWidth}
                  height={barH}
                  fill={sc.color}
                  opacity={0.8}
                  rx={2}
                />
                {mi > 0 && (
                  <line
                    x1={(mi - 1) * (chartWidth / months.length) + si * (barWidth + groupGap) + barWidth / 2 + (chartWidth / months.length - scenarios.length * (barWidth + groupGap)) / 2}
                    y1={chartHeight - (sc.monthlyProjection[mi - 1] / maxVal) * chartHeight}
                    x2={x + barWidth / 2}
                    y2={chartHeight - barH}
                    stroke={sc.color}
                    strokeWidth={1.5}
                    strokeDasharray="3 3"
                    opacity={0.4}
                  />
                )}
              </g>
            );
          })}
        </g>
      ))}

      {months.map((m, i) => (
        <text
          key={m}
          x={i * (chartWidth / months.length) + chartWidth / months.length / 2}
          y={chartHeight + 20}
          textAnchor="middle"
          className="fill-slate-500 text-[9px]"
        >
          {m}
        </text>
      ))}
    </svg>
  );
}

// ─── Pipeline Waterfall Chart ────────────────────────────────────────────────

function PipelineWaterfall({ stages }: { stages: PipelineStage[] }) {
  const total = stages.reduce((sum, s) => sum + s.value, 0);
  const maxBarHeight = 160;

  return (
    <svg viewBox="0 0 400 200" className="w-full" preserveAspectRatio="xMidYMid meet">
      {stages.map((stage, i) => {
        const x = i * (400 / stages.length) + 10;
        const barWidth = 400 / stages.length - 20;
        const barHeight = (stage.value / total) * maxBarHeight;
        return (
          <g key={stage.name}>
            <rect
              x={x}
              y={200 - barHeight - 30}
              width={barWidth}
              height={barHeight}
              fill={stage.color}
              opacity={0.85}
              rx={3}
            />
            <text
              x={x + barWidth / 2}
              y={200 - barHeight - 35}
              textAnchor="middle"
              className="fill-slate-200 text-[10px] font-semibold"
            >
              {formatCurrency(stage.value)}
            </text>
            <text
              x={x + barWidth / 2}
              y={200 - 10}
              textAnchor="middle"
              className="fill-slate-400 text-[8px]"
            >
              {stage.name}
            </text>
            <text
              x={x + barWidth / 2}
              y={200 - 20}
              textAnchor="middle"
              className="fill-slate-500 text-[8px]"
            >
              {stage.count} deals
            </text>
            {i < stages.length - 1 && (
              <line
                x1={x + barWidth}
                y1={200 - barHeight - 30 + barHeight / 2}
                x2={x + barWidth + 20}
                y2={200 - ((stages[i + 1].value / total) * maxBarHeight) - 30 + (stages[i + 1].value / total) * maxBarHeight / 2}
                stroke="#475569"
                strokeWidth={1}
                strokeDasharray="3 3"
              />
            )}
          </g>
        );
      })}
    </svg>
  );
}

// ─── Opportunity Score Radar ──────────────────────────────────────────────

function OpportunityRadar({ scores }: { scores: OpportunityScore[] }) {
  const cx = 100;
  const cy = 100;
  const radius = 70;
  const angleStep = (2 * Math.PI) / scores.length;
  const gridLevels = [0.25, 0.5, 0.75, 1];

  return (
    <svg viewBox="0 0 200 200" className="w-full max-w-[200px]" preserveAspectRatio="xMidYMid meet">
      {gridLevels.map((level) => {
        const pts = scores
          .map((_, i) => {
            const angle = -Math.PI / 2 + i * angleStep;
            const r = level * radius;
            return `${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)}`;
          })
          .join(' ');
        return (
          <polygon
            key={level}
            points={pts}
            fill="none"
            stroke="#1e293b"
            strokeWidth={1}
          />
        );
      })}

      {scores.map((_, i) => {
        const angle = -Math.PI / 2 + i * angleStep;
        return (
          <line
            key={i}
            x1={cx}
            y1={cy}
            x2={cx + radius * Math.cos(angle)}
            y2={cy + radius * Math.sin(angle)}
            stroke="#1e293b"
            strokeWidth={1}
          />
        );
      })}

      <polygon
        points={scores.map((_, i) => {
          const angle = -Math.PI / 2 + i * angleStep;
          const r = (scores[i].score / 100) * radius;
          return `${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)}`;
        }).join(' ')}
        fill="rgba(99, 102, 241, 0.2)"
        stroke="#6366f1"
        strokeWidth={2}
      />

      {scores.map((s, i) => {
        const angle = -Math.PI / 2 + i * angleStep;
        const r = (s.score / 100) * radius;
        const px = cx + r * Math.cos(angle);
        const py = cy + r * Math.sin(angle);
        const lx = cx + (radius + 25) * Math.cos(angle);
        const ly = cy + (radius + 25) * Math.sin(angle);

        return (
          <g key={s.category}>
            <circle cx={px} cy={py} r={4} fill="#6366f1" stroke="#1e293b" strokeWidth={1.5} />
            <text
              x={lx}
              y={ly}
              textAnchor="middle"
              dominantBaseline="middle"
              className="fill-slate-300 text-[8px] font-medium"
            >
              {s.category}
            </text>
            <text
              x={lx}
              y={ly + 10}
              textAnchor="middle"
              dominantBaseline="middle"
              className="fill-indigo-400 text-[9px] font-bold"
            >
              {s.score}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

// ─── Gauge Component ─────────────────────────────────────────────────────────

function GaugeIndicator({
  value,
  label,
  color,
}: {
  value: number;
  label: string;
  color: string;
}) {
  const radius = 35;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - value / 100);
  const [animatedOffset, setAnimatedOffset] = useState(circumference);

  useEffect(() => {
    const startTime = performance.now();

    function animate(now: number) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / 1000, 1);
      const eased = easeOutCubic(progress);
      setAnimatedOffset(circumference + (offset - circumference) * eased);
      if (progress < 1) requestAnimationFrame(animate);
    }

    requestAnimationFrame(animate);
  }, [offset, circumference]);

  return (
    <div className="flex flex-col items-center">
      <svg width="90" height="90" viewBox="0 0 90 90">
        <circle
          cx="45"
          cy="45"
          r={radius}
          fill="none"
          stroke="#1e293b"
          strokeWidth="6"
        />
        <circle
          cx="45"
          cy="45"
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="6"
          strokeDasharray={circumference}
          strokeDashoffset={animatedOffset}
          strokeLinecap="round"
          transform="rotate(-90 45 45)"
        />
        <text
          x="45"
          y="45"
          textAnchor="middle"
          dominantBaseline="middle"
          className="fill-slate-100 text-lg font-bold"
        >
          {Math.round(value)}
        </text>
        <text
          x="45"
          y="58"
          textAnchor="middle"
          dominantBaseline="middle"
          className="fill-slate-500 text-[8px]"
        >
          {label}
        </text>
      </svg>
    </div>
  );
}

// ─── Main Page Component ─────────────────────────────────────────────────────

export default function PredictiveRevenueEngine() {
  const [selectedScenario, setSelectedScenario] = useState<ScenarioKey>('expected');
  const activeScenario = scenarios.find((s) => s.key === selectedScenario)!;
  const totalPipeline = pipelineStages.reduce((sum, s) => sum + s.value, 0);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/20">
            <TrendingUp className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Predictive Revenue Engine</h1>
            <p className="text-sm text-slate-400">
              AI-powered revenue forecasting with multi-scenario projections
            </p>
          </div>
        </div>
      </div>

      {/* Top Metric Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="group relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur-sm transition-all hover:border-slate-700">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
          <div className="relative">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-xs font-semibold tracking-wider text-indigo-400 uppercase">
                Total Pipeline
              </span>
              <DollarSign className="h-4 w-4 text-indigo-400" />
            </div>
            <div className="text-3xl font-bold text-white">
              <AnimatedCounter end={totalPipeline} prefix="$" decimals={0} />
            </div>
            <p className="mt-1 text-xs text-slate-500">Across {pipelineStages.reduce((s, p) => s + p.count, 0)} active deals</p>
          </div>
        </div>

        <div className="group relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur-sm transition-all hover:border-slate-700">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
          <div className="relative">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-xs font-semibold tracking-wider text-emerald-400 uppercase">
                Expected Revenue
              </span>
              <Target className="h-4 w-4 text-emerald-400" />
            </div>
            <div className="text-3xl font-bold text-white">
              <AnimatedCounter end={3750000} prefix="$" decimals={0} />
            </div>
            <div className="mt-1 flex items-center gap-1 text-xs">
              <ArrowUpRight className="h-3 w-3 text-emerald-400" />
              <span className="text-emerald-400 font-medium">+18.2%</span>
              <span className="text-slate-500 ml-1">vs last quarter</span>
            </div>
          </div>
        </div>

        <div className="group relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur-sm transition-all hover:border-slate-700">
          <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
          <div className="relative">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-xs font-semibold tracking-wider text-amber-400 uppercase">
                Win Rate
              </span>
              <Activity className="h-4 w-4 text-amber-400" />
            </div>
            <div className="text-3xl font-bold text-white">
              <AnimatedCounter end={38} suffix="%" decimals={1} />
            </div>
            <div className="mt-1 flex items-center gap-1 text-xs">
              <ArrowUpRight className="h-3 w-3 text-emerald-400" />
              <span className="text-emerald-400 font-medium">+2.4%</span>
              <span className="text-slate-500 ml-1">improvement</span>
            </div>
          </div>
        </div>

        <div className="group relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur-sm transition-all hover:border-slate-700">
          <div className="absolute inset-0 bg-gradient-to-br from-rose-500/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
          <div className="relative">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-xs font-semibold tracking-wider text-rose-400 uppercase">
                Forecast Accuracy
              </span>
              <Gauge className="h-4 w-4 text-rose-400" />
            </div>
            <div className="text-3xl font-bold text-white">
              <AnimatedCounter end={88} suffix="%" decimals={0} />
            </div>
            <p className="mt-1 text-xs text-slate-500">Expected case confidence</p>
          </div>
        </div>
      </div>

      {/* Scenario Cards */}
      <div className="grid gap-4 lg:grid-cols-3">
        {scenarios.map((sc) => {
          const isActive = selectedScenario === sc.key;
          return (
            <button
              key={sc.key}
              onClick={() => setSelectedScenario(sc.key)}
              className={`group relative overflow-hidden rounded-2xl border p-5 text-left transition-all backdrop-blur-sm ${
                isActive
                  ? 'border-slate-600 bg-slate-800/80 shadow-xl shadow-slate-900/50'
                  : 'border-slate-800 bg-slate-900/40 hover:border-slate-700 hover:bg-slate-900/60'
              }`}
            >
              <div
                className={`absolute inset-0 bg-gradient-to-br ${sc.gradient} opacity-60 transition-opacity ${
                  isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-60'
                }`}
              />

              <div className="relative">
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-xs font-semibold tracking-wider uppercase" style={{ color: sc.color }}>
                    {sc.label}
                  </span>
                  {isActive && <ChevronRight className="h-4 w-4 text-slate-400" />}
                </div>

                <div className="text-2xl font-bold text-white" style={{ color: sc.color }}>
                  <AnimatedCounter end={sc.projectedRevenue} prefix="$" decimals={0} />
                </div>

                <div className="mt-3 space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-400">Confidence</span>
                    <span className="font-semibold text-slate-200">{sc.confidence}%</span>
                  </div>
                  <AnimatedProgressBar value={sc.confidence} color={sc.color} />
                </div>

                <div className="mt-3 flex items-center gap-1 text-xs">
                  {sc.growth >= 0 ? (
                    <>
                      <ArrowUpRight className="h-3 w-3 text-emerald-400" />
                      <span className="text-emerald-400 font-medium">+{sc.growth}%</span>
                    </>
                  ) : (
                    <>
                      <ArrowDownRight className="h-3 w-3 text-red-400" />
                      <span className="text-red-400 font-medium">{sc.growth}%</span>
                    </>
                  )}
                  <span className="text-slate-500 ml-1">projected growth</span>
                </div>

                {isActive && (
                  <div className="mt-4 space-y-2 border-t border-slate-700 pt-4">
                    <span className="text-[10px] font-semibold tracking-wider text-slate-400 uppercase">
                      Key Drivers
                    </span>
                    <ul className="space-y-1.5">
                      {activeScenario.keyDrivers.map((driver, i) => (
                        <li key={i} className="flex items-start gap-2 text-xs text-slate-300">
                          <CheckCircle2 className="mt-0.5 h-3 w-3 shrink-0 text-indigo-400" />
                          {driver}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Revenue Forecast Chart */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 backdrop-blur-sm">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <BarChart3 className="h-5 w-5 text-indigo-400" />
            <h2 className="text-lg font-semibold text-slate-100">Monthly Revenue Projections</h2>
          </div>
          <div className="flex items-center gap-4">
            {scenarios.map((sc) => (
              <div key={sc.key} className="flex items-center gap-1.5">
                <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: sc.color }} />
                <span className="text-[10px] text-slate-400">{sc.label}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="overflow-x-auto">
          <div className="min-w-[600px]">
            <RevenueForecastChart scenarios={scenarios} />
          </div>
        </div>
      </div>

      {/* Pipeline Value + Radar Row */}
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 backdrop-blur-sm">
          <div className="mb-4 flex items-center gap-3">
            <Layers className="h-5 w-5 text-indigo-400" />
            <h2 className="text-lg font-semibold text-slate-100">Pipeline Value Breakdown</h2>
          </div>
          <PipelineWaterfall stages={pipelineStages} />
          <div className="mt-4 grid grid-cols-5 gap-2">
            {pipelineStages.map((stage) => (
              <div key={stage.name} className="text-center">
                <div className="mb-1 text-[10px] font-medium text-slate-400">{stage.name}</div>
                <div className="text-xs font-bold text-slate-200">{formatCurrency(stage.value)}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 backdrop-blur-sm">
          <div className="mb-4 flex items-center gap-3">
            <Target className="h-5 w-5 text-emerald-400" />
            <h2 className="text-lg font-semibold text-slate-100">Opportunity Scores by Segment</h2>
          </div>
          <div className="flex flex-col items-center sm:flex-row sm:items-start sm:gap-6">
            <OpportunityRadar scores={opportunityScores} />
            <div className="mt-4 flex-1 space-y-3 sm:mt-0">
              {opportunityScores.map((score) => (
                <div key={score.category}>
                  <div className="mb-1 flex items-center justify-between text-xs">
                    <span className="text-slate-300 font-medium">{score.category}</span>
                    <span className="text-slate-400">{formatCurrency(score.potential)} potential</span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-slate-800">
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${score.score}%`, backgroundColor: score.score >= 80 ? '#22c55e' : score.score >= 65 ? '#6366f1' : '#f59e0b' }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Market Signals + Industry Trends */}
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 backdrop-blur-sm">
          <div className="mb-4 flex items-center gap-3">
            <Activity className="h-5 w-5 text-amber-400" />
            <h2 className="text-lg font-semibold text-slate-100">Market Signals</h2>
          </div>
          <div className="space-y-4">
            {marketSignals.map((signal) => (
              <div key={signal.label} className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-200">{signal.label}</span>
                  <div className="flex items-center gap-1.5">
                    {signal.trend === 'up' ? (
                      <ArrowUpRight className="h-3.5 w-3.5 text-emerald-400" />
                    ) : (
                      <ArrowDownRight className="h-3.5 w-3.5 text-red-400" />
                    )}
                    <span className={signal.trend === 'up' ? 'text-emerald-400 text-xs font-medium' : 'text-red-400 text-xs font-medium'}>
                      {signal.change > 0 ? '+' : ''}{signal.change}%
                    </span>
                  </div>
                </div>
                <AnimatedProgressBar value={signal.value} color={signal.trend === 'up' ? '#22c55e' : '#ef4444'} />
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 backdrop-blur-sm">
          <div className="mb-4 flex items-center gap-3">
            <TrendingUp className="h-5 w-5 text-emerald-400" />
            <h2 className="text-lg font-semibold text-slate-100">Industry Trends</h2>
          </div>
          <div className="space-y-4">
            {industryTrends.map((trend) => (
              <div key={trend.sector} className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-200">{trend.sector}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold" style={{ color: trend.color }}>
                      +{trend.growthRate}%
                    </span>
                    <span
                      className={`rounded-full px-2 py-0.5 text-[9px] font-semibold ${
                        trend.momentum === 'high'
                          ? 'bg-emerald-950 text-emerald-400 border border-emerald-900'
                          : trend.momentum === 'medium'
                            ? 'bg-amber-950 text-amber-400 border border-amber-900'
                            : 'bg-red-950 text-red-400 border border-red-900'
                      }`}
                    >
                      {trend.momentum}
                    </span>
                  </div>
                </div>
                <AnimatedProgressBar value={trend.growthRate * 3.5} color={trend.color} label="Market momentum" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quarterly Outlook */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 backdrop-blur-sm">
        <div className="mb-6 flex items-center gap-3">
          <Calendar className="h-5 w-5 text-indigo-400" />
          <h2 className="text-lg font-semibold text-slate-100">Quarterly Outlook by Scenario</h2>
        </div>
        <div className="grid gap-6 sm:grid-cols-3">
          {scenarios.map((sc) => {
            const q1 = sc.monthlyProjection.slice(0, 3).reduce((a, b) => a + b, 0);
            const q2 = sc.monthlyProjection.slice(3, 6).reduce((a, b) => a + b, 0);
            const q3 = sc.monthlyProjection.slice(6, 9).reduce((a, b) => a + b, 0);
            const q4 = sc.monthlyProjection.slice(9, 12).reduce((a, b) => a + b, 0);
            const quarters = [q1, q2, q3, q4];
            const maxQ = Math.max(...quarters);

            return (
              <div key={sc.key} className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
                <div className="mb-3 flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full" style={{ backgroundColor: sc.color }} />
                  <span className="text-sm font-semibold text-slate-200" style={{ color: sc.color }}>
                    {sc.label}
                  </span>
                </div>
                <div className="space-y-3">
                  {['Q1', 'Q2', 'Q3', 'Q4'].map((q, i) => (
                    <div key={q}>
                      <div className="mb-1 flex items-center justify-between text-xs">
                        <span className="text-slate-400">{q}</span>
                        <span className="font-medium text-slate-200">{formatCurrency(quarters[i])}</span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-slate-800">
                        <div
                          className="h-full rounded-full transition-all"
                          style={{
                            width: `${(quarters[i] / maxQ) * 100}%`,
                            backgroundColor: sc.color,
                            opacity: 0.8,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-3 border-t border-slate-800 pt-3 text-center">
                  <span className="text-xs text-slate-500">Annual Total: </span>
                  <span className="font-bold text-slate-200">{formatCurrency(quarters.reduce((a, b) => a + b, 0))}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

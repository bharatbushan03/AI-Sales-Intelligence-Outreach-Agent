import { Activity, ArrowUpRight, Banknote, Bot, Clock, MessageCircle, Shield, TrendingUp, Users } from 'lucide-react';

import { CalendarSyncButton } from '@/components/calendar-sync-button';

export default function DashboardPage() {
  return (
    <div className="space-y-8 p-6">
      <div className="flex flex-col space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-slate-100">
            Executive Dashboard
          </h1>
          <CalendarSyncButton />
        </div>
        <div className="flex flex-col space-y-4 md:flex-row md:gap-4">
          {/* Widgets */}
          <div className="flex-1">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {/* Active Workflows */}
              <Widget
                title="Active Workflows"
                value="12"
                trend="+3 today"
                trendType="positive"
                icon={Activity}
                description="Workflows currently running"
              />
              {/* Pipeline Value */}
              <Widget
                title="Pipeline Value"
                value="$2.4M"
                trend="+12% this month"
                trendType="positive"
                icon={Banknote}
                description="Total value of open opportunities"
              />
              {/* Open Opportunities */}
              <Widget
                title="Open Opportunities"
                value="48"
                trend="-5 this week"
                trendType="negative"
                icon={TrendingUp}
                description="Opportunities in negotiation stage"
              />
              {/* Outreach Performance */}
              <Widget
                title="Outreach Performance"
                value="68%"
                trend="+4.2%"
                trendType="positive"
                icon={MessageCircle}
                description="Email open rate"
              />
            </div>
          </div>

          <div className="flex-1">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {/* Proposal Activity */}
              <Widget
                title="Proposal Activity"
                value="18"
                trend="3 pending review"
                trendType="neutral"
                icon={Shield}
                description="Proposals generated this week"
              />
              {/* AI Usage */}
              <Widget
                title="AI Usage"
                value="84%"
                trend="+2.1% tokens"
                trendType="positive"
                icon={Bot}
                description="Compute utilization"
              />
              {/* Team Activity */}
              <Widget
                title="Team Activity"
                value="124"
                trend="+12 actions"
                trendType="positive"
                icon={Users}
                description="Team actions today"
              />
              {/* Agent Performance */}
              <Widget
                title="Agent Performance"
                value="94%"
                trend="+1.5%"
                trendType="positive"
                icon={Clock}
                description="Average agent uptime"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Visualizations */}
      <div className="grid gap-6 md:grid-cols-2">
        <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-800">
          <h2 className="text-lg font-semibold text-slate-100 mb-4">
            Workflow Trends
          </h2>
          <WorkflowTrendsChart />
        </div>

        <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-800">
          <h2 className="text-lg font-semibold text-slate-100 mb-4">
            Opportunity Funnel
          </h2>
          <OpportunityFunnelChart />
        </div>
      </div>
    </div>
  );
}

// Widget component
function Widget({
  title,
  value,
  trend,
  trendType,
  icon: Icon,
  description,
}: {
  title: string;
  value: string;
  trend: string;
  trendType: 'positive' | 'negative' | 'neutral';
  icon: React.ComponentType<{ className?: string }>;
  description: string;
}) {
  const trendColors: Record<string, string> = {
    positive: 'text-emerald-400',
    negative: 'text-red-400',
    neutral: 'text-slate-400',
  };

  return (
    <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-800">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Icon className="h-5 w-5 text-indigo-400" />
          <h3 className="text-sm font-medium text-slate-100">{title}</h3>
        </div>
      </div>
      <div className="text-2xl font-bold text-slate-100">
        {value}
      </div>
      <div className="flex items-center gap-2 text-sm mt-1">
        <span className={`${trendColors[trendType]} font-medium`}>
          {trend}
        </span>
      </div>
      <p className="text-xs text-slate-400 mt-2">
        {description}
      </p>
    </div>
  );
}

// Simple chart components (placeholder)
function WorkflowTrendsChart() {
  return (
    <div className="h-48">
      <svg width="100%" height="100%" viewBox="0 0 100 40" className="text-indigo-400">
        <path d="M10,30 Q20,10 30,20 T50,30 T70,10 90,30" stroke="currentColor" strokeWidth="2" fill="none" />
      </svg>
    </div>
  );
}

function OpportunityFunnelChart() {
  return (
    <div className="h-48">
      <svg width="100%" height="100%" viewBox="0 0 100 40" className="text-indigo-400">
        <defs>
          <linearGradient id="funnelGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style={{ stopColor: 'rgb(99,102,241)', stopOpacity: 0.8 }} />
            <stop offset="100%" style={{ stopColor: 'rgb(99,102,241)', stopOpacity: 0.2 }} />
          </linearGradient>
        </defs>
        <polygon points="30,10 70,10 80,30 20,30" fill="url(#funnelGrad)" />
        <text x="50" y="25" textAnchor="middle" fontSize="8" fill="white">Funnel</text>
      </svg>
    </div>
  );
}
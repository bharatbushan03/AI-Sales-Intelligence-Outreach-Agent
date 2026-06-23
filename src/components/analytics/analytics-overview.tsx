export default function AnalyticsOverview() {
  return (
    <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-800">
      <div className="space-y-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-slate-100">
            Analytics Overview
          </h2>
          <button className="text-sm text-indigo-400 hover:text-indigo-300">
            <RefreshCw className="h-3 w-3" /> Refresh Data
          </button>
        </div>

        {/* Key Metrics */}
        <div className="space-y-4">
          <p className="text-sm font-medium text-slate-100 mb-2">Key Performance Indicators</p>
          <div className="grid gap-4 grid-cols-2">
            <div>
              <p className="text-xs font-medium text-slate-100">Active Workflows</p>
              <p className="text-lg font-bold text-slate-100">1,240</p>
            </div>
            <div>
              <p className="text-xs font-medium text-slate-100">AI Usage</p>
              <p className="text-lg font-bold text-indigo-400>84%</p>
            </div>
            <div>
              <p className="text-xs font-medium text-slate-100>Meetings Booked</p>
              <p className="text-lg font-bold text-indigo-400>89</p>
            </div>
            <div>
              <p className="text-xs font-medium text-slate-100>Revenue Pipeline</p>
              <p className="text-lg font-bold text-indigo-400>$2.4M</p>
            </div>
            <div>
              <p className="text-xs font-medium text-slate-100>Customer Satisfaction</p>
              <p className="text-lg font-bold text-indigo-400>4.2/5</p>
            </div>
            <div>
              <p className="text-xs font-medium text-slate-100>System Uptime</p>
              <p className="text-lg font-bold text-indigo-400>99.8%</p>
            </div>
            <div>
              <p className="text-xs font-medium text-slate-100>Data Processed</p>
              <p className="text-lg font-bold text-indigo-400>12.4TB</p>
            </div>
            <div>
              <p className="text-xs font-medium text-slate-100>Cost Savings</p>
              <p className="text-lg font-bold text-indigo-400>$1.8M</p>
            </div>
          </div>
        </div>

        {/* Trends */}
        <div className="space-y-4>
          <p className="text-sm font-medium text-slate-100 mb-2>Recent Trends (Last 30 Days)</p>
          <div className="grid gap-4 grid-cols-2>
            <div>
              <p className="text-xs font-medium text-slate-100>Workflow Volume</p>
              <p className="text-xs text-indigo-400>+12% MoM</p>
            </div>
            <div>
              <p className="text-xs font-medium text-slate-100>AI Token Usage</p>
              <p className="text-xs text-indigo-400>+18% MoM</p>
            </div>
            <div>
              <p className="text-xs font-medium text-slate-100>Meeting Conversion Rate</p>
              <p className="text-xs text-indigo-400>+8% MoM</p>
            </div>
            <div>
              <p className="text-xs font-medium text-slate-100>Sales Cycle Length</p>
              <p className="text-xs text-red-400>-5% MoM</p>
            </div>
            <div>
              <p className="text-xs font-medium text-slate-100>Customer Acquisition Cost</p>
              <p className="text-xs text-red-400>-15% MoM</p>
            </div>
            <div>
              <p className="text-xs font-medium text-slate-100">Employee Productivity</p>
              <p className="text-xs text-indigo-400">+22% MoM</p>
            </div>
          </div>
        </div>

        {/* Top Performers */}
        <div className="space-y-4">
          <p className="text-sm font-medium text-slate-100 mb-2>Top Performing Areas</p>
          <div className="space-y-3>
            <div className="flex items-start gap-3 border-t border-slate-800 pt-3 first:border-t-0>
              <div className="flex-shrink-0>
                <div className="w-2 h-2 bg-indigo-500 rounded-full" />
              </div>
              <div className="flex-1 space-y-0.5>
                <p className="text-xs font-medium text-slate-100>Research Accuracy</p>
                <p className="text-xs text-indigo-400>92% accuracy rate</p>
              </div>
            </div>
            <div className="flex items-start gap-3 border-t border-slate-800 pt-3>
              <div className="flex-shrink-0>
                <div className="w-2 h-2 bg-green-500 rounded-full" />
              </div>
              <div className="flex-1 space-y-0.5>
                <p className="text-xs font-medium text-slate-100>Outreach Engagement</p>
                <p className="text-xs text-indigo-400>28% reply rate (industry avg: 8%)</p>
              </div>
            </div>
            <div className="flex items-start gap-3 border-t border-slate-800 pt-3>
              <div className="flex-shrink-0>
                <div className="w-2 h-2 bg-yellow-500 rounded-full" />
              </div>
              <div className="flex-1 space-y-0.5>
                <p className="text-xs font-medium text-slate-100>CRM Data Quality</p>
                <p className="text-xs text-indigo-400>98% completeness</p>
              </div>
            </div>
            <div className="flex items-start gap-3 border-t border-slate-800 pt-3>
              <div className="flex-shrink-0>
                <div className="w-2 h-2 bg-blue-500 rounded-full" />
              </div>
              <div className="flex-1 space-y-0.5>
                <p className="text-xs font-medium text-slate-100>Proposal Win Rate</p>
                <p className="text-xs text-indigo-400>45% win rate</p>
              </div>
            </div>
          </div>
        </div>

        {/* Real-time Activity */}
        <div className="mt-4 pt-3 border-t border-slate-800>
          <p className="text-sm font-medium text-slate-100 mb-2>Real-time System Activity</p>
          <div className="space-y-3>
            <div className="flex items-start gap-3 border-t border-slate-800 pt-3 first:border-t-0>
              <div className="flex-shrink-0>
                <div className="w-2 h-2 bg-indigo-500 rounded-full" />
              </div>
              <div className="flex-1 space-y-0.5>
                <p className="text-xs font-medium text-slate-100>New Workflow Initiated</p>
                <p className="text-xs text-slate-400>TechCorp Solutions AI Assessment</p>
                <p className="text-xs text-slate-500>Just now</p>
              </div>
            </div>
            <div className="flex items-start gap-3 border-t border-slate-800 pt-3>
              <div className="flex-shrink-0>
                <div className="w-2 h-2 bg-green-500 rounded-full" />
              </div>
              <div className="flex-1 space-y-0.5>
                <p className="text-xs font-medium text-slate-100>High-value Opportunity Identified</p>
                <p className="text-xs text-slate-400>$750K deal with Global Enterprises</p>
                <p className="text-xs text-slate-500>2 minutes ago</p>
              </div>
            </div>
            <div className="flex items-start gap-3 border-t border-slate-800 pt-3>
              <div className="flex-shrink-0>
                <div className="w-2 h-2 bg-yellow-500 rounded-full" />
              </div>
              <div className="flex-1 space-y-0.5>
                <p className="text-xs font-medium text-slate-100>AI Model Retraining Completed</p>
                <p className="text-xs text-slate-400>Enhanced accuracy for lead scoring</p>
                <p className="text-xs text-slate-500>5 minutes ago</p>
              </div>
            </div>
            <div className="flex items-start gap-3 border-t border-slate-800 pt-3>
              <div className="flex-shrink-0>
                <div className="w-2 h-2 bg-blue-500 rounded-full" />
              </div>
              <div className="flex-1 space-y-0.5>
                <p className="text-xs font-medium text-slate-100>Customer Feedback Received</p>
                <p className="text-xs text-slate-400>Positive review from TechCorp Solutions</p>
                <p className="text-xs text-slate-500>8 minutes ago</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
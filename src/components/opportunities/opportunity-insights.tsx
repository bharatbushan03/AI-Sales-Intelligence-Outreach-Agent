export default function OpportunityInsights() {
  return (
    <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-800">
      <div className="space-y-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-slate-100">
            Opportunity Insights
          </h2>
          <button className="text-sm text-indigo-400 hover:text-indigo-300">
            Refresh Insights
          </div>
        </div>

        {/* Top Opportunities */}
        <div className="space-y-4">
          <p className="text-sm font-medium text-slate-100 mb-2">Top 3 Opportunities</p>
          <div className="space-y-3">
            <div className="border-t border-slate-700 pt-3 first:border-t-0">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0">
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                </div>
                <div className="flex-1 space-y-0.5">
                  <p className="text-xs font-medium text-slate-100">#1 Priority</p>
                  <p className="text-xs text-slate-400">Global Enterprises Ltd</p>
                  <p className="text-xs text-indigo-400 font-medium">$2.0M • 30% Probability</p>
                </div>
              </div>
            </div>
            <div className="border-t border-slate-700 pt-3">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0">
                  <div className="w-2 h-2 bg-blue-500 rounded-full" />
                </div>
                <div className="flex-1 space-y-0.5">
                  <p className="text-xs font-medium text-slate-100">#2 Priority</p>
                  <p className="text-xs text-slate-400">TechCorp Solutions</p>
                  <p className="text-xs text-indigo-400 font-medium">$750K • 65% Probability</p>
                </div>
              </div>
            </div>
            <div className="border-t border-slate-700 pt-3">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full" />
                </div>
                <div className="flex-1 space-y-0.5">
                  <p className="text-xs font-medium text-slate-100">#3 Priority</p>
                  <p className="text-xs text-slate-400">Innovatech Dynamics</p>
                  <p className="text-xs text-indigo-400 font-medium">$450K • 60% Probability</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Win/Loss Analysis */}
        <div className="space-y-4">
          <p className="text-sm font-medium text-slate-100 mb-2">Win/Loss Analysis (Last Quarter)</p>
          <div className="grid gap-2">
            <div className="bg-slate-900/30 border border-slate-800/50 p-3">
              <p className="text-xs font-medium text-slate-100">Won</p>
              <p className="text-lg font-bold text-emerald-400">12</p>
              <p className="text-xs text-slate-400">Deals Closed Won</p>
            </div>
            <div className="bg-slate-900/30 border border-slate-800/50 p-3">
              <p className="text-xs font-medium text-slate-100">Lost</p>
              <p className="text-lg font-bold text-red-400">8</p>
              <p className="text-xs text-slate-400">Deals Closed Lost</p
            </div>
            <div className="bg-slate-900/30 border border-slate-800/50 p-3">
              <p className="text-xs font-medium text-slate-100">Win Rate</p>
              <p className="text-lg font-bold text-indigo-400">60%</p>
              <p className="text-xs text-slate-400">Overall Performance</p>
            </div>
            <div className="bg-slate-900/30 border border-slate-800/50 p-3">
              <p className="text-xs font-medium text-slate-100">Avg. Deal Size</p>
              <p className="text-lg font-bold text-indigo-400">$180K</p>
              <p className="text-xs text-slate-400">Won Deals Average</p>
            </div>
          </div>
        </div>

        {/* Sales Velocity */}
        <div className="mt-4 pt-3 border-t border-slate-800">
          <p className="text-sm font-medium text-slate-100 mb-2">Sales Velocity</p>
          <div className="space-y-2">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0">
                <div className="w-2 h-2 bg-indigo-500 rounded-full" />
              </div>
              <div className="flex-1">
                <p className="text-xs font-medium text-slate-100">Pipeline Velocity</p>
                <p className="text-xs text-slate-400">$45K/day</p>
                <p className="text-xs text-indigo-400">+12% MoM</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0">
                <div className="w-2 h-2 bg-green-500 rounded-full" />
              </div>
              <div className="flex-1">
                <p className="text-xs font-medium text-slate-100">Cycle Time</p>
                <p className="text-xs text-slate-400">42 days</p>
                <p className="text-xs text-indigo-400">-8% MoM</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0">
                <div className="w-2 h-2 bg-yellow-500 rounded-full" />
              </div>
              <div className="flex-1">
                <p className="text-xs font-medium text-slate-100">Conversion Rate</p>
                <p className="text-xs text-slate-400">18%</p>
                <p className="text-xs text-indigo-400">+5% MoM</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
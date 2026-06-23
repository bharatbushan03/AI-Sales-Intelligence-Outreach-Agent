export default function OpportunityAnalytics() {
  return (
    <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-800">
      <div className="space-y-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-slate-100">
            Opportunity Analytics
          </h2>
          <button className="text-sm text-indigo-400 hover:text-indigo-300">
            Export Report
          </div>
        </div>

        {/* Stage Distribution */}
        <div className="space-y-4">
          <p className="text-sm font-medium text-slate-100 mb-2">Pipeline by Stage</p>
          <div className="space-y-2">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0">
                <div className="w-2 h-2 bg-indigo-500 rounded-full" />
              </div>
              <div className="flex-1">
                <p className="text-xs font-medium text-slate-100">Prospecting</p>
                <div className="w-full bg-slate-800/50 h-2 rounded overflow-hidden">
                  <div className="bg-indigo-500 h-2 w-[20%] rounded" />
                </div>
                <span className="text-xs">20% (4 deals)</span>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0">
                <div className="w-2 h-2 bg-yellow-500 rounded-full" />
              </div>
              <div className="flex-1">
                <p className="text-xs font-medium text-slate-100">Qualification</p>
                <div className="w-full bg-slate-800/50 h-2 rounded overflow-hidden">
                  <div className="bg-yellow-500 h-2 w-[40%] rounded" />
                </div>
                <span className="text-xs">40% (8 deals)</span>
              </div>
            </div
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0">
              <div className="w-2 h-2 bg-green-500 rounded-full" />
            </div>
            <div className="flex-1">
              <p className="text-xs font-medium text-slate-100">Proposal</p>
              <div className="w-full bg-slate-800/50 h-2 rounded overflow-hidden">
                <div className="bg-green-500 h-2 w-[25%] rounded" />
              </div>
              <span className="text-xs">25% (5 deals)</span>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0">
              <div className="w-2 h-2 bg-blue-500 rounded-full" />
            </div>
            <div className="flex-1">
              <p className="text-xs font-medium text-slate-100">Negotiation</p>
              <div className="w-full bg-slate-800/50 h-2 rounded overflow-hidden">
                <div className="bg-blue-500 h-2 w-[10%] rounded" />
              </div>
              <span className="text-xs">10% (2 deals)</span>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0">
              <div className="w-2 h-2 bg-emerald-500 rounded-full" />
            </div>
            <div className="flex-1">
              <p className="text-xs font-medium text-slate-100">Closed Won</p>
              <div className="w-full bg-slate-800/50 h-2 rounded overflow-hidden">
                <div className="bg-emerald-500 h-2 w-[5%] rounded" />
              </div>
              <span className="text-xs">5% (1 deals)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Value Distribution */}
      <div className="space-y-4">
        <p className="text-sm font-medium text-slate-100 mb-2">Value Distribution</p>
        <div className="grid gap-2">
          <div>
            <p className="text-xs font-medium text-slate-100">Under $50K</p>
            <p className="text-xs text-slate-400">$200K (5%)</p>
          </div>
          <div>
            <p className="text-xs font-medium text-slate-100">$50K - $250K</p>
            <p className="text-xs text-slate-400">$800K (21%)</p>
          </div>
          <div>
            <p className="text-xs font-medium text-slate-100">$250K - $500K</p>
            <p className="text-xs text-slate-400">$900K (24%)</p>
          </div>
          <div>
            <p className="text-xs font-medium text-slate-100">$500K - $1M</p>
            <p className="text-xs text-slate-400">$700K (18%)</p>
          </div>
          <div>
            <p className="text-xs font-medium text-slate-100">Over $1M</p>
            <p className="text-xs text-slate-400">$1.2M (32%)</p>
          </div>
        </div>
      </div>

      {/* Forecast Accuracy */}
      <div className="mt-4 pt-3 border-t border-slate-800">
        <p className="text-sm font-medium text-slate-100 mb-2">Forecast Accuracy</p>
        <div className="space-y-2">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0">
              <div className="w-2 h-2 bg-indigo-500 rounded-full" />
            </div>
            <div className="flex-1 space-y-0.5">
              <p className="text-xs font-medium text-slate-100">This Month</p>
              <p className="text-xs text-slate-400">Projected: $450K • Actual: $420K</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0">
              <div className="w-2 h-2 bg-green-500 rounded-full" />
            </div>
            <div className="flex-1 space-y-0.5">
              <p className="text-xs font-medium text-slate-100">Accuracy Rate</p>
              <p className="text-xs text-slate-400">93% (±$30K variance)</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
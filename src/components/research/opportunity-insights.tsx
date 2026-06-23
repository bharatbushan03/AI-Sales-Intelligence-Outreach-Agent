export default function OpportunityInsights() {
  return (
    <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-800">
      <div className="space-y-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-slate-100">
            Opportunity Insights
          </h2>
          <button className="text-sm text-indigo-400 hover:text-indigo-300">
            Export Insights
          </div>
        </div>

        {/* Confidence Meter */}
        <div className="space-y-3">
          <p className="text-sm font-medium text-slate-100">Overall Confidence Score</p>
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-indigo-500 rounded-full" />
            <div className="flex-1">
              <div className="w-full bg-slate-800/50 h-2 rounded overflow-hidden">
                <div className="bg-indigo-500 h-2 w-[85%] rounded" />
              </div>
            </div>
            <span className="text-xs font-medium text-slate-100">85%</span>
          </div>
        </div>

        {/* Opportunity Matrix */}
        <div className="space-y-4">
          <p className="text-sm font-medium text-slate-100">Opportunity Matrix</p>
          <div className="grid gap-2">
            {/* Matrix Header */}
            <div className="grid grid-cols-3 text-xs text-slate-400">
              <span></span>
              <span className="text-center">Low Effort</span>
              <span className="text-center">High Effort</span>
            </div>
            {/* Matrix Cells */}
            <div className="grid grid-cols-3 gap-1">
              {/* High Impact, Low Effort */}
              <div className="bg-indigo-900/30 border border-indigo-800/50 p-2 text-xs text-center">
                <span className="font-medium">Quick Wins</span>
                <span className="block">TechCorp API Integration</span>
              </div>
              {/* High Impact, High Effort */}
              <div className="bg-indigo-900/50 border border-indigo-800 p-2 text-xs text-center">
                <span className="font-medium">Strategic Initiatives</span>
                <span className="block">Global Enterprise Partnership</span>
              </div>
              {/* Low Impact, Low Effort */}
              <div className="bg-slate-800/30 border border-slate-700/50 p-2 text-xs text-center">
                <span>Low Priority</span>
                <span className="block">StartupXYZ Newsletter</span>
              </div>
              {/* Low Impact, High Effort */}
              <div className="bg-slate-800/50 border border-slate-700 p-2 text-xs text-center">
                <span>Reconsider</span>
                <span className="block">Custom Feature Development</span>
              </div>
              {/* Empty cells for layout */}
              <div></div>
              <div></div>
              <div></div>
              <div></div>
            </div>
          </div>
        </div>

        {/* Risk Assessment */}
        <div className="space-y-4">
          <p className="text-sm font-medium text-slate-100">Risk Assessment</p>
          <div className="space-y-2">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0">
                <div className="w-2 h-2 bg-green-500 rounded-full" />
              </div>
              <div className="flex-1 space-y-0.5">
                <p className="text-xs font-medium text-slate-100">Market Risk</p>
                <p className="text-xs text-slate-400">Low - Stable demand in target sectors</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0">
                <div className="w-2 h-2 bg-yellow-500 rounded-full" />
              </div>
              <div className="flex-1 space-y-0.5">
                <p className="text-xs font-medium text-slate-100">Technical Risk</p>
                <p className="text-xs text-slate-400">Medium - Integration complexity with legacy systems</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0">
                <div className="w-2 h-2 bg-red-500 rounded-full" />
              </div>
              <div className="flex-1 space-y-0.5">
                <p className="text-xs font-medium text-slate-100">Execution Risk</p>
                <p className="text-xs text-slate-400">Low - Experienced team with proven track record</p>
              </div>
            </div>
          </div>
        </div>

        {/* Recommendation */}
        <div className="mt-4 pt-3 border-t border-slate-800">
          <p className="text-sm font-medium text-slate-100 mb-2">Recommended Action</p>
          <div className="bg-indigo-900/50 border border-indigo-800 rounded-xl p-3">
            <p className="text-xs text-indigo-300 flex items-center gap-2">
              <span className="flex-shrink-0">
                <Brain className="h-3 w-3" />
              </span>
              <span className="flex-1">
                Prioritize engagement with TechCorp Solutions for quick-win API integration project
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
export default function KnowledgeGraph() {
  return (
    <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-800">
      <div className="space-y-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-slate-100">
            Knowledge Graph
          </h2>
          <div className="flex items-center gap-2">
            <button className="text-sm text-indigo-400 hover:text-indigo-300">
              <Search className="h-3 w-3" /> Search Entities
            </div>
            <button className="text-sm text-indigo-400 hover:text-indigo-300">
              <FileText className="h-3 w-3" /> Export Graph
            </div>
          </div>
        </div>

        {/* Graph Controls */}
        <div className="mb-4">
          <div className="flex flex-wrap gap-2">
            <label className="flex items-center gap-1 text-xs">
              <input
                type="checkbox"
                className="h-3 w-3 text-indigo-600 focus:ring-indigo-500"
                checked
              />
              Show Companies
            </label>
            <label className="flex items-center gap-1 text-xs">
              <input
                type="checkbox"
                className="h-3 w-3 text-indigo-600 focus:ring-indigo-500"
              />
              Show People
            </label>
            <label className="flex items-center gap-1 text-xs">
              <input
                type="checkbox"
                className="h-3 w-3 text-indigo-600 focus:ring-indigo-500"
              />
              Show Relationships
            </label>
            <label className="flex items-center gap-1 text-xs">
              <input
                type="checkbox"
                className="h-3 w-3 text-indigo-600 focus:ring-indigo-500"
                checked
              />
              Show Insights
            </label>
            <label className="flex items-center gap-1 text-xs">
              <input
                type="checkbox"
                className="h-3 w-3 text-indigo-600 focus:ring-indigo-500"
              />
              Show Trends
            </label>
          </div>
        </div>

        {/* Graph Visualization */}
        <div className="h-[400px] relative">
          <div className="absolute inset-0 bg-slate-900/30 rounded-lg p-4">
            {/* Knowledge Graph Nodes and Connections */}
            <div className="absolute left-10 top-1/4 -translate-x-1/2 -translate-y-1/2">
              <div className="w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center">
                <div className="w-4 h-4 bg-white rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-indigo-500 rounded-full" />
                </div>
              </div>
              <div className="w-28 bg-slate-900/50 rounded-lg p-2 text-xs text-center border border-slate-800">
                TechCorp Solutions
              </div>
            </div>

            {/* Connected Companies */}
            <div className="absolute right-10 top-1/3 -translate-x-1/2 -translate-y-1/2">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <div className="w-4 h-4 bg-white rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                </div>
              </div>
              <div className="w-28 bg-slate-900/50 rounded-lg p-2 text-xs text-center border border-slate-800">
                Global Enterprises Ltd
              </div>
            </div>

            <div className="absolute left-10 bottom-1/3 -translate-x-1/2 -translate-y-1/2">
              <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                <div className="w-4 h-4 bg-white rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full" />
                </div>
              </div>
              <div className="w-28 bg-slate-900/50 rounded-lg p-2 text-xs text-center border border-slate-800">
                StartupXYZ Inc
              </div>
            </div>

            <div className="absolute right-10 bottom-1/4 -translate-x-1/2 -translate-y-1/2">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <div className="w-4 h-4 bg-white rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-blue-500 rounded-full" />
                </div>
              </div>
              <div className="w-28 bg-slate-900/50 rounded-lg p-2 text-xs text-center border border-slate-800">
                Innovatech Dynamics
              </div>
            </div>

            {/* Key People */}
            <div className="absolute left-20 top-1/2 -translate-x-1/2 -translate-y-1/2">
              <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
                <div className="w-3 h-3 bg-white rounded-full flex items-center justify-center">
                  <div className="w-1 h-1 bg-purple-500 rounded-full" />
                </div>
              </div>
              <div className="w-24 bg-slate-900/50 rounded-lg p-1 text-xs text-center border border-slate-800">
                Robert Taylor (CTO)
              </div>
            </div>

            <div className="absolute right-20 top-1/2 -translate-x-1/2 -translate-y-1/2">
              <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
                <div className="w-3 h-3 bg-white rounded-full flex items-center justify-center">
                  <div className="w-1 h-1 bg-purple-500 rounded-full" />
                </div>
              </div>
              <div className="w-24 bg-slate-900/50 rounded-lg p-1 text-xs text-center border border-slate-800">
                Sarah Chen (VP Sales)
              </div>
            </div>

            {/* Connection Lines */}
            <svg className="absolute inset-0 pointer-events-none">
              <!-- Company Connections -->
              <line x1="20" y1="80" x2="180" y2="80" stroke="indigo-500/30" strokeWidth="2" />
              <line x1="20" y1="220" x2="180" y2="220" stroke="green-500/30" strokeWidth="2" />
              <line x1="20" y1="360" x2="180" y2="360" stroke="yellow-500/30" strokeWidth="2" />
              <line x1="20" y1="500" x2="180" y2="500" stroke="blue-500/30" strokeWidth="2" />

              <!-- Company to Person Connections -->
              <line x1="100" y1="140" x2="60" y2="200" stroke="purple-500/30" strokeWidth="1" strokeDashArray="4,2" />
              <line x1="100" y1="140" x2="140" y2="200" stroke="purple-500/30" strokeWidth="1" strokeDashArray="4,2" />
              <line x1="100" y1="280" x2="60" y2="340" stroke="purple-500/30" strokeWidth="1" strokeDashArray="4,2" />
              <line x1="100" y1="280" x2="140" y2="340" stroke="purple-500/30" strokeWidth="1" strokeDashArray="4,2" />
            </svg>
          </div>
        </div>

        {/* Graph Insights */}
        <div className="mt-4 pt-3 border-t border-slate-800">
          <p className="text-sm font-medium text-slate-100 mb-2">Graph Insights</p>
          <div className="space-y-2">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0">
                <div className="w-2 h-2 bg-indigo-500 rounded-full" />
              </div>
              <div className="flex-1 space-y-0.5">
                <p className="text-xs font-medium text-slate-100">Central Entities</p>
                <p className="text-xs text-slate-400">TechCorp, Global Enterprises (highest connectivity)</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0">
                <div className="w-2 h-2 bg-green-500 rounded-full" />
              </div>
              <div className="flex-1 space-y-0.5">
                <p className="text-xs font-medium text-slate-100">Community Clusters</p>
                <p className="text-xs text-slate-400">3 distinct clusters identified (Tech, Finance, Healthcare)</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0">
                <div className="w-2 h-2 bg-yellow-500 rounded-full" />
              </div>
              <div className="flex-1 space-y-0.5">
                <p className="text-xs font-medium text-slate-100">Relationship Strength</p>
                <p className="text-xs text-slate-400">Avg. connection strength: 0.73/1.0</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
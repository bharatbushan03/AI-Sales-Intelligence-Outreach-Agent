export default function MemoryOverview() {
  return (
    <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-800">
      <div className="space-y-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-slate-100">
            Memory Overview
          </h2>
          <button className="text-sm text-indigo-400 hover:text-indigo-300">
            <RefreshCw className="h-3 w-3" /> Refresh Memory
          </div>
        </div>

        {/* Memory Stats */}
        <div className="space-y-4">
          <p className="text-sm font-medium text-slate-100 mb-2">Memory System Statistics</p>
          <div className="grid gap-4 grid-cols-2">
            <div>
              <p className="text-xs font-medium text-slate-100">Total Entries</p>
              <p className="text-lg font-bold text-slate-100">2.4M</p>
            </div>
            <div>
              <p className="text-xs font-medium text-slate-100">Companies Tracked</p>
              <p className="text-lg font-bold text-slate-100">15,800</p>
            </div>
            <div>
              <p className="text-xs font-medium text-slate-100">Relationships Mapped</p>
              <p className="text-lg font-bold text-slate-100">8.9M</p>
            </div>
            <div>
              <p className="text-xs font-medium text-slate-100">Insights Generated</p>
              <p className="text-lg font-bold text-slate-100">420K</p>
            </div>
            <div>
              <p className="text-xs font-medium text-slate-100">Memory Utilization</p>
              <p className="text-lg font-bold text-slate-100">68%</p>
            </div>
            <div>
              <p className="text-xs font-medium text-slate-100">Update Frequency</p>
              <p className="text-lg font-bold text-slate-100">Real-time</p>
            </div>
            <div>
              <p className="text-xs font-medium text-slate-100">Accuracy Score</p>
              <p className="text-lg font-bold text-indigo-400">94%</p>
            </div>
            <div>
              <p className="text-xs font-medium text-slate-100">Last Updated</p>
              <p className="text-lg font-bold text-slate-100">2 minutes ago</p>
            </div>
          </div>
        </div>

        {/* Memory Health */}
        <div className="space-y-4">
          <p className="text-sm font-medium text-slate-100 mb-2">Memory Health Indicators</p>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0">
                <div className="w-2 h-2 bg-indigo-500 rounded-full" />
              </div>
              <div className="flex-1">
                <p className="text-xs font-medium text-slate-100">Data Freshness</p>
                <div className="w-full bg-slate-800/50 h-2 rounded overflow-hidden">
                  <div className="bg-indigo-500 h-2 w-[85%] rounded" />
                </div>
                <span className="text-xs">85%</span>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0">
                <div className="w-2 h-2 bg-green-500 rounded-full" />
              </div>
              <div className="flex-1">
                <p className="text-xs font-medium text-slate-100">Connection Integrity</p>
                <div className="w-full bg-slate-800/50 h-2 rounded overflow-hidden">
                  <div className="bg-green-500 h-2 w-[92%] rounded" />
                </div>
                <span className="text-xs">92%</span>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0">
                <div className="w-2 h-2 bg-yellow-500 rounded-full" />
              </div>
              <div className="flex-1">
                <p className="text-xs font-medium text-slate-100">Query Performance</p>
                <div className="w-full bg-slate-800/50 h-2 rounded overflow-hidden">
                  <div className="bg-yellow-500 h-2 w-[78%] rounded" />
                </div>
                <span className="text-xs">78%</span>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0">
                <div className="w-2 h-2 bg-blue-500 rounded-full" />
              </div>
              <div className="flex-1">
                <p className="text-xs font-medium text-slate-100">Storage Efficiency</p>
                <div className="w-full bg-slate-800/50 h-2 rounded overflow-hidden">
                  <div className="bg-blue-500 h-2 w-[88%] rounded" />
                </div
                <span className="text-xs">88%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Memory Activity */}
        <div className="mt-4 pt-3 border-t border-slate-800">
          <p className="text-sm font-medium text-slate-100 mb-2">Recent Memory Activity</p>
          <div className="space-y-3">
            <div className="flex items-start gap-3 border-t border-slate-800 pt-3 first:border-t-0">
              <div className="flex-shrink-0">
                <div className="w-2 h-2 bg-indigo-500 rounded-full" />
              </div>
              <div className="flex-1 space-y-0.5">
                <p className="text-xs font-medium text-slate-100">New Company Profile</p>
                <p className="text-xs text-slate-400">Added: Innovatech Dynamics</p>
                <p className="text-xs text-slate-500">2 minutes ago</p>
              </div>
            </div>
            <div className="flex items-start gap-3 border-t border-slate-800 pt-3">
              <div className="flex-shrink-0">
                <div className="w-2 h-2 bg-green-500 rounded-full" />
              </div>
              <div className="flex-1 space-y-0.5">
                <p className="text-xs font-medium text-slate-100">Relationship Updated</p>
                <p className="text-xs text-slate-400">TechCorp → Global Enterprises (Partnership)</p>
                <p className="text-xs text-slate-500">5 minutes ago</p>
              </div>
            </div>
            <div className="flex items-start gap-3 border-t border-slate-800 pt-3">
              <div className="flex-shrink-0">
                <div className="w-2 h-2 bg-yellow-500 rounded-full" />
              </div>
              <div className="flex-1 space-y-0.5">
                <p className="text-xs font-medium text-slate-100">Insight Generated</p>
                <p className="text-xs text-slate-400">Market expansion opportunity identified</p>
                <p className="text-xs text-slate-500">8 minutes ago</p
              </div>
            </div>
            <div className="flex items-start gap-3 border-t border-slate-800 pt-3">
              <div className="flex-shrink-0">
                <div className="w-2 h-2 bg-red-500 rounded-full" />
              </div>
              <div className="flex-1 space-y-0.5">
                <p className="text-xs font-medium text-slate-100">Data Quality Issue</p>
                <p className="text-xs text-slate-400">Duplicate entry detected and resolved</p>
                <p className="text-xs text-slate-500">12 minutes ago</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
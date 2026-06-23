export default function UsageAnalytics() {
  return (
    <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-800">
      <div className="space-y-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-slate-100">
            Usage Analytics
          </h2>
          <button className="text-sm text-indigo-400 hover:text-indigo-300">
            <RefreshCw className="h-3 w-3" /> Export Report
          </button>
        </div>

        {/* Usage by Module */}
        <div className="space-y-4">
          <p className="text-sm font-medium text-slate-100 mb-2">Usage by Module (Last 30 Days)</p>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0">
                <div className="w-2 h-2 bg-indigo-500 rounded-full" />
              </div>
              <div className="flex-1">
                <p className="text-xs font-medium text-slate-100">Research Module</p>
                <div className="w-full bg-slate-800/50 h-2 rounded overflow-hidden">
                  <div className="bg-indigo-500 h-2 w-[65%] rounded" />
                </div>
                <span className="text-xs">65% of total usage</span>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0">
                <div className="w-2 h-2 bg-green-500 rounded-full" />
              </div>
              <div className="flex-1">
                <p className="text-xs font-medium text-slate-100">Outreach Module</p>
                <div className="w-full bg-slate-800/50 h-2 rounded overflow-hidden">
                  <div className="bg-green-500 h-2 w-[20%] rounded" />
                </div>
                <span className="text-xs">20% of total usage</span>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0">
                <div className="w-2 h-2 bg-yellow-500 rounded-full" />
              </div>
              <div className="flex-1">
                <p className="text-xs font-medium text-slate-100">CRM Module</p>
                <div className="w-full bg-slate-800/50 h-2 rounded overflow-hidden">
                  <div className="bg-yellow-500 h-2 w-[10%] rounded" />
                </div>
                <span className="text-xs">10% of total usage</span>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0">
                <div className="w-2 h-2 bg-blue-500 rounded-full" />
              </div>
              <div className="flex-1">
                <p className="text-xs font-medium text-slate-100">Proposal Module</p>
                <div className="w-full bg-slate-800/50 h-2 rounded overflow-hidden">
                  <div className="bg-blue-500 h-2 w-[5%] rounded" />
                </div>
                <span className="text-xs">5% of total usage</span>
              </div>
            </div>
          </div>
        </div>

        {/* Resource Utilization */}
        <div className="space-y-4">
          <p className="text-sm font-medium text-slate-100 mb-2">Resource Utilization</p>
          <div className="grid gap-4 grid-cols-2">
            <div>
              <p className="text-xs font-medium text-slate-100">AI Compute</p>
              <div className="w-full bg-slate-800/50 h-2 rounded overflow-hidden">
                <div className="bg-indigo-500 h-2 w-[78%] rounded" />
              </div>
              <span className="text-xs">78% utilization</span>
            </div>
            <div>
              <p className="text-xs font-medium text-slate-100">Database Storage</p>
              <div className="w-full bg-slate-800/50 h-2 rounded overflow-hidden">
                <div className="bg-indigo-500 h-2 w-[45%] rounded" />
              </div>
              <span className="text-xs">45% utilization</span>
            </div>
            <div>
              <p className="text-xs font-medium text-slate-100">Network Bandwidth</p>
              <div className="w-full bg-slate-800/50 h-2 rounded overflow-hidden">
                <div className="bg-indigo-500 h-2 w-[32%] rounded" />
              </div>
              <span className="text-xs">32% utilization</span>
            </div>
            <div>
              <p className="text-xs font-medium text-slate-100">Memory Usage</p>
              <div className="w-full bg-slate-800/50 h-2 rounded overflow-hidden">
                <div className="bg-indigo-500 h-2 w-[68%] rounded" />
              </div>
              <span className="text-xs">68% utilization</span>
            </div>
          </div>
        </div>

        {/* User Activity */}
        <div className="space-y-4">
          <p className="text-sm font-medium text-slate-100 mb-2">User Activity (Last 7 Days)</p>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0">
                <div className="w-2 h-2 bg-indigo-500 rounded-full" />
              </div>
              <div className="flex-1">
                <p className="text-xs font-medium text-slate-100">Active Users</p>
                <p className="text-lg font-bold text-indigo-400>124</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0">
                <div className="w-2 h-2 bg-green-500 rounded-full" />
              </div>
              <div className="flex-1">
                <p className="text-xs font-medium text-slate-100">New Users</p>
                <p className="text-lg font-bold text-indigo-400>18</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0">
                <div className="w-2 h-2 bg-yellow-500 rounded-full" />
              </div>
              <div className="flex-1">
                <p className="text-xs font-medium text-slate-100">Avg. Session Duration</p>
                <p className="text-lg font-bold text-indigo-400>42 minutes</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0">
                <div className="w-2 h-2 bg-blue-500 rounded-full" />
              </div
              <div className="flex-1>
                <p className="text-xs font-medium text-slate-100>Feature Adoption</p>
                <p className="text-lg font-bold text-indigo-400>73%</p>
              </div>
            </div>
          </div>
        </div>

        {/* API Usage */}
        <div className="mt-4 pt-3 border-t border-slate-800>
          <p className="text-sm font-medium text-slate-100 mb-2>API Usage Statistics</p>
          <div className="space-y-3>
            <div className="flex items-start gap-3>
              <div className="flex-shrink-0>
                <div className="w-2 h-2 bg-indigo-500 rounded-full" />
              </div>
              <div className="flex-1>
                <p className="text-xs font-medium text-slate-100>Total API Calls</p>
                <p className="text-lg font-bold text-slate-100>2.4M</p>
              </div>
            </div>
            <div className="flex items-start gap-3>
              <div className="flex-shrink-0>
                <div className="w-2 h-2 bg-green-500 rounded-full" />
              </div
              <div className="flex-1>
                <p className="text-xs font-medium text-slate-100>Successful Calls</p>
                <p className="text-lg font-bold text-indigo-400>98.5%</p>
              </div>
            </div>
            <div className="flex items-start gap-3>
              <div className="flex-shrink-0>
                <div className="w-2 h-2 bg-yellow-500 rounded-full" />
              </div>
              <div className="flex-1>
                <p className="text-xs font-medium text-slate-100>Avg. Response Time</p>
                <p className="text-lg font-bold text-indigo-400>145ms</p>
              </div>
            </div>
            <div className="flex items-start gap-3>
              <div className="flex-shrink-0>
                <div className="w-2 h-2 bg-blue-500 rounded-full" />
              </div>
              <div className="flex-1>
                <p className="text-xs font-medium text-slate-100>Rate Limit Hits</p>
                <p className="text-lg font-bold text-indigo-400>2.3%</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
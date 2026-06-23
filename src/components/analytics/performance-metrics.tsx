export default function PerformanceMetrics() {
  return (
    <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-800">
      <div className="space-y-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-slate-100">
            Performance Metrics
          </h2>
          <button className="text-sm text-indigo-400 hover:text-indigo-300">
            <RefreshCw className="h-3 w-3" /> Export Report
          </button>
        </div>

        {/* System Performance */}
        <div className="space-y-4">
          <p className="text-sm font-medium text-slate-100 mb-2">System Performance</p>
          <div className="grid gap-4 grid-cols-2">
            <div>
              <p className="text-xs font-medium text-slate-100">Page Load Time</p>
              <div className="w-full bg-slate-800/50 h-2 rounded overflow-hidden">
                <div className="bg-indigo-500 h-2 w-[75%] rounded" /> {/* Good: under 2s */}
              </div>
              <span className="text-xs">1.8s (Target: &lt;2s)</span>
            </div>
            <div>
              <p className="text-xs font-medium text-slate-100">API Response Time</p>
              <div className="w-full bg-slate-800/50 h-2 rounded overflow-hidden">
                <div className="bg-indigo-500 h-2 w-[85%] rounded" /> {/* Good: under 200ms */}
              </div>
              <span className="text-xs">145ms (Target: &lt;200ms)</span>
            </div>
            <div>
              <p className="text-xs font-medium text-slate-100">Database Query Time</p>
              <div className="w-full bg-slate-800/50 h-2 rounded overflow-hidden">
                <div className="bg-indigo-500 h-2 w-[60%] rounded" /> {/* Good: under 100ms */}
              </div>
              <span className="text-xs">85ms (Target: &lt;100ms)</span>
            </div>
            <div>
              <p className="text-xs font-medium text-slate-100">Cache Hit Ratio</p>
              <div className="w-full bg-slate-800/50 h-2 rounded overflow-hidden">
                <div className="bg-indigo-500 h-2 w-[82%] rounded" /> {/* Good: >80% */}
              </div>
              <span className="text-xs">82% (Target: >80%)</span>
            </div>
          </div>
        </div>

        {/* AI Performance */}
        <div className="space-y-4">
          <p className="text-sm font-medium text-slate-100 mb-2">AI Model Performance</p>
          <div className="grid gap-4 grid-cols-2">
            <div>
              <p className="text-xs font-medium text-slate-100">Lead Scoring Accuracy</p>
              <div className="w-full bg-slate-800/50 h-2 rounded overflow-hidden">
                <div className="bg-indigo-500 h-2 w-[88%] rounded" />
              </div>
              <span className="text-xs">88% accuracy</span>
            </div
            <div>
              <p className="text-xs font-medium text-slate-100>Email Classification Accuracy</p>
              <div className="w-full bg-slate-800/50 h-2 rounded overflow-hidden">
                <div className="bg-indigo-500 h-2 w-[92%] rounded" />
              </div>
              <span className="text-xs">92% accuracy</span>
            </div>
            <div>
              <p className="text-xs font-medium text-slate-100>Response Generation Quality</p>
              <div className="w-full bg-slate-800/50 h-2 rounded overflow-hidden">
                <div className="bg-indigo-500 h-2 w-[85%] rounded" />
              </div>
              <span className="text-xs">85% quality score</span>
            </div>
            <div>
              <p className="text-xs font-medium text-slate-100>Prediction Confidence</p>
              <div className="w-full bg-slate-800/50 h-2 rounded overflow-hidden">
                <div className="bg-indigo-500 h-2 w-[78%] rounded" />
              </div>
              <span className="text-xs">78% average confidence</span>
            </div>
          </div>
        </div>

        {/* Business Impact */}
        <div className="space-y-4">
          <p className="text-sm font-medium text-slate-100 mb-2>Business Impact Metrics</p>
          <div className="grid gap-4 grid-cols-2>
            <div>
              <p className="text-xs font-medium text-slate-100>Time Saved per User</p>
              <p className="text-lg font-bold text-indigo-400>12.5 hrs/week</p>
            </div>
            <div>
              <p className="text-xs font-medium text-slate-100>Process Automation Rate</p>
              <p className="text-lg font-bold text-indigo-400>68%</p>
            </div>
            <div>
              <p className="text-xs font-medium text-slate-100>Error Reduction</p>
              <p className="text-lg font-bold text-indigo-400>76%</p>
            </div>
            <div>
              <p className="text-xs font-medium text-slate-100>Decision Speed Improvement</p>
              <p className="text-lg font-bold text-indigo-400>3.2x faster</p>
            </div>
          </div>
        </div>

        {/* SLA Compliance */}
        <div className="mt-4 pt-3 border-t border-slate-800>
          <p className="text-sm font-medium text-slate-100 mb-2>Service Level Agreement Compliance</p>
          <div className="space-y-3>
            <div className="flex items-start gap-3>
              <div className="flex-shrink-0>
                <div className="w-2 h-2 bg-indigo-500 rounded-full" />
              </div>
              <div className="flex-1>
                <p className="text-xs font-medium text-slate-100>Uptime SLA (99.9%)</p>
                <p className="text-lg font-bold text-indigo-400>99.8%</p>
              </div>
            </div>
            <div className="flex items-start gap-3>
              <div className="flex-shrink-0>
                <div className="w-2 h-2 bg-green-500 rounded-full" />
              </div>
              <div className="flex-1>
                <p className="text-xs font-medium text-slate-100>Response Time SLA (<5s)</p>
                <p className="text-lg font-bold text-indigo-400>98.7%</p>
              </div>
            </div>
            <div className="flex items-start gap-3>
              <div className="flex-shrink-0>
                <div className="w-2 h-2 bg-yellow-500 rounded-full" />
              </div>
              <div className="flex-1>
                <p className="text-xs font-medium text-slate-100>Resolution Time SLA (<24h)</p>
                <p className="text-lg font-bold text-indigo-400>95.2%</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
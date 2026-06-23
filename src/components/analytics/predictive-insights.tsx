export default function PredictiveInsights() {
  return (
    <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-800">
      <div className="space-y-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-slate-100">
            Predictive Insights
          </h2>
          <button className="text-sm text-indigo-400 hover:text-indigo-300">
            <RefreshCw className="h-3 w-3" /> Refresh Insights
          </button>
        </div>

        {/* Forecast Accuracy */}
        <div className="space-y-4>
          <p className="text-sm font-medium text-slate-100 mb-2>Forecast Accuracy (Last Quarter)</p>
          <div className="grid gap-4 grid-cols-2>
            <div>
              <p className="text-xs font-medium text-slate-100>Revenue Forecast</p>
              <div className="w-full bg-slate-800/50 h-2 rounded overflow-hidden">
                <div className="bg-indigo-500 h-2 w-[85%] rounded" />
              </div>
              <span className="text-xs">85% accuracy (±$150K)</span>
            </div>
            <div>
              <p className="text-xs font-medium text-slate-100>Workflow Volume</p>
              <div className="w-full bg-slate-800/50 h-2 rounded overflow-hidden">
                <div className="bg-indigo-500 h-2 w-[78%] rounded" />
              </div>
              <span className="text-xs">78% accuracy (±120 workflows)</span>
            </div>
            <div>
              <p className="text-xs font-medium text-slate-100>Conversion Rates</p>
              <div className="w-full bg-slate-800/50 h-2 rounded overflow-hidden">
                <div className="bg-indigo-500 h-2 w-[82%] rounded" />
              </div>
              <span className="text-xs">82% accuracy (±4.2%)</span>
            </div>
            <div>
              <p className="text-xs font-medium text-slate-100>Resource Needs</p>
              <div className="w-full bg-slate-800/50 h-2 rounded overflow-hidden">
                <div className="bg-indigo-500 h-2 w-[80%] rounded" />
              </div>
              <span className="text-xs">80% accuracy (±15% variance)</span>
            </div>
          </div>
        </div>

        {/* Upcoming Trends */}
        <div className="space-y-4>
          <p className="text-sm font-medium text-slate-100 mb-2>Predicted Trends (Next 90 Days)</p>
          <div className="space-y-3>
            <div className="flex items-start gap-3 border-t border-slate-800 pt-3 first:border-t-0>
              <div className="flex-shrink-0>
                <div className="w-2 h-2 bg-indigo-500 rounded-full" />
              </div>
              <div className="flex-1 space-y-0.5>
                <p className="text-xs font-medium text-slate-100>AI Adoption Acceleration</p>
                <p className="text-xs text-indigo-400>+35% increase in AI usage predicted</p>
              </div>
            </div>
            <div className="flex items-start gap-3 border-t border-slate-800 pt-3>
              <div className="flex-shrink-0>
                <div className="w-2 h-2 bg-green-500 rounded-full" />
              </div>
              <div className="flex-1 space-y-0.5>
                <p className="text-xs font-medium text-slate-100>Market Expansion Opportunity</p>
                <p className="text-xs text-indigo-400>Emerging opportunity in FinTech sector</p>
              </div>
            </div>
            <div className="flex items-start gap-3 border-t border-slate-800 pt-3>
              <div className="flex-shrink-0>
                <div className="w-2 h-2 bg-yellow-500 rounded-full" />
              </div>
              <div className="flex-1 space-y-0.5>
                <p className="text-xs font-medium text-slate-100>Seasonal Workflow Patterns</p>
              <p className="text-xs text-ind-400>Expected 20% decrease in Q3 due to summer slowdown</p>
              </div>
            </div>
            <div className="flex items-start gap-3 border-t border-slate-800 pt-3>
              <div className="flex-shrink-0>
                <div className="w-2 h-2 bg-blue-500 rounded-full" />
              </div>
              <div className="flex-1 space-y-0.5>
                <p className="text-xs font-medium text-slate-100>Customer Churn Risk</p>
                <p className="text-xs text-red-400>3 accounts showing elevated churn risk</p>
              </div>
            </div>
          </div>
        </div>

        {/* Recommendations */}
        <div className="space-y-4>
          <p className="text-sm font-medium text-slate-100 mb-2>Recommended Actions</p>
          <div className="space-y-3>
            <div className="flex items-start gap-3 border-t border-slate-800 pt-3 first:border-t-0>
              <div className="flex-shrink-0>
                <div className="w-2 h-2 bg-indigo-500 rounded-full" />
              </div>
              <div className="flex-1 space-y-0.5>
                <p className="text-xs font-medium text-slate-100>Scale AI Infrastructure</p>
                <p className="text-xs text-indigo-400>Increase GPU allocation by 40% to handle predicted growth</p>
              </div>
            </div>
            <div className="flex items-start gap-3 border-t border-slate-800 pt-3>
              <div className="flex-shrink-0>
                <div className="w-2 h-2 bg-green-500 rounded-full" />
              </div>
              <div className="flex-1 space-y-0.5>
                <p className="text-xs font-medium text-slate-100>Targeted Marketing Campaign</p>
                <p className="text-xs text-indigo-400>Launch ABM campaign for FinTech sector</p>
              </div>
            </div
            <div className="flex items-start gap-3 border-t border-slate-800 pt-3>
              <div className="flex-shrink-0>
                <div className="w-2 h-2 bg-yellow-500 rounded-full" />
              </div>
              <div className="flex-1 space-y-0.5>
                <p className="text-xs font-medium text-slate-100>Workflow Optimization</p>
                <p className="text-xs text-indigo-400>Implement batch processing for routine tasks</p>
              </div>
            </div>
            <div className="flex items-start gap-3 border-t border-slate-800 pt-3>
              <div className="flex-shrink-0>
                <div className="w-2 h-2 bg-blue-500 rounded-full" />
              </div>
              <div className="flex-1 space-y-0.5>
                <p className="text-xs font-medium text-slate-100>Customer Success Program</p>
                <p className="text-xs text-indigo-400>Enhance onboarding for enterprise clients</p>
              </div>
            </div>
          </div>
        </div>

        {/* Scenario Planning */}
        <div className="mt-4 pt-3 border-t border-slate-800>
          <p className="text-sm font-medium text-slate-100 mb-2>Scenario Planning</p>
          <div className="space-y-3>
            <div className="flex items-start gap-3>
              <div className="flex-shrink-0>
                <div className="w-2 h-2 bg-indigo-500 rounded-full" />
              </div>
              <div className="flex-1>
                <p className="text-xs font-medium text-slate-100>Best Case Scenario</p>
                <p className="text-lg font-bold text-indigo-400>+45% revenue growth</p>
              </div>
            </div
            <div className="flex items-start gap-3>
              <div className="flex-shrink-0>
                <div className="w-2 h-2 bg-green-500 rounded-full" />
              </div>
              <div className="flex-1>
                <p className="text-xs font-medium text-slate-100>Most Likely Scenario</p>
                <p className="text-lg font-bold text-indigo-400>+22% revenue growth</p>
              </div>
            </div>
            <div className="flex items-start gap-3>
              <div className="flex-shrink-0>
                <div className="w-2 h-2 bg-yellow-500 rounded-full" />
              </div>
              <div className="flex-1>
                <p className="text-xs font-medium text-slate-100>Worst Case Scenario</p>
                <p className="text-lg font-bold text-red-400>-5% revenue growth</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default function ProposalAnalytics() {
  return (
    <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-800">
      <div className="space-y-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-slate-100">
            Proposal Analytics
          </h2>
          <button className="text-sm text-indigo-400 hover:text-indigo-300">
            <RefreshCw className="h-3 w-3" /> Export Report
          </div>
        </div>

        {/* Proposal Metrics */}
        <div className="space-y-4">
          <p className="text-sm font-medium text-slate-100 mb-2">Proposal Performance (Last 6 Months)</p>
          <div className="grid gap-3 grid-cols-2">
            <div>
              <p className="text-xs font-medium text-slate-100">Proposals Sent</p>
              <p className="text-lg font-bold text-slate-100">45</p>
            </div>
            <div>
              <p className="text-xs font-medium text-slate-100">Proposals Won</p>
              <p className="text-lg font-bold text-indigo-400">18</p>
            </div>
            <div>
              <p className="text-xs font-medium text-slate-100">Win Rate</p>
              <p className="text-lg font-bold text-indigo-400">40%</p>
            </div>
            <div>
              <p className="text-xs font-medium text-slate-100">Avg. Proposal Value</p>
              <p className="text-lg font-bold text-indigo-400">$185K</p>
            </div>
            <div>
              <p className="text-xs font-medium text-slate-100">Avg. Time to Close</p>
              <p className="text-lg font-bold text-indigo-400">22 days</p>
            </div>
            <div>
              <p className="text-xs font-medium text-slate-100">Pipeline Value</p>
              <p className="text-lg font-bold text-indigo-400">$2.4M</p>
            </div>
          </div>
        </div>

        {/* Win/Loss Analysis */}
        <div className="space-y-4">
          <p className="text-sm font-medium text-slate-100 mb-2">Win/Loss Analysis</p>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0">
                <div className="w-2 h-2 bg-indigo-500 rounded-full" />
              </div>
              <div className="flex-1">
                <p className="text-xs font-medium text-slate-100">Primary Win Reasons</p>
                <p className="text-xs text-indigo-400">• Technical superiority<br/>• Clear ROI demonstration<br/>• Strong references</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0">
                <div className="w-2 h-2 bg-red-500 rounded-full" />
              </div>
              <div className="flex-1">
                <p className="text-xs font-medium text-slate-100">Primary Loss Reasons</p>
                <p className="text-xs text-indigo-400">• Budget constraints<br/>• Timing issues<br/>• Competitor relationships</p>
              </div>
            </div>
          </div>
        </div

        {/* Conversion Funnel */}
        <div className="space-y-4">
          <p className="text-sm font-medium text-slate-100 mb-2">Conversion Funnel</p>
          <div className="flex items-center justify-center">
            <svg width="200" height="300" viewBox="0 0 200 300" className="text-indigo-400">
              <defs>
                <linearGradient id="funnelGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" style="stop-color:rgb(99,102,241);stop-opacity:0.8" />
                  <stop offset="100%" style="stop-color:rgb(99,102,241);stop-opacity:0.2" />
                </linearGradient>
              </defs>
              <!-- Funnel Shape -->
              <path d="M50,20 L150,20 L160,50 L140,50 L130,80 L70,80 L60,50 L40,50 Z" fill="url(#funnelGrad)" />
              <!-- Stage Labels -->
              <text x="100" y="40" textAnchor="middle" fontSize="10" fontWeight="bold" fill="white">Inquiries</text>
              <text x="100" y="70" textAnchor="middle" fontSize="10" fontWeight="bold" fill="white">Discovery</text>
              <text x="100" y="100" textAnchor="middle" fontSize="10" fontWeight="bold" fill="white">Proposal</text>
              <text x="100" y="130" textAnchor="middle" fontSize="10" fontWeight="bold" fill="white">Negotiation</text>
              <text x="100" y="160" textAnchor="middle" fontSize="10" fontWeight="bold" fill="white">Closed Won</text>
              <!-- Values -->
              <text x="100" y="50" textAnchor="middle" fontSize="10" fill="white">120</text>
              <text x="100" y="80" textAnchor="middle" fontSize="10" fill="white">85</text>
              <text x="100" y="110" textAnchor="middle" fontSize="10" fill="white">45</text>
              <text x="100" y="140" textAnchor="middle" fontSize="10" fill="white">25</text>
              <text x="100" y="170" textAnchor="middle" fontSize="10" fill="white">18</text>
            </svg>
          </div>
          <div className="mt-3 text-center text-xs text-slate-400">
            Inquiry → Discovery → Proposal → Negotiation → Closed Won
          </div>
        </div>

        {/* Top Performing Templates */}
        <div className="mt-4 pt-3 border-t border-slate-800">
          <p className="text-sm font-medium text-slate-100 mb-2">Top Performing Templates</p>
          <div className="space-y-2">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0">
                <div className="w-2 h-2 bg-green-500 rounded-full" />
              </div>
              <div className="flex-1">
                <p className="text-xs font-medium text-slate-100">Enterprise Solution Template</p>
                <p className="text-xs text-slate-400">Win Rate: 55% • Avg. Value: $220K</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0">
              <div className="w-2 h-2 bg-blue-500 rounded-full" />
            </div>
            <div className="flex-1">
              <p className="text-xs font-medium text-slate-100">Growth Company Template</p>
              <p className="text-xs text-slate-400">Win Rate: 48% • Avg. Value: $95K</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0">
              <div className="w-2 h-2 bg-yellow-500 rounded-full" />
            </div>
            <div className="flex-1">
              <p className="text-xs font-medium text-slate-100">Startup Pitch Template</p>
              <p className="text-xs text-slate-400">Win Rate: 42% • Avg. Value: $45K</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
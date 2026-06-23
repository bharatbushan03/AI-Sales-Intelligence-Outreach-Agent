export default function OutreachAnalytics() {
  return (
    <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-800">
      <div className="space-y-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-slate-100">
            Outreach Analytics
          </h2>
          <button className="text-sm text-indigo-400 hover:text-indigo-300">
            <RefreshCw className="h-3 w-3" /> Export Report
          </div>
        </div>

        {/* Channel Performance */}
        <div className="space-y-4">
          <p className="text-sm font-medium text-slate-100 mb-2">Channel Performance</p>
          <div className="space-y-2">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0">
                <div className="w-2 h-2 bg-indigo-500 rounded-full" />
              </div>
              <div className="flex-1">
                <p className="text-xs font-medium text-slate-100">Email</p>
                <div className="flex items-center gap-2 text-xs mt-1">
                  <span>
                    <MessageCircle className="h-3 w-3" /> 68% Open Rate
                  </span>
                  <span>
                    <Link className="h-3 w-3" /> 12% Click Rate
                  </span>
                  <span>
                    <Users className="h-3 w-3" /> 8% Reply Rate
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0">
                <div className="w-2 h-2 bg-indigo-500 rounded-full" />
              </div>
              <div className="flex-1">
                <p className="text-xs font-medium text-slate-100">LinkedIn</p>
                <div className="flex items-center gap-2 text-xs mt-1">
                  <span>
                    <Users className="h-3 w-3" /> 45% Connection Rate
                  </span>
                  <span>
                    <MessageCircle className="h-3 w-3" /> 25% Message Rate
                  </span>
                  <span>
                    <Link className="h-3 w-3" /> 15% Engagement Rate
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0">
                <div className="w-2 h-2 bg-indigo-500 rounded-full" />
              </div
              <div className="flex-1">
                <p className="text-xs font-medium text-slate-100">Phone</p>
                <div className="flex items-center gap-2 text-xs mt-1">
                  <span>
                    <Phone className="h-3 w-3" /> 35% Connect Rate
                  </span>
                  <span>
                    <Users className="h-3 w-3" /> 15% Conversation Rate
                  </span>
                  <span>
                    <TrendingUp className="h-3 w-3" /> 8% Meeting Rate
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Campaign Metrics */}
        <div className="space-y-4">
          <p className="text-sm font-medium text-slate-100 mb-2">Campaign Metrics (Last 30 Days)</p>
          <div className="grid gap-3 grid-cols-2">
            <div>
              <p className="text-xs font-medium text-slate-100">Messages Sent</p>
              <p className="text-lg font-bold text-slate-100">1,240</p>
            </div>
            <div>
              <p className="text-xs font-medium text-slate-100">Meetings Booked</p>
              <p className="text-lg font-bold text-indigo-400">89</p>
            </div>
            <div>
              <p className="text-xs font-medium text-slate-100">Opportunities Created</p>
              <p className="text-lg font-bold text-indigo-400">34</p>
            </div>
            <div>
              <p className="text-xs font-medium text-slate-100">Pipeline Value</p>
              <p className="text-lg font-bold text-indigo-400">$2.1M</p>
            </div>
            <div>
              <p className="text-xs font-medium text-slate-100">Unsubscribe Rate</p>
              <p className="text-lg font-bold text-red-400">0.8%</p>
            </div>
            <div>
              <p className="text-xs font-medium text-slate-100">Spam Complaints</p>
              <p className="text-lg font-bold text-red-400">0.2%</p>
            </div>
          </div>
        </div>

        {/* A/B Testing */}
        <div className="mt-4 pt-3 border-t border-slate-800">
          <p className="text-sm font-medium text-slate-100 mb-2">A/B Testing Results</p>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0">
                <div className="w-2 h-2 bg-green-500 rounded-full" />
              </div>
              <div className="flex-1 space-y-0.5">
                <p className="text-xs font-medium text-slate-100">Subject Line Test</p>
                <p className="text-xs text-slate-400">Variant B: +23% Open Rate</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0">
                <div className="w-2 h-2 bg-blue-500 rounded-full" />
              </div>
              <div className="flex-1 space-y-0.5">
                <p className="text-xs font-medium text-slate-100">CTA Button Test</p>
                <p className="text-xs text-slate-400">Variant A: +15% Click Rate</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0">
                <div className="w-2 h-2 bg-yellow-500 rounded-full" />
              </div>
              <div className="flex-1 space-y-0.5">
                <p className="text-xs font-medium text-slate-100">Send Time Test</p>
                <p className="text-xs text-slate-400">Variant B: +18% Reply Rate</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
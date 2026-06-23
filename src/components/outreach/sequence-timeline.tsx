export default function SequenceTimeline() {
  return (
    <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-800">
      <div className="space-y-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-slate-100">
            Sequence Timeline
          </h2>
          <button className="text-sm text-indigo-400 hover:text-indigo-300">
            <Edit className="h-3 w-3" /> Edit Sequence
          </div>
        </div>

        {/* Sequence Steps */}
        <div className="space-y-4">
          <p className="text-sm font-medium text-slate-100 mb-2">Outreach Sequence</p>
          <div className="space-y-4">
            {/* Step 1 */}
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <div className="w-3 h-3 bg-indigo-500 rounded-full flex items-center justify-center">
                  <span className="text-xs font-medium text-white">1</span>
                </div>
              </div>
              <div className="flex-1 space-y-1">
                <p className="text-xs font-medium text-slate-100">Initial Email</p>
                <p className="text-xs text-slate-400">Personalized introduction with value proposition</p>
                <div className="flex items-center gap-3 text-xs mt-1">
                  <span>
                    <Clock className="h-3 w-3" /> Day 1
                  </span>
                  <span>
                    <MessageCircle className="h-3 w-3" /> 45% Open Rate
                  </span>
                  <span>
                    <TrendingUp className="h-3 w-3" /> +12% vs Avg
                  </span>
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="h-px bg-slate-800/50 mx-4 my-2" />

            {/* Step 2 */}
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <div className="w-3 h-3 bg-indigo-500 rounded-full flex items-center justify-center">
                  <span className="text-xs font-medium text-white">2</span>
                </div>
              </div>
              <div className="flex-1 space-y-1">
                <p className="text-xs font-medium text-slate-100">LinkedIn Connection</p>
                <p className="text-xs text-slate-400">Connection request with personalized note</p>
                <div className="flex items-center gap-3 text-xs mt-1">
                  <span>
                    <Clock className="h-3 w-3" /> Day 2
                  </span>
                  <span>
                    <LinkedIn className="h-3 w-3" /> 35% Acceptance
                  </span>
                  <span>
                    <TrendingUp className="h-3 w-3" /> +8% vs Avg
                  </span>
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="h-px bg-slate-800/50 mx-4 my-2" />

            {/* Step 3 */}
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <div className="w-3 h-3 bg-indigo-500 rounded-full flex-items-center justify-center">
                  <span className="text-xs font-medium text-white">3</span>
                </div>
              </div>
              <div className="flex-1 space-y-1">
                <p className="text-xs font-medium text-slate-100">Follow-up Email</p>
                <p className="text-xs text-slate-400">Case study sharing + soft CTA</p>
                <div className="flex items-center gap-3 text-xs mt-1">
                  <span>
                    <Clock className="h-3 w-3" /> Day 4
                  </span>
                  <span>
                    <MessageCircle className="h-3 w-3" /> 38% Open Rate
                  </span>
                  <span>
                    <TrendingUp className="h-3 w-3" /> +5% vs Avg
                  </span>
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="h-px bg-slate-800/50 mx-4 my-2" />

            {/* Step 4 */}
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <div className="w-3 h-3 bg-indigo-500 rounded-full flex items-center justify-center">
                  <span className="text-xs font-medium text-white">4</span>
                </div>
              </div>
              <div className="flex-1 space-y-1">
                <p className="text-xs font-medium text-slate-100">Breakup Email</p>
                <p className="text-xs text-slate-400">Final attempt with limited-time offer</p>
                <div className="flex items-center gap-3 text-xs mt-1">
                  <span>
                    <Clock className="h-3 w-3" /> Day 7
                  </span>
                  <span>
                    <MessageCircle className="h-3 w-3" /> 25% Open Rate
                  </span>
                  <span>
                    <TrendingDown className="h-3 w-3" /> -15% vs Avg
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sequence Performance */}
        <div className="mt-4 pt-3 border-t border-slate-800">
          <p className="text-sm font-medium text-slate-100 mb-2">Sequence Performance</p>
          <div className="grid gap-3 grid-cols-2">
            <div>
              <p className="text-xs font-medium text-slate-100">Overall Response Rate</p>
              <p className="text-lg font-bold text-indigo-400">18%</p>
            </div>
            <div>
              <p className="text-xs font-medium text-slate-100">Meeting Booked Rate</p>
              <p className="text-lg font-bold text-indigo-400">8%</p>
            </div>
            <div>
              <p className="text-xs font-medium text-slate-100">Opt-out Rate</p>
              <p className="text-lg font-bold text-red-400">2%</p>
            </div>
            <div>
              <p className="text-xs font-medium text-slate-100">Avg. Response Time</p>
              <p className="text-lg font-bold text-indigo-400">1.2 days</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
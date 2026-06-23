export default function RelationshipScorecards() {
  return (
    <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-800">
      <div className="space-y-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-slate-100">
            Relationship Scorecards
          </h2>
          <button className="text-sm text-indigo-400 hover:text-indigo-300">
            <Users className="h-3 w-3" /> View All Accounts
          </div>
        </div>

        {/* Scorecard Grid */}
        <div className="grid gap-4">
          {/* Scorecard 1 */}
          <div className="bg-slate-900/30 border border-slate-800/50 rounded-xl p-4">
            <div className="flex items-start justify-between mb-3">
              <h3 className="text-sm font-medium text-slate-100">Enterprise Solutions</h3>
              <span className="text-xs font-medium">Strategic Account</span>
            </div>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0">
                  <div className="w-2 h-2 bg-indigo-500 rounded-full" />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-medium text-slate-100">Relationship Strength</p>
                  <div className="w-full bg-slate-800/50 h-2 rounded overflow-hidden">
                    <div className="bg-indigo-500 h-2 w-[80%] rounded" />
                  </div>
                  <span className="text-xs">80%</span>
                </div
              </div>
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0">
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-medium text-slate-100">Engagement Level</p>
                  <div className="w-full bg-slate-800/50 h-2 rounded overflow-hidden">
                    <div className="bg-green-500 h-2 w-[65%] rounded" />
                  </div>
                  <span className="text-xs">65%</span>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full" />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-medium text-slate-100">Health Score</p>
                  <div className="w-full bg-slate-800/50 h-2 rounded overflow-hidden">
                    <div className="bg-yellow-500 h-2 w-[70%] rounded" />
                  </div>
                  <span className="text-xs">70%</span>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0">
                  <div className="w-2 h-2 bg-blue-500 rounded-full" />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-medium text-slate-100">Growth Potential</p>
                  <div className="w-full bg-slate-800/50 h-2 rounded overflow-hidden">
                    <div className="bg-blue-500 h-2 w-[75%] rounded" />
                  </div
                  <span className="text-xs">75%</span>
                </div>
              </div>
            </div>
            <div className="mt-3 pt-2 border-t border-slate-800">
              <p className="text-xs font-medium text-slate-100">Next Renewal</p>
              <p className="text-xs text-indigo-400">Mar 15, 2027</p>
            </div>
          </div>

          {/* Scorecard 2 */}
          <div className="bg-slate-900/30 border border-slate-800/50 rounded-xl p-4">
            <div className="flex items-start justify-between mb-3">
              <h3 className="text-sm font-medium text-slate-100">TechCorp Solutions</h3>
              <span className="text-xs font-medium">Growth Account</span>
            </div>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0">
                  <div className="w-2 h-2 bg-indigo-500 rounded-full" />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-medium text-slate-100">Relationship Strength</p>
                  <div className="w-full bg-slate-800/50 h-2 rounded overflow-hidden">
                    <div className="bg-indigo-500 h-2 w-[60%] rounded" />
                  </div>
                  <span className="text-xs">60%</span>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0">
                  <div className="w-2 h-2 bg-red-500 rounded-full" />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-medium text-slate-100">Engagement Level</p>
                  <div className="w-full bg-slate-800/50 h-2 rounded overflow-hidden">
                    <div className="bg-red-500 h-2 w-[30%] rounded" />
                  </div>
                  <span className="text-xs">30%</span>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full" />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-medium text-slate-100">Health Score</p>
                  <div className="w-full bg-slate-800/50 h-2 rounded overflow-hidden">
                    <div className="bg-yellow-500 h-2 w-[40%] rounded" />
                  </div>
                  <span className="text-xs">40%</span>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0">
                  <div className="w-2 h-2 bg-blue-500 rounded-full" />
                </div
                <div className="flex-1">
                  <p className="text-xs font-medium text-slate-100">Growth Potential</p>
                  <div className="w-full bg-slate-800/50 h-2 rounded overflow-hidden">
                    <div className="bg-blue-500 h-2 w-[80%] rounded" />
                  </div>
                  <span className="text-xs">80%</span>
                </div>
              </div>
            </div>
            <div className="mt-3 pt-2 border-t border-slate-800">
              <p className="text-xs font-medium text-slate-100">Next Renewal</p>
              <p className="text-xs text-indigo-400">Sep 30, 2026</p>
            </div>
          </div>

          {/* Scorecard 3 */}
          <div className="bg-slate-900/30 border border-slate-800/50 rounded-xl p-4">
            <div className="flex items-start justify-between mb-3">
              <h3 className="text-sm font-medium text-slate-100">Global Industries</h3>
              <span className="text-xs font-medium">Enterprise Account</span>
            </div>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0">
                  <div className="w-2 h-2 bg-indigo-500 rounded-full" />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-medium text-slate-100">Relationship Strength</p
                  <div className="w-full bg-slate-800/50 h-2 rounded overflow-hidden">
                    <div className="bg-indigo-500 h-2 w-[50%] rounded" />
                  </div>
                  <span className="text-xs">50%</span>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full" />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-medium text-slate-100">Engagement Level</p>
                  <div className="w-full bg-slate-800/50 h-2 rounded overflow-hidden">
                    <div className="bg-yellow-500 h-2 w-[45%] rounded" />
                  </div>
                  <span className="text-xs">45%</span>
                </div>
              </div
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0">
                  <div className="w-2 h-2 bg-red-500 rounded-full" />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-medium text-slate-100">Health Score</p>
                  <div className="w-full bg-slate-800/50 h-2 rounded overflow-hidden">
                    <div className="bg-red-500 h-2 w-[25%] rounded" />
                  </div>
                  <span className="text-xs">25%</span>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0">
                  <div className="w-2 h-2 bg-blue-500 rounded-full" />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-medium text-slate-100">Growth Potential</p>
                  <div className="w-full bg-slate-800/50 h-2 rounded overflow-hidden">
                    <div className="bg-blue-500 h-2 w-[35%] rounded" />
                  </div>
                  <span className="text-xs">35%</span>
                </div>
              </div>
            </div>
            <div className="mt-3 pt-2 border-t border-slate-800">
              <p className="text-xs font-medium text-slate-100">Next Renewal</p>
              <p className="text-xs text-indigo-400">Dec 10, 2026</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
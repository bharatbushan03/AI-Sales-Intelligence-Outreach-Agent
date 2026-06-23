export default function CompetitorMap() {
  return (
    <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-800 h-[400px]">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-slate-100">
          Competitive Landscape
        </h2>
        <button className="text-sm text-indigo-400 hover:text-indigo-300">
          View Full Map
        </div>
      <div className="h-[300px] relative">
        {/* Competitor Map Visualization */}
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-900/20 to-slate-900/20 rounded-lg p-4">
          {/* Your Company Position */}
          <div className="absolute left-10 top-1/4 -translate-x-1/2 -translate-y-1/2">
            <div className="w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center">
              <div className="w-4 h-4 bg-white rounded-full flex items-center justify-center">
                <div className="w-2 h-2 bg-indigo-500 rounded-full" />
              </div>
            </div>
            <div className="w-28 bg-slate-900/50 rounded-lg p-2 text-xs text-center border border-slate-800">
              Your Company
            </div>
          </div>

          {/* Competitor 1 */}
          <div className="absolute right-10 top-1/3 -translate-x-1/2 -translate-y-1/2">
            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
              <div className="w-4 h-4 bg-white rounded-full flex items-center justify-center">
                <div className="w-2 h-2 bg-green-500 rounded-full" />
              </div>
            </div>
            <div className="w-28 bg-slate-900/50 rounded-lg p-2 text-xs text-center border border-slate-800">
              TechCorp Solutions
            </div>
          </div>

          {/* Competitor 2 */}
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

          {/* Competitor 3 */}
          <div className="absolute right-10 bottom-1/4 -translate-x-1/2 -translate-y-1/2">
            <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
              <div className="w-4 h-4 bg-white rounded-full flex items-center justify-center">
                <div className="w-2 h-2 bg-red-500 rounded-full" />
              </div>
            </div>
            <div className="w-28 bg-slate-900/50 rounded-lg p-2 text-xs text-center border border-slate-800">
              Global Enterprises Ltd
            </div>
          </div>

          {/* Connection Lines */}
          <svg className="absolute inset-0 pointer-events-none">
            <line x1="20" y1="100" x2="80" y2="80" stroke="indigo-500/30" strokeWidth="1" />
            <line x1="20" y1="180" x2="80" y2="200" stroke="green-500/30" strokeWidth="1" />
            <line x1="20" y1="260" x2="80" y2="320" stroke="yellow-500/30" strokeWidth="1" />
            <line x1="20" y1="340" x2="80" y2="380" stroke="red-500/30" strokeWidth="1" />
          </svg>
        </div>
      </div>

      {/* Legend */}
      <div className="mt-4 pt-3 border-t border-slate-800">
        <h3 className="text-sm font-medium text-slate-100 mb-2">Market Positioning</h3>
        <div className="flex flex-wrap gap-4 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-indigo-500 rounded-full" />
            <span>Leader (You)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full" />
            <span>Challenger</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-yellow-500 rounded-full" />
            <span>Visionary</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded-full" />
            <span>Niche Player</span>
          </div>
        </div>
      </div>
    </div>
  );
}
export default function AgentInteractions() {
  return (
    <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-800">
      <div className="space-y-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-slate-100">
            Agent Interactions
          </h2>
          <button className="text-sm text-indigo-400 hover:text-indigo-300">
            <RefreshCw className="h-3 w-3" /> Refresh Interactions
          </div>
        </div>

        {/* Interaction Controls */}
        <div className="mb-4">
          <div className="flex flex-wrap gap-2">
            <label className="flex items-center gap-1 text-xs">
              <input
                type="checkbox"
                className="h-3 w-3 text-indigo-600 focus:ring-indigo-500"
                checked
              />
              All Agents
            </label>
            <label className="flex items-center gap-1 text-xs">
              <input
                type="checkbox"
                className="h-3 w-3 text-indigo-600 focus:ring-indigo-500"
              />
              Manager Agent
            </label>
            <label className="flex items-center gap-1 text-xs">
              <input
                type="checkbox"
                className="h-3 w-3 text-indigo-600 focus:ring-indigo-500"
              />
              Research Agent
            </label>
            <label className="flex items-center gap-1 text-xs">
              <input
                type="checkbox"
                className="h-3 w-3 text-indigo-600 focus:ring-indigo-500"
              />
              Opportunity Agent
            </label>
            <label className="flex items-center gap-1 text-xs">
              <input
                type="checkbox"
                className="h-3 w-3 text-indigo-600 focus:ring-indigo-500"
              />
              Outreach Agent
            </label>
            <label className="flex items-center gap-1 text-xs">
              <input
                type="checkbox"
                className="h-3 w-3 text-indigo-600 focus:ring-indigo-500"
              />
              CRM Agent
            </label>
            <label className="flex items-center gap-1 text-xs">
              <input
                type="checkbox"
                className="h-3 w-3 text-indigo-600 focus:ring-indigo-500"
              />
              Proposal Agent
            </label>
          </div>
        </div>

        {/* Recent Interactions */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-slate-100 mb-3">
            Recent Agent Interactions
          </h2>
          <div className="space-y-3">
            {/* Interaction 1 */}
            <div className="flex items-start gap-3 border-t border-slate-800 pt-3 first:border-t-0">
              <div className="flex-shrink-0">
                <div className="w-2 h-2 bg-indigo-500 rounded-full" />
              </div>
              <div className="flex-1 space-y-0.5">
                <p className="text-xs font-medium text-slate-100">Research → Opportunity</p>
                <p className="text-xs text-slate-400">Shared market analysis for TechCorp Solutions</p>
                <p className="text-xs text-slate-500">2 hours ago</p>
              </div>
            </div>
            {/* Interaction 2 */}
            <div className="flex items-start gap-3 border-t border-slate-800 pt-3">
              <div className="flex-shrink-0">
                <div className="w-2 h-2 bg-green-500 rounded-full" />
              </div>
              <div className="flex-1 space-y-0.5">
                <p className="text-xs font-medium text-slate-100">Opportunity → Outreach</p>
                <p className="text-xs text-slate-400">Prioritized leads for email campaign</p>
                <p className="text-xs text-slate-500">4 hours ago</p>
              </div>
            </div>
            {/* Interaction 3 */}
            <div className="flex items-start gap-3 border-t border-slate-800 pt-3">
              <div className="flex-shrink-0">
                <div className="w-2 h-2 bg-yellow-500 rounded-full" />
              </div>
              <div className="flex-1 space-y-0.5">
                <p className="text-xs font-medium text-slate-100">Outreach → CRM</p>
                <p className="text-xs text-slate-400>Logged 12 new customer interactions</p>
                <p className="text-xs text-slate-500">6 hours ago</p>
              </div>
            </div>
            {/* Interaction 4 */}
            <div className="flex items-start gap-3 border-t border-slate-800 pt-3">
              <div className="flex-shrink-0">
                <div className="w-2 h-2 bg-blue-500 rounded-full" />
              </div>
              <div className="flex-1 space-y-0.5">
                <p className="text-xs font-medium text-slate-100">CRM → Proposal</p>
                <p className="text-xs text-slate-400>Updated opportunity status based on recent meetings</p>
                <p className="text-xs text-slate-500">8 hours ago</p>
              </div>
            </div>
            {/* Interaction 5 */}
            <div className="flex items-start gap-3 border-t border-slate-800 pt-3">
              <div className="flex-shrink-0">
                <div className="w-2 h-2 bg-purple-500 rounded-full" />
              </div>
              <div className="flex-1 space-y-0.5>
                <p className="text-xs font-medium text-slate-100">Manager → All Agents</p>
                <p className="text-xs text-slate-400>Coordinated quarterly planning session</p>
                <p className="text-xs text-slate-500>12 hours ago</p>
              </div>
            </div>
            {/* Interaction 6 */}
            <div className="flex items-start gap-3 border-t border-slate-800 pt-3>
              <div className="flex-shrink-0>
                <div className="w-2 h-2 bg-indigo-500 rounded-full" />
              </div>
              <div className="flex-1 space-y-0.5>
                <p className="text-xs font-medium text-slate-100>Research → Outreach</p>
                <p className="text-xs text-slate-400>Identified 3 new target companies for ABM campaign</p>
                <p className="text-xs text-slate-500>1 day ago</p>
              </div>
            </div>
          </div>
        </div>

        {/* Interaction Network */}
        <div className="mt-4 pt-3 border-t border-slate-800>
          <h2 className="text-lg font-semibold text-slate-100 mb-3>
            Interaction Network
          </h2>
          <div className="h-[300px] relative>
            <div className="absolute inset-0 bg-slate-900/30 rounded-lg p-4>
              {/* Agent Nodes */}
              <div className="absolute left-10 top-1/4 -translate-x-1/2 -translate-y-1/2>
                <div className="w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center>
                  <div className="w-4 h-4 bg-white rounded-full flex items-center justify-center>
                    <div className="w-2 h-2 bg-indigo-500 rounded-full" />
                  </div>
                </div>
              </div>
              <div className="w-28 bg-slate-900/50 rounded-lg p-2 text-xs text-center border border-slate-800>
                Manager Agent
              </div>
            </div>

            <div className="absolute right-10 top-1/3 -translate-x-1/2 -translate-y-1/2>
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center>
                <div className="w-4 h-4 bg-white rounded-full flex items-center justify-center>
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                </div>
              </div>
              <div className="w-28 bg-slate-900/50 rounded-lg p-2 text-xs text-center border border-slate-800>
                Research Agent
              </div>
            </div>

            <div className="absolute left-10 bottom-1/3 -translate-x-1/2 -translate-y-1/2>
              <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center>
                <div className="w-4 h-4 bg-white rounded-full flex items-center justify-center>
                  <div className="w-2 h-2 bg-yellow-500 rounded-full" />
                </div>
              </div>
              <div className="w-28 bg-slate-900/50 rounded-lg p-2 text-xs text-center border border-slate-800>
                Outreach Agent
              </div>
            </div>

            <div className="absolute right-10 bottom-1/4 -translate-x-1/2 -translate-y-1/2>
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center>
                <div className="w-4 h-4 bg-white rounded-full flex items-center justify-center>
                  <div className="w-2 h-2 bg-blue-500 rounded-full" />
                </div>
              </div>
              <div className="w-28 bg-slate-900/50 rounded-lg p-2 text-xs text-center border border-slate-800>
                CRM Agent
              </div>
            </div>

            <div className="absolute left-20 top-1/2 -translate-x-1/2 -translate-y-1/2>
              <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center>
                <div className="w-3 h-3 bg-white rounded-full flex items-center justify-center>
                  <div className="w-1 h-1 bg-purple-500 rounded-full" />
                </div>
              </div>
              <div className="w-24 bg-slate-900/50 rounded-lg p-1 text-xs text-center border border-slate-800
                Opportunity Agent
              </div>
            </div>

            <div className="absolute right-20 top-1/2 -translate-x-1/2 -translate-y-1/2>
              <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center>
                <div className="w-3 h-3 bg-white rounded-full flex items-center justify-center>
                  <div className="w-1 h-1 bg-purple-500 rounded-full" />
                </div>
              </div>
              <div className="w-24 bg-slate-900/50 rounded-lg p-1 text-xs text-center border border-slate-800
                Proposal Agent
              </div>
            </div>

            {/* Connection Lines */}
            <svg className="absolute inset-0 pointer-events-none>
              {/* Manager to all */}
              <line x1="20" y1="80" x2="180" y2="80" stroke="indigo-500/30" strokeWidth="2" />
              <line x1="20" y1="200" x2="180" y2="200" stroke="green-500/30" strokeWidth="2" />
              <line x1="20" y1="320" x2="180" y2="320" stroke="yellow-500/30" strokeWidth="2" />
              <line x1="20" y1="440" x2="180" y2="440" stroke="blue-500/30" strokeWidth="2" />

              {/* Agent to agent interactions */}
              <line x1="100" y1="140" x2="140" y2="200" stroke="purple-500/30" strokeWidth="1" strokeDashArray="4,2" />
              <line x1="100" y1="200" x2="60" y2="260" stroke="purple-500/30" strokeWidth="1" strokeDashArray="4,2" />
              <line x1="100" y1="260" x2="140" y2="320" stroke="purple-500/30" strokeWidth="1" strokeDashArray="4,2" />
              <line x1="100" y1="320" x2="60" y2="380" stroke="purple-500/30" strokeWidth="1" strokeDashArray="4,2" />
              <line x1="100" y1="380" x2="140" y2="440" stroke="purple-500/30" strokeWidth="1" strokeDashArray="4,2" />
            </svg>
          </div>
        </div>

        {/* Interaction Metrics */}
        <div className="mt-4 pt-3 border-t border-slate-800>
          <h2 className="text-lg font-semibold text-slate-100 mb-2>
            Interaction Metrics
          </h2>
          <div className="space-y-3>
            <div className="flex items-start gap-3>
              <div className="flex-shrink-0>
                <div className="w-2 h-2 bg-indigo-500 rounded-full" />
              </div>
              <div className="flex-1>
                <p className="text-xs font-medium text-slate-100>Total Interactions</p>
                <p className="text-lg font-bold text-slate-100>1.2M</p>
              </div>
            </div>
            <div className="flex items-start gap-3>
              <div className="flex-shrink-0>
                <div className="w-2 h-2 bg-green-500 rounded-full" />
              </div>
              <div className="flex-1>
                <p className="text-xs font-medium text-slate-100>Success Rate</p>
                <p className="text-lg font-bold text-indigo-400>94%</p>
              </div>
            </div>
            <div className="flex items-start gap-3>
              <div className="flex-shrink-0>
                <div className="w-2 h-2 bg-yellow-500 rounded-full" />
              </div>
              <div className="flex-1>
                <p className="text-xs font-medium text-slate-100>Avg. Response Time</p>
                <p className="text-lg font-bold text-indigo-400>2.3s</p>
              </div>
            </div>
            <div className="flex items-start gap-3>
              <div className="flex-shrink-0>
                <div className="w-2 h-2 bg-blue-500 rounded-full" />
              </div>
              <div className="flex-1>
                <p className="text-xs font-medium text-slate-100>Knowledge Shared</p>
                <p className="text-lg font-bold text-indigo-400>8.9M data points</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default function CompanyIntelligence() {
  return (
    <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-800">
      <div className="space-y-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-slate-100">
            Company Intelligence
          </h2>
          <button className="text-sm text-indigo-400 hover:text-indigo-300">
            <Search className="h-3 w-3" /> Search Companies
          </div>
        </div>

        {/* Company Search */}
        <div className="mb-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Enter company name to view intelligence..."
              className="w-full pl-10 pr-4 py-2 text-sm text-slate-900 bg-slate-50 border border-slate-200 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-slate-800 dark:text-slate-100 dark:border-slate-600"
            />
            <span className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400">
              <Search className="h-4 w-4" />
            </span>
          </div>
        </div>

        {/* Company Profile */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-slate-100 mb-3">
            TechCorp Solutions
          </h2>
          <div className="grid gap-4">
            {/* Basic Info */}
            <div className="bg-slate-900/30 border border-slate-800/50 rounded-xl p-4">
              <h3 className="text-sm font-medium text-slate-100 mb-2">Company Overview</h3>
              <div className="space-y-2">
                <p className="text-xs font-medium text-slate-100">Industry</p>
                <p className="text-xs text-slate-400">Enterprise Software</p>
              </div>
              <div className="space-y-2">
                <p className="text-xs font-medium text-slate-100">Founded</p>
                <p className="text-xs text-slate-400">2018</p>
              </div>
              <div className="space-y-2">
                <p className="text-xs font-medium text-slate-100">Headquarters</p>
                <p className="text-xs text-slate-400">San Francisco, CA</p>
              </div
              <div className="space-y-2">
                <p className="text-xs font-medium text-slate-100">Employees</p>
                <p className="text-xs text-slate-400">250-500</p>
              </div>
              <div className="space-y-2">
                <p className="text-xs font-medium text-slate-100">Revenue</p>
                <p className="text-xs text-slate-400">$85M ARR</p>
              </div>
              <div className="space-y-2">
                <p className="text-xs font-medium text-slate-100">Funding</p>
                <p className="text-xs text-slate-400">$50M Series C</p>
              </div>
            </div>

            {/* Technology Stack */}
            <div className="bg-slate-900/30 border border-slate-800/50 rounded-xl p-4">
              <h3 className="text-sm font-medium text-slate-100 mb-2">Technology Stack</h3>
              <div className="flex flex-wrap gap-2">
                <span className="bg-slate-800/50 px-2 py-0.5 rounded text-xs text-slate-300">AWS</span>
                <span className="bg-slate-800/50 px-2 py-0.5 rounded text-xs text-slate-300">Kubernetes</span>
                <span className="bg-slate-800/50 px-2 py-0.5 rounded text-xs text-slate-300">React</span>
                <span className="bg-slate-800/50 px-2 py-0.5 rounded text-xs text-slate-300">Node.js</span>
                <span className="bg-slate-800/50 px-2 py-0.5 rounded text-xs text-slate-300">PostgreSQL</span>
                <span className="bg-slate-800/50 px-2 py-0.5 rounded text-xs text-slate-300">Redis</span>
                <span className="bg-slate-800/50 px-2 py-0.5 rounded text-xs text-slate-300">Docker</span>
                <span className="bg-slate-800/50 px-2 py-0.5 rounded text-xs text-slate-300">Terraform</span>
                <span className="bg-slate-800/50 px-2 py-0.5 rounded text-xs text-slate-300">Salesforce</span>
                <span className="bg-slate-800/50 px-2 py-0.5 rounded text-xs text-slate-300">Snowflake</span>
              </div>
            </div>

            {/* Recent Activities */}
            <div className="bg-slate-900/30 border border-slate-800/50 rounded-xl p-4">
              <h3 className="text-sm font-medium text-slate-100 mb-2">Recent Activities</h3>
              <div className="space-y-2">
                <p className="text-xs font-medium text-slate-100">Last News</p>
                <p className="text-xs text-slate-400">Launched new AI-powered analytics platform</p>
                <p className="text-xs text-slate-500">June 10, 2026</p>
              </div>
              <div className="space-y-2">
                <p className="text-xs font-medium text-slate-100">Hiring Trends</p>
                <p className="text-xs text-slate-400">Increasing focus on AI/ML engineers</p>
                <p className="text-xs text-slate-500">25 open positions</p
              </div>
              <div className="space-y-2">
                <p className="text-xs font-medium text-slate-100">Technology Investments</p>
                <p className="text-xs text-slate-400">Increased spending on cloud infrastructure</p>
                <p className="text-xs text-slate-500">Q2 2026</p>
              </div>
              <div className="space-y-2">
                <p className="text-xs font-medium text-slate-100">Partnership Activity</p>
                <p className="text-xs text-slate-400">Exploring strategic alliances with cloud providers</p>
                <p className="text-xs text-slate-500">Ongoing discussions</p>
              </div>
            </div>

            {/* Relationships */}
            <div className="bg-slate-900/30 border border-slate-800/50 rounded-xl p-4">
              <h3 className="text-sm font-medium text-slate-100 mb-2">Key Relationships</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0">
                    <div className="w-2 h-2 bg-indigo-500 rounded-full" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-medium text-slate-100">Global Enterprises Ltd</p>
                    <p className="text-xs text-slate-400">Strategic Partnership</p>
                    <p className="text-xs text-indigo-400">Strength: 85/100</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0">
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-medium text-slate-100">Innovatech Dynamics</p>
                    <p className="text-xs text-slate-400">Technology Alliance</p>
                    <p className="text-xs text-indigo-400">Strength: 70/100</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-medium text-slate-100">StartupXYZ Inc</p>
                    <p className="text-xs text-slate-400">Competitor Analysis</p>
                    <p className="text-xs text-indigo-400">Strength: 45/100</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0>
                    <div className="w-2 h-2 bg-blue-500 rounded-full" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-medium text-slate-100">DataFlow Systems</p>
                    <p className="text-xs text-slate-400">Customer Relationship</p>
                    <p className="text-xs text-indigo-400">Strength: 60/100</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
import { TrendingUp, TrendingDown, Check, X, Clock, Users, DollarSign, PieChart } from 'lucide-react';

interface Opportunity {
  id: number;
  company: string;
  value: number;
  stage: string;
  probability: number;
  expectedClose: string;
  owner: string;
  trend: 'up' | 'down' | 'neutral';
  lastActivity: string;
}

const opportunities: Opportunity[] = [
  {
    id: 1,
    company: "TechCorp Solutions",
    value: 750000,
    stage: "Proposal",
    probability: 65,
    expectedClose: "2026-07-15",
    owner: "John Doe",
    trend: "up",
    lastActivity: "2 hours ago"
  },
  {
    id: 2,
    company: "StartupXYZ Inc",
    value: 250000,
    stage: "Negotiation",
    probability: 80,
    expectedClose: "2026-06-30",
    owner: "Sarah Chen",
    trend: "up",
    lastActivity: "1 day ago"
  },
  {
    id: 3,
    company: "Global Enterprises Ltd",
    value: 2000000,
    stage: "Qualification",
    probability: 30,
    expectedClose: "2026-08-20",
    owner: "Mike Rodriguez",
    trend: "down",
    lastActivity: "3 days ago"
  },
  {
    id: 4,
    company: "Innovatech Dynamics",
    value: 450000,
    stage: "Proposal",
    probability: 60,
    expectedClose: "2026-07-10",
    owner: "Lisa Wang",
    trend: "neutral",
    lastActivity: "5 hours ago"
  },
  {
    id: 5,
    company: "DataFlow Systems",
    value: 120000,
    stage: "Qualification",
    probability: 25,
    expectedClose: "2026-07-05",
    owner: "John Doe",
    trend: "up",
    lastActivity: "1 week ago"
  }
];

export default function OpportunityTable() {
  return (
    <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-800">
      <div className="space-y-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-slate-100">
            Opportunity Pipeline
          </h2>
          <div className="flex items-center gap-2">
            <button className="text-sm text-indigo-400 hover:text-indigo-300">
              <Users className="h-3 w-3" /> Team View
            </button>
            <button className="text-sm text-indigo-400 hover:text-indigo-300">
              <PieChart className="h-3 w-3" /> Forecast
            </button>
          </div>
        </div>

        {/* Table Header */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="border-b border-slate-700">
                <th className="px-4 py-3 text-xs font-medium text-slate-400 uppercase tracking-wider">
                  Company
                </th>
                <th className="px-4 py-3 text-xs font-medium text-slate-400 uppercase tracking-wider">
                  Value
                </th>
                <th className="px-4 py-3 text-xs font-medium text-slate-400 uppercase tracking-wider">
                  Stage
                </th>
                <th className="px-4 py-3 text-xs font-medium text-slate-400 uppercase tracking-wider">
                  Probability
                </th>
                <th className="px-4 py-3 text-xs font-medium text-slate-400 uppercase tracking-wider">
                  Expected Close
                </th>
                <th className="px-4 py-3 text-xs font-medium text-slate-400 uppercase tracking-wider">
                  Owner
                </th>
                <th className="px-4 py-3 text-xs font-medium text-slate-400 uppercase tracking-wider">
                  Trend
                </th>
                <th className="px-4 py-3 text-xs font-medium text-slate-400 uppercase tracking-wider">
                  Last Activity
                </th>
                <th className="px-4 py-3 text-xs font-medium text-slate-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {opportunities.map((opp) => (
                <tr key={opp.id} className="hover:bg-slate-900/50 transition-colors">
                  <td className="px-4 py-4 text-slate-100">
                    <div className="flex items-center gap-3">
                      <div className="flex-shrink-0 h-8 w-8 flex items-center justify-center bg-slate-800/50 rounded">
                        <Users className="h-4 w-4 text-slate-400" />
                      </div>
                      <div>
                        <p className="font-medium">{opp.company}</p>
                        <p className="text-xs text-slate-400">{opp.stage}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-slate-100">
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-indigo-400" />
                      <span className="font-medium">${(opp.value / 1000).toFixed(0)}K</span>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-slate-100">
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                      opp.stage === 'Prospecting' ? 'bg-indigo-900/20 text-indigo-400' :
                      opp.stage === 'Qualification' ? 'bg-yellow-900/20 text-yellow-400' :
                      opp.stage === 'Proposal' ? 'bg-green-900/20 text-green-400' :
                      opp.stage === 'Negotiation' ? 'bg-blue-900/20 text-blue-400' :
                      opp.stage === 'Closed Won' ? 'bg-emerald-900/20 text-emerald-400' :
                      'bg-red-900/20 text-red-400'
                    }`}>
                      {opp.stage}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-slate-100">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-indigo-500 rounded-full" />
                      <div className="w-full bg-slate-800/50 h-1.5 rounded overflow-hidden">
                        <div className={`bg-indigo-500 h-1.5 w-[${opp.probability}%] rounded`} />
                      </div>
                      <span className="text-xs">{opp.probability}%</span>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-slate-100">{opp.expectedClose}</td>
                  <td className="px-4 py-4 text-slate-100">{opp.owner}</td>
                  <td className="px-4 py-4 text-slate-100">
                    <span className={`flex items-center gap-1 ${
                      opp.trend === 'up' ? 'text-emerald-400' :
                      opp.trend === 'down' ? 'text-red-400' :
                      'text-slate-400'
                    }`}>
                      {opp.trend === 'up' && <TrendingUp className="h-3 w-3" />}
                      {opp.trend === 'down' && <TrendingDown className="h-3 w-3" />}
                      {opp.trend === 'neutral' && <Clock className="h-3 w-3" />}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-slate-100">{opp.lastActivity}</td>
                  <td className="px-4 py-4 text-slate-100">
                    <div className="flex items-center gap-2">
                      <button className="text-xs text-indigo-400 hover:text-indigo-300 p-1">
                        <Check className="h-3 w-3" /> Close Won
                      </button>
                      <button className="text-xs text-red-400 hover:text-red-300 p-1">
                        <X className="h-3 w-3" /> Close Lost
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Summary Stats */}
        <div className="mt-4 pt-3 border-t border-slate-800">
          <div className="grid gap-4 grid-cols-2 text-sm text-slate-400">
            <div>
              <p className="font-medium">Total Pipeline Value</p>
              <p className="text-lg font-bold text-slate-100">$3.8M</p>
            </div>
            <div>
              <p className="font-medium">Weighted Pipeline</p>
              <p className="text-lg font-bold text-slate-100">$1.2M</p>
            </div>
            <div>
              <p className="font-medium">Win Rate</p>
              <p className="text-lg font-bold text-slate-100">65%</p>
            </div>
            <div>
              <p className="font-medium">Avg. Deal Size</p>
              <p className="text-lg font-bold text-slate-100">$250K</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
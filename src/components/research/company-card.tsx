import { Brain, TrendingUp, Shield, Database, Clock, Users } from 'lucide-react';

interface CompanyCardProps {
  name: string;
  industry: string;
  confidence: string;
  opportunityScore: string;
  insights: string[];
  techStack: string[];
  funding: string;
  employees: string;
}

export function CompanyCard({
  name,
  industry,
  confidence,
  opportunityScore,
  insights,
  techStack,
  funding,
  employees,
}: CompanyCardProps) {
  // Parse confidence percentage for color
  const confidenceNum = parseInt(confidence);
  const confidenceColor = confidenceNum >= 90 ? 'bg-indigo-500/20 text-indigo-400' :
    confidenceNum >= 80 ? 'bg-green-500/20 text-green-400' :
    confidenceNum >= 70 ? 'bg-yellow-500/20 text-yellow-400' :
    'bg-red-500/20 text-red-400';

  return (
    <div className="bg-slate-900/50 rounded-xl p-6 border border-slate-800 hover:bg-slate-900/70 transition-colors">
      <div className="space-y-5">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-medium text-slate-100">{name}</h3>
            <p className="text-sm text-slate-400">{industry}</p>
          </div>
          <div className="flex items-center gap-2">
            <span className={`px-3 py-1 rounded text-xs font-medium ${confidenceColor}`}>
              {confidence} Confidence
            </span>
          </div>
        </div>

        {/* Opportunity Score */}
        <div className="flex items-center gap-3">
          <TrendingUp className="h-4 w-4 text-indigo-400" />
          <div className="flex-1">
            <p className="text-xs text-slate-400">Opportunity Score</p>
            <p className="text-lg font-bold text-slate-100">{opportunityScore}</p>
          </div>
        </div>

        {/* Insights */}
        <div className="space-y-2">
          <p className="text-sm font-medium text-slate-100 mb-1">Key Insights</p>
          <div className="space-y-1">
            {insights.map((insight, index) => (
              <div key={index} className="flex items-start gap-2 text-slate-400 text-sm">
                <Brain className="h-3 w-3 flex-shrink-0" />
                <p>{insight}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Tech Stack */}
        <div className="space-y-2">
          <p className="text-sm font-medium text-slate-100 mb-1">Technology Stack</p>
          <div className="flex flex-wrap gap-1">
            {techStack.map((tech, index) => (
              <span key={index} className="bg-slate-800/50 px-2 py-0.5 rounded text-xs text-slate-300">
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* Company Info */}
        <div className="grid gap-3 grid-cols-2 text-slate-400 text-sm">
          <div>
            <p className="font-medium">Funding</p>
            <p>{funding}</p>
          </div>
          <div>
            <p className="font-medium">Employees</p>
            <p>{employees}</p>
          </div>
          <div>
            <p className="font-medium">Last Updated</p>
            <p>2 hours ago</p>
          </div>
          <div>
            <p className="font-medium">Data Sources</p>
            <p>3 verified</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-4 pt-3 border-t border-slate-800">
          <div className="flex flex-wrap gap-2">
            <button
              className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-indigo-600/20 text-indigo-300 text-xs font-medium rounded hover:bg-indigo-600/30 transition-colors"
            >
              <Shield className="h-3 w-3" /> Export Report
            </button>
            <button
              className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-slate-800/20 text-slate-300 text-xs font-medium rounded hover:bg-slate-800/30 transition-colors"
            >
              <Users className="h-3 w-3" /> Share
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
import { Users, Folder, FileText, Clock, Search, MessageCircle, Plus, TrendingUp } from 'lucide-react';

interface Workspace {
  id: number;
  name: string;
  description: string;
  members: number;
  files: number;
  lastActivity: string;
  status: 'active' | 'archived';
  type: 'project' | 'team' | 'client';
}

const workspaces: Workspace[] = [
  {
    id: 1,
    name: "TechCorp Solutions Engagement",
    description: "Complete engagement workspace for TechCorp Solutions AI implementation project",
    members: 8,
    files: 42,
    lastActivity: "Just now",
    status: 'active',
    type: 'client'
  },
  {
    id: 2,
    name: "Q3 Marketing Campaign Planning",
    description: "Collaborative space for planning and executing Q3 marketing initiatives",
    members: 6,
    files: 28,
    lastActivity: "2 hours ago",
    status: 'active',
    type: 'team'
  },
  {
    id: 3,
    name: "Customer Success Initiatives",
    description: "Workspace for tracking and improving customer satisfaction and retention",
    members: 5,
    files: 18,
    lastActivity: "4 hours ago",
    status: 'active',
    type: 'team'
  },
  {
    id: 4,
    name: "Product Development Roadmap",
    description: "Strategic planning for product enhancements and new feature development",
    members: 7,
    files: 35,
    lastActivity: "6 hours ago",
    status: 'active',
    type: 'project'
  },
  {
    id: 5,
    name: "FinTech Sector Research",
    description: "Research and analysis workspace for FinTech market opportunities",
    members: 4,
    files: 22,
    lastActivity: "1 day ago",
    status: 'active',
    type: 'research'
  },
  {
    id: 6,
    name: "Archived: Q2 Sales Performance",
    description: "Historical workspace for Q2 sales analysis and performance review",
    members: 0,
    files: 0,
    lastActivity: "3 months ago",
    status: 'archived',
    type: 'team'
  }
];

export default function SharedWorkspaces() {
  return (
    <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-800>
      <div className="space-y-4>
        <div className="flex items-center justify-between mb-4>
          <h2 className="text-lg font-semibold text-slate-100>
            Shared Workspaces
          </h2>
          <div className="flex items-center gap-2>
            <button className="text-sm text-indigo-400 hover:text-indigo-300>
              <Search className="h-3 w-3" /> Search Workspaces
            </div>
            <button className="text-sm text-indigo-400 hover:text-indigo-300>
              <Plus className="h-3 w-3" /> New Workspace
            </div>
          </div>
        </div>

        {/* Workspace Filters */}
        <div className="mb-4>
          <div className="flex flex-wrap gap-2>
            <label className="flex items-center gap-1 text-xs>
              <input
                type="checkbox"
                className="h-3 w-3 text-indigo-600 focus:ring-indigo-500"
                checked
              />
              All Workspaces
            </label
            <label className="flex items-center gap-1 text-xs>
              <input
                type="checkbox"
                className="h-3 w-3 text-indigo-600 focus:ring-indigo-500"
              />
              Active Only
            </label>
            <label className="flex items-center gap-1 text-xs>
              <input
                type="checkbox"
                className="h-3 w-3 text-indigo-600 focus:ring-indigo-500"
              />
              Project Workspaces
            </label>
            <label className="flex items-center gap-1 text-xs>
              <input
                type="checkbox"
                className="h-3 w-3 text-indigo-600 focus:ring-indigo-500"
              />
              Team Workspaces
            </label>
            <label className="flex items-center gap-1 text-xs>
              <input
                type="checkbox"
                className="h-3 w-3 text-indigo-600 focus:ring-indigo-500"
              />
              Client Workspaces
            </label>
          </div>
        </div>

        {/* Workspaces List */}
        <div className="space-y-4>
          {workspaces.map((workspace) => (
            <div key={workspace.id} className="border-t border-slate-800 pt-4 first:border-t-0>
              <div className="flex items-start gap-3>
                <div className="flex-shrink-0>
                  <div className="w-10 h-10 flex items-center justify-center bg-slate-800/50 rounded-full>
                    {workspace.type === 'project' && <Folder className="h-5 w-5 text-indigo-400" />}
                    {workspace.type === 'team' && <Users className="h-5 w-5 text-indigo-400" />}
                    {workspace.type === 'client' && <FileText className="h-5 w-5 text-indigo-400" />}
                    {workspace.type === 'research' && <TrendingUp className="h-5 w-5 text-indigo-400" />}
                  </div>
                </div>
                <div className="flex-1 space-y-1>
                  <div className="flex items-start justify-between mb-1>
                    <h3 className="text-sm font-medium text-slate-100>{workspace.name}</h3>
                    <span className={`text-xs px-2 py-0.5 rounded ${
                      workspace.status === 'active'
                        ? 'bg-indigo-900/20 text-indigo-400'
                        : 'bg-slate-500/20 text-slate-400'
                    }`}>
                      {workspace.status.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400>{workspace.description}</p>
                  <div className="mt-2 flex items-start gap-3 text-xs>
                    <span>
                      <Users className="h-3 w-3" /> {workspace.members} members
                    </span>
                    <span>
                      <FileText className="h-3 w-3" /> {workspace.files} files
                    </span>
                    <span>
                      <Clock className="h-3 w-3" /> {workspace.lastActivity}
                    </span>
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Workspace Stats */}
        <div className="mt-4 pt-3 border-t border-slate-800>
          <p className="text-sm font-medium text-slate-100 mb-2>Workspace Statistics</p>
          <div className="grid gap-4 grid-cols-2>
            <div>
              <p className="text-xs font-medium text-slate-100>Total Workspaces</p>
              <p className="text-lg font-bold text-slate-100>6</p>
            </div>
            <div>
              <p className="text-xs font-medium text-slate-100>Active Workspaces</p>
              <p className="text-lg font-bold text-indigo-400>5</p>
            </div>
            <div>
              <p className="text-xs font-medium text-slate-100>Total Members</p>
              <p className="text-lg font-bold text-slate-100>31</p>
            </div>
            <div>
              <p className="text-xs font-medium text-slate-100>Total Files</p>
              <p className="text-lg font-bold text-slate-100>145</p>
            </div>
            <div>
              <p className="text-xs font-medium text-slate-100>Avg. Files per Workspace</p>
              <p className="text-lg font-bold text-slate-100>24</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
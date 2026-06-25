import {
  Users,
  Folder,
  FileText,
  Clock,
  Search,
  MessageCircle,
  Plus,
  TrendingUp,
} from 'lucide-react';

interface Workspace {
  id: number;
  name: string;
  description: string;
  members: number;
  files: number;
  lastActivity: string;
  status: 'active' | 'archived';
  type: 'project' | 'team' | 'client' | 'research';
}

const workspaces: Workspace[] = [
  {
    id: 1,
    name: 'TechCorp Solutions Engagement',
    description: 'Complete engagement workspace for TechCorp Solutions AI implementation project',
    members: 8,
    files: 42,
    lastActivity: 'Just now',
    status: 'active',
    type: 'client',
  },
  {
    id: 2,
    name: 'Q3 Marketing Campaign Planning',
    description: 'Collaborative space for planning and executing Q3 marketing initiatives',
    members: 6,
    files: 28,
    lastActivity: '2 hours ago',
    status: 'active',
    type: 'team',
  },
  {
    id: 3,
    name: 'Customer Success Initiatives',
    description: 'Workspace for tracking and improving customer satisfaction and retention',
    members: 5,
    files: 18,
    lastActivity: '4 hours ago',
    status: 'active',
    type: 'team',
  },
  {
    id: 4,
    name: 'Product Development Roadmap',
    description: 'Strategic planning for product enhancements and new feature development',
    members: 7,
    files: 35,
    lastActivity: '6 hours ago',
    status: 'active',
    type: 'project',
  },
  {
    id: 5,
    name: 'FinTech Sector Research',
    description: 'Research and analysis workspace for FinTech market opportunities',
    members: 4,
    files: 22,
    lastActivity: '1 day ago',
    status: 'active',
    type: 'research',
  },
  {
    id: 6,
    name: 'Archived: Q2 Sales Performance',
    description: 'Historical workspace for Q2 sales analysis and performance review',
    members: 0,
    files: 0,
    lastActivity: '3 months ago',
    status: 'archived',
    type: 'team',
  },
];

export default function SharedWorkspaces() {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-4">
      <div className="space-y-4">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-100">Shared Workspaces</h2>
          <div className="flex items-center gap-2">
            <button type="button" className="text-sm text-indigo-400 hover:text-indigo-300">
              <Search className="inline h-3 w-3" /> Search
            </button>
            <button type="button" className="text-sm text-indigo-400 hover:text-indigo-300">
              <Plus className="inline h-3 w-3" /> New Workspace
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {workspaces.map((workspace) => (
            <div key={workspace.id} className="border-t border-slate-800 pt-4 first:border-t-0">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-800/50">
                  {workspace.type === 'project' && <Folder className="h-5 w-5 text-indigo-400" />}
                  {workspace.type === 'team' && <Users className="h-5 w-5 text-indigo-400" />}
                  {workspace.type === 'client' && <FileText className="h-5 w-5 text-indigo-400" />}
                  {workspace.type === 'research' && (
                    <TrendingUp className="h-5 w-5 text-indigo-400" />
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-medium text-slate-100">{workspace.name}</h3>
                  <p className="text-xs text-slate-400">{workspace.description}</p>
                  <div className="mt-2 flex gap-3 text-xs text-slate-400">
                    <span>
                      <Users className="inline h-3 w-3" /> {workspace.members}
                    </span>
                    <span>
                      <FileText className="inline h-3 w-3" /> {workspace.files}
                    </span>
                    <span>
                      <Clock className="inline h-3 w-3" /> {workspace.lastActivity}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

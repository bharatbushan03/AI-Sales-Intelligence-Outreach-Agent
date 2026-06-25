import {
  Users,
  Clock,
  MessageCircle,
  Mail,
  FileText,
  CheckCircle,
  X,
  Star,
  TrendingUp,
  TrendingDown,
  Filter,
} from 'lucide-react';

interface ActivityItem {
  id: number;
  type: string;
  author: string;
  authorAvatar: string;
  timestamp: string;
  description: string;
  metadata?: {
    value?: string;
    status?: string;
    project?: string;
  };
}

const activityFeed: ActivityItem[] = [
  {
    id: 1,
    type: 'project-update',
    author: 'Sarah Chen',
    authorAvatar: 'https://via.placeholder.com/32',
    timestamp: 'Just now',
    description: 'Updated the TechCorp Solutions market analysis with latest competitive data',
    metadata: {
      project: 'TechCorp Market Analysis',
      status: 'In Progress',
    },
  },
  {
    id: 2,
    type: 'comment',
    author: 'John Doe',
    authorAvatar: 'https://via.placeholder.com/32',
    timestamp: '2 minutes ago',
    description: 'Commented on the outreach campaign performance report',
    metadata: {
      value: '+12% engagement rate',
    },
  },
  {
    id: 3,
    type: 'file-share',
    author: 'Mike Rodriguez',
    authorAvatar: 'https://via.placeholder.com/32',
    timestamp: '5 minutes ago',
    description: 'Shared the Q3 sales forecasting model with the team',
    metadata: {
      project: 'Q3 Sales Forecast',
    },
  },
  {
    id: 4,
    type: 'meeting',
    author: 'Lisa Wang',
    authorAvatar: 'https://via.placeholder.com/32',
    timestamp: '10 minutes ago',
    description: 'Started a meeting with the enterprise sales team',
    metadata: {
      project: 'Enterprise Sales Strategy',
    },
  },
  {
    id: 5,
    type: 'task-complete',
    author: 'David Kim',
    authorAvatar: 'https://via.placeholder.com/32',
    timestamp: '15 minutes ago',
    description: 'Completed the lead scoring algorithm update',
    metadata: {
      status: 'Done',
      value: '15% accuracy improvement',
    },
  },
  {
    id: 6,
    type: 'achievement',
    author: 'Team',
    authorAvatar: 'https://via.placeholder.com/32',
    timestamp: '20 minutes ago',
    description: 'Hit monthly outreach target - 150+ personalized messages sent',
    metadata: {
      value: '152 messages',
      status: 'Target Achieved',
    },
  },
  {
    id: 7,
    type: 'alert',
    author: 'System',
    authorAvatar: 'https://via.placeholder.com/32',
    timestamp: '25 minutes ago',
    description: 'High-priority opportunity requires attention: Global Enterprises Ltd',
    metadata: {
      value: '$750K opportunity',
      status: 'Needs Review',
    },
  },
  {
    id: 8,
    type: 'approval',
    author: 'Sarah Chen',
    authorAvatar: 'https://via.placeholder.com/32',
    timestamp: '30 minutes ago',
    description: 'Approved the budget increase for AI infrastructure',
    metadata: {
      value: '+$50K investment',
      status: 'Approved',
    },
  },
];

export default function ActivityFeed() {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-4">
      <div className="space-y-4">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-100">Activity Feed</h2>
          <div className="flex items-center gap-2">
            <button type="button" className="text-sm text-indigo-400 hover:text-indigo-300">
              <Filter className="inline h-3 w-3" /> Filter Activity
            </button>
            <button type="button" className="text-sm text-indigo-400 hover:text-indigo-300">
              <Users className="inline h-3 w-3" /> View All Activity
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {activityFeed.map((activity) => (
            <div key={activity.id} className="border-t border-slate-800 pt-3 first:border-t-0">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-800/50">
                    <img
                      src={activity.authorAvatar}
                      alt={activity.author}
                      className="h-full w-full rounded-full object-cover"
                    />
                  </div>
                </div>
                <div className="flex-1 space-y-0.5">
                  <p className="text-xs font-medium text-slate-100">{activity.author}</p>
                  <p className="text-xs text-slate-400">{activity.description}</p>
                  {activity.metadata && (
                    <div className="mt-1 flex items-start gap-3 text-xs text-slate-400">
                      {activity.metadata.project && <span>{activity.metadata.project}</span>}
                      {activity.metadata.status && <span>{activity.metadata.status}</span>}
                      {activity.metadata.value && <span>{activity.metadata.value}</span>}
                    </div>
                  )}
                  <p className="text-xs text-slate-500">{activity.timestamp}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

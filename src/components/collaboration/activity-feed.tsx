import { Users, Clock, MessageCircle, Mail, FileText, CheckCircle, X, Star, TrendingUp, TrendingDown } from 'lucide-react';

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
    type: "project-update",
    author: "Sarah Chen",
    authorAvatar: "https://via.placeholder.com/32",
    timestamp: "Just now",
    description": "Updated the TechCorp Solutions market analysis with latest competitive data",
    metadata: {
      project: "TechCorp Market Analysis",
      status: "In Progress"
    }
  },
  {
    id: 2,
    type: "comment",
    author: "John Doe",
    authorAvatar: "https://via.placeholder.com/32",
    timestamp: "2 minutes ago",
    description": "Commented on the outreach campaign performance report",
    metadata: {
      value: "+12% engagement rate"
    }
  },
  {
    id: 3,
    type: "file-share",
    author: "Mike Rodriguez",
    authorAvatar: "https://via.placeholder.com/32",
    timestamp: "5 minutes ago",
    description": "Shared the Q3 sales forecasting model with the team",
    metadata: {
      project: "Q3 Sales Forecast"
    }
  },
  {
    id: 4,
    type: "meeting",
    author: "Lisa Wang",
    authorAvatar: "https://via.placeholder.com/32",
    timestamp: "10 minutes ago",
    description": "Started a meeting with the enterprise sales team",
    metadata: {
      project: "Enterprise Sales Strategy"
    }
  },
  {
    id: 5,
    type: "task-complete",
    author: "David Kim",
    authorAvatar: "https://via.placeholder.com/32",
    timestamp: "15 minutes ago",
    description": "Completed the lead scoring algorithm update",
    metadata: {
      status: "Done",
      value: "15% accuracy improvement"
    }
  },
  {
    id: 6,
    type: "achievement",
    author: "Team",
    authorAvatar: "https://via.placeholder.com/32",
    timestamp: "20 minutes ago",
    description": "Hit monthly outreach target - 150+ personalized messages sent",
    metadata: {
      value: "152 messages",
      status: "Target Achieved"
    }
  },
  {
    id: 7,
    type: "alert",
    author: "System",
    authorAvatar: "https://via.placeholder.com/32",
    timestamp: "25 minutes ago",
    description": "High-priority opportunity requires attention: Global Enterprises Ltd",
    metadata: {
      value: "$750K opportunity",
      status: "Needs Review"
    }
  },
  {
    id: 8,
    type: "approval",
    author: "Sarah Chen",
    authorAvatar: "https://via.placeholder.com/32",
    timestamp: "30 minutes ago",
    description": "Approved the budget increase for AI infrastructure",
    metadata: {
      value: "+$50K investment",
      status: "Approved"
    }
  }
];

export default function ActivityFeed() {
  return (
    <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-800>
      <div className="space-y-4>
        <div className="flex items-center justify-between mb-4>
          <h2 className="text-lg font-semibold text-slate-100>
            Activity Feed
          </h2>
          <div className="flex items-center gap-2>
            <button className="text-sm text-indigo-400 hover:text-indigo-300>
              <Filter className="h-3 w-3" /> Filter Activity
            </div>
            <button className="text-sm text-indigo-400 hover:text-indigo-300>
              <Users className="h-3 w-3" /> View All Activity
            </div>
          </div>
        </div>

        {/* Activity Filters */}
        <div className="mb-4>
          <div className="flex flex-wrap gap-2>
            <label className="flex items-center gap-1 text-xs>
              <input
                type="checkbox"
                className="h-3 w-3 text-indigo-600 focus:ring-indigo-500"
                checked
              />
              All Activities
            </label>
            <label className="flex items-center gap-1 text-xs>
              <input
                type="checkbox"
                className="h-3 w-3 text-indigo-600 focus:ring-indigo-500"
              />
              Projects
            </label>
            <label className="flex items-center gap-1 text-xs>
              <input
                type="checkbox"
                className="h-3 w-3 text-indigo-600 focus:ring-indigo-500"
              />
              Comments
            </label>
            <label className="flex items-center gap-1 text-xs>
              <input
                type="checkbox"
                className="h-3 w-3 text-indigo-600 focus:ring-indigo-500"
              />
              Files
            </label>
            <label className="flex items-center gap-1 text-xs>
              <input
                type="checkbox"
                className="h-3 w-3 text-indigo-600 focus:ring-indigo-500"
              />
              Meetings
            </label>
            <label className="flex items-center gap-1 text-xs>
              <input
                type="checkbox"
                className="h-3 w-3 text-indigo-600 focus:ring-indigo-500"
              />
              Tasks
            </label>
            <label className="flex items-center gap-1 text-xs>
              <input
                type="checkbox"
                className="h-3 w-3 text-indigo-600 focus:ring-indigo-500"
              />
              Achievements
            </label>
          </div>
        </div>

        {/* Activity List */}
        <div className="space-y-4>
          {activityFeed.map((activity) => (
            <div key={activity.id} className="border-t border-slate-800 pt-3 first:border-t-0>
              <div className="flex items-start gap-3>
                <div className="flex-shrink-0>
                  <div className={`w-2 h-2 rounded-full ${
                    activity.type === 'achievement' ? 'bg-green-500/20 text-green-400' :
                    activity.type === 'alert' ? 'bg-red-500/20 text-red-400' :
                    activity.type === 'approval' ? 'bg-indigo-500/20 text-indigo-400' :
                    activity.type === 'comment' ? 'bg-blue-500/20 text-blue-400' :
                    activity.type === 'file-share' ? 'bg-yellow-500/20 text-yellow-400' :
                    activity.type === 'meeting' ? 'bg-purple-500/20 text-purple-400' :
                    activity.type === 'project-update' ? 'bg-indigo-500/20 text-indigo-400' :
                    activity.type === 'task-complete' ? 'bg-green-500/20 text-green-400' :
                    'bg-slate-500/20 text-slate-400'
                  }`}>
                    {activity.type === 'achievement' && <Star className="h-3 w-3" />}
                    {activity.type === 'alert' && <X className="h-3 w-3" />}
                    {activity.type === 'approval' && <CheckCircle className="h-3 w-3" />}
                    {activity.type === 'comment' && <MessageCircle className="h-3 w-3" />}
                    {activity.type === 'file-share' && <FileText className="h-3 w-3" />}
                    {activity.type === 'meeting' && <Users className="h-3 w-3" />}
                    {activity.type === 'project-update' && <TrendingUp className="h-3 w-3" />}
                    {activity.type === 'task-complete' && <CheckCircle className="h-3 w-3" />}
                  </div>
                </div>
                <div className="flex-1 space-y-0.5>
                  <p className="text-xs font-medium text-slate-100>{activity.author}</p>
                  <p className="text-xs text-slate-400>{activity.description}</p>
                  {activity.metadata && (
                    <div className="mt-1 flex items-start gap-3 text-xs>
                      {activity.metadata.value && (
                        <span>
                          {activity.metadata.project && (
                            <span className="font-medium">{activity.metadata.project}: </span>
                          )}
                          {activity.metadata.value}
                        </span>
                      )}
                      {activity.metadata.status && (
                        <span className={`ml-2 ${
                          activity.metadata.status === 'In Progress' ? 'text-yellow-400' :
                          activity.metadata.status === 'Done' ? 'text-green-400' :
                          activity.metadata.status === 'Needs Review' ? 'text-red-400' :
                          activity.metadata.status === 'Target Achieved' ? 'text-green-400' :
                          activity.metadata.status === 'Approved' ? 'text-indigo-400' :
                          'text-slate-400'
                        }`}>
                          [{activity.metadata.status}]
                        </span>
                      )}
                    </div>
                  )}
                  <p className="text-xs text-slate-500>{activity.timestamp}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Activity Summary */}
        <div className="mt-4 pt-3 border-t border-slate-800>
          <p className="text-sm font-medium text-slate-100 mb-2>Activity Summary (Last 24 Hours)</p>
          <div className="grid gap-4 grid-cols-2>
            <div>
              <p className="text-xs font-medium text-slate-100>Total Activities</p>
              <p className="text-lg font-bold text-slate-100>45</p>
            </div>
            <div>
              <p className="text-xs font-medium text-slate-100>Projects Updated</p>
              <p className="text-lg font-bold text-indigo-400>12</p>
            </div>
            <div>
              <p className="text-xs font-medium text-slate-100>Comments Posted</p>
              <p className="text-lg font-bold text-indigo-400>28</p>
            </div>
            <div>
              <p className="text-xs font-medium text-slate-100>Files Shared</p>
              <p className="text-lg font-bold text-indigo-400>15</p>
            </div>
            <div>
              <p className="text-xs font-medium text-slate-100>Meetings Held</p>
              <p className="text-lg font-bold text-indigo-400>8</p>
            </div>
            <div>
              <p className="text-xs font-medium text-slate-100>Tasks Completed</p
              <p className="text-lg font-bold text-indigo-400>22</p>
            </div>
            <div>
              <p className="text-xs font-medium text-slate-100>Achievements Unlocked</p>
              <p className="text-lg font-bold text-indigo-400>5</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default function ActivityStream() {
  const activities = [
    {
      id: 1,
      type: "meeting",
      title": "Technical Deep-dive Session",
      description": "45-minute session covering API integration and customization options",
      timestamp": "2026-06-21 14:30",
      participants": ["John Doe", "Robert Taylor", "Mike Rodriguez"],
      outcome": "Next steps: Prepare detailed technical architecture document"
    },
    {
      id: 2,
      type: "email",
      title": "Follow-up Proposal Sent",
      description": "Detailed proposal with pricing tiers and implementation timeline",
      timestamp": "2026-06-21 09:15",
      participants": ["John Doe"],
      outcome": "Awaiting review - follow scheduled for 6/23"
    },
    {
      id: 3,
      type: "call",
      title": "Discovery Call",
      description": "Initial discussion about current infrastructure and pain points",
      timestamp": "2026-06-20 16:00",
      participants": ["Sarah Chen", "Lisa Wang"],
      outcome": "Identified 3 key areas for improvement: scalability, security, reporting"
    },
    {
      id: 4,
      type: "content-share",
      title": "Case Study Shared",
      description": "ROI case study for similar enterprise implementation",
      timestamp": "2026-06-19 11:45",
      participants": ["Lisa Wang"],
      outcome": "Positive feedback - requested additional technical details"
    },
    {
      id: 5,
      type: "meeting",
      title": "Executive Briefing",
      description": "Presentation to CTO and VP of Engineering on solution benefits",
      timestamp": "2026-06-18 10:00",
      participants": ["John Doe", "Sarah Chen"],
      outcome": "Strong interest - scheduled technical deep-dive for 6/21"
    },
    {
      id: 6,
      type: "task",
      title": "Prepare Technical Architecture",
      description": "Create detailed architecture diagram and integration plan",
      timestamp": "2026-06-22 09:00",
      participants": ["Mike Rodriguez"],
      outcome": "In progress - estimated completion: 6/23"
    }
  ];

  const getActivityIcon = (type) => {
    switch (type) {
      case "meeting": return <Video className="h-3 w-3" />;
      case "email": return <Mail className="h-3 w-3" />;
      case "call": return <Phone className="h-3 w-3" />;
      case "content-share": return <FileText className="h-3 w-3" />;
      case "task": return <CheckCircle className="h-3 w-3" />;
      default: return <Circle className="h-3 w-3" />;
    }
  };

  const getActivityColor = (type) => {
    switch (type) {
      case "meeting": return "bg-indigo-500/20 text-indigo-400";
      case "email": return "bg-green-500/20 text-green-400";
      case "call": return "bg-blue-500/20 text-blue-400";
      case "content-share": return "bg-yellow-500/20 text-yellow-400";
      case "task": return "bg-purple-500/20 text-purple-400";
      default: return "bg-slate-500/20 text-slate-400";
    }
  };

  return (
    <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-800">
      <div className="space-y-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-slate-100">
            Activity Stream
          </h2>
          <div className="flex items-center gap-2">
            <button className="text-sm text-indigo-400 hover:text-indigo-300">
              <Filter className="h-3 w-3" /> Filter Activities
            </div>
            <button className="text-sm text-indigo-400 hover:text-indigo-300">
              <Plus className="h-3 w-3" /> Log Activity
            </div>
          </div>
        </div>

        {/* Activity Filters */}
        <div className="mb-4">
          <div className="flex flex-wrap gap-2">
            <label className="flex items-center gap-1 text-xs">
              <input
                type="checkbox"
                className="h-3 w-3 text-indigo-600 focus:ring-indigo-500"
              />
              All Activities
            </label>
            <label className="flex items-center gap-1 text-xs">
              <input
                type="checkbox"
                className="h-3 w-3 text-indigo-600 focus:ring-indigo-500"
                checked
              />
              Meetings
            </label>
            <label className="flex items-center gap-1 text-xs">
              <input
                type="checkbox"
                className="h-3 w-3 text-indigo-600 focus:ring-indigo-500"
              />
              Emails
            </label>
            <label className="flex items-center gap-1 text-xs">
              <input
                type="checkbox"
                className="h-3 w-3 text-indigo-600 focus:ring-indigo-500"
              />
              Calls
            </label>
            <label className="flex items-center gap-1 text-xs">
              <input
                type="checkbox"
                className="h-3 w-3 text-indigo-600 focus:ring-indigo-500"
              />
              Tasks
            </label>
          </div>
        </div>

        {/* Activity List */}
        <div className="space-y-3">
          {activities.map((activity) => (
            <div key={activity.id} className="border-t border-slate-800 pt-3 first:border-t-0">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0">
                  <div className={`w-2 h-2 rounded-full ${getActivityColor(activity.type)}`}>
                    {getActivityIcon(activity.type)}
                  </div>
                </div>
                <div className="flex-1 space-y-0.5">
                  <p className="text-xs font-medium text-slate-100">{activity.title}</p>
                  <p className="text-xs text-slate-400">{activity.description}</p>
                  <div className="flex items-center gap-3 text-xs mt-1">
                    <span>
                      <Clock className="h-3 w-3" /> {activity.timestamp}
                    </span>
                    <span>
                      <Users className="h-3 w-3" /> {activity.participants.length} participants
                    </span>
                  </div>
                  {activity.outcome && (
                    <div className="mt-1">
                      <p className="text-xs font-medium text-slate-100">Outcome</p>
                      <p className="text-xs text-indigo-400">{activity.outcome}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Activity Summary */}
        <div className="mt-4 pt-3 border-t border-slate-800">
          <p className="text-sm font-medium text-slate-100 mb-2">Activity Summary (Last 7 Days)</p>
          <div className="grid gap-3 grid-cols-2">
            <div>
              <p className="text-xs font-medium text-slate-100">Total Activities</p>
              <p className="text-lg font-bold text-slate-100">24</p>
            </div>
            <div>
              <p className="text-xs font-medium text-slate-100">Meetings Held</p>
              <p className="text-lg font-bold text-indigo-400">8</p>
            </div>
            <div>
              <p className="text-xs font-medium text-slate-100">Emails Sent</p>
              <p className="text-lg font-bold text-indigo-400">45</p>
            </div>
            <div>
              <p className="text-xs font-medium text-slate-100">Calls Made</p>
              <p className="text-lg font-bold text-indigo-400">12</p>
            </div>
            <div>
              <p className="text-xs font-medium text-slate-100">Tasks Completed</p>
              <p className="text-lg font-bold text-indigo-400">18</p>
            </div>
            <div>
              <p className="text-xs font-medium text-slate-100">Response Rate</p>
              <p className="text-lg font-bold text-indigo-400">78%</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
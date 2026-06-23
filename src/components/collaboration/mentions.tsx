import { Bell, Users, MessageCircle, Clock, Search } from 'lucide-react';

interface Mention {
  id: number;
  type: 'mention' | 'reply' | 'reaction';
  author: string;
  authorAvatar: string;
  timestamp: string;
  content: string;
  link: string;
  unread: boolean;
}

const mentions: Mention[] = [
  {
    id: 1,
    type: 'mention',
    author: "Sarah Chen",
    authorAvatar: "https://via.placeholder.com/32",
    timestamp: "15 minutes ago",
    content: "@John Doe Can you review the latest market analysis when you have a moment?",
    link: "/research/techcorp-analysis",
    unread: true
  },
  {
    id: 2,
    type: 'reply',
    author: "Mike Rodriguez",
    authorAvatar: "https://via.placeholder.com/32",
    timestamp: "30 minutes ago",
    content: "Re: @Sarah Chen's comment on opportunity scoring",
    link: "/crm/opportunities#comment-45",
    unread: true
  },
  {
    id: 3,
    type: 'reaction',
    author: "Lisa Wang",
    authorAvatar: "https://via.placeholder.com/32",
    timestamp: "1 hour ago",
    content: "Lisa Wang reacted with ❤️ to your comment on the outreach strategy",
    link: "/outreach/campaigns#comment-12",
    unread: false
  },
  {
    id: 4,
    type: 'mention',
    author: "David Kim",
    authorAvatar: "https://via.placeholder.com/32",
    timestamp: "2 hours ago",
    content: "@Team Please join the strategy meeting at 2 PM today",
    link: "/calendar/meeting-123",
    unread: false
  },
  {
    id: 5,
    type: 'mention',
    author: "John Doe",
    authorAvatar: "https://via.placeholder.com/32",
    timestamp: "4 hours ago",
    content: "@Sarah Chen @Mike Rodriguez Let's discuss the Q3 roadmap tomorrow",
    link: "/strategy/q3-planning",
    unread: true
  }
];

export default function Mentions() {
  return (
    <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-800>
      <div className="space-y-4>
        <div className="flex items-center justify-between mb-4>
          <h2 className="text-lg font-semibold text-slate-100>
            Mentions & Notifications
          </h2>
          <div className="flex items-center gap-2>
            <button className="text-sm text-indigo-400 hover:text-indigo-300>
              <Bell className="h-3 w-3" /> Mark All as Read
            </div>
            <button className="text-sm text-indigo-400 hover:text-indigo-300>
              <Search className="h-3 w-3" /> Filter Mentions
            </div>
          </div>
        </div>

        {/* Mentions List */}
        <div className="space-y-4>
          {mentions.map((mention) => (
            <div key={mention.id} className={`border-t border-slate-800 pt-4 first:border-t-0 ${mention.unread ? 'bg-slate-900/30' : ''}`}>
              <div className="flex items-start gap-3>
                <div className="flex-shrink-0>
                  <div className="w-8 h-8 flex items-center justify-center bg-slate-800/50 rounded-full>
                    <img src={mention.authorAvatar} alt={mention.author} className="w-full h-full rounded-full object-cover" />
                  </div>
                </div>
                <div className="flex-1 space-y-1>
                  <div className="flex items-start justify-between mb-1>
                    <h3 className="text-sm font-medium text-slate-100>{mention.author}</h3>
                    <p className="text-xs text-slate-400>{mention.timestamp}</p>
                  </div>
                  <p className="text-slate-400>{mention.content}</p>
                  <div className="mt-2 flex items-start gap-3 text-xs>
                    <span className="flex items-center gap-1>
                      <MessageCircle className="h-3 w-3" /> View Conversation
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Notification Settings */}
        <div className="mt-4 pt-3 border-t border-slate-800>
          <p className="text-sm font-medium text-slate-100 mb-2>Notification Settings</p>
          <div className="space-y-3>
            <div className="flex items-start gap-3>
              <div className="flex-shrink-0>
                <div className="w-2 h-2 bg-indigo-500 rounded-full" />
              </div>
              <div className="flex-1>
                <p className="text-xs font-medium text-slate-100>Email Notifications</p>
                <div className="flex items-start gap-2>
                  <input
                    type="checkbox"
                    className="h-3 w-3 text-indigo-600 focus:ring-indigo-500"
                    checked
                  />
                  <span className="text-xs">Enabled</span>
                </div>
              </div>
            </div>
            <div className="flex items-start gap-3>
              <div className="flex-shrink-0>
                <div className="w-2 h-2 bg-green-500 rounded-full" />
              </div>
              <div className="flex-1>
                <p className="text-xs font-medium text-slate-100>In-app Notifications</p>
                <div className="flex items-start gap-2>
                  <input
                    type="checkbox"
                    className="h-3 w-3 text-indigo-600 focus:ring-indigo-500"
                    checked
                  />
                  <span className="text-xs">Enabled</span>
                </div>
              </div>
            </div>
            <div className="flex items-start gap-3>
              <div className="flex-shrink-0>
                <div className="w-2 h-2 bg-yellow-500 rounded-full" />
              </div>
              <div className="flex-1>
                <p className="text-xs font-medium text-slate-100>Mention Notifications</p>
                <div className="flex items-start gap-2>
                  <input
                    type="checkbox"
                    className="h-3 w-3 text-indigo-600 focus:ring-indigo-500"
                    checked
                  />
                  <span className="text-xs">Enabled</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
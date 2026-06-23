import { MessageCircle, Users, Clock, Edit, Trash2, ThumbsUp, ThumbsDown, Reply } from 'lucide-react';

interface Comment {
  id: number;
  author: string;
  authorAvatar: string;
  timestamp: string;
  content: string;
  likes: number;
  replies: number;
  repliesArray?: ReplyComment[];
}

interface ReplyComment {
  id: number;
  author: string;
  content: string;
  timestamp: string;
}

const comments: Comment[] = [
  {
    id: 1,
    author: "Sarah Chen",
    authorAvatar: "https://via.placeholder.com/32",
    timestamp: "2 hours ago",
    content: "I've reviewed the latest market analysis and I think we should focus on the enterprise segment for Q3. The data shows a 40% higher conversion rate in enterprise vs SMB.",
    likes: 12,
    replies: 3,
    repliesArray: [
      {
        id: 1,
        author: "John Doe",
        content: "Good point! Let's adjust our outreach strategy accordingly.",
        timestamp: "1 hour ago"
      },
      {
        id: 2,
        author: "Mike Rodriguez",
        content: "I'll update the lead scoring model to reflect this insight.",
        timestamp: "45 minutes ago"
      }
    ]
  },
  {
    id: 2,
    author: "Mike Rodriguez",
    authorAvatar: "https://via.placeholder.com/32",
    timestamp: "4 hours ago",
    content: "Just finished updating the opportunity scoring algorithm. Initial tests show a 15% improvement in prediction accuracy.",
    likes: 8,
    replies: 1,
    repliesArray: [
      {
        id: 3,
        author: "Lisa Wang",
        content: "Great work! This should help us prioritize our efforts better.",
        timestamp: "2 hours ago"
      }
    ]
  },
  {
    id: 3,
    author: "John Doe",
    authorAvatar: "https://via.placeholder.com/32",
    timestamp: "6 hours ago",
    content: "The Q2 results are in and we've exceeded our targets by 22%. Excellent work everyone!",
    likes: 25,
    replies: 2,
    repliesArray: [
      {
        id: 4,
        author: "Sarah Chen",
        content: "This is fantastic! Let's celebrate this win in our next team meeting.",
        timestamp: "5 hours ago"
      },
      {
        id: 5,
        author: "David Kim",
        content: "Congratulations to the entire team!",
        timestamp: "3 hours ago"
      }
    ]
  }
];

export default function Comments() {
  return (
    <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-800">
      <div className="space-y-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-slate-100">
            Comments & Discussion
          </h2>
          <button className="text-sm text-indigo-400 hover:text-indigo-300">
            <MessageCircle className="h-3 w-3" /> Add Comment
          </div>
        </div>

        {/* Comments List */}
        <div className="space-y-4">
          {comments.map((comment) => (
            <div key={comment.id} className="border-t border-slate-800 pt-4 first:border-t-0">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 flex items-center justify-center bg-slate-800/50 rounded-full">
                    <img src={comment.authorAvatar} alt={comment.author} className="w-full h-full rounded-full object-cover" />
                  </div>
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-start justify-between mb-1">
                    <h3 className="text-sm font-medium text-slate-100">{comment.author}</h3>
                    <p className="text-xs text-slate-400">{comment.timestamp}</p>
                  </div>
                  <p className="text-slate-400">{comment.content}</p>
                  <div className="mt-2 flex items-start gap-4 text-xs">
                    <div className="flex items-center gap-2">
                      <ThumbsUp className="h-3 w-3" /> {comment.likes} Likes
                    </div>
                    <div className="flex items-center gap-2">
                      <Reply className="h-3 w-3" /> {comment.replies} Replies
                    </div>
                    <div className="flex items-center gap-2">
                      <Edit className="h-3 w-3" /> Edit
                    </div>
                    <div className="flex items-center gap-2">
                      <Trash2 className="h-3 w-3" /> Delete
                    </div>
                  </div>
                </div>
              </div>
              {/* Replies */}
              {comment.repliesArray && comment.repliesArray.length > 0 && (
                <div className="ml-10 border-l-2 border-slate-800/50 pl-3 mt-3">
                  {comment.repliesArray.map((reply) => (
                    <div key={reply.id} className="mb-2">
                      <div className="flex items-start gap-2">
                        <div className="flex-shrink-0">
                          <div className="w-2 h-2 bg-indigo-500/20 text-indigo-400 rounded-full flex items-center justify-center">
                            <span className="text-xs">{reply.author.charAt(0).toUpperCase()}</span>
                          </div>
                        </div>
                        <div className="flex-1">
                          <p className="text-xs font-medium text-slate-100">{reply.author}</p>
                          <p className="text-xs text-slate-400">{reply.content}</p>
                          <p className="text-xs text-slate-500">{reply.timestamp}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Add Comment Form */}
        <div className="mt-4 pt-3 border-t border-slate-800>
          <p className="text-sm font-medium text-slate-100 mb-2>Add a Comment</p>
          <div className="space-y-3>
            <div className="relative>
              <textarea
                placeholder="Write your comment..."
                className="w-full min-h-[80px] pl-3 py-2 text-sm text-slate-900 bg-slate-50 border border-slate-200 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-slate-800 dark:text-slate-100 dark:border-slate-600"
              />
              <div className="absolute bottom-2 right-2 flex items-center gap-2 text-xs>
                <span>0/500</span>
                <button className="text-indigo-400 hover:text-indigo-300>
                  Post
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
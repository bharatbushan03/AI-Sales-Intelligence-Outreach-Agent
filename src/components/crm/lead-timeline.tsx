export default function LeadTimeline() {
  return (
    <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-800">
      <div className="space-y-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-slate-100">
            Lead Timeline
          </h2>
          <button className="text-sm text-indigo-400 hover:text-indigo-300">
            <Clock className="h-3 w-3" /> View All Activities
          </div>
        </div>

        {/* Selected Lead Info */}
        <div className="mb-4">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 flex items-center justify-center bg-indigo-900/30 rounded-full">
                <Users className="h-5 w-5 text-indigo-400" />
              </div>
            </div>
            <div className="flex-1 space-y-1">
              <h3 className="text-lg font-medium text-slate-100">Robert Taylor</h3>
              <p className="text-sm text-slate-400">Enterprise Solutions • CTO</p>
              <div className="mt-2 flex items-center gap-3 text-sm">
                <span>
                  <DollarSign className="h-3 w-3" /> $400K Opportunity
                </span>
                <span>
                  <TrendingUp className="h-3 w-3" /> 70% Probability
                </span>
                <span>
                  <Clock className="h-3 w-3" /> Expected Close: Jul 15, 2026
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Timeline Activities */}
        <div className="space-y-4">
          <p className="text-sm font-medium text-slate-100 mb-2">Recent Activities</p>
          <div className="space-y-3">
            {/* Activity 1 */}
            <div className="flex items-start gap-3 border-t border-slate-800 pt-3 first:border-t-0">
              <div className="flex-shrink-0">
                <div className="w-2 h-2 bg-indigo-500 rounded-full" />
              </div>
              <div className="flex-1 space-y-0.5">
                <p className="text-xs font-medium text-slate-100">Email Sent</p>
                <p className="text-xs text-slate-400">Follow-up proposal with pricing details</p>
                <p className="text-xs text-slate-500">2 hours ago • John Doe</p>
              </div>
            </div>
            {/* Activity 2 */}
            <div className="flex items-start gap-3 border-t border-slate-800 pt-3">
              <div className="flex-shrink-0">
                <div className="w-2 h-2 bg-green-500 rounded-full" />
              </div>
              <div className="flex-1 space-y-0.5">
                <p className="text-xs font-medium text-slate-100">Meeting Held</p>
                <p className="text-xs text-slate-400">Technical deep-dive session (45 min)</p>
                <p className="text-xs text-slate-500">1 day ago • John Doe</p>
              </div>
            </div>
            {/* Activity 3 */}
            <div className="flex items-start gap-3 border-t border-slate-800 pt-3">
              <div className="flex-shrink-0">
                <div className="w-2 h-2 bg-blue-500 rounded-full" />
              </div>
              <div className="flex-1 space-y-0.5">
                <p className="text-xs font-medium text-slate-100">LinkedIn Interaction</p>
                <p className="text-xs text-slate-400">Commented on company post about AI trends</p>
                <p className="text-xs text-slate-500">2 days ago • Sarah Chen</p>
              </div>
            </div>
            {/* Activity 4 */}
            <div className="flex items-start gap-3 border-t border-slate-800 pt-3">
              <div className="flex-shrink-0">
                <div className="w-2 h-2 bg-yellow-500 rounded-full" />
              </div>
              <div className="flex-1 space-y-0.5">
                <p className="text-xs font-medium text-slate-100">Phone Call</p>
                <p className="text-xs text-slate-400">Left voicemail - followed up with email</p>
                <p className="text-xs text-slate-500">3 days ago • Mike Rodriguez</p>
              </div>
            </div>
            {/* Activity 5 */}
            <div className="flex items-start gap-3 border-t border-slate-800 pt-3">
              <div className="flex-shrink-0">
                <div className="w-2 h-2 bg-indigo-500 rounded-full" />
              </div>
              <div className="flex-1 space-y-0.5">
                <p className="text-xs font-medium text-slate-100">Content Shared</p>
                <p className="text-xs text-slate-400">Sent case study: ROI for enterprise clients</p>
                <p className="text-xs text-slate-500">5 days ago • Lisa Wang</p>
              </div>
            </div>
          </div>
        </div>

        {/* Next Steps */}
        <div className="mt-4 pt-3 border-t border-slate-800">
          <p className="text-sm font-medium text-slate-100 mb-2">Recommended Next Steps</p>
          <div className="space-y-2">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0">
                <div className="w-2 h-2 bg-indigo-500 rounded-full" />
              </div>
              <div className="flex-1 space-y-0.5">
                <p className="text-xs font-medium text-slate-100">Technical Workshop</p>
                <p className="text-xs text-slate-400">Schedule hands-on session with engineering team</p>
              </div
            </div>
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0">
                <div className="w-2 h-2 bg-green-500 rounded-full" />
              </div>
              <div className="flex-1 space-y-0.5">
                <p className="text-xs font-medium text-slate-100">ROI Analysis</p>
                <p className="text-xs text-slate-400">Prepare customized ROI calculation for their use case</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0">
                <div className="w-2 h-2 bg-yellow-500 rounded-full" />
              </div>
              <div className="flex-1 space-y-0.5">
                <p className="text-xs font-medium text-slate-100">Reference Call</p>
                <p className="text-xs text-slate-400">Arrange call with existing enterprise customer</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
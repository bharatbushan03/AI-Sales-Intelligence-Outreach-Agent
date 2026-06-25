import { Mail, MessageCircle, Clock, Users, Target, Edit, TrendingUp } from 'lucide-react';

export default function CampaignBuilder() {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-4">
      <div className="space-y-4">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-100">Campaign Builder</h2>
          <button className="text-sm text-indigo-400 hover:text-indigo-300">
            <Mail className="h-3 w-3" /> New Campaign
          </button>
        </div>

        {/* Campaign Form */}
        <form className="space-y-4">
          {/* Campaign Name */}
          <div className="space-y-2">
            <label className="mb-1 block text-xs font-medium text-slate-100">Campaign Name</label>
            <input
              type="text"
              placeholder="Enter campaign name..."
              className="w-full rounded-md border border-slate-200 bg-slate-50 py-2 pl-3 text-sm text-slate-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
            />
          </div>

          {/* Target Audience */}
          <div className="space-y-2">
            <label className="mb-1 block text-xs font-medium text-slate-100">Target Audience</label>
            <div className="flex flex-wrap gap-2">
              <label className="flex items-center gap-1 text-xs">
                <input type="checkbox" className="h-3 w-3 text-indigo-600 focus:ring-indigo-500" />
                Enterprise Tech
              </label>
              <label className="flex items-center gap-1 text-xs">
                <input type="checkbox" className="h-3 w-3 text-indigo-600 focus:ring-indigo-500" />
                FinTech Startups
              </label>
              <label className="flex items-center gap-1 text-xs">
                <input type="checkbox" className="h-3 w-3 text-indigo-600 focus:ring-indigo-500" />
                Healthcare Providers
              </label>
              <label className="flex items-center gap-1 text-xs">
                <input type="checkbox" className="h-3 w-3 text-indigo-600 focus:ring-indigo-500" />
                Retail & E-commerce
              </label>
            </div>
          </div>

          {/* Channel Selection */}
          <div className="space-y-2">
            <label className="mb-1 block text-xs font-medium text-slate-100">
              Outreach Channels
            </label>
            <div className="flex space-x-4">
              <label className="flex items-center gap-2 text-xs">
                <input type="checkbox" className="h-3 w-3 text-indigo-600 focus:ring-indigo-500" />
                Email
              </label>
              <label className="flex items-center gap-2 text-xs">
                <input type="checkbox" className="h-3 w-3 text-indigo-600 focus:ring-indigo-500" />
                LinkedIn
              </label>
              <label className="flex items-center gap-2 text-xs">
                <input type="checkbox" className="h-3 w-3 text-indigo-600 focus:ring-indigo-500" />
                Phone
              </label>
              <label className="flex items-center gap-2 text-xs">
                <input type="checkbox" className="h-3 w-3 text-indigo-600 focus:ring-indigo-500" />
                Video
              </label>
            </div>
          </div>

          {/* Schedule */}
          <div className="space-y-2">
            <label className="mb-1 block text-xs font-medium text-slate-100">Schedule</label>
            <div className="flex space-x-2">
              <label className="flex items-center gap-1 text-xs">
                <input
                  type="radio"
                  name="schedule"
                  value="immediate"
                  className="h-3 w-3 text-indigo-600 focus:ring-indigo-500"
                />
                Send Immediately
              </label>
              <label className="flex items-center gap-1 text-xs">
                <input
                  type="radio"
                  name="schedule"
                  value="scheduled"
                  className="h-3 w-3 text-indigo-600 focus:ring-indigo-500"
                />
                Schedule for Later
              </label>
              <label className="flex items-center gap-1 text-xs">
                <input
                  type="radio"
                  name="schedule"
                  value="recurring"
                  className="h-3 w-3 text-indigo-600 focus:ring-indigo-500"
                />
                Recurring Campaign
              </label>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-4 border-t border-slate-800 pt-3">
            <div className="flex flex-wrap gap-2">
              <button
                type="submit"
                className="flex flex-1 items-center justify-center gap-2 rounded bg-indigo-600 px-3 py-2 text-xs font-medium text-white transition-colors hover:bg-indigo-700"
              >
                <Target className="h-3 w-3" /> Launch Campaign
              </button>
              <button
                type="button"
                className="flex flex-1 items-center justify-center gap-2 rounded bg-slate-800/20 px-3 py-2 text-xs font-medium text-slate-300 transition-colors hover:bg-slate-800/30"
              >
                <Edit className="h-3 w-3" /> Save as Draft
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

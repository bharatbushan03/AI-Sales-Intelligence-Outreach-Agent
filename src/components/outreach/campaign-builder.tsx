import { Mail, MessageCircle, LinkedIn, Clock, Users, Target, Edit, TrendingUp } from 'lucide-react';

export default function CampaignBuilder() {
  return (
    <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-800">
      <div className="space-y-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-slate-100">
            Campaign Builder
          </h2>
          <button className="text-sm text-indigo-400 hover:text-indigo-300">
            <Mail className="h-3 w-3" /> New Campaign
          </div>
        </div>

        {/* Campaign Form */}
        <form className="space-y-4">
          {/* Campaign Name */}
          <div className="space-y-2">
            <label className="block text-xs font-medium text-slate-100 mb-1">
              Campaign Name
            </label>
            <input
              type="text"
              placeholder="Enter campaign name..."
              className="w-full pl-3 py-2 text-sm text-slate-900 bg-slate-50 border border-slate-200 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-slate-800 dark:text-slate-100 dark:border-slate-600"
            />
          </div>

          {/* Target Audience */}
          <div className="space-y-2">
            <label className="block text-xs font-medium text-slate-100 mb-1">
              Target Audience
            </label>
            <div className="flex flex-wrap gap-2">
              <label className="flex items-center gap-1 text-xs">
                <input
                  type="checkbox"
                  className="h-3 w-3 text-indigo-600 focus:ring-indigo-500"
                />
                Enterprise Tech
              </label>
              <label className="flex items-center gap-1 text-xs">
                <input
                  type="checkbox"
                  className="h-3 w-3 text-indigo-600 focus:ring-indigo-500"
                />
                FinTech Startups
              </label>
              <label className="flex items-center gap-1 text-xs">
                <input
                  type="checkbox"
                  className="h-3 w-3 text-indigo-600 focus:ring-indigo-500"
                />
                Healthcare Providers
              </label>
              <label className="flex items-center gap-1 text-xs">
                <input
                  type="checkbox"
                  className="h-3 w-3 text-indigo-600 focus:ring-indigo-500"
                />
                Retail & E-commerce
              </label>
            </div>
          </div>

          {/* Channel Selection */}
          <div className="space-y-2">
            <label className="block text-xs font-medium text-slate-100 mb-1">
              Outreach Channels
            </label>
            <div className="flex space-x-4">
              <label className="flex items-center gap-2 text-xs">
                <input
                  type="checkbox"
                  className="h-3 w-3 text-indigo-600 focus:ring-indigo-500"
                />
                Email
              </label>
              <label className="flex items-center gap-2 text-xs">
                <input
                  type="checkbox"
                  className="h-3 w-3 text-indigo-600 focus:ring-indigo-500"
                />
                LinkedIn
              </label>
              <label className="flex items-center gap-2 text-xs">
                <input
                  type="checkbox"
                  className="h-3 w-3 text-indigo-600 focus:ring-indigo-500"
                />
                Phone
              </label>
              <label className="flex items-center gap-2 text-xs">
                <input
                  type="checkbox"
                  className="h-3 w-3 text-indigo-600 focus:ring-indigo-500"
                />
                Video
              </label>
            </div>
          </div>

          {/* Schedule */}
          <div className="space-y-2">
            <label className="block text-xs font-medium text-slate-100 mb-1">
              Schedule
            </label>
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
          <div className="mt-4 pt-3 border-t border-slate-800">
            <div className="flex flex-wrap gap-2">
              <button
                type="submit"
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-indigo-600 text-white text-xs font-medium rounded hover:bg-indigo-700 transition-colors"
              >
                <Target className="h-3 w-3" /> Launch Campaign
              </button>
              <button
                type="button"
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-slate-800/20 text-slate-300 text-xs font-medium rounded hover:bg-slate-800/30 transition-colors"
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
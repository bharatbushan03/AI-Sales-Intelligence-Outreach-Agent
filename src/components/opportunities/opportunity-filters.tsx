import { Search, RefreshCw, Filter, Calendar, Users } from 'lucide-react';

export default function OpportunityFilters() {
  return (
    <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-800">
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-slate-100 mb-3">
          Opportunity Filters
        </h2>

        <form className="space-y-4">
          {/* Search */}
          <div className="space-y-2">
            <label className="block text-xs font-medium text-slate-100 mb-1">
              Search Opportunities
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search by company, deal value, stage..."
                className="w-full pl-10 pr-4 py-2 text-sm text-slate-900 bg-slate-50 border border-slate-200 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-slate-800 dark:text-slate-100 dark:border-slate-600"
              />
              <span className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400">
                <Search className="h-4 w-4" />
              </span>
            </div>
          </div>

          {/* Stage Filter */}
          <div className="space-y-2">
            <label className="block text-xs font-medium text-slate-100 mb-1">
              Deal Stage
            </label>
            <div className="flex flex-wrap gap-2">
              <label className="flex items-center gap-1 text-xs">
                <input
                  type="checkbox"
                  className="h-3 w-3 text-indigo-600 focus:ring-indigo-500"
                />
                Prospecting
              </label>
              <label className="flex items-center gap-1 text-xs">
                <input
                  type="checkbox"
                  className="h-3 w-3 text-indigo-600 focus:ring-indigo-500"
                />
                Qualification
              </label>
              <label className="flex items-center gap-1 text-xs">
                <input
                  type="checkbox"
                  className="h-3 w-3 text-indigo-600 focus:ring-indigo-500"
                />
                Proposal
              </label>
              <label className="flex items-center gap-1 text-xs">
                <input
                  type="checkbox"
                  className="h-3 w-3 text-indigo-600 focus:ring-indigo-500"
                />
                Negotiation
              </label>
              <label className="flex items-center gap-1 text-xs">
                <input
                  type="checkbox"
                  className="h-3 w-3 text-indigo-600 focus:ring-indigo-500"
                />
                Closed Won
              </label>
              <label className="flex items-center gap-1 text-xs">
                <input
                  type="checkbox"
                  className="h-3 w-3 text-indigo-600 focus:ring-indigo-500"
                />
                Closed Lost
              </label>
            </div>
          </div>

          {/* Value Range */}
          <div className="space-y-2">
            <label className="block text-xs font-medium text-slate-100 mb-1">
              Deal Value Range
            </label>
            <div className="grid gap-2 grid-cols-2">
              <div>
                <label className="block text-xs font-medium text-slate-100 mb-1">
                  Min ($)
                </label>
                <input
                  type="number"
                  placeholder="0"
                  className="w-full pl-3 py-2 text-sm text-slate-900 bg-slate-50 border border-slate-200 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-slate-800 dark:text-slate-100 dark:border-slate-600"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-100 mb-1">
                  Max ($)
                </label>
                <input
                  type="number"
                  placeholder="1000000"
                  className="w-full pl-3 py-2 text-sm text-slate-900 bg-slate-50 border border-slate-200 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-slate-800 dark:text-slate-100 dark:border-slate-600"
                />
              </div>
            </div>
          </div>

          {/* Date Range */}
          <div className="space-y-2">
            <label className="block text-xs font-medium text-slate-100 mb-1">
              Date Range
            </label>
            <div className="flex space-x-2">
              <label className="flex items-center gap-1 text-xs">
                <input
                  type="radio"
                  name="dateRange"
                  value="week"
                  className="h-3 w-3 text-indigo-600 focus:ring-indigo-500"
                />
                This Week
              </label>
              <label className="flex items-center gap-1 text-xs">
                <input
                  type="radio"
                  name="dateRange"
                  value="month"
                  className="h-3 w-3 text-indigo-600 focus:ring-indigo-500"
                />
                This Month
              </label>
              <label className="flex items-center gap-1 text-xs">
                <input
                  type="radio"
                  name="dateRange"
                  value="quarter"
                  className="h-3 w-3 text-indigo-600 focus:ring-indigo-500"
                />
                This Quarter
              </label>
              <label className="flex items-center gap-1 text-xs">
                <input
                  type="radio"
                  name="dateRange"
                  value="year"
                  className="h-3 w-3 text-indigo-600 focus:ring-indigo-500"
                />
                This Year
              </label>
              <label className="flex items-center gap-1 text-xs">
                <input
                  type="radio"
                  name="dateRange"
                  value="custom"
                  className="h-3 w-3 text-indigo-600 focus:ring-indigo-500"
                />
                Custom
              </label>
            </div>
          </div>

          {/* Owner Filter */}
          <div className="space-y-2">
            <label className="block text-xs font-medium text-slate-100 mb-1">
              Owner
            </label>
            <select
              className="w-full pl-3 pr-10 py-2 text-sm text-slate-900 bg-slate-50 border border-slate-200 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-slate-800 dark:text-slate-100 dark:border-slate-600"
            >
              <option value="">All Owners</option>
              <option value="john">John Doe (You)</option>
              <option value="sarah">Sarah Chen</option>
              <option value="mike">Mike Rodriguez</option>
              <option value="lisa">Lisa Wang</option>
            </select>
          </div>

          {/* Action Buttons */}
          <div className="mt-4 pt-3 border-t border-slate-800">
            <div className="flex flex-wrap gap-2">
              <button
                type="submit"
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-indigo-600 text-white text-xs font-medium rounded hover:bg-indigo-700 transition-colors"
              >
                <Filter className="h-3 w-3" /> Apply Filters
              </button>
              <button
                type="button"
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-slate-800/20 text-slate-300 text-xs font-medium rounded hover:bg-slate-800/30 transition-colors"
              >
                <RefreshCw className="h-3 w-3" /> Reset
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
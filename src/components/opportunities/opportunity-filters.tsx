import { Search, RefreshCw, Filter, Calendar, Users } from 'lucide-react';

export default function OpportunityFilters() {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-4">
      <div className="space-y-4">
        <h2 className="mb-3 text-lg font-semibold text-slate-100">Opportunity Filters</h2>

        <form className="space-y-4">
          {/* Search */}
          <div className="space-y-2">
            <label className="mb-1 block text-xs font-medium text-slate-100">
              Search Opportunities
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search by company, deal value, stage..."
                className="w-full rounded-md border border-slate-200 bg-slate-50 py-2 pr-4 pl-10 text-sm text-slate-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
              />
              <span className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400">
                <Search className="h-4 w-4" />
              </span>
            </div>
          </div>

          {/* Stage Filter */}
          <div className="space-y-2">
            <label className="mb-1 block text-xs font-medium text-slate-100">Deal Stage</label>
            <div className="flex flex-wrap gap-2">
              <label className="flex items-center gap-1 text-xs">
                <input type="checkbox" className="h-3 w-3 text-indigo-600 focus:ring-indigo-500" />
                Prospecting
              </label>
              <label className="flex items-center gap-1 text-xs">
                <input type="checkbox" className="h-3 w-3 text-indigo-600 focus:ring-indigo-500" />
                Qualification
              </label>
              <label className="flex items-center gap-1 text-xs">
                <input type="checkbox" className="h-3 w-3 text-indigo-600 focus:ring-indigo-500" />
                Proposal
              </label>
              <label className="flex items-center gap-1 text-xs">
                <input type="checkbox" className="h-3 w-3 text-indigo-600 focus:ring-indigo-500" />
                Negotiation
              </label>
              <label className="flex items-center gap-1 text-xs">
                <input type="checkbox" className="h-3 w-3 text-indigo-600 focus:ring-indigo-500" />
                Closed Won
              </label>
              <label className="flex items-center gap-1 text-xs">
                <input type="checkbox" className="h-3 w-3 text-indigo-600 focus:ring-indigo-500" />
                Closed Lost
              </label>
            </div>
          </div>

          {/* Value Range */}
          <div className="space-y-2">
            <label className="mb-1 block text-xs font-medium text-slate-100">
              Deal Value Range
            </label>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-100">Min ($)</label>
                <input
                  type="number"
                  placeholder="0"
                  className="w-full rounded-md border border-slate-200 bg-slate-50 py-2 pl-3 text-sm text-slate-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-100">Max ($)</label>
                <input
                  type="number"
                  placeholder="1000000"
                  className="w-full rounded-md border border-slate-200 bg-slate-50 py-2 pl-3 text-sm text-slate-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
                />
              </div>
            </div>
          </div>

          {/* Date Range */}
          <div className="space-y-2">
            <label className="mb-1 block text-xs font-medium text-slate-100">Date Range</label>
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
            <label className="mb-1 block text-xs font-medium text-slate-100">Owner</label>
            <select className="w-full rounded-md border border-slate-200 bg-slate-50 py-2 pr-10 pl-3 text-sm text-slate-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100">
              <option value="">All Owners</option>
              <option value="john">John Doe (You)</option>
              <option value="sarah">Sarah Chen</option>
              <option value="mike">Mike Rodriguez</option>
              <option value="lisa">Lisa Wang</option>
            </select>
          </div>

          {/* Action Buttons */}
          <div className="mt-4 border-t border-slate-800 pt-3">
            <div className="flex flex-wrap gap-2">
              <button
                type="submit"
                className="flex flex-1 items-center justify-center gap-2 rounded bg-indigo-600 px-3 py-2 text-xs font-medium text-white transition-colors hover:bg-indigo-700"
              >
                <Filter className="h-3 w-3" /> Apply Filters
              </button>
              <button
                type="button"
                className="flex flex-1 items-center justify-center gap-2 rounded bg-slate-800/20 px-3 py-2 text-xs font-medium text-slate-300 transition-colors hover:bg-slate-800/30"
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

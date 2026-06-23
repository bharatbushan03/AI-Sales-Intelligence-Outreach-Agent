import { Search, RefreshCw } from 'lucide-react';

export default function ResearchFilters() {
  return (
    <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-800">
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-slate-100 mb-3">
          Research Filters
        </h2>

        <form className="space-y-4">
          {/* Search */}
          <div className="space-y-2">
            <label className="block text-xs font-medium text-slate-100 mb-1">
              Search Companies
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Enter company name, industry, or keywords..."
                className="w-full pl-10 pr-4 py-2 text-sm text-slate-900 bg-slate-50 border border-slate-200 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-slate-800 dark:text-slate-100 dark:border-slate-600"
              />
              <span className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400">
                <Search className="h-4 w-4" />
              </span>
            </div>
          </div>

          {/* Industry Filter */}
          <div className="space-y-2">
            <label className="block text-xs font-medium text-slate-100 mb-1">
              Industry
            </label>
            <select
              className="w-full pl-3 pr-10 py-2 text-sm text-slate-900 bg-slate-50 border border-slate-200 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-slate-800 dark:text-slate-100 dark:border-slate-600"
            >
              <option value="">All Industries</option>
              <option value="software">Enterprise Software</option>
              <option value="fintech">FinTech</option>
              <option value="manufacturing">Manufacturing</option>
              <option value="healthcare">Healthcare</option>
              <option value="retail">Retail & E-commerce</option>
            </select>
          </div>

          {/* Confidence Filter */}
          <div className="space-y-2">
            <label className="block text-xs font-medium text-slate-100 mb-1">
              Minimum Confidence
            </label>
            <div className="flex space-x-2">
              <label className="flex items-center gap-1 text-xs">
                <input
                  type="radio"
                  name="confidence"
                  value="70"
                  className="h-3 w-3 text-indigo-600 focus:ring-indigo-500"
                />
                70%+
              </label>
              <label className="flex items-center gap-1 text-xs">
                <input
                  type="radio"
                  name="confidence"
                  value="80"
                  className="h-3 w-3 text-indigo-600 focus:ring-indigo-500"
                />
                80%+
              </label>
              <label className="flex items-center gap-1 text-xs">
                <input
                  type="radio"
                  name="confidence"
                  value="90"
                  className="h-3 w-3 text-indigo-600 focus:ring-indigo-500"
                />
                90%+
              </label>
            </div>
          </div>

          {/* Company Size */}
          <div className="space-y-2">
            <label className="block text-xs font-medium text-slate-100 mb-1">
              Company Size
            </label>
            <div className="flex flex-wrap gap-2">
              <label className="flex items-center gap-1 text-xs">
                <input
                  type="checkbox"
                  className="h-3 w-3 text-indigo-600 focus:ring-indigo-500"
                />
                1-50 employees
              </label>
              <label className="flex items-center gap-1 text-xs">
                <input
                  type="checkbox"
                  className="h-3 w-3 text-indigo-600 focus:ring-indigo-500"
                />
                50-250 employees
              </label>
              <label className="flex items-center gap-1 text-xs">
                <input
                  type="checkbox"
                  className="h-3 w-3 text-indigo-600 focus:ring-indigo-500"
                />
                250-1000 employees
              </label>
              <label className="flex items-center gap-1 text-xs">
                <input
                  type="checkbox"
                  className="h-3 w-3 text-indigo-600 focus:ring-indigo-500"
                />
                1000+ employees
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
                <Search className="h-3 w-3" /> Apply Filters
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
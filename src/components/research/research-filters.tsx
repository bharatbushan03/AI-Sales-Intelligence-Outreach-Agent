import { Search, RefreshCw } from 'lucide-react';

export default function ResearchFilters() {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-4">
      <div className="space-y-4">
        <h2 className="mb-3 text-lg font-semibold text-slate-100">Research Filters</h2>

        <form className="space-y-4">
          {/* Search */}
          <div className="space-y-2">
            <label className="mb-1 block text-xs font-medium text-slate-100">
              Search Companies
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Enter company name, industry, or keywords..."
                className="w-full rounded-md border border-slate-200 bg-slate-50 py-2 pr-4 pl-10 text-sm text-slate-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
              />
              <span className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400">
                <Search className="h-4 w-4" />
              </span>
            </div>
          </div>

          {/* Industry Filter */}
          <div className="space-y-2">
            <label className="mb-1 block text-xs font-medium text-slate-100">Industry</label>
            <select className="w-full rounded-md border border-slate-200 bg-slate-50 py-2 pr-10 pl-3 text-sm text-slate-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100">
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
            <label className="mb-1 block text-xs font-medium text-slate-100">
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
            <label className="mb-1 block text-xs font-medium text-slate-100">Company Size</label>
            <div className="flex flex-wrap gap-2">
              <label className="flex items-center gap-1 text-xs">
                <input type="checkbox" className="h-3 w-3 text-indigo-600 focus:ring-indigo-500" />
                1-50 employees
              </label>
              <label className="flex items-center gap-1 text-xs">
                <input type="checkbox" className="h-3 w-3 text-indigo-600 focus:ring-indigo-500" />
                50-250 employees
              </label>
              <label className="flex items-center gap-1 text-xs">
                <input type="checkbox" className="h-3 w-3 text-indigo-600 focus:ring-indigo-500" />
                250-1000 employees
              </label>
              <label className="flex items-center gap-1 text-xs">
                <input type="checkbox" className="h-3 w-3 text-indigo-600 focus:ring-indigo-500" />
                1000+ employees
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
                <Search className="h-3 w-3" /> Apply Filters
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

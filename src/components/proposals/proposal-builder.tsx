import { FileText, Edit, Users, Clock, MessageCircle, Mail, Link, TrendingUp, Search } from 'lucide-react';

export default function ProposalBuilder() {
  return (
    <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-800">
      <div className="space-y-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-slate-100">
            Proposal Builder
          </h2>
          <button className="text-sm text-indigo-400 hover:text-indigo-300">
            <FileText className="h-3 w-3" /> New Proposal
          </div>
        </div>

        {/* Proposal Form */}
        <form className="space-y-4">
          {/* Basic Info */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-slate-100 mb-2">Basic Information</h3>
            <div className="grid gap-4 grid-cols-2">
              <div>
                <label className="block text-xs font-medium text-slate-100 mb-1">
                  Proposal Title
                </label>
                <input
                  type="text"
                  placeholder="Enter proposal title..."
                  className="w-full pl-3 py-2 text-sm text-slate-900 bg-slate-50 border border-slate-200 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-slate-800 dark:text-slate-100 dark:border-slate-600"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-100 mb-1">
                  Client Name
                </label>
                <input
                  type="text"
                  placeholder="Enter client name..."
                  className="w-full pl-3 py-2 text-sm text-slate-900 bg-slate-50 border border-slate-200 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-slate-800 dark:text-slate-100 dark:border-slate-600"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-100 mb-1">
                  Proposal Value
                </label>
                <input
                  type="number"
                  placeholder="0"
                  className="w-full pl-3 py-2 text-sm text-slate-900 bg-slate-50 border border-slate-200 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-slate-800 dark:text-slate-100 dark:border-slate-600"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-100 mb-1">
                  Valid Until
                </label>
                <input
                  type="date"
                  className="w-full pl-3 py-2 text-sm text-slate-900 bg-slate-50 border border-slate-200 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-slate-800 dark:text-slate-100 dark:border-slate-600"
                />
              </div>
            </div>
          </div>

          {/* Sections */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-slate-100 mb-2">Proposal Sections</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0">
                  <div className="w-2 h-2 bg-indigo-500 rounded-full" />
                </div>
                <div className="flex-1 space-y-0.5">
                  <p className="text-xs font-medium text-slate-100">Executive Summary</p>
                  <p className="text-xs text-slate-400">High-level overview of solution and benefits</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0">
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                </div>
                <div className="flex-1 space-y-0.5">
                  <p className="text-xs font-medium text-slate-100">Technical Approach</p>
                  <p className="text-xs text-slate-400">Detailed methodology and implementation plan</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full" />
                </div>
                <div className="flex-1 space-y-0.5">
                  <p className="text-xs font-medium text-slate-100">Pricing & Timeline</p>
                  <p className="text-xs text-slate-400">Cost breakdown and project schedule</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0">
                  <div className="w-2 h-2 bg-blue-500 rounded-full" />
                </div>
                <div className="flex-1 space-y-0.5">
                  <p className="text-xs font-medium text-slate-100">Terms & Conditions</p>
                  <p className="text-xs text-slate-400">Legal and contractual terms</p>
                </div>
              </div>
            </div>
          </div>

          {/* Collaboration */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-slate-100 mb-2">Collaboration</h3>
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0">
                <div className="w-2 h-2 bg-indigo-500 rounded-full" />
              </div>
              <div className="flex-1 space-y-0.5">
                <p className="text-xs font-medium text-slate-100">Team Members</p>
                <p className="text-xs text-slate-400">John Doe (Owner), Sarah Chen, Mike Rodriguez</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0">
                <div className="w-2 h-2 bg-green-500 rounded-full" />
              </div>
              <div className="flex-1 space-y-0.5">
                <p className="text-xs font-medium text-slate-100">Review Status</p>
                <p className="text-xs text-slate-400">Ready for Review</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0">
                <div className="w-2 h-2 bg-yellow-500 rounded-full" />
              </div>
              <div className="flex-1 space-y-0.5">
                <p className="text-xs font-medium text-slate-100">Last Updated</p>
                <p className="text-xs text-slate-400">2 hours ago</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-4 pt-3 border-t border-slate-800">
            <div className="flex flex-wrap gap-2">
              <button
                type="submit"
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-indigo-600 text-white text-xs font-medium rounded hover:bg-indigo-700 transition-colors"
              >
                <Link className="h-3 w-3" /> Generate Preview
              </button>
              <button
                type="button"
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-indigo-600/20 text-indigo-300 text-xs font-medium rounded hover:bg-indigo-600/30 transition-colors"
              >
                <Edit className="h-3 w-3" /> Save as Draft
              </button>
              <button
                type="button"
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-slate-800/20 text-slate-300 text-xs font-medium rounded hover:bg-slate-800/30 transition-colors"
              >
                <Mail className="h-3 w-3" /> Send for Review
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
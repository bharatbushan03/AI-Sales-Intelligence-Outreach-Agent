import {
  FileText,
  Edit,
  Users,
  Clock,
  MessageCircle,
  Mail,
  Link,
  TrendingUp,
  Search,
} from 'lucide-react';

export default function ProposalBuilder() {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-4">
      <div className="space-y-4">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-100">Proposal Builder</h2>
          <button className="text-sm text-indigo-400 hover:text-indigo-300">
            <FileText className="h-3 w-3" /> New Proposal
          </button>
        </div>

        {/* Proposal Form */}
        <form className="space-y-4">
          {/* Basic Info */}
          <div className="space-y-4">
            <h3 className="mb-2 text-sm font-medium text-slate-100">Basic Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-100">
                  Proposal Title
                </label>
                <input
                  type="text"
                  placeholder="Enter proposal title..."
                  className="w-full rounded-md border border-slate-200 bg-slate-50 py-2 pl-3 text-sm text-slate-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-100">Client Name</label>
                <input
                  type="text"
                  placeholder="Enter client name..."
                  className="w-full rounded-md border border-slate-200 bg-slate-50 py-2 pl-3 text-sm text-slate-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-100">
                  Proposal Value
                </label>
                <input
                  type="number"
                  placeholder="0"
                  className="w-full rounded-md border border-slate-200 bg-slate-50 py-2 pl-3 text-sm text-slate-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-100">Valid Until</label>
                <input
                  type="date"
                  className="w-full rounded-md border border-slate-200 bg-slate-50 py-2 pl-3 text-sm text-slate-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
                />
              </div>
            </div>
          </div>

          {/* Sections */}
          <div className="space-y-4">
            <h3 className="mb-2 text-sm font-medium text-slate-100">Proposal Sections</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0">
                  <div className="h-2 w-2 rounded-full bg-indigo-500" />
                </div>
                <div className="flex-1 space-y-0.5">
                  <p className="text-xs font-medium text-slate-100">Executive Summary</p>
                  <p className="text-xs text-slate-400">
                    High-level overview of solution and benefits
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0">
                  <div className="h-2 w-2 rounded-full bg-green-500" />
                </div>
                <div className="flex-1 space-y-0.5">
                  <p className="text-xs font-medium text-slate-100">Technical Approach</p>
                  <p className="text-xs text-slate-400">
                    Detailed methodology and implementation plan
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0">
                  <div className="h-2 w-2 rounded-full bg-yellow-500" />
                </div>
                <div className="flex-1 space-y-0.5">
                  <p className="text-xs font-medium text-slate-100">Pricing & Timeline</p>
                  <p className="text-xs text-slate-400">Cost breakdown and project schedule</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0">
                  <div className="h-2 w-2 rounded-full bg-blue-500" />
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
            <h3 className="mb-2 text-sm font-medium text-slate-100">Collaboration</h3>
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0">
                <div className="h-2 w-2 rounded-full bg-indigo-500" />
              </div>
              <div className="flex-1 space-y-0.5">
                <p className="text-xs font-medium text-slate-100">Team Members</p>
                <p className="text-xs text-slate-400">
                  John Doe (Owner), Sarah Chen, Mike Rodriguez
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0">
                <div className="h-2 w-2 rounded-full bg-green-500" />
              </div>
              <div className="flex-1 space-y-0.5">
                <p className="text-xs font-medium text-slate-100">Review Status</p>
                <p className="text-xs text-slate-400">Ready for Review</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0">
                <div className="h-2 w-2 rounded-full bg-yellow-500" />
              </div>
              <div className="flex-1 space-y-0.5">
                <p className="text-xs font-medium text-slate-100">Last Updated</p>
                <p className="text-xs text-slate-400">2 hours ago</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-4 border-t border-slate-800 pt-3">
            <div className="flex flex-wrap gap-2">
              <button
                type="submit"
                className="flex flex-1 items-center justify-center gap-2 rounded bg-indigo-600 px-3 py-2 text-xs font-medium text-white transition-colors hover:bg-indigo-700"
              >
                <Link className="h-3 w-3" /> Generate Preview
              </button>
              <button
                type="button"
                className="flex flex-1 items-center justify-center gap-2 rounded bg-indigo-600/20 px-3 py-2 text-xs font-medium text-indigo-300 transition-colors hover:bg-indigo-600/30"
              >
                <Edit className="h-3 w-3" /> Save as Draft
              </button>
              <button
                type="button"
                className="flex flex-1 items-center justify-center gap-2 rounded bg-slate-800/20 px-3 py-2 text-xs font-medium text-slate-300 transition-colors hover:bg-slate-800/30"
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

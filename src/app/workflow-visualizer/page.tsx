import WorkflowVisualization from '@/components/workflow-visualization';
import { WorkflowDetailsPanel } from '@/components/workflow-details-panel';

export default function WorkflowVisualizer() {
  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col space-y-4">
        <h1 className="text-2xl font-bold text-slate-100">
          Workflow Visualizer
        </h1>
        <div className="flex flex-col space-y-4 md:flex-row md:gap-6">
          <div className="flex-1">
            <WorkflowVisualization />
          </div>
          <div className="flex-1">
            <WorkflowDetailsPanel />
          </div>
        </div>
      </div>

      {/* Workflow History */}
      <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-800">
        <h2 className="text-lg font-semibold text-slate-100 mb-4">
          Workflow History
        </h2>
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0">
              <div className="h-3 w-3 bg-indigo-500 rounded-full" />
            </div>
            <div className="flex-1 space-y-0.5">
              <p className="text-sm text-slate-100 font-medium">
                TechCorp Outreach Campaign
              </p>
              <p className="text-xs text-slate-400">
                Completed 2 hours ago • 45 minutes duration
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0">
              <div className="h-3 w-3 bg-indigo-500 rounded-full" />
            </div>
            <div className="flex-1 space-y-0.5">
              <p className="text-sm text-slate-100 font-medium">
                StartupXYZ Proposal Generation
              </p>
              <p className="text-xs text-slate-400">
                Running • 12 minutes duration
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0">
              <div className="h-3 w-3 bg-yellow-500 rounded-full" />
            </div>
            <div className="flex-1 space-y-0.5">
              <p className="text-sm text-slate-100 font-medium">
                Market Research Report
              </p>
              <p className="text-xs text-slate-400">
                Failed • Error in data retrieval
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
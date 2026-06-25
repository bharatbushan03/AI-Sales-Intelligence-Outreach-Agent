import WorkflowVisualization from '@/components/workflow-visualization';
import WorkflowDetailsPanel from '@/components/workflow-details-panel';

export default function WorkflowVisualizer() {
  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col space-y-4">
        <h1 className="text-2xl font-bold text-slate-100">Workflow Visualizer</h1>
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
      <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-4">
        <h2 className="mb-4 text-lg font-semibold text-slate-100">Workflow History</h2>
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0">
              <div className="h-3 w-3 rounded-full bg-indigo-500" />
            </div>
            <div className="flex-1 space-y-0.5">
              <p className="text-sm font-medium text-slate-100">TechCorp Outreach Campaign</p>
              <p className="text-xs text-slate-400">Completed 2 hours ago • 45 minutes duration</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0">
              <div className="h-3 w-3 rounded-full bg-indigo-500" />
            </div>
            <div className="flex-1 space-y-0.5">
              <p className="text-sm font-medium text-slate-100">StartupXYZ Proposal Generation</p>
              <p className="text-xs text-slate-400">Running • 12 minutes duration</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0">
              <div className="h-3 w-3 rounded-full bg-yellow-500" />
            </div>
            <div className="flex-1 space-y-0.5">
              <p className="text-sm font-medium text-slate-100">Market Research Report</p>
              <p className="text-xs text-slate-400">Failed • Error in data retrieval</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

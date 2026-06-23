export default function WorkflowVisualization() {
  const workflowSteps = [
    { id: 1, label: 'User Goal', status: 'completed' },
    { id: 2, label: 'Research Agent', status: 'active' },
    { id: 3, label: 'Opportunity Agent', status: 'pending' },
    { id: 4, label: 'Outreach Agent', status: 'pending' },
    { id: 5, label: 'CRM Agent', status: 'pending' },
    { id: 6, label: 'Proposal Agent', status: 'pending' },
  ];

  return (
    <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-800 h-[400px]">
      <h2 className="text-lg font-semibold text-slate-100 mb-4">
        Workflow Execution
      </h2>
      <div className="relative h-full">
        {/* Vertical line */}
        <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-slate-600" />
        {/* Steps */}
        {workflowSteps.map((step, index) => (
          <div
            key={step.id}
            className="relative pl-8 pb-8 last:pb-0"
          >
            {/* Step circle */}
            <div className="absolute left-0 top-2 flex h-4 w-4 items-center justify-center">
              <div
                className={`h-3 w-3 rounded-full ${
                  step.status === 'completed'
                    ? 'bg-indigo-500'
                    : step.status === 'active'
                    ? 'bg-indigo-400 animate-pulse'
                    : 'bg-slate-500'
                }`}
              />
            </div>
            {/* Step label */}
            <div className="text-sm">
              <div className="font-medium text-slate-100 mb-1">
                {step.label}
              </div>
              <div className={`text-xs ${
                step.status === 'completed'
                  ? 'text-indigo-400'
                  : step.status === 'active'
                  ? 'text-indigo-300'
                  : 'text-slate-400'
              }`}>
                {step.status === 'completed' && 'Completed'}
                {step.status === 'active' && 'In Progress'}
                {step.status === 'pending' && 'Pending'}
              </div>
            </div>
            {/* Connector line (except for last step) */}
            {index < workflowSteps.length - 1 && (
              <div className="absolute left-0 top-4 -translate-y-1/2 h-4 w-0.5 bg-slate-600" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
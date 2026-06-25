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
    <div className="h-[400px] rounded-xl border border-slate-800 bg-slate-900/50 p-4">
      <h2 className="mb-4 text-lg font-semibold text-slate-100">Workflow Execution</h2>
      <div className="relative h-full">
        {/* Vertical line */}
        <div className="absolute top-0 bottom-0 left-3 w-0.5 bg-slate-600" />
        {/* Steps */}
        {workflowSteps.map((step, index) => (
          <div key={step.id} className="relative pb-8 pl-8 last:pb-0">
            {/* Step circle */}
            <div className="absolute top-2 left-0 flex h-4 w-4 items-center justify-center">
              <div
                className={`h-3 w-3 rounded-full ${
                  step.status === 'completed'
                    ? 'bg-indigo-500'
                    : step.status === 'active'
                      ? 'animate-pulse bg-indigo-400'
                      : 'bg-slate-500'
                }`}
              />
            </div>
            {/* Step label */}
            <div className="text-sm">
              <div className="mb-1 font-medium text-slate-100">{step.label}</div>
              <div
                className={`text-xs ${
                  step.status === 'completed'
                    ? 'text-indigo-400'
                    : step.status === 'active'
                      ? 'text-indigo-300'
                      : 'text-slate-400'
                }`}
              >
                {step.status === 'completed' && 'Completed'}
                {step.status === 'active' && 'In Progress'}
                {step.status === 'pending' && 'Pending'}
              </div>
            </div>
            {/* Connector line (except for last step) */}
            {index < workflowSteps.length - 1 && (
              <div className="absolute top-4 left-0 h-4 w-0.5 -translate-y-1/2 bg-slate-600" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

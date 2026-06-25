export default function WorkflowDetailsPanel() {
  const workflow = {
    id: 'wf_12345',
    name: 'TechCorp Outreach Campaign',
    status: 'completed',
    startTime: '2026-06-22 10:00:00',
    endTime: '2026-06-22 10:45:00',
    duration: '45 minutes',
    steps: [
      {
        id: 1,
        name: 'User Goal',
        status: 'completed',
        duration: '2 minutes',
        output: 'Defined target: AI companies in Series B+',
      },
      {
        id: 2,
        name: 'Research Agent',
        status: 'completed',
        duration: '10 minutes',
        output: 'Identified 15 target companies with tech stack and funding data',
      },
      {
        id: 3,
        name: 'Opportunity Agent',
        status: 'completed',
        duration: '8 minutes',
        output: 'Scored leads: 8 high, 4 medium, 3 low priority',
      },
      {
        id: 4,
        name: 'Outreach Agent',
        status: 'completed',
        duration: '20 minutes',
        output: 'Sent 120 personalized emails, 28 opens, 7 replies',
      },
      {
        id: 5,
        name: 'CRM Agent',
        status: 'completed',
        duration: '3 minutes',
        output: 'Updated 7 opportunities in Salesforce',
      },
      {
        id: 6,
        name: 'Proposal Agent',
        status: 'completed',
        duration: '2 minutes',
        output: 'Generated 1 proposal for TechCorp',
      },
    ],
  };

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-4">
      <h2 className="mb-4 text-lg font-semibold text-slate-100">Workflow Details</h2>
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-2 text-sm text-slate-400">
          <div>
            <span className="font-medium">Workflow ID:</span>
            <span className="ml-2">{workflow.id}</span>
          </div>
          <div>
            <span className="font-medium">Status:</span>
            <span className="ml-2 text-indigo-400">{workflow.status}</span>
          </div>
          <div>
            <span className="font-medium">Start Time:</span>
            <span className="ml-2">{workflow.startTime}</span>
          </div>
          <div>
            <span className="font-medium">End Time:</span>
            <span className="ml-2">{workflow.endTime}</span>
          </div>
          <div>
            <span className="font-medium">Duration:</span>
            <span className="ml-2">{workflow.duration}</span>
          </div>
        </div>

        <div className="mt-4">
          <h3 className="text-md mb-2 font-semibold text-slate-100">Execution Steps</h3>
          <div className="space-y-2">
            {workflow.steps.map((step) => (
              <div key={step.id} className="border-t border-slate-700 pt-3">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0">
                    <div
                      className={`h-3 w-3 rounded-full ${
                        step.status === 'completed'
                          ? 'bg-indigo-500'
                          : step.status === 'active'
                            ? 'animate-pulse bg-indigo-400'
                            : step.status === 'error'
                              ? 'bg-red-500'
                              : 'bg-slate-500'
                      }`}
                    />
                  </div>
                  <div className="flex-1 space-y-0.5">
                    <p className="text-sm font-medium text-slate-100">{step.name}</p>
                    <p className="text-xs text-slate-400">Duration: {step.duration}</p>
                    <p className="text-xs text-slate-400">Output: {step.output}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

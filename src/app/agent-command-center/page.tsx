import { AgentCard } from '@/components/agent-card';
import WorkflowVisualization from '@/components/workflow-visualization';

export default function AgentCommandCenter() {
  return (
    <div className="space-y-8 p-6">
      <div className="flex flex-col space-y-4">
        <h1 className="text-2xl font-bold text-slate-100">
          Agent Command Center
        </h1>
        <div className="flex flex-col space-y-4 md:flex-row md:gap-4">
          {/* Agent Cards */}
          <div className="flex-1 space-y-4">
            <AgentCard
              name="Manager Agent"
              status="active"
              currentTask="Coordinating workflow execution"
              memoryUsage="2.4 GB / 4.0 GB"
              performance="98%"
              workflowExecution="Running"
            />
            <AgentCard
              name="Research Agent"
              status="active"
              currentTask="Analyzing market trends for TechCorp"
              memoryUsage="1.8 GB / 4.0 GB"
              performance="95%"
              workflowExecution="Researching"
            />
            <AgentCard
              name="Opportunity Agent"
              status="active"
              currentTask="Scoring leads for Outreach Campaign"
              memoryUsage="1.6 GB / 4.0 GB"
              performance="92%"
              workflowExecution="Scoring"
            />
            <AgentCard
              name="Outreach Agent"
              status="active"
              currentTask="Sending personalized emails to prospects"
              memoryUsage="1.9 GB / 4.0 GB"
              performance="90%"
              workflowExecution="Sending"
            />
            <AgentCard
              name="CRM Agent"
              status="active"
              currentTask="Updating opportunity stages in Salesforce"
              memoryUsage="1.7 GB / 4.0 GB"
              performance="94%"
              workflowExecution="Updating"
            />
            <AgentCard
              name="Proposal Agent"
              status="active"
              currentTask="Generating proposal for TechCorp"
              memoryUsage="2.1 GB / 4.0 GB"
              performance="96%"
              workflowExecution="Generating"
            />
          </div>

          {/* Workflow Visualization */}
          <div className="flex-1">
            <WorkflowVisualization />
          </div>
        </div>
      </div>

      {/* Additional Sections */}
      <div className="grid gap-6 md:grid-cols-2">
        <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-800">
          <h2 className="text-lg font-semibold text-slate-100 mb-4">
            System Metrics
          </h2>
          <div className="space-y-2">
            <div className="flex justify-between text-slate-400">
              <span>Total Workflows Today</span>
              <span className="font-medium">127</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Agent Uptime</span>
              <span className="font-medium">99.8%</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Memory Usage</span>
              <span className="font-medium">65%</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>API Requests/min</span>
              <span className="font-medium">1.2k</span>
            </div>
          </div>
        </div>

        <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-800">
          <h2 className="text-lg font-semibold text-slate-100 mb-4">
            Active Alerts
          </h2>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0">
                <div className="h-3 w-3 bg-indigo-500 rounded-full" />
              </div>
              <div className="flex-1 space-y-0.5">
                <p className="text-sm text-slate-100 font-medium">
                  High memory usage on Research Agent
                </p>
                <p className="text-xs text-slate-400">
                  2 minutes ago
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0">
                <div className="h-3 w-3 bg-yellow-500 rounded-full" />
              </div>
              <div className="flex-1 space-y-0.5">
                <p className="text-sm text-slate-100 font-medium">
                  Workflow execution delayed
                </p>
                <p className="text-xs text-slate-400">
                  5 minutes ago
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
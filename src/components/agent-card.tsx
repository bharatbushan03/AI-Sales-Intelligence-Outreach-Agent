import { Activity, Clock, Database, Cpu, Target, TrendingUp } from 'lucide-react';

interface AgentCardProps {
  name: string;
  status: 'active' | 'idle' | 'error';
  currentTask: string;
  memoryUsage: string;
  performance: string;
  workflowExecution: string;
}

export function AgentCard({
  name,
  status,
  currentTask,
  memoryUsage,
  performance,
  workflowExecution,
}: AgentCardProps) {
  const statusColors: Record<string, string> = {
    active: 'bg-indigo-500/20 text-indigo-400',
    idle: 'bg-slate-500/20 text-slate-400',
    error: 'bg-red-500/20 text-red-400',
  };

  return (
    <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-800">
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 h-8 w-8 flex items-center justify-center rounded-lg">
          {status === 'active' && <Activity className="h-4 w-4 text-indigo-400" />}
          {status === 'idle' && <Clock className="h-4 w-4 text-slate-400" />}
          {status === 'error' && <Database className="h-4 w-4 text-red-400" />}
        </div>
        <div className="flex-1 space-y-2">
          <div className="flex justify-between text-sm">
            <h3 className="font-medium text-slate-100">{name}</h3>
            <span className={`px-2 py-0.5 rounded text-xs font-medium ${statusColors[status]}`}>
              {status}
            </span>
          </div>
          <p className="text-slate-400 text-sm">{currentTask}</p>
          <div className="grid gap-2 grid-cols-2 text-slate-400 text-sm">
            <div className="flex items-center gap-2">
              <Memory className="h-4 w-4" />
              <span>{memoryUsage}</span>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              <span>{performance}</span>
            </div>
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4" />
              <span>{workflowExecution}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
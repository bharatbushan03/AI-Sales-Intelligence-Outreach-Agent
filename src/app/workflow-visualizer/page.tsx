'use client';

import React from 'react';
import {
  Activity,
  ArrowRight,
  Bot,
  Clock,
  MessageSquare,
  Network,
  Radio,
  Send,
  GitBranch,
} from 'lucide-react';

type AgentId = 'research' | 'opportunity' | 'outreach' | 'crm' | 'proposal';

interface Agent {
  id: AgentId;
  name: string;
  icon: string;
  color: string;
}

interface Message {
  id: number;
  from: AgentId;
  to: AgentId;
  content: string;
  timestamp: Date;
  type: 'data' | 'insight' | 'command' | 'response';
}

interface AnimationState {
  from: AgentId;
  to: AgentId;
  id: number;
}

const agents: Agent[] = [
  { id: 'research', name: 'Research', icon: '\u{1F50D}', color: 'from-cyan-500 to-blue-600' },
  { id: 'opportunity', name: 'Opportunity', icon: '\u{1F4A1}', color: 'from-violet-500 to-purple-600' },
  { id: 'outreach', name: 'Outreach', icon: '\u{1F4EC}', color: 'from-amber-500 to-orange-600' },
  { id: 'crm', name: 'CRM', icon: '\u{1F4CA}', color: 'from-emerald-500 to-teal-600' },
  { id: 'proposal', name: 'Proposal', icon: '\u{1F4C4}', color: 'from-rose-500 to-pink-600' },
];

const agentOrder: AgentId[] = ['research', 'opportunity', 'outreach', 'crm', 'proposal'];

const sampleMessages: Omit<Message, 'id' | 'timestamp'>[] = [
  { from: 'research', to: 'opportunity', content: 'Market analysis complete: 45 target companies identified with high-fit scores', type: 'data' },
  { from: 'opportunity', to: 'outreach', content: 'Top 12 leads scored and prioritized by engagement potential', type: 'insight' },
  { from: 'outreach', to: 'crm', content: 'Campaign deployed: 120 personalized emails sent to qualified leads', type: 'response' },
  { from: 'crm', to: 'proposal', content: '7 opportunities updated in pipeline, 3 request proposal generation', type: 'data' },
  { from: 'proposal', to: 'research', content: 'Need data on TechCorp for proposal customization', type: 'command' },
  { from: 'research', to: 'proposal', content: 'TechCorp data enriched with latest funding and tech stack info', type: 'response' },
  { from: 'proposal', to: 'crm', content: 'Proposal generated and attached to opportunity record', type: 'response' },
  { from: 'opportunity', to: 'research', content: 'Re-scoring needed for new batch of inbound leads', type: 'command' },
  { from: 'research', to: 'opportunity', content: 'New leads analyzed: 8 high priority, 4 medium, 3 low', type: 'data' },
  { from: 'outreach', to: 'opportunity', content: 'Email campaign metrics: 32% open rate, 12% reply rate', type: 'insight' },
];

const messageVariants = [
  'Market intelligence update: {{count}} new signals detected in target sector',
  'Scoring model applied to {{count}} leads with {{confidence}}% confidence',
  'Personalized template generated for {{company}} with {{tone}} tone',
  'Pipeline stage transition: {{from}} -> {{to}} for {{count}} opportunities',
  'Context shared: {{topic}} from {{agentA}} to {{agentB}} for alignment',
  'Cross-reference complete: {{dataA}} matched with {{dataB}} across {{count}} dimensions',
];

function getRandomMessage(agentsList: Agent[]): Omit<Message, 'id' | 'timestamp'> {
  const agentNames = ['TechCorp', 'StartupXYZ', 'DataFlow Inc', 'CloudBase', 'AIMetrics'];
  const tones = ['professional', 'friendly', 'technical', 'executive'];
  const varMsg = messageVariants[Math.floor(Math.random() * messageVariants.length)];
  const content = varMsg
    .replace('{{count}}', String(Math.floor(Math.random() * 50) + 5))
    .replace('{{confidence}}', String(Math.floor(Math.random() * 30) + 65))
    .replace('{{company}}', agentNames[Math.floor(Math.random() * agentNames.length)])
    .replace('{{tone}}', tones[Math.floor(Math.random() * tones.length)])
    .replace('{{from}}', ['Discovery', 'Qualification', 'Proposal'][Math.floor(Math.random() * 3)])
    .replace('{{to}}', ['Qualification', 'Proposal', 'Negotiation'][Math.floor(Math.random() * 3)])
    .replace('{{topic}}', ['tech stack', 'budget', 'timeline', 'decision criteria'][Math.floor(Math.random() * 4)])
    .replace('{{agentA}}', agentsList[Math.floor(Math.random() * agentsList.length)].name)
    .replace('{{agentB}}', agentsList[Math.floor(Math.random() * agentsList.length)].name)
    .replace('{{dataA}}', ['CRM records', 'email history', 'support tickets'][Math.floor(Math.random() * 3)])
    .replace('{{dataB}}', ['market data', 'social profiles', 'news articles'][Math.floor(Math.random() * 3)]);
  const types: ('data' | 'insight' | 'command' | 'response')[] = ['data', 'insight', 'command', 'response'];
  const fromIdx = Math.floor(Math.random() * agentsList.length);
  let toIdx = Math.floor(Math.random() * agentsList.length);
  while (toIdx === fromIdx) {
    toIdx = Math.floor(Math.random() * agentsList.length);
  }
  return {
    from: agentsList[fromIdx].id as AgentId,
    to: agentsList[toIdx].id as AgentId,
    content,
    type: types[Math.floor(Math.random() * types.length)],
  };
}

function useSimulation(agentsList: Agent[]) {
  const [messages, setMessages] = React.useState<Message[]>(() =>
    sampleMessages.map((m, i) => ({
      ...m,
      id: i + 1,
      timestamp: new Date(Date.now() - (sampleMessages.length - i) * 4000),
    })),
  );
  const [animating, setAnimating] = React.useState<AnimationState | null>(null);
  const nextIdRef = React.useRef(sampleMessages.length + 1);

  React.useEffect(() => {
    const interval = setInterval(() => {
      const msg = getRandomMessage(agentsList);
      const newMsg: Message = {
        ...msg,
        id: nextIdRef.current++,
        timestamp: new Date(),
      };
      setAnimating({ from: msg.from, to: msg.to, id: newMsg.id });
      setTimeout(() => {
        setMessages((prev) => [newMsg, ...prev]);
        setAnimating(null);
      }, 1200);
    }, 3500);
    return () => clearInterval(interval);
  }, [agentsList]);

  return { messages, animating };
}

function getAgentIndex(id: AgentId): number {
  return agentOrder.indexOf(id);
}

interface AgentNodeProps {
  agent: Agent;
  isActive: boolean;
  messageCount: number;
}

function AgentNode({ agent, isActive, messageCount }: AgentNodeProps) {
  return (
    <div
      className={`relative flex flex-col items-center gap-2 transition-all duration-500 ${
        isActive ? 'scale-110' : 'scale-100'
      }`}
    >
      <div
        className={`relative flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${agent.color} shadow-lg transition-all duration-300 ${
          isActive ? 'shadow-indigo-500/30 ring-2 ring-indigo-400' : 'shadow-black/20'
        }`}
      >
        <span className="text-2xl">{agent.icon}</span>
        {isActive && (
          <span className="absolute -top-1 -right-1 flex h-4 w-4">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-indigo-400 opacity-75" />
            <span className="relative inline-flex h-4 w-4 rounded-full bg-indigo-500" />
          </span>
        )}
      </div>
      <span className="text-xs font-medium text-slate-300">{agent.name}</span>
      <span className="rounded-full bg-slate-800 px-2 py-0.5 text-[10px] text-slate-400">
        {messageCount} msgs
      </span>
    </div>
  );
}

interface ConnectionArrowProps {
  from: AgentId;
  to: AgentId;
  hasActiveMessage: boolean;
}

function ConnectionArrow({ from, to, hasActiveMessage }: ConnectionArrowProps) {
  return (
    <div className="relative flex items-center">
      <div
        className={`h-0.5 w-12 transition-all duration-500 ${
          hasActiveMessage
            ? 'bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-400'
            : 'bg-slate-700'
        }`}
      />
      <div
        className={`flex h-6 w-6 items-center justify-center rounded-full transition-all duration-500 ${
          hasActiveMessage
            ? 'bg-indigo-500 shadow-lg shadow-indigo-500/40'
            : 'bg-slate-800'
        }`}
      >
        <ArrowRight
          className={`h-3.5 w-3.5 transition-all duration-500 ${
            hasActiveMessage ? 'text-white' : 'text-slate-500'
          }`}
        />
      </div>
      <div
        className={`h-0.5 w-12 transition-all duration-500 ${
          hasActiveMessage
            ? 'bg-gradient-to-r from-indigo-400 via-purple-500 to-indigo-500'
            : 'bg-slate-700'
        }`}
      />
    </div>
  );
}

interface AnimatedMessageProps {
  from: AgentId;
  to: AgentId;
}

function AnimatedMessage({ from, to }: AnimatedMessageProps) {
  const fromIdx = getAgentIndex(from);
  const toIdx = getAgentIndex(to);

  const arrowKeyframes = `
    @keyframes fly-${from}-${to} {
      0% { transform: translateX(0) translateY(0); opacity: 1; }
      25% { transform: translateX(${(toIdx - fromIdx) * 30}px) translateY(-20px); opacity: 1; }
      50% { transform: translateX(${(toIdx - fromIdx) * 60}px) translateY(0); opacity: 1; }
      75% { transform: translateX(${(toIdx - fromIdx) * 90}px) translateY(-10px); opacity: 0.8; }
      100% { transform: translateX(${(toIdx - fromIdx) * 120}px) translateY(0); opacity: 0; }
    }
  `;

  const styleTag = React.useMemo(() => {
    if (typeof document === 'undefined') return null;
    const style = document.createElement('style');
    style.textContent = arrowKeyframes;
    return style;
  }, [from, to]);

  React.useEffect(() => {
    if (!styleTag) return;
    document.head.appendChild(styleTag);
    return () => {
      document.head.removeChild(styleTag);
    };
  }, [styleTag]);

  return (
    <div
      className="absolute top-1/2 left-1/2 z-20 -translate-y-1/2"
      style={{
        animation: `fly-${from}-${to} 1.2s ease-in-out forwards`,
      }}
    >
      <div className="flex items-center gap-1 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 px-3 py-1.5 shadow-lg shadow-indigo-500/40">
        <Send className="h-3 w-3 text-white" />
        <span className="text-[10px] font-medium text-white">Message</span>
      </div>
    </div>
  );
}

function MessageLog({ messages }: { messages: Message[] }) {
  const scrollRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
  }, [messages]);

  const typeStyles: Record<string, string> = {
    data: 'border-l-cyan-500 bg-cyan-500/5',
    insight: 'border-l-violet-500 bg-violet-500/5',
    command: 'border-l-amber-500 bg-amber-500/5',
    response: 'border-l-emerald-500 bg-emerald-500/5',
  };

  const typeIcons: Record<string, string> = {
    data: '\u{1F4CA}',
    insight: '\u{1F4A1}',
    command: '\u26A1',
    response: '\u2705',
  };

  return (
    <div
      ref={scrollRef}
      className="max-h-[420px] space-y-2 overflow-y-auto pr-2"
    >
      {messages.map((msg) => (
        <div
          key={msg.id}
          className={`rounded-lg border-l-2 ${typeStyles[msg.type]} bg-slate-800/30 p-3 backdrop-blur-sm transition-all duration-300 hover:bg-slate-700/40`}
        >
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="text-sm">{typeIcons[msg.type]}</span>
              <span className="text-xs font-medium text-slate-300">
                {agents.find((a) => a.id === msg.from)?.name}
              </span>
              <ArrowRight className="h-3 w-3 text-slate-500" />
              <span className="text-xs font-medium text-slate-300">
                {agents.find((a) => a.id === msg.to)?.name}
              </span>
              <span
                className={`rounded px-1.5 py-0.5 text-[10px] font-medium uppercase ${
                  msg.type === 'data'
                    ? 'bg-cyan-500/20 text-cyan-300'
                    : msg.type === 'insight'
                      ? 'bg-violet-500/20 text-violet-300'
                      : msg.type === 'command'
                        ? 'bg-amber-500/20 text-amber-300'
                        : 'bg-emerald-500/20 text-emerald-300'
                }`}
              >
                {msg.type}
              </span>
            </div>
            <span className="whitespace-nowrap text-[10px] text-slate-500">
              {msg.timestamp.toLocaleTimeString()}
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-400">{msg.content}</p>
        </div>
      ))}
    </div>
  );
}

function StatsCard({
  icon: Icon,
  label,
  value,
  subtext,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  subtext: string;
}) {
  return (
    <div className="rounded-xl border border-slate-700/50 bg-slate-800/40 p-4 backdrop-blur-md transition-all duration-300 hover:border-slate-600/50 hover:bg-slate-800/60">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-xs font-medium text-slate-500">{label}</p>
          <p className="text-2xl font-bold text-slate-100">{value}</p>
          <p className="text-xs text-slate-500">{subtext}</p>
        </div>
        <div className="rounded-lg bg-indigo-500/10 p-2">
          <Icon className="h-5 w-5 text-indigo-400" />
        </div>
      </div>
    </div>
  );
}

export default function WorkflowVisualizer() {
  const { messages, animating } = useSimulation(agents);

  const uniqueConversations = React.useMemo(() => {
    const pairs = new Set(messages.map((m) => `${m.from}-${m.to}`));
    return pairs.size;
  }, [messages]);

  const avgResponseTime = React.useMemo(() => {
    if (messages.length < 2) return '0ms';
    const totalMs = messages
      .slice(0, messages.length - 1)
      .reduce((sum, msg, i) => sum + (messages[i].timestamp.getTime() - msg.timestamp.getTime()), 0);
    return `${((totalMs / (messages.length - 1)) / 1000).toFixed(1)}s`;
  }, [messages]);

  const messageFlowRate = React.useMemo(() => {
    if (messages.length < 2) return '0/min';
    const oldest = messages[messages.length - 1].timestamp.getTime();
    const newest = messages[0].timestamp.getTime();
    const elapsedSec = (newest - oldest) / 1000;
    if (elapsedSec <= 0) return '0/min';
    return `${Math.round((messages.length / elapsedSec) * 60)}/min`;
  }, [messages]);

  const getMessageCount = (agentId: AgentId) =>
    messages.filter((m) => m.from === agentId || m.to === agentId).length;

  const isAgentActive = (agentId: AgentId) =>
    animating !== null && (animating.from === agentId || animating.to === agentId);

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 p-2.5 shadow-lg shadow-indigo-500/20">
              <Network className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-100">Agent Communication Visualizer</h1>
              <p className="text-sm text-slate-400">
                Real-time message flow and collaboration between autonomous agents
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-2">
          <span className="flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-2.5 w-2.5 animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
          </span>
          <span className="text-sm font-medium text-emerald-400">Live</span>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          icon={Radio}
          label="Total Messages"
          value={String(messages.length)}
          subtext="Across all agent channels"
        />
        <StatsCard
          icon={GitBranch}
          label="Active Conversations"
          value={String(uniqueConversations)}
          subtext="Unique agent pairs communicating"
        />
        <StatsCard
          icon={Clock}
          label="Avg Response Time"
          value={avgResponseTime}
          subtext="Between agent messages"
        />
        <StatsCard
          icon={Activity}
          label="Message Flow"
          value={messageFlowRate}
          subtext="Current throughput rate"
        />
      </div>

      <div className="rounded-2xl border border-slate-700/50 bg-slate-800/30 p-8 backdrop-blur-xl">
        <div className="mb-6 flex items-center gap-2">
          <Bot className="h-4 w-4 text-indigo-400" />
          <h2 className="text-sm font-semibold text-slate-200">Message Flow Visualization</h2>
          <span className="rounded-full bg-indigo-500/10 px-2 py-0.5 text-[10px] text-indigo-300">
            Real-time
          </span>
        </div>

        <div className="relative flex items-center justify-center py-8">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-32 w-[90%] rounded-full bg-gradient-to-r from-indigo-500/5 via-purple-500/5 to-indigo-500/5 blur-3xl" />
          </div>

          <div className="relative flex items-center gap-1">
            {agentOrder.map((id, idx) => {
              const agent = agents.find((a) => a.id === id)!;
              const nextAgent = idx < agentOrder.length - 1 ? agentOrder[idx + 1] : null;
              const hasActiveNext =
                animating && nextAgent
                  ? (animating.from === id && animating.to === nextAgent) ||
                    (animating.from === nextAgent && animating.to === id)
                  : false;

              return (
                <React.Fragment key={id}>
                  <AgentNode
                    agent={agent}
                    isActive={isAgentActive(id)}
                    messageCount={getMessageCount(id)}
                  />
                  {nextAgent && (
                    <ConnectionArrow
                      from={id}
                      to={nextAgent}
                      hasActiveMessage={hasActiveNext}
                    />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {animating && (
          <div className="relative flex h-0 justify-center">
            <AnimatedMessage from={animating.from} to={animating.to} />
          </div>
        )}

        <div className="mt-6 rounded-xl border border-slate-700/30 bg-slate-900/50 p-3">
          <div className="mb-2 flex items-center gap-2">
            <Send className="h-3.5 w-3.5 text-slate-500" />
            <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">
              Latest Broadcast
            </span>
          </div>
          {messages[0] && (
            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-400">
                {agents.find((a) => a.id === messages[0].from)?.name}
              </span>
              <ArrowRight className="h-3 w-3 text-slate-600" />
              <span className="text-slate-400">
                {agents.find((a) => a.id === messages[0].to)?.name}
              </span>
              <span className="ml-1 text-slate-500">\u2014</span>
              <span className="truncate text-slate-500">{messages[0].content}</span>
            </div>
          )}
        </div>
      </div>

      <div className="rounded-2xl border border-slate-700/50 bg-slate-800/30 p-6 backdrop-blur-xl">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4 text-indigo-400" />
            <h2 className="text-sm font-semibold text-slate-200">Detailed Message Log</h2>
          </div>
          <div className="flex items-center gap-3 text-[11px] text-slate-500">
            <span className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-cyan-500" />
              Data
            </span>
            <span className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-violet-500" />
              Insight
            </span>
            <span className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-amber-500" />
              Command
            </span>
            <span className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              Response
            </span>
          </div>
        </div>
        <MessageLog messages={messages} />
      </div>

      <div className="rounded-2xl border border-slate-700/50 bg-slate-800/30 p-6 backdrop-blur-xl">
        <div className="flex items-center gap-2">
          <Network className="h-4 w-4 text-indigo-400" />
          <h2 className="text-sm font-semibold text-slate-200">Context Sharing & Collaboration</h2>
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {[
            {
              icon: '\u{1F9E0}',
              title: 'Shared Memory',
              desc: 'Agents access unified memory store for consistent context across all interactions',
              agents: 'All Agents',
            },
            {
              icon: '\u{1F504}',
              title: 'State Sync',
              desc: 'Real-time state synchronization ensures every agent operates with latest data',
              agents: 'Research \u2194 CRM',
            },
            {
              icon: '\u{1F3AF}',
              title: 'Goal Alignment',
              desc: 'Agents coordinate on shared objectives and dynamically adjust priorities',
              agents: 'Opportunity \u2194 Outreach',
            },
            {
              icon: '\u{1F517}',
              title: 'Data Linking',
              desc: 'Cross-referenced data from multiple sources enriches agent decision-making',
              agents: 'Research \u2194 Proposal',
            },
            {
              icon: '\u26A1',
              title: 'Event Triggers',
              desc: 'Agent actions trigger workflows in downstream agents automatically',
              agents: 'CRM \u2194 Proposal',
            },
            {
              icon: '\u{1F4CB}',
              title: 'Feedback Loop',
              desc: 'Continuous feedback between agents refines outputs and improves accuracy',
              agents: 'Outreach \u2194 Opportunity',
            },
          ].map((item) => (
            <div
              key={item.title}
              className="rounded-xl border border-slate-700/30 bg-slate-900/40 p-4 backdrop-blur-sm transition-all duration-300 hover:border-slate-600/50 hover:bg-slate-800/60"
            >
              <div className="mb-2 flex items-center gap-2">
                <span className="text-lg">{item.icon}</span>
                <span className="text-sm font-medium text-slate-200">{item.title}</span>
              </div>
              <p className="mb-2 text-xs text-slate-400">{item.desc}</p>
              <span className="rounded-full bg-indigo-500/10 px-2 py-0.5 text-[10px] text-indigo-300">
                {item.agents}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

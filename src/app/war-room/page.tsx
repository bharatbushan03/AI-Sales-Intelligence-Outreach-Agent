'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import {
  Play,
  RefreshCw,
  Zap,
  Brain,
  Target,
  MessageSquare,
  Database,
  FileText,
  TrendingUp,
  Activity,
  CheckCircle2,
  Clock,
  ArrowRight,
  BarChart3,
  Network,
  Lightbulb,
  Sparkles,
  LayoutDashboard,
  GitBranch,
  Radio,
  Search,
  X,
  Gauge,
  DollarSign,
  Timer,
} from 'lucide-react';

interface AgentStatus {
  name: string;
  role: string;
  icon: React.ReactNode;
  status: 'idle' | 'running' | 'completed' | 'error';
  currentTask: string;
  progress: number;
  insights: string[];
  memoryRetrieved: number;
  messagesShared: number;
  startTime: number | null;
  endTime: number | null;
  score: number;
}

interface WorkflowTimeline {
  timestamp: string;
  agent: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  details?: string;
}

interface AgentMessage {
  id: string;
  from: string;
  to: string;
  content: string;
  timestamp: string;
  type: 'insight' | 'request' | 'response' | 'alert';
}

const AGENT_CONFIGS = [
  {
    name: 'Research Agent',
    role: 'Market Intelligence',
    icon: <Brain className="h-5 w-5" />,
    color: 'from-violet-600 to-indigo-600',
    border: 'border-violet-500/30',
    bg: 'bg-violet-900/20',
  },
  {
    name: 'Opportunity Agent',
    role: 'Revenue Analysis',
    icon: <Target className="h-5 w-5" />,
    color: 'from-amber-600 to-orange-600',
    border: 'border-amber-500/30',
    bg: 'bg-amber-900/20',
  },
  {
    name: 'Outreach Agent',
    role: 'Engagement Strategy',
    icon: <MessageSquare className="h-5 w-5" />,
    color: 'from-emerald-600 to-teal-600',
    border: 'border-emerald-500/30',
    bg: 'bg-emerald-900/20',
  },
  {
    name: 'CRM Agent',
    role: 'Data Management',
    icon: <Database className="h-5 w-5" />,
    color: 'from-cyan-600 to-blue-600',
    border: 'border-cyan-500/30',
    bg: 'bg-cyan-900/20',
  },
  {
    name: 'Proposal Agent',
    role: 'Document Generation',
    icon: <FileText className="h-5 w-5" />,
    color: 'from-rose-600 to-pink-600',
    border: 'border-rose-500/30',
    bg: 'bg-rose-900/20',
  },
];

const STAGE_SCRIPTS: Record<
  string,
  Array<{ task: string; progress: number; insight?: string; memory: number; messages: number }>
> = {
  'Research Agent': [
    { task: 'Resolving company entity...', progress: 10, memory: 3, messages: 0 },
    { task: 'Analyzing website and tech stack...', progress: 25, memory: 8, messages: 1 },
    {
      task: 'Scanning for competitors...',
      progress: 45,
      memory: 18,
      messages: 2,
      insight: 'Found 5 direct competitors including Adyen, Square, PayPal',
    },
    {
      task: 'Evaluating market position...',
      progress: 65,
      memory: 32,
      messages: 4,
      insight: 'Market position: #3 in online payments with 8.2% share',
    },
    {
      task: 'Extracting growth signals...',
      progress: 85,
      memory: 50,
      messages: 6,
      insight: 'Key risk: Increasing churn in SMB segment (12% YoY)',
    },
    {
      task: 'Research complete - publishing findings',
      progress: 100,
      memory: 65,
      messages: 8,
      insight: 'Comprehensive profile: $18.4B revenue, 50M+ merchants',
    },
  ],
  'Opportunity Agent': [
    { task: 'Loading research outputs...', progress: 10, memory: 5, messages: 1 },
    {
      task: 'Identifying pain points...',
      progress: 30,
      memory: 15,
      messages: 3,
      insight: 'Stripe faces churn in mid-market due to pricing complexity',
    },
    {
      task: 'Scoring opportunity areas...',
      progress: 50,
      memory: 28,
      messages: 5,
      insight: 'Priority: Enterprise expansion, SMB retention, APAC growth',
    },
    {
      task: 'Calculating revenue potential...',
      progress: 70,
      memory: 45,
      messages: 8,
      insight: 'Our AI sales platform could save Stripe $12M annually in churn reduction',
    },
    {
      task: 'Cross-referencing with market trends...',
      progress: 85,
      memory: 60,
      messages: 10,
      insight: 'Timing: 3 triggers detected - CFO change, APAC expansion, new product launch',
    },
    {
      task: 'Opportunity scoring complete',
      progress: 100,
      memory: 78,
      messages: 14,
      insight: '$2.4M revenue potential identified across 12 opportunities',
    },
  ],
  'Outreach Agent': [
    { task: 'Analyzing opportunity data...', progress: 10, memory: 8, messages: 2 },
    {
      task: 'Building buyer personas...',
      progress: 30,
      memory: 20,
      messages: 5,
      insight: '6 key personas identified: CTO, VP Eng, Head of Sales Ops',
    },
    {
      task: 'Crafting messaging strategy...',
      progress: 50,
      memory: 35,
      messages: 8,
      insight: 'Value prop: "Reduce churn 40% with AI-powered retention"',
    },
    {
      task: 'Generating email sequences...',
      progress: 70,
      memory: 48,
      messages: 12,
      insight: '8 personalized templates created with A/B variants',
    },
    {
      task: 'Optimizing send timing...',
      progress: 85,
      memory: 55,
      messages: 15,
      insight: 'Optimal engagement: Tues/Thu 10-11am EST',
    },
    {
      task: 'Outreach campaign ready',
      progress: 100,
      memory: 62,
      messages: 18,
      insight: '3-channel campaign: Email + LinkedIn + Direct Mail',
    },
  ],
  'CRM Agent': [
    { task: 'Integrating opportunity data...', progress: 15, memory: 10, messages: 3 },
    {
      task: 'Creating lead records...',
      progress: 35,
      memory: 25,
      messages: 6,
      insight: '15 qualified leads created with enrichment data',
    },
    {
      task: 'Enriching with firmographics...',
      progress: 55,
      memory: 40,
      messages: 9,
      insight: 'All records enriched: revenue, tech stack, decision makers',
    },
    {
      task: 'Setting up pipeline stages...',
      progress: 75,
      memory: 55,
      messages: 12,
      insight: 'Pipeline: Prospecting > Discovery > Proposal > Negotiation',
    },
    {
      task: 'Configuring activity tracking...',
      progress: 90,
      memory: 65,
      messages: 15,
      insight: 'Automated follow-ups configured for each stage',
    },
    {
      task: 'CRM sync complete',
      progress: 100,
      memory: 75,
      messages: 18,
      insight: 'Pipeline worth $2.4M created and synced',
    },
  ],
  'Proposal Agent': [
    { task: 'Compiling research and insights...', progress: 10, memory: 15, messages: 3 },
    {
      task: 'Designing solution architecture...',
      progress: 30,
      memory: 35,
      messages: 7,
      insight: 'Solution: AI-powered churn reduction platform for Stripe',
    },
    {
      task: 'Building business case...',
      progress: 50,
      memory: 55,
      messages: 11,
      insight: '3-year ROI: 320% with break-even at 8 months',
    },
    {
      task: 'Calculating ROI projections...',
      progress: 70,
      memory: 70,
      messages: 15,
      insight: '$12M annual savings in churn reduction + $8M efficiency gains',
    },
    {
      task: 'Generating executive summary...',
      progress: 85,
      memory: 80,
      messages: 18,
      insight: 'Executive brief: "From $18B to $25B - Unlocking Stripe\'s Next Growth Phase"',
    },
    {
      task: 'Proposal package complete',
      progress: 100,
      memory: 95,
      messages: 22,
      insight: '12-slide deck + full proposal + ROI calculator generated',
    },
  ],
};

const MESSAGE_SCRIPTS: Record<string, Array<AgentMessage>> = {
  'Research Agent': [
    {
      id: 'r1',
      from: 'Research Agent',
      to: 'Opportunity Agent',
      content: 'Shared competitor landscape: 5 competitors identified. Market share data attached.',
      timestamp: '',
      type: 'insight',
    },
    {
      id: 'r2',
      from: 'Research Agent',
      to: 'CRM Agent',
      content: 'Company profile enriched: 15 data points added to lead records.',
      timestamp: '',
      type: 'response',
    },
    {
      id: 'r3',
      from: 'Research Agent',
      to: 'Proposal Agent',
      content: 'Market analysis complete. Revenue data and industry benchmarks ready for proposal.',
      timestamp: '',
      type: 'insight',
    },
  ],
  'Opportunity Agent': [
    {
      id: 'o1',
      from: 'Opportunity Agent',
      to: 'Outreach Agent',
      content:
        '12 opportunities scored. Priority: Enterprise expansion. Suggested messaging angles attached.',
      timestamp: '',
      type: 'response',
    },
    {
      id: 'o2',
      from: 'Opportunity Agent',
      to: 'Proposal Agent',
      content: 'Top 3 opportunities identified. Revenue potential: $2.4M. ROI data ready.',
      timestamp: '',
      type: 'insight',
    },
    {
      id: 'o3',
      from: 'Opportunity Agent',
      to: 'CRM Agent',
      content: 'Creating pipeline stages based on opportunity scores. High priority deals flagged.',
      timestamp: '',
      type: 'request',
    },
  ],
  'Outreach Agent': [
    {
      id: 'e1',
      from: 'Outreach Agent',
      to: 'CRM Agent',
      content: '8 email templates + 3 LinkedIn sequences ready. Attaching to contact records.',
      timestamp: '',
      type: 'response',
    },
    {
      id: 'e2',
      from: 'Outreach Agent',
      to: 'Proposal Agent',
      content: 'Messaging strategy aligned with proposal talking points.',
      timestamp: '',
      type: 'insight',
    },
  ],
  'CRM Agent': [
    {
      id: 'c1',
      from: 'CRM Agent',
      to: 'Proposal Agent',
      content:
        'Pipeline structure created with 15 opportunities. Stage data available for proposal.',
      timestamp: '',
      type: 'response',
    },
    {
      id: 'c2',
      from: 'CRM Agent',
      to: 'Research Agent',
      content: 'Requesting additional firmographics for 5 leads.',
      timestamp: '',
      type: 'request',
    },
  ],
  'Proposal Agent': [
    {
      id: 'p1',
      from: 'Proposal Agent',
      to: 'All Agents',
      content: 'Compiling final executive summary. Thank you for all inputs!',
      timestamp: '',
      type: 'alert',
    },
  ],
};

const rand = () => 800 + Math.floor(Math.random() * 700);

export default function SalesWarRoom() {
  const [isRunning, setIsRunning] = useState(false);
  const [targetCompany, setTargetCompany] = useState('');
  const [agents, setAgents] = useState<AgentStatus[]>(() =>
    AGENT_CONFIGS.map((a) => ({
      name: a.name,
      role: a.role,
      icon: a.icon,
      status: 'idle' as const,
      currentTask: 'Standing by',
      progress: 0,
      insights: [],
      memoryRetrieved: 0,
      messagesShared: 0,
      startTime: null,
      endTime: null,
      score: 90,
    })),
  );
  const [timeline, setTimeline] = useState<WorkflowTimeline[]>([]);
  const [messages, setMessages] = useState<AgentMessage[]>([]);
  const [totalInsights, setTotalInsights] = useState(0);
  const [totalMemory, setTotalMemory] = useState(0);
  const [totalMessages, setTotalMessages] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [activeMessageIndex, setActiveMessageIndex] = useState(-1);
  const [showMessageLog, setShowMessageLog] = useState(false);
  const [activeTab, setActiveTab] = useState<'warroom' | 'messages' | 'analytics'>('warroom');
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const messageTimerRef = useRef<NodeJS.Timeout | null>(null);
  const timelineRef = useRef<HTMLDivElement>(null);

  const addTimelineEntry = useCallback(
    (
      agent: string,
      message: string,
      type: 'info' | 'success' | 'warning' | 'error' = 'info',
      details?: string,
    ) => {
      const entry: WorkflowTimeline = {
        timestamp: new Date().toLocaleTimeString(),
        agent,
        message,
        type,
        details,
      };
      setTimeline((prev) => [entry, ...prev].slice(0, 50));
    },
    [],
  );

  const addMessage = useCallback((msg: AgentMessage) => {
    setMessages((prev) => [...prev, { ...msg, timestamp: new Date().toLocaleTimeString() }]);
    setTotalMessages((prev) => prev + 1);
  }, []);

  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => setElapsed((prev) => prev + 1), 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning]);

  useEffect(() => {
    if (timelineRef.current) {
      timelineRef.current.scrollTop = 0;
    }
  }, [timeline]);

  const executeStage = (agentIndex: number, agentName: string, stageIndex: number) => {
    const stage = STAGE_SCRIPTS[agentName];
    if (!stage || stageIndex >= stage.length) return;

    const step = stage[stageIndex];
    const msgType: 'info' | 'success' = stageIndex === stage.length - 1 ? 'success' : 'info';
    const msg = `${step.task}${step.insight ? ` — ${step.insight}` : ''}`;

    setAgents((prev) => {
      const next = [...prev];
      next[agentIndex] = {
        ...next[agentIndex],
        currentTask: step.task,
        progress: step.progress,
        memoryRetrieved: step.memory,
        messagesShared: step.messages,
        insights: step.insight
          ? [...new Set([...next[agentIndex].insights, step.insight])]
          : next[agentIndex].insights,
        status: stageIndex === stage.length - 1 ? ('completed' as const) : ('running' as const),
        endTime: stageIndex === stage.length - 1 ? Date.now() : null,
      };
      return next;
    });

    addTimelineEntry(agentName, msg, msgType, step.insight);
    if (step.insight) setTotalInsights((prev) => prev + 1);
    setTotalMemory(
      (prev) => prev + step.memory - (stageIndex > 0 ? (stage[stageIndex - 1]?.memory ?? 0) : 0),
    );
    setTotalMessages((prev) => prev + step.messages);

    if (stageIndex === stage.length - 1) {
      const score = 85 + Math.floor(rand() / 100);
      setAgents((prev) => {
        const next = [...prev];
        next[agentIndex].score = score;
        return next;
      });
      addTimelineEntry(
        'System',
        `${agentName} completed successfully (Score: ${score}/100)`,
        'success',
      );
      setTimeout(() => {
        addMessage({
          id: `${agentName}-complete`,
          from: agentName,
          to: 'System',
          content: `Task complete. Shared ${step.insight?.split(':')[0] || 'results'} with team.`,
          timestamp: '',
          type: 'response',
        });
      }, 300);
    }

    const delay = rand();
    setTimeout(() => {
      if (stageIndex < stage.length - 1) {
        executeStage(agentIndex, agentName, stageIndex + 1);
      }
    }, delay);
  };

  const agentMessageMap: Array<{
    fromIndex: number;
    fromName: string;
    toIndexes: number[];
    delay: number;
  }> = [
    { fromIndex: 0, fromName: 'Research Agent', toIndexes: [1, 3, 4], delay: 2500 },
    { fromIndex: 1, fromName: 'Opportunity Agent', toIndexes: [2, 3, 4], delay: 3500 },
    { fromIndex: 2, fromName: 'Outreach Agent', toIndexes: [3, 4], delay: 4000 },
    { fromIndex: 3, fromName: 'CRM Agent', toIndexes: [4, 0], delay: 3500 },
    { fromIndex: 4, fromName: 'Proposal Agent', toIndexes: [-1], delay: 5000 },
  ];

  const sendAgentMessages = (agentName: string) => {
    const script = MESSAGE_SCRIPTS[agentName];
    if (!script) return;
    script.forEach((msg, i) => {
      setTimeout(() => {
        addMessage({ ...msg, timestamp: new Date().toLocaleTimeString() });
      }, i * 1200);
    });
  };

  const runAgentSequence = (agentIndex: number) => {
    const agentName = AGENT_CONFIGS[agentIndex].name;
    const startDelay = agentIndex === 0 ? 200 : 800 + (agentIndex - 1) * 600;

    setTimeout(() => {
      setAgents((prev) => {
        const next = [...prev];
        next[agentIndex] = {
          ...next[agentIndex],
          status: 'running',
          startTime: Date.now(),
          currentTask: 'Initializing...',
        };
        return next;
      });
      addTimelineEntry(agentName, `Starting execution for ${targetCompany}`, 'info');
      executeStage(agentIndex, agentName, 0);
    }, startDelay);

    setTimeout(() => {
      sendAgentMessages(agentName);
    }, startDelay + 1000);
  };

  const launchWarRoom = async () => {
    if (!targetCompany.trim()) return;

    setIsRunning(true);
    setElapsed(0);
    setTimeline([]);
    setMessages([]);
    setTotalInsights(0);
    setTotalMemory(0);
    setTotalMessages(0);
    setActiveMessageIndex(-1);

    setAgents(
      AGENT_CONFIGS.map((a) => ({
        name: a.name,
        role: a.role,
        icon: a.icon,
        status: 'idle' as const,
        currentTask: 'Standing by',
        progress: 0,
        insights: [],
        memoryRetrieved: 0,
        messagesShared: 0,
        startTime: null,
        endTime: null,
        score: 90,
      })),
    );

    addTimelineEntry(
      'System',
      `🚀 Autonomous Sales War Room launched for ${targetCompany}`,
      'success',
    );
    addMessage({
      id: 'system-launch',
      from: 'System',
      to: 'All Agents',
      content: `War Room initiated for ${targetCompany}. Beginning intelligence gathering.`,
      timestamp: new Date().toLocaleTimeString(),
      type: 'alert',
    });

    for (let i = 0; i < AGENT_CONFIGS.length; i++) {
      runAgentSequence(i);
    }

    setTimeout(() => {
      addTimelineEntry('System', '🏆 All 5 agents completed — Executive summary ready', 'success');
      addMessage({
        id: 'system-done',
        from: 'System',
        to: 'All Agents',
        content: `War Room complete for ${targetCompany}. Full intelligence package available.`,
        timestamp: '',
        type: 'alert',
      });
      setIsRunning(false);
      setAgents((prev) => prev.map((a) => ({ ...a, status: 'completed' as const })));
    }, 18000);
  };

  const getStatusColor = (status: AgentStatus['status']) => {
    switch (status) {
      case 'running':
        return 'bg-emerald-500 shadow-lg shadow-emerald-500/30';
      case 'completed':
        return 'bg-blue-500 shadow-lg shadow-blue-500/20';
      case 'error':
        return 'bg-red-500 shadow-lg shadow-red-500/20';
      default:
        return 'bg-slate-600';
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const allDone = agents.every((a) => a.status === 'completed');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950/30 p-4 md:p-6">
      <div className="mx-auto max-w-7xl space-y-5">
        {/* === HEADER === */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Zap className="h-8 w-8 text-yellow-400" />
                <span className="absolute -top-1 -right-1 h-3 w-3 animate-ping rounded-full bg-yellow-400" />
              </div>
              <div>
                <h1 className="bg-gradient-to-r from-yellow-300 via-orange-400 to-red-400 bg-clip-text text-3xl font-black text-transparent md:text-4xl">
                  Autonomous Sales War Room
                </h1>
                <p className="text-sm text-slate-500">
                  Multi-Agent Intelligence System · Powered by Gemini
                </p>
              </div>
            </div>
          </div>
          <div className="hidden items-center gap-2 rounded-xl border border-slate-800 bg-slate-900/80 px-4 py-2 md:flex">
            <Clock className="h-4 w-4 text-slate-500" />
            <span className="font-mono text-lg font-bold text-slate-300">
              {formatTime(elapsed)}
            </span>
          </div>
        </div>

        {/* === CONTROLS === */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 shadow-xl shadow-black/20 backdrop-blur-xl">
          <div className="flex flex-col items-center gap-4 md:flex-row">
            <div className="relative w-full flex-1">
              <Search className="absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                placeholder="Enter company name — Stripe, Airbnb, Tesla, Shopify..."
                value={targetCompany}
                onChange={(e) => setTargetCompany(e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-800/80 py-3.5 pr-4 pl-12 text-lg text-slate-100 placeholder-slate-500 transition-all focus:border-yellow-500/50 focus:ring-2 focus:ring-yellow-500/50 focus:outline-none"
                disabled={isRunning}
                onKeyDown={(e) => e.key === 'Enter' && launchWarRoom()}
              />
              {targetCompany && !isRunning && (
                <button
                  onClick={() => setTargetCompany('')}
                  className="absolute top-1/2 right-4 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
            <button
              onClick={launchWarRoom}
              disabled={isRunning || !targetCompany.trim()}
              className={`flex w-full items-center justify-center gap-2 rounded-xl px-8 py-3.5 text-lg font-bold transition-all md:w-auto ${
                isRunning
                  ? 'cursor-not-allowed bg-slate-800 text-slate-400'
                  : 'bg-gradient-to-r from-yellow-500 to-orange-500 text-slate-950 shadow-lg shadow-yellow-500/20 hover:from-yellow-400 hover:to-orange-400 hover:shadow-yellow-500/30'
              }`}
            >
              {isRunning ? (
                <>
                  <RefreshCw className="h-5 w-5 animate-spin" /> Running...
                </>
              ) : allDone ? (
                <>
                  <Play className="h-5 w-5" /> Run Again
                </>
              ) : (
                <>
                  <Zap className="h-5 w-5" /> Launch War Room
                </>
              )}
            </button>
          </div>
        </div>

        {/* === TABS === */}
        <div className="flex w-fit gap-1 rounded-xl border border-slate-800 bg-slate-900/60 p-1">
          {[
            { id: 'warroom', label: 'War Room', icon: LayoutDashboard },
            { id: 'messages', label: 'Agent Messages', icon: MessageSquare },
            { id: 'analytics', label: 'Analytics', icon: BarChart3 },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-indigo-600 text-white shadow-lg'
                    : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
                }`}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* === TAB: WAR ROOM === */}
        {activeTab === 'warroom' && (
          <>
            {/* === LIVE STATS === */}
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
              <div className="relative overflow-hidden rounded-xl border border-indigo-700/30 bg-gradient-to-br from-indigo-900/50 to-indigo-800/20 p-4">
                <div className="absolute top-0 right-0 h-20 w-20 translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-500/10" />
                <div className="flex items-center gap-3">
                  <Brain className="h-6 w-6 text-indigo-400" />
                  <div>
                    <p className="text-xs text-indigo-300/80">Total Insights</p>
                    <p className="text-2xl font-bold text-indigo-100 tabular-nums">
                      {totalInsights}
                    </p>
                  </div>
                </div>
              </div>
              <div className="relative overflow-hidden rounded-xl border border-purple-700/30 bg-gradient-to-br from-purple-900/50 to-purple-800/20 p-4">
                <div className="absolute top-0 right-0 h-20 w-20 translate-x-1/2 -translate-y-1/2 rounded-full bg-purple-500/10" />
                <div className="flex items-center gap-3">
                  <Database className="h-6 w-6 text-purple-400" />
                  <div>
                    <p className="text-xs text-purple-300/80">Memory Retrieved</p>
                    <p className="text-2xl font-bold text-purple-100 tabular-nums">
                      {totalMemory}{' '}
                      <span className="text-sm font-normal text-purple-300/60">items</span>
                    </p>
                  </div>
                </div>
              </div>
              <div className="relative overflow-hidden rounded-xl border border-emerald-700/30 bg-gradient-to-br from-emerald-900/50 to-emerald-800/20 p-4">
                <div className="absolute top-0 right-0 h-20 w-20 translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-500/10" />
                <div className="flex items-center gap-3">
                  <Radio className="h-6 w-6 text-emerald-400" />
                  <div>
                    <p className="text-xs text-emerald-300/80">Messages Shared</p>
                    <p className="text-2xl font-bold text-emerald-100 tabular-nums">
                      {totalMessages}
                    </p>
                  </div>
                </div>
              </div>
              <div className="relative overflow-hidden rounded-xl border border-amber-700/30 bg-gradient-to-br from-amber-900/50 to-amber-800/20 p-4">
                <div className="absolute top-0 right-0 h-20 w-20 translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-500/10" />
                <div className="flex items-center gap-3">
                  <Gauge className="h-6 w-6 text-amber-400" />
                  <div>
                    <p className="text-xs text-amber-300/80">Agents Active</p>
                    <p className="text-2xl font-bold text-amber-100 tabular-nums">
                      {agents.filter((a) => a.status === 'running').length}
                      <span className="text-sm font-normal text-amber-300/60">
                        /{agents.length}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* === AGENT CARDS === */}
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
              {agents.map((agent, index) => {
                const isActive = agent.status === 'running';
                const isCompleted = agent.status === 'completed';
                const Icon = AGENT_CONFIGS[index];
                return (
                  <div
                    key={agent.name}
                    className={`group relative rounded-xl border bg-slate-900/80 p-4 backdrop-blur-sm transition-all duration-500 hover:scale-[1.02] ${
                      isActive
                        ? Icon.border + ' shadow-lg shadow-black/30'
                        : isCompleted
                          ? 'border-blue-500/30'
                          : 'border-slate-800'
                    }`}
                  >
                    {isActive && (
                      <div className="pointer-events-none absolute inset-0 animate-pulse rounded-xl bg-gradient-to-br from-transparent via-emerald-500/5 to-transparent" />
                    )}
                    <div className="mb-3 flex items-start justify-between">
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`rounded-lg p-2 ${isActive ? 'bg-emerald-500/20' : isCompleted ? 'bg-blue-500/20' : 'bg-slate-800/50'}`}
                        >
                          <div
                            className={
                              isActive
                                ? 'text-emerald-400'
                                : isCompleted
                                  ? 'text-blue-400'
                                  : 'text-slate-500'
                            }
                          >
                            {agent.icon}
                          </div>
                        </div>
                        <div>
                          <h3 className="text-sm font-semibold text-slate-100">{agent.name}</h3>
                          <p className="text-[10px] text-slate-500">{agent.role}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`h-2.5 w-2.5 rounded-full ${getStatusColor(agent.status)} ${isActive ? 'animate-pulse' : ''}`}
                        />
                        {isCompleted && <CheckCircle2 className="h-3.5 w-3.5 text-blue-400" />}
                      </div>
                    </div>

                    <div className="space-y-2.5">
                      <div className="flex items-center gap-1.5">
                        <Activity className="h-3 w-3 shrink-0 text-slate-500" />
                        <p className="truncate text-xs text-slate-400">{agent.currentTask}</p>
                      </div>

                      <div>
                        <div className="mb-1 flex justify-between text-[10px] text-slate-600">
                          <span>Progress</span>
                          <span className="font-mono">{agent.progress}%</span>
                        </div>
                        <div className="h-1.5 overflow-hidden rounded-full bg-slate-800">
                          <div
                            className={`h-full rounded-full transition-all duration-700 ease-out ${
                              isActive
                                ? 'bg-gradient-to-r from-emerald-500 to-emerald-400'
                                : isCompleted
                                  ? 'bg-gradient-to-r from-blue-500 to-cyan-400'
                                  : 'bg-slate-700'
                            }`}
                            style={{ width: `${agent.progress}%` }}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-1.5">
                        <div className="rounded-lg bg-slate-800/40 p-2">
                          <p className="text-[9px] tracking-wider text-slate-500 uppercase">
                            Memory
                          </p>
                          <p className="text-xs font-semibold text-slate-300">
                            {agent.memoryRetrieved}
                          </p>
                        </div>
                        <div className="rounded-lg bg-slate-800/40 p-2">
                          <p className="text-[9px] tracking-wider text-slate-500 uppercase">
                            Messages
                          </p>
                          <p className="text-xs font-semibold text-slate-300">
                            {agent.messagesShared}
                          </p>
                        </div>
                      </div>

                      {agent.insights.length > 0 && (
                        <div className="pt-1">
                          <div className="space-y-1">
                            {agent.insights.slice(-2).map((insight, i) => (
                              <div
                                key={i}
                                className="flex items-start gap-1.5 rounded-lg border border-slate-700/50 bg-slate-800/30 p-2 text-[10px] text-slate-400"
                              >
                                <Sparkles className="mt-0.5 h-3 w-3 shrink-0 text-yellow-500" />
                                <span className="line-clamp-2">{insight}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {agent.status === 'completed' && agent.score && (
                      <div className="mt-2.5 flex items-center justify-between border-t border-slate-800 pt-2.5">
                        <span className="text-[10px] text-slate-500">Performance</span>
                        <span className="text-xs font-bold text-emerald-400">{agent.score}%</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* === SYSTEM ARCHITECTURE VISUALIZATION === */}
            {!isRunning && !allDone && timeline.length === 0 && (
              <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-6 backdrop-blur-sm">
                <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-slate-200">
                  <Network className="h-5 w-5 text-indigo-400" />
                  Agent Architecture
                </h2>
                <div className="relative py-6">
                  <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8">
                    {AGENT_CONFIGS.map((agent, i) => (
                      <div key={agent.name} className="flex flex-col items-center gap-2">
                        <div
                          className={`h-14 w-14 rounded-xl bg-gradient-to-br ${agent.color} flex items-center justify-center shadow-lg`}
                        >
                          {agent.icon}
                        </div>
                        <span className="text-center text-[10px] text-slate-500">
                          {agent.name.split(' ')[0]}
                        </span>
                        {i < AGENT_CONFIGS.length - 1 && (
                          <div
                            className="absolute hidden text-slate-600 md:block"
                            style={{ left: `${((i + 1) / AGENT_CONFIGS.length) * 100}%` }}
                          >
                            <ArrowRight className="h-4 w-4" />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  <div className="mt-6 flex justify-center gap-2">
                    <div className="flex items-center gap-1 text-[10px] text-slate-600">
                      <span className="h-2 w-2 rounded-full bg-emerald-500" /> Active
                    </div>
                    <div className="flex items-center gap-1 text-[10px] text-slate-600">
                      <span className="h-2 w-2 rounded-full bg-blue-500" /> Complete
                    </div>
                    <div className="flex items-center gap-1 text-[10px] text-slate-600">
                      <span className="h-2 w-2 rounded-full bg-slate-600" /> Idle
                    </div>
                  </div>
                </div>
                <p className="text-center text-xs text-slate-600">
                  Enter a company name and launch the War Room to see multi-agent intelligence in
                  action
                </p>
              </div>
            )}

            {/* === TIMELINE === */}
            <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-5 backdrop-blur-sm">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="flex items-center gap-2 text-lg font-semibold text-slate-100">
                  <Activity className="h-5 w-5 text-yellow-500" />
                  Live Workflow Timeline
                </h2>
                <span className="font-mono text-xs text-slate-500">{timeline.length} events</span>
              </div>
              <div
                ref={timelineRef}
                className="max-h-80 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent space-y-1.5 overflow-y-auto"
              >
                {timeline.length === 0 ? (
                  <div className="py-10 text-center text-slate-600">
                    <Activity className="mx-auto mb-2 h-8 w-8 opacity-50" />
                    <p className="text-sm">Timeline will populate with live agent activity</p>
                  </div>
                ) : (
                  timeline.map((entry, index) => (
                    <div
                      key={index}
                      className={`flex items-start gap-2.5 rounded-lg p-2.5 transition-all ${
                        entry.type === 'success'
                          ? 'border border-emerald-800/20 bg-emerald-900/15'
                          : entry.type === 'error'
                            ? 'border border-red-800/20 bg-red-900/15'
                            : entry.type === 'warning'
                              ? 'border border-yellow-800/20 bg-yellow-900/15'
                              : 'border border-slate-700/20 bg-slate-800/30'
                      }`}
                    >
                      <span className="w-16 shrink-0 font-mono text-[10px] text-slate-600">
                        {entry.timestamp}
                      </span>
                      <span
                        className={`shrink-0 text-xs font-semibold ${
                          entry.type === 'success'
                            ? 'text-emerald-400'
                            : entry.type === 'error'
                              ? 'text-red-400'
                              : entry.type === 'warning'
                                ? 'text-yellow-400'
                                : 'text-slate-300'
                        }`}
                      >
                        {entry.agent}:
                      </span>
                      <span className="text-xs leading-relaxed text-slate-500">
                        {entry.message}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </>
        )}

        {/* === TAB: AGENT MESSAGES === */}
        {activeTab === 'messages' && (
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-5 backdrop-blur-sm lg:col-span-2">
              <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-slate-100">
                <Radio className="h-5 w-5 text-emerald-500" />
                Agent Communication Flow
                <span className="text-xs font-normal text-slate-500">
                  ({messages.length} messages)
                </span>
              </h2>

              {messages.length === 0 ? (
                <div className="py-12 text-center text-slate-600">
                  <Radio className="mx-auto mb-3 h-10 w-10 opacity-30" />
                  <p className="text-sm">
                    Agent-to-agent messages will appear here during execution
                  </p>
                </div>
              ) : (
                <div className="max-h-[500px] space-y-3 overflow-y-auto">
                  {messages.map((msg, i) => {
                    const fromColor = AGENT_CONFIGS.find((a) => a.name === msg.from);
                    const isAlert = msg.type === 'alert';
                    const isBroadcast = msg.to === 'All Agents';
                    return (
                      <div
                        key={msg.id || i}
                        className={`rounded-xl border p-3 transition-all ${
                          isAlert
                            ? 'border-yellow-700/30 bg-yellow-900/10'
                            : `border-slate-700/30 bg-slate-800/30 hover:border-slate-600/50`
                        }`}
                      >
                        <div className="mb-2 flex items-center justify-between">
                          <div className="flex items-center gap-2 text-xs">
                            <span
                              className={`font-semibold ${fromColor ? 'text-indigo-300' : 'text-yellow-400'}`}
                            >
                              {msg.from}
                            </span>
                            <ArrowRight className="h-3 w-3 text-slate-600" />
                            <span className="text-slate-400">{msg.to}</span>
                            {isBroadcast && (
                              <span className="rounded bg-indigo-900/50 px-1.5 py-0.5 text-[9px] text-indigo-300">
                                Broadcast
                              </span>
                            )}
                          </div>
                          <span className="font-mono text-[10px] text-slate-600">
                            {msg.timestamp}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400">{msg.content}</p>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Message Flow Visualization */}
            <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-5 backdrop-blur-sm">
              <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-slate-100">
                <GitBranch className="h-5 w-5 text-indigo-500" />
                Communication Map
              </h2>
              <div className="space-y-3">
                {AGENT_CONFIGS.map((agent, i) => {
                  const agentMsgs = messages.filter((m) => m.from === agent.name);
                  return (
                    <div key={agent.name} className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <div
                          className={`h-2 w-2 rounded-full ${agentMsgs.length > 0 ? 'bg-emerald-500' : 'bg-slate-700'}`}
                        />
                        <span className="text-xs font-medium text-slate-300">{agent.name}</span>
                        <span className="text-[10px] text-slate-600">
                          ({agentMsgs.length} msgs)
                        </span>
                      </div>
                      {agentMsgs.length > 0 && (
                        <div className="ml-4 space-y-1 border-l border-slate-700 pl-3">
                          {agentMsgs.map((msg) => (
                            <div
                              key={msg.id}
                              className="flex items-center gap-1 text-[10px] text-slate-500"
                            >
                              <ArrowRight className="h-2.5 w-2.5 shrink-0 text-slate-600" />
                              <span className="truncate">{msg.to}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {messages.length > 0 && (
                <div className="mt-6 border-t border-slate-800 pt-4">
                  <p className="mb-2 text-xs text-slate-500">Message Types</p>
                  <div className="grid grid-cols-2 gap-2 text-[10px]">
                    <div className="rounded-lg bg-slate-800/30 p-2 text-center">
                      <span className="font-bold text-indigo-400">
                        {messages.filter((m) => m.type === 'insight').length}
                      </span>
                      <p className="text-slate-600">Insights</p>
                    </div>
                    <div className="rounded-lg bg-slate-800/30 p-2 text-center">
                      <span className="font-bold text-emerald-400">
                        {messages.filter((m) => m.type === 'response').length}
                      </span>
                      <p className="text-slate-600">Responses</p>
                    </div>
                    <div className="rounded-lg bg-slate-800/30 p-2 text-center">
                      <span className="font-bold text-amber-400">
                        {messages.filter((m) => m.type === 'request').length}
                      </span>
                      <p className="text-slate-600">Requests</p>
                    </div>
                    <div className="rounded-lg bg-slate-800/30 p-2 text-center">
                      <span className="font-bold text-yellow-400">
                        {messages.filter((m) => m.type === 'alert').length}
                      </span>
                      <p className="text-slate-600">Alerts</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* === TAB: ANALYTICS === */}
        {activeTab === 'analytics' && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
              <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-4 backdrop-blur-sm">
                <div className="mb-2 flex items-center gap-2 text-xs text-slate-500">
                  <Timer className="h-4 w-4" /> Execution Time
                </div>
                <p className="text-xl font-bold text-slate-100">{formatTime(elapsed)}</p>
              </div>
              <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-4 backdrop-blur-sm">
                <div className="mb-2 flex items-center gap-2 text-xs text-slate-500">
                  <Brain className="h-4 w-4" /> Avg Agent Score
                </div>
                <p className="text-xl font-bold text-emerald-400">
                  {agents.reduce((s, a) => s + a.score, 0) / agents.length}%
                </p>
              </div>
              <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-4 backdrop-blur-sm">
                <div className="mb-2 flex items-center gap-2 text-xs text-slate-500">
                  <Database className="h-4 w-4" /> Total Memory
                </div>
                <p className="text-xl font-bold text-purple-400">{totalMemory} items</p>
              </div>
              <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-4 backdrop-blur-sm">
                <div className="mb-2 flex items-center gap-2 text-xs text-slate-500">
                  <DollarSign className="h-4 w-4" /> Pipeline Value
                </div>
                <p className="text-xl font-bold text-amber-400">$2.4M</p>
              </div>
            </div>

            {/* Agent Performance Chart */}
            <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-5 backdrop-blur-sm">
              <h3 className="mb-4 text-sm font-semibold text-slate-200">
                Agent Performance Metrics
              </h3>
              <div className="space-y-3">
                {agents.map((agent, i) => {
                  const color = AGENT_CONFIGS[i].color;
                  return (
                    <div key={agent.name} className="flex items-center gap-3">
                      <span className="w-24 shrink-0 text-xs text-slate-400">{agent.name}</span>
                      <div className="h-3 flex-1 overflow-hidden rounded-full bg-slate-800">
                        <div
                          className={`h-full rounded-full bg-gradient-to-r ${color} transition-all duration-1000`}
                          style={{
                            width: `${agent.status === 'completed' ? 100 : agent.status === 'running' ? agent.progress : 0}%`,
                          }}
                        />
                      </div>
                      <span className="w-8 text-right font-mono text-xs text-slate-500">
                        {agent.status === 'completed'
                          ? '100%'
                          : agent.status === 'running'
                            ? `${agent.progress}%`
                            : '0%'}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Insights Generated */}
            <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-5 backdrop-blur-sm">
              <h3 className="mb-3 text-sm font-semibold text-slate-200">
                Key Intelligence Highlights
              </h3>
              <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                {agents
                  .flatMap((a) => a.insights)
                  .slice(0, 10)
                  .map((insight, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-2 rounded-lg border border-slate-700/30 bg-slate-800/30 p-3"
                    >
                      <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-yellow-500" />
                      <span className="text-xs text-slate-400">{insight}</span>
                    </div>
                  ))}
                {agents.flatMap((a) => a.insights).length === 0 && (
                  <p className="col-span-2 py-6 text-center text-xs text-slate-600">
                    Run the War Room to generate intelligence
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* === EXECUTIVE SUMMARY Banner === */}
        {allDone && (
          <div className="rounded-xl border border-indigo-700/30 bg-gradient-to-r from-blue-900/50 via-indigo-900/50 to-purple-900/50 p-6 backdrop-blur-sm">
            <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600">
                  <CheckCircle2 className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-100">
                    Executive Intelligence Package Ready
                  </h3>
                  <p className="text-sm text-slate-400">
                    Complete multi-agent analysis for {targetCompany}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-indigo-500">
                  <FileText className="h-4 w-4" /> View Report
                </button>
                <button className="flex items-center gap-2 rounded-lg bg-slate-800 px-4 py-2 text-sm font-semibold text-slate-300 transition-all hover:bg-slate-700">
                  <Download className="h-4 w-4" /> Export
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {typeof document !== 'undefined' && (
        <style>{`
          .scrollbar-thin::-webkit-scrollbar { width: 4px; }
          .scrollbar-thin::-webkit-scrollbar-track { background: transparent; }
          .scrollbar-thin::-webkit-scrollbar-thumb { background: #334155; border-radius: 4px; }
          .scrollbar-thin::-webkit-scrollbar-thumb:hover { background: #475569; }
        `}</style>
      )}
    </div>
  );
}

function Download(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  );
}

'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  Brain,
  Target,
  TrendingUp,
  Shield,
  Lightbulb,
  Send,
  Bot,
  User,
  Sparkles,
  Loader2,
  ChevronRight,
  Globe,
  Users,
  Mail,
  Database,
  FileText,
  BarChart3,
  AlertTriangle,
  CheckCircle2,
} from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface AgentKnowledge {
  id: string;
  name: string;
  icon: React.ElementType;
  description: string;
  color: string;
}

const AGENT_KNOWLEDGE: AgentKnowledge[] = [
  {
    id: 'research',
    name: 'Research',
    icon: Globe,
    description: 'Market intelligence & competitor analysis',
    color: 'from-cyan-500 to-blue-600',
  },
  {
    id: 'opportunity',
    name: 'Opportunity',
    icon: Target,
    description: 'Lead scoring & pipeline insights',
    color: 'from-violet-500 to-purple-600',
  },
  {
    id: 'outreach',
    name: 'Outreach',
    icon: Mail,
    description: 'Engagement & conversion patterns',
    color: 'from-pink-500 to-rose-600',
  },
  {
    id: 'crm',
    name: 'CRM',
    icon: Database,
    description: 'Historical deal & customer data',
    color: 'from-amber-500 to-orange-600',
  },
  {
    id: 'proposal',
    name: 'Proposal',
    icon: FileText,
    description: 'Past proposals & win/loss analysis',
    color: 'from-emerald-500 to-teal-600',
  },
];

const SUGGESTED_QUESTIONS = [
  'Should we target Stripe as a strategic account?',
  'What is our optimal pricing strategy for enterprise?',
  'Which market segment offers the best ROI right now?',
  'How should we position against our top competitor?',
  'What is our biggest revenue growth bottleneck?',
];

function generateResponse(question: string): string {
  const responses: Record<string, string> = {
    default: `## Strategic Analysis

### Market Assessment
The current market landscape indicates a **high-growth trajectory** with several key tailwinds supporting expansion. Your positioning aligns well with emerging demand patterns, particularly in the mid-market segment where adoption rates have increased **34% year-over-year**. Competitor saturation remains moderate, giving you a **6-12 month window** to capture mindshare before consolidation accelerates.

**Key Market Signals:**
- TAM expansion of $2.4B projected over next 18 months
- Buyer intent signals up 28% in your ideal customer profile
- Regulatory tailwinds favoring your solution category

### Risk Assessment
| Risk Factor | Severity | Mitigation |
| :--- | :--- | :--- |
| Market concentration | Medium | Diversify vertical focus |
| Competitor pricing pressure | Low | Differentiate on value, not price |
| Talent acquisition | High | Expand remote hiring pipeline |
| Technology disruption | Low | Maintain R&D investment at 15%+ |

The **primary risk** centers on execution capacity rather than market viability. Your burn multiple of 1.2x is healthy but requires disciplined capital allocation.

### Revenue Potential
Based on your current ACV of **$47K** and historical conversion patterns:

> **12-Month Projection:** $4.8M - $6.2M in new ARR
> **Expansion Revenue:** $1.1M - $1.6M from existing accounts
> **Total Addressable:** $42M within current ICP

The **highest-leverage opportunity** lies in your enterprise segment where deal sizes are 3.4x larger but conversion rates are only 60% of your mid-market. Investing in executive relationships and proof-of-value programs could unlock substantial upside.

### Recommended Actions

1.  **Accelerate enterprise go-to-market** — Hire two enterprise AEs and invest in executive engagement programs. Expected impact: +$1.8M ARR within 6 months.
2.  **Launch competitive win campaign** — Your win rate against incumbents is 67% when you reach evaluation stage. Build battle cards and a dedicated enablement program.
3.  **Implement expansion motion** — Only 22% of customers have adopted your platform beyond initial use case. Deploy a customer success playbook targeting multi-product adoption.
4.  **Optimize pricing packaging** — Introduce a premium tier with advanced features to capture willingness-to-pay from power users without sacrificing mid-market conversion.

> *"The best time to plant a tree was 20 years ago. The second best time is now. Your market window is open — but it won't stay open forever."*`,
  };

  for (const [key, response] of Object.entries(responses)) {
    if (key !== 'default' && question.toLowerCase().includes(key)) {
      return response;
    }
  }

  return responses.default;
}

function TypingIndicator() {
  return (
    <div className="flex items-start gap-3 px-1">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/20">
        <Bot className="h-5 w-5 text-white" />
      </div>
      <div className="flex-1">
        <div className="mb-1 flex items-center gap-2">
          <span className="text-sm font-semibold text-slate-200">Executive Copilot</span>
          <span className="rounded-full bg-indigo-500/10 px-2 py-0.5 text-[10px] font-medium text-indigo-400">
            AI
          </span>
        </div>
        <div className="flex items-center gap-2 rounded-2xl rounded-tl-sm border border-slate-800/50 bg-slate-900/60 px-5 py-4 backdrop-blur-sm">
          <Loader2 className="h-4 w-4 animate-spin text-indigo-400" />
          <span className="text-sm text-slate-400">Analyzing your question...</span>
        </div>
      </div>
    </div>
  );
}

function AgentKnowledgeBar({ agents }: { agents: typeof AGENT_KNOWLEDGE }) {
  return (
    <div className="flex flex-wrap gap-2">
      {agents.map((agent) => {
        const Icon = agent.icon;
        return (
          <div
            key={agent.id}
            className="group flex items-center gap-1.5 rounded-full border border-slate-800/60 bg-slate-900/40 px-3 py-1.5 text-xs text-slate-400 transition-all hover:border-slate-700 hover:bg-slate-800/40 hover:text-slate-300"
          >
            <Icon className="h-3 w-3" />
            <span>{agent.name}</span>
          </div>
        );
      })}
    </div>
  );
}

function MarkdownRenderer({ content }: { content: string }) {
  const lines = content.split('\n');
  const elements: React.ReactNode[] = [];
  let inList = false;
  let inTable = false;
  let inCodeBlock = false;
  let codeBlockContent: string[] = [];
  let listItems: React.ReactNode[] = [];
  let tableRows: React.ReactNode[] = [];

  const flushList = (key: string) => {
    if (listItems.length > 0) {
      elements.push(
        <ul key={key} className="my-3 space-y-1.5 pl-6">
          {listItems}
        </ul>,
      );
      listItems = [];
    }
  };

  const flushTable = (key: string) => {
    if (tableRows.length > 0) {
      elements.push(
        <div
          key={key}
          className="my-4 overflow-x-auto rounded-xl border border-slate-800 bg-slate-900/40"
        >
          <table className="w-full text-left text-sm">{tableRows}</table>
        </div>,
      );
      tableRows = [];
    }
  };

  let listKey = 0;
  let tableKey = 0;

  lines.forEach((line, i) => {
    const trimmed = line.trim();
    const key = `line-${i}`;

    if (trimmed.startsWith('```')) {
      if (inCodeBlock) {
        elements.push(
          <pre
            key={key}
            className="my-3 overflow-x-auto rounded-xl border border-slate-800 bg-slate-950 p-4 font-mono text-sm text-slate-300"
          >
            {codeBlockContent.join('\n')}
          </pre>,
        );
        codeBlockContent = [];
        inCodeBlock = false;
      } else {
        inCodeBlock = true;
      }
      return;
    }

    if (inCodeBlock) {
      codeBlockContent.push(line);
      return;
    }

    if (trimmed.startsWith('|') && trimmed.endsWith('|')) {
      if (trimmed.includes('---')) {
        return;
      }
      inTable = true;
      const cells = trimmed
        .split('|')
        .filter(Boolean)
        .map((c) => c.trim());
      const isHeader = tableRows.length === 0;
      const RowTag = isHeader ? 'thead' : 'tr';
      const CellTag = isHeader ? 'th' : 'td';
      tableRows.push(
        <RowTag
          key={`table-row-${i}`}
          className={isHeader ? 'border-b border-slate-800' : 'border-b border-slate-800/50'}
        >
          <tr>
            {cells.map((cell, ci) => (
              <CellTag
                key={`cell-${ci}`}
                className={`px-4 py-3 text-xs ${isHeader ? 'font-semibold tracking-wider text-slate-400 uppercase' : 'text-slate-300'}`}
              >
                {cell}
              </CellTag>
            ))}
          </tr>
        </RowTag>,
      );
      return;
    }

    if (inTable && trimmed === '') {
      inTable = false;
      flushTable(`table-${tableKey++}`);
      return;
    }

    if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      flushTable(`table-${tableKey++}`);
      inList = true;
      const itemText = trimmed.replace(/^[-*]\s/, '');
      listItems.push(
        <li key={`list-${i}`} className="flex items-start gap-2 text-sm text-slate-300">
          <ChevronRight className="mt-0.5 h-3.5 w-3.5 shrink-0 text-indigo-400" />
          <span>{renderInlineMarkdown(itemText)}</span>
        </li>,
      );
      return;
    }

    if (trimmed.match(/^\d+\.\s/)) {
      flushTable(`table-${tableKey++}`);
      inList = true;
      const itemText = trimmed.replace(/^\d+\.\s/, '');
      listItems.push(
        <li key={`list-${i}`} className="flex items-start gap-2 text-sm text-slate-300">
          <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-indigo-500/10 text-[10px] font-bold text-indigo-400">
            {listItems.length + 1}
          </span>
          <span>{renderInlineMarkdown(itemText)}</span>
        </li>,
      );
      return;
    }

    if (inList && trimmed === '') {
      inList = false;
      flushList(`list-${listKey++}`);
      return;
    }

    if (trimmed === '') {
      return;
    }

    flushTable(`table-${tableKey++}`);
    flushList(`list-${listKey++}`);

    if (trimmed.startsWith('### ')) {
      elements.push(
        <h3 key={key} className="mt-6 mb-2 text-base font-semibold text-white">
          {renderInlineMarkdown(trimmed.replace('### ', ''))}
        </h3>,
      );
    } else if (trimmed.startsWith('## ')) {
      elements.push(
        <h2 key={key} className="mt-7 mb-3 text-lg font-bold text-white">
          {renderInlineMarkdown(trimmed.replace('## ', ''))}
        </h2>,
      );
    } else if (trimmed.startsWith('> ')) {
      elements.push(
        <blockquote
          key={key}
          className="my-4 border-l-2 border-indigo-500 bg-gradient-to-r from-indigo-500/5 to-transparent py-3 pr-4 pl-5 text-sm leading-relaxed text-slate-300 italic"
        >
          {renderInlineMarkdown(trimmed.replace('> ', ''))}
        </blockquote>,
      );
    } else if (trimmed.startsWith('---')) {
      elements.push(<hr key={key} className="my-6 border-slate-800" />);
    } else {
      elements.push(
        <p key={key} className="my-2 text-sm leading-relaxed text-slate-300">
          {renderInlineMarkdown(trimmed)}
        </p>,
      );
    }
  });

  if (inCodeBlock && codeBlockContent.length > 0) {
    elements.push(
      <pre
        key="code-end"
        className="my-3 overflow-x-auto rounded-xl border border-slate-800 bg-slate-950 p-4 font-mono text-sm text-slate-300"
      >
        {codeBlockContent.join('\n')}
      </pre>,
    );
  }
  if (inList) {
    flushList(`list-end`);
  }
  if (inTable) {
    flushTable(`table-end`);
  }

  return <div className="space-y-1">{elements}</div>;
}

function renderInlineMarkdown(text: string): React.ReactNode {
  const parts = text.split(/(\*\*.*?\*\*|`.*?`)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={i} className="font-semibold text-white">
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith('`') && part.endsWith('`')) {
      return (
        <code
          key={i}
          className="rounded-md bg-slate-800 px-1.5 py-0.5 font-mono text-xs text-indigo-300"
        >
          {part.slice(1, -1)}
        </code>
      );
    }
    return part;
  });
}

export default function ExecutiveCopilot() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showKnowledge, setShowKnowledge] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    const question = input.trim();
    if (!question || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: question,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // Simulate analysis delay
    await new Promise((resolve) => setTimeout(resolve, 1500 + Math.random() * 1000));

    const response = generateResponse(question);
    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: response,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, assistantMessage]);
    setIsLoading(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleSuggestedQuestion = (question: string) => {
    setInput(question);
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  };

  return (
    <div className="mx-auto flex h-[calc(100vh-6rem)] max-w-6xl flex-col">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 shadow-lg shadow-indigo-500/20">
            <Brain className="h-6 w-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-white">Executive Copilot</h1>
              <span className="rounded-full bg-gradient-to-r from-indigo-500/20 to-purple-500/20 px-2.5 py-0.5 text-[10px] font-semibold text-indigo-300">
                AI Strategy Consultant
              </span>
            </div>
            <p className="text-sm text-slate-400">
              Ask strategic questions. Get actionable intelligence.
            </p>
          </div>
        </div>
        <button
          onClick={() => setShowKnowledge(!showKnowledge)}
          className={`hidden items-center gap-2 rounded-xl border px-4 py-2 text-xs font-medium transition-all sm:flex ${
            showKnowledge
              ? 'border-indigo-500/30 bg-indigo-500/10 text-indigo-300'
              : 'border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-300'
          }`}
        >
          <Sparkles className="h-3.5 w-3.5" />
          Knowledge Sources
        </button>
      </div>

      <div className="flex flex-1 gap-4 overflow-hidden">
        {/* Main Chat Area */}
        <div className="flex flex-1 flex-col overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/40 backdrop-blur-sm">
          {/* Messages */}
          <div className="flex-1 scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-slate-900 overflow-y-auto p-4">
            {messages.length === 0 && !isLoading ? (
              <div className="flex h-full flex-col items-center justify-center px-4 text-center">
                <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-indigo-500/20 via-purple-500/20 to-pink-500/20">
                  <Bot className="h-10 w-10 text-indigo-400" />
                </div>
                <h2 className="mb-2 text-xl font-bold text-white">
                  What's your strategic question?
                </h2>
                <p className="mb-8 max-w-md text-sm text-slate-400">
                  Ask me about market opportunities, competitive strategy, revenue optimization, or
                  any business challenge you're facing.
                </p>
                <div className="grid w-full max-w-lg gap-2 sm:grid-cols-2">
                  {SUGGESTED_QUESTIONS.map((q, i) => (
                    <button
                      key={i}
                      onClick={() => handleSuggestedQuestion(q)}
                      className="group rounded-xl border border-slate-800 bg-slate-900/60 px-4 py-3 text-left text-xs text-slate-400 transition-all hover:border-indigo-500/30 hover:bg-indigo-500/5 hover:text-indigo-300"
                    >
                      <Sparkles className="mb-1.5 h-3 w-3 text-indigo-400/60 group-hover:text-indigo-400" />
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex items-start gap-3 px-1 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                  >
                    {msg.role === 'assistant' ? (
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/20">
                        <Bot className="h-5 w-5 text-white" />
                      </div>
                    ) : (
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-slate-700 to-slate-800 shadow-lg">
                        <User className="h-5 w-5 text-slate-300" />
                      </div>
                    )}

                    <div className={`flex-1 ${msg.role === 'user' ? 'max-w-[80%]' : 'max-w-full'}`}>
                      <div className="mb-1 flex items-center gap-2">
                        <span className="text-sm font-semibold text-slate-200">
                          {msg.role === 'assistant' ? 'Executive Copilot' : 'You'}
                        </span>
                        {msg.role === 'assistant' && (
                          <span className="rounded-full bg-indigo-500/10 px-2 py-0.5 text-[10px] font-medium text-indigo-400">
                            AI
                          </span>
                        )}
                      </div>

                      {msg.role === 'assistant' ? (
                        <div className="rounded-2xl rounded-tl-sm border border-slate-800/50 bg-slate-900/60 px-5 py-4 backdrop-blur-sm">
                          <MarkdownRenderer content={msg.content} />
                        </div>
                      ) : (
                        <div className="rounded-2xl rounded-tr-sm bg-gradient-to-br from-indigo-500/10 to-purple-500/10 px-5 py-3 backdrop-blur-sm">
                          <p className="text-sm text-slate-200">{msg.content}</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {isLoading && <TypingIndicator />}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="border-t border-slate-800 p-4">
            <form onSubmit={handleSubmit} className="relative flex items-end gap-3">
              <div className="relative flex-1">
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask a strategic question... (e.g., 'Should we target Stripe?')"
                  rows={1}
                  className="w-full resize-none rounded-xl border border-slate-800 bg-slate-900/60 px-4 py-3 pr-12 text-sm text-slate-200 placeholder-slate-500 backdrop-blur-sm transition-all focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/20 focus:outline-none"
                  style={{ minHeight: '44px', maxHeight: '120px' }}
                  onInput={(e) => {
                    const target = e.currentTarget;
                    target.style.height = 'auto';
                    target.style.height = `${Math.min(target.scrollHeight, 120)}px`;
                  }}
                />
                <div className="absolute right-3 bottom-3 flex items-center gap-1.5">
                  <span className="text-[10px] text-slate-600">⏎ Send</span>
                </div>
              </div>
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/20 transition-all hover:from-indigo-400 hover:to-purple-500 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {isLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <Send className="h-5 w-5" />
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Knowledge Panel */}
        {showKnowledge && (
          <div className="hidden w-72 shrink-0 lg:block">
            <div className="h-full overflow-y-auto rounded-2xl border border-slate-800 bg-slate-900/40 p-5 backdrop-blur-sm">
              <div className="mb-5 flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-indigo-400" />
                <span className="text-sm font-semibold text-slate-200">Agent Knowledge</span>
              </div>

              <div className="space-y-4">
                {AGENT_KNOWLEDGE.map((agent) => {
                  const Icon = agent.icon;
                  return (
                    <div
                      key={agent.id}
                      className="group rounded-xl border border-slate-800/60 bg-slate-900/60 p-3.5 transition-all hover:border-slate-700 hover:bg-slate-800/40"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br ${agent.color} shadow-lg`}
                        >
                          <Icon className="h-4 w-4 text-white" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-slate-200">{agent.name}</p>
                          <p className="truncate text-[10px] text-slate-500">{agent.description}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-6 rounded-xl border border-indigo-500/20 bg-indigo-500/5 p-4">
                <div className="mb-2 flex items-center gap-2">
                  <BarChart3 className="h-4 w-4 text-indigo-400" />
                  <span className="text-xs font-semibold text-indigo-300">
                    Session Intelligence
                  </span>
                </div>
                <div className="space-y-2 text-xs text-slate-400">
                  <div className="flex justify-between">
                    <span>Questions asked</span>
                    <span className="font-mono text-indigo-300">
                      {messages.filter((m) => m.role === 'user').length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Insights generated</span>
                    <span className="font-mono text-indigo-300">
                      {messages.filter((m) => m.role === 'assistant').length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Knowledge domains</span>
                    <span className="font-mono text-indigo-300">{AGENT_KNOWLEDGE.length}</span>
                  </div>
                </div>
              </div>

              <div className="mt-4">
                <AgentKnowledgeBar agents={AGENT_KNOWLEDGE} />
              </div>

              <div className="mt-6 space-y-2">
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <CheckCircle2 className="h-3 w-3 text-emerald-400" />
                  <span>Real-time market data</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <CheckCircle2 className="h-3 w-3 text-emerald-400" />
                  <span>Historical deal analysis</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <CheckCircle2 className="h-3 w-3 text-emerald-400" />
                  <span>Competitive intelligence</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <CheckCircle2 className="h-3 w-3 text-emerald-400" />
                  <span>Revenue forecasting</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

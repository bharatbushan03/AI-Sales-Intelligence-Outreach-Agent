'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { TopBar } from '@/components/top-bar';
import {
  LayoutDashboard,
  Users,
  Search,
  Mail,
  Database,
  FileText,
  Settings as SettingsIcon,
  Bot,
  Menu,
  X,
  Lightbulb,
  Brain,
  Cpu,
  ShieldCheck,
  Zap,
  Target,
  BarChart3,
  Radio,
  History,
  Play,
  Network,
  Presentation,
} from 'lucide-react';

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
}

const navItems: NavItem[] = [
  { label: 'Executive Command Center', href: '/dashboard', icon: LayoutDashboard, badge: 'NEW' },
  { label: 'Sales War Room', href: '/war-room', icon: Zap, badge: 'WOW' },
  { label: 'Executive AI Copilot', href: '/intelligence', icon: Brain, badge: 'AI' },
  { label: 'One-Click Intelligence', href: '/research', icon: Target, badge: '1-CLICK' },
  { label: 'AI Boardroom Mode', href: '/proposals', icon: Presentation, badge: 'DECK' },
  { label: 'Knowledge Graph', href: '/memory', icon: Network, badge: '3D' },
  { label: 'Predictive Revenue', href: '/analytics', icon: BarChart3, badge: 'AI' },
  { label: 'Memory Time Machine', href: '/settings', icon: History, badge: 'HIST' },
  { label: 'Agent Visualizer', href: '/workflow-visualizer', icon: Radio, badge: 'LIVE' },
  { label: 'Live Demo Mode', href: '/opportunities', icon: Play, badge: 'DEMO' },
];

export function NavigationShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div className="flex h-screen w-screen flex-col overflow-hidden bg-slate-950 font-sans text-slate-100">
      {/* Top Bar */}
      <TopBar />

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Desktop Sidebar */}
        <aside className="hidden w-64 flex-col border-r border-slate-800 bg-slate-900 text-slate-400 md:flex">
          {/* Brand Banner */}
          <div className="flex items-center gap-3 border-b border-slate-800 px-6 py-5">
            <Bot className="h-7 w-7 animate-pulse text-indigo-400" />
            <div className="flex flex-col">
              <span className="text-sm font-semibold tracking-wide text-slate-100 uppercase">
                B2B Autonomous
              </span>
              <span className="text-xs font-medium text-indigo-400">Sales Intelligence Agent</span>
            </div>
          </div>

          {/* Navigation Link list */}
          <nav className="flex-1 space-y-1.5 overflow-y-auto px-4 py-6">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3.5 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/10'
                      : 'hover:bg-slate-800 hover:text-slate-200'
                  }`}
                >
                  <Icon className={`h-5 w-5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span className="flex-1">{item.label}</span>
                  {item.badge && (
                    <span
                      className={`rounded px-1.5 py-0.5 text-[8px] font-bold ${
                        item.badge === 'WOW'
                          ? 'bg-yellow-500 text-yellow-950'
                          : item.badge === 'NEW'
                            ? 'bg-emerald-500 text-emerald-950'
                            : item.badge === 'AI'
                              ? 'bg-indigo-500 text-indigo-950'
                              : item.badge === 'DEMO'
                                ? 'bg-rose-500 text-rose-950'
                                : item.badge === 'LIVE'
                                  ? 'bg-cyan-500 text-cyan-950'
                                  : 'bg-slate-600 text-slate-200'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* User Card placeholder */}
          <div className="flex items-center gap-3 border-t border-slate-800 bg-slate-900/50 p-4">
            <div className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-700 bg-slate-800 font-bold text-slate-200">
              JD
            </div>
            <div className="flex flex-col overflow-hidden">
              <span className="truncate text-sm font-medium text-slate-200">John Doe</span>
              <span className="truncate text-xs text-slate-500">sales@example.com</span>
            </div>
          </div>
        </aside>

        {/* Mobile Header and Drawer */}
        <div className="flex-1 flex-col overflow-hidden md:hidden">
          <header className="flex items-center justify-between border-b border-slate-800 bg-slate-900 px-6 py-4">
            <div className="flex items-center gap-2">
              <Bot className="h-6 w-6 text-indigo-400" />
              <span className="text-sm font-semibold tracking-wider text-slate-100 uppercase">
                B2B Agent
              </span>
            </div>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="rounded-lg border border-slate-800 p-1 text-slate-400 hover:bg-slate-800 hover:text-slate-200"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </header>

          {/* Mobile Navigation Drawer */}
          {isOpen && (
            <div className="absolute inset-0 z-50">
              <div className="fixed inset-0 bg-black/60" onClick={() => setIsOpen(false)} />
              <aside className="relative flex h-full w-72 flex-col border-r border-slate-800 bg-slate-900">
                <div className="flex items-center justify-between border-b border-slate-800 px-6 py-5">
                  <div className="flex items-center gap-2">
                    <Bot className="h-6 w-6 text-indigo-400" />
                    <span className="text-sm font-semibold tracking-wider text-slate-100 uppercase">
                      Sales Agent
                    </span>
                  </div>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="text-slate-400 hover:text-slate-200"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>
                <nav className="flex-1 space-y-1.5 overflow-y-auto px-4 py-6">
                  {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setIsOpen(false)}
                        className={`flex items-center gap-3.5 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 ${
                          isActive
                            ? 'bg-indigo-600 text-white'
                            : 'hover:bg-slate-800 hover:text-slate-200'
                        }`}
                      >
                        <Icon className={`h-5 w-5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                        <span className="flex-1">{item.label}</span>
                        {item.badge && (
                          <span
                            className={`rounded px-1.5 py-0.5 text-[8px] font-bold ${
                              item.badge === 'WOW'
                                ? 'bg-yellow-500 text-yellow-950'
                                : item.badge === 'NEW'
                                  ? 'bg-emerald-500 text-emerald-950'
                                  : item.badge === 'AI'
                                    ? 'bg-indigo-500 text-indigo-950'
                                    : item.badge === 'DEMO'
                                      ? 'bg-rose-500 text-rose-950'
                                      : item.badge === 'LIVE'
                                        ? 'bg-cyan-500 text-cyan-950'
                                        : 'bg-slate-600 text-slate-200'
                            }`}
                          >
                            {item.badge}
                          </span>
                        )}
                      </Link>
                    );
                  })}
                </nav>
              </aside>
            </div>
          )}
        </div>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto bg-slate-950 p-6 md:p-10">
          <div className="mx-auto max-w-7xl space-y-8">{children}</div>
        </main>
      </div>
    </div>
  );
}

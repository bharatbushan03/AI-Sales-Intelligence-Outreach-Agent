'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
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
} from 'lucide-react';

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

const navItems: NavItem[] = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Leads', href: '/leads', icon: Users },
  { label: 'Research', href: '/research', icon: Search },
  { label: 'Opportunities', href: '/opportunities', icon: Lightbulb },
  { label: 'Outreach', href: '/outreach', icon: Mail },
  { label: 'CRM Sync', href: '/crm', icon: Database },
  { label: 'Proposals', href: '/proposals', icon: FileText },
  { label: 'Shared Memory', href: '/memory', icon: Brain },
  { label: 'AI Intelligence', href: '/intelligence', icon: Cpu },
  { label: 'Admin Console', href: '/admin/data', icon: ShieldCheck },
  { label: 'Settings', href: '/settings', icon: SettingsIcon },
];

export function NavigationShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-950 font-sans text-slate-100">
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
                {item.label}
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

      {/* Mobile Header */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="flex items-center justify-between border-b border-slate-800 bg-slate-900 px-6 py-4 md:hidden">
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
          <div className="absolute inset-0 z-50 flex md:hidden">
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
                      {item.label}
                    </Link>
                  );
                })}
              </nav>
            </aside>
          </div>
        )}

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto bg-slate-950 p-6 md:p-10">
          <div className="mx-auto max-w-7xl space-y-8">{children}</div>
        </main>
      </div>
    </div>
  );
}

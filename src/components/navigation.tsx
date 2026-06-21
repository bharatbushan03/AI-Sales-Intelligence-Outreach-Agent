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
  { label: 'Settings', href: '/settings', icon: SettingsIcon },
];

export function NavigationShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-950 font-sans text-slate-100">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-slate-900 border-r border-slate-800 text-slate-400">
        {/* Brand Banner */}
        <div className="flex items-center gap-3 px-6 py-5 border-b border-slate-800">
          <Bot className="h-7 w-7 text-indigo-400 animate-pulse" />
          <div className="flex flex-col">
            <span className="font-semibold text-slate-100 text-sm tracking-wide uppercase">B2B Autonomous</span>
            <span className="text-xs text-indigo-400 font-medium">Sales Intelligence Agent</span>
          </div>
        </div>

        {/* Navigation Link list */}
        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
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
        <div className="p-4 border-t border-slate-800 bg-slate-900/50 flex items-center gap-3">
          <div className="h-9 w-9 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-slate-200">
            JD
          </div>
          <div className="flex flex-col overflow-hidden">
            <span className="text-sm font-medium text-slate-200 truncate">John Doe</span>
            <span className="text-xs text-slate-500 truncate">sales@example.com</span>
          </div>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="flex flex-col flex-1 overflow-hidden">
        <header className="md:hidden flex items-center justify-between px-6 py-4 bg-slate-900 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Bot className="h-6 w-6 text-indigo-400" />
            <span className="font-semibold text-slate-100 text-sm tracking-wider uppercase">B2B Agent</span>
          </div>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-1 rounded-lg border border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-slate-200"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </header>

        {/* Mobile Navigation Drawer */}
        {isOpen && (
          <div className="md:hidden absolute inset-0 z-50 flex">
            <div className="fixed inset-0 bg-black/60" onClick={() => setIsOpen(false)} />
            <aside className="relative flex flex-col w-72 bg-slate-900 h-full border-r border-slate-800">
              <div className="flex items-center justify-between px-6 py-5 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <Bot className="h-6 w-6 text-indigo-400" />
                  <span className="font-semibold text-slate-100 text-sm tracking-wider uppercase">Sales Agent</span>
                </div>
                <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-slate-200">
                  <X className="h-6 w-6" />
                </button>
              </div>
              <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
                {navItems.map((item) => {
                  const isActive = pathname === item.href;
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className={`flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                        isActive ? 'bg-indigo-600 text-white' : 'hover:bg-slate-800 hover:text-slate-200'
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
          <div className="max-w-7xl mx-auto space-y-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

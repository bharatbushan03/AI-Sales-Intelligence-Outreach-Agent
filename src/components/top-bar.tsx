'use client';

import React from 'react';
import {
  Bell,
  Search,
  Settings as SettingsIcon,
  UserPlus,
  User,
  ChevronDown,
  LayoutDashboard,
  MessageCircle,
  Share2,
  LogOut,
} from 'lucide-react';

interface TopBarProps {
  pathname: string;
}

export function TopBar({ pathname }: TopBarProps) {
  const [openDropdown, setOpenDropdown] = React.useState<
    'notifications' | 'messages' | 'team' | 'user' | null
  >(null);
  const notificationsRef = React.useRef<HTMLDivElement>(null);
  const messagesRef = React.useRef<HTMLDivElement>(null);
  const teamRef = React.useRef<HTMLDivElement>(null);
  const userRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (openDropdown === null) return;

      const target = event.target as Node;
      let container = null;
      switch (openDropdown) {
        case 'notifications':
          container = notificationsRef.current;
          break;
        case 'messages':
          container = messagesRef.current;
          break;
        case 'team':
          container = teamRef.current;
          break;
        case 'user':
          container = userRef.current;
          break;
      }

      if (container && !container.contains(target)) {
        setOpenDropdown(null);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && openDropdown !== null) {
        setOpenDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [openDropdown]);

  return (
    <header className="border-b border-slate-200/50 bg-white/5 px-4 py-3 backdrop-blur-md sm:px-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        {/* Left Side: Logo and Navigation */}
        <div className="flex items-center gap-4">
          <button className="text-slate-500 hover:text-slate-700">
            <LayoutDashboard className="h-5 w-5" />
          </button>
          <div className="hidden items-center gap-4 md:flex">
            <a
              href="/dashboard"
              className={`text-sm font-medium ${
                pathname === '/' || pathname === '/dashboard'
                  ? 'border-b-2 border-indigo-600 text-indigo-600'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              Dashboard
            </a>
            <a
              href="/research"
              className={`text-sm font-medium ${
                pathname === '/research'
                  ? 'border-b-2 border-indigo-600 text-indigo-600'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              Research
            </a>
          </div>
        </div>

        {/* Center: Search */}
        <div className="mx-4 flex-1">
          <div className="relative">
            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search companies, reports, opportunities..."
              className="block w-full rounded-md border border-slate-200 bg-slate-50 py-2 pr-4 pl-10 text-sm text-slate-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
            />
          </div>
        </div>

        {/* Right Side: Notifications, User Menu, etc. */}
        <div className="flex items-center gap-3">
          {/* Notifications Dropdown */}
          <div className="relative" ref={notificationsRef}>
            <button
              className="relative text-slate-500 hover:text-slate-700"
              onClick={() =>
                setOpenDropdown(openDropdown === 'notifications' ? null : 'notifications')
              }
            >
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 flex h-2 w-2 items-center justify-center rounded-full bg-indigo-500 text-xs font-medium text-white">
                3
              </span>
            </button>
            {openDropdown === 'notifications' && (
              <div className="absolute right-0 z-20 mt-2 w-56 rounded-md border border-slate-200 bg-white shadow-lg focus:outline-none">
                <div className="py-1">
                  <div className="border-b border-slate-100 px-4 py-2 text-sm text-slate-700">
                    New Opportunities
                  </div>
                  <div className="px-4 py-2 text-sm text-slate-600">
                    You have 3 new high-value opportunities
                  </div>
                  <div className="border-t border-slate-100 px-4 py-2 text-sm text-slate-700">
                    All Notifications
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Messages Dropdown */}
          <div className="relative" ref={messagesRef}>
            <button
              className="text-slate-500 hover:text-slate-700"
              onClick={() => setOpenDropdown(openDropdown === 'messages' ? null : 'messages')}
            >
              <MessageCircle className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 flex h-2 w-2 items-center justify-center rounded-full bg-indigo-500 text-xs font-medium text-white">
                2
              </span>
            </button>
            {openDropdown === 'messages' && (
              <div className="absolute right-0 z-20 mt-2 w-56 rounded-md border border-slate-200 bg-white shadow-lg focus:outline-none">
                <div className="py-1">
                  <div className="border-b border-slate-100 px-4 py-2 text-sm text-slate-700">
                    Messages
                  </div>
                  <div className="px-4 py-2 text-sm text-slate-600">2 unread messages</div>
                  <div className="border-t border-slate-100 px-4 py-2 text-sm text-slate-700">
                    View All
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Team Dropdown */}
          <div className="relative" ref={teamRef}>
            <button
              className="text-slate-500 hover:text-slate-700"
              onClick={() => setOpenDropdown(openDropdown === 'team' ? null : 'team')}
            >
              <UserPlus className="h-5 w-5" />
            </button>
            {openDropdown === 'team' && (
              <div className="absolute right-0 z-20 mt-2 w-56 rounded-md border border-slate-200 bg-white shadow-lg focus:outline-none">
                <div className="py-1">
                  <div className="border-b border-slate-100 px-4 py-2 text-sm text-slate-700">
                    Team
                  </div>
                  <div className="px-4 py-2 text-sm text-slate-600">
                    Invite members to your organization
                  </div>
                  <div className="border-t border-slate-100 px-4 py-2 text-sm text-slate-700">
                    Manage Team
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* User Menu */}
          <div className="relative" ref={userRef}>
            <button
              className="flex items-center gap-2 text-slate-500 hover:text-slate-700"
              onClick={() => setOpenDropdown(openDropdown === 'user' ? null : 'user')}
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-200">
                JD
              </span>
              <div className="hidden flex-col md:flex">
                <span className="text-sm font-medium text-slate-900">John Doe</span>
                <span className="text-xs text-slate-500">john@example.com</span>
              </div>
              <ChevronDown className="h-4 w-4 text-slate-400" />
            </button>
            {openDropdown === 'user' && (
              <div className="absolute right-0 z-20 mt-2 w-48 rounded-md border border-slate-200 bg-white shadow-lg focus:outline-none">
                <div className="py-1">
                  <div className="px-4 py-2 text-sm text-slate-700">
                    <User className="mr-2 h-4 w-4" /> Profile
                  </div>
                  <div className="border-t border-slate-100 px-4 py-2 text-sm text-slate-700">
                    <SettingsIcon className="mr-2 h-4 w-4" /> Settings
                  </div>
                  <div className="border-t border-slate-100 px-4 py-2 text-sm text-slate-700">
                    <LogOut className="mr-2 h-4 w-4" /> Sign Out
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
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

export function TopBar() {
  const pathname = usePathname();

  return (
    <header className="bg-white/5 backdrop-blur-md border-b border-slate-200/50 px-4 py-3 sm:px-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        {/* Left Side: Logo and Navigation */}
        <div className="flex items-center gap-4">
          <button className="text-slate-500 hover:text-slate-700">
            <LayoutDashboard className="h-5 w-5" />
          </button>
          <div className="hidden md:flex items-center gap-4">
            <Link
              href="/dashboard"
              className={`text-sm font-medium ${
                pathname === '/' || pathname === '/dashboard'
                  ? 'text-indigo-600 border-b-2 border-indigo-600'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              Dashboard
            </Link>
            <Link
              href="/research"
              className={`text-sm font-medium ${
                pathname === '/research'
                  ? 'text-indigo-600 border-b-2 border-indigo-600'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              Research
            </Link>
          </div>
        </div>

        {/* Center: Search */}
        <div className="flex-1 mx-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search companies, reports, opportunities..."
              className="block w-full pl-10 pr-4 py-2 text-sm text-slate-900 bg-slate-50 border border-slate-200 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-slate-800 dark:text-slate-100 dark:border-slate-600"
            />
          </div>
        </div>

        {/* Right Side: Notifications, User Menu, etc. */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <button className="text-slate-500 hover:text-slate-700 relative">
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 flex h-2 w-2 items-center justify-center bg-indigo-500 text-xs font-medium text-white rounded-full">
                3
              </span>
            </button>
            <div className="absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded-md shadow-lg z-20 w-56 focus:outline-none">
              <div className="py-1">
                <div className="px-4 py-2 text-sm text-slate-700 border-b border-slate-100">
                  New Opportunities
                </div>
                <div className="px-4 py-2 text-sm text-slate-600">
                  You have 3 new high-value opportunities
                </div>
                <div className="px-4 py-2 text-sm text-slate-700 border-t border-slate-100">
                  All Notifications
                </div>
              </div>
            </div>
          </div>

          <div className="relative">
            <button className="text-slate-500 hover:text-slate-700">
              <MessageCircle className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 flex h-2 w-2 items-center justify-center bg-indigo-500 text-xs font-medium text-white rounded-full">
                2
              </span>
            </button>
            <div className="absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded-md shadow-lg z-20 w-56 focus:outline-none">
              <div className="py-1">
                <div className="px-4 py-2 text-sm text-slate-700 border-b border-slate-100">
                  Messages
                </div>
                <div className="px-4 py-2 text-sm text-slate-600">
                  2 unread messages
                </div>
                <div className="px-4 py-2 text-sm text-slate-700 border-t border-slate-100">
                  View All
                </div>
              </div>
            </div>
          </div>

          <div className="relative">
            <button className="text-slate-500 hover:text-slate-700">
              <UserPlus className="h-5 w-5" />
            </button>
            <div className="absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded-md shadow-lg z-20 w-56 focus:outline-none">
              <div className="py-1">
                <div className="px-4 py-2 text-sm text-slate-700 border-b border-slate-100">
                  Team
                </div>
                <div className="px-4 py-2 text-sm text-slate-600">
                  Invite members to your organization
                </div>
                <div className="px-4 py-2 text-sm text-slate-700 border-t border-slate-100">
                  Manage Team
                </div>
              </div>
            </div>
          </div>

          {/* User Menu */}
          <div className="relative">
            <button className="flex items-center gap-2 text-slate-500 hover:text-slate-700">
              <span className="h-8 w-8 flex items-center justify-center bg-slate-200 rounded-full">
                JD
              </span>
              <div className="hidden md:flex flex-col">
                <span className="text-sm font-medium text-slate-900">John Doe</span>
                <span className="text-xs text-slate-500">john@example.com</span>
              </div>
              <ChevronDown className="h-4 w-4 text-slate-400" />
            </button>
            <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-200 rounded-md shadow-lg z-20 w-48 focus:outline-none">
              <div className="py-1">
                <div className="px-4 py-2 text-sm text-slate-700">
                  <User className="h-4 w-4 mr-2" /> Profile
                </div>
                <div className="px-4 py-2 text-sm text-slate-700 border-t border-slate-100">
                  <SettingsIcon className="h-4 w-4 mr-2" /> Settings
                </div>
                <div className="px-4 py-2 text-sm text-slate-700 border-t border-slate-100">
                  <LogOut className="h-4 w-4 mr-2" /> Sign Out
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
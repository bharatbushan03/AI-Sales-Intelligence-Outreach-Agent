/**
 * Onboarding Layout Component
 * Provides consistent layout for onboarding steps
 */

'use client';

import React from 'react';
import { Bot, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

interface OnboardingLayoutProps {
  children: React.ReactNode;
  showBackButton?: boolean;
  onBack?: () => void;
}

export function OnboardingLayout({ 
  children, 
  showBackButton = false,
  onBack 
}: OnboardingLayoutProps) {
  const router = useRouter();
  const { signOut } = useAuth();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      router.back();
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push('/auth/login');
    } catch (error) {
      console.error('Sign out failed:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <header className="border-b border-slate-800/50 bg-slate-900/50 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center space-x-4">
              {showBackButton && (
                <button
                  onClick={handleBack}
                  className="flex items-center space-x-2 text-slate-400 hover:text-slate-200"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span className="text-sm">Back</span>
                </button>
              )}
              
              <div className="flex items-center space-x-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600">
                  <Bot className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-lg font-bold text-white">B2B Sales Intelligence</h1>
                  <p className="text-xs text-slate-400">Setup your account</p>
                </div>
              </div>
            </div>

            <button
              onClick={handleSignOut}
              className="text-sm text-slate-400 hover:text-slate-200"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/50 bg-slate-900/30 py-6">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <p className="text-xs text-slate-400">
            Need help? Contact{' '}
            <a href="mailto:support@b2bsales.ai" className="text-indigo-400 hover:text-indigo-300">
              support@b2bsales.ai
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
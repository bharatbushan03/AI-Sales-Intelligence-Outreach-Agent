/**
 * Onboarding Flow Component
 * Manages the complete user onboarding experience
 */

'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useOnboarding, useOnboardingProgress } from '@/hooks/useOnboarding';
import { useAuth } from '@/context/AuthContext';
import { ProfileStep } from './steps/ProfileStep';
import { OrganizationStep } from './steps/OrganizationStep';
import { WorkspaceStep } from './steps/WorkspaceStep';
import { CompleteStep } from './steps/CompleteStep';
import { OnboardingProgress } from './OnboardingProgress';
import { OnboardingLayout } from './OnboardingLayout';
import { Loader2 } from 'lucide-react';

interface OnboardingFlowProps {
  onComplete?: () => void;
  redirectTo?: string;
}

export function OnboardingFlow({ onComplete, redirectTo = '/dashboard' }: OnboardingFlowProps) {
  const router = useRouter();
  const { user } = useAuth();
  const { 
    currentStep, 
    completed, 
    loading, 
    error,
    submitProfile,
    submitOrganization,
    submitWorkspace,
    completeOnboarding,
  } = useOnboarding();

  const { progress } = useOnboardingProgress();

  // Redirect if onboarding is already complete
  useEffect(() => {
    if (completed && !loading) {
      if (onComplete) {
        onComplete();
      } else {
        router.push(redirectTo);
      }
    }
  }, [completed, loading, router, redirectTo, onComplete]);

  // Show loading state
  if (loading || !user) {
    return (
      <OnboardingLayout>
        <div className="flex items-center justify-center py-12">
          <div className="flex flex-col items-center space-y-4">
            <Loader2 className="h-8 w-8 animate-spin text-indigo-400" />
            <p className="text-sm text-slate-400">Loading onboarding...</p>
          </div>
        </div>
      </OnboardingLayout>
    );
  }

  // Show error state
  if (error) {
    return (
      <OnboardingLayout>
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="text-red-400 mb-4">
              <svg className="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L5.732 18.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-white">Onboarding Error</h3>
            <p className="mt-2 text-sm text-slate-400">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
            >
              Retry
            </button>
          </div>
        </div>
      </OnboardingLayout>
    );
  }

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 'profile':
        return <ProfileStep onNext={submitProfile} />;
      case 'organization':
        return <OrganizationStep onNext={submitOrganization} />;
      case 'workspace':
        return <WorkspaceStep onNext={submitWorkspace} />;
      case 'complete':
        return <CompleteStep onComplete={completeOnboarding} />;
      default:
        return <ProfileStep onNext={submitProfile} />;
    }
  };

  return (
    <OnboardingLayout>
      <div className="mx-auto max-w-2xl">
        <OnboardingProgress progress={progress} currentStep={currentStep} />
        <div className="mt-8">
          {renderCurrentStep()}
        </div>
      </div>
    </OnboardingLayout>
  );
}
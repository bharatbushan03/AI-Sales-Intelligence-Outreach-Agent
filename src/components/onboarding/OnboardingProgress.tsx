/**
 * Onboarding Progress Component
 * Shows progress through onboarding steps
 */

'use client';

import React from 'react';
import { Check } from 'lucide-react';
import { OnboardingStep } from '@/hooks/useOnboarding';

interface OnboardingProgressProps {
  progress: number;
  currentStep: OnboardingStep;
}

interface Step {
  id: OnboardingStep;
  name: string;
  description: string;
}

const steps: Step[] = [
  {
    id: 'profile',
    name: 'Profile Setup',
    description: 'Tell us about yourself',
  },
  {
    id: 'organization',
    name: 'Organization',
    description: 'Setup your company',
  },
  {
    id: 'workspace',
    name: 'Workspace',
    description: 'Create your workspace',
  },
  {
    id: 'complete',
    name: 'Complete',
    description: 'Invite your team',
  },
];

export function OnboardingProgress({ progress, currentStep }: OnboardingProgressProps) {
  const currentIndex = steps.findIndex((step) => step.id === currentStep);

  return (
    <div className="mb-8">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="mb-2 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white">Setup Your Account</h2>
          <span className="text-sm font-medium text-slate-400">
            {Math.round(progress)}% Complete
          </span>
        </div>
        <div className="h-2 w-full rounded-full bg-slate-800">
          <div
            className="h-2 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Step Indicators */}
      <nav aria-label="Progress">
        <ol className="flex items-center justify-between">
          {steps.map((step, index) => {
            const isCompleted = index < currentIndex;
            const isCurrent = index === currentIndex;
            const isUpcoming = index > currentIndex;

            return (
              <li key={step.id} className="relative flex-1">
                {/* Step */}
                <div className="group flex items-center">
                  <div className="flex items-center">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-full border-2 transition-colors ${
                        isCompleted
                          ? 'border-indigo-500 bg-indigo-500'
                          : isCurrent
                            ? 'border-indigo-500 bg-slate-900'
                            : 'border-slate-600 bg-slate-800'
                      }`}
                    >
                      {isCompleted ? (
                        <Check className="h-5 w-5 text-white" />
                      ) : (
                        <span
                          className={`text-sm font-medium ${
                            isCurrent ? 'text-indigo-400' : 'text-slate-400'
                          }`}
                        >
                          {index + 1}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Step Info */}
                  <div className="ml-4 min-w-0 flex-1">
                    <div
                      className={`text-sm font-medium ${
                        isCompleted
                          ? 'text-indigo-400'
                          : isCurrent
                            ? 'text-white'
                            : 'text-slate-400'
                      }`}
                    >
                      {step.name}
                    </div>
                    <div className="text-xs text-slate-500">{step.description}</div>
                  </div>
                </div>

                {/* Connector */}
                {index < steps.length - 1 && (
                  <div
                    className={`absolute top-5 ml-5 h-0.5 w-full transition-colors ${
                      isCompleted ? 'bg-indigo-500' : 'bg-slate-700'
                    }`}
                    style={{ left: '2.5rem', right: '-2.5rem' }}
                  />
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </div>
  );
}

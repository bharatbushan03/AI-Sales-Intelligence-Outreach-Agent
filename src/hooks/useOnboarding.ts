/**
 * Onboarding Hook
 * Manages user onboarding state and flow
 */

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { logger } from '../utils/logger';

export type OnboardingStep = 'profile' | 'organization' | 'workspace' | 'complete';

interface OnboardingState {
  currentStep: OnboardingStep;
  completed: boolean;
  loading: boolean;
  error: string | null;
  data: {
    profile?: {
      name?: string;
      role?: string;
      industry?: string;
      teamSize?: string;
    };
    organization?: {
      id?: string;
      name?: string;
      domain?: string;
      industry?: string;
      size?: string;
    };
    workspace?: {
      id?: string;
      name?: string;
      description?: string;
      type?: string;
    };
    workspaces?: string[];
    invitations?: Array<{
      email: string;
      status: string;
      inviteId: string;
    }>;
  };
}

interface OnboardingOperations {
  submitProfile: (data: {
    name: string;
    role: string;
    industry?: string;
    teamSize?: string;
  }) => Promise<{ success: boolean; error?: string }>;

  submitOrganization: (data: {
    name: string;
    domain: string;
    industry?: string;
    size?: string;
  }) => Promise<{ success: boolean; error?: string }>;

  submitWorkspace: (data: {
    name: string;
    description?: string;
    type?: string;
  }) => Promise<{ success: boolean; error?: string }>;

  completeOnboarding: (inviteEmails?: string[]) => Promise<{ 
    success: boolean; 
    error?: string;
    invitations?: any[];
  }>;

  refreshStatus: () => Promise<void>;
  skipStep: () => Promise<void>;
  goToStep: (step: OnboardingStep) => Promise<void>;
  resetOnboarding: () => Promise<void>;
}

export function useOnboarding(): OnboardingState & OnboardingOperations {
  const { user, profile } = useAuth();
  const [state, setState] = useState<OnboardingState>({
    currentStep: 'profile',
    completed: false,
    loading: true,
    error: null,
    data: {},
  });

  // Check if user needs onboarding
  const needsOnboarding = useCallback(() => {
    if (!user || !profile) return true;
    
    // Check if user has completed basic setup
    return !profile.organizationId || 
           !profile.workspaceIds?.length ||
           !profile.name ||
           !profile.role;
  }, [user, profile]);

  // Fetch onboarding status
  const fetchOnboardingStatus = useCallback(async () => {
    if (!user) {
      setState(prev => ({
        ...prev,
        loading: false,
        currentStep: 'profile',
        completed: false,
        data: {},
      }));
      return;
    }

    try {
      setState(prev => ({ ...prev, loading: true, error: null }));

      const idToken = await user.getIdToken();
      const response = await fetch('/api/onboarding', {
        headers: {
          'Authorization': `Bearer ${idToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch onboarding status');
      }

      const result = await response.json();
      
      if (result.success) {
        setState(prev => ({
          ...prev,
          currentStep: result.data.currentStep,
          completed: result.data.completed,
          data: result.data.data,
          loading: false,
        }));
      } else {
        throw new Error(result.error?.message || 'Failed to fetch onboarding status');
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown error';
      setState(prev => ({
        ...prev,
        error: errorMsg,
        loading: false,
      }));
      logger.error('Failed to fetch onboarding status', error);
    }
  }, [user]);

  // Initialize onboarding status
  useEffect(() => {
    if (needsOnboarding()) {
      fetchOnboardingStatus();
    } else {
      setState(prev => ({
        ...prev,
        completed: true,
        currentStep: 'complete',
        loading: false,
      }));
    }
  }, [needsOnboarding, fetchOnboardingStatus]);

  // Submit profile step
  const submitProfile = useCallback(async (profileData: {
    name: string;
    role: string;
    industry?: string;
    teamSize?: string;
  }) => {
    if (!user) {
      return { success: false, error: 'User not authenticated' };
    }

    try {
      setState(prev => ({ ...prev, loading: true, error: null }));

      const idToken = await user.getIdToken();
      const response = await fetch('/api/onboarding', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${idToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          step: 'profile',
          profileData,
        }),
      });

      const result = await response.json();
      
      if (result.success) {
        setState(prev => ({
          ...prev,
          currentStep: result.data.nextStep,
          data: {
            ...prev.data,
            profile: result.data.data.profile,
          },
          loading: false,
        }));
        return { success: true };
      } else {
        setState(prev => ({ ...prev, loading: false }));
        return { success: false, error: result.error?.message || 'Profile submission failed' };
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Profile submission failed';
      setState(prev => ({ ...prev, error: errorMsg, loading: false }));
      return { success: false, error: errorMsg };
    }
  }, [user]);

  // Submit organization step
  const submitOrganization = useCallback(async (organizationData: {
    name: string;
    domain: string;
    industry?: string;
    size?: string;
  }) => {
    if (!user) {
      return { success: false, error: 'User not authenticated' };
    }

    try {
      setState(prev => ({ ...prev, loading: true, error: null }));

      const idToken = await user.getIdToken();
      const response = await fetch('/api/onboarding', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${idToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          step: 'organization',
          organizationData,
        }),
      });

      const result = await response.json();
      
      if (result.success) {
        setState(prev => ({
          ...prev,
          currentStep: result.data.nextStep,
          data: {
            ...prev.data,
            organization: result.data.data.organization,
          },
          loading: false,
        }));
        return { success: true };
      } else {
        setState(prev => ({ ...prev, loading: false }));
        return { success: false, error: result.error?.message || 'Organization creation failed' };
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Organization creation failed';
      setState(prev => ({ ...prev, error: errorMsg, loading: false }));
      return { success: false, error: errorMsg };
    }
  }, [user]);

  // Submit workspace step
  const submitWorkspace = useCallback(async (workspaceData: {
    name: string;
    description?: string;
    type?: string;
  }) => {
    if (!user) {
      return { success: false, error: 'User not authenticated' };
    }

    try {
      setState(prev => ({ ...prev, loading: true, error: null }));

      const idToken = await user.getIdToken();
      const response = await fetch('/api/onboarding', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${idToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          step: 'workspace',
          workspaceData,
        }),
      });

      const result = await response.json();
      
      if (result.success) {
        setState(prev => ({
          ...prev,
          currentStep: result.data.nextStep,
          data: {
            ...prev.data,
            workspace: result.data.data.workspace,
          },
          loading: false,
        }));
        return { success: true };
      } else {
        setState(prev => ({ ...prev, loading: false }));
        return { success: false, error: result.error?.message || 'Workspace creation failed' };
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Workspace creation failed';
      setState(prev => ({ ...prev, error: errorMsg, loading: false }));
      return { success: false, error: errorMsg };
    }
  }, [user]);

  // Complete onboarding with optional team invitations
  const completeOnboarding = useCallback(async (inviteEmails: string[] = []) => {
    if (!user) {
      return { success: false, error: 'User not authenticated' };
    }

    try {
      setState(prev => ({ ...prev, loading: true, error: null }));

      const idToken = await user.getIdToken();
      const response = await fetch('/api/onboarding', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${idToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          step: 'complete',
          inviteEmails,
        }),
      });

      const result = await response.json();
      
      if (result.success) {
        setState(prev => ({
          ...prev,
          currentStep: 'complete',
          completed: true,
          data: {
            ...prev.data,
            invitations: result.data.data.invitations,
          },
          loading: false,
        }));
        return { 
          success: true, 
          invitations: result.data.data.invitations 
        };
      } else {
        setState(prev => ({ ...prev, loading: false }));
        return { success: false, error: result.error?.message || 'Onboarding completion failed' };
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Onboarding completion failed';
      setState(prev => ({ ...prev, error: errorMsg, loading: false }));
      return { success: false, error: errorMsg };
    }
  }, [user]);

  // Refresh onboarding status
  const refreshStatus = useCallback(async () => {
    await fetchOnboardingStatus();
  }, [fetchOnboardingStatus]);

  // Skip current step (if allowed)
  const skipStep = useCallback(async () => {
    const stepOrder: OnboardingStep[] = ['profile', 'organization', 'workspace', 'complete'];
    const currentIndex = stepOrder.indexOf(state.currentStep);
    
    if (currentIndex < stepOrder.length - 1) {
      const nextStep = stepOrder[currentIndex + 1];
      setState(prev => ({
        ...prev,
        currentStep: nextStep,
      }));
    }
  }, [state.currentStep]);

  // Go to specific step
  const goToStep = useCallback(async (step: OnboardingStep) => {
    setState(prev => ({
      ...prev,
      currentStep: step,
    }));
  }, []);

  // Reset onboarding (for testing/development)
  const resetOnboarding = useCallback(async () => {
    setState({
      currentStep: 'profile',
      completed: false,
      loading: false,
      error: null,
      data: {},
    });
  }, []);

  return {
    ...state,
    submitProfile,
    submitOrganization,
    submitWorkspace,
    completeOnboarding,
    refreshStatus,
    skipStep,
    goToStep,
    resetOnboarding,
  };
}

// Progress calculation hook
export function useOnboardingProgress() {
  const { currentStep, completed } = useOnboarding();

  const steps: OnboardingStep[] = ['profile', 'organization', 'workspace', 'complete'];
  const currentIndex = steps.indexOf(currentStep);
  const progress = completed ? 100 : ((currentIndex + 1) / steps.length) * 100;

  const getStepStatus = (step: OnboardingStep): 'completed' | 'current' | 'upcoming' => {
    const stepIndex = steps.indexOf(step);
    const current = steps.indexOf(currentStep);

    if (completed && step === 'complete') return 'completed';
    if (stepIndex < current) return 'completed';
    if (stepIndex === current) return 'current';
    return 'upcoming';
  };

  return {
    progress,
    currentStep,
    totalSteps: steps.length,
    getStepStatus,
    isComplete: completed,
  };
}

// Form validation hooks
export function useProfileValidation() {
  const validateProfile = (data: {
    name: string;
    role: string;
    industry?: string;
    teamSize?: string;
  }) => {
    const errors: Record<string, string> = {};

    if (!data.name.trim()) {
      errors.name = 'Name is required';
    } else if (data.name.length < 2) {
      errors.name = 'Name must be at least 2 characters';
    } else if (data.name.length > 100) {
      errors.name = 'Name must be less than 100 characters';
    }

    if (!data.role.trim()) {
      errors.role = 'Role is required';
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  };

  return { validateProfile };
}

export function useOrganizationValidation() {
  const validateOrganization = (data: {
    name: string;
    domain: string;
    industry?: string;
    size?: string;
  }) => {
    const errors: Record<string, string> = {};

    if (!data.name.trim()) {
      errors.name = 'Organization name is required';
    } else if (data.name.length < 2) {
      errors.name = 'Organization name must be at least 2 characters';
    }

    if (!data.domain.trim()) {
      errors.domain = 'Domain is required';
    } else if (!data.domain.match(/^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\.[a-zA-Z]{2,}$/)) {
      errors.domain = 'Please enter a valid domain (e.g., company.com)';
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  };

  return { validateOrganization };
}
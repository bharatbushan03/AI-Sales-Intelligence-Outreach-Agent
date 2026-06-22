/**
 * Profile Setup Step
 * First step of onboarding - collect user profile information
 */

'use client';

import React, { useState } from 'react';
import { User, Briefcase, Building, Users } from 'lucide-react';
import { useProfileValidation } from '@/hooks/useOnboarding';
import { useAuth } from '@/context/AuthContext';

interface ProfileStepProps {
  onNext: (data: {
    name: string;
    role: string;
    industry?: string;
    teamSize?: string;
  }) => Promise<{ success: boolean; error?: string }>;
}

const ROLES = [
  'Sales Manager',
  'Sales Director',
  'Sales Representative',
  'Business Development Manager',
  'Account Executive',
  'VP of Sales',
  'Chief Revenue Officer',
  'Marketing Manager',
  'CEO/Founder',
  'Other',
];

const INDUSTRIES = [
  'Technology',
  'Software',
  'Financial Services',
  'Healthcare',
  'Manufacturing',
  'Retail',
  'Real Estate',
  'Consulting',
  'Education',
  'Other',
];

const TEAM_SIZES = [
  '1-5 people',
  '6-10 people',
  '11-25 people',
  '26-50 people',
  '51-100 people',
  '101-500 people',
  '500+ people',
];

export function ProfileStep({ onNext }: ProfileStepProps) {
  const { user } = useAuth();
  const { validateProfile } = useProfileValidation();
  
  const [formData, setFormData] = useState({
    name: user?.displayName || '',
    role: '',
    industry: '',
    teamSize: '',
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validation = validateProfile(formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      const result = await onNext(formData);
      
      if (!result.success) {
        setErrors({ submit: result.error || 'Failed to save profile' });
      }
    } catch (error) {
      setErrors({ submit: 'An unexpected error occurred' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="rounded-2xl bg-slate-900/50 p-8 shadow-xl backdrop-blur-sm border border-slate-800/50">
      <div className="mb-8 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-indigo-500 to-purple-600">
          <User className="h-8 w-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-white">Tell us about yourself</h2>
        <p className="mt-2 text-slate-400">
          Help us personalize your experience and set up your account
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Name */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-slate-200 mb-2">
            Full Name *
          </label>
          <input
            type="text"
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className={`block w-full rounded-lg border bg-slate-800/50 px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 ${
              errors.name
                ? 'border-red-500 focus:ring-red-500'
                : 'border-slate-600 focus:ring-indigo-500'
            }`}
            placeholder="Enter your full name"
          />
          {errors.name && <p className="mt-1 text-sm text-red-400">{errors.name}</p>}
        </div>

        {/* Role */}
        <div>
          <label htmlFor="role" className="block text-sm font-medium text-slate-200 mb-2">
            Your Role *
          </label>
          <div className="relative">
            <select
              id="role"
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              className={`block w-full rounded-lg border bg-slate-800/50 px-4 py-3 text-white focus:outline-none focus:ring-2 appearance-none ${
                errors.role
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-slate-600 focus:ring-indigo-500'
              }`}
            >
              <option value="">Select your role</option>
              {ROLES.map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </select>
            <Briefcase className="absolute right-3 top-3.5 h-5 w-5 text-slate-400 pointer-events-none" />
          </div>
          {errors.role && <p className="mt-1 text-sm text-red-400">{errors.role}</p>}
        </div>

        {/* Industry */}
        <div>
          <label htmlFor="industry" className="block text-sm font-medium text-slate-200 mb-2">
            Industry
          </label>
          <div className="relative">
            <select
              id="industry"
              value={formData.industry}
              onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
              className="block w-full rounded-lg border border-slate-600 bg-slate-800/50 px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none"
            >
              <option value="">Select your industry (optional)</option>
              {INDUSTRIES.map((industry) => (
                <option key={industry} value={industry}>
                  {industry}
                </option>
              ))}
            </select>
            <Building className="absolute right-3 top-3.5 h-5 w-5 text-slate-400 pointer-events-none" />
          </div>
        </div>

        {/* Team Size */}
        <div>
          <label htmlFor="teamSize" className="block text-sm font-medium text-slate-200 mb-2">
            Team Size
          </label>
          <div className="relative">
            <select
              id="teamSize"
              value={formData.teamSize}
              onChange={(e) => setFormData({ ...formData, teamSize: e.target.value })}
              className="block w-full rounded-lg border border-slate-600 bg-slate-800/50 px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none"
            >
              <option value="">Select team size (optional)</option>
              {TEAM_SIZES.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
            <Users className="absolute right-3 top-3.5 h-5 w-5 text-slate-400 pointer-events-none" />
          </div>
        </div>

        {/* Submit Error */}
        {errors.submit && (
          <div className="rounded-lg bg-red-900/50 border border-red-500/50 p-4">
            <p className="text-sm text-red-400">{errors.submit}</p>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 py-3 px-4 text-white font-medium hover:from-indigo-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
        >
          {isLoading ? 'Saving...' : 'Continue'}
        </button>
      </form>

      {/* Help Text */}
      <div className="mt-6 rounded-lg bg-slate-800/50 p-4">
        <p className="text-xs text-slate-400">
          <strong>Why we ask:</strong> This information helps us customize your dashboard, 
          suggest relevant features, and connect you with the right tools for your role.
        </p>
      </div>
    </div>
  );
}
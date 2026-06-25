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
    <div className="rounded-2xl border border-slate-800/50 bg-slate-900/50 p-8 shadow-xl backdrop-blur-sm">
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
          <label htmlFor="name" className="mb-2 block text-sm font-medium text-slate-200">
            Full Name *
          </label>
          <input
            type="text"
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className={`block w-full rounded-lg border bg-slate-800/50 px-4 py-3 text-white placeholder-slate-400 focus:ring-2 focus:outline-none ${
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
          <label htmlFor="role" className="mb-2 block text-sm font-medium text-slate-200">
            Your Role *
          </label>
          <div className="relative">
            <select
              id="role"
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              className={`block w-full appearance-none rounded-lg border bg-slate-800/50 px-4 py-3 text-white focus:ring-2 focus:outline-none ${
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
            <Briefcase className="pointer-events-none absolute top-3.5 right-3 h-5 w-5 text-slate-400" />
          </div>
          {errors.role && <p className="mt-1 text-sm text-red-400">{errors.role}</p>}
        </div>

        {/* Industry */}
        <div>
          <label htmlFor="industry" className="mb-2 block text-sm font-medium text-slate-200">
            Industry
          </label>
          <div className="relative">
            <select
              id="industry"
              value={formData.industry}
              onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
              className="block w-full appearance-none rounded-lg border border-slate-600 bg-slate-800/50 px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            >
              <option value="">Select your industry (optional)</option>
              {INDUSTRIES.map((industry) => (
                <option key={industry} value={industry}>
                  {industry}
                </option>
              ))}
            </select>
            <Building className="pointer-events-none absolute top-3.5 right-3 h-5 w-5 text-slate-400" />
          </div>
        </div>

        {/* Team Size */}
        <div>
          <label htmlFor="teamSize" className="mb-2 block text-sm font-medium text-slate-200">
            Team Size
          </label>
          <div className="relative">
            <select
              id="teamSize"
              value={formData.teamSize}
              onChange={(e) => setFormData({ ...formData, teamSize: e.target.value })}
              className="block w-full appearance-none rounded-lg border border-slate-600 bg-slate-800/50 px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            >
              <option value="">Select team size (optional)</option>
              {TEAM_SIZES.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
            <Users className="pointer-events-none absolute top-3.5 right-3 h-5 w-5 text-slate-400" />
          </div>
        </div>

        {/* Submit Error */}
        {errors.submit && (
          <div className="rounded-lg border border-red-500/50 bg-red-900/50 p-4">
            <p className="text-sm text-red-400">{errors.submit}</p>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 px-4 py-3 font-medium text-white transition-all duration-200 hover:from-indigo-600 hover:to-purple-700 focus:ring-2 focus:ring-indigo-500 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isLoading ? 'Saving...' : 'Continue'}
        </button>
      </form>

      {/* Help Text */}
      <div className="mt-6 rounded-lg bg-slate-800/50 p-4">
        <p className="text-xs text-slate-400">
          <strong>Why we ask:</strong> This information helps us customize your dashboard, suggest
          relevant features, and connect you with the right tools for your role.
        </p>
      </div>
    </div>
  );
}

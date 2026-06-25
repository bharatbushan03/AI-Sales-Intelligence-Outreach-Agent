/**
 * Organization Setup Step
 * Second step of onboarding - create organization
 */

'use client';

import React, { useState } from 'react';
import { Building2, Globe, Users, Briefcase } from 'lucide-react';
import { useOrganizationValidation } from '@/hooks/useOnboarding';

interface OrganizationStepProps {
  onNext: (data: {
    name: string;
    domain: string;
    industry?: string;
    size?: string;
  }) => Promise<{ success: boolean; error?: string }>;
}

const ORGANIZATION_SIZES = [
  'Startup (1-10 employees)',
  'Small Business (11-50 employees)',
  'Medium Business (51-200 employees)',
  'Large Enterprise (201-1000 employees)',
  'Enterprise (1000+ employees)',
];

const INDUSTRIES = [
  'Technology',
  'Software as a Service (SaaS)',
  'Financial Services',
  'Healthcare & Life Sciences',
  'Manufacturing',
  'Retail & E-commerce',
  'Real Estate',
  'Professional Services',
  'Education',
  'Media & Entertainment',
  'Transportation & Logistics',
  'Energy & Utilities',
  'Other',
];

export function OrganizationStep({ onNext }: OrganizationStepProps) {
  const { validateOrganization } = useOrganizationValidation();

  const [formData, setFormData] = useState({
    name: '',
    domain: '',
    industry: '',
    size: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validation = validateOrganization(formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      const result = await onNext(formData);

      if (!result.success) {
        setErrors({ submit: result.error || 'Failed to create organization' });
      }
    } catch (error) {
      setErrors({ submit: 'An unexpected error occurred' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDomainChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase().replace(/[^a-z0-9.-]/g, '');
    setFormData({ ...formData, domain: value });
  };

  const suggestDomainFromName = () => {
    if (formData.name && !formData.domain) {
      const suggestion =
        formData.name
          .toLowerCase()
          .replace(/[^a-z0-9\s]/g, '')
          .replace(/\s+/g, '')
          .substring(0, 20) + '.com';
      setFormData({ ...formData, domain: suggestion });
    }
  };

  return (
    <div className="rounded-2xl border border-slate-800/50 bg-slate-900/50 p-8 shadow-xl backdrop-blur-sm">
      <div className="mb-8 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-indigo-500 to-purple-600">
          <Building2 className="h-8 w-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-white">Setup Your Organization</h2>
        <p className="mt-2 text-slate-400">
          Create your organization to start collaborating with your team
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Organization Name */}
        <div>
          <label htmlFor="name" className="mb-2 block text-sm font-medium text-slate-200">
            Organization Name *
          </label>
          <input
            type="text"
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            onBlur={suggestDomainFromName}
            className={`block w-full rounded-lg border bg-slate-800/50 px-4 py-3 text-white placeholder-slate-400 focus:ring-2 focus:outline-none ${
              errors.name
                ? 'border-red-500 focus:ring-red-500'
                : 'border-slate-600 focus:ring-indigo-500'
            }`}
            placeholder="e.g., Acme Corporation"
          />
          {errors.name && <p className="mt-1 text-sm text-red-400">{errors.name}</p>}
        </div>

        {/* Domain */}
        <div>
          <label htmlFor="domain" className="mb-2 block text-sm font-medium text-slate-200">
            Company Domain *
          </label>
          <div className="relative">
            <input
              type="text"
              id="domain"
              value={formData.domain}
              onChange={handleDomainChange}
              className={`block w-full rounded-lg border bg-slate-800/50 px-4 py-3 pl-10 text-white placeholder-slate-400 focus:ring-2 focus:outline-none ${
                errors.domain
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-slate-600 focus:ring-indigo-500'
              }`}
              placeholder="company.com"
            />
            <Globe className="absolute top-3.5 left-3 h-5 w-5 text-slate-400" />
          </div>
          {errors.domain && <p className="mt-1 text-sm text-red-400">{errors.domain}</p>}
          <p className="mt-1 text-xs text-slate-500">
            This will be used for team invitations and organization identification
          </p>
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
              <option value="">Select industry (optional)</option>
              {INDUSTRIES.map((industry) => (
                <option key={industry} value={industry}>
                  {industry}
                </option>
              ))}
            </select>
            <Briefcase className="pointer-events-none absolute top-3.5 right-3 h-5 w-5 text-slate-400" />
          </div>
        </div>

        {/* Organization Size */}
        <div>
          <label htmlFor="size" className="mb-2 block text-sm font-medium text-slate-200">
            Organization Size
          </label>
          <div className="relative">
            <select
              id="size"
              value={formData.size}
              onChange={(e) => setFormData({ ...formData, size: e.target.value })}
              className="block w-full appearance-none rounded-lg border border-slate-600 bg-slate-800/50 px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            >
              <option value="">Select organization size (optional)</option>
              {ORGANIZATION_SIZES.map((size) => (
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
          {isLoading ? 'Creating Organization...' : 'Create Organization'}
        </button>
      </form>

      {/* Features Preview */}
      <div className="mt-8 rounded-lg border border-indigo-500/20 bg-gradient-to-r from-indigo-500/10 to-purple-600/10 p-4">
        <h3 className="mb-2 text-sm font-medium text-indigo-400">What you'll get:</h3>
        <ul className="space-y-1 text-xs text-slate-300">
          <li className="flex items-center space-x-2">
            <div className="h-1.5 w-1.5 rounded-full bg-indigo-400" />
            <span>Team collaboration and workspace management</span>
          </li>
          <li className="flex items-center space-x-2">
            <div className="h-1.5 w-1.5 rounded-full bg-indigo-400" />
            <span>Role-based access control for security</span>
          </li>
          <li className="flex items-center space-x-2">
            <div className="h-1.5 w-1.5 rounded-full bg-indigo-400" />
            <span>Centralized billing and plan management</span>
          </li>
          <li className="flex items-center space-x-2">
            <div className="h-1.5 w-1.5 rounded-full bg-indigo-400" />
            <span>Activity tracking and audit logs</span>
          </li>
        </ul>
      </div>
    </div>
  );
}

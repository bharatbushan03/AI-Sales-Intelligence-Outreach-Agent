/**
 * Workspace Setup Step
 * Third step of onboarding - create default workspace
 */

'use client';

import React, { useState } from 'react';
import { FolderOpen, Target, Users, MessageSquare, Settings } from 'lucide-react';

interface WorkspaceStepProps {
  onNext: (data: {
    name: string;
    description?: string;
    type?: string;
  }) => Promise<{ success: boolean; error?: string }>;
}

const WORKSPACE_TYPES = [
  {
    id: 'sales',
    name: 'Sales Team',
    icon: Target,
    description: 'Focus on lead generation, outreach, and deal closing',
    features: ['CRM Integration', 'Email Sequences', 'Proposal Generation', 'Pipeline Management'],
  },
  {
    id: 'marketing',
    name: 'Marketing Team',
    icon: MessageSquare,
    description: 'Content creation, campaign management, and lead nurturing',
    features: ['Campaign Tracking', 'Content Library', 'Lead Scoring', 'Analytics'],
  },
  {
    id: 'customer_success',
    name: 'Customer Success',
    icon: Users,
    description: 'Customer retention, upselling, and relationship management',
    features: ['Account Health', 'Renewal Tracking', 'Expansion Opportunities', 'Success Metrics'],
  },
  {
    id: 'general',
    name: 'General Workspace',
    icon: Settings,
    description: 'Flexible workspace for mixed teams and general use',
    features: ['Custom Workflows', 'Flexible Setup', 'Multi-purpose Tools', 'Team Collaboration'],
  },
];

export function WorkspaceStep({ onNext }: WorkspaceStepProps) {
  const [formData, setFormData] = useState({
    name: 'Sales Workspace',
    description: '',
    type: 'sales',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const selectedWorkspaceType = WORKSPACE_TYPES.find((type) => type.id === formData.type);

  const handleTypeSelect = (typeId: string) => {
    const workspaceType = WORKSPACE_TYPES.find((type) => type.id === typeId);
    if (workspaceType) {
      setFormData({
        ...formData,
        type: typeId,
        name: workspaceType.name,
        description: workspaceType.description,
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      setErrors({ name: 'Workspace name is required' });
      return;
    }

    if (formData.name.length < 2) {
      setErrors({ name: 'Workspace name must be at least 2 characters' });
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      const result = await onNext(formData);

      if (!result.success) {
        setErrors({ submit: result.error || 'Failed to create workspace' });
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
          <FolderOpen className="h-8 w-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-white">Create Your First Workspace</h2>
        <p className="mt-2 text-slate-400">
          Workspaces help organize your team's activities and tools
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Workspace Type Selection */}
        <div>
          <label className="mb-4 block text-sm font-medium text-slate-200">
            Choose Workspace Type
          </label>
          <div className="grid gap-4 sm:grid-cols-2">
            {WORKSPACE_TYPES.map((type) => {
              const Icon = type.icon;
              const isSelected = formData.type === type.id;

              return (
                <button
                  key={type.id}
                  type="button"
                  onClick={() => handleTypeSelect(type.id)}
                  className={`rounded-lg border-2 p-4 text-left transition-all ${
                    isSelected
                      ? 'border-indigo-500 bg-indigo-500/10'
                      : 'border-slate-600 bg-slate-800/50 hover:border-slate-500'
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <div
                      className={`rounded-lg p-2 ${isSelected ? 'bg-indigo-500' : 'bg-slate-700'}`}
                    >
                      <Icon className={`h-5 w-5 ${isSelected ? 'text-white' : 'text-slate-400'}`} />
                    </div>
                    <div className="flex-1">
                      <h3
                        className={`text-sm font-medium ${
                          isSelected ? 'text-indigo-400' : 'text-white'
                        }`}
                      >
                        {type.name}
                      </h3>
                      <p className="mt-1 text-xs text-slate-400">{type.description}</p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Type Features */}
        {selectedWorkspaceType && (
          <div className="rounded-lg border border-slate-700 bg-slate-800/50 p-4">
            <h4 className="mb-3 text-sm font-medium text-slate-200">
              {selectedWorkspaceType.name} includes:
            </h4>
            <div className="grid gap-2 sm:grid-cols-2">
              {selectedWorkspaceType.features.map((feature, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-indigo-400" />
                  <span className="text-xs text-slate-300">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Workspace Name */}
        <div>
          <label htmlFor="name" className="mb-2 block text-sm font-medium text-slate-200">
            Workspace Name *
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
            placeholder="e.g., Sales Team"
          />
          {errors.name && <p className="mt-1 text-sm text-red-400">{errors.name}</p>}
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="mb-2 block text-sm font-medium text-slate-200">
            Description (Optional)
          </label>
          <textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={3}
            className="block w-full resize-none rounded-lg border border-slate-600 bg-slate-800/50 px-4 py-3 text-white placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            placeholder="Describe what this workspace will be used for..."
          />
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
          {isLoading ? 'Creating Workspace...' : 'Create Workspace'}
        </button>
      </form>

      {/* Info Box */}
      <div className="mt-8 rounded-lg border border-blue-500/20 bg-blue-900/20 p-4">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            <svg
              className="h-5 w-5 text-blue-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <div>
            <h4 className="text-sm font-medium text-blue-400">You can always customize later</h4>
            <p className="mt-1 text-xs text-slate-400">
              Don't worry about getting everything perfect now. You can create additional
              workspaces, change settings, and invite team members after completing the setup.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

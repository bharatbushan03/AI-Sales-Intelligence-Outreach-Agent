/**
 * Complete Step
 * Final step of onboarding - invite team members and complete setup
 */

'use client';

import React, { useState } from 'react';
import { CheckCircle, Mail, Plus, X, Users } from 'lucide-react';
import { isValidEmail } from '@/utils/api-response';

interface CompleteStepProps {
  onComplete: (inviteEmails?: string[]) => Promise<{ 
    success: boolean; 
    error?: string;
    invitations?: any[];
  }>;
}

export function CompleteStep({ onComplete }: CompleteStepProps) {
  const [inviteEmails, setInviteEmails] = useState<string[]>(['']);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showInvites, setShowInvites] = useState(false);
  const [completionData, setCompletionData] = useState<any>(null);

  const handleAddEmail = () => {
    setInviteEmails([...inviteEmails, '']);
  };

  const handleRemoveEmail = (index: number) => {
    setInviteEmails(inviteEmails.filter((_, i) => i !== index));
  };

  const handleEmailChange = (index: number, value: string) => {
    const newEmails = [...inviteEmails];
    newEmails[index] = value;
    setInviteEmails(newEmails);
  };

  const validateEmails = () => {
    const validEmails = inviteEmails.filter(email => email.trim() && isValidEmail(email.trim()));
    const invalidEmails = inviteEmails.filter(email => email.trim() && !isValidEmail(email.trim()));
    
    if (invalidEmails.length > 0) {
      setErrors({ emails: `Invalid email addresses: ${invalidEmails.join(', ')}` });
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (skipInvites = false) => {
    const emailsToSend = skipInvites ? [] : inviteEmails.filter(email => email.trim());
    
    if (!skipInvites && emailsToSend.length > 0 && !validateEmails()) {
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      const result = await onComplete(emailsToSend.map(email => email.trim()));
      
      if (result.success) {
        setCompletionData(result);
      } else {
        setErrors({ submit: result.error || 'Failed to complete onboarding' });
      }
    } catch (error) {
      setErrors({ submit: 'An unexpected error occurred' });
    } finally {
      setIsLoading(false);
    }
  };

  if (completionData) {
    return (
      <div className="text-center">
        {/* Success State */}
        <div className="rounded-2xl bg-slate-900/50 p-8 shadow-xl backdrop-blur-sm border border-slate-800/50">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-r from-green-500 to-emerald-600">
            <CheckCircle className="h-10 w-10 text-white" />
          </div>
          
          <h2 className="text-3xl font-bold text-white mb-4">Welcome to B2B Sales Intelligence!</h2>
          <p className="text-lg text-slate-300 mb-8">
            Your account is ready. Let's start boosting your sales performance.
          </p>

          {/* Invitation Summary */}
          {completionData.invitations && completionData.invitations.length > 0 && (
            <div className="mb-8 rounded-lg bg-indigo-900/20 border border-indigo-500/20 p-6">
              <div className="flex items-center justify-center space-x-2 mb-4">
                <Mail className="h-5 w-5 text-indigo-400" />
                <h3 className="text-lg font-medium text-indigo-400">Team Invitations Sent</h3>
              </div>
              <p className="text-slate-300 mb-4">
                We've sent invitations to {completionData.invitations.length} team member
                {completionData.invitations.length > 1 ? 's' : ''}:
              </p>
              <div className="space-y-2">
                {completionData.invitations.map((invitation: any, index: number) => (
                  <div key={index} className="flex items-center justify-between bg-slate-800/50 rounded-lg p-3">
                    <span className="text-sm text-slate-200">{invitation.email}</span>
                    <span className="text-xs text-indigo-400 bg-indigo-900/50 px-2 py-1 rounded">
                      {invitation.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Next Steps */}
          <div className="text-left mb-8">
            <h3 className="text-lg font-medium text-white mb-4">What's next?</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-lg bg-slate-800/50 p-4 border border-slate-700">
                <h4 className="text-sm font-medium text-slate-200 mb-2">Explore Your Dashboard</h4>
                <p className="text-xs text-slate-400">
                  Get familiar with your new workspace and available tools
                </p>
              </div>
              <div className="rounded-lg bg-slate-800/50 p-4 border border-slate-700">
                <h4 className="text-sm font-medium text-slate-200 mb-2">Run Your First Workflow</h4>
                <p className="text-xs text-slate-400">
                  Start with lead research or proposal generation
                </p>
              </div>
              <div className="rounded-lg bg-slate-800/50 p-4 border border-slate-700">
                <h4 className="text-sm font-medium text-slate-200 mb-2">Connect Your CRM</h4>
                <p className="text-xs text-slate-400">
                  Integrate with Salesforce, HubSpot, or other CRM systems
                </p>
              </div>
              <div className="rounded-lg bg-slate-800/50 p-4 border border-slate-700">
                <h4 className="text-sm font-medium text-slate-200 mb-2">Customize Settings</h4>
                <p className="text-xs text-slate-400">
                  Set up preferences, notifications, and team permissions
                </p>
              </div>
            </div>
          </div>

          {/* Get Started Button */}
          <button
            onClick={() => window.location.href = '/dashboard'}
            className="w-full rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 py-3 px-6 text-white font-medium hover:from-indigo-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200"
          >
            Get Started
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-slate-900/50 p-8 shadow-xl backdrop-blur-sm border border-slate-800/50">
      <div className="mb-8 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-indigo-500 to-purple-600">
          <Users className="h-8 w-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-white">Invite Your Team</h2>
        <p className="mt-2 text-slate-400">
          Get your team started with collaborative sales intelligence
        </p>
      </div>

      <div className="space-y-6">
        {/* Skip or Invite Toggle */}
        <div className="flex items-center justify-center space-x-4">
          <button
            onClick={() => setShowInvites(false)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              !showInvites
                ? 'bg-indigo-600 text-white'
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
          >
            Skip for now
          </button>
          <button
            onClick={() => setShowInvites(true)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              showInvites
                ? 'bg-indigo-600 text-white'
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
          >
            Invite team members
          </button>
        </div>

        {showInvites && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-200 mb-3">
                Team Member Email Addresses
              </label>
              
              {inviteEmails.map((email, index) => (
                <div key={index} className="flex items-center space-x-2 mb-2">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => handleEmailChange(index, e.target.value)}
                    className="flex-1 rounded-lg border border-slate-600 bg-slate-800/50 px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="colleague@company.com"
                  />
                  {inviteEmails.length > 1 && (
                    <button
                      onClick={() => handleRemoveEmail(index)}
                      className="p-2 text-slate-400 hover:text-red-400 transition-colors"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  )}
                </div>
              ))}
              
              <button
                onClick={handleAddEmail}
                className="flex items-center space-x-2 text-indigo-400 hover:text-indigo-300 text-sm"
              >
                <Plus className="h-4 w-4" />
                <span>Add another email</span>
              </button>
            </div>

            {errors.emails && (
              <div className="rounded-lg bg-red-900/50 border border-red-500/50 p-4">
                <p className="text-sm text-red-400">{errors.emails}</p>
              </div>
            )}

            {/* Team Member Benefits */}
            <div className="rounded-lg bg-slate-800/50 p-4 border border-slate-700">
              <h4 className="text-sm font-medium text-slate-200 mb-3">
                What your team members will get:
              </h4>
              <ul className="space-y-2">
                {[
                  'Access to your shared workspace and tools',
                  'Ability to collaborate on research and proposals',
                  'Real-time updates on team activities',
                  'Role-based permissions for security',
                ].map((benefit, index) => (
                  <li key={index} className="flex items-center space-x-2 text-xs text-slate-300">
                    <div className="h-1.5 w-1.5 rounded-full bg-indigo-400" />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Submit Error */}
        {errors.submit && (
          <div className="rounded-lg bg-red-900/50 border border-red-500/50 p-4">
            <p className="text-sm text-red-400">{errors.submit}</p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-3">
          {showInvites ? (
            <>
              <button
                onClick={() => handleSubmit(false)}
                disabled={isLoading}
                className="w-full rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 py-3 px-4 text-white font-medium hover:from-indigo-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                {isLoading ? 'Sending Invitations...' : 'Send Invitations & Complete Setup'}
              </button>
              <button
                onClick={() => handleSubmit(true)}
                disabled={isLoading}
                className="w-full rounded-lg bg-slate-700 py-3 px-4 text-slate-200 font-medium hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-slate-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                Skip Invitations & Complete Setup
              </button>
            </>
          ) : (
            <button
              onClick={() => handleSubmit(true)}
              disabled={isLoading}
              className="w-full rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 py-3 px-4 text-white font-medium hover:from-indigo-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              {isLoading ? 'Completing Setup...' : 'Complete Setup'}
            </button>
          )}
        </div>

        {/* Help Text */}
        <div className="text-center text-xs text-slate-400">
          You can always invite team members later from your organization settings
        </div>
      </div>
    </div>
  );
}
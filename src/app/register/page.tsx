'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { Bot, User, Building, Sliders, CheckCircle, RefreshCw } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  
  // Onboarding Stepper: 1: Account info, 2: Organization setup, 3: SaaS Preferences
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [roleTitle, setRoleTitle] = useState('Sales Representative');
  const [industry, setIndustry] = useState('Technology');
  const [teamSize, setTeamSize] = useState('1-10');

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    if (step === 1 && (!email || !password || !name)) {
      setErrorMsg('Please specify your credentials and name.');
      return;
    }
    if (step === 2 && !companyName) {
      setErrorMsg('Please specify your organization name.');
      return;
    }
    setStep(step + 1);
  };

  const handleOnboardingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg(null);

    try {
      // 1. Create Firebase Auth user
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const userId = userCredential.user.uid;

      // 2. Persist SaaS organization, workspace, and user document to Firestore via API route
      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          name,
          email,
          companyName,
          role: roleTitle,
          industry,
          teamSize,
        }),
      });

      const resData = await response.json();
      if (!response.ok) {
        throw new Error(resData.message || 'Failed to complete registration setup');
      }

      // Restore active workspace session locally
      if (resData.data?.workspaceId) {
        localStorage.setItem('active_workspace_id', resData.data.workspaceId);
      }

      router.push('/dashboard');
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to establish B2B SaaS onboarding profiles.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-950 px-4 text-slate-100 pb-16">
      <div className="w-full max-w-md space-y-8 rounded-3xl border border-slate-800/80 bg-slate-900/30 p-8 backdrop-blur-xl">
        {/* Step Indicator Header */}
        <div className="flex justify-between items-center pb-5 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Bot className="h-6 w-6 text-indigo-400" />
            <span className="text-sm font-bold text-white tracking-wide uppercase">Onboarding</span>
          </div>
          <div className="flex gap-1.5">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`h-2.5 w-2.5 rounded-full ${
                  s === step ? 'bg-indigo-500 scale-110' : s < step ? 'bg-emerald-500' : 'bg-slate-800'
                } transition-all duration-200`}
              />
            ))}
          </div>
        </div>

        {errorMsg && (
          <div className="rounded-xl border border-rose-900/50 bg-rose-950/40 p-4 text-xs font-semibold text-rose-300 text-center">
            {errorMsg}
          </div>
        )}

        {/* Step 1: User Account details */}
        {step === 1 && (
          <form onSubmit={handleNextStep} className="space-y-4">
            <div className="flex items-center gap-2.5 pb-2">
              <User className="h-5 w-5 text-indigo-400" />
              <h3 className="text-md font-bold text-slate-200">Account Credentials</h3>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase text-slate-400">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                className="w-full rounded-xl border border-slate-850 bg-slate-950 px-4 py-2.5 text-sm text-slate-200 focus:border-indigo-500 focus:outline-none"
                required
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase text-slate-400">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                className="w-full rounded-xl border border-slate-850 bg-slate-950 px-4 py-2.5 text-sm text-slate-200 focus:border-indigo-500 focus:outline-none"
                required
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase text-slate-400">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Min 6 characters"
                className="w-full rounded-xl border border-slate-850 bg-slate-950 px-4 py-2.5 text-sm text-slate-200 focus:border-indigo-500 focus:outline-none"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full rounded-xl bg-indigo-650 hover:bg-indigo-700 text-white font-bold py-3 text-sm transition-colors mt-2"
            >
              Continue to Organization Setup
            </button>
          </form>
        )}

        {/* Step 2: Org details */}
        {step === 2 && (
          <form onSubmit={handleNextStep} className="space-y-4">
            <div className="flex items-center gap-2.5 pb-2">
              <Building className="h-5 w-5 text-indigo-400" />
              <h3 className="text-md font-bold text-slate-200">Organization Info</h3>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase text-slate-400">Company Name</label>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="Stripe Inc."
                className="w-full rounded-xl border border-slate-850 bg-slate-950 px-4 py-2.5 text-sm text-slate-200 focus:border-indigo-500 focus:outline-none"
                required
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase text-slate-400">Your Title Role</label>
              <select
                value={roleTitle}
                onChange={(e) => setRoleTitle(e.target.value)}
                className="w-full rounded-xl border border-slate-850 bg-slate-950 px-4 py-2.5 text-sm text-slate-200 focus:border-indigo-500 focus:outline-none"
              >
                <option value="Sales Representative">Sales Representative</option>
                <option value="Sales Manager">Sales Manager</option>
                <option value="VP of Sales">VP of Sales</option>
                <option value="Founder / CEO">Founder / CEO</option>
                <option value="Account Executive">Account Executive</option>
              </select>
            </div>
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="w-1/3 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 py-3 text-sm font-semibold"
              >
                Back
              </button>
              <button
                type="submit"
                className="w-2/3 rounded-xl bg-indigo-650 hover:bg-indigo-700 text-white font-bold py-3 text-sm transition-colors"
              >
                Continue
              </button>
            </div>
          </form>
        )}

        {/* Step 3: SaaS Preferences & Industry */}
        {step === 3 && (
          <form onSubmit={handleOnboardingSubmit} className="space-y-4">
            <div className="flex items-center gap-2.5 pb-2">
              <Sliders className="h-5 w-5 text-indigo-400" />
              <h3 className="text-md font-bold text-slate-200">System Preferences</h3>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase text-slate-400">Target Customer Industry</label>
              <select
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                className="w-full rounded-xl border border-slate-850 bg-slate-950 px-4 py-2.5 text-sm text-slate-200 focus:border-indigo-500 focus:outline-none"
              >
                <option value="Technology">Technology</option>
                <option value="Financial Services">Financial Services</option>
                <option value="Healthcare">Healthcare</option>
                <option value="Retail & E-commerce">Retail & E-commerce</option>
                <option value="Manufacturing">Manufacturing</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase text-slate-400">Outreach Team Size</label>
              <select
                value={teamSize}
                onChange={(e) => setTeamSize(e.target.value)}
                className="w-full rounded-xl border border-slate-850 bg-slate-950 px-4 py-2.5 text-sm text-slate-200 focus:border-indigo-500 focus:outline-none"
              >
                <option value="1-10">1-10 Employees</option>
                <option value="11-50">11-50 Employees</option>
                <option value="51-200">51-200 Employees</option>
                <option value="201+">201+ Employees</option>
              </select>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="w-1/3 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 py-3 text-sm font-semibold"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="w-2/3 rounded-xl bg-indigo-650 hover:bg-indigo-700 text-white font-bold py-3 text-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {submitting && <RefreshCw className="h-4 w-4 animate-spin" />}
                {submitting ? 'Setting up...' : 'Provision Platform'}
              </button>
            </div>
          </form>
        )}

        <div className="flex justify-center border-t border-slate-850 pt-4 text-xs text-slate-400">
          Already have an account?{' '}
          <Link href="/login" className="font-semibold text-indigo-400 hover:text-indigo-300 ml-1">
            Sign In here
          </Link>
        </div>
      </div>
    </div>
  );
}

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { Bot, Mail, ShieldCheck, RefreshCw, ArrowLeft } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg(null);
    setSuccessMsg(null);
    try {
      await sendPasswordResetEmail(auth, email);
      setSuccessMsg('Password reset instructions dispatched. Please check your inbox.');
      setEmail('');
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to dispatch reset instructions.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-950 px-4 text-slate-100">
      <div className="w-full max-w-md space-y-8 rounded-3xl border border-slate-800/80 bg-slate-900/30 p-8 backdrop-blur-xl">
        <div className="flex flex-col items-center text-center space-y-2">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-indigo-900/50 bg-indigo-950/80 text-indigo-400">
            <Bot className="h-6 w-6" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-white">Reset Password</h2>
          <p className="text-xs text-slate-400">
            Enter your email to receive recovery instructions
          </p>
        </div>

        {errorMsg && (
          <div className="rounded-xl border border-rose-900/50 bg-rose-950/40 p-4 text-xs font-semibold text-rose-300 text-center">
            {errorMsg}
          </div>
        )}

        {successMsg && (
          <div className="rounded-xl border border-emerald-900/50 bg-emerald-950/40 p-4 text-xs font-semibold text-emerald-300 text-center">
            {successMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4.5 w-4.5 text-slate-500" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                className="w-full rounded-xl border border-slate-850 bg-slate-950 pl-10 pr-4 py-2.5 text-sm text-slate-200 focus:border-indigo-500 focus:outline-none"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-xl bg-indigo-650 hover:bg-indigo-700 text-white font-bold py-3 text-sm transition flex items-center justify-center gap-2"
          >
            {submitting && <RefreshCw className="h-4 w-4 animate-spin" />}
            Reset Credentials
          </button>
        </form>

        <div className="flex justify-center border-t border-slate-850 pt-4">
          <Link href="/login" className="flex items-center gap-1.5 text-xs text-indigo-400 hover:text-indigo-300 font-semibold">
            <ArrowLeft className="h-3.5 w-3.5" /> Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}

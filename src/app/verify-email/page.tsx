'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { sendEmailVerification } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { Bot, Mail, RefreshCw, AlertTriangle } from 'lucide-react';

export default function VerifyEmailPage() {
  const router = useRouter();
  const [sending, setSending] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleResend = async () => {
    setSending(true);
    setErrorMsg(null);
    setSuccessMsg(null);
    try {
      const user = auth.currentUser;
      if (user) {
        await sendEmailVerification(user);
        setSuccessMsg('A fresh verification link has been dispatched to your email.');
      } else {
        setErrorMsg('No authenticated user session found. Please sign in first.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to dispatch verification email.');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-950 px-4 text-slate-100">
      <div className="w-full max-w-md space-y-8 rounded-3xl border border-slate-800/80 bg-slate-900/30 p-8 backdrop-blur-xl">
        <div className="flex flex-col items-center space-y-2 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-indigo-900/50 bg-indigo-950/80 text-indigo-400">
            <Mail className="h-6 w-6" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-white">Verify Your Email</h2>
          <p className="text-xs text-slate-400">
            Please confirm your email address to active your SaaS workspace features.
          </p>
        </div>

        {errorMsg && (
          <div className="flex items-center justify-center gap-2 rounded-xl border border-rose-900/50 bg-rose-950/40 p-4 text-center text-xs font-semibold text-rose-300">
            <AlertTriangle className="h-4 w-4" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="rounded-xl border border-emerald-900/50 bg-emerald-950/40 p-4 text-center text-xs font-semibold text-emerald-300">
            {successMsg}
          </div>
        )}

        <div className="text-center text-sm leading-relaxed text-slate-400">
          We have sent a verification code link to your email address. Once confirmed, refresh this
          page or sign in again to access the portal dashboard.
        </div>

        <button
          onClick={handleResend}
          disabled={sending}
          className="bg-indigo-650 flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold text-white transition hover:bg-indigo-700 disabled:opacity-50"
        >
          {sending && <RefreshCw className="h-4 w-4 animate-spin" />}
          Resend Verification Email
        </button>

        <div className="border-slate-850 flex justify-center border-t pt-4">
          <button
            onClick={() => router.push('/login')}
            className="text-xs font-semibold text-indigo-400 hover:text-indigo-300"
          >
            Back to Sign In page
          </button>
        </div>
      </div>
    </div>
  );
}

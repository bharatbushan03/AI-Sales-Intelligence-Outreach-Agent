'use client';

import React, { useState } from 'react';
import { Play, RotateCcw, Loader2 } from 'lucide-react';
import { clsx } from 'clsx';

export function JudgeModeToggle() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const resetDemo = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/demo/reset', {
        method: 'POST',
        headers: {
          Authorization: 'Bearer demo-token-bypass',
        },
      });
      if (res.ok) {
        setSuccess(true);
        setTimeout(() => {
          setSuccess(false);
          window.location.reload();
        }, 1500);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const startDemo = () => {
    // Trigger global state or event for Guided Demo tour
    window.dispatchEvent(new CustomEvent('start-demo-tour'));
  };

  return (
    <div className="demo-step-judge-mode flex items-center gap-2 rounded-lg border border-indigo-100 bg-indigo-50 px-3 py-1.5 shadow-sm">
      <span className="hidden text-sm font-semibold text-indigo-700 sm:inline">Judge Mode</span>
      <button
        onClick={startDemo}
        className="flex items-center gap-1.5 rounded-md bg-indigo-600 px-3 py-1 text-xs font-medium text-white shadow transition-colors hover:bg-indigo-700"
      >
        <Play className="h-3.5 w-3.5" />
        Start Demo
      </button>
      <button
        onClick={resetDemo}
        disabled={loading}
        className="flex items-center gap-1.5 rounded-md bg-white px-3 py-1 text-xs font-medium text-slate-700 shadow transition-colors hover:bg-slate-50 disabled:opacity-50"
      >
        {loading ? (
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
        ) : (
          <RotateCcw className="h-3.5 w-3.5" />
        )}
        {success ? 'Resetting...' : 'Reset'}
      </button>
    </div>
  );
}

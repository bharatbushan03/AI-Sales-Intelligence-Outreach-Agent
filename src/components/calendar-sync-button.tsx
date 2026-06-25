'use client';

import { useState } from 'react';
import { Calendar, RefreshCw, Check, AlertCircle } from 'lucide-react';

export function CalendarSyncButton() {
  const [syncing, setSyncing] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSync = async () => {
    setSyncing(true);
    setStatus('idle');
    try {
      const res = await fetch('/api/calendar/sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userDomain: 'acmecorp.com' }), // Example domain
      });

      const data = await res.json();

      if (data.success) {
        setStatus('success');
        setMessage(data.message || 'Synced successfully');
      } else {
        setStatus('error');
        setMessage(data.error || 'Failed to sync');
      }
    } catch (err) {
      setStatus('error');
      setMessage('Network error during sync');
    } finally {
      setSyncing(false);

      // Reset status after a few seconds
      setTimeout(() => {
        if (status !== 'error') {
          setStatus('idle');
          setMessage('');
        }
      }, 5000);
    }
  };

  return (
    <div className="flex flex-col items-end">
      <button
        onClick={handleSync}
        disabled={syncing}
        className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all ${
          syncing
            ? 'cursor-not-allowed bg-indigo-500/50 text-indigo-200'
            : status === 'success'
              ? 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30'
              : status === 'error'
                ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
                : 'bg-indigo-500 text-white hover:bg-indigo-600'
        }`}
      >
        {syncing ? (
          <RefreshCw className="h-4 w-4 animate-spin" />
        ) : status === 'success' ? (
          <Check className="h-4 w-4" />
        ) : status === 'error' ? (
          <AlertCircle className="h-4 w-4" />
        ) : (
          <Calendar className="h-4 w-4" />
        )}
        {syncing
          ? 'Syncing...'
          : status === 'success'
            ? 'Synced'
            : status === 'error'
              ? 'Sync Failed'
              : 'Sync Calendar'}
      </button>

      {message && status !== 'idle' && (
        <span
          className={`mt-2 text-xs ${status === 'error' ? 'text-red-400' : 'text-emerald-400'}`}
        >
          {message}
        </span>
      )}
    </div>
  );
}

'use client';

import { useState, type FormEvent } from 'react';

// ── Types ──────────────────────────────────────────────────────────────────────

type Status = 'idle' | 'loading' | 'success' | 'error';

interface Props {
  variant?: 'hero' | 'footer';
}

// ── Component ──────────────────────────────────────────────────────────────────

export function EmailSignup({ variant = 'hero' }: Props) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const [message, setMessage] = useState('');

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === 'loading' || status === 'success') return;

    setStatus('loading');

    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = (await res.json()) as { error?: string };

      if (!res.ok) {
        setStatus('error');
        setMessage(data.error ?? 'Something went wrong. Please try again.');
      } else {
        setStatus('success');
        setEmail('');
        setMessage("You're in! Check your email to confirm.");
      }
    } catch {
      setStatus('error');
      setMessage('Something went wrong. Please try again.');
    }
  }

  // ── Footer variant ───────────────────────────────────────────────────────────

  if (variant === 'footer') {
    return (
      <form onSubmit={handleSubmit} noValidate>
        <div className="flex max-w-sm flex-wrap gap-2">
          <input
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            required
            disabled={status === 'loading' || status === 'success'}
            className="h-10 min-w-0 flex-1 basis-32 rounded-lg border border-slate-600 bg-slate-800 px-3 text-sm text-white placeholder-slate-400 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400 disabled:opacity-60"
          />
          <button
            type="submit"
            disabled={status === 'loading' || status === 'success'}
            className="h-10 shrink-0 rounded-lg bg-orange-500 px-4 text-sm font-medium text-white transition-colors hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {status === 'loading' ? '…' : status === 'success' ? '✓' : 'Subscribe'}
          </button>
        </div>

        {message && (
          <p
            className={`mt-2 text-xs ${
              status === 'success' ? 'text-green-400' : 'text-red-400'
            }`}
          >
            {message}
          </p>
        )}
      </form>
    );
  }

  // ── Hero variant (default) ───────────────────────────────────────────────────

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-md" noValidate>
      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          type="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          required
          disabled={status === 'loading' || status === 'success'}
          className="h-12 flex-1 rounded-lg border border-slate-200 px-4 text-base shadow-sm placeholder-slate-400 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:opacity-60"
        />
        <button
          type="submit"
          disabled={status === 'loading' || status === 'success'}
          className="h-12 rounded-lg bg-orange-500 px-6 font-semibold text-white transition-colors hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {status === 'loading' ? 'Subscribing…' : status === 'success' ? 'Subscribed ✓' : 'Subscribe'}
        </button>
      </div>

      {message && (
        <p
          className={`mt-3 text-center text-sm ${
            status === 'success' ? 'text-green-600' : 'text-red-600'
          }`}
        >
          {message}
        </p>
      )}
    </form>
  );
}

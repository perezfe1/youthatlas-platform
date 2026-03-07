'use client';

import { useState, type FormEvent } from 'react';

// ── Types ──────────────────────────────────────────────────────────────────────

type Status = 'idle' | 'loading' | 'success' | 'error';

// ── Shared submit logic ────────────────────────────────────────────────────────

async function subscribeEmail(email: string): Promise<{ ok: boolean; message: string }> {
  try {
    const res = await fetch('/api/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    const data = (await res.json()) as { error?: string };
    if (!res.ok) {
      return { ok: false, message: data.error ?? 'Something went wrong. Please try again.' };
    }
    return { ok: true, message: "You're subscribed! Check your inbox to confirm." };
  } catch {
    return { ok: false, message: 'Network error. Please try again.' };
  }
}

// ── Full section form (homepage) ───────────────────────────────────────────────

export function NewsletterForm() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const [message, setMessage] = useState('');

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === 'loading' || status === 'success') return;
    setStatus('loading');
    const result = await subscribeEmail(email.trim());
    setStatus(result.ok ? 'success' : 'error');
    setMessage(result.message);
    if (result.ok) setEmail('');
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto mt-8 max-w-md" noValidate>
      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          type="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          required
          disabled={status === 'loading' || status === 'success'}
          className="flex-1 rounded-lg border border-white/30 bg-white/10 px-4 py-3 text-sm text-white placeholder-white/50 backdrop-blur-sm focus:border-white/60 focus:outline-none focus:ring-2 focus:ring-white/30 disabled:opacity-60"
        />
        <button
          type="submit"
          disabled={status === 'loading' || status === 'success'}
          className="rounded-lg bg-white px-6 py-3 text-sm font-semibold text-[#1A1A2E] transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {status === 'loading' ? 'Subscribing…' : status === 'success' ? 'Subscribed ✓' : 'Subscribe'}
        </button>
      </div>

      {message && (
        <p
          className={`mt-3 text-center text-sm ${
            status === 'success' ? 'text-green-200' : 'text-red-300'
          }`}
        >
          {message}
        </p>
      )}
    </form>
  );
}

// ── Compact inline form (footer) ───────────────────────────────────────────────

export function NewsletterFormCompact() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const [message, setMessage] = useState('');

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === 'loading' || status === 'success') return;
    setStatus('loading');
    const result = await subscribeEmail(email.trim());
    setStatus(result.ok ? 'success' : 'error');
    setMessage(result.message);
    if (result.ok) setEmail('');
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="flex gap-2">
        <input
          type="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          required
          disabled={status === 'loading' || status === 'success'}
          className="flex-1 rounded-md border border-slate-600 bg-slate-700 px-3 py-2 text-sm text-white placeholder-slate-400 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400 disabled:opacity-60"
        />
        <button
          type="submit"
          disabled={status === 'loading' || status === 'success'}
          className="rounded-md bg-blue-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-400 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {status === 'loading' ? '…' : status === 'success' ? '✓' : 'Go'}
        </button>
      </div>

      {message && (
        <p className={`mt-2 text-xs ${status === 'success' ? 'text-green-400' : 'text-red-400'}`}>
          {message}
        </p>
      )}
    </form>
  );
}

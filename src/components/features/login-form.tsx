'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { signInWithOtp, verifyOtp } from '@/services/auth-service';

// ── Types ──────────────────────────────────────────────────────────────────────

type Props = {
  redirectUrl?: string;
};

type Step = 'email' | 'otp';

// ── Component ──────────────────────────────────────────────────────────────────

export function LoginForm({ redirectUrl }: Props) {
  const router = useRouter();
  const [step, setStep] = useState<Step>('email');
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleEmailSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await signInWithOtp(email);
    setLoading(false);

    if (result.error) {
      setError(result.error.message);
    } else {
      setStep('otp');
    }
  }

  async function handleOtpSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await verifyOtp(email, token);

    if (result.error) {
      setLoading(false);
      setError(result.error.message);
      return;
    }

    // Ensure a user_profiles row exists (server-side, bypasses RLS)
    await fetch('/api/auth/profile', { method: 'POST' });

    setLoading(false);
    router.push(redirectUrl ?? '/opportunities');
    router.refresh();
  }

  function handleBackToEmail() {
    setStep('email');
    setToken('');
    setError('');
  }

  // ── Step 2: OTP entry ────────────────────────────────────────────────────────

  if (step === 'otp') {
    return (
      <div className="mx-auto mt-8 max-w-md rounded-lg border border-slate-200 bg-white p-6 shadow-sm sm:mt-16 sm:p-8">
        <h1 className="text-center font-display text-2xl font-bold">Check your email</h1>
        <p className="mt-2 text-center text-sm text-slate-500">
          We sent a code to{' '}
          <span className="font-medium text-slate-700">{email}</span>
        </p>

        <form onSubmit={handleOtpSubmit} className="mt-6 space-y-4">
          <div>
            <label htmlFor="token" className="mb-1 block text-sm font-medium text-slate-700">
              Enter the 6-digit code from your email
            </label>
            <input
              id="token"
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              autoComplete="one-time-code"
              maxLength={6}
              value={token}
              onChange={(e) => setToken(e.target.value.replace(/\D/g, ''))}
              placeholder="000000"
              required
              autoFocus
              className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-center text-lg tracking-widest focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
            {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
            <p className="mt-2 text-xs text-slate-400">Check your spam folder if you don&apos;t see the email.</p>
          </div>

          <button
            type="submit"
            disabled={loading || token.length < 6}
            className="w-full rounded-lg bg-blue-500 px-4 py-2.5 font-medium text-white transition-colors hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? 'Verifying…' : 'Verify'}
          </button>
        </form>

        <button
          type="button"
          onClick={handleBackToEmail}
          className="mt-4 block w-full text-center text-sm text-slate-500 hover:text-slate-700"
        >
          Use a different email
        </button>
      </div>
    );
  }

  // ── Step 1: Email entry ──────────────────────────────────────────────────────

  return (
    <div className="mx-auto mt-16 max-w-md rounded-lg border border-slate-200 bg-white p-8 shadow-sm">
      <h1 className="text-center font-display text-2xl font-bold">Sign In</h1>
      <p className="mt-2 text-center text-sm text-slate-500">
        Enter your email to receive a sign-in code
      </p>

      <form onSubmit={handleEmailSubmit} className="mt-6 space-y-4">
        <div>
          <label htmlFor="email" className="mb-1 block text-sm font-medium text-slate-700">
            Email address
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
            autoFocus
            className="w-full rounded-lg border border-slate-200 px-4 py-2.5 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
          {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-blue-500 px-4 py-2.5 font-medium text-white transition-colors hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? 'Sending…' : 'Send Code'}
        </button>
      </form>
    </div>
  );
}

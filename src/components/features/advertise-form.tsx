'use client';

import { useState } from 'react';
import Link from 'next/link';

// ── Types ─────────────────────────────────────────────────────────────────────

type FormState = 'idle' | 'loading' | 'success' | 'error';

type FormData = {
  orgName: string;
  contactEmail: string;
  opportunityTitle: string;
  opportunityUrl: string;
  opportunityDescription: string;
  message: string;
};

// ── Component ─────────────────────────────────────────────────────────────────

export function AdvertiseForm() {
  const [state, setState] = useState<FormState>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [form, setForm] = useState<FormData>({
    orgName: '',
    contactEmail: '',
    opportunityTitle: '',
    opportunityUrl: '',
    opportunityDescription: '',
    message: '',
  });

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setState('loading');
    setErrorMessage('');

    try {
      const res = await fetch('/api/advertise', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orgName: form.orgName,
          contactEmail: form.contactEmail,
          opportunityTitle: form.opportunityTitle,
          opportunityUrl: form.opportunityUrl,
          ...(form.opportunityDescription && {
            opportunityDescription: form.opportunityDescription,
          }),
          ...(form.message && { message: form.message }),
        }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        setErrorMessage(
          (body as { error?: string }).error ??
            'Something went wrong. Please try again.',
        );
        setState('error');
        return;
      }

      setState('success');
    } catch {
      setErrorMessage('Network error. Please check your connection and try again.');
      setState('error');
    }
  }

  // ── Success state ──────────────────────────────────────────────────────
  if (state === 'success') {
    return (
      <div className="rounded-lg border border-slate-200 bg-white p-8 text-center shadow-sm">
        <div className="text-4xl">🎉</div>
        <h2 className="mt-4 font-display text-xl font-bold text-[#1A1A2E]">
          Thank you!
        </h2>
        <p className="mt-2 text-text-secondary">
          We&apos;ll be in touch within 24 hours.
        </p>
        <Link
          href="/"
          className="mt-6 inline-block rounded-lg bg-primary px-6 py-3 font-semibold text-white transition-colors hover:bg-primary-dark"
        >
          Back to Homepage
        </Link>
      </div>
    );
  }

  // ── Form state ─────────────────────────────────────────────────────────
  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
    >
      {/* Organization name */}
      <div>
        <label
          htmlFor="orgName"
          className="block text-sm font-medium text-[#1A1A2E]"
        >
          Organization name <span className="text-red-500">*</span>
        </label>
        <input
          id="orgName"
          name="orgName"
          type="text"
          required
          value={form.orgName}
          onChange={handleChange}
          className="mt-1 block w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm text-[#1A1A2E] transition-colors focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          placeholder="Acme Foundation"
        />
      </div>

      {/* Contact email */}
      <div className="mt-5">
        <label
          htmlFor="contactEmail"
          className="block text-sm font-medium text-[#1A1A2E]"
        >
          Contact email <span className="text-red-500">*</span>
        </label>
        <input
          id="contactEmail"
          name="contactEmail"
          type="email"
          required
          value={form.contactEmail}
          onChange={handleChange}
          className="mt-1 block w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm text-[#1A1A2E] transition-colors focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          placeholder="hello@acme.org"
        />
      </div>

      {/* Opportunity title */}
      <div className="mt-5">
        <label
          htmlFor="opportunityTitle"
          className="block text-sm font-medium text-[#1A1A2E]"
        >
          Opportunity title <span className="text-red-500">*</span>
        </label>
        <input
          id="opportunityTitle"
          name="opportunityTitle"
          type="text"
          required
          value={form.opportunityTitle}
          onChange={handleChange}
          className="mt-1 block w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm text-[#1A1A2E] transition-colors focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          placeholder="2026 Global Youth Scholarship"
        />
      </div>

      {/* Opportunity URL */}
      <div className="mt-5">
        <label
          htmlFor="opportunityUrl"
          className="block text-sm font-medium text-[#1A1A2E]"
        >
          Opportunity URL <span className="text-red-500">*</span>
        </label>
        <input
          id="opportunityUrl"
          name="opportunityUrl"
          type="url"
          required
          value={form.opportunityUrl}
          onChange={handleChange}
          className="mt-1 block w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm text-[#1A1A2E] transition-colors focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          placeholder="https://acme.org/scholarship"
        />
      </div>

      {/* Description */}
      <div className="mt-5">
        <label
          htmlFor="opportunityDescription"
          className="block text-sm font-medium text-[#1A1A2E]"
        >
          Brief description of the opportunity{' '}
          <span className="text-text-secondary">(optional)</span>
        </label>
        <textarea
          id="opportunityDescription"
          name="opportunityDescription"
          rows={3}
          maxLength={1000}
          value={form.opportunityDescription}
          onChange={handleChange}
          className="mt-1 block w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm text-[#1A1A2E] transition-colors focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          placeholder="Tell us about this opportunity..."
        />
        <p className="mt-1 text-xs text-text-secondary">
          {form.opportunityDescription.length}/1000
        </p>
      </div>

      {/* Message */}
      <div className="mt-5">
        <label
          htmlFor="message"
          className="block text-sm font-medium text-[#1A1A2E]"
        >
          Anything else you&apos;d like us to know{' '}
          <span className="text-text-secondary">(optional)</span>
        </label>
        <textarea
          id="message"
          name="message"
          rows={2}
          maxLength={500}
          value={form.message}
          onChange={handleChange}
          className="mt-1 block w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm text-[#1A1A2E] transition-colors focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          placeholder="Budget range, timeline, etc."
        />
        <p className="mt-1 text-xs text-text-secondary">
          {form.message.length}/500
        </p>
      </div>

      {/* What you get box */}
      <div className="mt-8 rounded-lg border border-amber-200 bg-amber-50 p-5">
        <p className="text-sm font-semibold text-amber-900">What you get:</p>
        <ul className="mt-2 space-y-1.5 text-sm text-amber-800">
          <li>✓ Pinned at the top of our browse page</li>
          <li>✓ Featured slot in our weekly email digest (1,000+ subscribers)</li>
          <li>✓ Dedicated email blast to our full list</li>
        </ul>
        <p className="mt-3 text-xs text-amber-700">
          Pricing is discussed after submission. We&apos;ll be in touch within 24
          hours.
        </p>
      </div>

      {/* Error message */}
      {state === 'error' && errorMessage && (
        <p className="mt-4 text-sm text-red-600">{errorMessage}</p>
      )}

      {/* Submit button */}
      <button
        type="submit"
        disabled={state === 'loading'}
        className="mt-6 w-full rounded-lg bg-orange-500 px-6 py-3 font-semibold text-white transition-colors hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {state === 'loading' ? 'Submitting...' : 'Submit for Review'}
      </button>
    </form>
  );
}

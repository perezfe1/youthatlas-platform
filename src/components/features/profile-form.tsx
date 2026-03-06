'use client';

import { useState } from 'react';

import { REGIONS, OPPORTUNITY_TYPES } from '@/types/opportunity';
import type { UserProfile } from '@/services/profile-service';

// ── Helpers ────────────────────────────────────────────────────────────────────

function formatLabel(value: string): string {
  return value.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

// ── Sub-components ────────────────────────────────────────────────────────────

type CheckboxGroupProps = {
  label: string;
  hint: string;
  options: readonly string[];
  selected: string[];
  onChange: (value: string) => void;
};

function CheckboxGroup({ label, hint, options, selected, onChange }: CheckboxGroupProps) {
  return (
    <div>
      <p className="text-sm font-medium text-[#1A1A2E]">{label}</p>
      <p className="mt-0.5 text-xs text-text-secondary">{hint}</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {options.map((option) => {
          const checked = selected.includes(option);
          return (
            <label
              key={option}
              className={`flex cursor-pointer items-center gap-1.5 rounded-full border px-3 py-2 text-xs font-medium transition-colors ${
                checked
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-slate-200 text-slate-600 hover:border-slate-300'
              }`}
            >
              <input
                type="checkbox"
                className="sr-only"
                checked={checked}
                onChange={() => onChange(option)}
              />
              {formatLabel(option)}
            </label>
          );
        })}
      </div>
    </div>
  );
}

// ── Component ──────────────────────────────────────────────────────────────────

type Props = {
  profile: UserProfile;
};

export function ProfileForm({ profile }: Props) {
  const [displayName, setDisplayName] = useState(profile.display_name ?? '');
  const [selectedRegions, setSelectedRegions] = useState<string[]>(
    profile.regions_of_interest ?? [],
  );
  const [selectedTypes, setSelectedTypes] = useState<string[]>(
    profile.types_of_interest ?? [],
  );
  const [status, setStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  function toggleRegion(value: string) {
    setSelectedRegions((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value],
    );
  }

  function toggleType(value: string) {
    setSelectedTypes((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value],
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('saving');
    setErrorMsg('');

    try {
      const res = await fetch('/api/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          display_name: displayName.trim() || null,
          regions_of_interest: selectedRegions,
          types_of_interest: selectedTypes,
        }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({})) as { error?: string };
        throw new Error(body.error ?? 'Failed to save profile');
      }

      setStatus('success');
      setTimeout(() => setStatus('idle'), 3000);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'An error occurred');
      setStatus('error');
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Display name */}
      <div>
        <label htmlFor="display_name" className="block text-sm font-medium text-[#1A1A2E]">
          Display Name{' '}
          <span className="font-normal text-text-secondary">(optional)</span>
        </label>
        <input
          id="display_name"
          type="text"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          placeholder="How should we call you?"
          className="mt-1.5 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-[#1A1A2E] placeholder-slate-400 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        />
      </div>

      {/* Regions of interest */}
      <CheckboxGroup
        label="Regions of Interest"
        hint="We'll highlight opportunities from these regions for you."
        options={REGIONS}
        selected={selectedRegions}
        onChange={toggleRegion}
      />

      {/* Types of interest */}
      <CheckboxGroup
        label="Opportunity Types of Interest"
        hint="Filter your dashboard to focus on what matters to you."
        options={OPPORTUNITY_TYPES}
        selected={selectedTypes}
        onChange={toggleType}
      />

      {/* Submit */}
      <div className="flex items-center gap-4">
        <button
          type="submit"
          disabled={status === 'saving'}
          className="rounded-lg bg-blue-500 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-600 disabled:opacity-60"
        >
          {status === 'saving' ? 'Saving…' : 'Save Profile'}
        </button>
        {status === 'success' && (
          <p className="text-sm font-medium text-emerald-600">Profile updated ✓</p>
        )}
        {status === 'error' && (
          <p className="text-sm text-red-600">{errorMsg}</p>
        )}
      </div>
    </form>
  );
}

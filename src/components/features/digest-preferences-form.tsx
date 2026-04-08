'use client';

import { useState, useRef, type KeyboardEvent } from 'react';
import { REGIONS, OPPORTUNITY_TYPES } from '@/types/opportunity';
import { COUNTRIES } from '@/data/countries';

// ── Types ─────────────────────────────────────────────────────────────────────

export type DigestPrefs = {
  digest_frequency: 'weekly' | 'biweekly';
  digest_keywords: string[];
  types_of_interest: string[];
  regions_of_interest: string[];
  country_of_citizenship: string | null;
};

type Props = { initial: DigestPrefs };

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatLabel(value: string): string {
  return value.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

const TYPE_COLORS: Record<string, string> = {
  scholarship: 'border-blue-500 bg-blue-50 text-blue-700',
  fellowship:  'border-violet-500 bg-violet-50 text-violet-700',
  grant:       'border-orange-500 bg-orange-50 text-orange-700',
  internship:  'border-amber-500 bg-amber-50 text-amber-700',
  conference:  'border-teal-500 bg-teal-50 text-teal-700',
  competition: 'border-rose-500 bg-rose-50 text-rose-700',
  training:    'border-indigo-500 bg-indigo-50 text-indigo-700',
};

const TYPE_EMOJIS: Record<string, string> = {
  scholarship: '🎓', fellowship: '🔬', grant: '💰',
  internship: '💼', conference: '🎤', competition: '🏆', training: '📚',
};

// ── Sub-components ────────────────────────────────────────────────────────────

function SectionCard({ title, hint, children }: {
  title: string; hint: string; children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6">
      <h2 className="text-base font-semibold text-[#1A1A2E]">{title}</h2>
      <p className="mt-1 text-xs text-slate-500">{hint}</p>
      <div className="mt-4">{children}</div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export function DigestPreferencesForm({ initial }: Props) {
  const [frequency, setFrequency] = useState<'weekly' | 'biweekly'>(initial.digest_frequency);
  const [types, setTypes] = useState<string[]>(initial.types_of_interest);
  const [regions, setRegions] = useState<string[]>(initial.regions_of_interest);
  const [keywords, setKeywords] = useState<string[]>(initial.digest_keywords);
  const [citizenship, setCitizenship] = useState<string>(initial.country_of_citizenship ?? '');
  const [keywordInput, setKeywordInput] = useState('');
  const [status, setStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  function toggleType(t: string) {
    setTypes(prev => prev.includes(t) ? prev.filter(v => v !== t) : [...prev, t]);
  }

  function toggleRegion(r: string) {
    setRegions(prev => prev.includes(r) ? prev.filter(v => v !== r) : [...prev, r]);
  }

  function addKeyword(raw: string) {
    const kw = raw.trim().toLowerCase().replace(/,/g, '');
    if (!kw || keywords.includes(kw) || keywords.length >= 10) return;
    setKeywords(prev => [...prev, kw]);
    setKeywordInput('');
  }

  function removeKeyword(kw: string) {
    setKeywords(prev => prev.filter(k => k !== kw));
  }

  function handleKeywordKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addKeyword(keywordInput);
    } else if (e.key === 'Backspace' && keywordInput === '' && keywords.length > 0) {
      setKeywords(prev => prev.slice(0, -1));
    }
  }

  async function handleSave() {
    setStatus('saving');
    setErrorMsg('');

    try {
      const res = await fetch('/api/user/preferences', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          digest_frequency: frequency,
          digest_keywords: keywords,
          types_of_interest: types,
          regions_of_interest: regions,
          country_of_citizenship: citizenship || null,
        }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({})) as { error?: string };
        throw new Error(body.error ?? 'Failed to save preferences');
      }

      setStatus('success');
      setTimeout(() => setStatus('idle'), 3000);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'An error occurred');
      setStatus('error');
    }
  }

  return (
    <div className="space-y-5">

      {/* ── Frequency ─────────────────────────────────────────────────────── */}
      <SectionCard
        title="Digest Frequency"
        hint="How often do you want to receive your personalized digest?"
      >
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-2">
          {([
            { value: 'weekly',   label: 'Weekly',         sub: 'Every Monday',         emoji: '📅' },
            { value: 'biweekly', label: 'Every 2 Weeks',  sub: 'First & third Monday',  emoji: '🗓️' },
          ] as const).map(({ value, label, sub, emoji }) => (
            <button
              key={value}
              type="button"
              onClick={() => setFrequency(value)}
              className={`flex flex-col items-start rounded-xl border-2 p-4 text-left transition-all ${
                frequency === value
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <span className="mb-1 text-xl">{emoji}</span>
              <span className={`text-sm font-semibold ${frequency === value ? 'text-blue-700' : 'text-[#1A1A2E]'}`}>
                {label}
              </span>
              <span className="mt-0.5 text-xs text-slate-500">{sub}</span>
            </button>
          ))}
        </div>
      </SectionCard>

      {/* ── Opportunity Types ─────────────────────────────────────────────── */}
      <SectionCard
        title="Opportunity Types"
        hint="We'll prioritize these types in your digest. Leave all unchecked to receive all types."
      >
        <div className="flex flex-wrap gap-2">
          {OPPORTUNITY_TYPES.map((type) => {
            const checked = types.includes(type);
            return (
              <button
                key={type}
                type="button"
                onClick={() => toggleType(type)}
                className={`flex items-center gap-1.5 rounded-full border px-3 py-2 text-xs font-medium transition-colors ${
                  checked
                    ? (TYPE_COLORS[type] ?? 'border-blue-500 bg-blue-50 text-blue-700')
                    : 'border-slate-200 text-slate-600 hover:border-slate-300'
                }`}
              >
                <span>{TYPE_EMOJIS[type]}</span>
                {formatLabel(type)}
              </button>
            );
          })}
        </div>
      </SectionCard>

      {/* ── Regions ───────────────────────────────────────────────────────── */}
      <SectionCard
        title="Regions"
        hint="Filter your digest to opportunities from specific regions. Leave all unchecked for global results."
      >
        <div className="flex flex-wrap gap-2">
          {REGIONS.map((region) => {
            const checked = regions.includes(region);
            return (
              <button
                key={region}
                type="button"
                onClick={() => toggleRegion(region)}
                className={`flex items-center rounded-full border px-3 py-2 text-xs font-medium transition-colors ${
                  checked
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-slate-200 text-slate-600 hover:border-slate-300'
                }`}
              >
                {formatLabel(region)}
              </button>
            );
          })}
        </div>
      </SectionCard>

      {/* ── Citizenship ───────────────────────────────────────────────────── */}
      <SectionCard
        title="Country of Citizenship"
        hint="Helps us filter out opportunities you're not eligible for (e.g. scholarships restricted to specific nationalities)."
      >
        <select
          value={citizenship}
          onChange={(e) => setCitizenship(e.target.value)}
          className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-[#1A1A2E] focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        >
          <option value="">— Not specified —</option>
          {COUNTRIES.map((c) => (
            <option key={c.value} value={c.value}>{c.label}</option>
          ))}
        </select>
        {citizenship && (
          <p className="mt-2 text-xs text-slate-500">
            Opportunities explicitly restricted to other nationalities will be filtered from your digest.
          </p>
        )}
      </SectionCard>

      {/* ── Keywords ──────────────────────────────────────────────────────── */}
      <SectionCard
        title="Keywords"
        hint='Add topics you care about (e.g. "climate", "women", "STEM"). Press Enter or comma to add. Max 10.'
      >
        {/* Tag display + input */}
        <div
          className="flex min-h-[44px] flex-wrap items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 cursor-text"
          onClick={() => inputRef.current?.focus()}
        >
          {keywords.map((kw) => (
            <span
              key={kw}
              className="flex items-center gap-1 rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-700"
            >
              {kw}
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); removeKeyword(kw); }}
                className="ml-0.5 text-blue-500 hover:text-blue-700"
                aria-label={`Remove ${kw}`}
              >
                ×
              </button>
            </span>
          ))}
          <input
            ref={inputRef}
            type="text"
            value={keywordInput}
            onChange={(e) => setKeywordInput(e.target.value)}
            onKeyDown={handleKeywordKeyDown}
            onBlur={() => keywordInput.trim() && addKeyword(keywordInput)}
            placeholder={keywords.length === 0 ? 'Type a keyword and press Enter…' : ''}
            disabled={keywords.length >= 10}
            className="min-w-[140px] flex-1 border-none bg-transparent text-xs text-[#1A1A2E] outline-none placeholder-slate-400 disabled:cursor-not-allowed"
          />
        </div>
        {keywords.length >= 10 && (
          <p className="mt-1.5 text-xs text-amber-600">Maximum of 10 keywords reached.</p>
        )}
      </SectionCard>

      {/* ── Save button ───────────────────────────────────────────────────── */}
      <div className="flex items-center gap-4 pt-1">
        <button
          type="button"
          onClick={handleSave}
          disabled={status === 'saving'}
          className="rounded-lg bg-blue-500 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-600 disabled:opacity-60"
        >
          {status === 'saving' ? 'Saving…' : 'Save Preferences'}
        </button>
        {status === 'success' && (
          <p className="text-sm font-medium text-emerald-600">✓ Preferences saved!</p>
        )}
        {status === 'error' && (
          <p className="text-sm text-red-600">{errorMsg}</p>
        )}
      </div>
    </div>
  );
}

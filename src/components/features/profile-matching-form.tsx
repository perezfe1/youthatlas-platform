'use client';

import { useState, useRef, type KeyboardEvent } from 'react';
import { REGIONS, OPPORTUNITY_TYPES } from '@/types/opportunity';
import { COUNTRIES } from '@/data/countries';

// ── Types ─────────────────────────────────────────────────────────────────────

export type ProfileMatchingData = {
  display_name: string | null;
  date_of_birth: string | null;
  country_of_citizenship: string | null;
  country_of_citizenship_2: string | null;
  types_of_interest: string[];
  regions_of_interest: string[];
  digest_keywords: string[];
  digest_frequency: 'weekly' | 'biweekly';
};

type Props = { initial: ProfileMatchingData };

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatLabel(value: string): string {
  return value.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

function computeCompleteness(
  displayName: string,
  dob: string,
  citizenship: string,
  types: string[],
  regions: string[],
  keywords: string[],
): number {
  let score = 0;
  if (displayName.trim()) score += 10;
  if (dob) score += 20;
  if (citizenship) score += 25;
  if (types.length > 0) score += 20;
  if (regions.length > 0) score += 15;
  if (keywords.length > 0) score += 10;
  return score;
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
      <h3 className="text-sm font-semibold text-[#1A1A2E]">{title}</h3>
      <p className="mt-0.5 text-xs text-slate-500">{hint}</p>
      <div className="mt-4">{children}</div>
    </div>
  );
}

function CountrySelect({ value, onChange, excludeValue, placeholder }: {
  value: string;
  onChange: (v: string) => void;
  excludeValue?: string;
  placeholder: string;
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-[#1A1A2E] focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
    >
      <option value="">{placeholder}</option>
      {COUNTRIES.filter((c) => c.value !== excludeValue).map((c) => (
        <option key={c.value} value={c.value}>{c.label}</option>
      ))}
    </select>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export function ProfileMatchingForm({ initial }: Props) {
  const [displayName, setDisplayName]   = useState(initial.display_name ?? '');
  const [dob, setDob]                   = useState(initial.date_of_birth ?? '');
  const [citizenship, setCitizenship]   = useState(initial.country_of_citizenship ?? '');
  const [citizenship2, setCitizenship2] = useState(initial.country_of_citizenship_2 ?? '');
  const [types, setTypes]               = useState<string[]>(initial.types_of_interest);
  const [regions, setRegions]           = useState<string[]>(initial.regions_of_interest);
  const [keywords, setKeywords]         = useState<string[]>(initial.digest_keywords);
  const [frequency, setFrequency]       = useState<'weekly' | 'biweekly'>(initial.digest_frequency);
  const [keywordInput, setKeywordInput] = useState('');
  const [status, setStatus]             = useState<'idle' | 'saving' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg]         = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const completeness = computeCompleteness(displayName, dob, citizenship, types, regions, keywords);

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
    if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); addKeyword(keywordInput); }
    else if (e.key === 'Backspace' && keywordInput === '' && keywords.length > 0) {
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
          display_name: displayName.trim() || null,
          date_of_birth: dob || null,
          country_of_citizenship: citizenship || null,
          country_of_citizenship_2: citizenship2 || null,
          types_of_interest: types,
          regions_of_interest: regions,
          digest_keywords: keywords,
          digest_frequency: frequency,
        }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({})) as { error?: string };
        throw new Error(body.error ?? 'Failed to save');
      }
      setStatus('success');
      setTimeout(() => setStatus('idle'), 3000);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'An error occurred');
      setStatus('error');
    }
  }

  // Completeness label
  const completenessLabel =
    completeness === 100 ? 'Profile complete!' :
    completeness >= 75   ? 'Almost there — add a few more details' :
    completeness >= 50   ? 'Good start — citizenship & DOB improve matches a lot' :
    completeness >= 25   ? 'Set your interests to get personalized matches' :
                           'Complete your profile to unlock personalized recommendations';

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="space-y-4">

      {/* ── Completeness bar ──────────────────────────────────────────────── */}
      <div className="rounded-xl border border-slate-200 bg-white p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-slate-600">Profile completeness</span>
          <span className="text-xs font-semibold text-[#1A1A2E]">{completeness}%</span>
        </div>
        <div className="h-2 w-full rounded-full bg-slate-100">
          <div
            className={`h-2 rounded-full transition-all duration-500 ${
              completeness === 100 ? 'bg-emerald-500' :
              completeness >= 75  ? 'bg-blue-500' :
              completeness >= 50  ? 'bg-amber-500' : 'bg-slate-400'
            }`}
            style={{ width: `${completeness}%` }}
          />
        </div>
        <p className="mt-1.5 text-xs text-slate-500">{completenessLabel}</p>
      </div>

      {/* ── Personal Info ─────────────────────────────────────────────────── */}
      <SectionCard
        title="🧑 Personal Info"
        hint="Basic info used to personalize your experience."
      >
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Display Name</label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="How should we call you?"
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-[#1A1A2E] placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">
              Date of Birth
              <span className="ml-1.5 font-normal text-slate-400">(used to filter age-restricted programs)</span>
            </label>
            <input
              type="date"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
              max={today}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-[#1A1A2E] focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>
      </SectionCard>

      {/* ── Citizenship ───────────────────────────────────────────────────── */}
      <SectionCard
        title="🌍 Citizenship"
        hint="We filter out opportunities you're not eligible for based on nationality requirements."
      >
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Primary Citizenship</label>
            <CountrySelect
              value={citizenship}
              onChange={setCitizenship}
              excludeValue={citizenship2}
              placeholder="— Select your country —"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">
              Second Citizenship
              <span className="ml-1.5 font-normal text-slate-400">(optional — dual citizenship)</span>
            </label>
            <CountrySelect
              value={citizenship2}
              onChange={setCitizenship2}
              excludeValue={citizenship}
              placeholder="— None —"
            />
          </div>
          {(citizenship || citizenship2) && (
            <p className="text-xs text-blue-600 bg-blue-50 rounded-lg px-3 py-2">
              ✓ Opportunities restricted to nationalities you don&apos;t hold will be excluded from your digest.
            </p>
          )}
        </div>
      </SectionCard>

      {/* ── Interests ─────────────────────────────────────────────────────── */}
      <SectionCard
        title="🎯 Opportunity Interests"
        hint="We'll prioritize these in your digest and recommendations. Leave empty to receive all types."
      >
        <div className="space-y-5">
          {/* Types */}
          <div>
            <p className="text-xs font-medium text-slate-600 mb-2">Types</p>
            <div className="flex flex-wrap gap-2">
              {OPPORTUNITY_TYPES.map((type) => {
                const checked = types.includes(type);
                return (
                  <button
                    key={type}
                    type="button"
                    onClick={() => toggleType(type)}
                    className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
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
          </div>

          {/* Regions */}
          <div>
            <p className="text-xs font-medium text-slate-600 mb-2">Regions</p>
            <div className="flex flex-wrap gap-2">
              {REGIONS.map((region) => {
                const checked = regions.includes(region);
                return (
                  <button
                    key={region}
                    type="button"
                    onClick={() => toggleRegion(region)}
                    className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
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
          </div>

          {/* Keywords */}
          <div>
            <p className="text-xs font-medium text-slate-600 mb-2">
              Keywords
              <span className="ml-1.5 font-normal text-slate-400">Press Enter or comma to add. Max 10.</span>
            </p>
            <div
              className="flex min-h-[44px] flex-wrap items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 cursor-text"
              onClick={() => inputRef.current?.focus()}
            >
              {keywords.map((kw) => (
                <span key={kw} className="flex items-center gap-1 rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-700">
                  {kw}
                  <button type="button" onClick={(e) => { e.stopPropagation(); removeKeyword(kw); }} className="ml-0.5 text-blue-500 hover:text-blue-700">×</button>
                </span>
              ))}
              <input
                ref={inputRef}
                type="text"
                value={keywordInput}
                onChange={(e) => setKeywordInput(e.target.value)}
                onKeyDown={handleKeywordKeyDown}
                onBlur={() => keywordInput.trim() && addKeyword(keywordInput)}
                placeholder={keywords.length === 0 ? 'e.g. climate, women, STEM…' : ''}
                disabled={keywords.length >= 10}
                className="min-w-[140px] flex-1 border-none bg-transparent text-xs text-[#1A1A2E] outline-none placeholder-slate-400 disabled:cursor-not-allowed"
              />
            </div>
          </div>
        </div>
      </SectionCard>

      {/* ── Digest Settings ───────────────────────────────────────────────── */}
      <SectionCard
        title="📬 Digest Settings"
        hint="How often do you want your personalized digest emailed to you?"
      >
        <div className="grid grid-cols-2 gap-3">
          {([
            { value: 'weekly',   label: 'Weekly',        sub: 'Every Monday',        emoji: '📅' },
            { value: 'biweekly', label: 'Every 2 Weeks', sub: 'First & third Monday', emoji: '🗓️' },
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
              <span className={`text-sm font-semibold ${frequency === value ? 'text-blue-700' : 'text-[#1A1A2E]'}`}>{label}</span>
              <span className="mt-0.5 text-xs text-slate-500">{sub}</span>
            </button>
          ))}
        </div>
      </SectionCard>

      {/* ── Save ──────────────────────────────────────────────────────────── */}
      <div className="flex items-center gap-4 pt-1">
        <button
          type="button"
          onClick={handleSave}
          disabled={status === 'saving'}
          className="rounded-lg bg-blue-500 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-600 disabled:opacity-60"
        >
          {status === 'saving' ? 'Saving…' : 'Save Profile'}
        </button>
        {status === 'success' && <p className="text-sm font-medium text-emerald-600">✓ Saved!</p>}
        {status === 'error'   && <p className="text-sm text-red-600">{errorMsg}</p>}
      </div>
    </div>
  );
}

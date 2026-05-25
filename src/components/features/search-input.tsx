'use client';

import { useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { SEARCH } from '@/config/constants';

// ── Types ──────────────────────────────────────────────────────────────────────

type Props = {
  defaultValue?: string;
  placeholder?: string;
};

// ── Component ──────────────────────────────────────────────────────────────────

export function SearchInput({
  defaultValue = '',
  placeholder = 'Search opportunities...',
}: Props) {
  const router = useRouter();
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;

    if (timerRef.current) clearTimeout(timerRef.current);

    timerRef.current = setTimeout(() => {
      const params = new URLSearchParams(window.location.search);

      if (value.length >= SEARCH.MIN_QUERY_LENGTH) {
        params.set('search', value);
      } else {
        params.delete('search');
      }

      // Reset to page 1 whenever search changes
      params.delete('page');

      const qs = params.toString();
      // Always route to the dynamic search page so the ISR browse page stays cacheable.
      router.replace(qs ? `/opportunities/search?${qs}` : '/opportunities');
    }, SEARCH.DEBOUNCE_MS);
  }

  return (
    <div className="relative w-full">
      <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center">
        <svg
          className="h-4 w-4 text-slate-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>
      <input
        type="text"
        defaultValue={defaultValue}
        placeholder={placeholder}
        onChange={handleChange}
        className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 pl-10 text-sm focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
      />
    </div>
  );
}

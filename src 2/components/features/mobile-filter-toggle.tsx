'use client';

import { useState } from 'react';

type Props = {
  children: React.ReactNode;
  activeFilterCount: number;
};

export function MobileFilterToggle({ children, activeFilterCount }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="lg:hidden">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition-colors hover:bg-slate-50"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path
            d="M2 4h12M4 8h8M6 12h4"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
        Filters{activeFilterCount > 0 ? ` (${activeFilterCount})` : ''}
        {activeFilterCount > 0 && (
          <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white">
            {activeFilterCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="mt-4">
          {children}
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="mt-4 w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-dark"
          >
            Done
          </button>
        </div>
      )}
    </div>
  );
}

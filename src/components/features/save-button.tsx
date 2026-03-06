'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { createClient } from '@/lib/supabase/client';
import { saveOpportunity, unsaveOpportunity, isOpportunitySaved } from '@/services/saved-service';
import { useSavedIdsContext } from '@/components/features/save-button-bulk';

// ── Types ──────────────────────────────────────────────────────────────────────

type Props = {
  opportunityId: string;
  size?: 'sm' | 'md';
};

// ── Heart icon ─────────────────────────────────────────────────────────────────

function HeartIcon({ filled }: { filled: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill={filled ? 'currentColor' : 'none'}
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  );
}

// ── Component ──────────────────────────────────────────────────────────────────

export function SaveButton({ opportunityId, size = 'md' }: Props) {
  const router = useRouter();
  const ctx = useSavedIdsContext();

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function init() {
      if (ctx !== null) {
        // Inside SaveButtonBulk — wait until the bulk fetch completes
        if (!ctx.ready) return;

        // Bulk data is ready: check auth and read from context
        const supabase = createClient();
        const {
          data: { session },
        } = await supabase.auth.getSession();

        setIsLoggedIn(!!session);
        setIsSaved(ctx.savedIds.has(opportunityId));
        setLoading(false);
        return;
      }

      // No context (e.g. detail page) — individual check
      const supabase = createClient();
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        setIsLoggedIn(false);
        setLoading(false);
        return;
      }

      setIsLoggedIn(true);
      const result = await isOpportunitySaved(opportunityId);
      setIsSaved(result.data ?? false);
      setLoading(false);
    }

    init();
  }, [opportunityId, ctx]);

  async function handleClick(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();

    if (!isLoggedIn) {
      router.push('/login?redirect=' + encodeURIComponent(window.location.pathname));
      return;
    }

    // Optimistic toggle
    const prevSaved = isSaved;
    setIsSaved(!prevSaved);

    const result = prevSaved
      ? await unsaveOpportunity(opportunityId)
      : await saveOpportunity(opportunityId);

    if (result.error) {
      // Revert on error
      setIsSaved(prevSaved);
    }
  }

  const sizeClass = size === 'sm' ? 'h-10 w-10' : 'h-10 w-10';

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={isSaved ? 'Remove from saved' : 'Save opportunity'}
      className={`flex items-center justify-center rounded-full transition-colors ${sizeClass} ${
        loading ? 'pointer-events-none opacity-50' : ''
      } ${isSaved ? 'text-red-500' : 'text-slate-400 hover:text-red-400'}`}
    >
      <HeartIcon filled={isSaved} />
    </button>
  );
}

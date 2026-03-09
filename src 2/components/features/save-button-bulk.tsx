'use client';

import { createContext, useContext, useState, useEffect } from 'react';

import { createClient } from '@/lib/supabase/client';
import { getSavedOpportunityIds } from '@/services/saved-service';

// ── Context ────────────────────────────────────────────────────────────────────
//
// Local to this file — not a global provider in layout.tsx.
// ready=false means the bulk fetch is still in-flight (SaveButton should wait).
// ready=true + savedIds=empty means user is logged out or has no saved items.

type SavedIdsContextValue = {
  savedIds: Set<string>;
  ready: boolean;
};

const SavedIdsContext = createContext<SavedIdsContextValue | null>(null);

/** Consumed by SaveButton to read bulk-fetched saved IDs. Returns null when no
 *  SaveButtonBulk ancestor exists (e.g. detail page → fall back to individual check). */
export function useSavedIdsContext(): SavedIdsContextValue | null {
  return useContext(SavedIdsContext);
}

// ── Component ──────────────────────────────────────────────────────────────────

type Props = { children: React.ReactNode };

export function SaveButtonBulk({ children }: Props) {
  const [state, setState] = useState<SavedIdsContextValue>({
    savedIds: new Set(),
    ready: false,
  });

  useEffect(() => {
    const supabase = createClient();

    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session) {
        // Not logged in — mark ready with empty set so SaveButton renders immediately
        setState({ savedIds: new Set(), ready: true });
        return;
      }

      const result = await getSavedOpportunityIds();
      setState({
        savedIds: new Set(result.data ?? []),
        ready: true,
      });
    });
  }, []);

  return (
    <SavedIdsContext.Provider value={state}>
      {children}
    </SavedIdsContext.Provider>
  );
}

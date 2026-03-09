'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import type { User } from '@supabase/supabase-js';

import { createClient } from '@/lib/supabase/client';
import { signOut } from '@/services/auth-service';

// ── Component ──────────────────────────────────────────────────────────────────

export function AuthButton() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const supabase = createClient();

    // Populate initial state from stored session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    // Keep in sync with auth state changes (sign-in, sign-out, token refresh)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  async function handleSignOut() {
    await signOut();
    router.refresh();
  }

  if (!user) {
    return (
      <Link
        href="/login"
        className="text-sm font-medium text-slate-600 hover:text-slate-900"
      >
        Sign In
      </Link>
    );
  }

  const email = user.email ?? 'Account';
  const displayEmail = email.length > 24 ? email.slice(0, 24) + '…' : email;

  return (
    <span className="flex items-center gap-3 text-sm text-slate-600">
      <span className="hidden sm:inline">{displayEmail}</span>
      <button
        type="button"
        onClick={handleSignOut}
        className="font-medium transition-colors hover:text-red-600"
      >
        Sign Out
      </button>
    </span>
  );
}

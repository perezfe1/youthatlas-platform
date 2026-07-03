import { createClient, type SupabaseClient } from '@supabase/supabase-js';

import { clientEnv } from '@/config/env';

// Cookie-free anon client for PUBLIC reads only (opportunities,
// featured_listings). createServerSupabaseClient() calls next/headers
// cookies() — a dynamic API that silently opts every ISR page into
// per-request rendering (the DynamicServerError it throws is swallowed
// by the services' Result<T> catch blocks). Public reads must use this
// client so /, /opportunities, detail and SEO pages stay CDN-cached.
// Anything auth-aware must keep using createServerSupabaseClient().
let client: SupabaseClient | null = null;

export function getPublicSupabaseClient(): SupabaseClient {
  if (!client) {
    client = createClient(
      clientEnv.NEXT_PUBLIC_SUPABASE_URL,
      clientEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      { auth: { persistSession: false, autoRefreshToken: false } },
    );
  }
  return client;
}

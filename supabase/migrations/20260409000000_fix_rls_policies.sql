-- ─────────────────────────────────────────────────────────────────────────────
-- Migration: Fix RLS policies
-- Date: 2026-04-09
--
-- Changes:
--   1. push_subscriptions  — tighten DELETE + add SELECT so users can read
--                            their own subscriptions.
--   2. reminder_preferences — create table (referenced in code but missing) +
--                             add proper service_role + user RLS policies.
-- ─────────────────────────────────────────────────────────────────────────────


-- ── 1. push_subscriptions ────────────────────────────────────────────────────

-- Drop the old DELETE policy (if it exists) and replace with a stricter one.
-- The original allowed any authenticated user to delete by user_id; this is
-- fine, but we also drop + recreate to ensure no drift between environments.
DROP POLICY IF EXISTS "Users can delete own subscriptions" ON push_subscriptions;

-- Authenticated users may only delete rows where user_id matches their session.
CREATE POLICY "Authenticated users delete own subscriptions"
  ON push_subscriptions
  FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- Add SELECT so logged-in users can query their own subscriptions.
DROP POLICY IF EXISTS "Authenticated users select own subscriptions" ON push_subscriptions;

CREATE POLICY "Authenticated users select own subscriptions"
  ON push_subscriptions
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());


-- ── 2. reminder_preferences ──────────────────────────────────────────────────
-- This table is referenced by /api/reminders/unsubscribe but was never
-- formally migrated. Create it here with proper RLS.

CREATE TABLE IF NOT EXISTS reminder_preferences (
  id                uuid        DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id           uuid        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  reminders_enabled boolean     NOT NULL DEFAULT true,
  -- Opaque token emailed to users; used to unsubscribe without being logged in.
  unsubscribe_token text        NOT NULL UNIQUE DEFAULT gen_random_uuid()::text,
  unsubscribed_at   timestamptz,
  created_at        timestamptz DEFAULT now(),
  updated_at        timestamptz DEFAULT now()
);

-- Fast token look-up (the unsubscribe endpoint queries by this).
CREATE INDEX IF NOT EXISTS idx_reminder_preferences_token
  ON reminder_preferences (unsubscribe_token);

-- Fast per-user look-up.
CREATE INDEX IF NOT EXISTS idx_reminder_preferences_user_id
  ON reminder_preferences (user_id);

-- Enable RLS.
ALTER TABLE reminder_preferences ENABLE ROW LEVEL SECURITY;

-- Service role has unrestricted access (scrapers write tokens, admin reads).
DROP POLICY IF EXISTS "Service role full access on reminder_preferences" ON reminder_preferences;

CREATE POLICY "Service role full access on reminder_preferences"
  ON reminder_preferences
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Authenticated users can read their own row.
DROP POLICY IF EXISTS "Users can read own reminder preferences" ON reminder_preferences;

CREATE POLICY "Users can read own reminder preferences"
  ON reminder_preferences
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Authenticated users can update their own row (e.g. toggle reminders in UI).
DROP POLICY IF EXISTS "Users can update own reminder preferences" ON reminder_preferences;

CREATE POLICY "Users can update own reminder preferences"
  ON reminder_preferences
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

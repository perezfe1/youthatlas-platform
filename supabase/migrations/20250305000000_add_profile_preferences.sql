-- Migration: add profile preference columns to user_profiles
-- Run this in the Supabase SQL editor (Dashboard → SQL Editor)

ALTER TABLE user_profiles
  ADD COLUMN IF NOT EXISTS display_name       text,
  ADD COLUMN IF NOT EXISTS regions_of_interest text[] NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS types_of_interest   text[] NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS updated_at          timestamptz NOT NULL DEFAULT now();

-- Allow authenticated users to update their own profile row
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename   = 'user_profiles'
      AND policyname  = 'Users can update own profile'
  ) THEN
    CREATE POLICY "Users can update own profile" ON user_profiles
      FOR UPDATE
      USING     (auth.uid() = id)
      WITH CHECK (auth.uid() = id);
  END IF;
END $$;

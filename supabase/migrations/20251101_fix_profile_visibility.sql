-- Fix profile visibility RLS policies
-- Migration: 20251101_fix_profile_visibility
-- Created: 2025-11-01
-- Description: Replace overly permissive profile SELECT policy with privacy-respecting policies

-- Drop the insecure policy
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;

-- Public profiles are viewable by everyone (even anonymous)
CREATE POLICY "Public profiles are viewable by everyone"
  ON public.profiles FOR SELECT
  USING (profile_visibility = 'public');

-- Members-only profiles are viewable by authenticated users
CREATE POLICY "Members can view member-only profiles"
  ON public.profiles FOR SELECT
  USING (
    profile_visibility = 'members_only'
    AND auth.role() = 'authenticated'
  );

-- Users can always view their own profile, regardless of visibility
CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

-- Add WITH CHECK to UPDATE policy for additional security
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Add helpful comments
COMMENT ON POLICY "Public profiles are viewable by everyone" ON public.profiles IS
  'Allows anyone to view profiles marked as public';

COMMENT ON POLICY "Members can view member-only profiles" ON public.profiles IS
  'Allows authenticated users to view profiles marked as members_only';

COMMENT ON POLICY "Users can view their own profile" ON public.profiles IS
  'Users can always view their own profile regardless of visibility setting';

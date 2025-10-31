-- Migration: Extend profiles table for member portal
-- Created: 2025-10-31
-- Description: Adds user types, role-specific fields, and supporting tables for member portal

-- 1. Extend profiles table with new fields
ALTER TABLE public.profiles
  -- User type and verification
  ADD COLUMN user_type text CHECK (user_type IN ('entrepreneur', 'mentor', 'community_member', 'admin')) DEFAULT 'community_member',
  ADD COLUMN is_verified boolean DEFAULT false,

  -- Contact information
  ADD COLUMN phone text,
  ADD COLUMN location text,
  ADD COLUMN languages text[] DEFAULT ARRAY['en'],

  -- Social links
  ADD COLUMN linkedin_url text,
  ADD COLUMN twitter_url text,
  ADD COLUMN website text,

  -- Entrepreneur-specific fields
  ADD COLUMN company_name text,
  ADD COLUMN company_stage text CHECK (company_stage IN ('idea', 'early', 'growth', 'established')),
  ADD COLUMN industry text,

  -- Mentor-specific fields
  ADD COLUMN expertise_areas text[],
  ADD COLUMN mentor_availability text CHECK (mentor_availability IN ('available', 'limited', 'unavailable')) DEFAULT 'available',
  ADD COLUMN years_experience int,

  -- Privacy settings
  ADD COLUMN profile_visibility text CHECK (profile_visibility IN ('public', 'members_only', 'private')) DEFAULT 'members_only',
  ADD COLUMN show_email boolean DEFAULT false,
  ADD COLUMN show_phone boolean DEFAULT false;

-- 2. Create program_enrollments table
CREATE TABLE IF NOT EXISTS public.program_enrollments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  program_id text NOT NULL,
  cohort text,
  status text CHECK (status IN ('enrolled', 'active', 'completed', 'withdrew')) DEFAULT 'enrolled',
  enrolled_at timestamptz DEFAULT now() NOT NULL,
  completed_at timestamptz,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL,
  UNIQUE(user_id, program_id, cohort)
);

-- Enable RLS on program_enrollments
ALTER TABLE public.program_enrollments ENABLE ROW LEVEL SECURITY;

-- RLS Policies for program_enrollments
CREATE POLICY "Users can view their own enrollments"
  ON public.program_enrollments FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own enrollments"
  ON public.program_enrollments FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own enrollments"
  ON public.program_enrollments FOR UPDATE
  USING (auth.uid() = user_id);

-- 3. Create mentor_connections table
CREATE TABLE IF NOT EXISTS public.mentor_connections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  mentor_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  mentee_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  status text CHECK (status IN ('pending', 'active', 'completed', 'declined')) DEFAULT 'pending',
  focus_areas text[],
  notes text,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL,
  UNIQUE(mentor_id, mentee_id),
  CHECK (mentor_id != mentee_id)
);

-- Enable RLS on mentor_connections
ALTER TABLE public.mentor_connections ENABLE ROW LEVEL SECURITY;

-- RLS Policies for mentor_connections
CREATE POLICY "Users can view their mentor connections"
  ON public.mentor_connections FOR SELECT
  USING (auth.uid() = mentor_id OR auth.uid() = mentee_id);

CREATE POLICY "Mentees can create mentor requests"
  ON public.mentor_connections FOR INSERT
  WITH CHECK (auth.uid() = mentee_id);

CREATE POLICY "Users can update their own connections"
  ON public.mentor_connections FOR UPDATE
  USING (auth.uid() = mentor_id OR auth.uid() = mentee_id);

-- 4. Create event_registrations table
CREATE TABLE IF NOT EXISTS public.event_registrations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  event_id text NOT NULL,
  status text CHECK (status IN ('registered', 'attended', 'cancelled')) DEFAULT 'registered',
  registered_at timestamptz DEFAULT now() NOT NULL,
  attended_at timestamptz,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL,
  UNIQUE(user_id, event_id)
);

-- Enable RLS on event_registrations
ALTER TABLE public.event_registrations ENABLE ROW LEVEL SECURITY;

-- RLS Policies for event_registrations
CREATE POLICY "Users can view their own registrations"
  ON public.event_registrations FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own registrations"
  ON public.event_registrations FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own registrations"
  ON public.event_registrations FOR UPDATE
  USING (auth.uid() = user_id);

-- 5. Add triggers for updated_at on new tables
CREATE TRIGGER on_program_enrollment_updated
  BEFORE UPDATE ON public.program_enrollments
  FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

CREATE TRIGGER on_mentor_connection_updated
  BEFORE UPDATE ON public.mentor_connections
  FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

CREATE TRIGGER on_event_registration_updated
  BEFORE UPDATE ON public.event_registrations
  FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

-- 6. Create indexes for better query performance
CREATE INDEX idx_profiles_user_type ON public.profiles(user_type);
CREATE INDEX idx_profiles_is_verified ON public.profiles(is_verified);
CREATE INDEX idx_program_enrollments_user_id ON public.program_enrollments(user_id);
CREATE INDEX idx_program_enrollments_status ON public.program_enrollments(status);
CREATE INDEX idx_mentor_connections_mentor_id ON public.mentor_connections(mentor_id);
CREATE INDEX idx_mentor_connections_mentee_id ON public.mentor_connections(mentee_id);
CREATE INDEX idx_mentor_connections_status ON public.mentor_connections(status);
CREATE INDEX idx_event_registrations_user_id ON public.event_registrations(user_id);
CREATE INDEX idx_event_registrations_event_id ON public.event_registrations(event_id);

-- 7. Add helpful comments
COMMENT ON COLUMN public.profiles.user_type IS 'User role: entrepreneur, mentor, community_member, or admin';
COMMENT ON COLUMN public.profiles.company_stage IS 'For entrepreneurs: idea, early, growth, or established';
COMMENT ON COLUMN public.profiles.mentor_availability IS 'For mentors: available, limited, or unavailable';
COMMENT ON COLUMN public.profiles.profile_visibility IS 'Who can see this profile: public, members_only, or private';
COMMENT ON TABLE public.program_enrollments IS 'Tracks user enrollment in programs (V&S, Hekima Time, etc.)';
COMMENT ON TABLE public.mentor_connections IS 'Tracks mentor-mentee relationships';
COMMENT ON TABLE public.event_registrations IS 'Tracks user registrations for events';

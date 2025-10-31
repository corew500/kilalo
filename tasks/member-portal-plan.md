# Member Portal Implementation Plan

**Created**: October 31, 2025
**Status**: Planning Phase
**Priority**: HIGH - Next major feature

---

## Overview

Build a comprehensive member portal for Kilalo's three user types: Entrepreneurs, Mentors, and Community Members. The portal will provide role-based dashboards, profile management, and user-specific features.

---

## User Types Analysis

### 1. Entrepreneurs

- **Who**: Business owners enrolled in programs (V&S 16-week program, Hekima Time)
- **Needs**:
  - Track program progress
  - Access resources and tools
  - Connect with mentors
  - Manage company profile
  - View upcoming sessions/events

### 2. Mentors/Advisors

- **Who**: Experienced professionals providing guidance
- **Needs**:
  - Manage expertise areas and availability
  - Connect with mentees
  - Schedule sessions
  - Access mentorship resources
  - Track impact/hours

### 3. Community Members

- **Who**: General members participating in events and learning
- **Needs**:
  - Register for events (Hekima Time sessions)
  - Access community resources
  - Connect with other members
  - View community directory
  - Participate in discussions

---

## Phase 1: Extended Database Schema

### Current Schema

```sql
profiles (
  id uuid,
  full_name text,
  avatar_url text,
  bio text,
  created_at timestamptz,
  updated_at timestamptz
)
```

### Proposed Extended Schema

```sql
profiles (
  -- Existing fields
  id uuid,
  full_name text,
  avatar_url text,
  bio text,
  created_at timestamptz,
  updated_at timestamptz,

  -- User type & role
  user_type text CHECK (user_type IN ('entrepreneur', 'mentor', 'community_member', 'admin')),
  is_verified boolean DEFAULT false,

  -- Contact information
  phone text,
  location text,
  languages text[], -- ['en', 'fr', 'sw']

  -- Social links
  linkedin_url text,
  twitter_url text,
  website text,

  -- Entrepreneur-specific
  company_name text,
  company_stage text CHECK (company_stage IN ('idea', 'early', 'growth', 'established')),
  industry text,

  -- Mentor-specific
  expertise_areas text[], -- ['sales', 'finance', 'operations', etc.]
  mentor_availability text CHECK (mentor_availability IN ('available', 'limited', 'unavailable')),
  years_experience int,

  -- Privacy settings
  profile_visibility text CHECK (profile_visibility IN ('public', 'members_only', 'private')) DEFAULT 'members_only',
  show_email boolean DEFAULT false,
  show_phone boolean DEFAULT false
)
```

### Additional Tables

**program_enrollments**

```sql
program_enrollments (
  id uuid PRIMARY KEY,
  user_id uuid REFERENCES profiles(id),
  program_id text, -- 'v2s', 'hekima-time', etc.
  cohort text,
  status text CHECK (status IN ('enrolled', 'active', 'completed', 'withdrew')),
  enrolled_at timestamptz,
  completed_at timestamptz,
  UNIQUE(user_id, program_id, cohort)
)
```

**mentor_connections**

```sql
mentor_connections (
  id uuid PRIMARY KEY,
  mentor_id uuid REFERENCES profiles(id),
  mentee_id uuid REFERENCES profiles(id),
  status text CHECK (status IN ('pending', 'active', 'completed', 'declined')),
  focus_areas text[],
  created_at timestamptz,
  updated_at timestamptz,
  UNIQUE(mentor_id, mentee_id)
)
```

**event_registrations**

```sql
event_registrations (
  id uuid PRIMARY KEY,
  user_id uuid REFERENCES profiles(id),
  event_id text, -- References Sanity event
  status text CHECK (status IN ('registered', 'attended', 'cancelled')),
  registered_at timestamptz,
  attended_at timestamptz,
  UNIQUE(user_id, event_id)
)
```

---

## Phase 2: Core Portal UI

### Shared Layout

**Location**: `app/[locale]/(member)/layout.tsx`

**Features**:

- Sidebar navigation (responsive, collapsible on mobile)
- User avatar + name in header
- Navigation items based on user_type
- Logout button
- Language switcher

**Navigation Structure**:

```
Common (all users):
- Dashboard
- My Profile
- Settings

Entrepreneurs only:
- My Company
- My Program
- Find Mentors
- Resources

Mentors only:
- My Expertise
- My Mentees
- Sessions

Community Members only:
- Events
- Community
- Resources
```

### Dashboard Page

**Location**: `app/[locale]/(member)/dashboard/page.tsx`

**Content (role-based)**:

**Entrepreneurs**:

- Welcome message
- Program progress widget
- Upcoming sessions
- Recent resources
- Mentor match suggestions

**Mentors**:

- Welcome message
- Active mentee connections
- Upcoming sessions
- Impact metrics (hours, mentees)

**Community**:

- Welcome message
- Upcoming events
- Recent blog posts
- Community highlights

### Profile Page

**Location**: `app/[locale]/(member)/profile/page.tsx`

**Sections**:

1. **Basic Information**
   - Full name
   - Bio
   - Avatar upload
   - Location
   - Languages

2. **Contact Details**
   - Email (read-only, from auth)
   - Phone
   - Privacy toggles

3. **Social Links**
   - LinkedIn
   - Twitter
   - Website

4. **Role-Specific**
   - **Entrepreneurs**: Company name, stage, industry
   - **Mentors**: Expertise areas, availability, years of experience
   - **Community**: Interests, skills

### Settings Page

**Location**: `app/[locale]/(member)/settings/page.tsx`

**Sections**:

1. **Account**
   - Email (read-only)
   - Password change
   - Delete account

2. **Preferences**
   - Language
   - Email notifications
   - Profile visibility

3. **Privacy**
   - Who can see my profile
   - Show/hide contact details

---

## Phase 3: User-Type Specific Features

### Entrepreneur Portal

**My Company** (`app/[locale]/(member)/company/page.tsx`)

- Company profile
- Company stage progress
- Key metrics/milestones
- Team members

**My Program** (`app/[locale]/(member)/program/page.tsx`)

- Enrollment status
- Program curriculum
- Week-by-week progress
- Upcoming sessions
- Resources/tools
- Testimonials from completed

**Find Mentors** (`app/[locale]/(member)/mentors/page.tsx`)

- Browse available mentors
- Filter by expertise
- Send mentor request
- Track pending/active connections

### Mentor Portal

**My Expertise** (`app/[locale]/(member)/expertise/page.tsx`)

- Manage expertise areas
- Set availability
- Update bio/experience
- Mentor resources

**My Mentees** (`app/[locale]/(member)/mentees/page.tsx`)

- Active connections
- Pending requests
- Past connections
- Connection details

**Sessions** (`app/[locale]/(member)/sessions/page.tsx`)

- Upcoming sessions
- Past sessions
- Session notes
- Schedule new

### Community Portal

**Events** (`app/[locale]/(member)/events/page.tsx`)

- Upcoming events (Hekima Time, etc.)
- My registrations
- Past events
- Event recordings

**Community Directory** (`app/[locale]/(member)/community/page.tsx`)

- Browse members
- Filter by user type, location, expertise
- Connect with members

**Resources** (`app/[locale]/(member)/resources/page.tsx`)

- Learning materials
- Tools & templates
- Blog posts
- Case studies

---

## Phase 4: Implementation Steps

### Step 1: Database Migration

1. Create migration file: `supabase/migrations/20251031_extend_profiles.sql`
2. Add new columns to profiles table
3. Create new tables (enrollments, connections, registrations)
4. Update RLS policies for new fields
5. Test locally
6. Apply to dev database
7. Regenerate TypeScript types

### Step 2: Shared Layout & Navigation

1. Create `app/[locale]/(member)/layout.tsx`
2. Create `components/member/Sidebar.tsx`
3. Create `components/member/MemberHeader.tsx`
4. Add navigation logic based on user_type
5. Style with Tailwind
6. Make responsive

### Step 3: Core Pages

1. Update dashboard with role-based content
2. Create profile page with edit form
3. Create settings page
4. Add form validation
5. Add server actions for updates
6. Test CRUD operations

### Step 4: User-Type Features

1. Implement entrepreneur features (company, program, mentors)
2. Implement mentor features (expertise, mentees, sessions)
3. Implement community features (events, directory, resources)
4. Add role-based access control

### Step 5: Testing & Polish

1. Add unit tests for components
2. Add E2E tests for member flows
3. Add i18n translations (en + fr)
4. Security audit
5. Performance optimization
6. Accessibility review

---

## Technical Considerations

### Authentication & Authorization

- Use existing Supabase auth
- Check user_type in RLS policies
- Protect routes in middleware
- Role-based component rendering

### Data Fetching

- Server components for initial data
- Client components for interactive features
- Real-time subscriptions for notifications
- Optimistic updates for better UX

### Styling

- Reuse existing Tailwind theme
- Use shadcn/ui components
- Maintain consistency with marketing site
- Mobile-first responsive design

### i18n

- Add member portal translations to `messages/en.json` and `messages/fr.json`
- Use `next-intl` for all text
- Support locale switching in portal

---

## Success Metrics

- [ ] All user types can complete profile
- [ ] Entrepreneurs can view program status
- [ ] Mentors can manage connections
- [ ] Community members can register for events
- [ ] 100% test coverage on auth flows
- [ ] Mobile responsive on all pages
- [ ] Full French translation
- [ ] <2s page load times

---

## Next Actions

**Immediate (Today)**:

1. Design extended profiles schema
2. Create migration file
3. Test migration locally
4. Create shared member layout

**Short-term (This Week)**:

1. Build core pages (dashboard, profile, settings)
2. Add profile editing functionality
3. Test end-to-end flows

**Medium-term (Next 2 Weeks)**:

1. Build user-type specific features
2. Add comprehensive testing
3. Deploy to production

---

**Last Updated**: October 31, 2025

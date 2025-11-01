# Security Audit: Row Level Security (RLS) Policies

**Date**: 2025-11-01
**Auditor**: Claude (AI Assistant)
**Scope**: Supabase RLS policies for member portal

## Executive Summary

This audit reviews all Row Level Security (RLS) policies implemented for the Kilalo member portal. The audit identifies **1 critical security issue** and **2 recommendations** for improvement.

**Critical Finding**: The `profiles` table has an overly permissive SELECT policy that allows ALL users to view ALL profiles, ignoring the `profile_visibility` setting.

## Tables Audited

1. `public.profiles` - User profile information
2. `public.program_enrollments` - User program enrollment records
3. `public.mentor_connections` - Mentor-mentee relationships
4. `public.event_registrations` - Event registration records

---

## 1. Profiles Table

### Current Policies

#### SELECT Policy: "Public profiles are viewable by everyone"

```sql
create policy "Public profiles are viewable by everyone"
  on public.profiles for select
  using (true);
```

**Status**: 🔴 **CRITICAL SECURITY ISSUE**

**Problem**: This policy allows ANY user (authenticated or not) to view ALL profiles, completely bypassing the `profile_visibility` column that is supposed to control who can see each profile.

**Risk Level**: HIGH

- Exposes private user data
- Violates user privacy expectations
- Contradicts the `profile_visibility` field purpose

**Recommended Fix**:

```sql
-- Drop existing overly permissive policy
drop policy "Public profiles are viewable by everyone" on public.profiles;

-- Create new privacy-respecting policies
create policy "Public profiles are viewable by everyone"
  on public.profiles for select
  using (profile_visibility = 'public');

create policy "Members can view member-only profiles"
  on public.profiles for select
  using (
    profile_visibility = 'members_only'
    and auth.role() = 'authenticated'
  );

create policy "Users can view their own profile"
  on public.profiles for select
  using (auth.uid() = id);
```

#### INSERT Policy: "Users can insert their own profile"

```sql
create policy "Users can insert their own profile"
  on public.profiles for insert
  with check (auth.uid() = id);
```

**Status**: ✅ **SECURE**

**Analysis**: Correctly restricts users to only insert their own profile using their auth.uid().

#### UPDATE Policy: "Users can update their own profile"

```sql
create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id);
```

**Status**: ✅ **SECURE**

**Analysis**: Correctly restricts users to only update their own profile.

**Recommendation**: Consider adding a `WITH CHECK` clause to prevent users from changing their `id` or other sensitive fields:

```sql
create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);
```

---

## 2. Program Enrollments Table

### Current Policies

#### SELECT Policy

```sql
create policy "Users can view their own enrollments"
  on public.program_enrollments for select
  using (auth.uid() = user_id);
```

**Status**: ✅ **SECURE**

**Analysis**: Correctly restricts users to viewing only their own enrollments.

#### INSERT Policy

```sql
create policy "Users can insert their own enrollments"
  on public.program_enrollments for insert
  with check (auth.uid() = user_id);
```

**Status**: ✅ **SECURE**

**Analysis**: Correctly restricts users to creating enrollments only for themselves.

#### UPDATE Policy

```sql
create policy "Users can update their own enrollments"
  on public.program_enrollments for update
  using (auth.uid() = user_id);
```

**Status**: ✅ **SECURE**

**Analysis**: Correctly restricts users to updating only their own enrollments.

### Missing Policies

**Recommendation**: Consider adding admin policies to allow administrators to manage enrollments:

```sql
-- Allow admins to view all enrollments
create policy "Admins can view all enrollments"
  on public.program_enrollments for select
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and user_type = 'admin'
    )
  );

-- Allow admins to update enrollments
create policy "Admins can update enrollments"
  on public.program_enrollments for update
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and user_type = 'admin'
    )
  );
```

---

## 3. Mentor Connections Table

### Current Policies

#### SELECT Policy

```sql
create policy "Users can view their mentor connections"
  on public.mentor_connections for select
  using (auth.uid() = mentor_id or auth.uid() = mentee_id);
```

**Status**: ✅ **SECURE**

**Analysis**: Correctly restricts users to viewing only connections where they are either the mentor or mentee.

#### INSERT Policy

```sql
create policy "Mentees can create mentor requests"
  on public.mentor_connections for insert
  with check (auth.uid() = mentee_id);
```

**Status**: ⚠️ **NEEDS REVIEW**

**Analysis**: Policy allows mentees to create requests, but:

- **Issue**: No validation that the mentor exists or is actually a mentor
- **Issue**: No validation that the mentor is available
- **Missing**: No policy allowing mentors to create connections

**Recommendation**: Add additional validation:

```sql
-- Replace existing policy
drop policy "Mentees can create mentor requests" on public.mentor_connections;

create policy "Mentees can create mentor requests to available mentors"
  on public.mentor_connections for insert
  with check (
    auth.uid() = mentee_id
    and exists (
      select 1 from public.profiles
      where id = mentor_id
      and user_type = 'mentor'
      and mentor_availability in ('available', 'limited')
    )
  );

-- Allow mentors to create connections too
create policy "Mentors can create connections with mentees"
  on public.mentor_connections for insert
  with check (
    auth.uid() = mentor_id
    and exists (
      select 1 from public.profiles
      where id = auth.uid()
      and user_type = 'mentor'
    )
  );
```

#### UPDATE Policy

```sql
create policy "Users can update their own connections"
  on public.mentor_connections for update
  using (auth.uid() = mentor_id or auth.uid() = mentee_id);
```

**Status**: ⚠️ **NEEDS REFINEMENT**

**Analysis**: Both parties can update the connection, which is generally good, but:

- **Issue**: No restrictions on WHAT fields can be updated
- **Issue**: Mentees can change `mentor_id` or other critical fields

**Recommendation**: Add `WITH CHECK` clause to prevent tampering:

```sql
create policy "Users can update their own connections"
  on public.mentor_connections for update
  using (auth.uid() = mentor_id or auth.uid() = mentee_id)
  with check (
    -- Prevent changing the mentor_id or mentee_id
    mentor_id = (select mentor_id from public.mentor_connections where id = id)
    and mentee_id = (select mentee_id from public.mentor_connections where id = id)
  );
```

---

## 4. Event Registrations Table

### Current Policies

#### SELECT Policy

```sql
create policy "Users can view their own registrations"
  on public.event_registrations for select
  using (auth.uid() = user_id);
```

**Status**: ✅ **SECURE**

**Analysis**: Correctly restricts users to viewing only their own registrations.

#### INSERT Policy

```sql
create policy "Users can insert their own registrations"
  on public.event_registrations for insert
  with check (auth.uid() = user_id);
```

**Status**: ✅ **SECURE**

**Analysis**: Correctly restricts users to creating registrations only for themselves.

#### UPDATE Policy

```sql
create policy "Users can update their own registrations"
  on public.event_registrations for update
  using (auth.uid() = user_id);
```

**Status**: ✅ **SECURE**

**Analysis**: Correctly restricts users to updating only their own registrations.

---

## Summary of Findings

### Critical Issues (Must Fix)

1. **Profiles SELECT Policy** - Exposes all user profiles publicly, ignoring `profile_visibility` settings
   - **Action Required**: Replace with privacy-respecting policies
   - **Priority**: 🔴 CRITICAL

### Recommendations

1. **Add WITH CHECK clauses** to UPDATE policies to prevent field tampering
2. **Add admin policies** for program enrollment management
3. **Enhance mentor connection validation** to check mentor availability and user types
4. **Consider adding audit logging** for sensitive operations

### Security Score

- **Overall**: 6/10
- **Data Isolation**: 9/10 (excellent user-to-user isolation)
- **Privacy Controls**: 2/10 (profile visibility not enforced)
- **Admin Access**: 4/10 (no admin policies defined)

---

## Recommended Migration

Create the following migration file to fix the critical issue:

**File**: `supabase/migrations/20251101_fix_profile_visibility.sql`

```sql
-- Fix profile visibility RLS policies
-- Migration: 20251101_fix_profile_visibility
-- Description: Replace overly permissive profile SELECT policy with privacy-respecting policies

-- Drop the insecure policy
drop policy if exists "Public profiles are viewable by everyone" on public.profiles;

-- Public profiles are viewable by everyone (even anonymous)
create policy "Public profiles are viewable by everyone"
  on public.profiles for select
  using (profile_visibility = 'public');

-- Members-only profiles are viewable by authenticated users
create policy "Members can view member-only profiles"
  on public.profiles for select
  using (
    profile_visibility = 'members_only'
    and auth.role() = 'authenticated'
  );

-- Users can always view their own profile, regardless of visibility
create policy "Users can view their own profile"
  on public.profiles for select
  using (auth.uid() = id);

-- Add WITH CHECK to UPDATE policy
drop policy if exists "Users can update their own profile" on public.profiles;

create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- Comment for clarity
comment on policy "Public profiles are viewable by everyone" on public.profiles is
  'Allows anyone to view profiles marked as public';

comment on policy "Members can view member-only profiles" on public.profiles is
  'Allows authenticated users to view profiles marked as members_only';

comment on policy "Users can view their own profile" on public.profiles is
  'Users can always view their own profile regardless of visibility setting';
```

---

## Testing Recommendations

After applying the migration, test the following scenarios:

1. **Anonymous user**: Should only see public profiles
2. **Authenticated user**: Should see public + members_only profiles (but not private)
3. **Profile owner**: Should see their own profile regardless of visibility
4. **Update attempts**: Should fail if trying to change `id` field
5. **Mentor connections**: Test creation with invalid mentor IDs (should fail)

---

## Conclusion

The member portal has a **critical security vulnerability** in the profiles table that must be addressed immediately. The recommended migration will fix this issue while maintaining proper access control.

All other tables have well-designed RLS policies with minor areas for improvement. The suggestions above will enhance security and admin capabilities without compromising user data isolation.

**Next Steps**:

1. Apply the recommended migration to fix profile visibility
2. Test thoroughly with different user roles
3. Consider implementing admin policies for better management
4. Schedule regular RLS policy audits (quarterly recommended)

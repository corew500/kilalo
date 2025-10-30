# Supabase Setup Documentation

**Date**: October 30, 2025
**Status**: Infrastructure Complete ✅

## Overview

This document details the Supabase authentication infrastructure setup for the Kilalo project. The setup includes database schema, client utilities, environment configuration, and deployment integration.

## Projects

### Development

- **Project ID**: `mwaqvfysmlsplxpqppji`
- **URL**: https://mwaqvfysmlsplxpqppji.supabase.co
- **Region**: us-east-2
- **Purpose**: Local development and preview deployments

### Production

- **Project ID**: `gzsiuzszehzkkapcgkar`
- **URL**: https://gzsiuzszehzkkapcgkar.supabase.co
- **Region**: East US (North Virginia)
- **Purpose**: Production deployments

## Infrastructure Setup

### 1. Supabase CLI

**Version**: 2.54.11

```bash
# Installation (macOS)
brew install supabase/tap/supabase

# Upgrade
brew upgrade supabase

# Login
export SUPABASE_ACCESS_TOKEN=your_token_here
supabase login

# Link to project
supabase link --project-ref mwaqvfysmlsplxpqppji  # Dev
supabase link --project-ref gzsiuzszehzkkapcgkar  # Prod
```

### 2. Database Schema

**File**: `supabase/migrations/20251030_create_profiles.sql`

#### Profiles Table

```sql
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  full_name text,
  avatar_url text,
  bio text,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);
```

#### Row Level Security (RLS)

```sql
-- Public profiles are viewable by everyone
create policy "Public profiles are viewable by everyone"
  on public.profiles for select
  using (true);

-- Users can insert their own profile
create policy "Users can insert their own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

-- Users can update their own profile
create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id);
```

#### Automatic Profile Creation

```sql
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name'),
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
```

### 3. TypeScript Types

**File**: `types/supabase.ts`

Generated from database schema:

```bash
supabase gen types typescript --linked > types/supabase.ts
```

Includes type-safe access to:

- `Database.public.Tables.profiles`
- Row types, Insert types, Update types

### 4. Client Utilities

#### Browser Client

**File**: `lib/supabase/client.ts`

```typescript
import { createBrowserClient } from '@supabase/ssr'
import type { Database } from '@/types/supabase'

export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
```

**Usage**: Client Components, browser-side auth

#### Server Client

**File**: `lib/supabase/server.ts`

```typescript
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import type { Database } from '@/types/supabase'

export async function createClient() {
  const cookieStore = await cookies()
  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // Ignore if called from Server Component
          }
        },
      },
    }
  )
}
```

**Usage**: Server Components, Server Actions, Route Handlers

#### Middleware Helper

**File**: `lib/supabase/middleware.ts`

```typescript
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(/* ... */)

  // Refresh session
  await supabase.auth.getUser()

  return supabaseResponse
}
```

**Usage**: Middleware for session refresh

## Environment Variables

### Local Development (`.env.local`)

```bash
# Supabase Development
NEXT_PUBLIC_SUPABASE_URL=https://mwaqvfysmlsplxpqppji.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_ACCESS_TOKEN=sbp_0ff5a31b103c8f3a43d2aebc5a712d37a3307551
```

### Vercel Environment Variables

#### Preview (Development Project)

```bash
NEXT_PUBLIC_SUPABASE_URL=https://mwaqvfysmlsplxpqppji.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<dev_anon_key>
SUPABASE_SERVICE_ROLE_KEY=<dev_service_role>
SUPABASE_ACCESS_TOKEN=<access_token>
```

#### Production (Production Project)

```bash
NEXT_PUBLIC_SUPABASE_URL=https://gzsiuzszehzkkapcgkar.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<prod_anon_key>
SUPABASE_SERVICE_ROLE_KEY=<prod_service_role>
SUPABASE_ACCESS_TOKEN=<access_token>
```

**Added via**:

```bash
echo "value" | vercel env add VARIABLE_NAME preview
echo "value" | vercel env add VARIABLE_NAME production
```

## Database Migrations

### Apply Migrations

```bash
# Development
supabase link --project-ref mwaqvfysmlsplxpqppji
supabase db push --yes

# Production
supabase link --project-ref gzsiuzszehzkkapcgkar
export SUPABASE_SERVICE_ROLE_KEY="<prod_service_role>"
supabase db push --yes
```

### Create New Migration

```bash
# Create migration file
touch supabase/migrations/$(date +%Y%m%d)_description.sql

# Write SQL
# Apply to dev
supabase db push

# Apply to prod
supabase link --project-ref gzsiuzszehzkkapcgkar
supabase db push
```

## Next Steps

### Remaining Tasks

1. **Supabase Dashboard Configuration**
   - [ ] Configure email authentication
   - [ ] Customize email templates
   - [ ] Set site URL: `https://kilalo.vercel.app`
   - [ ] Set redirect URLs: `https://kilalo.vercel.app/auth/callback`
   - [ ] Optional: Add OAuth providers (Google, GitHub)

2. **Authentication Pages**
   - [ ] Create login page: `app/[locale]/(auth)/login/page.tsx`
   - [ ] Create signup page: `app/[locale]/(auth)/signup/page.tsx`
   - [ ] Create auth callback: `app/auth/callback/route.ts`
   - [ ] Create login form: `components/auth/LoginForm.tsx`
   - [ ] Create signup form: `components/auth/SignupForm.tsx`

3. **Protected Routes**
   - [ ] Update middleware to check auth
   - [ ] Create auth helpers: `lib/auth/helpers.ts`
   - [ ] Create member portal: `app/[locale]/(member)/`

4. **Testing**
   - [ ] E2E tests for signup/login/logout
   - [ ] Test profile creation trigger
   - [ ] Test RLS policies

## Troubleshooting

### Connection Issues

```bash
# Check CLI version
supabase --version  # Should be 2.54.11+

# Check link status
supabase projects list

# Re-link if needed
supabase link --project-ref <project_id>
```

### Migration Issues

```bash
# Check migration status
supabase migration list

# Pull remote migrations
supabase db pull

# Reset local database (development only)
supabase db reset
```

### Type Generation

```bash
# Regenerate types after schema changes
supabase gen types typescript --linked > types/supabase.ts
```

## Security Notes

1. **Never commit** `.env.local` - it's in `.gitignore`
2. **Service role keys** have admin access - use carefully
3. **RLS policies** are enforced - test thoroughly
4. **Access tokens** expire - regenerate if needed
5. **Always use** Supabase clients (not direct PostgreSQL)

## References

- [Supabase Docs](https://supabase.com/docs)
- [Auth with Next.js](https://supabase.com/docs/guides/auth/server-side/nextjs)
- [RLS Policies](https://supabase.com/docs/guides/auth/row-level-security)
- [Claude Skill](../.claude/skills/supabase-auth.md)

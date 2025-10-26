# Supabase Setup Guide - Authentication, Database & Backend

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Creating a Supabase Project](#creating-a-supabase-project)
3. [Installing Dependencies](#installing-dependencies)
4. [Environment Variables Setup](#environment-variables-setup)
5. [Supabase Client Utilities](#supabase-client-utilities)
6. [Authentication Setup](#authentication-setup)
7. [Database Schema Design](#database-schema-design)
8. [Row Level Security (RLS)](#row-level-security-rls)
9. [Auth Callback Route](#auth-callback-route)
10. [Protected Routes](#protected-routes)
11. [Real-time Subscriptions](#real-time-subscriptions-optional)
12. [File Storage](#file-storage)
13. [Type Generation](#type-generation)
14. [Best Practices](#best-practices)
15. [Common Patterns](#common-patterns)
16. [Troubleshooting](#troubleshooting)

---

## Prerequisites

### Required Accounts

- **Supabase Account**: Sign up at [supabase.com](https://supabase.com)
- **GitHub Account**: For OAuth authentication (optional)

### Environment

```bash
# Node.js 20 LTS or later
node --version  # Should be v20.x.x or higher

# Next.js 15 project already set up
npm --version   # v10.x.x or higher
```

---

## Creating a Supabase Project

### Step 1: Create New Project

1. Go to [app.supabase.com](https://app.supabase.com)
2. Click **New Project**
3. Fill in project details:
   - **Name**: Kilalo Production (or Development)
   - **Database Password**: Generate strong password (save securely!)
   - **Region**: Choose closest to your users
   - **Pricing Plan**: Free (for development) or Pro (for production)
4. Click **Create new project**
5. Wait 2-3 minutes for project provisioning

### Step 2: Note Your Project Credentials

Once created, go to **Project Settings** → **API**:

```bash
# Copy these values:
Project URL: https://abcdefghijklmnop.supabase.co
anon/public key: eyJhbGc...
service_role key: eyJhbGc... (keep secret!)
```

**Important**:
- ✅ `anon` key is safe for client-side use
- ❌ `service_role` key must NEVER be exposed to clients (server-only)

### Step 3: Create Additional Projects (Recommended)

Create separate projects for each environment:

| Environment | Project Name | Purpose |
|-------------|-------------|---------|
| Development | Kilalo Dev | Local development |
| Staging | Kilalo Staging | Preview deployments |
| Production | Kilalo Production | Live application |

---

## Installing Dependencies

### Step 1: Install Core Packages

```bash
# Supabase SSR package (for Next.js App Router)
npm install @supabase/ssr @supabase/supabase-js
```

**Package Explanations**:

| Package | Purpose |
|---------|---------|
| `@supabase/ssr` | Server-side rendering utilities for Next.js |
| `@supabase/supabase-js` | Supabase JavaScript client |

### Step 2: Install Type Generation Tool (Optional)

```bash
# Supabase CLI for type generation
npm install -D supabase
```

---

## Environment Variables Setup

### Step 1: Create Environment Variables

Update `.env.local`:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://abcdefghijklmnop.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...

# Server-only (DO NOT prefix with NEXT_PUBLIC_)
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...

# Optional: Custom JWT secret (for advanced use cases)
# SUPABASE_JWT_SECRET=your-jwt-secret
```

### Step 2: Update .env.local.example

```bash
# .env.local.example

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

### Step 3: Verify Environment Variables

```typescript
// lib/supabase/config.ts

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export { supabaseUrl, supabaseAnonKey, supabaseServiceRoleKey };
```

---

## Supabase Client Utilities

### Step 1: Create Server Client

Create `lib/supabase/server.ts`:

```typescript
// lib/supabase/server.ts

import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { supabaseUrl, supabaseAnonKey } from './config';

/**
 * Create a Supabase client for Server Components and Route Handlers
 *
 * Usage in Server Component:
 * const supabase = await createClient();
 * const { data } = await supabase.from('posts').select('*');
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(supabaseUrl!, supabaseAnonKey!, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch {
          // The `setAll` method was called from a Server Component.
          // This can be ignored if you have middleware refreshing
          // user sessions.
        }
      },
    },
  });
}
```

### Step 2: Create Client Component Client

Create `lib/supabase/client.ts`:

```typescript
// lib/supabase/client.ts

import { createBrowserClient } from '@supabase/ssr';
import { supabaseUrl, supabaseAnonKey } from './config';

/**
 * Create a Supabase client for Client Components
 *
 * Usage in Client Component:
 * 'use client';
 * const supabase = createClient();
 * const { data } = await supabase.from('posts').select('*');
 */
export function createClient() {
  return createBrowserClient(supabaseUrl!, supabaseAnonKey!);
}
```

### Step 3: Create Middleware Client

Create `lib/supabase/middleware.ts`:

```typescript
// lib/supabase/middleware.ts

import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import { supabaseUrl, supabaseAnonKey } from './config';

/**
 * Update user session in middleware
 * This refreshes the auth token if needed
 */
export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    supabaseUrl!,
    supabaseAnonKey!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value);
          });
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) => {
            supabaseResponse.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  // IMPORTANT: Avoid writing any logic between createServerClient and
  // supabase.auth.getUser(). A simple mistake could make it very hard to debug
  // issues with users being randomly logged out.

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Add user to request headers for easy access in route handlers
  if (user) {
    supabaseResponse.headers.set('x-user-id', user.id);
  }

  return supabaseResponse;
}
```

### Step 4: Create Admin Client (Server-Only)

Create `lib/supabase/admin.ts`:

```typescript
// lib/supabase/admin.ts

import { createClient } from '@supabase/supabase-js';
import { supabaseUrl, supabaseServiceRoleKey } from './config';

/**
 * Supabase Admin Client - BYPASSES ROW LEVEL SECURITY
 *
 * ⚠️ WARNING: This client has FULL access to the database.
 * Only use for:
 * - Server-side operations
 * - Admin functions
 * - Background jobs
 * - Database migrations
 *
 * NEVER expose this client to the frontend!
 */
export function createAdminClient() {
  if (!supabaseServiceRoleKey) {
    throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY');
  }

  return createClient(supabaseUrl!, supabaseServiceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
```

---

## Authentication Setup

### Step 1: Configure Authentication Providers

**Via Supabase Dashboard**:

1. Go to **Authentication** → **Providers**
2. Enable desired providers:

**Email/Password** (enabled by default):
- ✅ Confirm email: Enabled (recommended)
- ✅ Secure email change: Enabled

**OAuth Providers** (optional):

**Google**:
1. Click **Google**
2. Enable **Google enabled**
3. Enter credentials from [Google Cloud Console](https://console.cloud.google.com):
   - Client ID
   - Client Secret
4. Click **Save**

**GitHub**:
1. Click **GitHub**
2. Enable **GitHub enabled**
3. Enter credentials from [GitHub OAuth Apps](https://github.com/settings/developers):
   - Client ID
   - Client Secret
4. Click **Save**

### Step 2: Configure Email Templates

Go to **Authentication** → **Email Templates**:

**Confirm Signup**:
```html
<h2>Confirm your signup</h2>
<p>Follow this link to confirm your account:</p>
<p><a href="{{ .ConfirmationURL }}">Confirm your email</a></p>
```

**Magic Link**:
```html
<h2>Magic Link</h2>
<p>Follow this link to log in:</p>
<p><a href="{{ .ConfirmationURL }}">Log in to Kilalo</a></p>
```

**Reset Password**:
```html
<h2>Reset Password</h2>
<p>Follow this link to reset your password:</p>
<p><a href="{{ .ConfirmationURL }}">Reset your password</a></p>
```

### Step 3: Configure URL Configuration

Go to **Authentication** → **URL Configuration**:

```bash
# Site URL (production)
https://kilalo.com

# Redirect URLs (allow these domains)
http://localhost:3000/**
https://kilalo.com/**
https://*.vercel.app/**
```

### Step 4: Create Sign Up Server Action

Create `app/actions/auth.ts`:

```typescript
// app/actions/auth.ts

'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

export async function signUp(formData: FormData) {
  const supabase = await createClient();

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  };

  const { error } = await supabase.auth.signUp(data);

  if (error) {
    return { error: error.message };
  }

  revalidatePath('/', 'layout');
  redirect('/en/dashboard');
}

export async function signIn(formData: FormData) {
  const supabase = await createClient();

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  };

  const { error } = await supabase.auth.signInWithPassword(data);

  if (error) {
    return { error: error.message };
  }

  revalidatePath('/', 'layout');
  redirect('/en/dashboard');
}

export async function signOut() {
  const supabase = await createClient();

  const { error } = await supabase.auth.signOut();

  if (error) {
    return { error: error.message };
  }

  revalidatePath('/', 'layout');
  redirect('/en/login');
}
```

### Step 5: Create Login Form Component

Create `components/auth/login-form.tsx`:

```typescript
// components/auth/login-form.tsx

'use client';

import { useState } from 'react';
import { signIn } from '@/app/actions/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useTranslations } from 'next-intl';

export function LoginForm() {
  const t = useTranslations('Auth.login');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError(null);

    const result = await signIn(formData);

    if (result?.error) {
      setError(result.error);
      setLoading(false);
    }
  }

  return (
    <form action={handleSubmit} className="space-y-6">
      <div>
        <Label htmlFor="email">{t('email')}</Label>
        <Input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
        />
      </div>

      <div>
        <Label htmlFor="password">{t('password')}</Label>
        <Input
          id="password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
        />
      </div>

      {error && (
        <div className="rounded-md bg-red-50 p-4 text-sm text-red-800">
          {error}
        </div>
      )}

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? t('submitting') : t('submit')}
      </Button>
    </form>
  );
}
```

### Step 6: OAuth Sign In

```typescript
// components/auth/oauth-buttons.tsx

'use client';

import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';

export function OAuthButtons() {
  const supabase = createClient();

  async function signInWithGoogle() {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/api/auth/callback`,
      },
    });

    if (error) {
      console.error('Error signing in with Google:', error);
    }
  }

  async function signInWithGitHub() {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: {
        redirectTo: `${window.location.origin}/api/auth/callback`,
      },
    });

    if (error) {
      console.error('Error signing in with GitHub:', error);
    }
  }

  return (
    <div className="space-y-3">
      <Button
        type="button"
        variant="outline"
        className="w-full"
        onClick={signInWithGoogle}
      >
        Continue with Google
      </Button>

      <Button
        type="button"
        variant="outline"
        className="w-full"
        onClick={signInWithGitHub}
      >
        Continue with GitHub
      </Button>
    </div>
  );
}
```

---

## Database Schema Design

### Step 1: Create Profiles Table

Go to **SQL Editor** in Supabase Dashboard and run:

```sql
-- Create profiles table
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  website TEXT,
  preferred_language TEXT DEFAULT 'en' CHECK (preferred_language IN ('en', 'fr')),

  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create function to handle user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updated_at
CREATE TRIGGER on_profile_updated
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Create indexes
CREATE INDEX profiles_email_idx ON profiles(email);
```

### Step 2: Create Additional Tables (Example: Posts)

```sql
-- Create posts table (example)
CREATE TABLE posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  author_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  content TEXT,
  excerpt TEXT,
  published BOOLEAN DEFAULT false,
  published_at TIMESTAMP WITH TIME ZONE,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create indexes
CREATE INDEX posts_author_id_idx ON posts(author_id);
CREATE INDEX posts_slug_idx ON posts(slug);
CREATE INDEX posts_published_idx ON posts(published) WHERE published = true;

-- Create trigger for updated_at
CREATE TRIGGER on_post_updated
  BEFORE UPDATE ON public.posts
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
```

---

## Row Level Security (RLS)

### Step 1: Enable RLS on Tables

```sql
-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
```

### Step 2: Create RLS Policies for Profiles

```sql
-- Profiles: Allow users to read all profiles
CREATE POLICY "Profiles are viewable by everyone"
  ON profiles FOR SELECT
  USING (true);

-- Profiles: Allow users to update their own profile
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Profiles: Allow users to insert their own profile (via trigger)
CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);
```

### Step 3: Create RLS Policies for Posts

```sql
-- Posts: Allow anyone to view published posts
CREATE POLICY "Published posts are viewable by everyone"
  ON posts FOR SELECT
  USING (published = true);

-- Posts: Allow authenticated users to view their own unpublished posts
CREATE POLICY "Users can view own unpublished posts"
  ON posts FOR SELECT
  USING (auth.uid() = author_id);

-- Posts: Allow authenticated users to create posts
CREATE POLICY "Authenticated users can create posts"
  ON posts FOR INSERT
  WITH CHECK (auth.uid() = author_id);

-- Posts: Allow users to update their own posts
CREATE POLICY "Users can update own posts"
  ON posts FOR UPDATE
  USING (auth.uid() = author_id);

-- Posts: Allow users to delete their own posts
CREATE POLICY "Users can delete own posts"
  ON posts FOR DELETE
  USING (auth.uid() = author_id);
```

### Step 4: Test RLS Policies

```typescript
// Test in Server Component or Route Handler
const supabase = await createClient();

// This will only return posts WHERE RLS policies allow
const { data, error } = await supabase
  .from('posts')
  .select('*');

// RLS automatically filters results based on auth.uid()
```

---

## Auth Callback Route

### Create Auth Callback Handler

Create `app/api/auth/callback/route.ts`:

```typescript
// app/api/auth/callback/route.ts

import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  // If there's a 'next' parameter, use it as the redirect URL
  const next = searchParams.get('next') ?? '/en/dashboard';

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      const forwardedHost = request.headers.get('x-forwarded-host');
      const isLocalEnv = process.env.NODE_ENV === 'development';

      if (isLocalEnv) {
        return NextResponse.redirect(`${origin}${next}`);
      } else if (forwardedHost) {
        return NextResponse.redirect(`https://${forwardedHost}${next}`);
      } else {
        return NextResponse.redirect(`${origin}${next}`);
      }
    }
  }

  // Return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/auth/auth-code-error`);
}
```

---

## Protected Routes

### Step 1: Update Middleware

Already covered in i18n setup, but here's the auth portion:

```typescript
// middleware.ts

import { updateSession } from './lib/supabase/middleware';
import createIntlMiddleware from 'next-intl/middleware';
import { routing } from './lib/i18n/routing';
import { NextRequest, NextResponse } from 'next/server';

const handleI18nRouting = createIntlMiddleware(routing);

export async function middleware(request: NextRequest) {
  // Step 1: Update Supabase session
  const supabaseResponse = await updateSession(request);

  // Step 2: Handle i18n routing
  const response = handleI18nRouting(request);

  // Step 3: Merge cookies from Supabase response
  supabaseResponse.cookies.getAll().forEach((cookie) => {
    response.cookies.set(cookie);
  });

  // Step 4: Check authentication for protected routes
  const pathname = request.nextUrl.pathname;
  const isProtectedRoute = pathname.match(/\/(en|fr)\/(dashboard|member|profile)/);

  if (isProtectedRoute) {
    const userId = supabaseResponse.headers.get('x-user-id');

    if (!userId) {
      const locale = pathname.split('/')[1] || 'en';
      const loginUrl = new URL(`/${locale}/login`, request.url);
      loginUrl.searchParams.set('redirectTo', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return response;
}

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
};
```

### Step 2: Get Current User Helper

Create `lib/supabase/queries.ts`:

```typescript
// lib/supabase/queries.ts

import { createClient } from './server';

/**
 * Get the currently authenticated user
 * Returns null if not authenticated
 */
export async function getCurrentUser() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user;
}

/**
 * Get the current user's profile
 * Returns null if not authenticated or profile doesn't exist
 */
export async function getCurrentUserProfile() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  return profile;
}

/**
 * Require authentication - throws if not authenticated
 * Use in Server Components that require auth
 */
export async function requireAuth() {
  const user = await getCurrentUser();

  if (!user) {
    throw new Error('Unauthorized');
  }

  return user;
}
```

### Step 3: Protected Page Example

```typescript
// app/[locale]/(member)/dashboard/page.tsx

import { getCurrentUserProfile } from '@/lib/supabase/queries';
import { redirect } from 'next/navigation';

export default async function DashboardPage() {
  const profile = await getCurrentUserProfile();

  if (!profile) {
    redirect('/en/login');
  }

  return (
    <div>
      <h1>Welcome, {profile.full_name || 'User'}!</h1>
      <p>Email: {profile.email}</p>
    </div>
  );
}
```

---

## Real-time Subscriptions (Optional)

### Step 1: Enable Realtime

In Supabase Dashboard:
1. Go to **Database** → **Replication**
2. Enable replication for desired tables
3. Select tables: `posts`, `profiles`, etc.

### Step 2: Subscribe to Changes

```typescript
// components/posts-list.tsx

'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { Database } from '@/types/supabase';

type Post = Database['public']['Tables']['posts']['Row'];

export function PostsList({ initialPosts }: { initialPosts: Post[] }) {
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const supabase = createClient();

  useEffect(() => {
    // Subscribe to new posts
    const channel = supabase
      .channel('posts-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'posts',
          filter: 'published=eq.true',
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setPosts((current) => [payload.new as Post, ...current]);
          } else if (payload.eventType === 'UPDATE') {
            setPosts((current) =>
              current.map((post) =>
                post.id === payload.new.id ? (payload.new as Post) : post
              )
            );
          } else if (payload.eventType === 'DELETE') {
            setPosts((current) =>
              current.filter((post) => post.id !== payload.old.id)
            );
          }
        }
      )
      .subscribe();

    // Cleanup subscription on unmount
    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase]);

  return (
    <div>
      {posts.map((post) => (
        <article key={post.id}>
          <h2>{post.title}</h2>
          <p>{post.excerpt}</p>
        </article>
      ))}
    </div>
  );
}
```

---

## File Storage

### Step 1: Create Storage Bucket

In Supabase Dashboard:
1. Go to **Storage**
2. Click **New bucket**
3. Name: `avatars`
4. Public bucket: ✅ (for public avatars) or ❌ (for private files)
5. Click **Create bucket**

### Step 2: Create Storage Policies

```sql
-- Allow authenticated users to upload avatars
CREATE POLICY "Users can upload own avatar"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'avatars' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Allow anyone to view avatars (for public bucket)
CREATE POLICY "Avatars are publicly accessible"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'avatars');

-- Allow users to update their own avatar
CREATE POLICY "Users can update own avatar"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'avatars' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Allow users to delete their own avatar
CREATE POLICY "Users can delete own avatar"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'avatars' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );
```

### Step 3: Upload File Example

```typescript
// app/actions/upload.ts

'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function uploadAvatar(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'Unauthorized' };
  }

  const file = formData.get('avatar') as File;

  if (!file) {
    return { error: 'No file provided' };
  }

  // Upload to storage
  const fileExt = file.name.split('.').pop();
  const filePath = `${user.id}/avatar.${fileExt}`;

  const { error: uploadError } = await supabase.storage
    .from('avatars')
    .upload(filePath, file, {
      upsert: true, // Overwrite existing file
    });

  if (uploadError) {
    return { error: uploadError.message };
  }

  // Get public URL
  const { data } = supabase.storage
    .from('avatars')
    .getPublicUrl(filePath);

  // Update profile with new avatar URL
  const { error: updateError } = await supabase
    .from('profiles')
    .update({ avatar_url: data.publicUrl })
    .eq('id', user.id);

  if (updateError) {
    return { error: updateError.message };
  }

  revalidatePath('/profile');

  return { success: true, url: data.publicUrl };
}
```

---

## Type Generation

### Step 1: Login to Supabase CLI

```bash
# Login to Supabase
npx supabase login

# Follow the prompts to authenticate
```

### Step 2: Link Project

```bash
# Link to your Supabase project
npx supabase link --project-ref abcdefghijklmnop

# Replace 'abcdefghijklmnop' with your project ID
```

### Step 3: Generate Types

```bash
# Generate types from database schema
npx supabase gen types typescript --linked > types/supabase.ts
```

**Add to `package.json` scripts**:

```json
{
  "scripts": {
    "db:types": "npx supabase gen types typescript --linked > types/supabase.ts"
  }
}
```

### Step 4: Use Generated Types

```typescript
// types/supabase.ts (generated automatically)
export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          // ... other fields
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string | null;
        };
      };
      posts: {
        // ... post types
      };
    };
  };
};
```

**Usage**:

```typescript
// lib/supabase/server.ts

import type { Database } from '@/types/supabase';

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient<Database>(supabaseUrl!, supabaseAnonKey!, {
    // ... cookie configuration
  });
}
```

**Type-safe queries**:

```typescript
const { data, error } = await supabase
  .from('profiles') // ✅ TypeScript knows this table exists
  .select('id, email, full_name') // ✅ TypeScript validates columns
  .single();

// data is typed as:
// {
//   id: string;
//   email: string;
//   full_name: string | null;
// } | null
```

---

## Best Practices

### 1. Security

**✅ DO**:
- Always use Row Level Security (RLS)
- Validate user input in Server Actions
- Use `anon` key for client-side, `service_role` for server-side only
- Rotate keys regularly
- Use environment variables for all sensitive data

**❌ DON'T**:
- Never expose `service_role` key to clients
- Don't skip RLS for convenience
- Don't trust client-side data without validation

### 2. Performance

**✅ DO**:
- Use indexes on frequently queried columns
- Limit result sets with `.limit()`
- Use `.select()` projections to fetch only needed columns
- Cache query results when appropriate

**❌ DON'T**:
- Don't fetch entire tables without filters
- Don't make unnecessary database calls

### 3. Error Handling

```typescript
// Good error handling
const { data, error } = await supabase
  .from('posts')
  .select('*');

if (error) {
  console.error('Database error:', error);
  return { error: 'Failed to fetch posts' };
}

// Now data is guaranteed to be defined
return { data };
```

---

## Common Patterns

### 1. Pagination

```typescript
async function getPaginatedPosts(page = 1, limit = 10) {
  const supabase = await createClient();

  const from = (page - 1) * limit;
  const to = from + limit - 1;

  const { data, error, count } = await supabase
    .from('posts')
    .select('*', { count: 'exact' })
    .range(from, to)
    .order('created_at', { ascending: false });

  return {
    data,
    error,
    pagination: {
      total: count || 0,
      page,
      limit,
      totalPages: count ? Math.ceil(count / limit) : 0,
    },
  };
}
```

### 2. Search

```typescript
async function searchPosts(query: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .or(`title.ilike.%${query}%,content.ilike.%${query}%`)
    .limit(10);

  return { data, error };
}
```

### 3. Upsert

```typescript
async function upsertProfile(profile: Partial<Profile>) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('profiles')
    .upsert(profile)
    .select()
    .single();

  return { data, error };
}
```

---

## Troubleshooting

### Issue: "Invalid API key"

**Solution**: Verify environment variables are set correctly

```bash
# Check .env.local
cat .env.local | grep SUPABASE

# Restart dev server
npm run dev
```

### Issue: RLS blocking queries

**Symptoms**: Queries return empty results even though data exists

**Solution**: Check RLS policies

```sql
-- Temporarily disable RLS for testing (DON'T do this in production!)
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;

-- If data appears, your RLS policies are the issue
-- Re-enable and fix policies:
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
```

### Issue: "Failed to fetch"

**Solution**: Check CORS and API URL

```typescript
// Verify URL is correct
console.log(process.env.NEXT_PUBLIC_SUPABASE_URL);

// Check network tab in browser DevTools
```

---

## Next Steps

1. ✅ Supabase integrated with Next.js
2. ➡️ Test authentication flow
3. ➡️ Create database tables and RLS policies
4. ➡️ Generate TypeScript types
5. ➡️ Continue to [next-intl Setup](./09-SETUP-I18N.md)

---

## Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Next.js Guide](https://supabase.com/docs/guides/getting-started/quickstarts/nextjs)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [Supabase Storage](https://supabase.com/docs/guides/storage)

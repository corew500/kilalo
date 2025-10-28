# Supabase Authentication Skill

## Description
Implement authentication flows and protected routes using Supabase Auth with Next.js App Router SSR patterns. Includes session management, role-based access control, and user profile handling.

## When to Use
- Implementing user authentication (login/signup)
- Creating protected routes or pages
- Checking user permissions/roles
- Managing user profiles
- Building admin dashboards

## Input Parameters
- **authType**: Type of auth implementation (login, signup, protected-page, role-check, profile)
- **roles**: Required roles (for role-based access)
- **redirectPath**: Where to redirect after auth actions

## Output
Returns complete auth implementation with:
- Server-side auth checks
- Client-side auth components
- Middleware configuration
- Database schema (if needed)

## Example Usage

### Example 1: Protected Dashboard Page

**Input:**
```
Create a protected dashboard page that requires authentication
```

**Output:**

```typescript
// app/[locale]/(app)/dashboard/page.tsx
import { requireAuth } from '@/lib/supabase/auth-helpers'
import { redirect } from 'next/navigation'

export default async function DashboardPage() {
  const user = await requireAuth()

  if (!user) {
    redirect('/login')
  }

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Welcome, {user.email}</p>
    </div>
  )
}
```

### Example 2: Admin-Only Page with Role Check

**Input:**
```
Create an admin page that requires 'admin' role
```

**Output:**

```typescript
// app/[locale]/(app)/admin/page.tsx
import { requireRole } from '@/lib/supabase/auth-helpers'
import { redirect } from 'next/navigation'

export default async function AdminPage() {
  try {
    const user = await requireRole('admin')

    return (
      <div>
        <h1>Admin Dashboard</h1>
        <p>Admin: {user.email}</p>
        {/* Admin controls */}
      </div>
    )
  } catch (error) {
    redirect('/unauthorized')
  }
}
```

### Example 3: Login Form Component

**Input:**
```
Create a login form with email/password
```

**Output:**

```typescript
// components/auth/LoginForm.tsx
'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from '@/lib/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'

export default function LoginForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsLoading(true)

    const formData = new FormData(e.currentTarget)
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      toast.error(error.message)
      setIsLoading(false)
      return
    }

    toast.success('Logged in successfully!')
    router.push('/dashboard')
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          required
          placeholder="you@example.com"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          name="password"
          type="password"
          required
          placeholder="••••••••"
        />
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? 'Signing in...' : 'Sign In'}
      </Button>
    </form>
  )
}
```

### Example 4: Signup with Email Verification

**Input:**
```
Create signup form with email verification
```

**Output:**

```typescript
// app/[locale]/(auth)/signup/actions.ts
'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function signUp(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const supabase = await createClient()

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
    },
  })

  if (error) {
    return { error: error.message }
  }

  redirect('/verify-email')
}

// components/auth/SignupForm.tsx
'use client'

import { signUp } from '@/app/[locale]/(auth)/signup/actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'

export default function SignupForm() {
  async function handleSubmit(formData: FormData) {
    const result = await signUp(formData)

    if (result?.error) {
      toast.error(result.error)
    } else {
      toast.success('Check your email to verify your account!')
    }
  }

  return (
    <form action={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          required
          placeholder="you@example.com"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          name="password"
          type="password"
          required
          minLength={8}
          placeholder="••••••••"
        />
      </div>

      <Button type="submit" className="w-full">
        Sign Up
      </Button>
    </form>
  )
}
```

### Example 5: Auth Callback Route

**Input:**
```
Create auth callback handler for email verification and OAuth
```

**Output:**

```typescript
// app/auth/callback/route.ts
import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/dashboard'

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  // Return to login if auth failed
  return NextResponse.redirect(`${origin}/login`)
}
```

### Example 6: Profile Management

**Input:**
```
Create user profile page with update functionality
```

**Output:**

**Database Schema:**
```sql
-- Create profiles table
create table profiles (
  id uuid references auth.users on delete cascade primary key,
  full_name text,
  avatar_url text,
  bio text,
  website text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Enable RLS
alter table profiles enable row level security;

-- Users can view their own profile
create policy "Users can view own profile"
  on profiles for select
  using (auth.uid() = id);

-- Users can update their own profile
create policy "Users can update own profile"
  on profiles for update
  using (auth.uid() = id);
```

**Server Component:**
```typescript
// app/[locale]/(app)/profile/page.tsx
import { requireAuth, getUserProfile } from '@/lib/supabase/auth-helpers'
import ProfileForm from '@/components/profile/ProfileForm'

export default async function ProfilePage() {
  const user = await requireAuth()
  const profile = await getUserProfile()

  return (
    <div>
      <h1>Your Profile</h1>
      <ProfileForm initialData={profile} user={user} />
    </div>
  )
}
```

**Form Component:**
```typescript
// components/profile/ProfileForm.tsx
'use client'

import { updateUserProfile } from '@/lib/supabase/auth-helpers'
import { toast } from 'sonner'

export default function ProfileForm({ initialData, user }) {
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)

    const updates = {
      full_name: formData.get('full_name') as string,
      bio: formData.get('bio') as string,
      website: formData.get('website') as string,
    }

    try {
      await updateUserProfile(updates)
      toast.success('Profile updated!')
    } catch (error) {
      toast.error('Failed to update profile')
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
    </form>
  )
}
```

## Best Practices Applied
1. Always use Server Components for auth checks
2. Use middleware for session refresh
3. Implement Row Level Security (RLS) in Supabase
4. Cache user data with React `cache()`
5. Handle errors gracefully
6. Redirect after auth state changes
7. Store roles in user_metadata for simple RBAC

## Required Environment Variables
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## Common Auth Patterns
- **Login**: `supabase.auth.signInWithPassword()`
- **Signup**: `supabase.auth.signUp()`
- **Logout**: `supabase.auth.signOut()`
- **OAuth**: `supabase.auth.signInWithOAuth({ provider })`
- **Password Reset**: `supabase.auth.resetPasswordForEmail()`
- **Update User**: `supabase.auth.updateUser()`

## Middleware Configuration
Ensure middleware refreshes sessions:

```typescript
// middleware.ts
import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const response = NextResponse.next()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options)
          })
        },
      },
    }
  )

  await supabase.auth.getUser()

  return response
}
```

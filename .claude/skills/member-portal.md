# Member Portal Development - Claude Skill

**Purpose**: Guide for building and extending the Kilalo member portal with role-based access control.

---

## Quick Reference

### Portal Structure

```
Member Portal
├── Common Pages (all users)
│   ├── /dashboard - Role detection & welcome
│   ├── /profile - View/edit profile
│   └── /settings - Account settings
├── Entrepreneur Only
│   └── /company - Company profile & programs
├── Mentor Only
│   └── /mentor - Expertise & mentees
└── Community (all users)
    └── /community - Events & resources
```

### User Types

- `entrepreneur` - Startups seeking mentorship & programs
- `mentor` - Experienced professionals offering guidance
- `community_member` - General community participants

---

## File Patterns

### 1. Server Component Page with Auth

```typescript
// app/[locale]/(member)/page-name/page.tsx
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function PageName({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const supabase = await createClient()

  // 1. Auth check
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect(`/${locale}/login`)
  }

  // 2. Fetch profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  // 3. Role check (optional)
  if (profile?.user_type !== 'required_type') {
    redirect(`/${locale}/dashboard`)
  }

  // 4. Render
  return <div>{/* Content */}</div>
}
```

**Key Points**:

- Always async server component
- Auth check before any data fetching
- Redirect to login if no user
- Fetch full profile for role detection
- Role-specific redirects to dashboard

### 2. Server Action with Validation

```typescript
// app/[locale]/(member)/page-name/actions.ts
'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

// 1. Define schema
const updateSchema = z.object({
  field: z.string().min(1).max(100),
  optional_field: z.string().optional(),
})

// 2. Server action
export async function updateData(formData: FormData) {
  const supabase = await createClient()

  // 3. Auth check
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'You must be logged in' }
  }

  // 4. Parse and validate
  const result = updateSchema.safeParse({
    field: formData.get('field'),
    optional_field: formData.get('optional_field') || undefined,
  })

  if (!result.success) {
    return {
      error: 'Validation failed',
      fieldErrors: result.error.flatten().fieldErrors,
    }
  }

  // 5. Database update
  const { error } = await supabase
    .from('profiles')
    .update(result.data)
    .eq('id', user.id)
    .select()
    .single()

  if (error) {
    return { error: error.message }
  }

  // 6. Revalidate and return
  revalidatePath('/[locale]/(member)/page-name', 'page')
  return { success: true }
}
```

**Key Points**:

- Mark function `'use server'`
- Auth check at top
- Zod validation before DB operations
- Revalidate path after mutations
- Return serializable objects only

### 3. Client Component with Form

```typescript
'use client'

import { useActionState } from 'react'
import { updateData } from './actions'

export function FormComponent() {
  const [state, formAction, isPending] = useActionState(updateData, null)

  return (
    <form action={formAction}>
      <input name="field" required />

      {state?.error && <p className="text-red-600">{state.error}</p>}

      {state?.success && <p className="text-green-600">Saved successfully!</p>}

      <button type="submit" disabled={isPending}>
        {isPending ? 'Saving...' : 'Save'}
      </button>
    </form>
  )
}
```

**Key Points**:

- Use `useActionState` for server actions
- Handle pending state for UX
- Display errors and success messages
- Disable button while submitting

---

## Testing Patterns

### Server Component Test

```typescript
import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { redirect } from 'next/navigation'
import PageComponent from '../page'
import { createClient } from '@/lib/supabase/server'

vi.mock('next/navigation', () => ({
  redirect: vi.fn(),
}))

vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(),
}))

describe('PageComponent', () => {
  const mockUser = { id: 'user-123', email: 'test@example.com' }
  const mockProfile = { id: 'user-123', user_type: 'entrepreneur' }

  beforeEach(() => {
    vi.clearAllMocks()

    const mockSupabase = {
      auth: {
        getUser: vi.fn().mockResolvedValue({ data: { user: mockUser } }),
      },
      from: vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({ data: mockProfile }),
          }),
        }),
      }),
    }

    ;(createClient as any).mockResolvedValue(mockSupabase)
  })

  it('redirects unauthenticated users', async () => {
    const mockSupabase = {
      auth: {
        getUser: vi.fn().mockResolvedValue({ data: { user: null } }),
      },
      from: vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({ data: mockProfile }),
          }),
        }),
      }),
    }

    ;(createClient as any).mockResolvedValue(mockSupabase)
    vi.mocked(redirect).mockImplementation(() => {
      throw new Error('NEXT_REDIRECT')
    })

    await expect(PageComponent({ params: Promise.resolve({ locale: 'en' }) })).rejects.toThrow()

    expect(redirect).toHaveBeenCalledWith('/en/login')
  })

  it('renders for authenticated user', async () => {
    const params = Promise.resolve({ locale: 'en' })
    const component = await PageComponent({ params })
    render(component)

    expect(screen.getByText('Expected Content')).toBeInTheDocument()
  })
})
```

**Key Testing Patterns**:

- Mock Supabase client in `beforeEach`
- Mock redirect to throw for testing
- Use `rejects.toThrow()` for redirect tests
- Await component before rendering
- Override mocks per test when needed

---

## Database Schema Patterns

### Profile Fields by Role

```typescript
// Common fields (all users)
interface BaseProfile {
  id: string
  user_type: 'entrepreneur' | 'mentor' | 'community_member'
  full_name: string | null
  bio: string | null
  location: string | null
  languages_spoken: string[] | null
  phone: string | null
  phone_visible: boolean
  linkedin_url: string | null
  twitter_url: string | null
  website: string | null
  profile_visible: boolean
  contact_visible: boolean
}

// Entrepreneur-specific
interface EntrepreneurProfile extends BaseProfile {
  company_name: string | null
  company_stage: 'idea' | 'mvp' | 'early_revenue' | 'growth' | 'scaling' | null
  industry: string | null
  employees_count: number | null
  funding_stage: string | null
}

// Mentor-specific
interface MentorProfile extends BaseProfile {
  expertise_areas: string[] | null
  mentor_availability: 'available' | 'limited' | 'unavailable'
  years_experience: number | null
}
```

### RLS Policy Pattern

```sql
-- Users can read their own profile
CREATE POLICY "Users can view own profile"
ON profiles FOR SELECT
USING (auth.uid() = id);

-- Users can update their own profile (except user_type)
CREATE POLICY "Users can update own profile"
ON profiles FOR UPDATE
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Public profiles visible to authenticated users
CREATE POLICY "View public profiles"
ON profiles FOR SELECT
USING (
  auth.role() = 'authenticated' AND
  profile_visible = true
);
```

---

## Common Workflows

### Adding a New Portal Feature

1. **Plan the feature**
   - Which user types need access?
   - What data is required?
   - Does it need new DB fields?

2. **Database changes** (if needed)

   ```bash
   # Create migration
   npx supabase migration new add_feature_field

   # Write SQL
   ALTER TABLE profiles ADD COLUMN new_field TEXT;

   # Apply migration
   npx supabase db push

   # Update types
   npm run types:supabase
   ```

3. **Create the page**
   - Use server component template
   - Add auth + role checks
   - Fetch required data
   - Render UI

4. **Add to navigation**
   - Update `MemberSidebar.tsx`
   - Add role-based conditional
   - Use appropriate icon

5. **Write tests**
   - Auth redirect test
   - Role redirect test (if applicable)
   - Rendering test
   - Data display tests

6. **Add server actions** (if forms)
   - Create `actions.ts`
   - Define Zod schema
   - Implement action with validation
   - Add error handling

### Debugging Common Issues

**"Profile not loading"**:

```typescript
// Check in page component
console.log('User:', user)
console.log('Profile:', profile)
console.log('User Type:', profile?.user_type)

// Check RLS policies in Supabase Dashboard
// Verify trigger created profile on signup
```

**"Redirect loop"**:

```typescript
// Verify redirect conditions
if (!user) redirect(`/${locale}/login`) // ✅ Good
if (profile?.user_type !== 'specific') redirect(`/${locale}/dashboard`) // ✅ Good

// Avoid redirecting from dashboard based on user_type
// Dashboard should welcome all user types
```

**"Form submission not working"**:

```typescript
// Check server action return value
return { success: true } // ✅ Serializable
return { user: userObject } // ❌ Not serializable

// Verify auth check
if (!user) return { error: 'Unauthorized' } // ✅ Good

// Check Zod schema matches form fields
const schema = z.object({
  field: z.string(), // Must match formData.get('field')
})
```

---

## Best Practices

### Security

1. **Always check auth** - Every server component and action
2. **Use RLS policies** - Never trust client-side checks
3. **Validate inputs** - Zod validation on all form submissions
4. **Sanitize data** - Especially user-generated content
5. **Respect privacy** - Check privacy settings before displaying data

### Performance

1. **Server components by default** - Only use 'use client' when needed
2. **Minimal data fetching** - Select only required columns
3. **Revalidate paths** - After mutations for fresh data
4. **Optimize images** - Use Next.js Image component
5. **Lazy load** - Heavy components and images

### User Experience

1. **Loading states** - Show spinners during async operations
2. **Error messages** - Clear, actionable error messages
3. **Success feedback** - Confirm successful actions
4. **Optimistic updates** - Update UI before server confirms
5. **Mobile responsive** - Test on mobile devices

### Testing

1. **Test auth flows** - Unauthenticated and authenticated
2. **Test role checks** - Each user type's access
3. **Test form validation** - Valid and invalid inputs
4. **Test error states** - Network errors, validation errors
5. **Test edge cases** - Null values, missing data

---

## Quick Commands

```bash
# Development
npm run dev                    # Start dev server
npm run types:supabase         # Generate Supabase types

# Testing
npm test                       # Run all tests
npm test -- profile           # Run specific tests
npm run test:e2e              # Run E2E tests

# Database
npx supabase migration new NAME   # Create migration
npx supabase db push              # Apply migrations
npx supabase db reset             # Reset local DB

# Deployment
git push                          # Auto-deploy to Vercel
```

---

## Resources

- [Full Documentation](../../docs/MEMBER_PORTAL.md)
- [Supabase Auth](../../.claude/skills/supabase-auth.md)
- [Testing Guide](../../.claude/skills/vitest-testing.md)
- [Architecture](../../docs/02-ARCHITECTURE.md)

---

**Last Updated**: October 31, 2025

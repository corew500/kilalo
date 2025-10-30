# Kilalo Developer Guide

**Version**: 1.0
**Last Updated**: October 30, 2025

Welcome to the Kilalo development guide. This document provides a comprehensive overview of the project architecture, features, and development patterns.

---

## 📑 Table of Contents

1. [Quick Start](#quick-start)
2. [Architecture Overview](#architecture-overview)
3. [Feature Reference](#feature-reference)
4. [Development Workflows](#development-workflows)
5. [Code Patterns](#code-patterns)
6. [Testing Strategy](#testing-strategy)
7. [Deployment](#deployment)
8. [Troubleshooting](#troubleshooting)

---

## Quick Start

### Prerequisites

- **Node.js**: 20+ (LTS recommended)
- **Package Manager**: npm 10+
- **Accounts**: Supabase, Sanity, Vercel (for deployment)

### Installation

```bash
# Clone repository
git clone https://github.com/corew500/kilalo.git
cd kilalo

# Install dependencies
npm install

# Set up environment variables
cp .env.local.example .env.local
# Edit .env.local with your credentials

# Start development server
npm run dev
```

### Development Commands

```bash
npm run dev          # Start dev server with Turbopack (http://localhost:3000)
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm test             # Run all tests
npm run test:unit    # Run unit tests with Vitest
npm run test:e2e     # Run E2E tests with Playwright
```

### Access Points

- **Main Website**: http://localhost:3000
- **English**: http://localhost:3000/en
- **French**: http://localhost:3000/fr
- **Sanity Studio**: http://localhost:3000/studio

---

## Architecture Overview

### Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Framework** | Next.js 16 (App Router) | React framework with SSR/ISR |
| **Language** | TypeScript 5.9.3 (strict) | Type safety |
| **Styling** | Tailwind CSS 3.4 + shadcn/ui | Utility-first CSS + components |
| **CMS** | Sanity Studio | Content management |
| **Database** | Supabase (PostgreSQL) | Auth + data storage |
| **i18n** | next-intl | Internationalization (EN/FR) |
| **Testing** | Vitest + Playwright | Unit + E2E testing |
| **Deployment** | Vercel | Hosting + Edge Functions |

### Project Structure

```
kilalo/
├── app/                          # Next.js App Router
│   ├── [locale]/                 # Localized routes
│   │   ├── (marketing)/          # Public pages (no auth)
│   │   │   ├── page.tsx          # Homepage
│   │   │   ├── about/            # About page
│   │   │   ├── programs/         # Programs page
│   │   │   ├── ventures/         # Portfolio
│   │   │   ├── community/        # Events & blog
│   │   │   ├── work-with-us/     # CTA page
│   │   │   ├── contact/          # Contact
│   │   │   └── services/         # Services
│   │   ├── (auth)/               # Auth pages (login/signup)
│   │   └── (member)/             # Protected pages (future)
│   ├── studio/[[...tool]]/       # Embedded Sanity Studio
│   └── globals.css               # Global styles
│
├── components/
│   ├── ui/                       # shadcn/ui primitives
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   └── ...                   # Other UI components
│   ├── marketing/                # Marketing-specific components
│   │   ├── Header.tsx            # Site header
│   │   ├── Footer.tsx            # Site footer
│   │   └── LanguageSwitcher.tsx  # Locale switcher
│   └── shared/                   # Reusable across app
│       ├── VentureCard.tsx       # Portfolio card
│       ├── EventCard.tsx         # Event card
│       ├── ImpactMetrics.tsx     # Stats dashboard
│       └── ...                   # Other shared components
│
├── lib/                          # Utility libraries
│   ├── supabase/                 # Supabase utilities
│   │   ├── client.ts             # Browser client
│   │   ├── server.ts             # Server client
│   │   └── auth-helpers.ts       # Auth utilities
│   ├── forms/                    # Form handling
│   │   ├── validation-schemas.ts # Zod schemas
│   │   └── form-actions.ts       # Server actions
│   ├── seo/                      # SEO utilities
│   │   └── metadata.ts           # Metadata generation
│   ├── i18n-helpers.ts           # i18n utilities
│   ├── navigation.ts             # Locale-aware navigation
│   └── utils.ts                  # General utilities (cn, etc.)
│
├── sanity/                       # Sanity CMS
│   ├── schemaTypes/              # Content schemas
│   │   ├── index.ts
│   │   ├── venture.ts
│   │   ├── event.ts
│   │   ├── post.ts
│   │   └── ...                   # Other schemas
│   ├── lib/                      # Sanity utilities
│   │   ├── client.ts             # Sanity client
│   │   ├── queries.ts            # GROQ queries
│   │   └── image.ts              # Image URL builder
│   └── env.ts                    # Environment config
│
├── messages/                     # Internationalization
│   ├── en.json                   # English translations
│   └── fr.json                   # French translations
│
├── i18n/                         # i18n configuration
│   ├── routing.ts                # Routing config
│   └── request.ts                # Request config
│
├── types/                        # TypeScript types
│   ├── sanity.ts                 # Sanity types (generated)
│   └── supabase.ts               # Supabase types (generated)
│
├── __tests__/                    # Unit tests
├── tests/e2e/                    # E2E tests
├── .claude/skills/               # AI assistance patterns
└── docs/                         # Documentation
```

### Data Flow

```
┌─────────────────────────────────────────────────────────────┐
│                         User Request                        │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────┐
│                    Next.js Middleware                       │
│  • Locale detection (next-intl)                            │
│  • Auth session refresh (Supabase)                         │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────┐
│                 Server Component (RSC)                      │
│  • Fetch from Sanity CMS (GROQ queries)                    │
│  • Fetch from Supabase (if auth required)                  │
│  • Get translations (next-intl)                            │
│  • Generate metadata (SEO)                                 │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────┐
│              Client Component Hydration                     │
│  • Interactive features (forms, modals)                    │
│  • Client-side translations                                │
│  • User interactions                                       │
└─────────────────────────────────────────────────────────────┘
```

---

## Feature Reference

### 1. Internationalization (i18n)

**Status**: ✅ Complete (100% coverage)

#### Implementation

- **Library**: next-intl
- **Locales**: English (en), French (fr)
- **Coverage**: 206 fields × 2 languages = 412 translations

#### Usage

**Server Components:**
```typescript
import { getTranslations } from 'next-intl/server'

export default async function Page() {
  const t = await getTranslations('HomePage')
  return <h1>{t('title')}</h1>
}
```

**Client Components:**
```typescript
'use client'
import { useTranslations } from 'next-intl'

export default function Component() {
  const t = useTranslations('Component')
  return <p>{t('description')}</p>
}
```

**Navigation:**
```typescript
import { Link } from '@/lib/navigation'

// Automatically includes locale in URL
<Link href="/about">About</Link>
```

**Sanity Content:**
```typescript
import { getLocalizedValue } from '@/lib/i18n-helpers'

const title = getLocalizedValue(venture.name, locale)
```

#### File Locations

- **Configuration**: `i18n/routing.ts`, `i18n/request.ts`
- **Translations**: `messages/en.json`, `messages/fr.json`
- **Helpers**: `lib/i18n-helpers.ts`
- **Middleware**: `middleware.ts`

**Reference**: [docs/TRANSLATION_WORKFLOW.md](docs/TRANSLATION_WORKFLOW.md)

---

### 2. Content Management (Sanity CMS)

**Status**: ✅ Complete

#### Content Types

1. **Site Settings** - Global site configuration (206 translatable fields)
2. **Ventures** - Portfolio companies
3. **Events** - Hekima Time sessions and webinars
4. **Case Studies** - Success stories
5. **Programs** - V2S and other programs
6. **Blog Posts** - Articles and updates
7. **Team Members** - Staff and advisors
8. **Impact Metrics** - Dashboard statistics

#### GROQ Queries

**Type-Safe Queries:**
```typescript
import { defineQuery } from 'next-sanity'

export const VENTURES_QUERY = defineQuery(`
  *[_type == "venture" && defined(slug.current)] | order(_createdAt desc) {
    _id,
    name,
    tagline,
    slug,
    logo
  }
`)
```

**Usage:**
```typescript
import { client } from '@/sanity/lib/client'
import { VENTURES_QUERY } from '@/sanity/lib/queries'

const ventures = await client.fetch(VENTURES_QUERY)
// Automatically typed!
```

#### Content Workflow

1. **Edit**: Access Studio at `/studio`
2. **Save Draft**: Content saved but not published
3. **Publish**: Makes content live
4. **Webhook**: Triggers ISR revalidation on Vercel

#### File Locations

- **Configuration**: `sanity.config.ts`, `sanity/env.ts`
- **Schemas**: `sanity/schemaTypes/`
- **Queries**: `sanity/lib/queries.ts`
- **Client**: `sanity/lib/client.ts`

**Reference**: [sanity/WORKFLOW.md](sanity/WORKFLOW.md), [.claude/skills/sanity-query.md](.claude/skills/sanity-query.md)

---

### 3. Authentication (Supabase)

**Status**: 🟡 Partial (basic setup, auth implementation pending)

#### Current Setup

- ✅ Supabase project created
- ✅ Client utilities configured
- ✅ Environment variables set
- ❌ Auth flow not implemented

#### Planned Implementation

**Database Schema:**
```sql
create table profiles (
  id uuid references auth.users on delete cascade primary key,
  full_name text,
  avatar_url text,
  bio text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Row Level Security
alter table profiles enable row level security;

create policy "Users can view own profile"
  on profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on profiles for update
  using (auth.uid() = id);
```

**Auth Utilities:**
```typescript
import { getUser, requireAuth } from '@/lib/supabase/auth-helpers'

// Get current user (returns null if not authenticated)
const user = await getUser()

// Require authentication (throws if not authenticated)
const user = await requireAuth()
```

#### File Locations

- **Client**: `lib/supabase/client.ts` (browser)
- **Server**: `lib/supabase/server.ts` (server-side)
- **Helpers**: `lib/supabase/auth-helpers.ts`
- **Middleware**: `middleware.ts`

**Reference**: [.claude/skills/supabase-auth.md](.claude/skills/supabase-auth.md), [docs/07-SETUP-SUPABASE.md](docs/07-SETUP-SUPABASE.md)

---

### 4. Form Handling

**Status**: ✅ Complete (schemas ready, integration pending)

#### Available Forms

1. **Contact Form** - General inquiries
2. **Newsletter Signup** - Email collection
3. **Business Assessment** - Free assessment requests
4. **Partner Interest** - Partnership inquiries
5. **Mentor Application** - Mentor onboarding
6. **Event Registration** - Event RSVPs

#### Implementation Pattern

**1. Define Schema:**
```typescript
// lib/forms/validation-schemas.ts
import { z } from 'zod'

export const contactFormSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  message: z.string().min(20).max(1000),
  consent: z.boolean().refine(val => val === true)
})

export type ContactFormData = z.infer<typeof contactFormSchema>
```

**2. Create Server Action:**
```typescript
// lib/forms/form-actions.ts
'use server'

export async function submitContactForm(
  formData: ContactFormData
): Promise<FormResponse> {
  const t = await getTranslations('ContactForm')

  try {
    const validated = contactFormSchema.parse(formData)
    // Process form (email, database, etc.)
    return { success: true, message: t('successMessage') }
  } catch (error) {
    return { success: false, error: t('errorMessage') }
  }
}
```

**3. Create Form Component:**
```typescript
'use client'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

export default function ContactForm() {
  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: { name: '', email: '', message: '', consent: false }
  })

  async function onSubmit(data: ContactFormData) {
    const result = await submitContactForm(data)
    if (result.success) {
      toast.success(result.message)
      form.reset()
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        {/* Form fields */}
      </form>
    </Form>
  )
}
```

#### File Locations

- **Schemas**: `lib/forms/validation-schemas.ts`
- **Actions**: `lib/forms/form-actions.ts`
- **Components**: `components/forms/`

**Reference**: [.claude/skills/form-validation.md](.claude/skills/form-validation.md)

---

### 5. SEO & Metadata

**Status**: ✅ Complete

#### Features

- ✅ Dynamic metadata generation
- ✅ Open Graph tags
- ✅ Twitter Cards
- ✅ Multilingual alternate links
- ✅ Structured data (JSON-LD)

#### Usage

**Page Metadata:**
```typescript
import { generatePageMetadata } from '@/lib/seo/metadata'
import type { Metadata } from 'next'

export async function generateMetadata(): Promise<Metadata> {
  return generatePageMetadata({
    title: 'About Us',
    description: 'Learn about Kilalo',
    path: '/about',
    locale: 'en'
  })
}
```

**Structured Data:**
```typescript
import { generateArticleSchema } from '@/lib/seo/metadata'

const articleSchema = generateArticleSchema({
  title: post.title,
  description: post.excerpt,
  publishedTime: post.publishedAt,
  author: post.author?.name,
  url: `https://kilalo.org/blog/${post.slug}`
})

return (
  <>
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
    />
    <article>{/* content */}</article>
  </>
)
```

#### File Locations

- **Utilities**: `lib/seo/metadata.ts`

**Reference**: [.claude/skills/seo-metadata.md](.claude/skills/seo-metadata.md)

---

### 6. UI Components

**Status**: ✅ Complete

#### Component Library

**shadcn/ui Primitives** (`components/ui/`):
- Button, Card, Input, Label
- Dialog, Form, Dropdown Menu
- Checkbox, Radio, Select
- Toast, Alert, Badge

**Marketing Components** (`components/marketing/`):
- Header - Site navigation
- Footer - Site footer with links
- LanguageSwitcher - EN/FR toggle

**Shared Components** (`components/shared/`):
- VentureCard - Portfolio company card
- EventCard - Event listing card
- ImpactMetrics - Statistics dashboard
- TeamGrid - Team member grid
- BusinessAssessmentCTA - Call-to-action button

#### Usage Pattern

```typescript
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function Component() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Title</CardTitle>
      </CardHeader>
      <CardContent>
        <Button>Click Me</Button>
      </CardContent>
    </Card>
  )
}
```

**Reference**: [.claude/skills/component-generation.md](.claude/skills/component-generation.md)

---

## Development Workflows

### Adding New Content Type in Sanity

1. **Create Schema**:
   ```typescript
   // sanity/schemaTypes/myType.ts
   import { defineType, defineField } from 'sanity'

   export default defineType({
     name: 'myType',
     title: 'My Type',
     type: 'document',
     fields: [
       defineField({ name: 'title', type: 'string', validation: Rule => Rule.required() }),
       defineField({ name: 'slug', type: 'slug', options: { source: 'title' } })
     ]
   })
   ```

2. **Register Schema**:
   ```typescript
   // sanity/schemaTypes/index.ts
   import myType from './myType'

   export const schema = { types: [myType, /* ... */] }
   ```

3. **Create Query**:
   ```typescript
   // sanity/lib/queries.ts
   export const MY_TYPE_QUERY = defineQuery(`
     *[_type == "myType"] { _id, title, slug }
   `)
   ```

4. **Generate Types**: `npx sanity@latest typegen generate`

5. **Use in Component**:
   ```typescript
   const items = await client.fetch(MY_TYPE_QUERY)
   ```

### Adding New Translation Key

1. **Add to English**:
   ```json
   // messages/en.json
   {
     "ComponentName": {
       "newKey": "English text"
     }
   }
   ```

2. **Add to French**:
   ```json
   // messages/fr.json
   {
     "ComponentName": {
       "newKey": "Texte français"
     }
   }
   ```

3. **Use in Component**:
   ```typescript
   const t = useTranslations('ComponentName')
   <p>{t('newKey')}</p>
   ```

### Creating New Page

1. **Create Page File**:
   ```typescript
   // app/[locale]/(marketing)/my-page/page.tsx
   import { getTranslations } from 'next-intl/server'

   export async function generateMetadata() {
     return generatePageMetadata({
       title: 'My Page',
       description: 'Description',
       path: '/my-page'
     })
   }

   export default async function MyPage() {
     const t = await getTranslations('MyPage')
     return <main><h1>{t('title')}</h1></main>
   }
   ```

2. **Add Translations** in `messages/en.json` and `messages/fr.json`

3. **Update Navigation** in `components/marketing/Header.tsx` if needed

---

## Code Patterns

### TypeScript Patterns

**Strict Mode Enabled** - No implicit any, proper null checks:
```typescript
// ✅ Good
const user: User | null = await getUser()
if (!user) return null

// ❌ Bad
const user = await getUser() // Could be null!
const name = user.name // TypeScript error
```

**Type Inference from Zod**:
```typescript
const schema = z.object({ name: z.string(), age: z.number() })
type FormData = z.infer<typeof schema>
// FormData is { name: string; age: number }
```

### Server vs Client Components

**Use Server Components By Default**:
```typescript
// app/[locale]/(marketing)/page.tsx
// No 'use client' directive = Server Component
export default async function Page() {
  const data = await fetch(...)  // Can fetch on server
  return <div>{data}</div>
}
```

**Use Client Components Only When Needed**:
```typescript
// components/InteractiveButton.tsx
'use client'  // Required for useState, useEffect, event handlers

import { useState } from 'react'

export default function InteractiveButton() {
  const [count, setCount] = useState(0)
  return <button onClick={() => setCount(count + 1)}>{count}</button>
}
```

### Utility Functions

**cn() - Class Merging**:
```typescript
import { cn } from '@/lib/utils'

<div className={cn('base-class', isActive && 'active-class', className)} />
```

**getLocalizedValue() - i18n Helper**:
```typescript
import { getLocalizedValue } from '@/lib/i18n-helpers'

const title = getLocalizedValue(content.title, locale)
```

---

## Testing Strategy

### Unit Tests (Vitest)

**Location**: `__tests__/` alongside source files

**Example**:
```typescript
// components/shared/__tests__/VentureCard.test.tsx
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import VentureCard from '../VentureCard'

describe('VentureCard', () => {
  it('renders venture name', () => {
    render(<VentureCard venture={mockVenture} locale="en" />)
    expect(screen.getByText('Venture Name')).toBeInTheDocument()
  })
})
```

**Run**: `npm run test:unit`

### E2E Tests (Playwright)

**Location**: `tests/e2e/`

**Example**:
```typescript
// tests/e2e/navigation.spec.ts
import { test, expect } from '@playwright/test'

test('navigate to about page', async ({ page }) => {
  await page.goto('http://localhost:3000/en')
  await page.click('text=About')
  await expect(page).toHaveURL(/.*\/about/)
})
```

**Run**: `npm run test:e2e`

### Test Coverage

- **Unit Tests**: 117 tests (utilities, components)
- **E2E Tests**: 93 test executions (3 browsers × 31 scenarios)
- **Overall**: 210 test executions, all passing

**Reference**: [docs/TESTING.md](docs/TESTING.md)

---

## Deployment

### Vercel Deployment

**Status**: ✅ Live

#### Environment Variables

Required in Vercel dashboard:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Sanity
NEXT_PUBLIC_SANITY_PROJECT_ID=
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=

# Site
NEXT_PUBLIC_SITE_URL=https://kilalo.org
```

#### Deployment Flow

1. **Push to GitHub** → Vercel auto-deploys
2. **PR Created** → Preview deployment created
3. **Merge to main** → Production deployment

#### ISR Revalidation

Content updates trigger revalidation via Sanity webhook:
- **Webhook URL**: `https://kilalo.org/api/revalidate`
- **Trigger**: On document publish/unpublish

**Reference**: [docs/11-SETUP-DEPLOYMENT.md](docs/11-SETUP-DEPLOYMENT.md)

---

## Troubleshooting

### Common Issues

**Issue**: TypeScript errors after schema changes
**Solution**: Run `npx sanity@latest typegen generate`

**Issue**: Translations not showing
**Solution**: Check `messages/[locale].json` has the key, verify `useTranslations` namespace matches

**Issue**: Build fails with "Module not found"
**Solution**: Check import paths use `@/` alias, ensure file exists

**Issue**: Supabase auth not working
**Solution**: Verify middleware is running, check environment variables

**Issue**: Sanity Studio not loading
**Solution**: Check `NEXT_PUBLIC_SANITY_PROJECT_ID` is set

### Debug Mode

```typescript
// Enable verbose logging
console.log('Debug:', { user, locale, data })

// Check environment variables
console.log('ENV:', {
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
  sanityProject: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
})
```

---

## Additional Resources

### Documentation

- [Architecture Overview](docs/02-ARCHITECTURE.md)
- [Testing Guide](docs/TESTING.md)
- [Translation Workflow](docs/TRANSLATION_WORKFLOW.md)
- [Sanity Workflow](sanity/WORKFLOW.md)
- [Code Conventions](CLAUDE.md)

### External Documentation

- [Next.js 16 Docs](https://nextjs.org/docs)
- [Sanity.io Docs](https://www.sanity.io/docs)
- [Supabase Docs](https://supabase.com/docs)
- [next-intl Docs](https://next-intl-docs.vercel.app/)
- [shadcn/ui Docs](https://ui.shadcn.com/)

### Getting Help

1. Check [TODO.md](tasks/todo.md) for known issues
2. Review [Claude Skills](.claude/skills/) for patterns
3. Search existing issues on GitHub
4. Ask in team chat

---

**Document Version**: 1.0
**Maintained By**: Development Team
**Last Updated**: October 30, 2025

# Skills Implementation Guide

## Overview

This document outlines the implementations created for critical skills identified in the Kilalo project architecture review. All implementations follow best practices from official documentation (via Context7) and are optimized for the project's tech stack: Next.js 16 (App Router), Sanity CMS, next-intl, Supabase, and shadcn/ui.

---

## 1. Sanity CMS Integration

### Files Created

- [`sanity/lib/queries.ts`](sanity/lib/queries.ts) - Type-safe GROQ queries

### Key Features

#### Type-Safe Queries with `defineQuery`

All queries use Sanity's `defineQuery` for automatic TypeScript type generation:

```typescript
import { defineQuery } from 'next-sanity'

export const VENTURES_QUERY = defineQuery(`
  *[_type == "venture" && defined(slug.current)] | order(_createdAt desc) {
    _id, name, tagline, description, slug, logo, industry, stage
  }
`)
```

#### Usage in Server Components

```typescript
import { client } from '@/sanity/lib/client'
import { VENTURES_QUERY } from '@/sanity/lib/queries'

export default async function VenturesPage() {
  const ventures = await client.fetch(VENTURES_QUERY)
  // ventures is automatically typed based on GROQ projection

  return <VentureList ventures={ventures} />
}
```

#### Dynamic Queries with Parameters

```typescript
export const VENTURE_BY_SLUG_QUERY = defineQuery(`
  *[_type == "venture" && slug.current == $slug][0] { ... }
`)

// Usage:
const venture = await client.fetch(VENTURE_BY_SLUG_QUERY, { slug: 'my-venture' })
```

#### Internationalization Support

Works seamlessly with the existing `getLocalizedValue()` helper from `lib/i18n-helpers.ts`:

```typescript
import { getLocalizedValue } from '@/lib/i18n-helpers'
import { useLocale } from 'next-intl'

export default function VentureCard({ venture }) {
  const locale = useLocale()
  const name = getLocalizedValue(venture.name, locale)

  return <h2>{name}</h2>
}
```

#### TypeGen Integration

Run after schema or query changes:

```bash
npx sanity@latest typegen generate
```

### Available Query Sets

1. **Ventures** - Portfolio companies with filtering
2. **Case Studies** - Detailed venture success stories
3. **Programs** - V2S and other programs
4. **Events** - Upcoming/past Hekima Time sessions
5. **Blog Posts** - Content with author relations
6. **Impact Metrics** - Dashboard statistics
7. **Team Members** - Staff and advisors
8. **Site Settings** - Global configuration

### Best Practices

✅ Always use `defineQuery` for type safety
✅ Keep queries in centralized `queries.ts` file
✅ Use query parameters for dynamic values
✅ Generate static params with dedicated slug queries
✅ Leverage the existing i18n helper for field-level translations

---

## 2. next-intl Integration Patterns

### Files Created

- [`lib/navigation.ts`](lib/navigation.ts) - Locale-aware navigation APIs
- Enhanced [`i18n/request.ts`](i18n/request.ts) - Request configuration

### Key Features

#### Type-Safe Navigation

```typescript
import { Link, redirect, usePathname, useRouter } from '@/lib/navigation'

// Link automatically handles locale
<Link href="/ventures">View Ventures</Link>

// Programmatic navigation
const router = useRouter()
router.push('/about')

// Server-side redirects
redirect('/programs')
```

#### Server Components

```typescript
import { getTranslations } from 'next-intl/server'

export default async function HomePage() {
  const t = await getTranslations('HomePage')
  return <h1>{t('title')}</h1>
}
```

#### Client Components

```typescript
'use client'
import { useTranslations } from 'next-intl'

export default function ClientComponent() {
  const t = useTranslations('Component')
  return <p>{t('description')}</p>
}
```

#### Passing Translations to Client Components

```typescript
// Server Component
import { useTranslations } from 'next-intl'
import ExpandableClient from './ExpandableClient'

export default function FAQEntry() {
  const t = useTranslations('FAQ')

  return (
    <ExpandableClient title={t('title')}>
      {t('content')}
    </ExpandableClient>
  )
}
```

#### Static Rendering Setup

Already configured in your `i18n/request.ts` with `timeZone` and `now` for optimal static rendering.

### Translation Message Structure

```json
// messages/en.json
{
  "HomePage": {
    "title": "Empowering Congolese Entrepreneurs",
    "subtitle": "Scale your business with Vision & Structure"
  },
  "ContactForm": {
    "successMessage": "Thank you! We'll respond within 24 hours.",
    "errorMessage": "Something went wrong. Please try again."
  }
}
```

### Best Practices

✅ Use `getTranslations()` in Server Components (async)
✅ Use `useTranslations()` in Client Components
✅ Pass translated strings as props to Client Components
✅ Import navigation APIs from `@/lib/navigation`
✅ Keep messages organized by page/component namespace

---

## 3. Form Handling with Validation

### Files Created

- [`lib/forms/validation-schemas.ts`](lib/forms/validation-schemas.ts) - Zod schemas
- [`lib/forms/form-actions.ts`](lib/forms/form-actions.ts) - Server actions

### Key Features

#### Available Form Schemas

1. **Contact Form** - General inquiries
2. **Newsletter Signup** - Email collection
3. **Business Assessment** - Free assessment requests
4. **Partner Interest** - Partnership inquiries
5. **Mentor Application** - Mentor onboarding
6. **Event Registration** - Event RSVPs

#### Client-Side Form Example

```typescript
'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { contactFormSchema, type ContactFormData } from '@/lib/forms/validation-schemas'
import { submitContactForm } from '@/lib/forms/form-actions'

export default function ContactForm() {
  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: '',
      email: '',
      message: '',
      consent: false,
    },
  })

  async function onSubmit(data: ContactFormData) {
    const result = await submitContactForm(data)

    if (result.success) {
      toast.success(result.message)
      form.reset()
    } else {
      toast.error(result.error)
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      {/* Use shadcn/ui Form components here */}
    </form>
  )
}
```

#### shadcn/ui Integration

```typescript
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'

<Form {...form}>
  <form onSubmit={form.handleSubmit(onSubmit)}>
    <FormField
      control={form.control}
      name="email"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Email</FormLabel>
          <FormControl>
            <Input placeholder="you@example.com" {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
    <Button type="submit">Submit</Button>
  </form>
</Form>
```

#### Server Action Pattern

All form actions follow this pattern:

1. Validate with Zod schema
2. Process data (email, database, CRM)
3. Return typed response

```typescript
export async function submitContactForm(
  formData: ContactFormData
): Promise<FormResponse<ContactFormData>> {
  const t = await getTranslations('ContactForm')

  try {
    const validatedData = contactFormSchema.parse(formData)

    // TODO: Integrate with email service
    // await sendEmail({ ... })

    return {
      success: true,
      data: validatedData,
      message: t('successMessage'),
    }
  } catch (error) {
    return {
      success: false,
      error: t('errorMessage'),
    }
  }
}
```

### Integration Checklist

To fully implement forms, you'll need to:

- [ ] Add form translations to `messages/en.json` and `messages/fr.json`
- [ ] Install email service (Resend recommended for Next.js)
- [ ] Set up newsletter service (Mailchimp, ConvertKit, or Resend)
- [ ] Configure CRM for lead tracking (optional)
- [ ] Add toast notifications (sonner recommended)

### Best Practices

✅ Always validate on both client and server
✅ Use TypeScript inference from Zod schemas
✅ Localize error messages via next-intl
✅ Return structured responses from Server Actions
✅ Handle loading states with `useFormStatus`

---

## 4. Supabase Integration Patterns

### Files Created

- [`lib/supabase/auth-helpers.ts`](lib/supabase/auth-helpers.ts) - Authentication utilities

### Key Features

#### Get Current User (Server Components)

```typescript
import { getUser, getSession } from '@/lib/supabase/auth-helpers'

export default async function Dashboard() {
  const user = await getUser()

  if (!user) {
    return <div>Please sign in</div>
  }

  return <div>Welcome, {user.email}</div>
}
```

#### Require Authentication

```typescript
import { requireAuth } from '@/lib/supabase/auth-helpers'

export default async function ProtectedPage() {
  const user = await requireAuth() // Throws if not authenticated

  return <div>Secret content for {user.email}</div>
}
```

#### Role-Based Access Control

```typescript
import { requireRole, hasRole } from '@/lib/supabase/auth-helpers'

// Check role
const isAdmin = await hasRole('admin')

// Require role (throws if missing)
const user = await requireRole('admin')
```

Assumes roles are stored in user metadata:

```typescript
{
  user_metadata: {
    roles: ['admin', 'mentor']
  }
}
```

#### User Profile Management

```typescript
import { getUserProfile, updateUserProfile } from '@/lib/supabase/auth-helpers'

// Get profile
const profile = await getUserProfile<UserProfile>()

// Update profile (Server Action)
async function updateProfile(updates: Partial<UserProfile>) {
  'use server'
  return await updateUserProfile(updates)
}
```

Assumes you have a `profiles` table:

```sql
create table profiles (
  id uuid references auth.users primary key,
  full_name text,
  avatar_url text,
  created_at timestamptz default now()
);
```

#### Sign Out

```typescript
import { signOut } from '@/lib/supabase/auth-helpers'

async function handleSignOut() {
  'use server'
  await signOut()
  redirect('/login')
}
```

### Middleware (Already Configured)

Your `middleware.ts` should already handle session refresh. If not, ensure it includes:

```typescript
import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'

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

  // Refresh session
  await supabase.auth.getUser()

  return response
}
```

### Best Practices

✅ Always use `createServerClient` in Server Components
✅ Use `createBrowserClient` in Client Components
✅ Implement middleware for automatic session refresh
✅ Cache user data with React `cache()` wrapper
✅ Store roles in user metadata for simple RBAC

---

## 5. SEO and Metadata Utilities

### Files Created

- [`lib/seo/metadata.ts`](lib/seo/metadata.ts) - Metadata generation and structured data

### Key Features

#### Generate Page Metadata

```typescript
import { generatePageMetadata } from '@/lib/seo/metadata'

export async function generateMetadata(): Promise<Metadata> {
  return generatePageMetadata({
    title: 'About Us',
    description: 'Learn about Kilalo and our mission in the DRC',
    path: '/about',
    image: '/images/about-og.png',
  })
}
```

#### Dynamic Metadata (Blog Posts)

```typescript
import { generatePageMetadata } from '@/lib/seo/metadata'
import { client } from '@/sanity/lib/client'
import { POST_BY_SLUG_QUERY } from '@/sanity/lib/queries'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const post = await client.fetch(POST_BY_SLUG_QUERY, { slug })

  return generatePageMetadata({
    title: post.title,
    description: post.excerpt,
    type: 'article',
    publishedTime: post.publishedAt,
    author: post.author?.name,
    tags: post.tags,
    image: post.coverImage,
    path: `/blog/${slug}`,
  })
}
```

#### Structured Data (JSON-LD)

```typescript
import {
  generateOrganizationSchema,
  generateArticleSchema,
  generateEventSchema,
  generateBreadcrumbSchema,
} from '@/lib/seo/metadata'

export default function BlogPost({ post }) {
  const articleSchema = generateArticleSchema({
    title: post.title,
    description: post.excerpt,
    publishedTime: post.publishedAt,
    author: post.author?.name,
    url: `https://kilalo.org/blog/${post.slug}`,
  })

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <article>{/* ... */}</article>
    </>
  )
}
```

#### Organization Schema (Root Layout)

```typescript
import { generateOrganizationSchema } from '@/lib/seo/metadata'

export default function RootLayout({ children }) {
  const orgSchema = generateOrganizationSchema()

  return (
    <html>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
        />
        {children}
      </body>
    </html>
  )
}
```

#### Breadcrumbs

```typescript
const breadcrumbSchema = generateBreadcrumbSchema([
  { name: 'Home', url: '/' },
  { name: 'Programs', url: '/programs' },
  { name: 'V2S Program', url: '/programs/v2s' },
])
```

### Configuration

Update `lib/seo/metadata.ts` with your actual values:

```typescript
export const siteConfig = {
  name: 'Kilalo',
  description: 'Your actual description',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://kilalo.org',
  ogImage: '/og-image.png',
  twitterHandle: '@kilalo_org',
  locale: 'en',
  locales: ['en', 'fr'],
}
```

### Best Practices

✅ Generate metadata in `generateMetadata()` functions
✅ Use structured data for better search visibility
✅ Include breadcrumbs for hierarchical pages
✅ Add Open Graph images for social sharing
✅ Implement multilingual alternate links

---

## 6. Implementation Roadmap

### Immediate Next Steps

1. **Run TypeGen for Sanity**

   ```bash
   npx sanity@latest typegen generate
   ```

2. **Add Form Translations**
   Update `messages/en.json` and `messages/fr.json`:

   ```json
   {
     "ContactForm": {
       "successMessage": "Thank you for your message!",
       "errorMessage": "Failed to send message. Please try again."
     }
   }
   ```

3. **Set Up Email Service**
   - Install Resend: `npm install resend`
   - Add `RESEND_API_KEY` to `.env.local`
   - Implement email sending in form actions

4. **Configure Site Metadata**
   - Update `siteConfig` in `lib/seo/metadata.ts`
   - Add Open Graph images to `/public`
   - Add `NEXT_PUBLIC_SITE_URL` to `.env.local`

5. **Implement First Form**
   - Start with Contact Form or Newsletter Signup
   - Use existing schemas and actions
   - Add toast notifications with `sonner`

### Optional Enhancements

- [ ] Set up Supabase profiles table
- [ ] Implement role-based access control
- [ ] Add newsletter service integration
- [ ] Configure CRM for lead tracking
- [ ] Add analytics (Plausible or Google Analytics)
- [ ] Implement Calendly for business assessments

---

## 7. Usage Examples

### Complete Page Example

```typescript
// app/[locale]/(marketing)/ventures/page.tsx
import { generatePageMetadata } from '@/lib/seo/metadata'
import { client } from '@/sanity/lib/client'
import { VENTURES_QUERY } from '@/sanity/lib/queries'
import { getLocalizedValue } from '@/lib/i18n-helpers'
import { useTranslations } from 'next-intl'

export async function generateMetadata({ params }) {
  const { locale } = await params
  return generatePageMetadata({
    title: 'Our Ventures',
    description: 'Portfolio of Congolese entrepreneurs we support',
    path: '/ventures',
    locale,
  })
}

export default async function VenturesPage({ params }) {
  const { locale } = await params
  const ventures = await client.fetch(VENTURES_QUERY)
  const t = await getTranslations('VenturesPage')

  return (
    <section>
      <h1>{t('title')}</h1>
      {ventures.map((venture) => (
        <article key={venture._id}>
          <h2>{getLocalizedValue(venture.name, locale)}</h2>
          <p>{getLocalizedValue(venture.tagline, locale)}</p>
        </article>
      ))}
    </section>
  )
}
```

### Complete Form Component Example

```typescript
// components/forms/NewsletterForm.tsx
'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useTranslations } from 'next-intl'
import { newsletterSignupSchema, type NewsletterSignupData } from '@/lib/forms/validation-schemas'
import { submitNewsletterSignup } from '@/lib/forms/form-actions'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'

export default function NewsletterForm() {
  const t = useTranslations('Newsletter')

  const form = useForm<NewsletterSignupData>({
    resolver: zodResolver(newsletterSignupSchema),
    defaultValues: {
      email: '',
      consent: false,
    },
  })

  async function onSubmit(data: NewsletterSignupData) {
    const result = await submitNewsletterSignup(data)

    if (result.success) {
      toast.success(result.message)
      form.reset()
    } else {
      toast.error(result.error)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input placeholder={t('emailPlaceholder')} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? t('submitting') : t('subscribe')}
        </Button>
      </form>
    </Form>
  )
}
```

---

## 8. Testing Checklist

Before deploying, verify:

- [ ] TypeGen runs without errors
- [ ] All GROQ queries return expected data
- [ ] Forms validate correctly (client + server)
- [ ] Form submissions trigger correct actions
- [ ] Translations work in both EN and FR
- [ ] Navigation preserves locale
- [ ] Metadata appears correctly in page source
- [ ] Structured data validates (Google Rich Results Test)
- [ ] Open Graph images display in social previews
- [ ] Supabase auth flows work correctly

---

## 9. Additional Resources

### Documentation References

- [Next.js 16 Docs](https://nextjs.org/docs)
- [Sanity next-sanity](https://github.com/sanity-io/next-sanity)
- [next-intl](https://next-intl-docs.vercel.app/)
- [React Hook Form](https://react-hook-form.com/)
- [Zod](https://zod.dev/)
- [Supabase SSR](https://supabase.com/docs/guides/auth/server-side)
- [shadcn/ui](https://ui.shadcn.com/)

### Project-Specific Docs

- [INTERNATIONALIZATION.md](INTERNATIONALIZATION.md) - i18n setup details
- [IMPLEMENTATION_ROADMAP.md](IMPLEMENTATION_ROADMAP.md) - Feature roadmap
- [CLAUDE.md](CLAUDE.md) - Development conventions

---

**Note**: All code in this implementation follows the conventions in [CLAUDE.md](CLAUDE.md) and prioritizes simplicity, type safety, and adherence to official best practices.

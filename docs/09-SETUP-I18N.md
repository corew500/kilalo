# next-intl Internationalization Setup Guide

This guide covers setting up next-intl for French/English bilingual support on the Kilalo marketing website with Next.js 15 App Router.

## Table of Contents

1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [Installation](#installation)
4. [Routing Configuration](#routing-configuration)
5. [Middleware Setup](#middleware-setup)
6. [App Router Integration](#app-router-integration)
7. [Message Files](#message-files)
8. [Server Components](#server-components)
9. [Client Components](#client-components)
10. [Language Switcher](#language-switcher)
11. [Localized Pathnames](#localized-pathnames)
12. [TypeScript Integration](#typescript-integration)
13. [Sanity CMS Integration](#sanity-cms-integration)
14. [SEO and Metadata](#seo-and-metadata)
15. [Best Practices](#best-practices)
16. [Troubleshooting](#troubleshooting)
17. [Next Steps](#next-steps)

## Overview

**next-intl** is a comprehensive internationalization library for Next.js that provides type-safe translations, localized routing, and seamless App Router integration.

### Why next-intl for Kilalo?

- **Type Safety**: Full TypeScript support with autocomplete
- **App Router Native**: Built specifically for Next.js 15 App Router
- **ICU Message Format**: Powerful message formatting with pluralization
- **Localized Routing**: Automatic locale-based URL handling
- **Performance**: Server-side translations with zero client-side overhead
- **Small Bundle**: Only ~2.5KB gzipped
- **SEO Friendly**: Automatic hreflang tags and localized metadata

## Prerequisites

- Next.js 15 project initialized (see [03-SETUP-NEXTJS.md](./03-SETUP-NEXTJS.md))
- TypeScript strict mode configured (see [05-SETUP-TYPESCRIPT-ESLINT.md](./05-SETUP-TYPESCRIPT-ESLINT.md))
- Node.js 18+ installed

## Installation

```bash
npm install next-intl
```

## Routing Configuration

### Step 1: Create Routing Configuration

Create `src/i18n/routing.ts`:

```typescript
import { defineRouting } from 'next-intl/routing'

export const routing = defineRouting({
  // All supported locales
  locales: ['en', 'fr'],

  // Default locale
  defaultLocale: 'en',

  // Localized pathnames (optional)
  pathnames: {
    '/': '/',
    '/about': {
      en: '/about',
      fr: '/a-propos',
    },
    '/services': {
      en: '/services',
      fr: '/services',
    },
    '/blog': {
      en: '/blog',
      fr: '/blogue',
    },
    '/blog/[slug]': {
      en: '/blog/[slug]',
      fr: '/blogue/[slug]',
    },
    '/contact': {
      en: '/contact',
      fr: '/contact',
    },
  },
})

// Export types for use in components
export type Locale = (typeof routing.locales)[number]
```

### Step 2: Create Request Configuration

Create `src/i18n/request.ts`:

```typescript
import { getRequestConfig } from 'next-intl/server'
import { routing } from './routing'

export default getRequestConfig(async ({ requestLocale }) => {
  // This typically corresponds to the `[locale]` segment
  let locale = await requestLocale

  // Ensure that a valid locale is used
  if (!locale || !routing.locales.includes(locale as any)) {
    locale = routing.defaultLocale
  }

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default,
    timeZone: 'America/Toronto', // Adjust for your timezone
    now: new Date(),
  }
})
```

## Middleware Setup

### Create Middleware

Create `src/middleware.ts`:

```typescript
import createMiddleware from 'next-intl/middleware'
import { routing } from './i18n/routing'

export default createMiddleware(routing)

export const config = {
  // Match all pathnames except for
  // - API routes
  // - _next (Next.js internals)
  // - _vercel (Vercel internals)
  // - Files with extensions (e.g. favicon.ico)
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
}
```

This middleware:
1. Detects the user's locale from `Accept-Language` header or URL
2. Redirects to localized URLs (e.g., `/` → `/en`)
3. Handles locale switching
4. Rewrites localized pathnames to internal paths

## App Router Integration

### Step 1: Update next.config.ts

```typescript
import type { NextConfig } from 'next'
import createNextIntlPlugin from 'next-intl/plugin'

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts')

const nextConfig: NextConfig = {
  // Your existing config
}

export default withNextIntl(nextConfig)
```

### Step 2: Create Locale Layout

Create `src/app/[locale]/layout.tsx`:

```typescript
import { NextIntlClientProvider, hasLocale } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { routing } from '@/i18n/routing'

type Props = {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params

  // Ensure that the incoming `locale` is valid
  if (!hasLocale(routing.locales, locale)) {
    notFound()
  }

  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages()

  return (
    <html lang={locale}>
      <body>
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
```

### Step 3: Move Root Layout

Your root `layout.tsx` should now be at `src/app/[locale]/layout.tsx`. All routes must be inside the `[locale]` folder:

```
src/app/
  [locale]/
    layout.tsx          ← Root layout with NextIntlClientProvider
    page.tsx            ← Home page
    about/
      page.tsx          ← About page
    blog/
      page.tsx          ← Blog listing
      [slug]/
        page.tsx        ← Blog post
```

### Step 4: Create 404 Page

Create `src/app/[locale]/not-found.tsx`:

```typescript
import { useTranslations } from 'next-intl'

export default function NotFoundPage() {
  const t = useTranslations('NotFound')

  return (
    <div>
      <h1>{t('title')}</h1>
      <p>{t('description')}</p>
    </div>
  )
}
```

## Message Files

### Create Message Structure

Create `messages/en.json`:

```json
{
  "HomePage": {
    "title": "Welcome to Kilalo",
    "description": "Your trusted partner for {service}",
    "cta": "Get Started"
  },
  "Navigation": {
    "home": "Home",
    "about": "About",
    "services": "Services",
    "blog": "Blog",
    "contact": "Contact"
  },
  "NotFound": {
    "title": "Page Not Found",
    "description": "The page you're looking for doesn't exist."
  },
  "Common": {
    "readMore": "Read more",
    "learnMore": "Learn more",
    "contactUs": "Contact us"
  }
}
```

Create `messages/fr.json`:

```json
{
  "HomePage": {
    "title": "Bienvenue chez Kilalo",
    "description": "Votre partenaire de confiance pour {service}",
    "cta": "Commencer"
  },
  "Navigation": {
    "home": "Accueil",
    "about": "À propos",
    "services": "Services",
    "blog": "Blogue",
    "contact": "Contact"
  },
  "NotFound": {
    "title": "Page introuvable",
    "description": "La page que vous recherchez n'existe pas."
  },
  "Common": {
    "readMore": "Lire la suite",
    "learnMore": "En savoir plus",
    "contactUs": "Nous contacter"
  }
}
```

## Server Components

### Using getTranslations (Async)

```typescript
// src/app/[locale]/page.tsx
import { getTranslations } from 'next-intl/server'

export default async function HomePage() {
  const t = await getTranslations('HomePage')

  return (
    <div>
      <h1>{t('title')}</h1>
      <p>{t('description', { service: 'business solutions' })}</p>
      <button>{t('cta')}</button>
    </div>
  )
}
```

### Scoped Translations

```typescript
const t = await getTranslations('HomePage')
// Access: t('title'), t('description'), etc.

const tNav = await getTranslations('Navigation')
// Access: tNav('home'), tNav('about'), etc.
```

### With Rich Text

```typescript
const t = await getTranslations('HomePage')

return (
  <p>
    {t.rich('description', {
      service: 'business solutions',
      strong: (chunks) => <strong>{chunks}</strong>,
    })}
  </p>
)
```

## Client Components

### Using useTranslations Hook

```typescript
'use client'

import { useTranslations } from 'next-intl'

export function ClientComponent() {
  const t = useTranslations('Common')

  return <button>{t('readMore')}</button>
}
```

### Using useLocale Hook

```typescript
'use client'

import { useLocale } from 'next-intl'

export function LocaleDisplay() {
  const locale = useLocale()

  return <div>Current locale: {locale}</div>
}
```

### Formatting Dates

```typescript
'use client'

import { useFormatter } from 'next-intl'

export function DateDisplay({ date }: { date: Date }) {
  const format = useFormatter()

  return (
    <time dateTime={date.toISOString()}>
      {format.dateTime(date, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })}
    </time>
  )
}
```

### Formatting Numbers

```typescript
'use client'

import { useFormatter } from 'next-intl'

export function PriceDisplay({ amount }: { amount: number }) {
  const format = useFormatter()

  return <span>{format.number(amount, { style: 'currency', currency: 'CAD' })}</span>
}
```

## Language Switcher

### Create Language Switcher Component

Create `src/components/language-switcher.tsx`:

```typescript
'use client'

import { useLocale } from 'next-intl'
import { usePathname, useRouter } from 'next/navigation'
import { routing } from '@/i18n/routing'

export function LanguageSwitcher() {
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()

  const switchLocale = (newLocale: string) => {
    // Remove current locale from pathname
    const segments = pathname.split('/')
    segments[1] = newLocale

    router.push(segments.join('/'))
  }

  return (
    <div className="flex gap-2">
      {routing.locales.map((loc) => (
        <button
          key={loc}
          onClick={() => switchLocale(loc)}
          className={loc === locale ? 'font-bold' : ''}
          aria-current={loc === locale ? 'true' : undefined}
        >
          {loc.toUpperCase()}
        </button>
      ))}
    </div>
  )
}
```

### Using Link Component

Create `src/components/locale-link.tsx`:

```typescript
'use client'

import { useLocale } from 'next-intl'
import Link from 'next/link'
import type { ComponentProps } from 'react'

type Props = Omit<ComponentProps<typeof Link>, 'href'> & {
  href: string
}

export function LocaleLink({ href, ...props }: Props) {
  const locale = useLocale()

  return <Link href={`/${locale}${href}`} {...props} />
}
```

## Localized Pathnames

### Navigation with Localized Paths

Create `src/components/navigation.tsx`:

```typescript
import { useTranslations } from 'next-intl'
import { LocaleLink } from './locale-link'

export function Navigation() {
  const t = useTranslations('Navigation')

  return (
    <nav>
      <ul>
        <li>
          <LocaleLink href="/">{t('home')}</LocaleLink>
        </li>
        <li>
          <LocaleLink href="/about">{t('about')}</LocaleLink>
        </li>
        <li>
          <LocaleLink href="/services">{t('services')}</LocaleLink>
        </li>
        <li>
          <LocaleLink href="/blog">{t('blog')}</LocaleLink>
        </li>
        <li>
          <LocaleLink href="/contact">{t('contact')}</LocaleLink>
        </li>
      </ul>
    </nav>
  )
}
```

## TypeScript Integration

### Create Type-Safe Translation Keys

Create `src/i18n/types.ts`:

```typescript
import type en from '../../messages/en.json'

type Messages = typeof en

declare global {
  // Use type safe message keys with `next-intl`
  interface IntlMessages extends Messages {}
}
```

Now you get autocomplete for translation keys:

```typescript
const t = useTranslations('HomePage')
t('title') // ✅ Autocomplete works!
t('invalid') // ❌ TypeScript error
```

### Strongly Typed Locale

```typescript
import type { Locale } from '@/i18n/routing'

function getLocalizedContent(locale: Locale) {
  // locale is typed as 'en' | 'fr'
}
```

## Sanity CMS Integration

### Fetch Localized Content from Sanity

```typescript
import { client } from '@/sanity/lib/client'
import { getLocale } from 'next-intl/server'

export default async function BlogPage() {
  const locale = await getLocale()

  const posts = await client.fetch(
    `*[_type == "post"] {
      "title": title.${locale},
      "excerpt": excerpt.${locale},
      slug
    }`
  )

  return (
    <div>
      {posts.map((post) => (
        <article key={post.slug.current}>
          <h2>{post.title}</h2>
          <p>{post.excerpt}</p>
        </article>
      ))}
    </div>
  )
}
```

### Localized Sanity Schema

See [08-SETUP-SANITY.md](./08-SETUP-SANITY.md) for field-level localization:

```typescript
defineField({
  name: 'title',
  type: 'object',
  fields: [
    { name: 'en', type: 'string', title: 'English' },
    { name: 'fr', type: 'string', title: 'French' },
  ],
})
```

## SEO and Metadata

### Localized Metadata

```typescript
// src/app/[locale]/layout.tsx
import { getTranslations } from 'next-intl/server'
import type { Metadata } from 'next'

type Props = {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'Metadata' })

  return {
    title: t('title'),
    description: t('description'),
  }
}
```

Add to `messages/en.json`:

```json
{
  "Metadata": {
    "title": "Kilalo - Business Solutions",
    "description": "Your trusted partner for innovative business solutions"
  }
}
```

And `messages/fr.json`:

```json
{
  "Metadata": {
    "title": "Kilalo - Solutions d'affaires",
    "description": "Votre partenaire de confiance pour des solutions d'affaires innovantes"
  }
}
```

### Hreflang Tags

Create `src/components/hreflang.tsx`:

```typescript
import { routing } from '@/i18n/routing'

export function HreflangTags({ pathname }: { pathname: string }) {
  return (
    <>
      {routing.locales.map((locale) => (
        <link
          key={locale}
          rel="alternate"
          hrefLang={locale}
          href={`https://kilalo.com/${locale}${pathname}`}
        />
      ))}
      <link
        rel="alternate"
        hrefLang="x-default"
        href={`https://kilalo.com/en${pathname}`}
      />
    </>
  )
}
```

Use in layout:

```typescript
export default function Layout() {
  return (
    <html>
      <head>
        <HreflangTags pathname="/about" />
      </head>
      <body>...</body>
    </html>
  )
}
```

## Best Practices

### 1. Namespace Your Messages

```json
{
  "HomePage": {...},
  "AboutPage": {...},
  "Navigation": {...},
  "Common": {...},
  "Errors": {...}
}
```

### 2. Use ICU Message Format

```json
{
  "greeting": "Hello {name}!",
  "items": "{count, plural, =0 {No items} one {One item} other {# items}}"
}
```

Usage:

```typescript
t('greeting', { name: 'John' })
t('items', { count: 0 }) // "No items"
t('items', { count: 1 }) // "One item"
t('items', { count: 5 }) // "5 items"
```

### 3. Handle Missing Translations

```typescript
// src/i18n/request.ts
export default getRequestConfig(async ({ requestLocale }) => {
  // ...
  return {
    locale,
    messages,
    onError: (error) => {
      if (error.code === 'MISSING_MESSAGE') {
        console.warn('Missing translation:', error.message)
      }
    },
    getMessageFallback: ({ namespace, key }) => {
      return `${namespace}.${key}`
    },
  }
})
```

### 4. Split Message Files

For large applications:

```typescript
// src/i18n/request.ts
const messages = {
  ...(await import(`../../messages/${locale}/common.json`)).default,
  ...(await import(`../../messages/${locale}/navigation.json`)).default,
  ...(await import(`../../messages/${locale}/pages.json`)).default,
}
```

### 5. Use Server Components When Possible

Server components are faster and reduce bundle size:

```typescript
// ✅ Server component - no client bundle
import { getTranslations } from 'next-intl/server'

// ❌ Client component - adds to bundle
'use client'
import { useTranslations } from 'next-intl'
```

## Troubleshooting

### Issue: Middleware Not Working

**Problem**: Routes don't redirect to locale.

**Solution**:
1. Check `matcher` in `middleware.ts` includes your routes
2. Ensure `createMiddleware` is the default export
3. Clear `.next` folder and restart

### Issue: Messages Not Loading

**Problem**: Translations show as keys.

**Solution**:
1. Verify message files exist in `messages/en.json` and `messages/fr.json`
2. Check import path in `src/i18n/request.ts`
3. Ensure `NextIntlClientProvider` wraps children in layout

### Issue: Type Errors with useTranslations

**Problem**: TypeScript doesn't recognize translation keys.

**Solution**:
1. Create `src/i18n/types.ts` with `IntlMessages` interface
2. Ensure it extends your message type
3. Restart TypeScript server in VSCode

### Issue: Locale Not Detected

**Problem**: Always defaults to English.

**Solution**:
1. Check `Accept-Language` header is sent
2. Verify middleware matcher includes route
3. Test with explicit locale in URL: `/fr`

## Next Steps

After setting up i18n:

1. **Add all translation keys** for your pages
2. **Test language switching** thoroughly
3. **Configure Sanity localization**: See [08-SETUP-SANITY.md](./08-SETUP-SANITY.md)
4. **Set up hreflang tags** for SEO
5. **Deploy to Vercel**: See [11-SETUP-DEPLOYMENT.md](./11-SETUP-DEPLOYMENT.md)

## Resources

- [next-intl Documentation](https://next-intl-docs.vercel.app/)
- [ICU Message Format](https://formatjs.io/docs/core-concepts/icu-syntax/)
- [Next.js i18n Routing](https://nextjs.org/docs/app/building-your-application/routing/internationalization)
- [CLDR Plurals](https://www.unicode.org/cldr/charts/latest/supplemental/language_plural_rules.html)

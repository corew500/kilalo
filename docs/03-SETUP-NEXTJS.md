# Next.js 15 Setup Guide - Best Practices

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Project Initialization](#project-initialization)
3. [TypeScript Configuration](#typescript-configuration)
4. [Project Structure Setup](#project-structure-setup)
5. [Core Configuration Files](#core-configuration-files)
6. [Best Practices](#best-practices)
7. [Common Patterns](#common-patterns)
8. [Troubleshooting](#troubleshooting)

---

## Prerequisites

### Required Software

```bash
# Node.js 20 LTS or later
node --version  # Should be v20.x.x or higher

# npm, yarn, pnpm, or bun
npm --version   # v10.x.x or higher recommended
```

**Installation**:
- **Node.js**: Download from [nodejs.org](https://nodejs.org/) or use [nvm](https://github.com/nvm-sh/nvm)
- **Package Manager**: npm comes with Node.js, or install your preferred alternative

---

## Project Initialization

### Step 1: Create Next.js Project

```bash
# Navigate to project directory
cd /path/to/kilalo

# Create Next.js app with recommended options
npx create-next-app@latest . \
  --typescript \
  --eslint \
  --app \
  --no-src-dir \
  --import-alias "@/*" \
  --tailwind \
  --turbopack

# Explanation of flags:
# --typescript:     Enable TypeScript
# --eslint:         Enable ESLint
# --app:            Use App Router (not Pages Router)
# --no-src-dir:     Don't use src/ directory (cleaner for App Router)
# --import-alias:   Use @ for absolute imports
# --tailwind:       Include Tailwind CSS
# --turbopack:      Use Turbopack for faster dev builds
```

**Interactive Prompts** (if you run without flags):
```
✔ Would you like to use TypeScript? … Yes
✔ Would you like to use ESLint? … Yes
✔ Would you like to use Tailwind CSS? … Yes
✔ Would you like your code inside a `src/` directory? … No
✔ Would you like to use App Router? (recommended) … Yes
✔ Would you like to use Turbopack for `next dev`? … Yes
✔ Would you like to customize the import alias (@/* by default)? … No
```

### Step 2: Verify Installation

```bash
# Check generated files
ls -la

# Expected output:
# app/               # App Router directory
# public/            # Static assets
# node_modules/      # Dependencies
# package.json       # Project manifest
# tsconfig.json      # TypeScript config
# next.config.ts     # Next.js config
# tailwind.config.ts # Tailwind config
# postcss.config.mjs # PostCSS config
# .eslintrc.json     # ESLint config
# .gitignore         # Git ignore rules
# README.md          # Project docs
```

### Step 3: Install Additional Dependencies

```bash
# Core dependencies for our stack
npm install \
  @supabase/ssr \
  @supabase/supabase-js \
  next-sanity \
  @sanity/image-url \
  next-intl \
  zod \
  date-fns \
  clsx \
  tailwind-merge

# Development dependencies
npm install -D \
  @types/node \
  @playwright/test \
  vitest \
  @vitejs/plugin-react \
  @testing-library/react \
  @testing-library/jest-dom \
  @axe-core/react \
  eslint-plugin-jsx-a11y \
  prettier \
  prettier-plugin-tailwindcss
```

**Dependency Explanations**:

| Package | Purpose |
|---------|---------|
| `@supabase/ssr` | Supabase client for Server Components |
| `next-sanity` | Sanity.io integration for Next.js |
| `next-intl` | Internationalization (i18n) |
| `zod` | Runtime type validation (forms, API) |
| `clsx` + `tailwind-merge` | Utility for merging Tailwind classes |
| `@playwright/test` | E2E testing framework |
| `vitest` | Unit testing framework |
| `eslint-plugin-jsx-a11y` | Accessibility linting |
| `prettier` | Code formatting |

---

## TypeScript Configuration

### Step 1: Strict TypeScript Configuration

Edit `tsconfig.json` with the strictest possible settings:

```json
{
  "compilerOptions": {
    /* Language and Environment */
    "target": "ES2022",
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "jsx": "preserve",

    /* Modules */
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,

    /* JavaScript Support */
    "allowJs": true,
    "checkJs": false,

    /* Emit */
    "noEmit": true,
    "incremental": true",
    "tsBuildInfoFile": "./.next/tsbuildinfo.json",

    /* Interop Constraints */
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "forceConsistentCasingInFileNames": true,
    "isolatedModules": true,

    /* Type Checking - STRICT MODE */
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitOverride": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "noImplicitReturns": true,
    "noPropertyAccessFromIndexSignature": true,
    "allowUnusedLabels": false,
    "allowUnreachableCode": false,
    "exactOptionalPropertyTypes": true,

    /* Path Mapping */
    "baseUrl": ".",
    "paths": {
      "@/*": ["./*"]
    },

    /* Next.js specific */
    "plugins": [
      {
        "name": "next"
      }
    ]
  },
  "include": [
    "next-env.d.ts",
    "**/*.ts",
    "**/*.tsx",
    ".next/types/**/*.ts"
  ],
  "exclude": [
    "node_modules"
  ]
}
```

**Key Strict Options Explained**:

| Option | Purpose | Impact |
|--------|---------|--------|
| `strict: true` | Enables all strict type-checking options | Catches most type errors |
| `noUncheckedIndexedAccess` | Makes array/object access potentially undefined | Prevents `array[0]` assumptions |
| `noImplicitOverride` | Requires `override` keyword | Prevents accidental overrides |
| `noUnusedLocals` | Errors on unused variables | Keeps code clean |
| `noUnusedParameters` | Errors on unused parameters | Keeps functions clean |
| `noFallthroughCasesInSwitch` | Requires `break` in switch cases | Prevents bugs |
| `noImplicitReturns` | All code paths must return | Prevents undefined returns |
| `exactOptionalPropertyTypes` | `prop?: string` cannot be `undefined` explicitly | More precise types |

### Step 2: Create Type Definition Files

Create `types/index.ts`:

```typescript
// types/index.ts

/**
 * Shared TypeScript types for the application
 */

/** Navigation link */
export interface NavLink {
  href: string;
  label: string;
  external?: boolean;
}

/** Page metadata */
export interface PageMetadata {
  title: string;
  description: string;
  image?: string;
  noIndex?: boolean;
}

/** API response wrapper */
export interface ApiResponse<T = unknown> {
  data?: T;
  error?: {
    message: string;
    code?: string;
  };
}

/** Pagination params */
export interface PaginationParams {
  page: number;
  limit: number;
}

/** Pagination result */
export interface PaginatedResult<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
```

---

## Project Structure Setup

### Step 1: Create Directory Structure

```bash
# Create all required directories
mkdir -p app/{api,\[locale\]/{(marketing),(auth),(member)}} \
         components/{ui,marketing,member,auth,shared} \
         lib/{supabase,sanity,validations} \
         hooks \
         messages \
         sanity/{schemas/{documents,objects}} \
         tests/{e2e,unit,fixtures} \
         types \
         public/{images,icons}
```

### Step 2: Verify Structure

```bash
tree -L 3 -I 'node_modules'

# Expected output:
# .
# ├── app/
# │   ├── api/
# │   └── [locale]/
# │       ├── (marketing)/
# │       ├── (auth)/
# │       └── (member)/
# ├── components/
# │   ├── ui/
# │   ├── marketing/
# │   ├── member/
# │   ├── auth/
# │   └── shared/
# ├── lib/
# │   ├── supabase/
# │   ├── sanity/
# │   └── validations/
# ├── hooks/
# ├── messages/
# ├── sanity/
# │   └── schemas/
# │       ├── documents/
# │       └── objects/
# ├── tests/
# │   ├── e2e/
# │   ├── unit/
# │   └── fixtures/
# ├── types/
# └── public/
#     ├── images/
#     └── icons/
```

---

## Core Configuration Files

### 1. next.config.ts

```typescript
// next.config.ts

import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./lib/i18n/request.ts');

const nextConfig: NextConfig = {
  /* Experimental Features */
  experimental: {
    typedRoutes: true, // Type-safe routing
    serverActions: {
      bodySizeLimit: '2mb', // Increase if needed
    },
  },

  /* Image Optimization */
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
        pathname: '/images/**',
      },
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        pathname: '/storage/**',
      },
    ],
  },

  /* Headers for Security & Performance */
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
    ];
  },

  /* Redirects */
  async redirects() {
    return [
      {
        source: '/',
        destination: '/en',
        permanent: false,
      },
    ];
  },
};

export default withNextIntl(nextConfig);
```

### 2. middleware.ts

```typescript
// middleware.ts

import createMiddleware from 'next-intl/middleware';
import { createServerClient } from '@supabase/ssr';
import { NextRequest, NextResponse } from 'next/server';

// Internationalization middleware
const intlMiddleware = createMiddleware({
  locales: ['en', 'fr'],
  defaultLocale: 'en',
  localePrefix: 'always',
});

export async function middleware(request: NextRequest) {
  // First, handle i18n
  const response = intlMiddleware(request);

  // Then, handle authentication for protected routes
  const pathname = request.nextUrl.pathname;
  const isProtectedRoute = pathname.includes('/(member)/');

  if (isProtectedRoute) {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return request.cookies.get(name)?.value;
          },
          set(name: string, value: string, options: any) {
            response.cookies.set({
              name,
              value,
              ...options,
            });
          },
          remove(name: string, options: any) {
            response.cookies.set({
              name,
              value: '',
              ...options,
            });
          },
        },
      }
    );

    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
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

### 3. lib/utils.ts

```typescript
// lib/utils.ts

import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merge Tailwind CSS classes with proper precedence
 *
 * @example
 * cn('px-2 py-1', 'px-4') // => 'py-1 px-4'
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format date for display
 */
export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(date));
}

/**
 * Sleep for async operations (dev/testing)
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Generate a unique ID (client-side)
 */
export function generateId(): string {
  return Math.random().toString(36).substring(2, 9);
}

/**
 * Truncate string with ellipsis
 */
export function truncate(str: string, length: number): string {
  if (str.length <= length) return str;
  return str.slice(0, length) + '...';
}
```

### 4. app/layout.tsx (Root Layout)

```typescript
// app/layout.tsx

import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: {
    default: 'Kilalo - Helping entrepreneurs succeed',
    template: '%s | Kilalo',
  },
  description: 'Helping entrepreneurs get two things right in their business: direction and execution.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://kilalo.com'),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children; // Will be replaced by [locale]/layout.tsx
}
```

### 5. app/[locale]/layout.tsx

```typescript
// app/[locale]/layout.tsx

import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';

const locales = ['en', 'fr'];

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // Validate locale
  if (!locales.includes(locale)) {
    notFound();
  }

  // Load messages for the current locale
  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={inter.variable}>
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
```

### 6. app/[locale]/page.tsx (Homepage)

```typescript
// app/[locale]/page.tsx

import { useTranslations } from 'next-intl';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Home',
};

export default function HomePage() {
  const t = useTranslations('HomePage');

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">{t('title')}</h1>
      <p className="mt-4 text-xl text-gray-600">{t('subtitle')}</p>
    </main>
  );
}
```

---

## Best Practices

### 1. Server vs Client Components

**Server Components** (default in App Router):
```typescript
// No 'use client' directive
// Can directly fetch data, access database, use secrets
export default async function ServerComponent() {
  const data = await fetchData(); // Server-side fetch
  return <div>{data}</div>;
}
```

**Client Components** (interactive):
```typescript
'use client';

// Can use hooks, event handlers, browser APIs
import { useState } from 'react';

export default function ClientComponent() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(count + 1)}>{count}</button>;
}
```

**Rule of Thumb**:
- ✅ Use Server Components by default
- ✅ Only add `'use client'` when you need:
  - React hooks (`useState`, `useEffect`, etc.)
  - Event handlers (`onClick`, `onChange`, etc.)
  - Browser APIs (`window`, `document`, etc.)
  - Third-party libraries that require client-side

### 2. Data Fetching

**Server Component** (recommended):
```typescript
// Direct fetch in Server Component
async function getData() {
  const res = await fetch('https://api.example.com/data', {
    next: { revalidate: 3600 }, // ISR: revalidate every hour
  });

  if (!res.ok) throw new Error('Failed to fetch');

  return res.json();
}

export default async function Page() {
  const data = await getData();
  return <div>{data}</div>;
}
```

**Route Handler** (for Client Components):
```typescript
// app/api/data/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
  const data = await fetchData();
  return NextResponse.json(data);
}

// Then fetch from Client Component:
// const res = await fetch('/api/data');
```

### 3. Metadata

**Static Metadata**:
```typescript
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Us',
  description: 'Learn more about our company',
};
```

**Dynamic Metadata**:
```typescript
import type { Metadata } from 'next';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      images: [post.image],
    },
  };
}
```

### 4. Error Handling

**error.tsx** (Error Boundary):
```typescript
// app/error.tsx
'use client';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div>
      <h2>Something went wrong!</h2>
      <button onClick={() => reset()}>Try again</button>
    </div>
  );
}
```

**not-found.tsx**:
```typescript
// app/not-found.tsx
import Link from 'next/link';

export default function NotFound() {
  return (
    <div>
      <h2>404 - Page Not Found</h2>
      <Link href="/">Go home</Link>
    </div>
  );
}
```

### 5. Loading States

**loading.tsx** (Streaming):
```typescript
// app/[locale]/(marketing)/blog/loading.tsx
export default function Loading() {
  return <div>Loading blog posts...</div>;
}
```

**Suspense** (granular):
```typescript
import { Suspense } from 'react';

export default function Page() {
  return (
    <>
      <Header /> {/* Renders immediately */}
      <Suspense fallback={<div>Loading posts...</div>}>
        <BlogPosts /> {/* Streams in */}
      </Suspense>
    </>
  );
}
```

---

## Common Patterns

### 1. Route Groups

**Purpose**: Organize routes without affecting URLs

```typescript
// app/[locale]/(marketing)/about/page.tsx
// URL: /en/about

// app/[locale]/(member)/dashboard/page.tsx
// URL: /en/dashboard

// app/[locale]/(marketing)/layout.tsx
// Shared layout for marketing pages
```

### 2. Parallel Routes

**Purpose**: Render multiple pages simultaneously

```typescript
// app/[locale]/(marketing)/@modal/(..)login/page.tsx
// Intercepts /login and shows as modal
```

### 3. Dynamic Routes

```typescript
// app/[locale]/(marketing)/blog/[slug]/page.tsx
// Matches: /en/blog/my-post

export default async function BlogPost({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPost(slug);
  return <article>{post.title}</article>;
}
```

### 4. Catch-all Routes

```typescript
// app/[locale]/[...slug]/page.tsx
// Matches: /en/foo, /en/foo/bar, /en/foo/bar/baz
```

---

## Troubleshooting

### Issue: "Cannot find module"

**Solution**: Check `tsconfig.json` paths configuration

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```

### Issue: Hydration errors

**Solution**: Use `suppressHydrationWarning` for dynamic content

```tsx
<html lang="en" suppressHydrationWarning>
```

### Issue: Build errors with strict TypeScript

**Solution**: Fix type errors incrementally, use type assertions sparingly

```typescript
// Bad
const value = data as any;

// Good
const value: string | undefined = data?.value;
```

### Issue: Slow development builds

**Solution**: Enable Turbopack

```bash
npm run dev --turbo
```

---

## Next Steps

1. ✅ Next.js project created and configured
2. ➡️ Continue to [Tailwind CSS + shadcn/ui Setup](./04-SETUP-TAILWIND-SHADCN.md)
3. ➡️ Then [Supabase Setup](./07-SETUP-SUPABASE.md)
4. ➡️ Then [Sanity.io Setup](./08-SETUP-SANITY.md)

---

## Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Next.js Learn Course](https://nextjs.org/learn)
- [App Router Migration Guide](https://nextjs.org/docs/app/building-your-application/upgrading/app-router-migration)
- [TypeScript in Next.js](https://nextjs.org/docs/app/building-your-application/configuring/typescript)

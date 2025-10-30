# Kilalo Marketing Website - System Architecture

## Table of Contents

1. [Overview](#overview)
2. [Architecture Diagram](#architecture-diagram)
3. [Technology Stack](#technology-stack)
4. [Project Structure](#project-structure)
5. [Data Flow](#data-flow)
6. [Security Architecture](#security-architecture)
7. [Performance Strategy](#performance-strategy)
8. [Internationalization Architecture](#internationalization-architecture)
9. [Testing Strategy](#testing-strategy)
10. [Deployment Architecture](#deployment-architecture)

---

## Overview

The Kilalo marketing website is a modern, performant, and accessible web application built with Next.js 16 (App Router), designed to serve both public marketing content and authenticated member-only features. The architecture emphasizes:

- **Performance**: Edge-first delivery, optimized images, code splitting
- **SEO**: Server-side rendering, structured data, semantic HTML
- **Accessibility**: WCAG 2.1 AA compliance, keyboard navigation, screen reader support
- **Scalability**: Serverless architecture, CDN delivery, database optimization
- **Developer Experience**: Type safety, modern tooling, comprehensive testing

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                            CLIENT LAYER                               │
│                                                                       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐              │
│  │   Desktop    │  │    Tablet    │  │    Mobile    │              │
│  │   Browsers   │  │   Browsers   │  │   Browsers   │              │
│  └──────────────┘  └──────────────┘  └──────────────┘              │
│         │                  │                  │                       │
│         └──────────────────┴──────────────────┘                      │
│                            │                                          │
│                    HTTPS Requests                                     │
└────────────────────────────┼────────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────────┐
│                         EDGE NETWORK (CDN)                            │
│                          Vercel Edge Network                          │
│                                                                       │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │  Edge Middleware                                               │  │
│  │  - i18n routing (en/fr)                                       │  │
│  │  - Authentication checks                                       │  │
│  │  - Redirects & rewrites                                       │  │
│  │  - Security headers                                            │  │
│  └──────────────────────────────────────────────────────────────┘  │
└────────────────────────────┼────────────────────────────────────────┘
                             │
              ┌──────────────┼──────────────┐
              │              │              │
              ▼              ▼              ▼
┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐
│  Static Assets   │  │  Server Routes   │  │  Client Routes   │
│  (SSG Pages)     │  │  (SSR Pages)     │  │  (CSR Pages)     │
│                  │  │                  │  │                  │
│  - Homepage      │  │  - Dynamic pages │  │  - Dashboard     │
│  - About         │  │  - API routes    │  │  - Interactive   │
│  - Services      │  │  - Auth pages    │  │    features      │
│  - Blog posts    │  │                  │  │                  │
└──────────────────┘  └──────────────────┘  └──────────────────┘
         │                     │                     │
         └─────────────────────┴─────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────────┐
│                      NEXT.JS APPLICATION LAYER                        │
│                       (App Router - RSC)                              │
│                                                                       │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │  Server Components (React Server Components)                  │  │
│  │  - Marketing pages layout                                     │  │
│  │  - Blog listing and posts                                     │  │
│  │  - SEO metadata generation                                    │  │
│  │  - Data fetching from CMS                                     │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                       │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │  Client Components ('use client')                             │  │
│  │  - Interactive forms                                          │  │
│  │  - Authentication UI                                          │  │
│  │  - Member dashboard                                           │  │
│  │  - Real-time features                                         │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                       │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │  API Routes (Route Handlers)                                  │  │
│  │  - /api/auth/callback - Supabase auth                        │  │
│  │  - /api/sanity/webhook - Content updates                     │  │
│  │  - /api/contact - Contact form                               │  │
│  └──────────────────────────────────────────────────────────────┘  │
└────────────────────────────┼────────────────────────────────────────┘
                             │
              ┌──────────────┼──────────────┐
              │              │              │
              ▼              ▼              ▼
┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐
│   SUPABASE       │  │   SANITY.IO      │  │   EXTERNAL       │
│   (Backend)      │  │   (CMS)          │  │   SERVICES       │
│                  │  │                  │  │                  │
│  ┌────────────┐ │  │  ┌────────────┐ │  │  - Email (Resend)│
│  │ PostgreSQL │ │  │  │  Content   │ │  │  - Analytics     │
│  │  Database  │ │  │  │  Lake      │ │  │  - Monitoring    │
│  └────────────┘ │  │  └────────────┘ │  │                  │
│  ┌────────────┐ │  │  ┌────────────┐ │  └──────────────────┘
│  │    Auth    │ │  │  │   Sanity   │ │
│  │  (GoTrue)  │ │  │  │   Studio   │ │
│  └────────────┘ │  │  └────────────┘ │
│  ┌────────────┐ │  │  ┌────────────┐ │
│  │  Storage   │ │  │  │    CDN     │ │
│  │  (Bucket)  │ │  │  │  (Images)  │ │
│  └────────────┘ │  │  └────────────┘ │
│  ┌────────────┐ │  │                  │
│  │ Realtime   │ │  │                  │
│  │ (Postgres) │ │  │                  │
│  └────────────┘ │  │                  │
└──────────────────┘  └──────────────────┘
```

---

## Technology Stack

### Frontend Layer

**Next.js 16 (App Router)**
- **Version**: 16.0.0 ✅ IMPLEMENTED
- **Features Used**:
  - React Server Components (RSC)
  - Server Actions
  - Streaming SSR
  - Turbopack (for dev builds)
  - Middleware
  - Route Handlers (API routes)
  - Image Optimization
  - Font Optimization

**React 19**
- **Version**: 19.2.0 ✅ IMPLEMENTED
- Automatic via Next.js 16
- Server Components
- Enhanced Suspense
- Transitions and optimistic updates

**TypeScript**
- **Version**: 5.9.3 ✅ IMPLEMENTED
- **Configuration**: Strict mode enabled
- **Benefits**: Type safety, better IDE support, catch errors early

### Styling Layer

**Tailwind CSS**
- **Version**: 3.4.17 (stable) ✅ IMPLEMENTED
- **Note**: Using v3 for production stability (v4 is still beta)
- **Features**:
  - Utility-first CSS
  - JIT (Just-In-Time) compilation
  - Custom Kilalo color palette implemented
  - Responsive design utilities
  - Dark mode support configured
  - Animation utilities (tailwindcss-animate)

**shadcn/ui**
- **Version**: Latest ✅ IMPLEMENTED
- **Components Installed**: Button, Card, Input, Label
- **Based on**: Radix UI primitives + Tailwind
- **Features**:
  - Accessible components (WCAG 2.1 AA)
  - Customizable
  - Copy-paste approach (you own the code)
  - Full TypeScript support

### Backend Services

**Supabase**
- **Components**:
  - PostgreSQL database (primary data store)
  - GoTrue (authentication server)
  - Storage (file uploads)
  - Realtime (WebSocket subscriptions)
  - Edge Functions (serverless)
- **Features**:
  - Row Level Security (RLS)
  - Automatic API generation
  - Real-time subscriptions
  - Social auth providers

**Sanity.io**
- **Version**: Latest (v3)
- **Components**:
  - Content Lake (structured content)
  - Sanity Studio (embedded CMS)
  - Image CDN (optimization and transforms)
  - GROQ (query language)
- **Features**:
  - Real-time collaboration
  - Version history
  - Structured content
  - Multi-language content

### Internationalization

**next-intl**
- **Features**:
  - Locale-based routing
  - Type-safe translations
  - ICU message format
  - Server and client component support
  - Number/date formatting

### Testing

**Playwright**
- End-to-end testing
- Cross-browser testing
- Visual regression testing
- Accessibility testing

**Vitest**
- Unit testing
- Component testing
- Fast execution
- Jest-compatible API

### Code Quality

**ESLint**
- Next.js configuration
- TypeScript rules
- Accessibility rules (jsx-a11y)
- Import sorting
- React Hooks rules

**Prettier**
- Code formatting
- Consistent style

### Deployment

**Vercel**
- Edge Network (global CDN)
- Serverless Functions
- Preview deployments
- Analytics
- Web Vitals monitoring

---

## Project Structure

```
kilalo/
├── app/                                    # Next.js App Router
│   ├── [locale]/                          # Internationalized routes
│   │   ├── layout.tsx                     # Locale-specific layout
│   │   ├── page.tsx                       # Homepage
│   │   ├── not-found.tsx                  # 404 page
│   │   │
│   │   ├── (marketing)/                   # Marketing pages route group
│   │   │   ├── layout.tsx                 # Marketing layout (header/footer)
│   │   │   ├── about/
│   │   │   │   └── page.tsx
│   │   │   ├── services/
│   │   │   │   ├── page.tsx
│   │   │   │   └── [slug]/
│   │   │   │       └── page.tsx
│   │   │   ├── contact/
│   │   │   │   └── page.tsx
│   │   │   ├── blog/
│   │   │   │   ├── page.tsx              # Blog listing
│   │   │   │   └── [slug]/
│   │   │   │       └── page.tsx          # Blog post
│   │   │   └── legal/
│   │   │       ├── privacy/
│   │   │       │   └── page.tsx
│   │   │       └── terms/
│   │   │           └── page.tsx
│   │   │
│   │   ├── (auth)/                        # Auth pages route group
│   │   │   ├── login/
│   │   │   │   └── page.tsx
│   │   │   ├── signup/
│   │   │   │   └── page.tsx
│   │   │   ├── reset-password/
│   │   │   │   └── page.tsx
│   │   │   └── verify-email/
│   │   │       └── page.tsx
│   │   │
│   │   └── (member)/                      # Protected member routes
│   │       ├── layout.tsx                 # Member portal layout
│   │       ├── dashboard/
│   │       │   └── page.tsx
│   │       ├── profile/
│   │       │   ├── page.tsx
│   │       │   └── edit/
│   │       │       └── page.tsx
│   │       ├── classes/                   # Future: Learning features
│   │       │   ├── page.tsx               # My classes
│   │       │   └── [id]/
│   │       │       └── page.tsx           # Class detail
│   │       └── settings/
│   │           └── page.tsx
│   │
│   ├── api/                               # API routes
│   │   ├── auth/
│   │   │   └── callback/
│   │   │       └── route.ts               # Supabase auth callback
│   │   ├── sanity/
│   │   │   └── webhook/
│   │   │       └── route.ts               # Sanity webhook
│   │   └── contact/
│   │       └── route.ts                   # Contact form handler
│   │
│   ├── globals.css                        # Global styles + Tailwind imports
│   ├── layout.tsx                         # Root layout
│   ├── not-found.tsx                      # Global 404
│   └── error.tsx                          # Global error boundary
│
├── components/                            # React components
│   ├── ui/                                # shadcn/ui components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── dialog.tsx
│   │   ├── form.tsx
│   │   ├── input.tsx
│   │   └── ...
│   │
│   ├── marketing/                         # Marketing-specific components
│   │   ├── hero.tsx
│   │   ├── features.tsx
│   │   ├── testimonials.tsx
│   │   ├── cta.tsx
│   │   ├── header.tsx
│   │   └── footer.tsx
│   │
│   ├── member/                            # Member portal components
│   │   ├── dashboard-nav.tsx
│   │   ├── progress-card.tsx
│   │   └── course-list.tsx
│   │
│   ├── auth/                              # Authentication components
│   │   ├── login-form.tsx
│   │   ├── signup-form.tsx
│   │   └── auth-provider.tsx
│   │
│   └── shared/                            # Shared components
│       ├── language-switcher.tsx
│       ├── theme-provider.tsx
│       └── breadcrumbs.tsx
│
├── lib/                                   # Utility libraries
│   ├── supabase/
│   │   ├── client.ts                      # Browser client
│   │   ├── server.ts                      # Server client
│   │   ├── middleware.ts                  # Middleware client
│   │   └── types.ts                       # Database types
│   │
│   ├── sanity/
│   │   ├── client.ts                      # Sanity client
│   │   ├── queries.ts                     # GROQ queries
│   │   ├── types.ts                       # Content types
│   │   └── image-builder.ts               # Image URL builder
│   │
│   ├── validations/                       # Zod schemas
│   │   ├── auth.ts
│   │   ├── contact.ts
│   │   └── profile.ts
│   │
│   └── utils.ts                           # Shared utilities (cn, etc.)
│
├── hooks/                                 # Custom React hooks
│   ├── use-user.ts                        # Current user hook
│   ├── use-media-query.ts                 # Responsive hook
│   └── use-toast.ts                       # Toast notifications
│
├── messages/                              # Internationalization
│   ├── en.json                            # English translations
│   └── fr.json                            # French translations
│
├── public/                                # Static assets
│   ├── images/
│   ├── icons/
│   └── fonts/
│
├── sanity/                                # Sanity Studio
│   ├── schemas/
│   │   ├── documents/
│   │   │   ├── page.ts
│   │   │   ├── blog-post.ts
│   │   │   └── service.ts
│   │   ├── objects/
│   │   │   ├── hero.ts
│   │   │   ├── seo.ts
│   │   │   └── localized-string.ts
│   │   └── index.ts
│   ├── sanity.config.ts                   # Studio configuration
│   ├── sanity.cli.ts                      # CLI configuration
│   └── structure.ts                       # Studio structure
│
├── tests/                                 # Test files
│   ├── e2e/                               # Playwright E2E tests
│   │   ├── auth.spec.ts
│   │   ├── navigation.spec.ts
│   │   └── accessibility.spec.ts
│   ├── unit/                              # Vitest unit tests
│   │   ├── components/
│   │   └── lib/
│   └── fixtures/                          # Test fixtures
│
├── types/                                 # TypeScript types
│   ├── supabase.ts                        # Generated Supabase types
│   ├── sanity.ts                          # Sanity content types
│   └── index.ts                           # Shared types
│
├── middleware.ts                          # Next.js middleware
├── next.config.ts                         # Next.js configuration
├── tailwind.config.ts                     # Tailwind configuration
├── tsconfig.json                          # TypeScript configuration
├── eslint.config.mjs                      # ESLint configuration
├── prettier.config.mjs                    # Prettier configuration
├── playwright.config.ts                   # Playwright configuration
├── vitest.config.ts                       # Vitest configuration
├── package.json                           # Dependencies
├── .env.local.example                     # Environment variables template
├── .gitignore                             # Git ignore rules
└── README.md                              # Project documentation
```

---

## Data Flow

### 1. Public Marketing Pages (SSG)

```
User Request
    ↓
Vercel Edge (CDN)
    ↓
Static HTML (pre-rendered at build time)
    ↓
Hydration with minimal JavaScript
    ↓
Interactive page
```

**Example**: Homepage (`/en`), About page (`/en/about`)

**Build Time**:
1. Fetch content from Sanity.io
2. Generate static HTML for each locale
3. Deploy to Vercel Edge Network
4. Serve from nearest edge location

**Benefits**:
- Instant page loads (no server delay)
- Excellent SEO
- Low server costs
- High scalability

### 2. Dynamic Marketing Pages (ISR)

```
User Request
    ↓
Vercel Edge (CDN)
    ↓
Check cache (is page fresh?)
    ├─ YES: Serve cached HTML
    └─ NO: Regenerate page
           ↓
       Fetch from Sanity.io
           ↓
       Generate new HTML
           ↓
       Update cache
           ↓
       Serve to user
```

**Example**: Blog posts (`/en/blog/[slug]`)

**Runtime**:
1. User requests blog post
2. If cached and fresh, serve immediately
3. If stale, regenerate in background
4. Webhook from Sanity triggers revalidation on content update

**Benefits**:
- Always up-to-date content
- Fast page loads
- Automatic cache invalidation

### 3. Authenticated Member Pages (SSR)

```
User Request
    ↓
Vercel Edge Middleware
    ↓
Check authentication (Supabase JWT)
    ├─ NO: Redirect to /login
    └─ YES: Continue
           ↓
       Server-side rendering
           ↓
       Fetch user-specific data from Supabase
           ↓
       Generate personalized HTML
           ↓
       Serve to user
```

**Example**: Dashboard (`/en/dashboard`)

**Runtime**:
1. Middleware validates authentication
2. Server Component fetches user data
3. Page renders with user-specific content
4. Client Components provide interactivity

**Benefits**:
- Personalized content
- Protected routes
- SEO for member pages (if needed)

### 4. Client-side Interactions (CSR)

```
User Interaction (click, form submit, etc.)
    ↓
Client Component event handler
    ↓
Fetch API call or Server Action
    ↓
Supabase/Sanity API
    ↓
Response
    ↓
Update UI (React state)
    ↓
Optimistic updates / transitions
```

**Example**: Form submission, real-time updates

---

## Security Architecture

### 1. Authentication Flow

```
┌─────────────┐
│   Browser   │
└─────┬───────┘
      │ 1. User clicks "Sign In"
      ▼
┌─────────────────────────────────┐
│  Next.js (Auth Page)            │
│  /login                         │
└─────┬───────────────────────────┘
      │ 2. Submit credentials
      ▼
┌─────────────────────────────────┐
│  Supabase GoTrue (Auth Server)  │
│  - Verify credentials           │
│  - Generate JWT                 │
│  - Create session               │
└─────┬───────────────────────────┘
      │ 3. Return JWT + refresh token
      ▼
┌─────────────────────────────────┐
│  Next.js API Route              │
│  /api/auth/callback             │
│  - Set secure HTTP-only cookies │
└─────┬───────────────────────────┘
      │ 4. Redirect to dashboard
      ▼
┌─────────────────────────────────┐
│  Next.js Middleware             │
│  - Validate JWT on every request│
│  - Refresh if needed            │
└─────────────────────────────────┘
```

**Security Measures**:
- JWT stored in HTTP-only cookies (XSS protection)
- Short-lived access tokens (15 min)
- Refresh tokens for silent renewal
- CSRF protection via SameSite cookies
- Secure cookies in production (HTTPS only)

### 2. Row Level Security (RLS)

**Supabase PostgreSQL Policies**:

```sql
-- Example: Users can only read their own profile
CREATE POLICY "Users can view own profile"
ON profiles FOR SELECT
USING (auth.uid() = id);

-- Example: Users can update their own profile
CREATE POLICY "Users can update own profile"
ON profiles FOR UPDATE
USING (auth.uid() = id);

-- Example: Public blog posts are visible to all
CREATE POLICY "Blog posts are publicly readable"
ON blog_posts FOR SELECT
USING (status = 'published');
```

**Benefits**:
- Database-level security (not just API)
- Cannot be bypassed
- Automatic enforcement
- User-specific data isolation

### 3. Content Security

**Sanity.io Access Control**:
- API tokens with read-only access for client
- Write access only for authenticated Studio users
- GROQ query validation
- Image URL signing (optional)

### 4. API Security

**Next.js API Routes**:
- Authentication checks
- Rate limiting (Vercel)
- Input validation (Zod schemas)
- CORS configuration
- Security headers

**Example**: Contact form endpoint

```typescript
// app/api/contact/route.ts
import { NextResponse } from 'next/server';
import { z } from 'zod';

const ContactSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  message: z.string().min(10).max(1000),
});

export async function POST(request: Request) {
  // 1. Validate input
  const body = await request.json();
  const result = ContactSchema.safeParse(body);

  if (!result.success) {
    return NextResponse.json(
      { error: 'Invalid input' },
      { status: 400 }
    );
  }

  // 2. Process (send email, save to DB, etc.)
  // ...

  // 3. Return response
  return NextResponse.json({ success: true });
}
```

### 5. Environment Variables

**Secure Storage**:
- Server-only variables (no `NEXT_PUBLIC_` prefix)
- Stored in Vercel dashboard (encrypted)
- Local development: `.env.local` (gitignored)
- Different values per environment (dev, preview, production)

**Example**:

```bash
# Public (client-side safe)
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxx

# Private (server-side only)
SUPABASE_SERVICE_ROLE_KEY=xxx
SANITY_API_WRITE_TOKEN=xxx
SANITY_WEBHOOK_SECRET=xxx
```

---

## Performance Strategy

### 1. Rendering Strategy

| Page Type | Strategy | Reason |
|-----------|----------|--------|
| Homepage | SSG + ISR | Static, infrequent updates |
| About/Services | SSG + ISR | Static, infrequent updates |
| Blog listing | ISR (revalidate: 3600) | Dynamic, frequent updates |
| Blog post | ISR (on-demand) | Dynamic, webhook revalidation |
| Dashboard | SSR | User-specific, personalized |
| Profile | SSR | User-specific, personalized |
| Auth pages | SSG | Static forms |

### 2. Code Splitting

**Automatic** (Next.js):
- Each route is a separate JavaScript bundle
- Shared code extracted to common chunks
- Dynamic imports for large components

**Manual** (React):
```typescript
import dynamic from 'next/dynamic';

const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <Skeleton />,
  ssr: false, // Client-side only if needed
});
```

### 3. Image Optimization

**Next.js Image Component**:
```tsx
import Image from 'next/image';

<Image
  src="/hero.jpg"
  alt="Hero image"
  width={1920}
  height={1080}
  priority // LCP image
  sizes="(max-width: 768px) 100vw, 50vw"
/>
```

**Features**:
- Automatic WebP/AVIF conversion
- Responsive srcset generation
- Lazy loading (except priority images)
- Blur placeholder
- CDN delivery

**Sanity.io Images**:
- Image CDN with on-the-fly transforms
- URL-based API (`?w=800&h=600&fit=crop`)
- Automatic format optimization
- LQIP (Low Quality Image Placeholder)

### 4. Font Optimization

**Next.js Font Optimization**:
```typescript
import { Inter, Playfair_Display } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-playfair',
});
```

**Benefits**:
- Self-hosted fonts (privacy, performance)
- Automatic subsetting
- font-display: swap (no FOIT)
- Preload critical fonts
- Zero layout shift

### 5. Database Optimization

**Supabase**:
- Indexed columns for fast queries
- Query optimization (EXPLAIN ANALYZE)
- Connection pooling (PgBouncer)
- Read replicas (production)
- Caching layer (Redis)

**Sanity.io**:
- Efficient GROQ queries
- Projection (select only needed fields)
- Reference expansion (avoid N+1 queries)
- CDN caching

### 6. Edge Caching

**Vercel Edge Network**:
- Automatic static asset caching
- ISR page caching
- Custom cache control headers
- Stale-while-revalidate

---

## Internationalization Architecture

### 1. Routing Strategy

**URL Structure**:
```
kilalo.com/en/              → English homepage
kilalo.com/en/about/        → English about page
kilalo.com/fr/              → French homepage
kilalo.com/fr/about/        → French about page (à propos)
```

**Middleware** (`middleware.ts`):
```typescript
import createMiddleware from 'next-intl/middleware';

export default createMiddleware({
  locales: ['en', 'fr'],
  defaultLocale: 'en',
  localePrefix: 'always', // Always show locale in URL
});

export const config = {
  matcher: ['/((?!api|_next|.*\\..*).*)'],
};
```

### 2. Translation Management

**File Structure**:
```
messages/
├── en.json
└── fr.json
```

**English** (`messages/en.json`):
```json
{
  "Navigation": {
    "home": "Home",
    "about": "About",
    "services": "Services",
    "blog": "Blog",
    "contact": "Contact"
  },
  "HomePage": {
    "hero": {
      "title": "Welcome to Kilalo",
      "subtitle": "Helping entrepreneurs get direction and execution right",
      "cta": "Get Started"
    }
  }
}
```

**French** (`messages/fr.json`):
```json
{
  "Navigation": {
    "home": "Accueil",
    "about": "À propos",
    "services": "Services",
    "blog": "Blog",
    "contact": "Contact"
  },
  "HomePage": {
    "hero": {
      "title": "Bienvenue chez Kilalo",
      "subtitle": "Aider les entrepreneurs à obtenir la bonne direction et exécution",
      "cta": "Commencer"
    }
  }
}
```

### 3. Usage in Components

**Server Component**:
```typescript
import { useTranslations } from 'next-intl';

export default function HomePage() {
  const t = useTranslations('HomePage');

  return (
    <h1>{t('hero.title')}</h1>
  );
}
```

**Client Component**:
```typescript
'use client';

import { useTranslations } from 'next-intl';

export function LanguageSwitcher() {
  const t = useTranslations('Navigation');
  // ...
}
```

### 4. Content Localization (Sanity)

**Schema**:
```typescript
// sanity/schemas/documents/page.ts
export default {
  name: 'page',
  type: 'document',
  fields: [
    {
      name: 'title',
      type: 'object',
      fields: [
        { name: 'en', type: 'string', title: 'English' },
        { name: 'fr', type: 'string', title: 'French' },
      ],
    },
    // ...
  ],
};
```

**Query**:
```typescript
// Fetch localized content
const query = `*[_type == "page" && slug.current == $slug][0] {
  "title": title[$locale],
  "content": content[$locale],
}`;

const page = await sanityClient.fetch(query, {
  slug: 'about',
  locale: 'fr',
});
```

---

## Testing Strategy

### 1. Unit Tests (Vitest)

**What to Test**:
- Utility functions
- Custom hooks
- Form validation schemas
- Data transformations

**Example**:
```typescript
// lib/utils.test.ts
import { describe, it, expect } from 'vitest';
import { cn } from './utils';

describe('cn', () => {
  it('merges class names correctly', () => {
    expect(cn('foo', 'bar')).toBe('foo bar');
  });
});
```

### 2. Component Tests (Vitest + Testing Library)

**What to Test**:
- Component rendering
- User interactions
- Props handling
- Accessibility

**Example**:
```typescript
// components/ui/button.test.tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Button } from './button';

describe('Button', () => {
  it('renders children correctly', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button')).toHaveTextContent('Click me');
  });
});
```

### 3. E2E Tests (Playwright)

**What to Test**:
- Critical user journeys
- Authentication flows
- Form submissions
- Cross-browser compatibility
- Accessibility

**Example**:
```typescript
// tests/e2e/auth.spec.ts
import { test, expect } from '@playwright/test';

test('user can sign up', async ({ page }) => {
  await page.goto('/en/signup');

  await page.fill('input[name="email"]', 'test@example.com');
  await page.fill('input[name="password"]', 'password123');
  await page.click('button[type="submit"]');

  await expect(page).toHaveURL('/en/dashboard');
});
```

### 4. Accessibility Tests (Playwright + axe)

**Example**:
```typescript
// tests/e2e/accessibility.spec.ts
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('homepage is accessible', async ({ page }) => {
  await page.goto('/en');

  const accessibilityScanResults = await new AxeBuilder({ page })
    .analyze();

  expect(accessibilityScanResults.violations).toEqual([]);
});
```

### 5. Visual Regression Tests (Playwright)

**Example**:
```typescript
// tests/e2e/visual.spec.ts
import { test, expect } from '@playwright/test';

test('homepage looks correct', async ({ page }) => {
  await page.goto('/en');
  await expect(page).toHaveScreenshot('homepage.png');
});
```

---

## Deployment Architecture

### 1. Git Workflow

```
main (production)
  ↑
  ← merge from staging
staging (preview)
  ↑
  ← merge from feature branches
feature/* (preview)
```

### 2. Vercel Deployment

**Automatic Deployments**:
- `main` branch → Production (`kilalo.com`)
- `staging` branch → Preview (`staging.kilalo.com`)
- Pull requests → Unique preview URL

**Build Process**:
1. Git push to GitHub
2. Vercel detects changes
3. Install dependencies (`npm install`)
4. Run build (`npm run build`)
   - Generate static pages (SSG)
   - Compile TypeScript
   - Optimize images
   - Bundle JavaScript
5. Deploy to Edge Network
6. Run smoke tests
7. Update DNS (if production)

### 3. Environment Variables (per environment)

**Development** (`.env.local`):
- Supabase: Local instance or dev project
- Sanity: Development dataset
- Debug logging enabled

**Preview** (Vercel settings):
- Supabase: Staging project
- Sanity: Development dataset
- Preview mode enabled

**Production** (Vercel settings):
- Supabase: Production project
- Sanity: Production dataset
- Analytics enabled
- Error tracking enabled

### 4. Monitoring & Observability

**Vercel Analytics**:
- Web Vitals (LCP, FID, CLS, TTFB)
- Page views and traffic
- Function execution logs
- Error tracking

**Supabase Dashboard**:
- Database metrics
- Query performance
- API usage
- Auth events

**Sentry** (optional):
- Error tracking
- Performance monitoring
- User feedback

---

## Scalability Considerations

### 1. Current Architecture (MVP)

**Capacity**:
- 100,000 page views/month: ✅ Easily handled
- 1,000 authenticated users: ✅ No issues
- 10 GB content: ✅ Well within limits

**Costs**:
- Vercel: Free (Hobby) → $20/mo (Pro)
- Supabase: Free → $25/mo (Pro)
- Sanity: Free → $99/mo (Growth)
- **Total: $0-144/month**

### 2. Growth Path (Scale)

**At 1M page views/month**:
- Vercel Pro: $20/mo (sufficient)
- Supabase Pro: $25/mo (may need Team at $599/mo)
- Sanity Growth: $99/mo (sufficient)
- CDN costs increase (pay-as-you-go)

**At 10M page views/month**:
- Vercel Enterprise: Custom pricing
- Supabase Team: $599/mo (or Enterprise)
- Sanity Growth/Enterprise: $99-999/mo
- Consider read replicas, caching layers

### 3. Performance Optimization Path

**Phase 1** (MVP):
- ISR for blog posts
- Basic image optimization
- Standard caching

**Phase 2** (Growth):
- Edge caching (Vercel KV)
- Database read replicas
- Image CDN optimization (Cloudinary/Imgix)

**Phase 3** (Scale):
- Multi-region deployment
- Advanced caching strategies
- Database sharding (if needed)

---

## Security Checklist

- [x] HTTPS enforced (Vercel automatic)
- [x] Security headers (CSP, HSTS, X-Frame-Options)
- [x] Authentication (Supabase GoTrue)
- [x] Authorization (RLS policies)
- [x] Input validation (Zod schemas)
- [x] XSS protection (React escaping + CSP)
- [x] CSRF protection (SameSite cookies)
- [x] SQL injection protection (Supabase client + RLS)
- [x] Rate limiting (Vercel automatic)
- [x] Secret management (Environment variables)
- [x] Audit logging (Supabase logs)
- [x] Regular dependency updates (Dependabot)

---

## Conclusion

This architecture provides:
- ✅ **Excellent Performance**: Edge delivery, optimized assets, efficient rendering
- ✅ **Strong Security**: Multi-layer protection, authentication, authorization
- ✅ **Scalability**: Serverless architecture, CDN, database optimization
- ✅ **Developer Experience**: Modern tooling, type safety, comprehensive testing
- ✅ **Maintainability**: Clear structure, separation of concerns, documentation
- ✅ **Accessibility**: WCAG 2.1 AA compliance, semantic HTML, keyboard navigation
- ✅ **SEO**: Server-side rendering, structured data, semantic markup
- ✅ **Internationalization**: French & English support, locale-specific routing

**Ready for production deployment and future growth.**

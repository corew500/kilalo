# Performance Optimization Research Findings

**Date**: 2025-10-30
**Context**: Research into solving 7-10s first-load performance for DRC users on slow 3G connections

---

## Executive Summary

Based on research into how teams solve similar performance challenges, we have **3 proven approaches** that can reduce our 7-10s first load to **4-5s** or better:

1. **React Server Components Migration** (Expected: -100-200KB, ~2s improvement)
2. **next-intl Optimization via Server Components** (Expected: -50-100KB, ~1s improvement)
3. **Service Worker + Aggressive Caching** (Second load: <2s)
4. **React 18 Selective Hydration** (Already enabled, needs Suspense boundaries)

---

## 1. React Server Components (RSC) Migration

### What the Research Shows

**Real-World Results**:
- Mux.com migrated 50,000 lines to RSC: **-18-29% bundle size**
- One component migration saved **240KB uncompressed**
- React team targeting **zero-bundle-size** for Server Components

**How It Works**:
- RSCs render on server, send HTML (not JavaScript) to client
- Client Components only for interactive elements (buttons, forms, modals)
- **Critical**: All layouts/pages in Next.js App Router are RSC by default

### Migration Strategy (3-Step Playbook)

```
Step 1: Add 'use client' to root of app
Step 2: Add Server Component as parent to fetch data
Step 3: Move 'use client' further down component tree
```

**Key Principle**: "Adopt incrementally in places that would stand to gain the most"

### What Can Be Converted

✅ **Convert to Server Component**:
- Static content display (hero sections, text blocks)
- Data fetching components
- Layout components
- Card components (if they don't have onClick handlers)
- Navigation links (use `<Link>` from next/link, which works as RSC)

❌ **Must Stay Client Component**:
- Components using `useState`, `useEffect`, `useContext`
- Event handlers (onClick, onChange, etc.)
- Browser APIs (localStorage, window, document)
- Third-party libraries that use client-side hooks

### Implementation for Kilalo

**High-Value Targets** (based on research):
1. `components/shared/VentureCard.tsx` - If we remove hover effects or handle them with CSS
2. `components/shared/hero/*` - Hero sections are usually static
3. `components/shared/Section.tsx` - Wrapper components
4. `app/[locale]/(marketing)/*` - Marketing pages are mostly static content

**Expected Impact**:
- Research shows **-18-29% bundle reduction**
- For our 500KB bundle: **-90-145KB** = **2-3s faster** on 3G

---

## 2. next-intl Bundle Size Optimization

### What the Research Shows

**Key Findings**:
- next-intl 4.0 reduced bundle size by **-7%** through ESM-only format
- **Server Components don't affect client bundle** for translations
- "Translation files don't affect client-side JavaScript bundle size" when using RSC

### Current Problem

We're likely loading **ALL translations** for the locale on every page. For example:
- Homepage needs ~50 translation keys
- We're shipping ~200+ keys (all keys for entire site)
- Waste: **~75% of translation payload is unused**

### Solution: Server Component Translation Pattern

```tsx
// ✅ GOOD: Server Component (no client bundle impact)
async function Page() {
  const t = await getTranslations('HomePage')
  return <h1>{t('title')}</h1>
}

// ❌ BAD: Client Component (ships ALL translations to client)
'use client'
function Page() {
  const t = useTranslations('HomePage')
  return <h1>{t('title')}</h1>
}
```

### Implementation for Kilalo

**Strategy**: Move translation usage to Server Components wherever possible

**Current Architecture** (needs verification):
```tsx
// app/[locale]/layout.tsx
<NextIntlClientProvider messages={messages}>
  {children}
</NextIntlClientProvider>
```

**Optimization**:
- Keep provider for Client Components that need it
- Use `getTranslations()` in Server Components (no client bundle impact)
- Only pass specific translations to Client Components as props

**Expected Impact**:
- **-50-100KB** translation payload reduction
- **~1s faster** on 3G

---

## 3. Service Worker Caching Strategy

### What the Research Shows

**Popular Solutions**:
- `next-pwa` (formerly `next-offline`) - Zero config PWA plugin using Workbox
- Workbox strategies: Cache First, Network First, Stale While Revalidate

**Key Insight**: "Cache First strategy - if there is a Response in the cache, the Request will be fulfilled using the cached response and the network will not be used at all"

### Caching Strategies by Resource Type

**Strategy 1: Cache First** (for static assets)
- Fonts, images, CSS, JS bundles
- Use cached version immediately if available
- Update cache in background

**Strategy 2: Stale While Revalidate** (for dynamic content)
- API responses, page HTML
- Return cached version immediately
- Fetch fresh version in background for next time

**Strategy 3: Network First** (for critical data)
- User-specific data, real-time content
- Try network, fallback to cache if offline

### Implementation for Kilalo

**Using `next-pwa` + Workbox**:

```js
// next.config.js
const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  runtimeCaching: [
    {
      urlPattern: /^https:\/\/cdn\.sanity\.io\/.*/i,
      handler: 'CacheFirst',
      options: {
        cacheName: 'sanity-images',
        expiration: {
          maxEntries: 64,
          maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
        },
      },
    },
    {
      urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
      handler: 'CacheFirst',
      options: {
        cacheName: 'google-fonts',
        expiration: {
          maxEntries: 4,
          maxAgeSeconds: 365 * 24 * 60 * 60, // 1 year
        },
      },
    },
  ],
})
```

**Expected Impact**:
- **First load**: No change (7-10s)
- **Second load**: **<2s** (everything from cache)
- **Offline**: Site still works!

---

## 4. React 18 Selective Hydration

### What the Research Shows

**Performance Benefits**:
- nextjs.org reduced Total Blocking Time **from 430ms to 80ms** (-81%)
- Components hydrate **as soon as JavaScript is available**
- User interactions **prioritize hydration** of clicked components

**How It Works**:
```
Traditional Hydration:
1. Wait for ALL JavaScript to load
2. Hydrate entire page at once
3. Page becomes interactive

Selective Hydration (React 18):
1. Stream HTML immediately
2. Hydrate components as JS arrives
3. Prioritize components user clicks
4. Page interactive much faster
```

### Implementation Requirements

**Current Status**: ✅ We're using React 18 (Next.js 14+)

**To Enable**: Add `<Suspense>` boundaries around heavy components

```tsx
import { Suspense } from 'react'

export default function Page() {
  return (
    <>
      <Hero /> {/* Hydrates first */}

      <Suspense fallback={<VenturesSkeleton />}>
        <FeaturedVentures /> {/* Hydrates when ready */}
      </Suspense>

      <Suspense fallback={<div>Loading...</div>}>
        <HeavyComponent /> {/* Hydrates last */}
      </Suspense>
    </>
  )
}
```

**Key Quote from Research**:
> "Components can become interactive faster by allowing the browser to do other work at the same time as hydration, making your page more responsive"

### Implementation for Kilalo

**Add Suspense Boundaries**:
1. Around `<FeaturedVentures />` component
2. Around any data-fetching sections
3. Around below-fold content

**Expected Impact**:
- **Perceived performance**: Much better (content visible sooner)
- **Actual LCP**: May improve 1-2s if hero hydrates faster
- **User experience**: Clicks work sooner even if JavaScript still loading

---

## 5. Additional Findings

### Progressive Enhancement with Next.js App Router

**Key Finding**: "Server Actions for progressive enhancement - forms work even if JavaScript has not yet loaded"

**What This Means**:
- Forms can work WITHOUT JavaScript using Server Actions
- Navigation can work with native `<a>` tags (though we lose client-side transitions)
- Critical content visible immediately even on 2G

**Implementation**:
```tsx
// Contact form that works without JavaScript
export default function ContactForm() {
  return (
    <form action={submitFormAction}>
      <input name="email" />
      <button type="submit">Submit</button>
    </form>
  )
}

// Server Action
async function submitFormAction(formData: FormData) {
  'use server'
  const email = formData.get('email')
  // Process form...
  redirect('/thank-you')
}
```

**Benefits for DRC Users**:
- Form submission works even if JavaScript times out
- Graceful degradation on very slow connections

---

## Recommended Implementation Plan

### Phase 1: Quick Wins (1-2 days)

**Priority 1**: RSC Migration for Static Components
- Audit all `'use client'` components
- Convert non-interactive components to Server Components
- **Expected**: -100-200KB, ~2s improvement

**Priority 2**: next-intl Server Component Pattern
- Move translations to Server Components
- Pass only needed translations to Client Components
- **Expected**: -50-100KB, ~1s improvement

**Target**: First load **7-10s → 4-5s**

### Phase 2: Medium Term (2-3 days)

**Priority 3**: Add Service Worker Caching
- Install `next-pwa`
- Configure Workbox caching strategies
- **Expected**: Second load <2s

**Priority 4**: Add Suspense Boundaries
- Wrap heavy components in `<Suspense>`
- Enable React 18 selective hydration
- **Expected**: Better perceived performance

**Target**: Second load **<2s**, better perceived speed

### Phase 3: Long Term (1 week)

**Priority 5**: Progressive Enhancement
- Convert forms to use Server Actions
- Ensure site works without JavaScript
- Test on 2G throttling

**Target**: Usable on **ANY** connection speed

---

## Success Metrics

### Before Optimization
- **First load (3G)**: 7-10s to interactive
- **Second load**: 3-4s
- **JavaScript bundle**: ~500KB
- **Translation payload**: ~100KB (all keys)

### After Phase 1 (Target)
- **First load (3G)**: 4-5s to interactive ✅
- **Second load**: 3-4s (unchanged)
- **JavaScript bundle**: ~300KB (-40%)
- **Translation payload**: ~50KB (-50%)

### After Phase 2 (Target)
- **First load (3G)**: 4-5s (unchanged)
- **Second load**: <2s ✅✅
- **Perceived performance**: Much better (content visible sooner)

### After Phase 3 (Target)
- **2G connections**: Site still usable (forms work, content visible)
- **No JavaScript**: Site still functional

---

## Key Takeaways from Research

1. **"JavaScript bundle size directly impacts TTI"** - Every KB matters on 3G
2. **"Ship fewer resources to the browser"** - RSC is the biggest win
3. **"Adopt incrementally"** - Don't try to convert everything at once
4. **"Translation files don't affect client bundle"** - When using Server Components
5. **"Forms work even if JavaScript hasn't loaded"** - Server Actions for progressive enhancement
6. **"Components hydrate as soon as JS is available"** - React 18 selective hydration
7. **"Cache First strategy"** - Return visitors should be <2s

---

## References

### React Server Components
- [Mux.com: We migrated 50,000 lines of code to RSC](https://www.mux.com/blog/what-are-react-server-components)
- [A Practical Guide for Migrating to Server Components](https://gitnation.com/contents/a-practical-guide-for-migrating-to-server-components)
- [Making Sense of React Server Components by Josh Comeau](https://www.joshwcomeau.com/react/server-components/)

### next-intl Optimization
- [next-intl 4.0 Release Notes](https://next-intl.dev/blog/next-intl-4-0)
- [Next.js Internationalization Guide](https://nextjs.org/docs/app/guides/internationalization)

### Service Workers
- [Workbox Guide (web.dev)](https://web.dev/learn/pwa/workbox)
- [next-pwa: Zero config PWA plugin for Next.js](https://github.com/shadowwalker/next-pwa)

### React 18 Selective Hydration
- [New in 18: Selective Hydration (React Working Group)](https://github.com/reactwg/react-18/discussions/130)
- [Vercel: Improving INP with React 18 and Suspense](https://vercel.com/blog/improving-interaction-to-next-paint-with-react-18-and-suspense)
- [Patterns.dev: Selective Hydration](https://www.patterns.dev/react/react-selective-hydration/)

### Next.js Performance
- [8 reasons your Next.js app is slow — and how to fix them (LogRocket)](https://blog.logrocket.com/fix-nextjs-app-slow-performance/)
- [Next.js Performance Optimization (2025)](https://pagepro.co/blog/nextjs-performance-optimization-in-9-steps/)

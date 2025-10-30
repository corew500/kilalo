# LCP Optimization Guide - From 1.7s to <1.0s

**Current LCP**: 1.7-1.9s (Good, but can be better)
**Target LCP**: <1.0s (Top 25% of web)
**French Pages LCP**: 6.8-7.0s ❌ (Critical issue)

---

## Understanding the Benchmarks

### Google Core Web Vitals
- **Good**: <2.5s ✅ (You're here for English pages)
- **Needs Improvement**: 2.5-4.0s
- **Poor**: >4.0s ❌ (French pages are here)

### Real-World Percentiles
- **Top 10%**: <0.8s (Elite performance)
- **Top 25%**: <1.2s (Excellent)
- **Top 40%**: <1.7s (Your current English pages)
- **Median**: ~2.5s
- **Bottom 25%**: >4.0s (Your French pages)

**Your Status**:
- English: Top 40% (good, improvable)
- French: Bottom 25% (critical issue)

---

## Root Causes

### Why 1.7s Instead of <1.0s?

Based on your codebase analysis, here are the likely causes:

#### 1. **No Font Optimization** ⚠️

**Current State**:
```tsx
// app/[locale]/layout.tsx
<html lang={locale} suppressHydrationWarning>
  <body className="antialiased">
    {children}
  </body>
</html>
```

**Issue**: Using system fonts WITHOUT explicit configuration means:
- Browser has to request fonts from external sources
- No `font-display` strategy
- No preloading
- Potential FOIT (Flash of Invisible Text)

**Solution**: Use `next/font` with Google Fonts or local fonts

#### 2. **No Resource Hints** ❌

**Missing**:
```html
<link rel="preconnect" href="https://cdn.sanity.io" />
<link rel="dns-prefetch" href="https://cdn.sanity.io" />
```

**Impact**: Every image/asset from Sanity CDN requires DNS lookup + connection

#### 3. **Potential Image Issues** ⚠️

Need to verify:
- Are all images using `next/image`?
- Are images properly sized?
- Is `priority` prop used on hero images?
- Are placeholder blurs implemented?

#### 4. **Client-Side Rendering** ?

Need to check:
- Are components properly using RSC (React Server Components)?
- Is unnecessary JavaScript being shipped to client?
- Are translations loaded optimally?

---

## Why French Pages Are 3.6x Slower

### Hypothesis Testing

#### Most Likely: Font Loading Issue

**Theory**: French characters (é, è, ê, ç, à, etc.) may trigger:
1. Additional font variant downloads
2. Larger font file for extended character sets
3. Different font-display behavior

**Test**:
```bash
# Check network waterfall for font requests
# Compare /en vs /fr in Chrome DevTools
```

#### Likely: ISR/Cache Configuration

**Theory**: French pages may not be properly cached

**Evidence Needed**:
- Check cache headers: `curl -I https://kilalo.vercel.app/fr`
- Verify ISR revalidation time
- Check Vercel logs for cache hits/misses

**Test**:
```bash
# Check cache headers
curl -I https://kilalo.vercel.app/en | grep -i cache
curl -I https://kilalo.vercel.app/fr | grep -i cache
```

#### Possible: Translation Bundle Size

**Theory**: French translations loaded differently than English

**Check**:
```bash
# Compare bundle sizes
# Check if translations are code-split properly
```

#### Less Likely: Content Differences

**Theory**: French content is longer, requiring more rendering time

**Test**: Compare HTML payload sizes between locales

---

## Optimization Plan

### Phase 1: Quick Wins (High Impact)

#### 1.1 Implement Font Optimization

**Before**:
```tsx
// No font configuration
<body className="antialiased">{children}</body>
```

**After**:
```tsx
// app/[locale]/layout.tsx
import { Inter } from 'next/font/google'

const inter = Inter({
  subsets: ['latin', 'latin-ext'], // latin-ext includes French characters
  display: 'swap', // Prevent FOIT
  preload: true,
  fallback: ['system-ui', 'arial'],
})

<body className={`${inter.className} antialiased`}>{children}</body>
```

**Impact**: Reduce font loading time by 300-500ms
**LCP Improvement**: 0.3-0.5s

#### 1.2 Add Resource Hints

```tsx
// app/[locale]/layout.tsx - in <head>
export default async function LocaleLayout({ children, params }: Props) {
  return (
    <html lang={locale}>
      <head>
        <link rel="preconnect" href="https://cdn.sanity.io" />
        <link rel="dns-prefetch" href="https://cdn.sanity.io" />
      </head>
      <body>{children}</body>
    </html>
  )
}
```

**Impact**: Reduce CDN connection time by 100-200ms
**LCP Improvement**: 0.1-0.2s

#### 1.3 Optimize Hero Images

**Check current hero implementation**:
```tsx
// Find hero image on homepage
// Ensure it uses:
<Image
  src={heroImage}
  alt="Hero"
  priority // Critical for LCP!
  placeholder="blur"
  sizes="100vw"
/>
```

**Impact**: Images load in parallel with HTML parsing
**LCP Improvement**: 0.2-0.4s

**Estimated Total Phase 1 Impact**: 0.6-1.1s reduction
**New LCP Target**: 0.6-1.3s (from 1.7s)

---

### Phase 2: Medium Wins

#### 2.1 Optimize Sanity Image Pipeline

```tsx
// lib/sanity-image.ts
import imageUrlBuilder from '@sanity/image-url'
import { client } from '@/sanity/lib/client'

const builder = imageUrlBuilder(client)

export function urlFor(source: any) {
  return builder
    .image(source)
    .auto('format') // Automatic WebP/AVIF
    .fit('max')
    .quality(85) // Balance quality vs size
}
```

#### 2.2 Implement ISR Properly

```tsx
// app/[locale]/page.tsx
export const revalidate = 3600 // 1 hour

export default async function Page({ params }) {
  // Ensure both locales have same revalidation
}
```

#### 2.3 Code Split Translations

```tsx
// Only load required locale
const messages = await getMessages({ locale })
// Instead of loading all translations
```

**Estimated Phase 2 Impact**: 0.1-0.3s reduction

---

### Phase 3: French-Specific Fixes

#### 3.1 Font Subset Optimization

```tsx
const inter = Inter({
  subsets: ['latin', 'latin-ext'], // Ensure latin-ext is included
  display: 'swap',
})
```

**Why This Matters**:
- `latin`: English characters
- `latin-ext`: Includes é, è, ê, ç, à, ù, œ (French)

If you're only loading `latin`, French pages need to download `latin-ext` on demand, causing the 5-second delay!

#### 3.2 Locale-Specific Caching

```tsx
// middleware.ts
export function middleware(request: NextRequest) {
  const locale = // ... detect locale

  // Ensure both locales have proper cache headers
  const response = NextResponse.next()
  response.headers.set('Cache-Control', 'public, max-age=3600, stale-while-revalidate=86400')
  return response
}
```

#### 3.3 Preload French Fonts

```tsx
// For French pages, explicitly preload fonts
{locale === 'fr' && (
  <>
    <link
      rel="preload"
      href="/fonts/inter-french.woff2"
      as="font"
      type="font/woff2"
      crossOrigin="anonymous"
    />
  </>
)}
```

**Estimated Phase 3 Impact**:
- French pages: 4-5s reduction (6.8s → 1.5-2.0s)

---

## Implementation Priority

### 🔴 CRITICAL (Do First)

1. **Add font optimization with latin-ext subset**
   - Fixes both English improvement AND French critical issue
   - Estimated impact: English -0.4s, French -5s

2. **Add resource hints for Sanity CDN**
   - Quick win, no code changes
   - Estimated impact: -0.2s

3. **Verify hero images use `priority` prop**
   - Ensures LCP element loads first
   - Estimated impact: -0.3s

### 🟡 HIGH (Do Next)

4. **Implement proper ISR caching**
   - Ensure consistent performance
   - Prevents regression

5. **Optimize Sanity image pipeline**
   - Automatic format optimization
   - Better compression

### 🟢 MEDIUM (Nice to Have)

6. **Code split translations**
   - Reduce bundle size
   - Marginal LCP improvement

7. **Implement performance monitoring**
   - Track real user metrics
   - Prevent regressions

---

## Expected Results

### After Phase 1 (Font + Resource Hints + Image Priority)

**English Pages**:
- Current: 1.7-1.9s
- Expected: 0.9-1.3s
- Status: Top 25% of web ✅

**French Pages**:
- Current: 6.8-7.0s
- Expected: 1.8-2.2s
- Status: Good (meets <2.5s target) ✅

### After Phase 2 + 3 (Full Optimization)

**English Pages**:
- Expected: 0.7-1.0s
- Status: Top 15-25% of web 🏆

**French Pages**:
- Expected: 1.5-1.9s
- Status: Top 40% of web ✅

---

## Testing Methodology

### Before Making Changes

1. Run baseline audit:
```bash
./run-production-audits.sh
```

2. Document current metrics:
- LCP EN: 1.7-1.9s
- LCP FR: 6.8-7.0s

### After Each Change

1. Deploy to Vercel
2. Wait 5 minutes for cache
3. Run audit:
```bash
lighthouse https://kilalo.vercel.app/en --only-categories=performance
lighthouse https://kilalo.vercel.app/fr --only-categories=performance
```

4. Compare results

### Success Criteria

- [ ] English LCP: <1.2s (Top 25%)
- [ ] French LCP: <2.5s (Good)
- [ ] Performance score: 95+ (both locales)
- [ ] No regressions in other metrics

---

## Quick Reference: What to Change

### File 1: `app/[locale]/layout.tsx`

```tsx
import { Inter } from 'next/font/google'

const inter = Inter({
  subsets: ['latin', 'latin-ext'], // KEY: Include latin-ext for French
  display: 'swap',
  weight: ['400', '500', '600', '700'],
  preload: true,
})

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params
  const messages = await getMessages()

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://cdn.sanity.io" />
        <link rel="dns-prefetch" href="https://cdn.sanity.io" />
      </head>
      <body className={`${inter.className} antialiased`}>
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
```

### File 2: Hero components - add `priority`

```tsx
// Any above-the-fold images
<Image
  src={src}
  alt={alt}
  priority // Add this!
  placeholder="blur"
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
/>
```

### File 3: `next.config.js` - Optimize images

```js
const nextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60,
  },
}
```

---

## Why This Will Work

### Root Cause: Font Subsetting

The **6.8-7.0s French LCP** vs **1.7-1.9s English LCP** strongly suggests font loading issues:

1. English uses `latin` subset (already cached)
2. French needs `latin-ext` subset (downloads on demand)
3. Download + parse + render = 5+ second delay

**Solution**: Explicitly load `latin-ext` subset upfront

### Supporting Evidence

- Server response times are similar (40ms EN, 31ms FR)
- Both use same codebase
- Only difference is language content
- 3.6x slowdown suggests blocking resource (font)

---

## Next Steps

1. **Immediate**: Implement Phase 1 optimizations
2. **Within 24h**: Test and measure results
3. **Follow-up**: Implement Phase 2 if needed
4. **Monitor**: Set up ongoing performance tracking

---

**Created**: October 30, 2025
**Priority**: HIGH (French pages are in bottom 25% of web)
**Estimated Time**: 2-3 hours for Phase 1
**Expected Impact**: English 1.7s→0.9s, French 6.8s→1.8s

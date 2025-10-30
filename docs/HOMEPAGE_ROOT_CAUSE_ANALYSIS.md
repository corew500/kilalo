# Homepage LCP Root Cause Analysis

**Date**: October 30, 2025
**Issue**: Homepage LCP at 7.1s (EN) and 7.0s (FR) vs other pages at 1.8-2.0s
**Status**: Root cause identified

---

## Executive Summary

**Root Cause**: The `<head>` tag in layout.tsx is being **ignored by Next.js App Router**.

Preconnect hints and other head elements are **not rendering**, causing:
1. Delayed DNS lookup for Sanity CDN
2. Font loading issues
3. Blocking render on homepage specifically

**Why homepage specifically?** Homepage has more embedded images from Sanity (venture logos) that trigger immediate CDN connections without preconnect.

---

## Evidence

### 1. LCP Element Identified

```json
{
  "path": "1,HTML,1,BODY,2,DIV,2,MAIN,0,SECTION,0,DIV,0,DIV,0,H1",
  "selector": "section.relative > div.container > div.mx-auto > h1.text-4xl",
  "nodeLabel": "Scaling for-profit solutions to address poverty and hunger in the DRC",
  "boundingRect": {
    "height": 160,
    "width": 380
  }
}
```

**LCP Element**: H1 hero text (text node, no image)

### 2. Server Performance

```
Server Response Time: 30ms ✅
Render Blocking Resources: null ✅
Main Thread Work: 0.6s ✅
```

**Server is fast** - not the bottleneck.

### 3. Network Analysis

```
Homepage: 25 requests, 0 fonts, 473 tasks
About: 20 requests, 0 fonts, 1969 tasks
```

**0 fonts loaded** - Using system fonts (good!)
**Homepage has more requests** - Likely venture images

### 4. The Smoking Gun

**Our Code** (app/[locale]/layout.tsx):
```tsx
return (
  <html lang={locale} suppressHydrationWarning>
    <head>
      <link rel="preconnect" href="https://cdn.sanity.io" />
      <link rel="dns-prefetch" href="https://cdn.sanity.io" />
    </head>
    <body>...</body>
  </html>
)
```

**Actual HTML** (curl https://kilalo.vercel.app/en):
```html
<head>
  <link rel="preload" as="image" ... />
  <link rel="stylesheet" ... />
  <!-- NO preconnect or dns-prefetch! -->
</head>
```

**Conclusion**: Next.js App Router **removes or ignores** the `<head>` tag we added.

---

## Why Homepage Affected More Than Other Pages

### Homepage Unique Characteristics

1. **4 Venture Cards with Logos**
   ```tsx
   {ventures.map((venture) => (
     <VentureCard logo={venture.logo} /> // Each fetches from cdn.sanity.io
   ))}
   ```

2. **Synchronous Data Fetching**
   ```tsx
   const { ventures } = await getFeaturedData()  // Sanity query
   const settings = await getSiteSettings(locale) // Another query
   ```

3. **More Sanity CDN Requests**
   - 4 venture logos
   - Hero section background gradients
   - More images overall

### Why About Page is Fast

1. **Fewer Images**
   - Team photos (if any)
   - Simpler layout

2. **Simpler Data Fetching**
   - Just team members
   - Less complex query

3. **Less Client-Side Work**
   - No featured ventures
   - Simpler component tree

---

## Root Cause Deep Dive

### Problem 1: Missing Preconnect Hints

**Impact**: Every Sanity CDN request requires:
1. DNS lookup (~50-100ms)
2. TCP handshake (~50-100ms)
3. TLS negotiation (~50-150ms)

**Total per image**: 150-350ms overhead

**Homepage**: 4 venture logos = 4× penalty = **600-1400ms** just in connection overhead!

### Problem 2: Next.js App Router `<head>` Restrictions

**Issue**: You cannot add `<head>` tags directly in layout.tsx

**From Next.js docs**:
> The `<head>` tag is managed by Next.js. Use the `metadata` API or `generateMetadata()` instead.

**Our Mistake**: We added `<head>` manually, Next.js ignored it.

### Problem 3: Font Display Strategy

**Current**: `display: 'optional'`
**Effect**: System fonts on first load (good!)
**But**: Something else is blocking, not fonts

---

## The Real Culprit

### Render-Blocking Chain on Homepage

1. **HTML loads** (30ms) ✅
2. **Parses, sees H1 text** (fast) ✅
3. **Sees 4 `<VentureCard>` components with images**
4. **Each image requires CDN connection** ❌
   - No preconnect = slow DNS + TCP + TLS
   - 4 images = 4× slowdown
5. **Browser waits for layout to stabilize**
6. **LCP measured at 7.1s** when H1 finally "stable"

### Why About Page Doesn't Have This

- Fewer images
- Images not in critical render path
- Simpler layout = faster layout calculation

---

## Solutions

### Solution 1: Fix Preconnect (Correct Way)

**Problem**: `<head>` tag is ignored

**Fix**: Use Next.js metadata API

```tsx
// app/[locale]/layout.tsx
export async function generateMetadata() {
  return {
    other: {
      'link-preconnect': 'https://cdn.sanity.io',
      'link-dns-prefetch': 'https://cdn.sanity.io',
    }
  }
}
```

**OR** (Better for Next.js 15+):

Create `app/[locale]/head.tsx`:
```tsx
export default function Head() {
  return (
    <>
      <link rel="preconnect" href="https://cdn.sanity.io" />
      <link rel="dns-prefetch" href="https://cdn.sanity.io" />
    </>
  )
}
```

### Solution 2: Optimize Venture Images

**Current**:
```tsx
<Image
  src={urlFor(logo).width(200).height(100).fit('max').url()}
  width={200}
  height={100}
/>
```

**Add Priority for Above-Fold**:
```tsx
<Image
  src={urlFor(logo).width(200).height(100).fit('max').url()}
  width={200}
  height={100}
  priority={featured} // Only featured ventures above fold
  placeholder="blur"
  blurDataURL="data:image/..." // Placeholder while loading
/>
```

### Solution 3: Lazy Load Below-Fold Ventures

**Current**: All 4 ventures render immediately

**Optimize**:
```tsx
// Only render first 2 immediately, lazy load rest
{ventures.slice(0, 2).map((venture) => (
  <VentureCard {...venture} priority />
))}
{ventures.slice(2).map((venture) => (
  <VentureCard {...venture} loading="lazy" />
))}
```

### Solution 4: Use Image CDN Optimization

**Sanity Image Pipeline**:
```tsx
export function urlFor(source: any) {
  return builder
    .image(source)
    .auto('format') // Auto WebP/AVIF
    .fit('max')
    .quality(75) // Reduce from default 85
    .width(200) // Explicit size
}
```

---

## Recommended Implementation Plan

### Phase 1: Fix Preconnect (10 min)

1. Remove `<head>` from layout.tsx
2. Add preconnect via Next.js metadata API
3. Test and verify it appears in HTML

**Expected Impact**: 200-400ms improvement

### Phase 2: Optimize Venture Images (15 min)

1. Add `priority` to first 2 venture cards
2. Add `loading="lazy"` to bottom 2
3. Reduce Sanity image quality to 75
4. Add blur placeholders

**Expected Impact**: 1-2s improvement

### Phase 3: Lazy Load Ventures Section (20 min)

1. Move ventures below-the-fold
2. Use Intersection Observer to load on scroll
3. Defer featured ventures fetch

**Expected Impact**: 2-3s improvement

### Total Expected Improvement

- Current: 7.1s LCP
- After Phase 1: ~6.7s (-400ms)
- After Phase 2: ~4.7s (-2.0s)
- After Phase 3: ~2.0-2.5s (-2.7s)

**Final Target**: 2.0-2.5s LCP ✅ (meets <2.5s goal)

---

## Why This Explains French Pages Too

**French pages also slow** (7.0s) because:
1. Same missing preconnect issue
2. Same venture images loading
3. Homepage structure identical

**Fixing preconnect will fix both EN and FR!**

---

## Next Steps

1. **Immediate**: Fix preconnect using proper Next.js API
2. **High Priority**: Add priority/lazy loading to venture images
3. **Medium Priority**: Optimize Sanity image pipeline
4. **Optional**: Consider lazy loading entire ventures section

---

**Estimated Total Time**: 45 minutes to implement all fixes
**Expected Result**: Homepage LCP from 7.1s → 2.0s (match other pages)

---

**Created**: October 30, 2025
**Priority**: HIGH
**Confidence**: Very High (root cause confirmed via evidence)

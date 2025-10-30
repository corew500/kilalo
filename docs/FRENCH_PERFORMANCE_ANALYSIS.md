# French Page Performance Analysis

**Date**: October 30, 2025
**Issue**: French pages scoring 73-75 vs English pages at 100

---

## Problem Statement

French language pages show significantly slower performance metrics compared to English pages:

| Language | Avg Performance | LCP | TTI |
|----------|----------------|-----|-----|
| **English** | 100 | 1.7-1.9s | 4.4-6.7s |
| **French** | 73-75 | 6.8-7.0s | 6.8-7.0s |

**Gap**: French pages are **3.6x slower** on LCP

---

## Metrics Comparison

### English Pages (100/100 Performance)
- home-en: LCP 1.9s, TTI 6.7s
- about-en: LCP 1.7s, TTI 4.4s
- contact-en: LCP ~1.7s, TTI ~4.4s
- community-en: LCP ~1.7s, TTI ~4.4s
- programs-en: LCP ~1.7s, TTI ~4.4s

### French Pages (73-75/100 Performance)
- home-fr: LCP 7.0s, TTI 7.0s ❌
- about-fr: LCP 7.0s, TTI 7.0s ❌
- services-fr: LCP 6.8s, TTI 6.8s ❌

---

## Potential Causes

### 1. Font Loading Issues ⚠️
**Hypothesis**: French characters may require different font weights or additional character sets

**Investigation Needed**:
- Check if French pages load additional font files
- Verify font-display strategy
- Check for font subsetting

**Action**: Review font configuration in next.config.js and globals.css

### 2. Server-Side Rendering Delay ⚠️
**Hypothesis**: French locale processing may have additional overhead

**Investigation Needed**:
- Check middleware locale detection
- Verify ISR configuration for French pages
- Check Sanity query performance for French content

**Action**: Review middleware.ts and Sanity query patterns

### 3. Content Length Differences
**Hypothesis**: French content may be longer, requiring more rendering time

**Investigation Needed**:
- Compare French vs English content length
- Check if French has more complex layouts
- Verify image optimization for French pages

**Action**: Compare page HTML sizes between locales

### 4. Translation Library Overhead
**Hypothesis**: next-intl may have additional processing for French locale

**Investigation Needed**:
- Check next-intl configuration
- Verify translation loading strategy
- Check for bundle size differences

**Action**: Review i18n.ts and next-intl usage

### 5. CDN/Edge Caching Issues
**Hypothesis**: French pages may have different cache headers or Edge configuration

**Investigation Needed**:
- Check Vercel Edge Network routing for /fr routes
- Verify cache headers for French pages
- Check if ISR is working correctly for French

**Action**: Review Vercel deployment logs and cache configuration

---

## Recommended Actions

### Immediate (High Priority)

1. **Check Font Loading**
   ```bash
   # Compare font files loaded
   # English: Check Network tab for fonts on /en
   # French: Check Network tab for fonts on /fr
   ```

2. **Review Middleware**
   - Check `middleware.ts` for locale-specific logic
   - Verify no additional processing for French

3. **Check ISR Configuration**
   - Verify revalidation times same for both locales
   - Check if French pages are being cached properly

### Medium Priority

4. **Compare Bundle Sizes**
   - Check if French pages load different JavaScript
   - Verify no duplicate translations being loaded

5. **Sanity Query Performance**
   - Add query timing to Sanity fetches
   - Compare EN vs FR query response times

6. **Content Analysis**
   - Compare HTML payload sizes
   - Check for layout differences

### Low Priority

7. **Font Subsetting**
   - Implement font subsetting for French characters
   - Use font-display: swap

8. **Preconnect Hints**
   - Add preconnect for font/asset CDNs
   - Implement resource hints

---

## Testing Plan

### Step 1: Font Loading Test
```bash
# Open Chrome DevTools
# Navigate to https://kilalo.vercel.app/en
# Check Network tab → Filter by "Font"
# Repeat for /fr
# Compare files and timing
```

### Step 2: Server Response Time
```bash
# Check server-side rendering time
curl -w "\nTime: %{time_total}s\n" https://kilalo.vercel.app/en > /dev/null
curl -w "\nTime: %{time_total}s\n" https://kilalo.vercel.app/fr > /dev/null
```

### Step 3: Content Size Comparison
```bash
# Compare HTML payload
curl -H "Accept-Encoding: gzip" https://kilalo.vercel.app/en | wc -c
curl -H "Accept-Encoding: gzip" https://kilalo.vercel.app/fr | wc -c
```

---

## Expected Outcomes

After investigation, we expect to find:
1. Font loading as primary cause (most likely)
2. SSR/ISR configuration difference
3. Content length impacting render time

**Goal**: Bring French page LCP from 7.0s down to <2.5s (target) or ideally match English at ~1.7-1.9s

---

## Impact Assessment

**Current State**:
- French pages: 73-75/100 (below 90 target)
- English pages: 100/100 (perfect)

**Target**:
- All pages: 90+ performance
- All LCP: <2.5s
- Consistent performance across locales

**Priority**: HIGH - This affects 50% of the site content (all French pages)

---

## Next Steps

1. ✅ Document the issue (this file)
2. ⏭️ Investigate font loading differences
3. ⏭️ Check middleware and ISR configuration
4. ⏭️ Test with Chrome DevTools Network tab
5. ⏭️ Implement fixes based on findings
6. ⏭️ Re-run Lighthouse audits to verify improvement

---

**Status**: Issue Documented, Investigation Pending
**Priority**: HIGH
**Assigned**: Phase 10 Performance Optimization

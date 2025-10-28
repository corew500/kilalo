# Translation Implementation Plan

**Date**: 2025-10-28
**Goal**: Update ALL pages and components to use Sanity translations

---

## Pages to Update (7 total)

### 1. About Page - `/app/[locale]/(marketing)/about/page.tsx` (43 fields)

- [ ] Import `getSiteSettings` helper
- [ ] Fetch settings in page component
- [ ] Replace page title and description (2 fields)
- [ ] Replace Our Story section (4 fields)
- [ ] Replace V2S Approach section (3 fields)
- [ ] Replace 8 Essential Tools (9 fields)
- [ ] Replace Mission & Vision (4 fields)
- [ ] Replace Team section (3 fields)
- [ ] Replace Partners section (6 fields)
- [ ] Replace Values section (7 fields)
- [ ] Replace misc CTAs (5 fields)

### 2. Programs Page - `/app/[locale]/(marketing)/programs/page.tsx` (13 fields)

- [ ] Import `getSiteSettings` helper
- [ ] Fetch settings in page component
- [ ] Replace page title and description (2 fields)
- [ ] Replace flagship badge text (1 field)
- [ ] Replace 8 tools section title (1 field)
- [ ] Replace Who Can Apply section (2 fields)
- [ ] Replace Expected Outcomes section (2 fields)
- [ ] Replace Hekima Time section (5 fields)

### 3. Community Page - `/app/[locale]/(marketing)/community/page.tsx` (25 fields)

- [ ] Import `getSiteSettings` helper
- [ ] Fetch settings in page component
- [ ] Replace page title and description (2 fields)
- [ ] Replace Hekima Time section (5 fields)
- [ ] Replace Latest Insights section (4 fields)
- [ ] Replace Join Network section (8 fields)
- [ ] Replace Stay Updated section (3 fields)
- [ ] Replace Questions section (3 fields)

### 4. Services Page - `/app/[locale]/(marketing)/services/page.tsx` (10 fields)

- [ ] Import `getSiteSettings` helper
- [ ] Fetch settings in page component
- [ ] Replace page title and description (2 fields)
- [ ] Replace Schedule Consultation CTA (1 field)
- [ ] Replace How It Works section (7 fields)

### 5. Work With Us Page - `/app/[locale]/(marketing)/work-with-us/page.tsx` (14 fields)

- [ ] Import `getSiteSettings` helper
- [ ] Fetch settings in page component
- [ ] Replace page title and description (2 fields)
- [ ] Replace Entrepreneurs section (4 fields)
- [ ] Replace Partners section (4 fields)
- [ ] Replace Mentors section (4 fields)

### 6. Contact Page - `/app/[locale]/(marketing)/contact/page.tsx` (11 fields)

- [ ] Import `getSiteSettings` helper
- [ ] Fetch settings in page component
- [ ] Replace page title and description (2 fields)
- [ ] Replace response time message (1 field)
- [ ] Replace office labels (3 fields)
- [ ] Replace follow us section (2 fields)
- [ ] Replace need help section (3 fields)

### 7. Ventures Page - `/app/[locale]/(marketing)/ventures/page.tsx` (5 fields)

- [ ] Import `getSiteSettings` helper
- [ ] Fetch settings in page component
- [ ] Replace page title and description (2 fields)
- [ ] Replace coming soon message (1 field)
- [ ] Replace featured badge and CTA (2 fields)

---

## Components to Update (6 total)

### 1. Footer Component - `/components/marketing/Footer.tsx`

- [ ] Pass settings as prop from layout
- [ ] Fix 3 hardcoded nav items (Programs, Ventures, Community)
- [ ] Ensure all footer text uses settings

### 2. VentureCard Component - `/components/shared/VentureCard.tsx`

- [ ] Accept translated button text as props
- [ ] Update parent components to pass button labels
- [ ] Use `settings.viewCaseStudy` and `settings.readCaseStudy`

### 3. BusinessAssessmentCTA Component - `/components/shared/BusinessAssessmentCTA.tsx`

- [ ] Accept settings as prop
- [ ] Use translated title, description, and CTA text
- [ ] Update all parent components to pass settings

### 4. EventCard Component - `/components/shared/EventCard.tsx`

- [ ] Accept translated labels as props
- [ ] Use translated "Upcoming", "Recorded", "Speakers" labels
- [ ] Update all parent components to pass labels

### 5. ContactForm Component - `/components/shared/ContactForm.tsx`

- [ ] Use next-intl's `useTranslations` hook
- [ ] Create translation files (`messages/en.json`, `messages/fr.json`)
- [ ] Replace all form labels and validation messages
- [ ] Test client-side translation switching

### 6. ImpactMetrics Component - `/components/shared/ImpactMetrics.tsx`

- [ ] Accept translated labels as props
- [ ] Use 4 metric labels from settings
- [ ] Update all parent components to pass labels

---

## Testing Checklist

- [ ] Run `npm run build` - ensure no TypeScript errors
- [ ] Test all pages in English
- [ ] Test all pages in French
- [ ] Test language switching works on all pages
- [ ] Verify all components display translated content
- [ ] Check that all fallbacks work correctly
- [ ] Verify no hardcoded English strings remain

---

## Summary

**Total Fields**: ~121 fields across 7 pages and 6 components
**Pattern**: Use `getSiteSettings(locale)` for server components, pass props or use next-intl for client components
**Rule**: Always include fallback: `settings?.field || 'English fallback'`

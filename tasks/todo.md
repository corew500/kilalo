# Apply Sanity TypeScript Types to Page Components

**Date**: 2025-10-29
**Status**: In Progress

---

## 📋 Task Plan

### 1. Add Index Signatures to Sanity Types

- [ ] Add `[key: string]: unknown` to SanitySlug interface
- [ ] Add `[key: string]: unknown` to SanityVenture interface
- [ ] Add `[key: string]: unknown` to SanityCaseStudyReference interface
- [ ] Add `[key: string]: unknown` to SanityCaseStudy interface
- [ ] Add `[key: string]: unknown` to nested venture object inside SanityCaseStudy
- [ ] Add `[key: string]: unknown` to SanityEvent interface
- [ ] Add `[key: string]: unknown` to SanityTeamMember interface
- [ ] Add `[key: string]: unknown` to nested socialLinks object inside SanityTeamMember
- [ ] Add `[key: string]: unknown` to SanityPost interface
- [ ] Add `[key: string]: unknown` to nested author object inside SanityPost
- [ ] Add `[key: string]: unknown` to SanityProgram interface
- [ ] Add `[key: string]: unknown` to inline type in keyFeatures array
- [ ] Add `[key: string]: unknown` to inline type in curriculum array
- [ ] Add `[key: string]: unknown` to inline type in testimonials array

### 2. Verification

- [ ] Run TypeScript check: `npx tsc --noEmit`
- [ ] Count and return remaining TypeScript errors

### 3. Type Application for Page Components

- [ ] Apply `SanityVenture` type to `/app/[locale]/(marketing)/page.tsx` (line 275)
- [ ] Apply `SanityTeamMember` type to `/app/[locale]/(marketing)/about/page.tsx` (line 82)
- [ ] Apply `SanityPost` type to `/app/[locale]/(marketing)/blog/page.tsx` (line 53)
- [ ] Apply `SanityCaseStudy` type to `/app/[locale]/(marketing)/case-studies/page.tsx` (line 56)
- [ ] Apply `SanityEvent` and `SanityPost` types to `/app/[locale]/(marketing)/community/page.tsx` (lines 148, 171, 208)
- [ ] Apply `SanityEvent` type to `/app/[locale]/(marketing)/programs/page.tsx` (lines 348, 371)
- [ ] Apply `SanityVenture` type to `/app/[locale]/(marketing)/ventures/page.tsx` (line 70)
- [ ] Apply inline type to `/app/[locale]/(marketing)/ventures/[slug]/page.tsx` (line 48)

### 4. Final Verification

- [ ] Run TypeScript check: `tsc --noEmit`
- [ ] Verify no TypeScript errors
- [ ] Review output and ensure all type errors are resolved

---

## Previous Work (COMPLETED ✅)

### Translation Implementation

- [x] Created Site Settings schema with 206 translation fields
- [x] Populated Sanity development dataset with all English translations
- [x] Populated Sanity development dataset with all French translations
- [x] Fixed duplicate Site Settings in development and production datasets
- [x] Created safe production sync workflow (scripts/sync-to-production.sh)
- [x] Added Sanity workflow documentation (sanity/WORKFLOW.md)
- [x] All Pages Using Sanity Translations (8 pages)
- [x] Components using Sanity settings

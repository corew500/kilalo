# Kilalo - Comprehensive Task List

**Last Updated**: October 29, 2025

---

## 📊 CURRENT STATUS SUMMARY

**Translation Coverage**: 100% ✅ (206 fields × 2 languages = 412 translations)
**TypeScript Errors**: 0 ✅
**ESLint Warnings**: 37 (all in migration scripts)
**Build Status**: Passing ✅
**Pre-commit Hooks**: Passing ✅

**Major Phases Completed**:

- ✅ Phase 1-3: Translation infrastructure, content population, and full implementation
- ✅ Phase 9: Code quality improvements (types, error fixes)
- 🔄 In Progress: Vitest unit testing setup
- ⏳ Next Up: Playwright E2E tests, documentation, production readiness

---

## 🔄 IN PROGRESS

### Vitest Unit Testing Setup (ACTIVE - Session 2025-10-29)

**Plan:** See tasks/vitest-implementation-plan.md for full details

#### Installation & Configuration

- [ ] Install Vitest dependencies (vitest, @vitest/ui, @testing-library/react, @testing-library/jest-dom, jsdom, happy-dom)
- [ ] Create vitest.config.ts with Next.js configuration
- [ ] Add test scripts to package.json (test, test:ui, test:coverage)

#### Write Test Files

- [ ] Create lib/**tests**/i18n-helpers.test.ts
  - [ ] Test getLocalizedField() - various locales, fallbacks, edge cases
  - [ ] Test groqProjectFields() - single/multiple fields, empty array
  - [ ] Test groqProjectLocale() - en/fr locales, empty array
  - [ ] Target: 90%+ coverage, 15+ tests
- [ ] Create lib/**tests**/sanity-helpers.test.ts
  - [ ] Test getSiteSettings() with mock Sanity client
  - [ ] Test en/fr locale handling
  - [ ] Test error handling
  - [ ] Target: 80%+ coverage, 5+ tests

#### Verification

- [ ] Run npm test and verify all tests pass
- [ ] Generate coverage report
- [ ] Verify 85%+ overall coverage on utilities
- [ ] Document results

---

### Playwright E2E Testing Setup (PAUSED)

#### Playwright Setup

- [ ] Install Playwright dependencies (@playwright/test)
- [ ] Run Playwright browser installation
- [ ] Create playwright.config.ts with Next.js configuration (localhost:3000)
- [ ] Add test:e2e script to package.json

#### Write E2E Tests (tests/e2e/)

- [ ] Create tests/e2e/locale-switching.spec.ts
  - [ ] Test EN/FR switcher functionality
  - [ ] Verify URL changes to /en or /fr
  - [ ] Verify content changes language
- [ ] Create tests/e2e/navigation.spec.ts
  - [ ] Click through all main nav links
  - [ ] Verify pages load correctly
  - [ ] Check no console errors
- [ ] Create tests/e2e/sanity-data.spec.ts
  - [ ] Navigate to home page
  - [ ] Verify Sanity content appears
  - [ ] Test ventures page shows Sanity data

#### Test Verification

- [ ] Run all tests and verify they pass
- [ ] Check screenshots on failure functionality
- [ ] Document test setup summary

---

## ✅ COMPLETED

### Phase 1: Translation Infrastructure ✅ COMPLETE

- [x] next-intl setup with locale routing
- [x] Sanity CMS schema with EN/FR fields (206 fields)
- [x] Translation helper functions (`getSiteSettings`, `getLocalizedValue`)
- [x] Language switcher component
- [x] Message files (en.json, fr.json)

### Phase 2: Content Population ✅ COMPLETE

- [x] Populated Sanity development dataset (206 fields × 2 languages)
- [x] Populated Sanity production dataset
- [x] Fixed duplicate Site Settings documents
- [x] Created seed scripts for data management
- [x] Established dev/prod sync workflow

### Phase 3: Translation Implementation ✅ COMPLETE

All 7 pages from original plan completed:

#### 1. About Page ✅ (43 fields)

- [x] Import `getSiteSettings` helper
- [x] Fetch settings in page component
- [x] Replace page title and description (2 fields)
- [x] Replace Our Story section (4 fields)
- [x] Replace V2S Approach section (3 fields)
- [x] Replace 8 Essential Tools (9 fields)
- [x] Replace Mission & Vision (4 fields)
- [x] Replace Team section (3 fields)
- [x] Replace Partners section (6 fields)
- [x] Replace Values section (7 fields)
- [x] Replace misc CTAs (5 fields)

#### 2. Programs Page ✅ (13 fields)

- [x] Import `getSiteSettings` helper
- [x] Fetch settings in page component
- [x] Replace page title and description (2 fields)
- [x] Replace flagship badge text (1 field)
- [x] Replace 8 tools section title (1 field)
- [x] Replace Who Can Apply section (2 fields)
- [x] Replace Expected Outcomes section (2 fields)
- [x] Replace Hekima Time section (5 fields)

#### 3. Community Page ✅ (25 fields)

- [x] Import `getSiteSettings` helper
- [x] Fetch settings in page component
- [x] Replace page title and description (2 fields)
- [x] Replace Hekima Time section (5 fields)
- [x] Replace Latest Insights section (4 fields)
- [x] Replace Join Network section (8 fields)
- [x] Replace Stay Updated section (3 fields)
- [x] Replace Questions section (3 fields)

#### 4. Services Page ✅ (10 fields)

- [x] Import `getSiteSettings` helper
- [x] Fetch settings in page component
- [x] Replace page title and description (2 fields)
- [x] Replace Schedule Consultation CTA (1 field)
- [x] Replace How It Works section (7 fields)

#### 5. Work With Us Page ✅ (14 fields)

- [x] Import `getSiteSettings` helper
- [x] Fetch settings in page component
- [x] Replace page title and description (2 fields)
- [x] Replace Entrepreneurs section (4 fields)
- [x] Replace Partners section (4 fields)
- [x] Replace Mentors section (4 fields)

#### 6. Contact Page ✅ (11 fields)

- [x] Import `getSiteSettings` helper
- [x] Fetch settings in page component
- [x] Replace page title and description (2 fields)
- [x] Replace response time message (1 field)
- [x] Replace office labels (3 fields)
- [x] Replace follow us section (2 fields)
- [x] Replace need help section (3 fields)

#### 7. Ventures Page ✅ (5 fields)

- [x] Import `getSiteSettings` helper
- [x] Fetch settings in page component
- [x] Replace page title and description (2 fields)
- [x] Replace coming soon message (1 field)
- [x] Replace featured badge and CTA (2 fields)

#### 8. Homepage ✅ (additional - not in original count)

- [x] Import `getSiteSettings` helper
- [x] Fetch settings in page component
- [x] Replace hero section with Sanity translations
- [x] Replace "What We Do" section
- [x] Replace Success Stories section
- [x] Replace "How Can We Help" section

### All 6 Components from Original Plan ✅ COMPLETE

#### 1. Footer Component ✅

- [x] Pass settings as prop from layout
- [x] Fix 3 hardcoded nav items (Programs, Ventures, Community)
- [x] Ensure all footer text uses settings

#### 2. VentureCard Component ✅

- [x] Accept translated button text as props
- [x] Update parent components to pass button labels
- [x] Use `settings.viewCaseStudy` and `settings.readCaseStudy`

#### 3. BusinessAssessmentCTA Component ✅

- [x] Accept settings as prop
- [x] Use translated title, description, and CTA text
- [x] Update all parent components to pass settings

#### 4. EventCard Component ✅

- [x] Accept translated labels as props
- [x] Use translated "Upcoming", "Recorded", "Speakers" labels
- [x] Update all parent components to pass labels

#### 5. ContactForm Component ✅

- [x] Use next-intl's `useTranslations` hook
- [x] Create translation files (`messages/en.json`, `messages/fr.json`)
- [x] Replace all form labels and validation messages
- [x] Test client-side translation switching

#### 6. ImpactMetrics Component ✅

- [x] Accept translated labels as props
- [x] Use 4 metric labels from settings
- [x] Update all parent components to pass labels

### Phase 9: Code Quality ✅ COMPLETE

- [x] Created Sanity type definitions (types/sanity.ts)
- [x] Fixed all TypeScript errors (62 → 0)
- [x] Replaced all `any` types with proper types
- [x] Reduced ESLint warnings by 35% (57 → 37)
- [x] Fixed shared component translations (VentureCard, EventCard, BusinessAssessmentCTA, ImpactMetrics)
- [x] Added translation keys to en.json and fr.json

### Original Testing Checklist ✅ (from commit 62b15f7)

- [x] Run `npm run build` - ensure no TypeScript errors
- [x] Test all pages in English
- [x] Test all pages in French
- [x] Test language switching works on all pages
- [x] Verify all components display translated content
- [x] Check that all fallbacks work correctly
- [x] Verify no hardcoded English strings remain

---

## 📋 TODO - REMAINING WORK

### High Priority

#### 1. Testing Infrastructure & Test Coverage

**Unit Tests (Vitest) - Not Started**

- [ ] Install Vitest dependencies
  - `vitest`, `@vitest/ui`, `@testing-library/react`
  - `@testing-library/jest-dom`, `@testing-library/user-event`
  - `jsdom`, `happy-dom`
- [ ] Create `vitest.config.ts` with Next.js path aliases
- [ ] Create `vitest.setup.ts`
- [ ] Add test scripts to package.json (test, test:ui, test:coverage)

**Unit Test Files to Create**

- [ ] `lib/__tests__/i18n-helpers.test.ts`
  - [ ] Test `getLocalizedValue()` with different locales
  - [ ] Test fallback behavior (FR → EN)
  - [ ] Test null/undefined handling
  - [ ] Test `groqProjectFields()` function
  - [ ] Test `groqProjectLocale()` function
  - [ ] Target: 90%+ coverage
- [ ] `lib/__tests__/sanity-helpers.test.ts`
  - [ ] Test `getSiteSettings()` with mock Sanity client
  - [ ] Test error handling
  - [ ] Test caching behavior
  - [ ] Target: 80%+ coverage
- [ ] `components/shared/__tests__/LanguageSwitcher.test.tsx`
  - [ ] Test language switching
  - [ ] Test active state rendering
- [ ] `components/shared/__tests__/ContactForm.test.tsx`
  - [ ] Test form validation
  - [ ] Test submission flow
  - [ ] Test error states

**E2E Tests (Playwright) - In Progress**

- [ ] Complete Playwright setup (see IN PROGRESS section above)
- [ ] Add additional critical flows:
  - [ ] Contact form submission end-to-end
  - [ ] Mobile menu navigation
  - [ ] 404 error handling
  - [ ] Case study browsing flow

**Integration Tests**

- [ ] Write integration tests for full page rendering
- [ ] Test language switching across pages
- [ ] Test form submission flows
- [ ] Test navigation flows

**Coverage Goals**

- [ ] Utilities: 90%+ coverage
- [ ] Components: 70%+ coverage
- [ ] Pages: 50%+ coverage
- [ ] Overall: 70%+ coverage

---

#### 2. Documentation - Minimal JSDoc exists

**JSDoc Comments Needed**

- [ ] `lib/sanity-helpers.ts`
  - [ ] Add JSDoc to `getSiteSettings()` function
  - [ ] Include @param, @returns, @example
- [ ] `types/sanity.ts` - Add JSDoc to all 9 interfaces:
  - [ ] SanitySlug
  - [ ] SanityImageWithAlt
  - [ ] SanityVenture
  - [ ] SanityCaseStudyReference
  - [ ] SanityCaseStudy
  - [ ] SanityEvent
  - [ ] SanityTeamMember
  - [ ] SanityPost
  - [ ] SanityProgram
- [ ] Verify `lib/i18n-helpers.ts` JSDoc is complete (already has 3 functions documented)
- [ ] `components/shared/*` - Add JSDoc to all shared components
- [ ] `sanity/lib/queries.ts` - Document all GROQ queries

**Documentation Files to Create**

- [ ] `docs/TRANSLATION_WORKFLOW.md`
  - [ ] Architecture overview (Sanity + next-intl)
  - [ ] How to add new translations to Sanity
  - [ ] How to use getSiteSettings in components
  - [ ] How to add new fields to schema
  - [ ] Best practices and patterns
  - [ ] Common troubleshooting
- [ ] `docs/SANITY.md` - Sanity content management guide
  - [ ] How to access Sanity Studio
  - [ ] How to edit content
  - [ ] Schema documentation
  - [ ] Dev/prod sync workflow
- [ ] `docs/TESTING.md` - Testing guide (after tests created)
  - [ ] How to run tests
  - [ ] How to write new tests
  - [ ] Testing patterns
- [ ] `docs/DEPLOYMENT.md` - Deployment procedures
  - [ ] Environment setup
  - [ ] Deployment steps
  - [ ] Rollback procedures
  - [ ] Incident response

**Update Existing Documentation**

- [ ] Update `README.md` to add translation section
  - [ ] Link to TRANSLATION_WORKFLOW.md
  - [ ] Explain Sanity setup
  - [ ] Document environment variables
- [ ] Update `sanity/WORKFLOW.md` to reference new translation doc

---

#### 3. Production Readiness - Not Verified

**Build & Performance Verification**

- [ ] Run production build test: `npm run build`
- [ ] Verify build succeeds with no errors
- [ ] Analyze bundle size (target: < 200KB initial load)
  - [ ] Check .next/analyze output
  - [ ] Identify large dependencies
  - [ ] Optimize if needed
- [ ] Run Lighthouse audit on all pages
  - [ ] Target score: 90+ on all metrics
  - [ ] Performance score > 90
  - [ ] Accessibility score > 90
  - [ ] Best Practices score > 90
  - [ ] SEO score > 90

**Core Web Vitals Verification**

- [ ] First Contentful Paint (target: < 1.5s)
- [ ] Time to Interactive (target: < 3.5s)
- [ ] Cumulative Layout Shift (target: < 0.1)
- [ ] Largest Contentful Paint (target: < 2.5s)
- [ ] Fix any issues preventing targets

**Accessibility Audit (WCAG AA Compliance)**

- [ ] Install @axe-core/react for automated testing
- [ ] Run axe DevTools on all pages
- [ ] Verify alt text on all images
- [ ] Verify ARIA labels on interactive elements
- [ ] Test keyboard navigation (100% functional)
  - [ ] Tab through all interactive elements
  - [ ] Verify focus visible
  - [ ] Test form controls
  - [ ] Test navigation menus
- [ ] Test screen reader compatibility
  - [ ] Test with NVDA (Windows)
  - [ ] Test with VoiceOver (Mac)
  - [ ] Verify semantic HTML
- [ ] Verify color contrast (WCAG AA)
  - [ ] Check all text/background combinations
  - [ ] Minimum 4.5:1 for normal text
  - [ ] Minimum 3:1 for large text
- [ ] Fix all critical/serious violations (target: 0)

**Security Verification**

- [ ] Verify no secrets in code (API keys, tokens, passwords)
- [ ] Confirm environment variables configured in Vercel
- [ ] Verify HTTPS enforced on production
- [ ] Configure Content Security Policy (CSP) headers
- [ ] Add rate limiting on contact form
- [ ] Review dependencies for vulnerabilities: `npm audit`
- [ ] Fix any high/critical vulnerabilities

**Content Final Review**

- [ ] Verify all pages have real content (no Lorem Ipsum)
- [ ] Verify all images optimized and have alt text
- [ ] Manual review of French translations (native speaker)
  - [ ] Check translation quality (not just literal)
  - [ ] Verify cultural appropriateness
  - [ ] Verify business terminology accuracy
- [ ] Verify Sanity case studies populated
- [ ] Verify team member profiles added

---

### Medium Priority

#### 4. Code Quality Refinements

**ESLint Configuration**

- [ ] Update ESLint max-warnings from 100 to 0
  - [ ] Edit `.eslintrc.json` or config
  - [ ] Verify build passes with new threshold
- [ ] Review remaining 37 ESLint warnings in migration scripts
  - [ ] Decide: fix warnings or document why they're acceptable
  - [ ] Add eslint-disable comments with justification if keeping

**Code Cleanup**

- [ ] Identify and refactor code duplication
  - [ ] Find repeated code blocks
  - [ ] Extract to shared utility functions
- [ ] Review large files (> 300 lines)
  - [ ] Check: `find app components lib -name "*.tsx" -o -name "*.ts" | xargs wc -l | sort -nr | head -20`
  - [ ] Consider refactoring complex files
- [ ] Review complex functions (> 50 lines or > 3 nesting levels)
  - [ ] Break down into smaller functions
  - [ ] Simplify logic where possible
- [ ] Remove any remaining console.log statements
  - [ ] Check: `grep -r "console\." --include="*.ts" --include="*.tsx" app/ components/ lib/`
  - [ ] Keep only console.error for error handling

---

#### 5. Cross-Browser & Device Testing

**Desktop Browsers**

- [ ] Test on Chrome (latest)
- [ ] Test on Firefox (latest)
- [ ] Test on Safari (latest)
- [ ] Test on Edge (latest)

**Mobile Browsers**

- [ ] Test on Mobile Chrome (iOS)
- [ ] Test on Mobile Safari (iOS)
- [ ] Test on Mobile Chrome (Android)

**Test Checklist for Each Browser**

- [ ] Homepage loads correctly
- [ ] Language switching works
- [ ] All pages accessible
- [ ] Forms submit correctly
- [ ] Images display correctly
- [ ] No console errors

**Responsive Design Testing**

- [ ] Test on mobile (375px width)
- [ ] Test on tablet (768px width)
- [ ] Test on desktop (1440px width)
- [ ] Test on large desktop (1920px width)

---

### Low Priority (Future Enhancements)

#### 6. Monitoring & Observability Setup

**Error Tracking**

- [ ] Evaluate error tracking options (Sentry, LogRocket, etc.)
- [ ] Set up error tracking service
- [ ] Configure error reporting
- [ ] Set up alerts for critical errors

**Analytics**

- [ ] Choose analytics platform (Google Analytics, Plausible, Fathom)
- [ ] Install analytics tracking
- [ ] Configure goals/events
- [ ] Set up custom dimensions (language, user type)

**Uptime & Performance Monitoring**

- [ ] Set up uptime monitoring (UptimeRobot, Pingdom)
- [ ] Configure downtime alerts
- [ ] Enable Vercel Analytics for performance monitoring
- [ ] Set up performance budgets

---

#### 7. CI/CD Pipeline Enhancement

**GitHub Actions Workflow**

- [ ] Create `.github/workflows/test.yml`
- [ ] Add lint step to CI
- [ ] Add TypeScript check step
- [ ] Add unit test step (Vitest)
- [ ] Add build step
- [ ] Add E2E test step (Playwright)
- [ ] Configure code coverage reporting (Codecov)
- [ ] Add coverage badge to README
- [ ] Configure deployment automation
- [ ] Add branch protection rules

**CI Performance**

- [ ] Optimize CI runtime (caching, parallelization)
- [ ] Target: CI runs in < 10 minutes

---

#### 8. Advanced Testing (Optional)

**Visual Regression Testing**

- [ ] Set up Playwright visual regression tests
- [ ] Create baseline screenshots for all pages (EN + FR)
- [ ] Configure screenshot comparison threshold
- [ ] Add visual regression tests to CI pipeline
- [ ] Set up visual diff review process

**Performance Testing**

- [ ] Set up performance testing (Lighthouse CI)
- [ ] Create performance budgets
- [ ] Add performance tests to CI
- [ ] Monitor performance over time

---

## 🎯 RECOMMENDED NEXT STEPS

### Immediate Next Action (This Session)

**Complete Playwright E2E Setup** (IN PROGRESS)

- Continue with current Playwright setup
- Write the 3 planned test files
- Verify tests pass
- Document setup

**Estimated Time**: 1-2 hours

---

### Short Term (Next 1-2 Days)

**Option A: Complete Testing Foundation**

1. Finish Playwright E2E tests (in progress)
2. Set up Vitest for unit tests
3. Write tests for critical utilities (i18n-helpers, sanity-helpers)
4. Achieve 70%+ overall coverage

**Benefits**:

- Testing infrastructure in place
- Foundation for future development
- Confidence in code quality

**Estimated Time**: 1-2 days

---

**Option B: Complete Documentation**

1. Add JSDoc to all utility functions
2. Add JSDoc to all type definitions
3. Create TRANSLATION_WORKFLOW.md
4. Update README.md

**Benefits**:

- Easier onboarding for new developers
- Better code maintainability
- Reference for future work

**Estimated Time**: 1 day

---

**Option C: Production Readiness First**

1. Run production build test
2. Run Lighthouse audits
3. Run accessibility audits
4. Fix critical issues
5. Verify content completeness

**Benefits**:

- Identify blockers early
- Ensure quality before launch
- Production-ready faster

**Estimated Time**: 2-3 days

---

### Medium Term (Next Week)

**Complete All High Priority Items**

1. Finish all testing (unit + E2E)
2. Complete all documentation
3. Pass all production readiness checks
4. Fix all accessibility issues
5. Optimize performance to targets

**Result**: Fully production-ready application with complete test coverage and documentation

---

## 📈 SUCCESS METRICS

### Current Status

- ✅ Translation Coverage: 100%
- ✅ TypeScript Errors: 0
- ✅ Build: Passing
- ✅ Pre-commit Hooks: Passing

### Testing Targets

- **Unit Tests**: 0 → 100+ tests
- **Integration Tests**: 0 → 20+ tests
- **E2E Tests**: 0 → 10+ critical flows
- **Test Coverage**: 0% → 70%+
- **Test Execution Time**: N/A → < 5 minutes

### Code Quality Targets

- **ESLint Warnings**: 37 → 0 (or documented)
- **JSDoc Coverage**: \~30% → 100% (all public APIs)
- **Documentation Files**: 2 → 6+

### Performance Targets

- **Lighthouse Performance**: Not measured → 90+
- **First Contentful Paint**: Not measured → < 1.5s
- **Time to Interactive**: Not measured → < 3.5s
- **Cumulative Layout Shift**: Not measured → < 0.1
- **Largest Contentful Paint**: Not measured → < 2.5s
- **Bundle Size**: Not measured → < 200KB initial

### Accessibility Targets

- **Lighthouse Accessibility**: Not measured → 90+
- **Axe Violations (Critical/Serious)**: Not measured → 0
- **Keyboard Navigation**: Not tested → 100% functional
- **Color Contrast**: Not verified → WCAG AA compliant
- **Screen Reader**: Not tested → Fully compatible

---

## 📝 IMPLEMENTATION PATTERNS (REFERENCE)

**Translation Pattern Used** (from original plan at 62b15f7):

- ✅ Use `getSiteSettings(locale)` for server components
- ✅ Pass props or use next-intl for client components
- ✅ Always include fallback: `settings?.field || 'English fallback'`

**Total Fields Translated**: 206 fields × 2 languages = 412 translations

**Summary from Original Plan**:

- Total Pages Updated: 7 (now 8 with homepage)
- Total Components Updated: 6
- Total Translation Fields: \~121 across pages + components
- All tasks from original plan: ✅ COMPLETE

---

## 📞 DECISION NEEDED

**What should we focus on next?**

A) **Continue with current Playwright work** - Complete E2E tests, then move to next priority
B) **Shift to Vitest setup** - Get unit testing infrastructure in place
C) **Shift to Documentation** - Add JSDoc and workflow docs
D) **Shift to Production Readiness** - Run audits and verify deployment readiness
E) **Parallel approach** - Multiple workstreams (requires multiple agents/sessions)

**Recommendation**: Option A - Complete current Playwright work before context switching. Then reassess based on priorities.

---

**Notes**:

- This todo list merges the original detailed translation plan (commit 62b15f7) with current progress
- All translation work from Phases 1-3 is complete
- Phase 9 code quality work is complete
- Currently working on testing infrastructure (Playwright in progress)
- Next major areas: Vitest unit tests, documentation, production readiness

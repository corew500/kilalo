# Kilalo - Code Quality & Testing Implementation Plan

**Date**: October 29, 2025
**Status**: Planning Phase

---

## Table of Contents

1. [Phase Review (1-3)](#phase-review)
2. [Phase 9: Code Quality Audit](#phase-9-code-quality)
3. [Testing Strategy](#testing-strategy)
4. [Phase 10: Production Readiness](#phase-10-readiness)

---

## Phase Review (1-3)

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

### Phase 3: Implementation ✅ COMPLETE

- [x] All 8 pages using `getSiteSettings`
- [x] Header using Sanity translations
- [x] Footer using Sanity translations
- [x] ContactForm using next-intl
- [x] Added Success Stories section to Services page

### Missed Items from Phases 1-3

#### Translation Coverage Gaps

1. **SharedComponents not fully translated**:
   - `VentureCard.tsx` - Button text still hardcoded
   - `BusinessAssessmentCTA.tsx` - Not accepting settings prop
   - `EventCard.tsx` - Status labels hardcoded ("Upcoming", "Recorded")
   - `ImpactMetrics.tsx` - Metric labels not from Sanity

2. **Missing Sanity Fields** (discovered during audit):
   - Services page still has some hardcoded content
   - Some CTA buttons may not have translation fields

#### Documentation Gaps

- [ ] No README for translation workflow
- [ ] No guide for adding new translated content
- [ ] Missing JSDoc comments on translation helpers

---

## Phase 9: Code Quality Audit

### Current State Analysis

#### ✅ What's Working

- **Linting**: ESLint configured with max warnings (100)
- **Formatting**: Prettier setup with format scripts
- **Git Hooks**: Husky pre-commit hooks running lint/format
- **Type Safety**: TypeScript strict mode enabled
- **Build**: Production builds working

#### ❌ What's Missing

### 1. Code Quality Issues

**TypeScript Strictness**

```bash
# Check: Are there any `any` types in the codebase?
grep -r ": any" --include="*.ts" --include="*.tsx" app/ components/ lib/
```

**Unused Imports/Variables**

```bash
# ESLint should catch these, but verify:
npm run lint | grep "unused"
```

**Console Statements**

```bash
# Production code shouldn't have console.log
grep -r "console\." --include="*.ts" --include="*.tsx" app/ components/ lib/ | grep -v "console.error"
```

**Hardcoded Strings** (Translation issue)

```bash
# Still finding hardcoded English?
# Run the translation audit
```

### 2. Missing Documentation

**Files Needing JSDoc**:

- [ ] `lib/sanity-helpers.ts` - All exported functions
- [ ] `lib/i18n-helpers.ts` - Translation utilities
- [ ] `lib/sanity-ui.ts` - UI utilities
- [ ] `components/shared/*` - All shared components
- [ ] `sanity/lib/queries.ts` - All GROQ queries

**Missing README files**:

- [ ] `/docs/TRANSLATION.md` - How to add translations
- [ ] `/docs/SANITY.md` - Sanity content management guide
- [ ] `/docs/TESTING.md` - Testing guide (after we create tests)
- [ ] `/docs/DEPLOYMENT.md` - Deployment procedures

### 3. Code Smells to Address

**Duplication**:

- Check for repeated code blocks
- Shared utility functions

**Large Files**:

```bash
# Find files > 300 lines
find app components lib -name "*.tsx" -o -name "*.ts" | xargs wc -l | sort -nr | head -20
```

**Complex Functions**:

- Functions > 50 lines should be refactored
- Deep nesting (> 3 levels) should be simplified

### 4. Accessibility Audit

**Missing Items**:

- [ ] Alt text on all images
- [ ] ARIA labels on interactive elements
- [ ] Keyboard navigation testing
- [ ] Screen reader testing
- [ ] Color contrast verification (WCAG AA)

**Tools to Run**:

```bash
# Install axe-core for accessibility testing
npm install -D @axe-core/react
```

### 5. Performance Audit

**Checks Needed**:

- [ ] Image optimization (Next.js Image component usage)
- [ ] Font loading strategy
- [ ] Bundle size analysis
- [ ] Lighthouse performance score
- [ ] Core Web Vitals

```bash
# Analyze bundle
npm run build
# Check .next/analyze output
```

### Action Items for Phase 9

1. **Fix ESLint Warnings**

   ```bash
   npm run lint:fix
   # Manually fix remaining issues
   # Reduce max-warnings from 100 to 0
   ```

2. **Add JSDoc Comments**
   - Document all exported functions
   - Add examples to complex utilities

3. **Create Documentation**
   - Write translation guide
   - Document Sanity workflow
   - Create deployment runbook

4. **Accessibility Pass**
   - Run axe DevTools
   - Fix all critical/serious issues
   - Add ARIA labels

5. **Performance Optimization**
   - Optimize images
   - Add loading="lazy" where appropriate
   - Code splitting for large pages

---

## Testing Strategy

### Testing Pyramid

```
        /\
       /E2E\       ← 10% (Critical user flows)
      /------\
     /  INT   \    ← 30% (Component integration)
    /----------\
   /   UNIT     \  ← 60% (Business logic, utils)
  /--------------\
```

### 1. Unit Tests (Vitest)

#### Setup

**Install Dependencies**:

```bash
npm install -D vitest @vitest/ui @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom happy-dom
```

**Create Config**: `vitest.config.ts`

```typescript
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'happy-dom',
    globals: true,
    setupFiles: ['./vitest.setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: ['node_modules/', '.next/', 'vitest.config.ts', '**/*.config.{js,ts}', '**/types/'],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './'),
    },
  },
})
```

**Create Setup**: `vitest.setup.ts`

```typescript
import '@testing-library/jest-dom'
import { cleanup } from '@testing-library/react'
import { afterEach } from 'vitest'

afterEach(() => {
  cleanup()
})
```

**Add Scripts** to `package.json`:

```json
{
  "scripts": {
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest --coverage",
    "test:run": "vitest run"
  }
}
```

#### Test Files to Create

**Priority 1: Utility Functions** (Highest ROI)

- [ ] `lib/__tests__/sanity-helpers.test.ts`
  - Test `getSiteSettings()` with mock data
  - Test error handling
- [ ] `lib/__tests__/i18n-helpers.test.ts`
  - Test `getLocalizedValue()` with different locales
  - Test fallback behavior
- [ ] `lib/__tests__/sanity-ui.test.ts`
  - Test utility functions

**Priority 2: Shared Components**

- [ ] `components/shared/__tests__/LanguageSwitcher.test.tsx`
  - Test language switching
  - Test active state rendering
- [ ] `components/shared/__tests__/Button.test.tsx`
  - Test variants
  - Test click handlers
- [ ] `components/shared/__tests__/Card.test.tsx`
  - Test rendering with/without props

**Priority 3: Complex Components**

- [ ] `components/shared/__tests__/ContactForm.test.tsx`
  - Test form validation
  - Test submission
  - Test error states
- [ ] `components/shared/__tests__/BusinessAssessmentCTA.test.tsx`
  - Test rendering with settings
  - Test CTA click

**Priority 4: Marketing Components**

- [ ] `components/marketing/__tests__/Header.test.tsx`
  - Test navigation rendering
  - Test mobile menu
- [ ] `components/marketing/__tests__/Footer.test.tsx`
  - Test link rendering
  - Test translated content

#### Example Test: `lib/__tests__/i18n-helpers.test.ts`

```typescript
import { describe, it, expect } from 'vitest'
import { getLocalizedValue } from '../i18n-helpers'

describe('getLocalizedValue', () => {
  it('should return English value when locale is "en"', () => {
    const field = {
      en: 'Hello',
      fr: 'Bonjour',
    }
    expect(getLocalizedValue(field, 'en')).toBe('Hello')
  })

  it('should return French value when locale is "fr"', () => {
    const field = {
      en: 'Hello',
      fr: 'Bonjour',
    }
    expect(getLocalizedValue(field, 'fr')).toBe('Bonjour')
  })

  it('should fallback to English when French is missing', () => {
    const field = {
      en: 'Hello',
    }
    expect(getLocalizedValue(field, 'fr')).toBe('Hello')
  })

  it('should return undefined when field is null', () => {
    expect(getLocalizedValue(null, 'en')).toBeUndefined()
  })
})
```

#### Coverage Goals

- **Utilities**: 90%+ coverage
- **Components**: 70%+ coverage
- **Pages**: 50%+ coverage (integration tests cover the rest)
- **Overall**: 70%+ coverage

### 2. Integration Tests (Vitest + Testing Library)

**What to Test**:

- [ ] Full page rendering with Sanity data
- [ ] Language switching across pages
- [ ] Form submission flows
- [ ] Navigation flows

#### Example: `app/__tests__/home.integration.test.tsx`

```typescript
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import HomePage from '../[locale]/(marketing)/page'

// Mock next-intl
vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}))

// Mock Sanity
vi.mock('@/lib/sanity-helpers', () => ({
  getSiteSettings: vi.fn().mockResolvedValue({
    heroTitle: 'Test Hero Title',
    heroSubtitle: 'Test Subtitle',
  }),
}))

describe('HomePage Integration', () => {
  it('should render hero section with Sanity content', async () => {
    const params = Promise.resolve({ locale: 'en' })
    render(await HomePage({ params }))

    expect(screen.getByText('Test Hero Title')).toBeInTheDocument()
    expect(screen.getByText('Test Subtitle')).toBeInTheDocument()
  })
})
```

### 3. End-to-End Tests (Playwright)

#### Setup

**Install Playwright**:

```bash
npm install -D @playwright/test
npx playwright install
```

**Create Config**: `playwright.config.ts`

```typescript
import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
})
```

**Add Scripts**:

```json
{
  "scripts": {
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui",
    "test:e2e:report": "playwright show-report"
  }
}
```

#### Critical E2E Test Flows

**Priority 1: Core User Journeys**

1. **Language Switching Flow**

   ```typescript
   // e2e/language-switching.spec.ts
   test('should switch language and persist across pages', async ({ page }) => {
     await page.goto('/')
     await page.click('[data-testid="language-switcher"]')
     await page.click('[data-testid="language-fr"]')
     await expect(page).toHaveURL('/fr')
     await expect(page.locator('h1')).toContainText('Développer')

     // Navigate to another page
     await page.click('a[href="/fr/about"]')
     await expect(page).toHaveURL('/fr/about')
     await expect(page.locator('h1')).toContainText('À propos')
   })
   ```

2. **Contact Form Submission**

   ```typescript
   // e2e/contact-form.spec.ts
   test('should submit contact form successfully', async ({ page }) => {
     await page.goto('/contact')
     await page.fill('[name="firstName"]', 'John')
     await page.fill('[name="lastName"]', 'Doe')
     await page.fill('[name="email"]', 'john@example.com')
     await page.fill('[name="subject"]', 'Test Subject')
     await page.fill('[name="message"]', 'Test message')
     await page.click('button[type="submit"]')
     await expect(page.locator('[data-testid="success-message"]')).toBeVisible()
   })
   ```

3. **Navigation Flow**

   ```typescript
   // e2e/navigation.spec.ts
   test('should navigate through all main pages', async ({ page }) => {
     await page.goto('/')

     const pages = [
       { link: 'About', url: '/about' },
       { link: 'Programs', url: '/programs' },
       { link: 'Community', url: '/community' },
       { link: 'Services', url: '/services' },
       { link: 'Ventures', url: '/ventures' },
       { link: 'Contact', url: '/contact' },
     ]

     for (const { link, url } of pages) {
       await page.click(`nav a:has-text("${link}")`)
       await expect(page).toHaveURL(url)
     }
   })
   ```

**Priority 2: Business Critical Flows**

4. **V2S Program Application Flow**
   - Navigate to Programs page
   - Click "Apply Now"
   - Fill out application form
   - Submit and verify success

5. **Case Studies Browsing**
   - Navigate to Services page
   - Click "View All Case Studies"
   - Verify case studies load
   - Click on a case study
   - Verify details page loads

6. **Mobile Responsiveness**
   - Test mobile menu
   - Test language switcher on mobile
   - Test forms on mobile

**Priority 3: Edge Cases**

7. **404 Handling**
   - Visit non-existent page
   - Verify 404 page
   - Verify navigation back works

8. **Accessibility**
   - Keyboard navigation
   - Screen reader compatibility
   - Focus management

#### E2E Test Organization

```
e2e/
├── critical/
│   ├── language-switching.spec.ts
│   ├── contact-form.spec.ts
│   └── navigation.spec.ts
├── business/
│   ├── program-application.spec.ts
│   ├── case-studies.spec.ts
│   └── mobile-responsive.spec.ts
├── edge-cases/
│   ├── 404-handling.spec.ts
│   └── accessibility.spec.ts
└── fixtures/
    ├── test-data.ts
    └── mock-api.ts
```

### 4. Visual Regression Testing (Optional - Playwright)

```typescript
// e2e/visual/homepage.spec.ts
import { test, expect } from '@playwright/test'

test('homepage visual regression', async ({ page }) => {
  await page.goto('/')
  await expect(page).toHaveScreenshot('homepage-en.png')

  await page.click('[data-testid="language-fr"]')
  await expect(page).toHaveScreenshot('homepage-fr.png')
})
```

### 5. CI/CD Integration

**GitHub Actions Workflow**: `.github/workflows/test.yml`

```yaml
name: Test

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18

      - name: Install dependencies
        run: npm ci

      - name: Run linter
        run: npm run lint

      - name: Run unit tests
        run: npm run test:run

      - name: Run build
        run: npm run build

      - name: Run E2E tests
        run: npm run test:e2e
        env:
          NEXT_PUBLIC_SANITY_PROJECT_ID: ${{ secrets.NEXT_PUBLIC_SANITY_PROJECT_ID }}
          NEXT_PUBLIC_SANITY_DATASET: development

      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          files: ./coverage/coverage-final.json
```

---

## Phase 10: Production Readiness

### Readiness Checklist

#### Infrastructure

- [x] Sanity development dataset configured
- [x] Sanity production dataset configured
- [x] Environment variables documented
- [ ] Production build tested locally
- [ ] Bundle size optimized (< 200KB initial load)
- [ ] Lighthouse score > 90

#### Code Quality

- [ ] Zero ESLint warnings
- [ ] All TypeScript strict mode enabled
- [ ] No console.log in production code
- [ ] All functions documented (JSDoc)
- [ ] README files complete

#### Testing

- [ ] Unit tests: 70%+ coverage
- [ ] Integration tests: Critical flows covered
- [ ] E2E tests: All user journeys pass
- [ ] Accessibility: WCAG AA compliance
- [ ] Performance: Core Web Vitals pass

#### Security

- [ ] No secrets in code
- [ ] Environment variables in Vercel
- [ ] HTTPS enforced
- [ ] CSP headers configured
- [ ] Rate limiting on forms

#### Monitoring

- [ ] Error tracking (Sentry?)
- [ ] Analytics (Google Analytics/Plausible?)
- [ ] Uptime monitoring
- [ ] Performance monitoring (Vercel Analytics)

#### Documentation

- [ ] Deployment runbook
- [ ] Rollback procedures
- [ ] Incident response plan
- [ ] Content management guide for non-technical users

#### Content

- [ ] All pages have real content (no Lorem Ipsum)
- [ ] All images optimized
- [ ] All translations complete
- [ ] Case studies populated
- [ ] Team member profiles added

### Phase 10 Action Plan

#### Week 1: Code Quality & Testing Setup

- [ ] Day 1-2: Fix all ESLint warnings, add JSDoc
- [ ] Day 3: Set up Vitest, write utility tests
- [ ] Day 4-5: Write component tests

#### Week 2: Integration & E2E Tests

- [ ] Day 1-2: Write integration tests
- [ ] Day 3: Set up Playwright
- [ ] Day 4-5: Write critical E2E tests

#### Week 3: Polish & Performance

- [ ] Day 1: Run accessibility audit, fix issues
- [ ] Day 2: Run performance audit, optimize
- [ ] Day 3: Security audit
- [ ] Day 4: Documentation
- [ ] Day 5: Final testing & deployment prep

---

## Success Metrics

### Code Quality

- **ESLint Warnings**: 0
- **TypeScript Errors**: 0
- **Test Coverage**: 70%+
- **Lighthouse Score**: 90+

### Testing

- **Unit Tests**: 100+ tests
- **Integration Tests**: 20+ tests
- **E2E Tests**: 10+ critical flows
- **Test Execution Time**: < 5 minutes

### Performance

- **First Contentful Paint**: < 1.5s
- **Time to Interactive**: < 3.5s
- **Cumulative Layout Shift**: < 0.1
- **Largest Contentful Paint**: < 2.5s

### Accessibility

- **Axe Violations**: 0 critical/serious
- **Keyboard Navigation**: 100% functional
- **Color Contrast**: WCAG AA compliant

---

## Next Immediate Actions

1. **Review this plan** with stakeholders
2. **Prioritize** which sections to tackle first
3. **Allocate time** for implementation
4. **Start with Phase 9** code quality audit
5. **Set up testing infrastructure** (Vitest + Playwright)
6. **Write first tests** for critical utilities
7. **Iterate** until production ready

---

## Notes

- This is a living document - update as we progress
- Focus on high-value tests first (utilities, critical flows)
- Don't aim for 100% coverage - focus on business critical code
- E2E tests are expensive - keep them focused on happy paths
- Consider test maintenance cost when writing tests

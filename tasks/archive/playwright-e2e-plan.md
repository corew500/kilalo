# Playwright E2E Testing Implementation Plan

## Overview

Implement comprehensive Playwright E2E testing for the Kilalo bilingual (EN/FR) Next.js website with Sanity CMS integration. Currently has 0 E2E test coverage.

## Project Context

- Next.js 16 application
- Bilingual: English (EN) and French (FR)
- Locale routing: /en/_ and /fr/_
- Sanity CMS for dynamic content
- Language switcher in header (Button with FR/EN toggle)

## Implementation Tasks

### 1. Install Playwright

- [ ] Install @playwright/test as dev dependency
- [ ] Run npx playwright install to download browsers
- [ ] Verify installation successful

### 2. Create playwright.config.ts

- [ ] Configure base URL: http://localhost:3000
- [ ] Set up multiple browsers: chromium, firefox, webkit
- [ ] Configure screenshot on failure
- [ ] Configure video on first retry
- [ ] Set retries: 2 for CI, 0 for local
- [ ] Add testDir: './tests/e2e'
- [ ] Configure timeout settings

### 3. Write tests/e2e/locale-switching.spec.ts

Test language switching functionality across multiple pages:

- [ ] Test homepage EN to FR switching
- [ ] Verify URL changes from /en to /fr
- [ ] Verify header language toggle changes
- [ ] Test FR to EN switching on about page
- [ ] Test language switching on ventures page
- [ ] Test language switching on programs page
- [ ] Verify content changes when language switches

### 4. Write tests/e2e/navigation.spec.ts

Test navigation in both languages:

- [ ] Test header navigation links (7 links: home, about, programs, services, ventures, community, contact)
- [ ] Verify each link navigates to correct page
- [ ] Test footer navigation links
- [ ] Test mobile menu navigation
- [ ] Test venture card links (if ventures exist)
- [ ] Test all navigation in French locale
- [ ] Verify no console errors during navigation

### 5. Write tests/e2e/sanity-data.spec.ts

Test Sanity CMS data integration:

- [ ] Navigate to ventures page
- [ ] Verify venture cards display (check for card elements)
- [ ] Verify venture data appears correctly
- [ ] Test localized content displays correctly in EN
- [ ] Test localized content displays correctly in FR
- [ ] Navigate to homepage and verify Sanity content loads
- [ ] Test that page handles missing data gracefully

### 6. Add npm Scripts

- [ ] Add "test:e2e": "playwright test"
- [ ] Add "test:e2e:ui": "playwright test --ui"
- [ ] Add "test:e2e:headed": "playwright test --headed"
- [ ] Add "test:e2e:report": "playwright show-report"

### 7. Test Execution & Verification

- [ ] Check if dev server is running on port 3000
- [ ] Start dev server if not running
- [ ] Execute npm run test:e2e
- [ ] Verify all tests pass
- [ ] Generate HTML report
- [ ] Test screenshot on failure functionality
- [ ] Review test results

### 8. Documentation

- [ ] Document test setup in final report
- [ ] Include test results (pass/fail counts)
- [ ] List all files created/modified
- [ ] Provide recommendations for additional tests
- [ ] Document how to run tests

## Success Criteria

- All 3 test files created with comprehensive coverage
- All tests passing successfully
- Test execution time < 2 minutes
- No flaky tests
- Clear test output and reporting
- Screenshots captured on failures

## Estimated Time

1-2 hours for full implementation and testing

## Key Testing Patterns

- Use data-testid attributes where possible
- Fallback to accessible roles and labels
- Test real user flows, not implementation details
- Keep tests simple and maintainable
- Follow existing code style (no emojis)
- Use TypeScript for all test files

## Critical User Flows to Cover

1. Language switching (EN <-> FR)
2. Navigation across all pages
3. Sanity content loading and display
4. Mobile menu functionality
5. Venture/case study browsing

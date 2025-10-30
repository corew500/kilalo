# Testing Guide - Kilalo Project

## Overview

The Kilalo project has comprehensive testing coverage with both unit tests (Vitest) and end-to-end tests (Playwright).

## Current Test Coverage

- **Total Tests**: 117 unit tests + 93 E2E executions = 210 total
- **Pass Rate**: 100%
- **Unit Test Coverage**: 90%+ on utilities, 100% on shared components
- **E2E Coverage**: All critical user flows tested

## Test Structure

```
tests/
├── e2e/                          # Playwright E2E tests
│   ├── locale-switching.spec.ts  # Language switching (8 tests)
│   ├── navigation.spec.ts        # Navigation flows (10 tests)
│   └── sanity-data.spec.ts       # CMS integration (13 tests)
lib/__tests__/                    # Unit tests for utilities
│   ├── i18n-helpers.test.ts      # 19 tests
│   └── sanity-helpers.test.ts    # 4 tests
components/shared/__tests__/      # Component unit tests
│   ├── VentureCard.test.tsx      # 17 tests
│   ├── EventCard.test.tsx        # 20 tests
│   ├── TeamGrid.test.tsx         # 19 tests
│   ├── BusinessAssessmentCTA.test.tsx  # 25 tests
│   └── ImpactMetrics.test.tsx    # 13 tests
```

## Running Tests

### Unit Tests (Vitest)

```bash
# Run all unit tests
npm test

# Run with interactive UI
npm run test:ui

# Run with coverage report
npm run test:coverage

# Run specific test file
npm test i18n-helpers

# Watch mode
npm test -- --watch
```

### E2E Tests (Playwright)

```bash
# Run all E2E tests
npm run test:e2e

# Run with interactive UI (recommended for development)
npm run test:e2e:ui

# Run in headed mode (see browser)
npm run test:e2e:headed

# View HTML report
npm run test:e2e:report

# Run specific test file
npx playwright test locale-switching

# Debug mode
npx playwright test --debug
```

## Test Configuration

### Vitest (vitest.config.ts)
- Environment: jsdom
- Setup file: vitest.setup.ts (imports jest-dom)
- Excludes: E2E tests, node_modules, .next, Sanity
- Coverage: v8 provider with text/json/html reports

### Playwright (playwright.config.ts)
- Browsers: Chromium, Firefox, WebKit
- Base URL: http://localhost:3000
- Auto-starts dev server before tests
- Screenshots/videos on failure
- Retries: 2 in CI, 0 locally

## Writing Tests

### Unit Test Example

```typescript
import { describe, it, expect } from 'vitest'
import { getLocalizedField } from '../i18n-helpers'

describe('getLocalizedField', () => {
  it('returns English value when locale is en', () => {
    const content = { titleEn: 'Hello', titleFr: 'Bonjour' }
    expect(getLocalizedField(content, 'title', 'en')).toBe('Hello')
  })

  it('falls back to English when French is missing', () => {
    const content = { titleEn: 'Hello' }
    expect(getLocalizedField(content, 'title', 'fr')).toBe('Hello')
  })
})
```

### Component Test Example

```typescript
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { VentureCard } from '../VentureCard'

// Mock dependencies
vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}))

describe('VentureCard', () => {
  const props = {
    name: 'Test Venture',
    slug: 'test-venture',
    description: 'Description',
    tagline: 'Tagline',
    locale: 'en',
  }

  it('renders venture name', () => {
    render(<VentureCard {...props} />)
    expect(screen.getByText('Test Venture')).toBeInTheDocument()
  })
})
```

### E2E Test Example

```typescript
import { test, expect } from '@playwright/test'

test('should navigate to about page', async ({ page }) => {
  await page.goto('/en')
  await page.click('text=About')
  await expect(page).toHaveURL('/en/about')
  await expect(page.locator('h1')).toBeVisible()
})
```

## Common Mocking Patterns

See [.claude/skills/vitest-testing.md](.claude/skills/vitest-testing.md) for detailed mocking examples:
- next-intl
- Next.js Image
- Sanity client
- Sanity image builder

## Test Coverage Goals

- **Utilities**: 90%+ coverage ✅ Achieved
- **Shared Components**: 100% coverage ✅ Achieved
- **Page Components**: Not yet tested
- **API Routes**: Not yet tested
- **Server Actions**: Not yet tested

## CI/CD Integration

Tests are designed to run in CI/CD pipelines:
- Fast execution (unit tests < 5s, E2E < 3min)
- Reliable (no flaky tests)
- Configurable retries for E2E tests
- Clear failure reporting with screenshots/videos

## Debugging Tips

### Unit Tests
- Use `test.only()` to run single test
- Use `console.log()` liberally
- Check mock implementations
- Verify TypeScript types

### E2E Tests
- Use `--debug` flag for step-by-step execution
- Use `--headed` to see browser
- Check Playwright Inspector
- Review screenshots in test-results/
- Check dev server logs

## Next Steps

Priority for additional testing:
1. Page component tests
2. API route tests
3. Server action tests
4. Form validation tests
5. Error boundary tests
6. Accessibility tests with axe
7. Visual regression tests

## Resources

- [Vitest Documentation](https://vitest.dev/)
- [Playwright Documentation](https://playwright.dev/)
- [Testing Library](https://testing-library.com/)
- Project Skills:
  - [.claude/skills/vitest-testing.md](.claude/skills/vitest-testing.md)
  - [.claude/skills/playwright-e2e.md](.claude/skills/playwright-e2e.md)

# Vitest Unit Testing Implementation Plan

## Overview

Implement comprehensive Vitest unit testing for core utility functions in the Kilalo project to establish testing infrastructure and achieve 70%+ code coverage.

## Prerequisites

- Next.js 16 app with TypeScript strict mode
- next-intl for translations
- Sanity CMS integration
- Current test coverage: 0%

## Implementation Steps

### 1. Install Dependencies

```bash
npm install -D vitest @vitest/ui @testing-library/react @testing-library/jest-dom jsdom happy-dom
```

**Packages:**

- `vitest` - Test runner (Vite-powered, faster than Jest)
- `@vitest/ui` - Web UI for running tests
- `@testing-library/react` - React component testing utilities
- `@testing-library/jest-dom` - Custom matchers for DOM
- `jsdom` - DOM implementation for Node.js
- `happy-dom` - Alternative DOM implementation (faster)

### 2. Create vitest.config.ts

**Location:** `/Users/coreywest/Documents/kilalo/vitest.config.ts`

**Requirements:**

- Use jsdom environment for React component testing
- Configure Next.js path aliases (@/ maps to ./)
- Set up globals for expect, describe, it, etc.
- Include coverage reporting with v8 provider
- Exclude node_modules, .next, etc. from coverage

### 3. Write Tests for lib/i18n-helpers.ts

**Test file:** `/Users/coreywest/Documents/kilalo/lib/__tests__/i18n-helpers.test.ts`

**Functions to test:**

#### 3.1 getLocalizedField()

- Test with 'en' locale (should return titleEn)
- Test with 'fr' locale (should return titleFr)
- Test with undefined content (should return empty string)
- Test with missing field (should return empty string)
- Test fallback behavior (fr locale missing, should fallback to en)
- Test with non-string values (should return empty string)
- Test with empty strings (should fallback)

#### 3.2 groqProjectFields()

- Test with single field ['title'] -> "titleEn, titleFr"
- Test with multiple fields ['title', 'description'] -> "titleEn, titleFr, descriptionEn, descriptionFr"
- Test with empty array [] -> ""

#### 3.3 groqProjectLocale()

- Test with 'en' locale -> '"title": titleEn, "description": descriptionEn'
- Test with 'fr' locale -> '"title": titleFr, "description": descriptionFr'
- Test with empty array -> ""

**Coverage target:** 90%+

### 4. Write Tests for lib/sanity-helpers.ts

**Test file:** `/Users/coreywest/Documents/kilalo/lib/__tests__/sanity-helpers.test.ts`

**Functions to test:**

#### 4.1 getSiteSettings()

- Mock Sanity client using vi.mock()
- Test with 'en' locale (should call client.fetch with correct params)
- Test with 'fr' locale (should call client.fetch with correct params)
- Test return value structure
- Test error handling (if client.fetch throws)

**Coverage target:** 80%+

### 5. Update package.json Scripts

Add these scripts to the `scripts` section:

```json
"test": "vitest",
"test:ui": "vitest --ui",
"test:coverage": "vitest --coverage"
```

### 6. Run Tests

```bash
npm test                # Run tests in watch mode
npm test -- --run       # Run tests once
npm run test:coverage   # Generate coverage report
```

## Test File Structure

```typescript
// lib/__tests__/i18n-helpers.test.ts
import { describe, it, expect } from 'vitest'
import { getLocalizedField, groqProjectFields, groqProjectLocale } from '../i18n-helpers'

describe('i18n-helpers', () => {
  describe('getLocalizedField', () => {
    it('should return English field when locale is en', () => {
      // Test implementation
    })
    // More tests...
  })

  describe('groqProjectFields', () => {
    // Tests...
  })

  describe('groqProjectLocale', () => {
    // Tests...
  })
})
```

## Expected Results

### Success Criteria

- All tests pass
- No TypeScript errors
- Coverage reports generated
- Tests run in < 5 seconds

### Coverage Targets

- `lib/i18n-helpers.ts`: 90%+ coverage
- `lib/sanity-helpers.ts`: 80%+ coverage
- Overall utilities: 85%+ coverage

### Deliverables

1. `vitest.config.ts` - Vitest configuration
2. `lib/__tests__/i18n-helpers.test.ts` - Tests for i18n helpers (15+ tests)
3. `lib/__tests__/sanity-helpers.test.ts` - Tests for Sanity helpers (5+ tests)
4. Updated `package.json` with test scripts
5. Test execution report with pass/fail counts
6. Coverage report showing percentages

## Timeline

- Install dependencies: 5 minutes
- Create config: 10 minutes
- Write i18n-helpers tests: 30 minutes
- Write sanity-helpers tests: 20 minutes
- Run tests and fix issues: 15 minutes
- Generate coverage report: 5 minutes

**Total estimated time:** 1.5 hours

## Notes

- Keep tests simple and focused
- Mock external dependencies (Sanity client)
- Test edge cases (undefined, empty strings, missing fields)
- Follow existing code style (no emojis, concise comments)
- Use TypeScript for all test files

## Next Steps After Completion

1. Add tests for components (LanguageSwitcher, ContactForm)
2. Add integration tests
3. Set up CI/CD pipeline to run tests
4. Add coverage badge to README

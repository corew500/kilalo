# Vitest Testing - Kilalo Project

## Overview

This project uses Vitest for unit testing with React Testing Library for component tests. Test configuration is optimized for Next.js 16 with strict TypeScript.

## Configuration Files

### vitest.config.ts
```typescript
import { defineConfig } from 'vitest/config'
import path from 'path'

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./vitest.setup.ts'],
    exclude: ['**/node_modules/**', '**/tests/e2e/**'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        '.next/',
        'sanity/',
        'migrations/',
        'tests/e2e/',
        '**/*.config.ts',
        '**/*.config.js',
        '**/types/**',
      ],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './'),
    },
  },
})
```

### vitest.setup.ts
```typescript
import '@testing-library/jest-dom'
```

## Test Structure

### Unit Tests (lib/)
Location: `lib/__tests__/`

Example: `lib/__tests__/i18n-helpers.test.ts`
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

### Component Tests (components/)
Location: `components/shared/__tests__/`

## Common Mocking Patterns

### Mock next-intl
```typescript
vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => {
    const translations: Record<string, string> = {
      readCaseStudy: 'Read Case Study',
      learnMore: 'Learn More',
    }
    return translations[key] || key
  },
}))
```

### Mock Next.js Image
```typescript
vi.mock('next/image', () => ({
  default: ({ src, alt }: { src: string; alt: string }) => (
    <img src={src} alt={alt} />
  ),
}))
```

### Mock Sanity Client
```typescript
vi.mock('@/sanity/lib/client', () => ({
  client: {
    fetch: vi.fn(),
  },
}))
```

### Mock Sanity Image Builder
```typescript
vi.mock('@sanity/image-url', () => ({
  default: () => ({
    image: () => ({
      width: () => ({
        height: () => ({
          fit: () => ({
            url: () => 'https://example.com/image.jpg',
          }),
        }),
      }),
    }),
  }),
}))
```

## TypeScript Type Assertions

When mocking, use `as never` for complex Sanity types:
```typescript
vi.mocked(client.fetch).mockResolvedValue(mockData as never)
```

## Running Tests

```bash
# Run all tests
npm test

# Run with UI
npm run test:ui

# Run with coverage
npm run test:coverage

# Run specific test file
npm test i18n-helpers
```

## Current Test Coverage

- Total tests: 117
- Lib tests: 23 (i18n-helpers: 19, sanity-helpers: 4)
- Component tests: 94 (5 shared components fully tested)
- Coverage: 90%+ on utilities, 100% on shared components

## Writing New Tests

1. Create test file adjacent to source: `__tests__/component.test.tsx`
2. Import testing utilities: `import { describe, it, expect, vi } from 'vitest'`
3. Import React Testing Library: `import { render, screen } from '@testing-library/react'`
4. Mock dependencies before imports
5. Write descriptive test names
6. Test edge cases (undefined, empty, missing data)
7. Use `screen.getByText()`, `screen.getByRole()` for queries
8. Prefer `toBeInTheDocument()` for existence checks

## Best Practices

- One assertion per test when possible
- Test user-visible behavior, not implementation
- Mock external dependencies (Sanity, next-intl, Next/Image)
- Use descriptive test names that explain what is being tested
- Group related tests with `describe` blocks
- Test both happy path and error cases
- Keep tests simple and focused

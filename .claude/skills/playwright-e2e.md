# Playwright E2E Testing - Kilalo Project

## Overview

This project uses Playwright for end-to-end testing across multiple browsers. Tests verify critical user flows in both English and French locales.

## Configuration

### playwright.config.ts
```typescript
import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './tests/e2e',
  timeout: 30 * 1000,
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  ...(process.env.CI ? { workers: 1 } : {}),

  reporter: [
    ['html', { outputFolder: 'playwright-report' }],
    ['list'],
  ],

  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    viewport: { width: 1280, height: 720 },
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
  ],

  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
  },
})
```

## Test Structure

### Locale Switching Tests
Location: `tests/e2e/locale-switching.spec.ts`

```typescript
import { test, expect } from '@playwright/test'

test.describe('Language Switching', () => {
  test('should switch from English to French on homepage', async ({ page }) => {
    await page.goto('/en')

    // Verify English content
    await expect(page.locator('h1')).toContainText('Building ventures')

    // Click language switcher
    await page.click('[data-testid="language-switcher"]')

    // Verify URL changed
    await expect(page).toHaveURL('/fr')

    // Verify French content
    await expect(page.locator('h1')).toContainText('Construire des entreprises')
  })
})
```

### Navigation Tests
Location: `tests/e2e/navigation.spec.ts`

Tests all header navigation links work in both languages.

### Sanity Data Tests
Location: `tests/e2e/sanity-data.spec.ts`

Tests that CMS content displays correctly.

## Running Tests

```bash
# Run all E2E tests
npm run test:e2e

# Run with UI mode (interactive)
npm run test:e2e:ui

# Run in headed mode (see browser)
npm run test:e2e:headed

# View HTML report
npm run test:e2e:report
```

## Test Coverage

- 31 test scenarios
- 3 browsers (Chromium, Firefox, WebKit)
- 93 total test executions
- 97%+ pass rate

### Covered Flows
1. Language switching on all major pages
2. Navigation in both EN and FR
3. Sanity CMS content display
4. Mobile menu functionality
5. SEO meta tags verification
6. Image loading validation

## Writing New Tests

### Basic Test Structure
```typescript
import { test, expect } from '@playwright/test'

test.describe('Feature Name', () => {
  test('should do something specific', async ({ page }) => {
    // Navigate
    await page.goto('/en/path')

    // Interact
    await page.click('button')

    // Assert
    await expect(page.locator('h1')).toBeVisible()
  })
})
```

### Common Selectors
```typescript
// By role (preferred)
await page.getByRole('button', { name: 'Submit' })

// By text
await page.getByText('Welcome')

// By data-testid
await page.getByTestId('language-switcher')

// By CSS selector (last resort)
await page.locator('.class-name')
```

### Waiting for Elements
```typescript
// Wait for element to be visible
await page.waitForSelector('h1')

// Wait for navigation
await page.waitForURL('/new-path')

// Wait for load state
await page.waitForLoadState('networkidle')
```

### Testing Both Locales
```typescript
for (const locale of ['en', 'fr']) {
  test(`should work in ${locale}`, async ({ page }) => {
    await page.goto(`/${locale}/page`)
    // test logic
  })
}
```

## Best Practices

- Start dev server automatically (configured in playwright.config.ts)
- Use data-testid for elements that lack semantic meaning
- Prefer semantic selectors (getByRole, getByText)
- Test user-visible behavior, not implementation details
- Keep tests independent (don't rely on test order)
- Use descriptive test names
- Group related tests with test.describe()
- Test critical paths first
- Add screenshots/videos only on failure to save space

## Debugging Tests

```bash
# Run in debug mode
npx playwright test --debug

# Run specific test file
npx playwright test locale-switching

# Run specific test
npx playwright test -g "should switch from English to French"

# Show browser
npx playwright test --headed

# Slow down execution
npx playwright test --slow-mo=1000
```

## CI/CD Integration

Tests are configured to run differently in CI:
- Retries: 2 in CI, 0 locally
- Workers: 1 in CI (serial), unlimited locally (parallel)
- Server: Doesn't reuse existing server in CI

## Troubleshooting

### Tests Timeout
- Increase timeout in test or config
- Check if dev server is running
- Verify network conditions

### Flaky Tests
- Add explicit waits
- Use waitForLoadState
- Avoid hard-coded delays

### Selector Not Found
- Verify element exists in both locales
- Check if element is hidden/disabled
- Use Playwright Inspector to debug

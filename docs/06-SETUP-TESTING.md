# Testing Setup Guide: Playwright + Vitest

This guide covers setting up comprehensive testing for the Kilalo website using Playwright for end-to-end testing and Vitest for unit/component testing.

## Table of Contents

1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [Vitest Setup (Unit/Component)](#vitest-setup-unitcomponent)
4. [Playwright Setup (E2E)](#playwright-setup-e2e)
5. [Accessibility Testing](#accessibility-testing)
6. [Visual Regression Testing](#visual-regression-testing)
7. [Testing Best Practices](#testing-best-practices)
8. [CI/CD Integration](#cicd-integration)
9. [Troubleshooting](#troubleshooting)
10. [Next Steps](#next-steps)

## Overview

This testing strategy uses:
- **Vitest**: Fast unit and component testing with React Testing Library
- **Playwright**: Cross-browser end-to-end testing with built-in accessibility testing
- **@axe-core/playwright**: Automated accessibility audits
- **MSW**: API mocking for consistent tests

### Testing Pyramid

```
        /\
       /  \
      / E2E \  <- Playwright (Critical user flows)
     /______\
    /        \
   / Integration \ <- Playwright Component Testing
  /______________\
 /                \
/  Unit/Component  \ <- Vitest (Business logic, utilities)
/__________________\
```

## Prerequisites

- Next.js 15 project initialized (see [03-SETUP-NEXTJS.md](./03-SETUP-NEXTJS.md))
- TypeScript strict mode configured (see [05-SETUP-TYPESCRIPT-ESLINT.md](./05-SETUP-TYPESCRIPT-ESLINT.md))
- Node.js 18+ installed

## Vitest Setup (Unit/Component)

### Step 1: Install Vitest Dependencies

```bash
npm install -D vitest @vitest/ui @vitest/coverage-v8 \
  @testing-library/react @testing-library/jest-dom \
  @testing-library/user-event jsdom happy-dom
```

### Step 2: Create Vitest Configuration

Create `vitest.config.ts`:

```typescript
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./vitest.setup.ts"],
    include: ["**/*.{test,spec}.{ts,tsx}"],
    exclude: ["**/node_modules/**", "**/e2e/**", "**/.next/**"],
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html", "lcov"],
      include: ["src/**/*.{ts,tsx}"],
      exclude: [
        "src/**/*.d.ts",
        "src/**/*.stories.tsx",
        "src/**/*.test.tsx",
        "src/**/*.spec.tsx",
        "src/app/**", // Exclude Next.js app directory routes
      ],
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 80,
        statements: 80,
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
```

### Step 3: Create Setup File

Create `vitest.setup.ts`:

```typescript
import "@testing-library/jest-dom";
import { cleanup } from "@testing-library/react";
import { afterEach, vi } from "vitest";

// Cleanup after each test
afterEach(() => {
  cleanup();
});

// Mock Next.js router
vi.mock("next/navigation", () => ({
  useRouter() {
    return {
      push: vi.fn(),
      replace: vi.fn(),
      prefetch: vi.fn(),
      back: vi.fn(),
      pathname: "/",
      query: {},
      asPath: "/",
    };
  },
  usePathname() {
    return "/";
  },
  useSearchParams() {
    return new URLSearchParams();
  },
  useParams() {
    return {};
  },
}));

// Mock environment variables
process.env.NEXT_PUBLIC_SUPABASE_URL = "http://localhost:54321";
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = "test-anon-key";
```

### Step 4: Add Test Scripts

Update `package.json`:

```json
{
  "scripts": {
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest run --coverage",
    "test:watch": "vitest --watch",
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui",
    "test:e2e:debug": "playwright test --debug"
  }
}
```

### Step 5: Write Your First Unit Test

Create `src/lib/__tests__/utils.test.ts`:

```typescript
import { describe, expect, it } from "vitest";
import { cn } from "@/lib/utils";

describe("cn utility", () => {
  it("merges class names correctly", () => {
    expect(cn("px-2 py-1", "px-4")).toBe("py-1 px-4");
  });

  it("handles conditional classes", () => {
    expect(cn("base", true && "truthy", false && "falsy")).toBe("base truthy");
  });

  it("removes duplicate classes", () => {
    expect(cn("px-2", "px-2")).toBe("px-2");
  });
});
```

### Step 6: Write Component Tests

Create `src/components/ui/__tests__/button.test.tsx`:

```typescript
import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Button } from "@/components/ui/button";

describe("Button", () => {
  it("renders children correctly", () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole("button", { name: /click me/i })).toBeInTheDocument();
  });

  it("applies variant classes", () => {
    render(<Button variant="destructive">Delete</Button>);
    const button = screen.getByRole("button");
    expect(button).toHaveClass("bg-destructive");
  });

  it("handles click events", async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();

    render(<Button onClick={handleClick}>Click</Button>);

    await user.click(screen.getByRole("button"));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("is disabled when disabled prop is true", () => {
    render(<Button disabled>Disabled</Button>);
    expect(screen.getByRole("button")).toBeDisabled();
  });

  it("supports keyboard navigation", async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();

    render(<Button onClick={handleClick}>Press Enter</Button>);

    const button = screen.getByRole("button");
    button.focus();
    await user.keyboard("{Enter}");

    expect(handleClick).toHaveBeenCalled();
  });
});
```

### Step 7: Test Server Actions

Create `src/app/actions/__tests__/auth.test.ts`:

```typescript
import { describe, expect, it, vi, beforeEach } from "vitest";
import { login } from "@/app/actions/auth";

// Mock Supabase client
vi.mock("@/lib/supabase/server", () => ({
  createClient: vi.fn(() => ({
    auth: {
      signInWithPassword: vi.fn(),
    },
  })),
}));

describe("login action", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("validates email format", async () => {
    const result = await login({
      email: "invalid-email",
      password: "password123",
    });

    expect(result.success).toBe(false);
    expect(result.error).toContain("email");
  });

  it("validates password length", async () => {
    const result = await login({
      email: "user@example.com",
      password: "short",
    });

    expect(result.success).toBe(false);
    expect(result.error).toContain("password");
  });

  it("calls Supabase with correct credentials", async () => {
    const mockSignIn = vi.fn().mockResolvedValue({ error: null });
    const { createClient } = await import("@/lib/supabase/server");

    vi.mocked(createClient).mockReturnValue({
      auth: {
        signInWithPassword: mockSignIn,
      },
    } as any);

    await login({
      email: "user@example.com",
      password: "password123",
    });

    expect(mockSignIn).toHaveBeenCalledWith({
      email: "user@example.com",
      password: "password123",
    });
  });
});
```

### Step 8: Run Tests

```bash
# Run tests once
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with UI
npm run test:ui

# Generate coverage report
npm run test:coverage
```

## Playwright Setup (E2E)

### Step 1: Install Playwright

```bash
npm install -D @playwright/test
npx playwright install
```

### Step 2: Initialize Playwright

```bash
npx playwright install --with-deps
```

This installs browser binaries for Chromium, Firefox, and WebKit.

### Step 3: Create Playwright Configuration

Create `playwright.config.ts`:

```typescript
import { defineConfig, devices } from "@playwright/test";

const PORT = process.env.PORT || 3000;
const baseURL = `http://localhost:${PORT}`;

export default defineConfig({
  testDir: "./e2e",
  testMatch: "**/*.spec.ts",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ["html"],
    ["json", { outputFile: "playwright-report/results.json" }],
    ["junit", { outputFile: "playwright-report/results.xml" }],
  ],
  use: {
    baseURL,
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
  },

  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "firefox",
      use: { ...devices["Desktop Firefox"] },
    },
    {
      name: "webkit",
      use: { ...devices["Desktop Safari"] },
    },
    // Mobile viewports
    {
      name: "Mobile Chrome",
      use: { ...devices["Pixel 5"] },
    },
    {
      name: "Mobile Safari",
      use: { ...devices["iPhone 12"] },
    },
  ],

  webServer: {
    command: "npm run dev",
    url: baseURL,
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
  },
});
```

### Step 4: Create Page Object Model

Create `e2e/pages/home.page.ts`:

```typescript
import { type Page, type Locator } from "@playwright/test";

export class HomePage {
  readonly page: Page;
  readonly heading: Locator;
  readonly navigation: Locator;
  readonly loginButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.heading = page.getByRole("heading", { name: /welcome/i });
    this.navigation = page.getByRole("navigation");
    this.loginButton = page.getByRole("link", { name: /log in/i });
  }

  async goto() {
    await this.page.goto("/");
  }

  async clickLogin() {
    await this.loginButton.click();
  }
}
```

### Step 5: Write E2E Tests

Create `e2e/home.spec.ts`:

```typescript
import { test, expect } from "@playwright/test";
import { HomePage } from "./pages/home.page";

test.describe("Home Page", () => {
  test("should display the homepage", async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.goto();

    await expect(homePage.heading).toBeVisible();
  });

  test("should have working navigation", async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.goto();

    await expect(homePage.navigation).toBeVisible();
    await expect(homePage.loginButton).toBeVisible();
  });

  test("should navigate to login page", async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.goto();

    await homePage.clickLogin();
    await expect(page).toHaveURL("/login");
  });

  test("should be responsive on mobile", async ({ page, isMobile }) => {
    if (!isMobile) {
      test.skip();
    }

    const homePage = new HomePage(page);
    await homePage.goto();

    await expect(homePage.heading).toBeVisible();
  });
});
```

### Step 6: Authentication Tests

Create `e2e/auth.spec.ts`:

```typescript
import { test, expect } from "@playwright/test";

test.describe("Authentication", () => {
  test("should display login form", async ({ page }) => {
    await page.goto("/login");

    await expect(page.getByLabel(/email/i)).toBeVisible();
    await expect(page.getByLabel(/password/i)).toBeVisible();
    await expect(page.getByRole("button", { name: /log in/i })).toBeVisible();
  });

  test("should show validation errors", async ({ page }) => {
    await page.goto("/login");

    await page.getByRole("button", { name: /log in/i }).click();

    await expect(page.getByText(/email is required/i)).toBeVisible();
    await expect(page.getByText(/password is required/i)).toBeVisible();
  });

  test("should login with valid credentials", async ({ page }) => {
    await page.goto("/login");

    await page.getByLabel(/email/i).fill("user@example.com");
    await page.getByLabel(/password/i).fill("password123");
    await page.getByRole("button", { name: /log in/i }).click();

    // Should redirect to dashboard
    await expect(page).toHaveURL("/dashboard");
    await expect(page.getByText(/welcome back/i)).toBeVisible();
  });

  test("should handle authentication errors", async ({ page }) => {
    await page.goto("/login");

    await page.getByLabel(/email/i).fill("wrong@example.com");
    await page.getByLabel(/password/i).fill("wrongpassword");
    await page.getByRole("button", { name: /log in/i }).click();

    await expect(page.getByText(/invalid credentials/i)).toBeVisible();
  });
});
```

### Step 7: Run E2E Tests

```bash
# Run all tests
npm run test:e2e

# Run tests in UI mode (recommended for development)
npm run test:e2e:ui

# Run specific test file
npx playwright test e2e/home.spec.ts

# Run tests in a specific browser
npx playwright test --project=chromium

# Debug tests
npm run test:e2e:debug
```

## Accessibility Testing

### Step 1: Install Axe Playwright

```bash
npm install -D @axe-core/playwright
```

### Step 2: Create Accessibility Test Helper

Create `e2e/helpers/accessibility.ts`:

```typescript
import { type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

export async function checkA11y(
  page: Page,
  options?: {
    include?: string[];
    exclude?: string[];
    tags?: string[];
  }
) {
  const builder = new AxeBuilder({ page });

  if (options?.include) {
    builder.include(options.include);
  }

  if (options?.exclude) {
    builder.exclude(options.exclude);
  }

  if (options?.tags) {
    builder.withTags(options.tags);
  }

  return builder.analyze();
}
```

### Step 3: Write Accessibility Tests

Create `e2e/accessibility.spec.ts`:

```typescript
import { test, expect } from "@playwright/test";
import { checkA11y } from "./helpers/accessibility";

test.describe("Accessibility", () => {
  test("homepage should be accessible", async ({ page }) => {
    await page.goto("/");

    const results = await checkA11y(page);

    expect(results.violations).toEqual([]);
  });

  test("login page should be accessible", async ({ page }) => {
    await page.goto("/login");

    const results = await checkA11y(page);

    expect(results.violations).toEqual([]);
  });

  test("should meet WCAG 2.1 AA standards", async ({ page }) => {
    await page.goto("/");

    const results = await checkA11y(page, {
      tags: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"],
    });

    expect(results.violations).toEqual([]);
  });

  test("navigation should be keyboard accessible", async ({ page }) => {
    await page.goto("/");

    // Tab through navigation
    await page.keyboard.press("Tab");
    const firstLink = page.locator(":focus");
    await expect(firstLink).toHaveAttribute("href");

    // Should be able to activate with Enter
    await page.keyboard.press("Enter");
    await page.waitForLoadState("networkidle");
  });

  test("forms should have proper labels", async ({ page }) => {
    await page.goto("/login");

    const results = await checkA11y(page, {
      tags: ["wcag2a"],
      include: ["form"],
    });

    // Check for label-related violations
    const labelViolations = results.violations.filter(
      (v) => v.id === "label" || v.id === "label-title-only"
    );

    expect(labelViolations).toEqual([]);
  });

  test("images should have alt text", async ({ page }) => {
    await page.goto("/");

    const results = await checkA11y(page);

    const altTextViolations = results.violations.filter(
      (v) => v.id === "image-alt"
    );

    expect(altTextViolations).toEqual([]);
  });

  test("color contrast should meet standards", async ({ page }) => {
    await page.goto("/");

    const results = await checkA11y(page);

    const contrastViolations = results.violations.filter(
      (v) => v.id === "color-contrast"
    );

    expect(contrastViolations).toEqual([]);
  });
});
```

### Step 4: Run Accessibility Tests

```bash
# Run all accessibility tests
npx playwright test e2e/accessibility.spec.ts

# Generate accessibility report
npx playwright test e2e/accessibility.spec.ts --reporter=html
npx playwright show-report
```

## Visual Regression Testing

### Step 1: Configure Visual Comparisons

Update `playwright.config.ts`:

```typescript
export default defineConfig({
  // ... other config
  use: {
    // ... other use options
    screenshot: "only-on-failure",
  },
  expect: {
    toHaveScreenshot: {
      maxDiffPixels: 100,
      threshold: 0.2,
    },
  },
});
```

### Step 2: Create Visual Tests

Create `e2e/visual.spec.ts`:

```typescript
import { test, expect } from "@playwright/test";

test.describe("Visual Regression", () => {
  test("homepage snapshot", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveScreenshot("homepage.png");
  });

  test("login page snapshot", async ({ page }) => {
    await page.goto("/login");
    await expect(page).toHaveScreenshot("login-page.png");
  });

  test("dark mode snapshot", async ({ page }) => {
    await page.goto("/");

    // Enable dark mode
    await page.evaluate(() => {
      document.documentElement.classList.add("dark");
    });

    await expect(page).toHaveScreenshot("homepage-dark.png");
  });

  test("mobile viewport snapshot", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/");

    await expect(page).toHaveScreenshot("homepage-mobile.png");
  });
});
```

### Step 3: Update Baseline Screenshots

```bash
# Generate new baseline screenshots
npx playwright test e2e/visual.spec.ts --update-snapshots

# Run visual tests
npx playwright test e2e/visual.spec.ts
```

## Testing Best Practices

### 1. Use Testing Library Queries

```typescript
// ✅ Good - Query by role (most accessible)
screen.getByRole("button", { name: /submit/i });

// ✅ Good - Query by label text
screen.getByLabelText(/email/i);

// ⚠️ Acceptable - Query by text
screen.getByText(/welcome/i);

// ❌ Avoid - Query by test ID (last resort)
screen.getByTestId("submit-button");

// ❌ Avoid - Query by class or HTML structure
screen.getByClassName("btn-primary");
```

### 2. Test User Behavior, Not Implementation

```typescript
// ❌ Bad - Testing implementation details
expect(component.state.isOpen).toBe(true);

// ✅ Good - Testing user-visible behavior
expect(screen.getByRole("dialog")).toBeVisible();
```

### 3. Use Page Object Model for E2E

```typescript
// ✅ Encapsulate page interactions
class LoginPage {
  constructor(private page: Page) {}

  async login(email: string, password: string) {
    await this.page.getByLabel(/email/i).fill(email);
    await this.page.getByLabel(/password/i).fill(password);
    await this.page.getByRole("button", { name: /log in/i }).click();
  }
}

// Test is clean and readable
test("user can login", async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.login("user@example.com", "password123");
  await expect(page).toHaveURL("/dashboard");
});
```

### 4. Mock External Dependencies

```typescript
// Mock API calls in unit tests
vi.mock("@/lib/api", () => ({
  fetchUser: vi.fn().mockResolvedValue({ id: 1, name: "John" }),
}));

// Use MSW for integration tests
import { setupServer } from "msw/node";
import { http, HttpResponse } from "msw";

const server = setupServer(
  http.get("/api/user", () => {
    return HttpResponse.json({ id: 1, name: "John" });
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
```

### 5. Test Edge Cases

```typescript
test.describe("Button edge cases", () => {
  test("handles rapid clicks", async () => {
    const handleClick = vi.fn();
    const user = userEvent.setup();

    render(<Button onClick={handleClick}>Click</Button>);

    await user.tripleClick(screen.getByRole("button"));
    expect(handleClick).toHaveBeenCalledTimes(3);
  });

  test("handles long text content", async () => {
    render(<Button>{"Very ".repeat(100)}Long Text</Button>);
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  test("handles special characters in children", async () => {
    render(<Button>{"<>&\"'"}</Button>);
    expect(screen.getByRole("button")).toHaveTextContent("<>&\"'");
  });
});
```

### 6. Organize Tests with Describe Blocks

```typescript
describe("UserProfile", () => {
  describe("rendering", () => {
    test("displays user name", () => {});
    test("displays user avatar", () => {});
  });

  describe("interactions", () => {
    test("opens edit modal on click", () => {});
    test("saves changes on submit", () => {});
  });

  describe("edge cases", () => {
    test("handles missing avatar", () => {});
    test("handles very long names", () => {});
  });
});
```

### 7. Use Fixtures for Shared Setup

```typescript
import { test as base } from "@playwright/test";
import { HomePage } from "./pages/home.page";

type Fixtures = {
  homePage: HomePage;
};

const test = base.extend<Fixtures>({
  homePage: async ({ page }, use) => {
    const homePage = new HomePage(page);
    await homePage.goto();
    await use(homePage);
  },
});

test("can navigate", async ({ homePage }) => {
  await homePage.clickLogin();
  // ...
});
```

## CI/CD Integration

### GitHub Actions Configuration

Create `.github/workflows/test.yml`:

```yaml
name: Tests

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  unit-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: "npm"

      - name: Install dependencies
        run: npm ci

      - name: Run unit tests
        run: npm run test:coverage

      - name: Upload coverage
        uses: codecov/codecov-action@v4
        with:
          files: ./coverage/lcov.info

  e2e-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: "npm"

      - name: Install dependencies
        run: npm ci

      - name: Install Playwright browsers
        run: npx playwright install --with-deps

      - name: Run E2E tests
        run: npm run test:e2e

      - name: Upload test results
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: playwright-report
          path: playwright-report/
          retention-days: 30
```

## Troubleshooting

### Issue: Tests Failing Randomly

**Problem**: Tests pass locally but fail in CI.

**Solution**:
1. Add explicit waits:
```typescript
await page.waitForLoadState("networkidle");
```
2. Increase timeouts:
```typescript
test.setTimeout(60000);
```
3. Use `toPass` for flaky assertions:
```typescript
await expect(async () => {
  await expect(page.getByText("Loaded")).toBeVisible();
}).toPass();
```

### Issue: Slow Test Execution

**Problem**: Tests take too long to run.

**Solution**:
1. Run tests in parallel:
```typescript
test.describe.configure({ mode: "parallel" });
```
2. Use `fullyParallel` in config
3. Reduce unnecessary waits
4. Mock external API calls

### Issue: Accessibility Violations

**Problem**: Axe reports violations.

**Solution**:
1. Review violation details in the report
2. Fix HTML structure/ARIA attributes
3. Update components to be accessible
4. Re-run tests to verify fixes

## Next Steps

After setting up testing:

1. **Write tests for existing features**
2. **Set up continuous integration**: Add tests to CI/CD pipeline
3. **Configure code coverage**: Aim for 80%+ coverage
4. **Add visual regression testing**: For critical UI components
5. **Review accessibility guide**: See [10-SETUP-ACCESSIBILITY.md](./10-SETUP-ACCESSIBILITY.md)
6. **Set up Supabase**: See [07-SETUP-SUPABASE.md](./07-SETUP-SUPABASE.md)

## Resources

- [Vitest Documentation](https://vitest.dev/)
- [Playwright Documentation](https://playwright.dev/)
- [Testing Library](https://testing-library.com/)
- [Axe-core Playwright](https://github.com/dequelabs/axe-core-npm/tree/develop/packages/playwright)
- [React Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)

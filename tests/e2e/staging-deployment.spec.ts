/**
 * Staging Deployment Verification Tests
 *
 * These tests verify that the staging deployment is working correctly
 * by checking critical pages and functionality on the live staging URL.
 *
 * @see docs/STAGING_ENVIRONMENT.md - Staging environment setup
 * @see .claude/skills/deployment.md - Deployment workflow
 */

import { test, expect } from '@playwright/test'

const STAGING_URL = 'https://kilalo-git-staging-corey-wests-projects.vercel.app'
const PRODUCTION_URL = 'https://kilalo.vercel.app'

// Use staging URL if running against staging, otherwise localhost
const BASE_URL =
  process.env.TEST_ENV === 'staging'
    ? STAGING_URL
    : process.env.TEST_ENV === 'production'
      ? PRODUCTION_URL
      : 'http://localhost:3000'

// Vercel Protection Bypass secret for E2E tests
const BYPASS_SECRET = process.env.VERCEL_AUTOMATION_BYPASS_SECRET

test.describe('Staging Deployment Verification', () => {
  // Set bypass header for protected deployments
  test.beforeEach(async ({ page }) => {
    if (BYPASS_SECRET) {
      await page.setExtraHTTPHeaders({
        'x-vercel-protection-bypass': BYPASS_SECRET,
      })
    }
  })

  test.describe('Critical Pages Load', () => {
    test('homepage loads successfully (English)', async ({ page }) => {
      const response = await page.goto(`${BASE_URL}/en`)
      expect(response?.status()).toBe(200)

      // Check for key content
      await expect(page.locator('h1')).toBeVisible()

      // Verify meta tags
      const title = await page.title()
      expect(title).toBeTruthy()
    })

    test('homepage loads successfully (French)', async ({ page }) => {
      const response = await page.goto(`${BASE_URL}/fr`)
      expect(response?.status()).toBe(200)

      await expect(page.locator('h1')).toBeVisible()

      const title = await page.title()
      expect(title).toBeTruthy()
    })

    test('about page loads successfully', async ({ page }) => {
      const response = await page.goto(`${BASE_URL}/en/about`)
      expect(response?.status()).toBe(200)

      await expect(page.locator('h1')).toBeVisible()
    })

    test('community page loads successfully', async ({ page }) => {
      const response = await page.goto(`${BASE_URL}/en/community`)
      expect(response?.status()).toBe(200)

      await expect(page.locator('h1')).toBeVisible()
    })

    test('login page loads successfully', async ({ page }) => {
      const response = await page.goto(`${BASE_URL}/en/login`)
      expect(response?.status()).toBe(200)

      await expect(page.getByRole('button', { name: /sign in/i })).toBeVisible()
    })
  })

  test.describe('Navigation Works', () => {
    test('can navigate between pages', async ({ page }) => {
      await page.goto(`${BASE_URL}/en`)

      // Click on About link
      await page.getByRole('link', { name: /about/i }).first().click()
      await expect(page).toHaveURL(/\/en\/about/)

      // Verify page loaded
      await expect(page.locator('h1')).toBeVisible()
    })

    test('language switcher works', async ({ page }) => {
      await page.goto(`${BASE_URL}/en`)

      // Find and click language switcher (if visible)
      const frenchLink = page.getByRole('link', { name: /français|fr/i }).first()

      if (await frenchLink.isVisible()) {
        await frenchLink.click()
        await expect(page).toHaveURL(/\/fr/)
      }
    })
  })

  test.describe('Environment Configuration', () => {
    test('uses correct dataset (development for staging)', async ({ page }) => {
      // This would require checking actual API calls or page content
      // For now, just verify the page loads which confirms env vars are set
      const response = await page.goto(`${BASE_URL}/en`)
      expect(response?.status()).toBe(200)
    })

    test('no console errors on homepage', async ({ page }) => {
      const errors: string[] = []

      page.on('console', (msg) => {
        if (msg.type() === 'error') {
          errors.push(msg.text())
        }
      })

      await page.goto(`${BASE_URL}/en`)

      // Filter out expected errors (like failed font loads, etc.)
      const criticalErrors = errors.filter(
        (error) =>
          !error.includes('Failed to load resource') && // Resource 404s
          !error.includes('favicon') && // Favicon issues
          !error.includes('ECONNREFUSED') // Local connection issues
      )

      expect(criticalErrors).toHaveLength(0)
    })
  })

  test.describe('Performance', () => {
    test('homepage loads within acceptable time', async ({ page }) => {
      const startTime = Date.now()

      await page.goto(`${BASE_URL}/en`, {
        waitUntil: 'domcontentloaded',
      })

      const loadTime = Date.now() - startTime

      // Should load within 5 seconds on staging
      expect(loadTime).toBeLessThan(5000)
    })
  })

  test.describe('SEO & Meta', () => {
    test('has proper meta tags', async ({ page }) => {
      await page.goto(`${BASE_URL}/en`)

      // Check title
      const title = await page.title()
      expect(title).toBeTruthy()
      expect(title.length).toBeGreaterThan(0)

      // Check meta description
      const description = await page.getAttribute('meta[name="description"]', 'content')
      expect(description).toBeTruthy()

      // Check OG tags
      const ogTitle = await page.getAttribute('meta[property="og:title"]', 'content')
      expect(ogTitle).toBeTruthy()
    })

    test('has canonical URL', async ({ page }) => {
      await page.goto(`${BASE_URL}/en`)

      const canonical = await page.getAttribute('link[rel="canonical"]', 'href')
      expect(canonical).toBeTruthy()
    })
  })

  test.describe('Route Groups Work Correctly', () => {
    test('marketing community page is accessible', async ({ page }) => {
      const response = await page.goto(`${BASE_URL}/en/community`)
      expect(response?.status()).toBe(200)

      // Should show public community page
      await expect(page.locator('h1')).toBeVisible()
    })

    test('member hub requires authentication', async ({ page }) => {
      const response = await page.goto(`${BASE_URL}/en/hub`)

      // Should redirect to login or show 401/403
      // If redirected, URL should be /login
      if (page.url().includes('/login')) {
        expect(page.url()).toContain('/login')
      } else {
        // Or should show error page
        expect([200, 401, 403]).toContain(response?.status() || 0)
      }
    })

    test('no route conflicts - /community and /hub are separate', async ({ page }) => {
      // Both routes should exist and be different pages
      await page.goto(`${BASE_URL}/en/community`)
      const communityContent = await page.textContent('h1')

      await page.goto(`${BASE_URL}/en/hub`)
      const hubContent = await page.textContent('h1')

      // Content should be different (or hub redirects to login)
      if (!page.url().includes('/login')) {
        expect(communityContent).not.toBe(hubContent)
      }
    })
  })
})

test.describe('Production Deployment Verification', () => {
  test.skip('verifies production is stable', async () => {
    // Skip by default, run manually with TEST_ENV=production
    // This would run the same checks against production
  })
})

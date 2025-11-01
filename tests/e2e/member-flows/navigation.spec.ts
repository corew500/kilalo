import { test, expect } from '@playwright/test'
import { loginAsTestUser } from '../helpers/auth'

test.describe('Role-Based Navigation - Entrepreneur', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsTestUser(page, 'entrepreneur')
  })

  test('should show entrepreneur-specific navigation items', async ({ page }) => {
    await page.goto('/en/dashboard')

    // Common items for all users
    await expect(page.locator('text=Dashboard')).toBeVisible()
    await expect(page.locator('text=My Profile')).toBeVisible()
    await expect(page.locator('text=Settings')).toBeVisible()

    // Entrepreneur-specific items
    await expect(page.locator('text=My Company')).toBeVisible()
    await expect(page.locator('text=My Program')).toBeVisible()
    await expect(page.locator('text=Find Mentors')).toBeVisible()

    // Should NOT show mentor-specific items
    await expect(page.locator('text=My Mentees')).not.toBeVisible()
    await expect(page.locator('text=My Expertise')).not.toBeVisible()
  })

  test('should navigate to entrepreneur pages', async ({ page }) => {
    await page.goto('/en/dashboard')

    // Navigate to profile
    await page.click('text=My Profile')
    await expect(page).toHaveURL(/\/en\/profile/)

    // Navigate to dashboard
    await page.click('text=Dashboard')
    await expect(page).toHaveURL(/\/en\/dashboard/)

    // Navigate to settings
    await page.click('text=Settings')
    await expect(page).toHaveURL(/\/en\/settings/)
  })

  test('should highlight active navigation item', async ({ page }) => {
    await page.goto('/en/profile')

    // Profile link should have active styling
    const profileLink = page.locator('a[href="/en/profile"]')
    const classes = await profileLink.getAttribute('class')
    expect(classes).toContain('bg-teal')
  })

  test('should display user info in sidebar', async ({ page }) => {
    await page.goto('/en/dashboard')

    // Should show user type as entrepreneur
    await expect(page.locator('text=entrepreneur').last()).toBeVisible()
  })
})

test.describe('Role-Based Navigation - Mentor', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsTestUser(page, 'mentor')
  })

  test('should show mentor-specific navigation items', async ({ page }) => {
    await page.goto('/en/dashboard')

    // Common items
    await expect(page.locator('text=Dashboard')).toBeVisible()
    await expect(page.locator('text=My Profile')).toBeVisible()
    await expect(page.locator('text=Settings')).toBeVisible()

    // Mentor-specific items
    await expect(page.locator('text=My Expertise')).toBeVisible()
    await expect(page.locator('text=My Mentees')).toBeVisible()
    await expect(page.locator('text=Sessions')).toBeVisible()

    // Should NOT show entrepreneur-specific items
    await expect(page.locator('text=My Company')).not.toBeVisible()
    await expect(page.locator('text=My Program')).not.toBeVisible()
  })

  test('should display user type as mentor', async ({ page }) => {
    await page.goto('/en/dashboard')

    await expect(page.locator('text=mentor').last()).toBeVisible()
  })

  test('should navigate to mentor pages', async ({ page }) => {
    await page.goto('/en/dashboard')

    // Navigate to profile
    await page.click('text=My Profile')
    await expect(page).toHaveURL(/\/en\/profile/)

    // Navigate back to dashboard
    await page.click('text=Dashboard')
    await expect(page).toHaveURL(/\/en\/dashboard/)
  })
})

test.describe('Role-Based Navigation - Community Member', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsTestUser(page, 'community')
  })

  test('should show community member navigation items', async ({ page }) => {
    await page.goto('/en/dashboard')

    // Common items
    await expect(page.locator('text=Dashboard')).toBeVisible()
    await expect(page.locator('text=My Profile')).toBeVisible()
    await expect(page.locator('text=Settings')).toBeVisible()

    // Community-specific items
    await expect(page.locator('text=Events')).toBeVisible()
    await expect(page.locator('text=Community')).toBeVisible()
    await expect(page.locator('text=Resources')).toBeVisible()

    // Should NOT show role-specific items
    await expect(page.locator('text=My Company')).not.toBeVisible()
    await expect(page.locator('text=My Mentees')).not.toBeVisible()
    await expect(page.locator('text=My Expertise')).not.toBeVisible()
  })

  test('should display user type as community member', async ({ page }) => {
    await page.goto('/en/dashboard')

    await expect(page.locator('text=community member').last()).toBeVisible()
  })
})

test.describe('Navigation - Locale Support', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsTestUser(page, 'entrepreneur')
  })

  test('should maintain navigation in French locale', async ({ page }) => {
    await page.goto('/fr/dashboard')

    // Navigation should still work
    await expect(page.locator('text=Dashboard')).toBeVisible()
    await expect(page.locator('text=My Profile')).toBeVisible()

    // Click profile link
    await page.click('text=My Profile')
    await expect(page).toHaveURL(/\/fr\/profile/)

    // URL should maintain French locale
    expect(page.url()).toContain('/fr/')
  })

  test('should switch locales correctly', async ({ page }) => {
    // Start in English
    await page.goto('/en/dashboard')
    await expect(page).toHaveURL(/\/en\/dashboard/)

    // Go to settings and switch to French
    await page.click('text=Settings')
    await page.selectOption('#language', 'fr')
    await page.waitForURL('**/fr/settings', { timeout: 5000 })

    // Navigate to profile - should be in French
    await page.click('text=My Profile')
    await expect(page).toHaveURL(/\/fr\/profile/)
  })
})

test.describe('Navigation - Logo Link', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsTestUser(page, 'entrepreneur')
  })

  test('should link logo to home page', async ({ page }) => {
    await page.goto('/en/dashboard')

    // Click Kilalo logo
    await page.click('text=Kilalo')

    // Should navigate to home
    await expect(page).toHaveURL(/\/en\/?$/)
  })
})

test.describe('Navigation - Protected Routes', () => {
  test('should redirect to login when not authenticated', async ({ page }) => {
    // Try to access dashboard without logging in
    await page.goto('/en/dashboard')

    // Should redirect to login
    await page.waitForURL('**/login', { timeout: 5000 })
    expect(page.url()).toContain('/login')
  })

  test('should redirect to login for profile page', async ({ page }) => {
    await page.goto('/en/profile')
    await page.waitForURL('**/login', { timeout: 5000 })
    expect(page.url()).toContain('/login')
  })

  test('should redirect to login for settings page', async ({ page }) => {
    await page.goto('/en/settings')
    await page.waitForURL('**/login', { timeout: 5000 })
    expect(page.url()).toContain('/login')
  })
})

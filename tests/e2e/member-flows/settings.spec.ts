import { test, expect } from '@playwright/test'
import { loginAsTestUser } from '../helpers/auth'

test.describe('Settings Page', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsTestUser(page, 'entrepreneur')
  })

  test('should load settings page successfully', async ({ page }) => {
    await page.goto('/en/settings')

    await expect(page.locator('h1')).toContainText('Account Settings')
    await expect(page.locator('text=Account Information')).toBeVisible()
    await expect(page.locator('text=Preferences')).toBeVisible()
    await expect(page.locator('text=Security')).toBeVisible()
  })

  test('should display account information', async ({ page }) => {
    await page.goto('/en/settings')

    // Check email is displayed
    await expect(page.locator('text=Email')).toBeVisible()
    await expect(page.locator('text=entrepreneur.test@kilalo.local')).toBeVisible()

    // Check member since is displayed
    await expect(page.locator('text=Member since')).toBeVisible()

    // Check user type is displayed
    await expect(page.locator('text=User Type')).toBeVisible()
    await expect(page.locator('text=entrepreneur').last()).toBeVisible()
  })

  test('should change language preference', async ({ page }) => {
    await page.goto('/en/settings')

    // Check current language
    await expect(page.locator('#language')).toHaveValue('en')

    // Change to French
    await page.selectOption('#language', 'fr')

    // Wait for navigation
    await page.waitForURL('**/fr/settings', { timeout: 5000 })

    // Verify we're on French page
    expect(page.url()).toContain('/fr/settings')

    // Change back to English
    await page.selectOption('#language', 'en')
    await page.waitForURL('**/en/settings', { timeout: 5000 })
    expect(page.url()).toContain('/en/settings')
  })

  test('should show change password button', async ({ page }) => {
    await page.goto('/en/settings')

    await expect(page.locator('text=Password')).toBeVisible()
    await expect(page.locator('text=Change Password')).toBeVisible()
  })

  test('should open change password modal', async ({ page }) => {
    await page.goto('/en/settings')

    // Click change password button
    await page.click('button:has-text("Change Password")')

    // Modal should be visible
    await expect(page.locator('[role="dialog"]')).toBeVisible({ timeout: 2000 })
  })

  test('should show danger zone', async ({ page }) => {
    await page.goto('/en/settings')

    await expect(page.locator('text=Danger Zone')).toBeVisible()
    await expect(page.locator('text=Delete Account')).toBeVisible()
  })
})

test.describe('Settings - Different User Types', () => {
  test('should display mentor user type correctly', async ({ page }) => {
    await loginAsTestUser(page, 'mentor')
    await page.goto('/en/settings')

    await expect(page.locator('text=User Type')).toBeVisible()
    await expect(page.locator('text=mentor').last()).toBeVisible()
  })

  test('should display community member user type correctly', async ({ page }) => {
    await loginAsTestUser(page, 'community')
    await page.goto('/en/settings')

    await expect(page.locator('text=User Type')).toBeVisible()
    await expect(page.locator('text=community member').last()).toBeVisible()
  })
})

test.describe('Settings - French Locale', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsTestUser(page, 'entrepreneur', 'fr')
  })

  test('should work in French locale', async ({ page }) => {
    await page.goto('/fr/settings')

    // Page should load
    await expect(page.locator('h1')).toBeVisible()

    // Language selector should show French
    await expect(page.locator('#language')).toHaveValue('fr')
  })
})

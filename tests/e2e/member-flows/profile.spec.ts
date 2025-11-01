import { test, expect } from '@playwright/test'
import { loginAsTestUser, resetTestUserData } from '../helpers/auth'

test.describe('Profile Edit Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Reset test user data before each test
    await resetTestUserData('entrepreneur')

    // Login as entrepreneur
    await loginAsTestUser(page, 'entrepreneur')
  })

  test('should load profile page successfully', async ({ page }) => {
    await page.goto('/en/profile')

    // Check page loaded
    await expect(page.locator('h1')).toContainText('Profile Management')

    // Check form is visible
    await expect(page.locator('form')).toBeVisible()
  })

  test('should display existing profile data', async ({ page }) => {
    await page.goto('/en/profile')

    // Check basic fields are present
    await expect(page.locator('#full_name')).toBeVisible()
    await expect(page.locator('#bio')).toBeVisible()
    await expect(page.locator('#location')).toBeVisible()
  })

  test('should update basic profile information', async ({ page }) => {
    await page.goto('/en/profile')

    // Fill in basic information
    await page.fill('#full_name', 'Test Entrepreneur')
    await page.fill('#bio', 'This is a test bio for E2E testing')
    await page.fill('#location', 'Nairobi, Kenya')

    // Submit form
    await page.click('button[type="submit"]')

    // Wait for success message
    await expect(page.locator('text=Profile updated successfully')).toBeVisible({ timeout: 10000 })

    // Reload page and verify data persisted
    await page.reload()
    await expect(page.locator('#full_name')).toHaveValue('Test Entrepreneur')
    await expect(page.locator('#bio')).toHaveValue('This is a test bio for E2E testing')
    await expect(page.locator('#location')).toHaveValue('Nairobi, Kenya')
  })

  test('should update contact information', async ({ page }) => {
    await page.goto('/en/profile')

    // Fill in required field first
    await page.fill('#full_name', 'Test User')

    // Fill contact information
    await page.fill('#phone', '+254712345678')
    await page.check('#show_email')
    await page.check('#show_phone')

    // Submit form
    await page.click('button[type="submit"]')

    // Wait for success
    await expect(page.locator('text=Profile updated successfully')).toBeVisible({ timeout: 10000 })

    // Reload and verify
    await page.reload()
    await expect(page.locator('#phone')).toHaveValue('+254712345678')
    await expect(page.locator('#show_email')).toBeChecked()
    await expect(page.locator('#show_phone')).toBeChecked()
  })

  test('should update social links', async ({ page }) => {
    await page.goto('/en/profile')

    // Fill in required field
    await page.fill('#full_name', 'Test User')

    // Fill social links
    await page.fill('#linkedin_url', 'https://linkedin.com/in/testuser')
    await page.fill('#twitter_url', 'https://twitter.com/testuser')
    await page.fill('#website', 'https://testuser.com')

    // Submit form
    await page.click('button[type="submit"]')

    // Wait for success
    await expect(page.locator('text=Profile updated successfully')).toBeVisible({ timeout: 10000 })

    // Reload and verify
    await page.reload()
    await expect(page.locator('#linkedin_url')).toHaveValue('https://linkedin.com/in/testuser')
    await expect(page.locator('#twitter_url')).toHaveValue('https://twitter.com/testuser')
    await expect(page.locator('#website')).toHaveValue('https://testuser.com')
  })

  test('should show entrepreneur-specific fields', async ({ page }) => {
    await page.goto('/en/profile')

    // Entrepreneur should see company fields
    await expect(page.locator('text=Company Information')).toBeVisible()
    await expect(page.locator('#company_name')).toBeVisible()
    await expect(page.locator('#company_stage')).toBeVisible()
    await expect(page.locator('#industry')).toBeVisible()
  })

  test('should update entrepreneur-specific fields', async ({ page }) => {
    await page.goto('/en/profile')

    // Fill in required field
    await page.fill('#full_name', 'Test Entrepreneur')

    // Fill entrepreneur fields
    await page.fill('#company_name', 'Test Startup Ltd')
    await page.selectOption('#company_stage', 'early')
    await page.fill('#industry', 'Technology')

    // Submit form
    await page.click('button[type="submit"]')

    // Wait for success
    await expect(page.locator('text=Profile updated successfully')).toBeVisible({ timeout: 10000 })

    // Reload and verify
    await page.reload()
    await expect(page.locator('#company_name')).toHaveValue('Test Startup Ltd')
    await expect(page.locator('#company_stage')).toHaveValue('early')
    await expect(page.locator('#industry')).toHaveValue('Technology')
  })

  test('should update privacy settings', async ({ page }) => {
    await page.goto('/en/profile')

    // Fill in required field
    await page.fill('#full_name', 'Test User')

    // Change privacy setting
    await page.selectOption('#profile_visibility', 'public')

    // Submit form
    await page.click('button[type="submit"]')

    // Wait for success
    await expect(page.locator('text=Profile updated successfully')).toBeVisible({ timeout: 10000 })

    // Reload and verify
    await page.reload()
    await expect(page.locator('#profile_visibility')).toHaveValue('public')
  })

  test('should validate required fields', async ({ page }) => {
    await page.goto('/en/profile')

    // Clear required field
    await page.fill('#full_name', '')

    // Try to submit
    await page.click('button[type="submit"]')

    // Should show browser validation (HTML5 required attribute)
    // The form should not submit - check we're still on profile page
    await expect(page.url()).toContain('/profile')
    await expect(page.locator('text=Profile updated successfully')).not.toBeVisible()
  })

  test('should enforce bio character limit', async ({ page }) => {
    await page.goto('/en/profile')

    // Fill in required field
    await page.fill('#full_name', 'Test User')

    // Try to enter more than 500 characters
    const longBio = 'a'.repeat(501)
    await page.fill('#bio', longBio)

    // Check that textarea has maxLength attribute
    const maxLength = await page.locator('#bio').getAttribute('maxLength')
    expect(maxLength).toBe('500')

    // The value should be truncated to 500 characters by browser
    const bioValue = await page.locator('#bio').inputValue()
    expect(bioValue.length).toBeLessThanOrEqual(500)
  })

  test('should show validation error for invalid URLs', async ({ page }) => {
    await page.goto('/en/profile')

    // Fill in required field
    await page.fill('#full_name', 'Test User')

    // Enter invalid URL
    await page.fill('#linkedin_url', 'not-a-valid-url')

    // Try to submit
    await page.click('button[type="submit"]')

    // Browser validation should prevent submission
    await expect(page.url()).toContain('/profile')
  })

  test('should work in French locale', async ({ page }) => {
    await page.goto('/fr/profile')

    // Check page loaded
    await expect(page.locator('h1')).toBeVisible()

    // Form should still be functional
    await page.fill('#full_name', 'Utilisateur Test')
    await page.fill('#bio', 'Une biographie en français')

    // Submit form
    await page.click('button[type="submit"]')

    // Wait for success
    await expect(page.locator('text=Profile updated successfully')).toBeVisible({ timeout: 10000 })
  })
})

test.describe('Profile Edit - Mentor', () => {
  test.beforeEach(async ({ page }) => {
    await resetTestUserData('mentor')
    await loginAsTestUser(page, 'mentor')
  })

  test('should show mentor-specific fields', async ({ page }) => {
    await page.goto('/en/profile')

    // Mentor should see mentor fields
    await expect(page.locator('text=Mentor Information')).toBeVisible()
    await expect(page.locator('#years_experience')).toBeVisible()
    await expect(page.locator('#mentor_availability')).toBeVisible()

    // Should NOT see entrepreneur fields
    await expect(page.locator('text=Company Information')).not.toBeVisible()
  })

  test('should update mentor-specific fields', async ({ page }) => {
    await page.goto('/en/profile')

    // Fill in required field
    await page.fill('#full_name', 'Test Mentor')

    // Fill mentor fields
    await page.fill('#years_experience', '15')
    await page.selectOption('#mentor_availability', 'available')

    // Submit form
    await page.click('button[type="submit"]')

    // Wait for success
    await expect(page.locator('text=Profile updated successfully')).toBeVisible({ timeout: 10000 })

    // Reload and verify
    await page.reload()
    await expect(page.locator('#years_experience')).toHaveValue('15')
    await expect(page.locator('#mentor_availability')).toHaveValue('available')
  })
})

test.describe('Profile Edit - Community Member', () => {
  test.beforeEach(async ({ page }) => {
    await resetTestUserData('community')
    await loginAsTestUser(page, 'community')
  })

  test('should not show role-specific fields', async ({ page }) => {
    await page.goto('/en/profile')

    // Community member should NOT see role-specific fields
    await expect(page.locator('text=Company Information')).not.toBeVisible()
    await expect(page.locator('text=Mentor Information')).not.toBeVisible()

    // Should see basic fields
    await expect(page.locator('#full_name')).toBeVisible()
    await expect(page.locator('#bio')).toBeVisible()
  })
})

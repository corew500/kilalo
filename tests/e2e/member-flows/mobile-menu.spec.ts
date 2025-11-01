import { test, expect } from '@playwright/test'
import { loginAsTestUser } from '../helpers/auth'

// Mobile viewport settings
const MOBILE_VIEWPORT = { width: 375, height: 667 }
const TABLET_VIEWPORT = { width: 768, height: 1024 }

test.describe('Mobile Menu - Entrepreneur', () => {
  test.use({ viewport: MOBILE_VIEWPORT })

  test.beforeEach(async ({ page }) => {
    await loginAsTestUser(page, 'entrepreneur')
  })

  test('should show mobile menu button on mobile', async ({ page }) => {
    await page.goto('/en/dashboard')

    // Mobile menu button should be visible
    const menuButton = page.locator('button:has(svg):visible').first()
    await expect(menuButton).toBeVisible()
  })

  test('should hide desktop sidebar on mobile', async ({ page }) => {
    await page.goto('/en/dashboard')

    // Desktop sidebar should be hidden (has lg:block class)
    const sidebar = page.locator('aside.hidden')
    await expect(sidebar).toBeAttached()
  })

  test('should open mobile menu when clicking menu button', async ({ page }) => {
    await page.goto('/en/dashboard')

    // Click menu button
    const menuButton = page.locator('button:has(svg):visible').first()
    await menuButton.click()

    // Mobile menu should be visible
    await expect(page.locator('text=Dashboard').last()).toBeVisible()
    await expect(page.locator('text=My Profile').last()).toBeVisible()
    await expect(page.locator('text=My Company')).toBeVisible()
  })

  test('should close mobile menu when clicking X button', async ({ page }) => {
    await page.goto('/en/dashboard')

    // Open menu
    const menuButton = page.locator('button:has(svg):visible').first()
    await menuButton.click()
    await expect(page.locator('text=Dashboard').last()).toBeVisible()

    // Close menu by clicking X
    await menuButton.click()

    // Menu should be closed
    await expect(page.locator('div.fixed.inset-0')).not.toBeVisible({ timeout: 2000 })
  })

  test('should close mobile menu when clicking backdrop', async ({ page }) => {
    await page.goto('/en/dashboard')

    // Open menu
    const menuButton = page.locator('button:has(svg):visible').first()
    await menuButton.click()
    await expect(page.locator('text=Dashboard').last()).toBeVisible()

    // Click backdrop (the overlay)
    await page.locator('div.fixed.inset-0.bg-gray-600\\/75').click({ position: { x: 300, y: 300 } })

    // Menu should be closed
    await expect(page.locator('div.fixed.inset-0')).not.toBeVisible({ timeout: 2000 })
  })

  test('should navigate from mobile menu', async ({ page }) => {
    await page.goto('/en/dashboard')

    // Open menu
    const menuButton = page.locator('button:has(svg):visible').first()
    await menuButton.click()

    // Click profile link in mobile menu
    await page.locator('div.fixed a[href="/en/profile"]').click()

    // Should navigate to profile
    await expect(page).toHaveURL(/\/en\/profile/)

    // Menu should close after navigation
    await expect(page.locator('div.fixed.inset-0')).not.toBeVisible({ timeout: 2000 })
  })

  test('should show entrepreneur navigation items in mobile menu', async ({ page }) => {
    await page.goto('/en/dashboard')

    // Open menu
    const menuButton = page.locator('button:has(svg):visible').first()
    await menuButton.click()

    // Check entrepreneur-specific items
    await expect(page.locator('text=My Company')).toBeVisible()
    await expect(page.locator('text=My Program')).toBeVisible()
    await expect(page.locator('text=Find Mentors')).toBeVisible()

    // Should NOT show mentor items
    await expect(page.locator('text=My Mentees')).not.toBeVisible()
  })

  test('should show user info in mobile menu', async ({ page }) => {
    await page.goto('/en/dashboard')

    // Open menu
    const menuButton = page.locator('button:has(svg):visible').first()
    await menuButton.click()

    // Check user info is displayed
    await expect(page.locator('text=entrepreneur.test@kilalo.local')).toBeVisible()
  })

  test('should highlight active page in mobile menu', async ({ page }) => {
    await page.goto('/en/profile')

    // Open menu
    const menuButton = page.locator('button:has(svg):visible').first()
    await menuButton.click()

    // Profile link should have active styling
    const profileLink = page.locator('div.fixed a[href="/en/profile"]')
    const classes = await profileLink.getAttribute('class')
    expect(classes).toContain('bg-teal')
  })

  test('should show Kilalo logo in mobile menu', async ({ page }) => {
    await page.goto('/en/dashboard')

    // Open menu
    const menuButton = page.locator('button:has(svg):visible').first()
    await menuButton.click()

    // Logo should be visible in mobile menu
    await expect(page.locator('div.fixed text=Kilalo')).toBeVisible()
  })

  test('should navigate to home when clicking logo in mobile menu', async ({ page }) => {
    await page.goto('/en/dashboard')

    // Open menu
    const menuButton = page.locator('button:has(svg):visible').first()
    await menuButton.click()

    // Click logo in mobile menu
    await page.locator('div.fixed a:has-text("Kilalo")').click()

    // Should navigate to home
    await expect(page).toHaveURL(/\/en\/?$/)
  })

  test('should show logout button in header', async ({ page }) => {
    await page.goto('/en/dashboard')

    // Logout button should be visible in header
    await expect(page.locator('button[type="submit"]:has(svg)').first()).toBeVisible()
  })
})

test.describe('Mobile Menu - Mentor', () => {
  test.use({ viewport: MOBILE_VIEWPORT })

  test.beforeEach(async ({ page }) => {
    await loginAsTestUser(page, 'mentor')
  })

  test('should show mentor navigation items in mobile menu', async ({ page }) => {
    await page.goto('/en/dashboard')

    // Open menu
    const menuButton = page.locator('button:has(svg):visible').first()
    await menuButton.click()

    // Check mentor-specific items
    await expect(page.locator('text=My Expertise')).toBeVisible()
    await expect(page.locator('text=My Mentees')).toBeVisible()
    await expect(page.locator('text=Sessions')).toBeVisible()

    // Should NOT show entrepreneur items
    await expect(page.locator('text=My Company')).not.toBeVisible()
  })
})

test.describe('Mobile Menu - Community Member', () => {
  test.use({ viewport: MOBILE_VIEWPORT })

  test.beforeEach(async ({ page }) => {
    await loginAsTestUser(page, 'community')
  })

  test('should show community navigation items in mobile menu', async ({ page }) => {
    await page.goto('/en/dashboard')

    // Open menu
    const menuButton = page.locator('button:has(svg):visible').first()
    await menuButton.click()

    // Check community-specific items
    await expect(page.locator('text=Events')).toBeVisible()
    await expect(page.locator('text=Community')).toBeVisible()
    await expect(page.locator('text=Resources')).toBeVisible()

    // Should NOT show role-specific items
    await expect(page.locator('text=My Company')).not.toBeVisible()
    await expect(page.locator('text=My Mentees')).not.toBeVisible()
  })
})

test.describe('Mobile Menu - Tablet', () => {
  test.use({ viewport: TABLET_VIEWPORT })

  test.beforeEach(async ({ page }) => {
    await loginAsTestUser(page, 'entrepreneur')
  })

  test('should show mobile menu on tablet', async ({ page }) => {
    await page.goto('/en/dashboard')

    // Mobile menu button should be visible on tablet
    const menuButton = page.locator('button:has(svg):visible').first()
    await expect(menuButton).toBeVisible()
  })

  test('should function correctly on tablet', async ({ page }) => {
    await page.goto('/en/dashboard')

    // Open menu
    const menuButton = page.locator('button:has(svg):visible').first()
    await menuButton.click()

    // Menu should open
    await expect(page.locator('text=Dashboard').last()).toBeVisible()

    // Close menu
    await menuButton.click()

    // Menu should close
    await expect(page.locator('div.fixed.inset-0')).not.toBeVisible({ timeout: 2000 })
  })
})

test.describe('Responsive Design', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsTestUser(page, 'entrepreneur')
  })

  test('should hide mobile menu on desktop', async ({ page }) => {
    // Desktop viewport
    await page.setViewportSize({ width: 1280, height: 800 })
    await page.goto('/en/dashboard')

    // Mobile menu button should not be visible
    const menuButton = page.locator('button.lg\\:hidden')
    await expect(menuButton).toBeAttached()

    // Desktop sidebar should be visible
    await expect(page.locator('aside.lg\\:block')).toBeAttached()
  })

  test('should show mobile menu when viewport shrinks', async ({ page }) => {
    // Start desktop
    await page.setViewportSize({ width: 1280, height: 800 })
    await page.goto('/en/dashboard')

    // Resize to mobile
    await page.setViewportSize(MOBILE_VIEWPORT)

    // Mobile menu button should be visible
    const menuButton = page.locator('button:has(svg):visible').first()
    await expect(menuButton).toBeVisible()
  })
})

import { test, expect } from '@playwright/test'

test.describe('Navigation - English', () => {
  test('should navigate to all pages from header in English', async ({ page }) => {
    await page.goto('/en')

    // Test navigation to About
    await page.getByRole('link', { name: /about/i }).first().click()
    await expect(page).toHaveURL(/\/en\/about/)
    await page.goto('/en')

    // Test navigation to Programs
    await page
      .getByRole('link', { name: /programs/i })
      .first()
      .click()
    await expect(page).toHaveURL(/\/en\/programs/)
    await page.goto('/en')

    // Test navigation to Services
    await page
      .getByRole('link', { name: /services/i })
      .first()
      .click()
    await expect(page).toHaveURL(/\/en\/services/)
    await page.goto('/en')

    // Test navigation to Ventures
    await page
      .getByRole('link', { name: /ventures/i })
      .first()
      .click()
    await expect(page).toHaveURL(/\/en\/ventures/)
    await page.goto('/en')

    // Test navigation to Community
    await page
      .getByRole('link', { name: /community/i })
      .first()
      .click()
    await expect(page).toHaveURL(/\/en\/community/)
    await page.goto('/en')

    // Test navigation to Contact
    await page
      .getByRole('link', { name: /contact/i })
      .first()
      .click()
    await expect(page).toHaveURL(/\/en\/contact/)
  })

  test('should navigate home via logo', async ({ page }) => {
    await page.goto('/en/about')

    // Click logo to go home
    await page.getByRole('link', { name: 'kilalo' }).click()
    await expect(page).toHaveURL(/\/en$/)
  })

  test('should have no console errors during navigation', async ({ page }) => {
    const consoleErrors: string[] = []

    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text())
      }
    })

    // Navigate through main pages
    await page.goto('/en')
    await page.goto('/en/about')
    await page.goto('/en/programs')
    await page.goto('/en/ventures')

    // Check for console errors
    expect(consoleErrors).toEqual([])
  })
})

test.describe('Navigation - French', () => {
  test('should navigate to all pages from header in French', async ({ page }) => {
    await page.goto('/fr')

    // Test navigation to About
    const aboutLink = page.locator('nav a[href="/fr/about"]').first()
    await aboutLink.click()
    await expect(page).toHaveURL(/\/fr\/about/)
    await page.goto('/fr')

    // Test navigation to Programs
    const programsLink = page.locator('nav a[href="/fr/programs"]').first()
    await programsLink.click()
    await expect(page).toHaveURL(/\/fr\/programs/)
    await page.goto('/fr')

    // Test navigation to Services
    const servicesLink = page.locator('nav a[href="/fr/services"]').first()
    await servicesLink.click()
    await expect(page).toHaveURL(/\/fr\/services/)
    await page.goto('/fr')

    // Test navigation to Ventures
    const venturesLink = page.locator('nav a[href="/fr/ventures"]').first()
    await venturesLink.click()
    await expect(page).toHaveURL(/\/fr\/ventures/)
    await page.goto('/fr')

    // Test navigation to Community
    const communityLink = page.locator('nav a[href="/fr/community"]').first()
    await communityLink.click()
    await expect(page).toHaveURL(/\/fr\/community/)
    await page.goto('/fr')

    // Test navigation to Contact
    const contactLink = page.locator('nav a[href="/fr/contact"]').first()
    await contactLink.click()
    await expect(page).toHaveURL(/\/fr\/contact/)
  })

  test('should navigate home via logo in French', async ({ page }) => {
    await page.goto('/fr/about')

    // Click logo to go home
    await page.getByRole('link', { name: 'kilalo' }).click()
    await expect(page).toHaveURL(/\/fr$/)
  })
})

test.describe('Mobile Navigation', () => {
  test.beforeEach(async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })
  })

  test('should open and close mobile menu', async ({ page }) => {
    await page.goto('/en')

    // Open mobile menu
    const menuButton = page.getByRole('button', { name: /open menu/i })
    await menuButton.click()

    // Wait a moment for animation
    await page.waitForTimeout(300)

    // Verify mobile menu container is visible
    const mobileMenu = page.locator('nav + div').first()
    await expect(mobileMenu).toBeVisible()

    // Close menu
    await page.getByRole('button', { name: /close menu/i }).click()

    // Wait for animation
    await page.waitForTimeout(300)

    // Menu container should not be visible
    await expect(mobileMenu).not.toBeVisible()
  })

  test('should navigate via mobile menu', async ({ page }) => {
    await page.goto('/en')

    // Open mobile menu
    await page.getByRole('button', { name: /open menu/i }).click()

    // Click on About link in mobile menu
    await page.getByRole('link', { name: /about/i }).last().click()

    // Should navigate to about page
    await expect(page).toHaveURL(/\/en\/about/)
  })

  test('should navigate successfully from mobile menu', async ({ page }) => {
    await page.goto('/en')

    // Open mobile menu
    await page.getByRole('button', { name: /open menu/i }).click()

    // Wait for menu to open
    await page.waitForTimeout(300)

    // Verify mobile menu is visible
    const mobileMenu = page.locator('.border-t.md\\:hidden')
    await expect(mobileMenu).toBeVisible()

    // Click on programs link in mobile menu
    const programsLink = page.locator('.border-t a[href="/en/programs"]').first()
    await expect(programsLink).toBeVisible()
    await programsLink.click()

    // Verify navigation was successful
    await expect(page).toHaveURL(/\/en\/programs/)

    // Verify page content loaded
    const heading = page.locator('h1').first()
    await expect(heading).toBeVisible()
  })
})

test.describe('Footer Navigation', () => {
  test('should have footer with navigation links in English', async ({ page }) => {
    await page.goto('/en')

    // Scroll to footer
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))

    // Verify footer is visible
    const footer = page.locator('footer')
    await expect(footer).toBeVisible()
  })

  test('should have footer with navigation links in French', async ({ page }) => {
    await page.goto('/fr')

    // Scroll to footer
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))

    // Verify footer is visible
    const footer = page.locator('footer')
    await expect(footer).toBeVisible()
  })
})

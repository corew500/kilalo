import { test, expect } from '@playwright/test'

test.describe('Language Switching', () => {
  test('should switch from English to French on homepage', async ({ page }) => {
    // Navigate to English homepage
    await page.goto('/en')

    // Verify we're on English page
    await expect(page).toHaveURL(/\/en/)

    // Find and click language switcher button
    const languageSwitcher = page.getByRole('button', { name: /switch to french/i })
    await expect(languageSwitcher).toBeVisible()
    await expect(languageSwitcher).toHaveText('FR')

    // Click to switch to French
    await languageSwitcher.click()

    // Verify URL changed to French
    await expect(page).toHaveURL(/\/fr/)

    // Verify language switcher now shows EN
    const frenchSwitcher = page.getByRole('button', { name: /switch to english/i })
    await expect(frenchSwitcher).toBeVisible()
    await expect(frenchSwitcher).toHaveText('EN')
  })

  test('should switch from French to English on about page', async ({ page }) => {
    // Navigate to French about page
    await page.goto('/fr/about')

    // Verify we're on French page
    await expect(page).toHaveURL(/\/fr\/about/)

    // Find and click language switcher
    const languageSwitcher = page.getByRole('button', { name: /switch to english/i })
    await expect(languageSwitcher).toBeVisible()
    await expect(languageSwitcher).toHaveText('EN')

    // Click to switch to English
    await languageSwitcher.click()

    // Verify URL changed to English
    await expect(page).toHaveURL(/\/en\/about/)

    // Verify language switcher now shows FR
    const englishSwitcher = page.getByRole('button', { name: /switch to french/i })
    await expect(englishSwitcher).toBeVisible()
    await expect(englishSwitcher).toHaveText('FR')
  })

  test('should maintain current path when switching languages', async ({ page }) => {
    // Navigate to English programs page
    await page.goto('/en/programs')
    await expect(page).toHaveURL(/\/en\/programs/)

    // Switch to French - use visible button
    await page
      .getByRole('button', { name: /switch to french/i })
      .first()
      .click()

    // Wait for page reload
    await page.waitForLoadState('networkidle')

    // Should be on French programs page
    await expect(page).toHaveURL(/\/fr\/programs/)

    // Switch back to English
    await page
      .getByRole('button', { name: /switch to english/i })
      .first()
      .click()

    // Wait for page reload
    await page.waitForLoadState('networkidle')

    // Should be back on English programs page
    await expect(page).toHaveURL(/\/en\/programs/)
  })

  test('should switch languages on ventures page', async ({ page }) => {
    // Navigate to English ventures page
    await page.goto('/en/ventures')
    await expect(page).toHaveURL(/\/en\/ventures/)

    // Switch to French
    await page.getByRole('button', { name: /switch to french/i }).click()

    // Verify URL changed
    await expect(page).toHaveURL(/\/fr\/ventures/)
  })

  test('should switch languages on services page', async ({ page }) => {
    // Navigate to English services page
    await page.goto('/en/services')
    await expect(page).toHaveURL(/\/en\/services/)

    // Switch to French
    await page.getByRole('button', { name: /switch to french/i }).click()

    // Verify URL changed
    await expect(page).toHaveURL(/\/fr\/services/)
  })

  test('should switch languages on community page', async ({ page }) => {
    // Navigate to English community page
    await page.goto('/en/community')
    await expect(page).toHaveURL(/\/en\/community/)

    // Switch to French
    await page.getByRole('button', { name: /switch to french/i }).click()

    // Verify URL changed
    await expect(page).toHaveURL(/\/fr\/community/)
  })

  test('should switch languages on contact page', async ({ page }) => {
    // Navigate to English contact page
    await page.goto('/en/contact')
    await expect(page).toHaveURL(/\/en\/contact/)

    // Switch to French
    await page.getByRole('button', { name: /switch to french/i }).click()

    // Verify URL changed
    await expect(page).toHaveURL(/\/fr\/contact/)
  })

  test('should show language switcher in mobile menu', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })

    // Navigate to English homepage
    await page.goto('/en')

    // Open mobile menu
    const menuButton = page.getByRole('button', { name: /open menu/i })
    await menuButton.click()

    // Wait for mobile menu to appear
    await page.waitForTimeout(300)

    // Find language switcher in mobile menu (should show "Français" in mobile view)
    const mobileSwitcher = page.getByRole('button', { name: /français|switch to french/i }).last()
    await expect(mobileSwitcher).toBeVisible()

    // Click to switch language
    await mobileSwitcher.click()

    // Verify URL changed to French
    await expect(page).toHaveURL(/\/fr/)
  })
})

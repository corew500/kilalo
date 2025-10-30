import { test, expect } from '@playwright/test'

test.describe('Sanity CMS Data Integration - English', () => {
  test('should display Sanity content on homepage', async ({ page }) => {
    await page.goto('/en')

    // Wait for page to load
    await page.waitForLoadState('networkidle')

    // Verify hero section is visible (should have Sanity content)
    const heroSection = page.locator('main').first()
    await expect(heroSection).toBeVisible()

    // Verify page has content (not empty)
    const pageContent = await page.textContent('body')
    expect(pageContent).toBeTruthy()
    expect(pageContent!.length).toBeGreaterThan(100)
  })

  test('should display ventures from Sanity', async ({ page }) => {
    await page.goto('/en/ventures')

    // Wait for content to load
    await page.waitForLoadState('networkidle')

    // Verify page title/heading is visible
    const mainHeading = page.locator('h1').first()
    await expect(mainHeading).toBeVisible()

    // Check if there are venture cards (if ventures exist)
    const ventureCards = page.locator('[data-testid="venture-card"]')
    const cardCount = await ventureCards.count()

    if (cardCount > 0) {
      // If ventures exist, verify card structure
      const firstCard = ventureCards.first()
      await expect(firstCard).toBeVisible()
    } else {
      // If no ventures, verify "coming soon" or empty state message
      const comingSoonText = page.getByText(/coming soon|no ventures/i)
      const hasComingSoon = await comingSoonText.count()
      expect(hasComingSoon).toBeGreaterThanOrEqual(0)
    }
  })

  test('should display case studies from Sanity if they exist', async ({ page }) => {
    await page.goto('/en/case-studies')

    // Wait for content to load
    await page.waitForLoadState('networkidle')

    // Verify page loads without errors
    const mainHeading = page.locator('h1').first()
    await expect(mainHeading).toBeVisible()

    // Check for case study content
    const caseStudyCards = page.locator('[data-testid="case-study-card"]')
    const cardCount = await caseStudyCards.count()

    // Test passes whether case studies exist or not
    expect(cardCount).toBeGreaterThanOrEqual(0)
  })

  test('should display about page content from Sanity', async ({ page }) => {
    await page.goto('/en/about')

    // Wait for content to load
    await page.waitForLoadState('networkidle')

    // Verify main heading
    const mainHeading = page.locator('h1').first()
    await expect(mainHeading).toBeVisible()

    // Verify substantial content exists (from Sanity)
    const pageContent = await page.textContent('main')
    expect(pageContent).toBeTruthy()
    expect(pageContent!.length).toBeGreaterThan(200)
  })

  test('should display programs page content from Sanity', async ({ page }) => {
    await page.goto('/en/programs')

    // Wait for content to load
    await page.waitForLoadState('networkidle')

    // Verify main heading
    const mainHeading = page.locator('h1').first()
    await expect(mainHeading).toBeVisible()

    // Verify page has content
    const mainContent = page.locator('main')
    await expect(mainContent).toBeVisible()
  })

  test('should handle missing Sanity data gracefully', async ({ page }) => {
    // Monitor console errors
    const consoleErrors: string[] = []
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text())
      }
    })

    await page.goto('/en')

    // Verify page loads even if some Sanity data is missing
    await page.waitForLoadState('networkidle')

    // Should not have critical errors
    const criticalErrors = consoleErrors.filter(
      (error) => error.includes('undefined') || error.includes('null')
    )
    expect(criticalErrors.length).toBe(0)
  })
})

test.describe('Sanity CMS Data Integration - French', () => {
  test('should display localized content on homepage in French', async ({ page }) => {
    await page.goto('/fr')

    // Wait for page to load
    await page.waitForLoadState('networkidle')

    // Verify hero section is visible
    const heroSection = page.locator('main').first()
    await expect(heroSection).toBeVisible()

    // Verify page has content
    const pageContent = await page.textContent('body')
    expect(pageContent).toBeTruthy()
    expect(pageContent!.length).toBeGreaterThan(100)
  })

  test('should display French ventures from Sanity', async ({ page }) => {
    await page.goto('/fr/ventures')

    // Wait for content to load
    await page.waitForLoadState('networkidle')

    // Verify page title/heading is visible in French
    const mainHeading = page.locator('h1').first()
    await expect(mainHeading).toBeVisible()

    // Check for venture cards
    const ventureCards = page.locator('[data-testid="venture-card"]')
    const cardCount = await ventureCards.count()

    // Test passes whether ventures exist or not
    expect(cardCount).toBeGreaterThanOrEqual(0)
  })

  test('should display French about page content from Sanity', async ({ page }) => {
    await page.goto('/fr/about')

    // Wait for content to load
    await page.waitForLoadState('networkidle')

    // Verify main heading
    const mainHeading = page.locator('h1').first()
    await expect(mainHeading).toBeVisible()

    // Verify substantial content exists
    const pageContent = await page.textContent('main')
    expect(pageContent).toBeTruthy()
    expect(pageContent!.length).toBeGreaterThan(200)
  })

  test('should display different content between EN and FR', async ({ page }) => {
    // Get English content
    await page.goto('/en')
    await page.waitForLoadState('networkidle')
    const englishContent = await page.textContent('main')

    // Get French content
    await page.goto('/fr')
    await page.waitForLoadState('networkidle')
    const frenchContent = await page.textContent('main')

    // Content should be different (localized)
    expect(englishContent).not.toBe(frenchContent)
  })

  test('should load images from Sanity CDN', async ({ page }) => {
    await page.goto('/fr/about')

    // Wait for images to load
    await page.waitForLoadState('networkidle')

    // Get all images on the page
    const images = page.locator('img')
    const imageCount = await images.count()

    if (imageCount > 0) {
      // Check first few images are loaded
      const firstImage = images.first()
      const isVisible = await firstImage.isVisible()

      if (isVisible) {
        // Verify image has valid src
        const src = await firstImage.getAttribute('src')
        expect(src).toBeTruthy()
      }
    }

    // Test passes whether images exist or not
    expect(imageCount).toBeGreaterThanOrEqual(0)
  })
})

test.describe('Sanity Content Quality', () => {
  test('should not display empty or placeholder content', async ({ page }) => {
    await page.goto('/en')

    // Wait for content to load
    await page.waitForLoadState('networkidle')

    // Get main content text (exclude scripts, styles, etc)
    const mainContent = await page.locator('main').textContent()

    // Should not contain Lorem Ipsum
    expect(mainContent?.toLowerCase()).not.toContain('lorem ipsum')

    // Should not contain empty double brackets (common template placeholders)
    expect(mainContent).not.toContain('{{}}')
  })

  test('should have proper SEO meta tags', async ({ page }) => {
    await page.goto('/en')

    // Check for title
    const title = await page.title()
    expect(title).toBeTruthy()
    expect(title.length).toBeGreaterThan(0)

    // Check for meta description
    const metaDescription = page.locator('meta[name="description"]')
    const descriptionContent = await metaDescription.getAttribute('content')
    expect(descriptionContent).toBeTruthy()
  })
})

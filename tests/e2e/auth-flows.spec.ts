import { test, expect } from '@playwright/test'

test.describe('Authentication Flows', () => {
  test.describe('Login Flow', () => {
    test('should display login page with all elements', async ({ page }) => {
      await page.goto('/en/login')

      // Check heading and description
      await expect(page.getByRole('heading', { name: 'Welcome' })).toBeVisible()
      await expect(page.getByText('Sign in to access your account')).toBeVisible()

      // Check form fields
      await expect(page.getByLabel('Email')).toBeVisible()
      await expect(page.getByLabel('Password')).toBeVisible()

      // Check links
      await expect(page.getByRole('link', { name: 'Forgot password?' })).toBeVisible()
      await expect(page.getByRole('link', { name: 'Sign up' })).toBeVisible()
      await expect(page.getByRole('link', { name: 'Back to home' })).toBeVisible()

      // Check submit button
      await expect(page.getByRole('button', { name: 'Sign In' })).toBeVisible()
    })

    test('should show validation error for short password', async ({ page }) => {
      await page.goto('/en/login')

      await page.getByLabel('Email').fill('test@example.com')
      await page.getByLabel('Password').fill('12345')
      await page.getByRole('button', { name: 'Sign In' }).click()

      await expect(page.getByText('Password must be at least 6 characters')).toBeVisible()
    })

    test('should navigate to signup page from link', async ({ page }) => {
      await page.goto('/en/login')

      await page.getByRole('link', { name: 'Sign up' }).click()

      await expect(page).toHaveURL('/en/signup')
      await expect(page.getByRole('heading', { name: 'Create your account' })).toBeVisible()
    })

    test('should navigate to forgot password page', async ({ page }) => {
      await page.goto('/en/login')

      await page.getByRole('link', { name: 'Forgot password?' }).click()

      await expect(page).toHaveURL('/en/forgot-password')
    })

    test('should work in French locale', async ({ page }) => {
      await page.goto('/fr/login')

      await expect(page.getByRole('heading', { name: 'Bienvenue' })).toBeVisible()
      await expect(page.getByText('Connectez-vous pour accéder à votre compte')).toBeVisible()
      await expect(page.getByLabel('Courriel')).toBeVisible()
      await expect(page.getByLabel('Mot de Passe')).toBeVisible()
    })
  })

  test.describe('Signup Flow', () => {
    test('should display signup page with all elements', async ({ page }) => {
      await page.goto('/en/signup')

      // Check heading and description
      await expect(page.getByRole('heading', { name: 'Create your account' })).toBeVisible()
      await expect(page.getByText('Join the Kilalo community')).toBeVisible()

      // Check form fields
      await expect(page.getByLabel('Full Name')).toBeVisible()
      await expect(page.getByLabel('Email')).toBeVisible()
      await expect(page.getByLabel('Password', { exact: true })).toBeVisible()
      await expect(page.getByLabel('Confirm Password')).toBeVisible()

      // Check links
      await expect(page.getByRole('link', { name: 'Sign in' })).toBeVisible()

      // Check submit button
      await expect(page.getByRole('button', { name: 'Create Account' })).toBeVisible()
    })

    test('should show validation error for short full name', async ({ page }) => {
      await page.goto('/en/signup')

      await page.getByLabel('Full Name').fill('A')
      await page.getByLabel('Email').fill('test@example.com')
      await page.getByLabel('Password', { exact: true }).fill('password123')
      await page.getByLabel('Confirm Password').fill('password123')
      await page.getByRole('button', { name: 'Create Account' }).click()

      await expect(page.getByText('Full name must be at least 2 characters')).toBeVisible()
    })

    test('should show validation error for short password', async ({ page }) => {
      await page.goto('/en/signup')

      await page.getByLabel('Full Name').fill('John Doe')
      await page.getByLabel('Email').fill('test@example.com')
      await page.getByLabel('Password', { exact: true }).fill('1234567')
      await page.getByLabel('Confirm Password').fill('1234567')
      await page.getByRole('button', { name: 'Create Account' }).click()

      await expect(page.getByText('Password must be at least 8 characters')).toBeVisible()
    })

    test('should show validation error when passwords do not match', async ({ page }) => {
      await page.goto('/en/signup')

      await page.getByLabel('Full Name').fill('John Doe')
      await page.getByLabel('Email').fill('test@example.com')
      await page.getByLabel('Password', { exact: true }).fill('password123')
      await page.getByLabel('Confirm Password').fill('password456')
      await page.getByRole('button', { name: 'Create Account' }).click()

      await expect(page.getByText("Passwords don't match")).toBeVisible()
    })

    test('should navigate to login page from link', async ({ page }) => {
      await page.goto('/en/signup')

      await page.getByRole('link', { name: 'Sign in' }).click()

      await expect(page).toHaveURL('/en/login')
      await expect(page.getByRole('heading', { name: 'Welcome' })).toBeVisible()
    })

    test('should work in French locale', async ({ page }) => {
      await page.goto('/fr/signup')

      await expect(page.getByRole('heading', { name: 'Créez votre compte' })).toBeVisible()
      await expect(page.getByText('Rejoignez la communauté Kilalo')).toBeVisible()
      await expect(page.getByLabel('Nom Complet')).toBeVisible()
      await expect(page.getByLabel('Courriel')).toBeVisible()
    })
  })

  test.describe('Navigation Between Auth Pages', () => {
    test('should navigate from login to signup and back', async ({ page }) => {
      await page.goto('/en/login')
      await expect(page.getByRole('heading', { name: 'Welcome' })).toBeVisible()

      await page.getByRole('link', { name: 'Sign up' }).click()
      await expect(page).toHaveURL('/en/signup')
      await expect(page.getByRole('heading', { name: 'Create your account' })).toBeVisible()

      await page.getByRole('link', { name: 'Sign in' }).click()
      await expect(page).toHaveURL('/en/login')
      await expect(page.getByRole('heading', { name: 'Welcome' })).toBeVisible()
    })

    test('should preserve locale when navigating between auth pages', async ({ page }) => {
      await page.goto('/fr/login')

      await page.getByRole('link', { name: "S'inscrire" }).click()
      await expect(page).toHaveURL('/fr/signup')

      await page.getByRole('link', { name: 'Se connecter' }).click()
      await expect(page).toHaveURL('/fr/login')
    })
  })

  test.describe('Back to Home Navigation', () => {
    test('should navigate back to home from login page', async ({ page }) => {
      await page.goto('/en/login')

      await page.getByRole('link', { name: 'Back to home' }).click()

      await expect(page).toHaveURL('/en')
    })

    test('should navigate back to home from signup page', async ({ page }) => {
      await page.goto('/en/signup')

      await page.getByRole('link', { name: 'Back to home' }).click()

      await expect(page).toHaveURL('/en')
    })
  })
})

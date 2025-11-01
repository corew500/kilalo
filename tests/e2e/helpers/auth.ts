import { Page } from '@playwright/test'
import { createClient } from '@supabase/supabase-js'

/**
 * Test user credentials for E2E authenticated flows
 * These users should exist in your Supabase development database
 */
export const TEST_USERS = {
  entrepreneur: {
    email: 'entrepreneur.test@kilalo.local',
    password: 'TestPassword123!',
    role: 'entrepreneur' as const,
  },
  mentor: {
    email: 'mentor.test@kilalo.local',
    password: 'TestPassword123!',
    role: 'mentor' as const,
  },
  community: {
    email: 'community.test@kilalo.local',
    password: 'TestPassword123!',
    role: 'community_member' as const,
  },
} as const

export type TestUserType = keyof typeof TEST_USERS

/**
 * Login helper for E2E tests
 * Navigates to login page and authenticates user
 */
export async function loginAsTestUser(
  page: Page,
  userType: TestUserType,
  locale: 'en' | 'fr' = 'en'
): Promise<void> {
  const user = TEST_USERS[userType]

  // Navigate to login page
  await page.goto(`/${locale}/auth/login`)

  // Fill in credentials
  await page.fill('input[name="email"]', user.email)
  await page.fill('input[name="password"]', user.password)

  // Submit form
  await page.click('button[type="submit"]')

  // Wait for redirect to dashboard
  await page.waitForURL(`**/${locale}/dashboard`, { timeout: 10000 })
}

/**
 * Logout helper for E2E tests
 */
export async function logout(page: Page): Promise<void> {
  // Click profile dropdown
  await page.click('[data-testid="profile-dropdown-trigger"]')

  // Click logout button
  await page.click('[data-testid="logout-button"]')

  // Wait for redirect to home or login page
  await page.waitForURL(/\/(en|fr)(\/auth\/login)?$/, { timeout: 5000 })
}

/**
 * Create a Supabase client for test setup/teardown
 * Uses service role key for admin operations
 */
export function createTestSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error(
      'Missing Supabase environment variables for test setup. ' +
        'Ensure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set.'
    )
  }

  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}

/**
 * Setup test users in Supabase (run once before E2E tests)
 * Creates test user accounts with appropriate roles
 */
export async function setupTestUsers() {
  const supabase = createTestSupabaseClient()

  for (const [userType, userData] of Object.entries(TEST_USERS)) {
    try {
      // Try to create auth user
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: userData.email,
        password: userData.password,
        email_confirm: true,
      })

      let userId: string | undefined

      // If user already exists, get their ID
      if (
        authError?.message?.includes('already registered') ||
        (authError as any)?.code === 'email_exists'
      ) {
        // List users and find by email
        const { data: usersList } = await supabase.auth.admin.listUsers()
        const existingUser = usersList?.users?.find((u) => u.email === userData.email)
        userId = existingUser?.id
        console.log(`ℹ️  User already exists: ${userData.email}`)
      } else if (authError) {
        console.error(`Failed to create ${userType} test user:`, authError)
        continue
      } else {
        userId = authData?.user?.id
        console.log(`✅ Test user created: ${userData.email}`)
      }

      // Update profile with user_type
      if (userId) {
        const { error: profileError } = await supabase
          .from('profiles')
          .update({ user_type: userData.role })
          .eq('id', userId)

        if (profileError) {
          console.error(`Failed to set user_type for ${userType}:`, profileError)
        } else {
          console.log(`✅ Set user_type: ${userData.email} → ${userData.role}`)
        }
      }
    } catch (error) {
      console.error(`Error setting up ${userType} test user:`, error)
    }
  }
}

/**
 * Cleanup test user data (optional, for test isolation)
 * Resets profile data to known state
 */
export async function resetTestUserData(userType: TestUserType) {
  const supabase = createTestSupabaseClient()
  const user = TEST_USERS[userType]

  // Get user by email
  const { data: usersList } = await supabase.auth.admin.listUsers()
  const authUser = usersList?.users?.find((u) => u.email === user.email)

  if (!authUser) {
    console.warn(`Test user not found: ${user.email}`)
    return
  }

  // Reset profile to default state
  await supabase
    .from('profiles')
    .update({
      first_name: null,
      last_name: null,
      bio: null,
      avatar_url: null,
      // Keep user_type intact
    })
    .eq('id', authUser.id)
}

/**
 * Delete all test users (cleanup after test suite)
 */
export async function cleanupTestUsers() {
  const supabase = createTestSupabaseClient()

  for (const [userType, userData] of Object.entries(TEST_USERS)) {
    try {
      const { data: usersList } = await supabase.auth.admin.listUsers()
      const authUser = usersList?.users?.find((u) => u.email === userData.email)

      if (authUser) {
        await supabase.auth.admin.deleteUser(authUser.id)
        console.log(`✅ Deleted test user: ${userData.email}`)
      }
    } catch (error) {
      console.error(`Error deleting ${userType} test user:`, error)
    }
  }
}

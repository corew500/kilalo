/**
 * Supabase Authentication Helpers
 *
 * Server-side utilities for authentication and session management.
 * These helpers follow Supabase SSR best practices.
 */

import { createClient } from './server'
import { cache } from 'react'

// ============================================================================
// GET USER (Server Components)
// ============================================================================

/**
 * Get the current authenticated user
 * Cached for the lifetime of the request
 */
export const getUser = cache(async () => {
  const supabase = await createClient()
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error) {
    console.error('Error fetching user:', error)
    return null
  }

  return user
})

// ============================================================================
// GET SESSION (Server Components)
// ============================================================================

/**
 * Get the current session
 * Cached for the lifetime of the request
 */
export const getSession = cache(async () => {
  const supabase = await createClient()
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession()

  if (error) {
    console.error('Error fetching session:', error)
    return null
  }

  return session
})

// ============================================================================
// REQUIRE AUTH (Server Components)
// ============================================================================

/**
 * Require authentication - redirects to login if not authenticated
 * Use in Server Components or Server Actions
 */
export async function requireAuth() {
  const user = await getUser()

  if (!user) {
    throw new Error('Unauthorized - Please sign in')
  }

  return user
}

// ============================================================================
// CHECK ROLE (Server Components)
// ============================================================================

/**
 * Check if user has a specific role
 * Assumes roles are stored in user metadata
 */
export async function hasRole(role: string): Promise<boolean> {
  const user = await getUser()

  if (!user) {
    return false
  }

  const userRoles = user.user_metadata?.roles as string[] | undefined
  return userRoles?.includes(role) ?? false
}

/**
 * Require specific role - throws error if user doesn't have role
 */
export async function requireRole(role: string) {
  const user = await requireAuth()
  const userRoles = user.user_metadata?.roles as string[] | undefined

  if (!userRoles?.includes(role)) {
    throw new Error(`Forbidden - ${role} role required`)
  }

  return user
}

// ============================================================================
// SIGN OUT (Server Action)
// ============================================================================

/**
 * Sign out the current user
 * Call from a Server Action
 */
export async function signOut() {
  'use server'

  const supabase = await createClient()
  const { error } = await supabase.auth.signOut()

  if (error) {
    console.error('Error signing out:', error)
    throw new Error('Failed to sign out')
  }
}

// ============================================================================
// USER PROFILE HELPERS
// ============================================================================

/**
 * Get user profile data
 * Assumes you have a 'profiles' table linked to auth.users
 */
export async function getUserProfile<T = Record<string, unknown>>() {
  const user = await getUser()

  if (!user) {
    return null
  }

  const supabase = await createClient()
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (error) {
    console.error('Error fetching profile:', error)
    return null
  }

  return data as T
}

/**
 * Update user profile
 * Call from a Server Action
 */
export async function updateUserProfile(updates: Record<string, unknown>) {
  'use server'

  const user = await requireAuth()
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', user.id)
    .select()
    .single()

  if (error) {
    console.error('Error updating profile:', error)
    throw new Error('Failed to update profile')
  }

  return data
}

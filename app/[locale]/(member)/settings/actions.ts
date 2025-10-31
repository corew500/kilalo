'use server'

import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'

const passwordSchema = z
  .object({
    newPassword: z.string().min(6, 'Password must be at least 6 characters').max(100),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

export async function changePassword(formData: FormData) {
  const supabase = await createClient()

  // Get authenticated user
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, error: 'Not authenticated' }
  }

  // Parse and validate
  const rawData = {
    newPassword: formData.get('newPassword') as string,
    confirmPassword: formData.get('confirmPassword') as string,
  }

  const validation = passwordSchema.safeParse(rawData)

  if (!validation.success) {
    const firstError = validation.error.issues[0]
    return {
      success: false,
      error: firstError?.message || 'Validation failed',
    }
  }

  // Update password using Supabase Auth
  const { error } = await supabase.auth.updateUser({
    password: validation.data.newPassword,
  })

  if (error) {
    console.error('Password change error:', error)
    return { success: false, error: 'Failed to change password' }
  }

  return { success: true }
}

// TODO: Implement account deletion
// Will need to add deleted_at column to profiles table first
export async function deleteAccount() {
  return { success: false, error: 'Account deletion not yet implemented' }
}

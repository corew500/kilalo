'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

// Profile update schema
const profileSchema = z.object({
  full_name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  bio: z.string().max(500).nullable(),
  location: z.string().max(100).nullable(),
  phone: z.string().max(20).nullable(),
  linkedin_url: z.string().url('Invalid URL').or(z.literal('')).nullable(),
  twitter_url: z.string().url('Invalid URL').or(z.literal('')).nullable(),
  website: z.string().url('Invalid URL').or(z.literal('')).nullable(),
  languages: z.array(z.string()).min(1, 'Select at least one language'),
  show_email: z.boolean(),
  show_phone: z.boolean(),
  profile_visibility: z.enum(['public', 'members_only', 'private']),
  // Entrepreneur fields
  company_name: z.string().max(100).nullable(),
  company_stage: z.enum(['idea', 'early', 'growth', 'established']).nullable(),
  industry: z.string().max(100).nullable(),
  // Mentor fields
  expertise_areas: z.array(z.string()).nullable(),
  years_experience: z.number().int().min(0).max(100).nullable(),
  mentor_availability: z.enum(['available', 'limited', 'unavailable']).nullable(),
})

export type ProfileFormData = z.infer<typeof profileSchema>

export async function updateProfile(formData: FormData) {
  const supabase = await createClient()

  // Get authenticated user
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, error: 'Not authenticated' }
  }

  // Parse and validate form data
  const rawData = {
    full_name: formData.get('full_name') as string,
    bio: (formData.get('bio') as string) || null,
    location: (formData.get('location') as string) || null,
    phone: (formData.get('phone') as string) || null,
    linkedin_url: (formData.get('linkedin_url') as string) || null,
    twitter_url: (formData.get('twitter_url') as string) || null,
    website: (formData.get('website') as string) || null,
    languages: formData.getAll('languages') as string[],
    show_email: formData.get('show_email') === 'true',
    show_phone: formData.get('show_phone') === 'true',
    profile_visibility: formData.get('profile_visibility') as 'public' | 'members_only' | 'private',
    // Entrepreneur fields
    company_name: (formData.get('company_name') as string) || null,
    company_stage:
      (formData.get('company_stage') as 'idea' | 'early' | 'growth' | 'established') || null,
    industry: (formData.get('industry') as string) || null,
    // Mentor fields
    expertise_areas:
      formData.getAll('expertise_areas').length > 0
        ? (formData.getAll('expertise_areas') as string[])
        : null,
    years_experience: formData.get('years_experience')
      ? parseInt(formData.get('years_experience') as string)
      : null,
    mentor_availability:
      (formData.get('mentor_availability') as 'available' | 'limited' | 'unavailable') || null,
  }

  // Validate
  const validation = profileSchema.safeParse(rawData)

  if (!validation.success) {
    const firstError = validation.error.issues[0]
    return {
      success: false,
      error: firstError?.message || 'Validation failed',
    }
  }

  // Update profile
  const { error } = await supabase.from('profiles').update(validation.data).eq('id', user.id)

  if (error) {
    console.error('Profile update error:', error)
    return { success: false, error: 'Failed to update profile' }
  }

  // Revalidate the profile page
  revalidatePath('/[locale]/(member)/profile')

  return { success: true }
}

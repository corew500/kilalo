'use client'

import { useState } from 'react'
import { updateProfile } from '@/app/[locale]/(member)/profile/actions'
import { Button } from '@/components/ui/button'

interface ProfileFormProps {
  profile: {
    full_name?: string | null
    bio?: string | null
    location?: string | null
    phone?: string | null
    linkedin_url?: string | null
    twitter_url?: string | null
    website?: string | null
    languages?: string[] | null
    show_email?: boolean | null
    show_phone?: boolean | null
    profile_visibility?: string | null
    user_type?: string | null
    // Entrepreneur fields
    company_name?: string | null
    company_stage?: string | null
    industry?: string | null
    // Mentor fields
    expertise_areas?: string[] | null
    years_experience?: number | null
    mentor_availability?: string | null
  }
}

export default function ProfileForm({ profile }: ProfileFormProps) {
  const [isSaving, setIsSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSaving(true)
    setMessage(null)

    const formData = new FormData(e.currentTarget)

    try {
      const result = await updateProfile(formData)

      if (result.success) {
        setMessage({ type: 'success', text: 'Profile updated successfully!' })
      } else {
        setMessage({ type: 'error', text: result.error || 'Failed to update profile' })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'An unexpected error occurred' })
    } finally {
      setIsSaving(false)
    }
  }

  const isEntrepreneur = profile.user_type === 'entrepreneur'
  const isMentor = profile.user_type === 'mentor'

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Basic Information */}
      <div className="rounded-lg bg-white p-6 shadow">
        <h2 className="mb-4 text-xl font-semibold text-gray-900">Basic Information</h2>
        <div className="space-y-4">
          <div>
            <label htmlFor="full_name" className="block text-sm font-medium text-gray-700">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="full_name"
              name="full_name"
              defaultValue={profile.full_name || ''}
              required
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-teal focus:outline-none focus:ring-teal sm:text-sm"
            />
          </div>

          <div>
            <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
              Bio
            </label>
            <textarea
              id="bio"
              name="bio"
              rows={4}
              maxLength={500}
              defaultValue={profile.bio || ''}
              placeholder="Tell us about yourself..."
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-teal focus:outline-none focus:ring-teal sm:text-sm"
            />
            <p className="mt-1 text-xs text-gray-500">Maximum 500 characters</p>
          </div>

          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700">
              Location
            </label>
            <input
              type="text"
              id="location"
              name="location"
              defaultValue={profile.location || ''}
              placeholder="City, Country"
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-teal focus:outline-none focus:ring-teal sm:text-sm"
            />
          </div>

          <div>
            <label htmlFor="languages" className="block text-sm font-medium text-gray-700">
              Languages <span className="text-red-500">*</span>
            </label>
            <select
              id="languages"
              name="languages"
              multiple
              defaultValue={profile.languages || ['en']}
              required
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-teal focus:outline-none focus:ring-teal sm:text-sm"
              size={2}
            >
              <option value="en">English</option>
              <option value="fr">French</option>
            </select>
            <p className="mt-1 text-xs text-gray-500">Hold Ctrl/Cmd to select multiple</p>
          </div>
        </div>
      </div>

      {/* Contact Information */}
      <div className="rounded-lg bg-white p-6 shadow">
        <h2 className="mb-4 text-xl font-semibold text-gray-900">Contact Information</h2>
        <div className="space-y-4">
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
              Phone
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              defaultValue={profile.phone || ''}
              placeholder="+1 234 567 8900"
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-teal focus:outline-none focus:ring-teal sm:text-sm"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="show_email"
              name="show_email"
              value="true"
              defaultChecked={profile.show_email || false}
              className="h-4 w-4 rounded border-gray-300 text-teal focus:ring-teal"
            />
            <label htmlFor="show_email" className="text-sm text-gray-700">
              Show email publicly
            </label>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="show_phone"
              name="show_phone"
              value="true"
              defaultChecked={profile.show_phone || false}
              className="h-4 w-4 rounded border-gray-300 text-teal focus:ring-teal"
            />
            <label htmlFor="show_phone" className="text-sm text-gray-700">
              Show phone publicly
            </label>
          </div>
        </div>
      </div>

      {/* Social Links */}
      <div className="rounded-lg bg-white p-6 shadow">
        <h2 className="mb-4 text-xl font-semibold text-gray-900">Social Links</h2>
        <div className="space-y-4">
          <div>
            <label htmlFor="linkedin_url" className="block text-sm font-medium text-gray-700">
              LinkedIn
            </label>
            <input
              type="url"
              id="linkedin_url"
              name="linkedin_url"
              defaultValue={profile.linkedin_url || ''}
              placeholder="https://linkedin.com/in/username"
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-teal focus:outline-none focus:ring-teal sm:text-sm"
            />
          </div>

          <div>
            <label htmlFor="twitter_url" className="block text-sm font-medium text-gray-700">
              Twitter
            </label>
            <input
              type="url"
              id="twitter_url"
              name="twitter_url"
              defaultValue={profile.twitter_url || ''}
              placeholder="https://twitter.com/username"
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-teal focus:outline-none focus:ring-teal sm:text-sm"
            />
          </div>

          <div>
            <label htmlFor="website" className="block text-sm font-medium text-gray-700">
              Website
            </label>
            <input
              type="url"
              id="website"
              name="website"
              defaultValue={profile.website || ''}
              placeholder="https://example.com"
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-teal focus:outline-none focus:ring-teal sm:text-sm"
            />
          </div>
        </div>
      </div>

      {/* Entrepreneur-specific fields */}
      {isEntrepreneur && (
        <div className="rounded-lg bg-teal/5 p-6 shadow">
          <h2 className="mb-4 text-xl font-semibold text-gray-900">Company Information</h2>
          <div className="space-y-4">
            <div>
              <label htmlFor="company_name" className="block text-sm font-medium text-gray-700">
                Company Name
              </label>
              <input
                type="text"
                id="company_name"
                name="company_name"
                defaultValue={profile.company_name || ''}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-teal focus:outline-none focus:ring-teal sm:text-sm"
              />
            </div>

            <div>
              <label htmlFor="company_stage" className="block text-sm font-medium text-gray-700">
                Company Stage
              </label>
              <select
                id="company_stage"
                name="company_stage"
                defaultValue={profile.company_stage || ''}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-teal focus:outline-none focus:ring-teal sm:text-sm"
              >
                <option value="">Select stage...</option>
                <option value="idea">Idea</option>
                <option value="early">Early Stage</option>
                <option value="growth">Growth</option>
                <option value="established">Established</option>
              </select>
            </div>

            <div>
              <label htmlFor="industry" className="block text-sm font-medium text-gray-700">
                Industry
              </label>
              <input
                type="text"
                id="industry"
                name="industry"
                defaultValue={profile.industry || ''}
                placeholder="e.g., Technology, Healthcare, Finance"
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-teal focus:outline-none focus:ring-teal sm:text-sm"
              />
            </div>
          </div>
        </div>
      )}

      {/* Mentor-specific fields */}
      {isMentor && (
        <div className="rounded-lg bg-teal/5 p-6 shadow">
          <h2 className="mb-4 text-xl font-semibold text-gray-900">Mentor Information</h2>
          <div className="space-y-4">
            <div>
              <label htmlFor="years_experience" className="block text-sm font-medium text-gray-700">
                Years of Experience
              </label>
              <input
                type="number"
                id="years_experience"
                name="years_experience"
                min="0"
                max="100"
                defaultValue={profile.years_experience || ''}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-teal focus:outline-none focus:ring-teal sm:text-sm"
              />
            </div>

            <div>
              <label
                htmlFor="mentor_availability"
                className="block text-sm font-medium text-gray-700"
              >
                Availability
              </label>
              <select
                id="mentor_availability"
                name="mentor_availability"
                defaultValue={profile.mentor_availability || ''}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-teal focus:outline-none focus:ring-teal sm:text-sm"
              >
                <option value="">Select availability...</option>
                <option value="available">Available</option>
                <option value="limited">Limited Availability</option>
                <option value="unavailable">Unavailable</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Privacy Settings */}
      <div className="rounded-lg bg-white p-6 shadow">
        <h2 className="mb-4 text-xl font-semibold text-gray-900">Privacy</h2>
        <div>
          <label htmlFor="profile_visibility" className="block text-sm font-medium text-gray-700">
            Profile Visibility <span className="text-red-500">*</span>
          </label>
          <select
            id="profile_visibility"
            name="profile_visibility"
            defaultValue={profile.profile_visibility || 'members_only'}
            required
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-teal focus:outline-none focus:ring-teal sm:text-sm"
          >
            <option value="public">Public - Anyone can see your profile</option>
            <option value="members_only">Members Only - Only Kilalo members can see</option>
            <option value="private">Private - Only you can see</option>
          </select>
        </div>
      </div>

      {/* Message */}
      {message && (
        <div
          className={`rounded-lg p-4 ${
            message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Actions */}
      <div className="flex justify-end gap-3">
        <Button type="button" variant="outline" disabled={isSaving}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSaving}>
          {isSaving ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>
    </form>
  )
}

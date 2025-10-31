import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import LanguagePreference from '@/components/member/LanguagePreference'
import SecuritySection from '@/components/member/SecuritySection'
import DangerZone from '@/components/member/DangerZone'

export default async function SettingsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect(`/${locale}/login`)
  }

  // Fetch user profile
  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()

  // Format date
  const memberSince = user.created_at
    ? new Date(user.created_at).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : 'Unknown'

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="mb-8 text-3xl font-bold text-gray-900">Account Settings</h1>

      <div className="space-y-6">
        {/* Account Information */}
        <div className="rounded-lg bg-white p-6 shadow">
          <h2 className="mb-4 text-xl font-semibold text-gray-900">Account Information</h2>
          <div className="space-y-3">
            <div className="flex justify-between border-b border-gray-100 py-2">
              <span className="text-sm font-medium text-gray-500">Email</span>
              <span className="text-sm text-gray-900">{user.email}</span>
            </div>
            <div className="flex justify-between border-b border-gray-100 py-2">
              <span className="text-sm font-medium text-gray-500">Member since</span>
              <span className="text-sm text-gray-900">{memberSince}</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-sm font-medium text-gray-500">User Type</span>
              <span className="text-sm capitalize text-gray-900">
                {profile?.user_type?.replace('_', ' ') || 'Community Member'}
              </span>
            </div>
          </div>
        </div>

        {/* Preferences */}
        <div className="rounded-lg bg-white p-6 shadow">
          <h2 className="mb-4 text-xl font-semibold text-gray-900">Preferences</h2>
          <LanguagePreference currentLocale={locale} />
        </div>

        {/* Security */}
        <SecuritySection />

        {/* Danger Zone */}
        <DangerZone locale={locale} />
      </div>
    </div>
  )
}

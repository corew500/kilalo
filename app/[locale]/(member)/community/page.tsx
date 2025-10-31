import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function CommunityPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect(`/${locale}/login`)
  }

  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="mb-8 text-3xl font-bold text-gray-900">Community Hub</h1>

      <div className="space-y-6">
        {/* Event Registrations */}
        <div className="rounded-lg bg-white p-6 shadow">
          <h2 className="mb-4 text-xl font-semibold text-gray-900">Your Events</h2>
          <p className="text-sm text-gray-600">View and manage your event registrations.</p>
          <div className="mt-4 rounded-md bg-gray-50 p-4">
            <p className="text-sm text-gray-500">No registered events</p>
            <p className="mt-1 text-xs text-gray-400">Event registration features coming soon</p>
          </div>
        </div>

        {/* Learning Resources */}
        <div className="rounded-lg bg-white p-6 shadow">
          <h2 className="mb-4 text-xl font-semibold text-gray-900">Learning Resources</h2>
          <p className="text-sm text-gray-600">
            Access educational materials and community resources.
          </p>
          <div className="mt-4 rounded-md bg-gray-50 p-4">
            <p className="text-sm text-gray-500">No resources available</p>
            <p className="mt-1 text-xs text-gray-400">Learning resources library coming soon</p>
          </div>
        </div>

        {/* Community Directory */}
        <div className="rounded-lg bg-white p-6 shadow">
          <h2 className="mb-4 text-xl font-semibold text-gray-900">Community Directory</h2>
          <p className="text-sm text-gray-600">
            Connect with other members of the Kilalo community.
          </p>
          <div className="mt-4 rounded-md bg-gray-50 p-4">
            <p className="text-sm text-gray-500">Directory not available</p>
            <p className="mt-1 text-xs text-gray-400">Community directory features coming soon</p>
          </div>
        </div>
      </div>
    </div>
  )
}

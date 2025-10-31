import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function MentorPage({ params }: { params: Promise<{ locale: string }> }) {
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

  // Redirect if not a mentor
  if (profile?.user_type !== 'mentor') {
    redirect(`/${locale}/dashboard`)
  }

  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="mb-8 text-3xl font-bold text-gray-900">Mentor Portal</h1>

      <div className="space-y-6">
        {/* Expertise & Availability */}
        <div className="rounded-lg bg-white p-6 shadow">
          <h2 className="mb-4 text-xl font-semibold text-gray-900">Expertise & Availability</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <p className="text-sm font-medium text-gray-500">Areas of Expertise</p>
              <p className="mt-1 text-base text-gray-900">
                {profile?.expertise_areas || 'Not set'}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Availability</p>
              <p className="mt-1 text-base capitalize text-gray-900">
                {profile?.mentor_availability || 'Not set'}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Years of Experience</p>
              <p className="mt-1 text-base text-gray-900">
                {profile?.years_experience || 'Not set'}
              </p>
            </div>
          </div>
        </div>

        {/* Mentee Connections */}
        <div className="rounded-lg bg-white p-6 shadow">
          <h2 className="mb-4 text-xl font-semibold text-gray-900">Your Mentees</h2>
          <p className="text-sm text-gray-600">View and manage your mentee relationships.</p>
          <div className="mt-4 rounded-md bg-gray-50 p-4">
            <p className="text-sm text-gray-500">No active mentees</p>
            <p className="mt-1 text-xs text-gray-400">Mentee matching features coming soon</p>
          </div>
        </div>

        {/* Session Scheduling */}
        <div className="rounded-lg bg-white p-6 shadow">
          <h2 className="mb-4 text-xl font-semibold text-gray-900">Scheduled Sessions</h2>
          <p className="text-sm text-gray-600">
            Manage your upcoming mentoring sessions and availability.
          </p>
          <div className="mt-4 rounded-md bg-gray-50 p-4">
            <p className="text-sm text-gray-500">No upcoming sessions</p>
            <p className="mt-1 text-xs text-gray-400">Session scheduling features coming soon</p>
          </div>
        </div>
      </div>
    </div>
  )
}

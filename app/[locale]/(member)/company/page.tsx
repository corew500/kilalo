import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function CompanyPage({ params }: { params: Promise<{ locale: string }> }) {
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

  // Redirect if not an entrepreneur
  if (profile?.user_type !== 'entrepreneur') {
    redirect(`/${locale}/dashboard`)
  }

  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="mb-8 text-3xl font-bold text-gray-900">My Company</h1>

      <div className="space-y-6">
        {/* Company Overview */}
        <div className="rounded-lg bg-white p-6 shadow">
          <h2 className="mb-4 text-xl font-semibold text-gray-900">Company Overview</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <p className="text-sm font-medium text-gray-500">Company Name</p>
              <p className="mt-1 text-base text-gray-900">{profile?.company_name || 'Not set'}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Stage</p>
              <p className="mt-1 text-base capitalize text-gray-900">
                {profile?.company_stage?.replace('_', ' ') || 'Not set'}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Industry</p>
              <p className="mt-1 text-base text-gray-900">{profile?.industry || 'Not set'}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Website</p>
              {profile?.website ? (
                <a
                  href={profile.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1 text-base text-teal hover:underline"
                >
                  {profile.website}
                </a>
              ) : (
                <p className="mt-1 text-base text-gray-900">Not set</p>
              )}
            </div>
          </div>
        </div>

        {/* Program Enrollment */}
        <div className="rounded-lg bg-white p-6 shadow">
          <h2 className="mb-4 text-xl font-semibold text-gray-900">Program Enrollment</h2>
          <p className="text-sm text-gray-600">
            View your current programs and track your progress.
          </p>
          <div className="mt-4 rounded-md bg-gray-50 p-4">
            <p className="text-sm text-gray-500">No active programs</p>
            <p className="mt-1 text-xs text-gray-400">Program enrollment features coming soon</p>
          </div>
        </div>

        {/* Resources */}
        <div className="rounded-lg bg-white p-6 shadow">
          <h2 className="mb-4 text-xl font-semibold text-gray-900">Resources & Tools</h2>
          <p className="text-sm text-gray-600">
            Access tools and resources to help grow your business.
          </p>
          <div className="mt-4 rounded-md bg-gray-50 p-4">
            <p className="text-sm text-gray-500">No resources available</p>
            <p className="mt-1 text-xs text-gray-400">Resource library coming soon</p>
          </div>
        </div>
      </div>
    </div>
  )
}

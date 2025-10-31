import { createClient } from '@/lib/supabase/server'

export default async function DashboardPage({ params }: { params: Promise<{ locale: string }> }) {
  await params
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return null // Layout handles redirect
  }

  // Fetch profile with user type
  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()

  const userType = profile?.user_type || 'community_member'
  const fullName = profile?.full_name || 'Member'

  return (
    <div className="space-y-8">
      {/* Welcome header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome back, {fullName.split(' ')[0]}!
        </h1>
        <p className="mt-2 text-gray-600">
          {userType === 'entrepreneur'
            ? 'Track your progress and connect with mentors'
            : userType === 'mentor'
              ? 'Manage your mentees and upcoming sessions'
              : 'Explore events and connect with the community'}
        </p>
      </div>

      {/* Simple status card */}
      <div className="rounded-lg bg-white p-6 shadow">
        <h2 className="mb-4 text-xl font-semibold">Your Portal</h2>
        <p className="text-gray-600">
          Member portal is now live! Use the sidebar to navigate to different sections.
        </p>
        <p className="mt-2 text-sm text-gray-500">
          Role: <span className="capitalize">{userType.replace('_', ' ')}</span>
        </p>
      </div>
    </div>
  )
}

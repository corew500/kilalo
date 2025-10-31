import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import MemberSidebar from '@/components/member/MemberSidebar'
import MemberHeader from '@/components/member/MemberHeader'

export default async function MemberLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect(`/${locale}/login`)
  }

  // Fetch user profile with user_type
  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar - hidden on mobile, shown on desktop */}
      <MemberSidebar locale={locale} profile={profile} />

      {/* Main content area */}
      <div className="flex flex-1 flex-col lg:pl-64">
        {/* Header with mobile menu */}
        <MemberHeader locale={locale} profile={profile} user={user} />

        {/* Page content */}
        <main className="flex-1 px-4 py-8 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  )
}

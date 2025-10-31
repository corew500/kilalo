'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  User,
  Settings,
  Building2,
  GraduationCap,
  Users,
  Calendar,
  BookOpen,
  UsersRound,
} from 'lucide-react'

interface MemberSidebarProps {
  locale: string
  profile: {
    user_type?: string | null
    full_name?: string | null
    avatar_url?: string | null
  } | null
}

export default function MemberSidebar({ locale, profile }: MemberSidebarProps) {
  const pathname = usePathname()

  // Common navigation items for all users
  const commonNavItems = [
    {
      name: 'Dashboard',
      href: `/${locale}/dashboard`,
      icon: LayoutDashboard,
    },
    {
      name: 'My Profile',
      href: `/${locale}/profile`,
      icon: User,
    },
    {
      name: 'Settings',
      href: `/${locale}/settings`,
      icon: Settings,
    },
  ]

  // Entrepreneur-specific navigation
  const entrepreneurNavItems = [
    {
      name: 'My Company',
      href: `/${locale}/company`,
      icon: Building2,
    },
    {
      name: 'My Program',
      href: `/${locale}/program`,
      icon: GraduationCap,
    },
    {
      name: 'Find Mentors',
      href: `/${locale}/mentors`,
      icon: Users,
    },
    {
      name: 'Resources',
      href: `/${locale}/resources`,
      icon: BookOpen,
    },
  ]

  // Mentor-specific navigation
  const mentorNavItems = [
    {
      name: 'My Expertise',
      href: `/${locale}/expertise`,
      icon: GraduationCap,
    },
    {
      name: 'My Mentees',
      href: `/${locale}/mentees`,
      icon: UsersRound,
    },
    {
      name: 'Sessions',
      href: `/${locale}/sessions`,
      icon: Calendar,
    },
  ]

  // Community member navigation
  const communityNavItems = [
    {
      name: 'Events',
      href: `/${locale}/events`,
      icon: Calendar,
    },
    {
      name: 'Community',
      href: `/${locale}/community`,
      icon: UsersRound,
    },
    {
      name: 'Resources',
      href: `/${locale}/resources`,
      icon: BookOpen,
    },
  ]

  // Build navigation based on user type
  const roleNavItems =
    profile?.user_type === 'entrepreneur'
      ? entrepreneurNavItems
      : profile?.user_type === 'mentor'
        ? mentorNavItems
        : communityNavItems

  const allNavItems = [...commonNavItems, ...roleNavItems]

  return (
    <aside className="fixed inset-y-0 left-0 z-50 hidden w-64 border-r border-gray-200 bg-white lg:block">
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className="flex h-16 items-center px-6">
          <Link href={`/${locale}`} className="text-xl font-bold text-teal">
            Kilalo
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 px-3 py-4">
          {allNavItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-teal/10 text-teal'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-teal'
                )}
              >
                <Icon className="h-5 w-5" />
                {item.name}
              </Link>
            )
          })}
        </nav>

        {/* User info at bottom */}
        <div className="border-t border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-teal/10 text-teal">
              {profile?.full_name?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="truncate text-sm font-medium text-gray-900">
                {profile?.full_name || 'User'}
              </p>
              <p className="truncate text-xs capitalize text-gray-500">
                {profile?.user_type?.replace('_', ' ') || 'Member'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  )
}

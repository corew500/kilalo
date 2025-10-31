'use client'

import { useState } from 'react'
import { Menu, X, LogOut } from 'lucide-react'
import { logout } from '@/app/[locale]/(auth)/actions'
import { Button } from '@/components/ui/button'
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

interface MemberHeaderProps {
  locale: string
  profile: {
    user_type?: string | null
    full_name?: string | null
  } | null
  user: {
    email?: string
  }
}

export default function MemberHeader({ locale, profile, user }: MemberHeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  const commonNavItems = [
    { name: 'Dashboard', href: `/${locale}/dashboard`, icon: LayoutDashboard },
    { name: 'My Profile', href: `/${locale}/profile`, icon: User },
    { name: 'Settings', href: `/${locale}/settings`, icon: Settings },
  ]

  const entrepreneurNavItems = [
    { name: 'My Company', href: `/${locale}/company`, icon: Building2 },
    { name: 'My Program', href: `/${locale}/program`, icon: GraduationCap },
    { name: 'Find Mentors', href: `/${locale}/mentors`, icon: Users },
    { name: 'Resources', href: `/${locale}/resources`, icon: BookOpen },
  ]

  const mentorNavItems = [
    { name: 'My Expertise', href: `/${locale}/expertise`, icon: GraduationCap },
    { name: 'My Mentees', href: `/${locale}/mentees`, icon: UsersRound },
    { name: 'Sessions', href: `/${locale}/sessions`, icon: Calendar },
  ]

  const communityNavItems = [
    { name: 'Events', href: `/${locale}/events`, icon: Calendar },
    { name: 'Community', href: `/${locale}/community`, icon: UsersRound },
    { name: 'Resources', href: `/${locale}/resources`, icon: BookOpen },
  ]

  const roleNavItems =
    profile?.user_type === 'entrepreneur'
      ? entrepreneurNavItems
      : profile?.user_type === 'mentor'
        ? mentorNavItems
        : communityNavItems

  const allNavItems = [...commonNavItems, ...roleNavItems]

  return (
    <>
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-gray-200 bg-white lg:z-30">
        <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Mobile menu button */}
          <button
            type="button"
            className="lg:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6 text-gray-600" />
            ) : (
              <Menu className="h-6 w-6 text-gray-600" />
            )}
          </button>

          {/* Logo on mobile */}
          <Link href={`/${locale}`} className="text-xl font-bold text-teal lg:hidden">
            Kilalo
          </Link>

          {/* Right side - Logout button */}
          <form action={logout.bind(null, locale)}>
            <Button
              type="submit"
              variant="ghost"
              size="sm"
              className="flex items-center gap-2 text-gray-700"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Sign Out</span>
            </Button>
          </form>
        </div>
      </header>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-gray-600/75 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        >
          <div
            className="fixed inset-y-0 left-0 w-64 bg-white"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex h-full flex-col">
              {/* Logo */}
              <div className="flex h-16 items-center border-b border-gray-200 px-6">
                <Link
                  href={`/${locale}`}
                  className="text-xl font-bold text-teal"
                  onClick={() => setMobileMenuOpen(false)}
                >
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
                      onClick={() => setMobileMenuOpen(false)}
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

              {/* User info */}
              <div className="border-t border-gray-200 p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-teal/10 text-teal">
                    {profile?.full_name?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <p className="truncate text-sm font-medium text-gray-900">
                      {profile?.full_name || 'User'}
                    </p>
                    <p className="truncate text-xs text-gray-500">{user?.email}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

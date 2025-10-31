import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import SettingsPage from '../page'
import { createClient } from '@/lib/supabase/server'

// Mock Supabase client
vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(),
}))

// Mock next/navigation
vi.mock('next/navigation', () => ({
  redirect: vi.fn(),
  useRouter: vi.fn(() => ({
    push: vi.fn(),
    replace: vi.fn(),
    refresh: vi.fn(),
  })),
  usePathname: vi.fn(() => '/en/settings'),
}))

describe('SettingsPage', () => {
  const mockUser = {
    id: 'user-123',
    email: 'test@example.com',
    created_at: '2024-01-15T10:00:00Z',
  }

  const mockProfile = {
    id: 'user-123',
    user_type: 'entrepreneur',
    full_name: 'Test User',
  }

  beforeEach(() => {
    vi.clearAllMocks()

    const mockSupabase = {
      auth: {
        getUser: vi.fn().mockResolvedValue({ data: { user: mockUser } }),
      },
      from: vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({ data: mockProfile }),
          }),
        }),
      }),
    }

    ;(createClient as any).mockResolvedValue(mockSupabase)
  })

  it('renders account information section', async () => {
    const params = Promise.resolve({ locale: 'en' })
    const component = await SettingsPage({ params })
    render(component)

    expect(screen.getByText('Account Settings')).toBeInTheDocument()
    expect(screen.getByText('Account Information')).toBeInTheDocument()
  })

  it('displays user email', async () => {
    const params = Promise.resolve({ locale: 'en' })
    const component = await SettingsPage({ params })
    render(component)

    expect(screen.getByText('test@example.com')).toBeInTheDocument()
  })

  it('displays formatted member since date', async () => {
    const params = Promise.resolve({ locale: 'en' })
    const component = await SettingsPage({ params })
    render(component)

    expect(screen.getByText(/January 15, 2024/)).toBeInTheDocument()
  })

  it('displays user type with formatting', async () => {
    const params = Promise.resolve({ locale: 'en' })
    const component = await SettingsPage({ params })
    render(component)

    // "entrepreneur" should be displayed as "entrepreneur" (underscore replaced)
    expect(screen.getByText('entrepreneur')).toBeInTheDocument()
  })

  it('shows placeholder sections for upcoming features', async () => {
    const params = Promise.resolve({ locale: 'en' })
    const component = await SettingsPage({ params })
    render(component)

    expect(screen.getByText('Preferences')).toBeInTheDocument()
    expect(screen.getByText('Security')).toBeInTheDocument()
    expect(screen.getByText('Danger Zone')).toBeInTheDocument()
  })

  it('handles missing user type gracefully', async () => {
    const mockSupabase = {
      auth: {
        getUser: vi.fn().mockResolvedValue({ data: { user: mockUser } }),
      },
      from: vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({ data: { ...mockProfile, user_type: null } }),
          }),
        }),
      }),
    }

    ;(createClient as any).mockResolvedValue(mockSupabase)

    const params = Promise.resolve({ locale: 'en' })
    const component = await SettingsPage({ params })
    render(component)

    expect(screen.getByText('Community Member')).toBeInTheDocument()
  })
})

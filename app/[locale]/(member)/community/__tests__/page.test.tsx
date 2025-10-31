import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { redirect } from 'next/navigation'
import CommunityPage from '../page'
import { createClient } from '@/lib/supabase/server'

// Mock dependencies
vi.mock('next/navigation', () => ({
  redirect: vi.fn(),
}))

vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(),
}))

describe('CommunityPage', () => {
  const mockUser = {
    id: 'user-123',
    email: 'community@example.com',
  }

  const mockProfile = {
    id: 'user-123',
    user_type: 'community_member',
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

  it('redirects to login if user is not authenticated', async () => {
    const mockSupabase = {
      auth: {
        getUser: vi.fn().mockResolvedValue({ data: { user: null } }),
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
    vi.mocked(redirect).mockImplementation(() => {
      throw new Error('NEXT_REDIRECT')
    })

    await expect(CommunityPage({ params: Promise.resolve({ locale: 'en' }) })).rejects.toThrow()

    expect(redirect).toHaveBeenCalledWith('/en/login')
  })

  it('renders community hub for any authenticated user', async () => {
    const params = Promise.resolve({ locale: 'en' })
    const component = await CommunityPage({ params })
    render(component)

    expect(screen.getByText('Community Hub')).toBeInTheDocument()
  })

  it('renders event registrations placeholder', async () => {
    const params = Promise.resolve({ locale: 'en' })
    const component = await CommunityPage({ params })
    render(component)

    expect(screen.getByText('Your Events')).toBeInTheDocument()
    expect(screen.getByText('No registered events')).toBeInTheDocument()
    expect(screen.getByText('Event registration features coming soon')).toBeInTheDocument()
  })

  it('renders learning resources placeholder', async () => {
    const params = Promise.resolve({ locale: 'en' })
    const component = await CommunityPage({ params })
    render(component)

    expect(screen.getByText('Learning Resources')).toBeInTheDocument()
    expect(screen.getByText('No resources available')).toBeInTheDocument()
    expect(screen.getByText('Learning resources library coming soon')).toBeInTheDocument()
  })

  it('renders community directory placeholder', async () => {
    const params = Promise.resolve({ locale: 'en' })
    const component = await CommunityPage({ params })
    render(component)

    expect(screen.getByText('Community Directory')).toBeInTheDocument()
    expect(screen.getByText('Directory not available')).toBeInTheDocument()
    expect(screen.getByText('Community directory features coming soon')).toBeInTheDocument()
  })
})

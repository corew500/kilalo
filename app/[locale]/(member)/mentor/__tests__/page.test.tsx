import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { redirect } from 'next/navigation'
import MentorPage from '../page'
import { createClient } from '@/lib/supabase/server'

// Mock dependencies
vi.mock('next/navigation', () => ({
  redirect: vi.fn(),
}))

vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(),
}))

describe('MentorPage', () => {
  const mockUser = {
    id: 'user-123',
    email: 'mentor@example.com',
  }

  const mockProfile = {
    id: 'user-123',
    user_type: 'mentor',
    expertise_areas: 'Technology, Finance',
    mentor_availability: 'available',
    years_experience: 10,
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

    await expect(MentorPage({ params: Promise.resolve({ locale: 'en' }) })).rejects.toThrow()

    expect(redirect).toHaveBeenCalledWith('/en/login')
  })

  it('redirects to dashboard if user is not a mentor', async () => {
    const mockSupabase = {
      auth: {
        getUser: vi.fn().mockResolvedValue({ data: { user: mockUser } }),
      },
      from: vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi
              .fn()
              .mockResolvedValue({ data: { ...mockProfile, user_type: 'entrepreneur' } }),
          }),
        }),
      }),
    }

    ;(createClient as any).mockResolvedValue(mockSupabase)
    vi.mocked(redirect).mockImplementation(() => {
      throw new Error('NEXT_REDIRECT')
    })

    await expect(MentorPage({ params: Promise.resolve({ locale: 'en' }) })).rejects.toThrow()

    expect(redirect).toHaveBeenCalledWith('/en/dashboard')
  })

  it('renders mentor portal for mentor', async () => {
    const params = Promise.resolve({ locale: 'en' })
    const component = await MentorPage({ params })
    render(component)

    expect(screen.getByText('Mentor Portal')).toBeInTheDocument()
    expect(screen.getByText('Expertise & Availability')).toBeInTheDocument()
    expect(screen.getByText('Technology, Finance')).toBeInTheDocument()
    expect(screen.getByText('available')).toBeInTheDocument()
    expect(screen.getByText('10')).toBeInTheDocument()
  })

  it('shows "Not set" for missing mentor data', async () => {
    const mockSupabase = {
      auth: {
        getUser: vi.fn().mockResolvedValue({ data: { user: mockUser } }),
      },
      from: vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({
              data: {
                ...mockProfile,
                expertise_areas: null,
                mentor_availability: null,
                years_experience: null,
              },
            }),
          }),
        }),
      }),
    }

    ;(createClient as any).mockResolvedValue(mockSupabase)

    const params = Promise.resolve({ locale: 'en' })
    const component = await MentorPage({ params })
    render(component)

    const notSetElements = screen.getAllByText('Not set')
    expect(notSetElements.length).toBeGreaterThanOrEqual(3)
  })

  it('renders mentee connections placeholder', async () => {
    const params = Promise.resolve({ locale: 'en' })
    const component = await MentorPage({ params })
    render(component)

    expect(screen.getByText('Your Mentees')).toBeInTheDocument()
    expect(screen.getByText('No active mentees')).toBeInTheDocument()
    expect(screen.getByText('Mentee matching features coming soon')).toBeInTheDocument()
  })

  it('renders session scheduling placeholder', async () => {
    const params = Promise.resolve({ locale: 'en' })
    const component = await MentorPage({ params })
    render(component)

    expect(screen.getByText('Scheduled Sessions')).toBeInTheDocument()
    expect(screen.getByText('No upcoming sessions')).toBeInTheDocument()
    expect(screen.getByText('Session scheduling features coming soon')).toBeInTheDocument()
  })
})

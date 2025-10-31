import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { redirect } from 'next/navigation'
import CompanyPage from '../page'
import { createClient } from '@/lib/supabase/server'

// Mock dependencies
vi.mock('next/navigation', () => ({
  redirect: vi.fn(),
}))

vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(),
}))

describe('CompanyPage', () => {
  const mockUser = {
    id: 'user-123',
    email: 'entrepreneur@example.com',
  }

  const mockProfile = {
    id: 'user-123',
    user_type: 'entrepreneur',
    company_name: 'Test Company',
    company_stage: 'growth',
    industry: 'Technology',
    website: 'https://example.com',
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

    await expect(CompanyPage({ params: Promise.resolve({ locale: 'en' }) })).rejects.toThrow()

    expect(redirect).toHaveBeenCalledWith('/en/login')
  })

  it('redirects to dashboard if user is not an entrepreneur', async () => {
    const mockSupabase = {
      auth: {
        getUser: vi.fn().mockResolvedValue({ data: { user: mockUser } }),
      },
      from: vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({ data: { ...mockProfile, user_type: 'mentor' } }),
          }),
        }),
      }),
    }

    ;(createClient as any).mockResolvedValue(mockSupabase)
    vi.mocked(redirect).mockImplementation(() => {
      throw new Error('NEXT_REDIRECT')
    })

    await expect(CompanyPage({ params: Promise.resolve({ locale: 'en' }) })).rejects.toThrow()

    expect(redirect).toHaveBeenCalledWith('/en/dashboard')
  })

  it('renders company overview for entrepreneur', async () => {
    const params = Promise.resolve({ locale: 'en' })
    const component = await CompanyPage({ params })
    render(component)

    expect(screen.getByText('My Company')).toBeInTheDocument()
    expect(screen.getByText('Company Overview')).toBeInTheDocument()
    expect(screen.getByText('Test Company')).toBeInTheDocument()
    expect(screen.getByText('growth')).toBeInTheDocument()
    expect(screen.getByText('Technology')).toBeInTheDocument()
    expect(screen.getByText('https://example.com')).toBeInTheDocument()
  })

  it('shows "Not set" for missing company data', async () => {
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
                company_name: null,
                company_stage: null,
                industry: null,
                website: null,
              },
            }),
          }),
        }),
      }),
    }

    ;(createClient as any).mockResolvedValue(mockSupabase)

    const params = Promise.resolve({ locale: 'en' })
    const component = await CompanyPage({ params })
    render(component)

    const notSetElements = screen.getAllByText('Not set')
    expect(notSetElements.length).toBeGreaterThanOrEqual(4)
  })

  it('renders program enrollment placeholder', async () => {
    const params = Promise.resolve({ locale: 'en' })
    const component = await CompanyPage({ params })
    render(component)

    expect(screen.getByText('Program Enrollment')).toBeInTheDocument()
    expect(screen.getByText('No active programs')).toBeInTheDocument()
    expect(screen.getByText('Program enrollment features coming soon')).toBeInTheDocument()
  })

  it('renders resources placeholder', async () => {
    const params = Promise.resolve({ locale: 'en' })
    const component = await CompanyPage({ params })
    render(component)

    expect(screen.getByText('Resources & Tools')).toBeInTheDocument()
    expect(screen.getByText('No resources available')).toBeInTheDocument()
    expect(screen.getByText('Resource library coming soon')).toBeInTheDocument()
  })

  it('renders website as clickable link when provided', async () => {
    const params = Promise.resolve({ locale: 'en' })
    const component = await CompanyPage({ params })
    render(component)

    const link = screen.getByRole('link', { name: 'https://example.com' })
    expect(link).toHaveAttribute('href', 'https://example.com')
    expect(link).toHaveAttribute('target', '_blank')
    expect(link).toHaveAttribute('rel', 'noopener noreferrer')
  })
})

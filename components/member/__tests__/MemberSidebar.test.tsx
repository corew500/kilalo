import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import MemberSidebar from '../MemberSidebar'

// Mock next/navigation
const mockUsePathname = vi.fn(() => '/en/dashboard')
vi.mock('next/navigation', () => ({
  usePathname: () => mockUsePathname(),
}))

describe('MemberSidebar', () => {
  beforeEach(() => {
    mockUsePathname.mockReturnValue('/en/dashboard')
  })

  const baseProfile = {
    full_name: 'John Doe',
    avatar_url: null,
  }

  describe('Common navigation items', () => {
    it('renders common navigation items for all users', () => {
      render(
        <MemberSidebar locale="en" profile={{ ...baseProfile, user_type: 'community_member' }} />
      )

      expect(screen.getByText('Dashboard')).toBeInTheDocument()
      expect(screen.getByText('My Profile')).toBeInTheDocument()
      expect(screen.getByText('Settings')).toBeInTheDocument()
    })

    it('renders Kilalo logo link', () => {
      render(
        <MemberSidebar locale="en" profile={{ ...baseProfile, user_type: 'community_member' }} />
      )

      const logoLink = screen.getByText('Kilalo')
      expect(logoLink).toBeInTheDocument()
      expect(logoLink.closest('a')).toHaveAttribute('href', '/en')
    })

    it('displays user name and type at bottom', () => {
      render(<MemberSidebar locale="en" profile={{ ...baseProfile, user_type: 'entrepreneur' }} />)

      expect(screen.getByText('John Doe')).toBeInTheDocument()
      expect(screen.getByText('entrepreneur')).toBeInTheDocument()
    })

    it('handles missing user name gracefully', () => {
      render(
        <MemberSidebar
          locale="en"
          profile={{ ...baseProfile, full_name: null, user_type: 'mentor' }}
        />
      )

      expect(screen.getByText('User')).toBeInTheDocument()
      expect(screen.getByText('U')).toBeInTheDocument() // Avatar initial
    })
  })

  describe('Entrepreneur-specific navigation', () => {
    it('renders entrepreneur navigation items', () => {
      render(<MemberSidebar locale="en" profile={{ ...baseProfile, user_type: 'entrepreneur' }} />)

      expect(screen.getByText('My Company')).toBeInTheDocument()
      expect(screen.getByText('My Program')).toBeInTheDocument()
      expect(screen.getByText('Find Mentors')).toBeInTheDocument()
      expect(screen.getByText('Resources')).toBeInTheDocument()
    })

    it('does not render mentor-specific items for entrepreneur', () => {
      render(<MemberSidebar locale="en" profile={{ ...baseProfile, user_type: 'entrepreneur' }} />)

      expect(screen.queryByText('My Expertise')).not.toBeInTheDocument()
      expect(screen.queryByText('My Mentees')).not.toBeInTheDocument()
      expect(screen.queryByText('Sessions')).not.toBeInTheDocument()
    })
  })

  describe('Mentor-specific navigation', () => {
    it('renders mentor navigation items', () => {
      render(<MemberSidebar locale="en" profile={{ ...baseProfile, user_type: 'mentor' }} />)

      expect(screen.getByText('My Expertise')).toBeInTheDocument()
      expect(screen.getByText('My Mentees')).toBeInTheDocument()
      expect(screen.getByText('Sessions')).toBeInTheDocument()
    })

    it('does not render entrepreneur-specific items for mentor', () => {
      render(<MemberSidebar locale="en" profile={{ ...baseProfile, user_type: 'mentor' }} />)

      expect(screen.queryByText('My Company')).not.toBeInTheDocument()
      expect(screen.queryByText('My Program')).not.toBeInTheDocument()
      expect(screen.queryByText('Find Mentors')).not.toBeInTheDocument()
    })
  })

  describe('Community member navigation', () => {
    it('renders community member navigation items', () => {
      render(
        <MemberSidebar locale="en" profile={{ ...baseProfile, user_type: 'community_member' }} />
      )

      expect(screen.getByText('Events')).toBeInTheDocument()
      expect(screen.getByText('Community')).toBeInTheDocument()
      expect(screen.getByText('Resources')).toBeInTheDocument()
    })

    it('defaults to community navigation when user_type is null', () => {
      render(<MemberSidebar locale="en" profile={{ ...baseProfile, user_type: null }} />)

      expect(screen.getByText('Events')).toBeInTheDocument()
      expect(screen.getByText('Community')).toBeInTheDocument()
    })
  })

  describe('Active link highlighting', () => {
    it('highlights the active link', () => {
      mockUsePathname.mockReturnValue('/en/dashboard')

      render(
        <MemberSidebar locale="en" profile={{ ...baseProfile, user_type: 'community_member' }} />
      )

      const dashboardLink = screen.getByText('Dashboard').closest('a')
      const profileLink = screen.getByText('My Profile').closest('a')

      expect(dashboardLink).toHaveClass('bg-teal/10', 'text-teal')
      expect(profileLink).not.toHaveClass('bg-teal/10')
    })
  })

  describe('Locale support', () => {
    it('generates correct href paths for French locale', () => {
      render(<MemberSidebar locale="fr" profile={{ ...baseProfile, user_type: 'entrepreneur' }} />)

      const dashboardLink = screen.getByText('Dashboard').closest('a')
      const companyLink = screen.getByText('My Company').closest('a')

      expect(dashboardLink).toHaveAttribute('href', '/fr/dashboard')
      expect(companyLink).toHaveAttribute('href', '/fr/company')
    })
  })

  describe('User type formatting', () => {
    it('formats community_member with space', () => {
      render(
        <MemberSidebar locale="en" profile={{ ...baseProfile, user_type: 'community_member' }} />
      )

      expect(screen.getByText('community member')).toBeInTheDocument()
    })

    it('displays single-word user types correctly', () => {
      render(<MemberSidebar locale="en" profile={{ ...baseProfile, user_type: 'mentor' }} />)

      expect(screen.getByText('mentor')).toBeInTheDocument()
    })
  })
})

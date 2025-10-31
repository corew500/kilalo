import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ProfileForm from '../ProfileForm'
import * as profileActions from '@/app/[locale]/(member)/profile/actions'

// Mock profile actions
vi.mock('@/app/[locale]/(member)/profile/actions', () => ({
  updateProfile: vi.fn(),
}))

describe('ProfileForm', () => {
  const mockProfile = {
    full_name: 'John Doe',
    bio: 'Test bio',
    location: 'New York, USA',
    phone: '+1234567890',
    linkedin_url: 'https://linkedin.com/in/johndoe',
    twitter_url: '',
    website: 'https://johndoe.com',
    languages: ['en'],
    show_email: false,
    show_phone: true,
    profile_visibility: 'members_only',
    user_type: 'community_member',
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Basic Information Section', () => {
    it('renders basic information fields', () => {
      render(<ProfileForm profile={mockProfile} />)

      expect(screen.getByText('Basic Information')).toBeInTheDocument()
      expect(screen.getByLabelText(/Full Name/)).toBeInTheDocument()
      expect(screen.getByLabelText('Bio')).toBeInTheDocument()
      expect(screen.getByLabelText('Location')).toBeInTheDocument()
      expect(screen.getByLabelText(/Languages/)).toBeInTheDocument()
    })

    it('populates fields with profile data', () => {
      render(<ProfileForm profile={mockProfile} />)

      expect(screen.getByLabelText(/Full Name/)).toHaveValue('John Doe')
      expect(screen.getByLabelText('Bio')).toHaveValue('Test bio')
      expect(screen.getByLabelText('Location')).toHaveValue('New York, USA')
    })

    it('marks required fields', () => {
      render(<ProfileForm profile={mockProfile} />)

      const fullNameLabel = screen.getByText(/Full Name/)
      expect(fullNameLabel.innerHTML).toContain('*')
    })
  })

  describe('Contact Information Section', () => {
    it('renders contact fields', () => {
      render(<ProfileForm profile={mockProfile} />)

      expect(screen.getByText('Contact Information')).toBeInTheDocument()
      expect(screen.getByLabelText('Phone')).toBeInTheDocument()
      expect(screen.getByLabelText('Show email publicly')).toBeInTheDocument()
      expect(screen.getByLabelText('Show phone publicly')).toBeInTheDocument()
    })

    it('shows correct checkbox states', () => {
      render(<ProfileForm profile={mockProfile} />)

      expect(screen.getByLabelText('Show email publicly')).not.toBeChecked()
      expect(screen.getByLabelText('Show phone publicly')).toBeChecked()
    })
  })

  describe('Social Links Section', () => {
    it('renders social link fields', () => {
      render(<ProfileForm profile={mockProfile} />)

      expect(screen.getByText('Social Links')).toBeInTheDocument()
      expect(screen.getByLabelText('LinkedIn')).toBeInTheDocument()
      expect(screen.getByLabelText('Twitter')).toBeInTheDocument()
      expect(screen.getByLabelText('Website')).toBeInTheDocument()
    })

    it('populates social links', () => {
      render(<ProfileForm profile={mockProfile} />)

      expect(screen.getByLabelText('LinkedIn')).toHaveValue('https://linkedin.com/in/johndoe')
      expect(screen.getByLabelText('Website')).toHaveValue('https://johndoe.com')
    })
  })

  describe('Entrepreneur-specific fields', () => {
    it('shows entrepreneur fields for entrepreneurs', () => {
      const entrepreneurProfile = { ...mockProfile, user_type: 'entrepreneur' }
      render(<ProfileForm profile={entrepreneurProfile} />)

      expect(screen.getByText('Company Information')).toBeInTheDocument()
      expect(screen.getByLabelText('Company Name')).toBeInTheDocument()
      expect(screen.getByLabelText('Company Stage')).toBeInTheDocument()
      expect(screen.getByLabelText('Industry')).toBeInTheDocument()
    })

    it('does not show entrepreneur fields for non-entrepreneurs', () => {
      render(<ProfileForm profile={mockProfile} />)

      expect(screen.queryByText('Company Information')).not.toBeInTheDocument()
      expect(screen.queryByLabelText('Company Name')).not.toBeInTheDocument()
    })

    it('populates entrepreneur fields', () => {
      const entrepreneurProfile = {
        ...mockProfile,
        user_type: 'entrepreneur',
        company_name: 'Acme Inc',
        company_stage: 'growth',
        industry: 'Technology',
      }
      render(<ProfileForm profile={entrepreneurProfile} />)

      expect(screen.getByLabelText('Company Name')).toHaveValue('Acme Inc')
      expect(screen.getByLabelText('Company Stage')).toHaveValue('growth')
      expect(screen.getByLabelText('Industry')).toHaveValue('Technology')
    })
  })

  describe('Mentor-specific fields', () => {
    it('shows mentor fields for mentors', () => {
      const mentorProfile = { ...mockProfile, user_type: 'mentor' }
      render(<ProfileForm profile={mentorProfile} />)

      expect(screen.getByText('Mentor Information')).toBeInTheDocument()
      expect(screen.getByLabelText('Years of Experience')).toBeInTheDocument()
      expect(screen.getByLabelText('Availability')).toBeInTheDocument()
    })

    it('does not show mentor fields for non-mentors', () => {
      render(<ProfileForm profile={mockProfile} />)

      expect(screen.queryByText('Mentor Information')).not.toBeInTheDocument()
      expect(screen.queryByLabelText('Years of Experience')).not.toBeInTheDocument()
    })

    it('populates mentor fields', () => {
      const mentorProfile = {
        ...mockProfile,
        user_type: 'mentor',
        years_experience: 10,
        mentor_availability: 'available',
      }
      render(<ProfileForm profile={mentorProfile} />)

      expect(screen.getByLabelText('Years of Experience')).toHaveValue(10)
      expect(screen.getByLabelText('Availability')).toHaveValue('available')
    })
  })

  describe('Privacy Section', () => {
    it('renders privacy settings', () => {
      render(<ProfileForm profile={mockProfile} />)

      expect(screen.getByText('Privacy')).toBeInTheDocument()
      expect(screen.getByLabelText(/Profile Visibility/)).toBeInTheDocument()
    })

    it('shows correct visibility option', () => {
      render(<ProfileForm profile={mockProfile} />)

      expect(screen.getByLabelText(/Profile Visibility/)).toHaveValue('members_only')
    })
  })

  describe('Form Submission', () => {
    it('submits form with correct data', async () => {
      const mockUpdate = vi.fn().mockResolvedValue({ success: true })
      ;(profileActions.updateProfile as any) = mockUpdate

      const user = userEvent.setup()
      render(<ProfileForm profile={mockProfile} />)

      const saveButton = screen.getByRole('button', { name: /Save Changes/ })
      await user.click(saveButton)

      await waitFor(() => {
        expect(mockUpdate).toHaveBeenCalled()
      })
    })

    it('shows success message on successful save', async () => {
      const mockUpdate = vi.fn().mockResolvedValue({ success: true })
      ;(profileActions.updateProfile as any) = mockUpdate

      const user = userEvent.setup()
      render(<ProfileForm profile={mockProfile} />)

      const saveButton = screen.getByRole('button', { name: /Save Changes/ })
      await user.click(saveButton)

      await waitFor(() => {
        expect(screen.getByText('Profile updated successfully!')).toBeInTheDocument()
      })
    })

    it('shows error message on failed save', async () => {
      const mockUpdate = vi.fn().mockResolvedValue({ success: false, error: 'Update failed' })
      ;(profileActions.updateProfile as any) = mockUpdate

      const user = userEvent.setup()
      render(<ProfileForm profile={mockProfile} />)

      const saveButton = screen.getByRole('button', { name: /Save Changes/ })
      await user.click(saveButton)

      await waitFor(() => {
        expect(screen.getByText('Update failed')).toBeInTheDocument()
      })
    })

    it('disables buttons while saving', async () => {
      const mockUpdate = vi
        .fn()
        .mockImplementation(
          () => new Promise((resolve) => setTimeout(() => resolve({ success: true }), 100))
        )
      ;(profileActions.updateProfile as any) = mockUpdate

      const user = userEvent.setup()
      render(<ProfileForm profile={mockProfile} />)

      const saveButton = screen.getByRole('button', { name: /Save Changes/ })
      const cancelButton = screen.getByRole('button', { name: 'Cancel' })

      await user.click(saveButton)

      // Buttons should be disabled while saving
      expect(saveButton).toBeDisabled()
      expect(cancelButton).toBeDisabled()
      expect(screen.getByText('Saving...')).toBeInTheDocument()
    })
  })

  describe('Empty Profile Handling', () => {
    it('renders with empty profile', () => {
      render(<ProfileForm profile={{}} />)

      expect(screen.getByLabelText(/Full Name/)).toHaveValue('')
      expect(screen.getByLabelText('Bio')).toHaveValue('')
    })

    it('uses default values for checkboxes', () => {
      render(<ProfileForm profile={{}} />)

      expect(screen.getByLabelText('Show email publicly')).not.toBeChecked()
      expect(screen.getByLabelText('Show phone publicly')).not.toBeChecked()
    })
  })
})

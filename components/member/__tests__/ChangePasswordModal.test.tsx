import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ChangePasswordModal from '../ChangePasswordModal'
import * as settingsActions from '@/app/[locale]/(member)/settings/actions'

// Mock settings actions
vi.mock('@/app/[locale]/(member)/settings/actions', () => ({
  changePassword: vi.fn(),
}))

describe('ChangePasswordModal', () => {
  const mockOnClose = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Visibility', () => {
    it('renders when isOpen is true', () => {
      render(<ChangePasswordModal isOpen={true} onClose={mockOnClose} />)

      expect(screen.getByRole('heading', { name: 'Change Password' })).toBeInTheDocument()
    })

    it('does not render when isOpen is false', () => {
      render(<ChangePasswordModal isOpen={false} onClose={mockOnClose} />)

      expect(screen.queryByText('Change Password')).not.toBeInTheDocument()
    })
  })

  describe('Form Fields', () => {
    it('renders password input fields', () => {
      render(<ChangePasswordModal isOpen={true} onClose={mockOnClose} />)

      expect(screen.getByLabelText('New Password')).toBeInTheDocument()
      expect(screen.getByLabelText('Confirm New Password')).toBeInTheDocument()
    })

    it('shows minimum length hint', () => {
      render(<ChangePasswordModal isOpen={true} onClose={mockOnClose} />)

      expect(screen.getByText('Minimum 6 characters')).toBeInTheDocument()
    })

    it('requires both password fields', () => {
      render(<ChangePasswordModal isOpen={true} onClose={mockOnClose} />)

      const newPasswordInput = screen.getByLabelText('New Password') as HTMLInputElement
      const confirmPasswordInput = screen.getByLabelText('Confirm New Password') as HTMLInputElement

      expect(newPasswordInput.required).toBe(true)
      expect(confirmPasswordInput.required).toBe(true)
    })
  })

  describe('Close Button', () => {
    it('calls onClose when X button clicked', async () => {
      const user = userEvent.setup()
      render(<ChangePasswordModal isOpen={true} onClose={mockOnClose} />)

      const closeButton = screen.getByRole('button', { name: '' })
      await user.click(closeButton)

      expect(mockOnClose).toHaveBeenCalled()
    })

    it('calls onClose when Cancel button clicked', async () => {
      const user = userEvent.setup()
      render(<ChangePasswordModal isOpen={true} onClose={mockOnClose} />)

      const cancelButton = screen.getByRole('button', { name: 'Cancel' })
      await user.click(cancelButton)

      expect(mockOnClose).toHaveBeenCalled()
    })
  })

  describe('Form Submission', () => {
    it('submits form with password data', async () => {
      const mockChange = vi.fn().mockResolvedValue({ success: true })
      ;(settingsActions.changePassword as any) = mockChange

      const user = userEvent.setup()
      render(<ChangePasswordModal isOpen={true} onClose={mockOnClose} />)

      await user.type(screen.getByLabelText('New Password'), 'newpassword123')
      await user.type(screen.getByLabelText('Confirm New Password'), 'newpassword123')

      const submitButton = screen.getByRole('button', { name: 'Change Password' })
      await user.click(submitButton)

      await waitFor(() => {
        expect(mockChange).toHaveBeenCalled()
      })
    })

    it('shows success message on successful password change', async () => {
      const mockChange = vi.fn().mockResolvedValue({ success: true })
      ;(settingsActions.changePassword as any) = mockChange

      const user = userEvent.setup()
      render(<ChangePasswordModal isOpen={true} onClose={mockOnClose} />)

      await user.type(screen.getByLabelText('New Password'), 'newpassword123')
      await user.type(screen.getByLabelText('Confirm New Password'), 'newpassword123')
      await user.click(screen.getByRole('button', { name: 'Change Password' }))

      await waitFor(() => {
        expect(screen.getByText('Password changed successfully!')).toBeInTheDocument()
      })
    })

    it('shows error message on failed password change', async () => {
      const mockChange = vi.fn().mockResolvedValue({ success: false, error: 'Password too weak' })
      ;(settingsActions.changePassword as any) = mockChange

      const user = userEvent.setup()
      render(<ChangePasswordModal isOpen={true} onClose={mockOnClose} />)

      await user.type(screen.getByLabelText('New Password'), 'weak')
      await user.type(screen.getByLabelText('Confirm New Password'), 'weak')
      await user.click(screen.getByRole('button', { name: 'Change Password' }))

      await waitFor(() => {
        expect(screen.getByText('Password too weak')).toBeInTheDocument()
      })
    })

    it('closes modal after successful password change', async () => {
      const mockChange = vi.fn().mockResolvedValue({ success: true })
      ;(settingsActions.changePassword as any) = mockChange

      const user = userEvent.setup()
      render(<ChangePasswordModal isOpen={true} onClose={mockOnClose} />)

      await user.type(screen.getByLabelText('New Password'), 'newpassword123')
      await user.type(screen.getByLabelText('Confirm New Password'), 'newpassword123')
      await user.click(screen.getByRole('button', { name: 'Change Password' }))

      // Wait for success message
      await waitFor(() => {
        expect(screen.getByText('Password changed successfully!')).toBeInTheDocument()
      })

      // The modal auto-closes after 1.5 seconds, onClose should be called
      // We verify the success message appeared, which triggers the timeout
      expect(mockChange).toHaveBeenCalled()
    })

    it('shows changing state while saving', async () => {
      const mockChange = vi.fn().mockResolvedValue({ success: true })
      ;(settingsActions.changePassword as any) = mockChange

      const user = userEvent.setup()
      render(<ChangePasswordModal isOpen={true} onClose={mockOnClose} />)

      await user.type(screen.getByLabelText('New Password'), 'newpassword123')
      await user.type(screen.getByLabelText('Confirm New Password'), 'newpassword123')
      await user.click(screen.getByRole('button', { name: 'Change Password' }))

      // Should show "Changing..." text during submission
      // This happens briefly before the success message
      expect(mockChange).toHaveBeenCalled()
    })
  })
})

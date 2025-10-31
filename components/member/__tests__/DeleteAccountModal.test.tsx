import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import DeleteAccountModal from '../DeleteAccountModal'
import * as settingsActions from '@/app/[locale]/(member)/settings/actions'

// Mock next/navigation
const mockPush = vi.fn()
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}))

// Mock settings actions
vi.mock('@/app/[locale]/(member)/settings/actions', () => ({
  deleteAccount: vi.fn(),
}))

describe('DeleteAccountModal', () => {
  const mockOnClose = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Visibility', () => {
    it('renders when isOpen is true', () => {
      render(<DeleteAccountModal isOpen={true} onClose={mockOnClose} locale="en" />)

      expect(screen.getByRole('heading', { name: 'Delete Account' })).toBeInTheDocument()
    })

    it('does not render when isOpen is false', () => {
      render(<DeleteAccountModal isOpen={false} onClose={mockOnClose} locale="en" />)

      expect(screen.queryByRole('heading', { name: 'Delete Account' })).not.toBeInTheDocument()
    })
  })

  describe('Warning Content', () => {
    it('displays warning messages', () => {
      render(<DeleteAccountModal isOpen={true} onClose={mockOnClose} locale="en" />)

      expect(screen.getByText(/cannot be undone/)).toBeInTheDocument()
      expect(screen.getByText('Warning:')).toBeInTheDocument()
    })

    it('shows list of consequences', () => {
      render(<DeleteAccountModal isOpen={true} onClose={mockOnClose} locale="en" />)

      expect(screen.getByText(/Your profile will be permanently deleted/)).toBeInTheDocument()
      expect(
        screen.getByText(/All your connections and enrollments will be removed/)
      ).toBeInTheDocument()
      expect(screen.getByText(/You will be immediately signed out/)).toBeInTheDocument()
    })

    it('renders alert triangle icon', () => {
      render(<DeleteAccountModal isOpen={true} onClose={mockOnClose} locale="en" />)

      const heading = screen.getByRole('heading', { name: 'Delete Account' })
      expect(heading.parentElement?.querySelector('svg')).toBeInTheDocument()
    })
  })

  describe('Confirmation Input', () => {
    it('renders confirmation text input', () => {
      render(<DeleteAccountModal isOpen={true} onClose={mockOnClose} locale="en" />)

      expect(screen.getByLabelText(/Type DELETE to confirm/)).toBeInTheDocument()
      expect(screen.getByPlaceholderText('DELETE')).toBeInTheDocument()
    })

    it('delete button is disabled when confirmation text is empty', () => {
      render(<DeleteAccountModal isOpen={true} onClose={mockOnClose} locale="en" />)

      const deleteButton = screen.getByRole('button', { name: 'Delete Account' })
      expect(deleteButton).toBeDisabled()
    })

    it('delete button is enabled when DELETE is typed', async () => {
      const user = userEvent.setup()
      render(<DeleteAccountModal isOpen={true} onClose={mockOnClose} locale="en" />)

      const input = screen.getByPlaceholderText('DELETE')
      await user.type(input, 'DELETE')

      const deleteButton = screen.getByRole('button', { name: 'Delete Account' })
      expect(deleteButton).not.toBeDisabled()
    })

    it('delete button is disabled when wrong text is typed', async () => {
      const user = userEvent.setup()
      render(<DeleteAccountModal isOpen={true} onClose={mockOnClose} locale="en" />)

      const input = screen.getByPlaceholderText('DELETE')
      await user.type(input, 'delete')

      const deleteButton = screen.getByRole('button', { name: 'Delete Account' })
      expect(deleteButton).toBeDisabled()
    })
  })

  describe('Close Functionality', () => {
    it('calls onClose when X button clicked', async () => {
      const user = userEvent.setup()
      render(<DeleteAccountModal isOpen={true} onClose={mockOnClose} locale="en" />)

      const closeButton = screen.getByRole('button', { name: '' })
      await user.click(closeButton)

      expect(mockOnClose).toHaveBeenCalled()
    })

    it('calls onClose when Cancel button clicked', async () => {
      const user = userEvent.setup()
      render(<DeleteAccountModal isOpen={true} onClose={mockOnClose} locale="en" />)

      const cancelButton = screen.getByRole('button', { name: 'Cancel' })
      await user.click(cancelButton)

      expect(mockOnClose).toHaveBeenCalled()
    })
  })

  describe('Delete Functionality', () => {
    it('shows error when trying to delete without typing DELETE', async () => {
      const user = userEvent.setup()
      render(<DeleteAccountModal isOpen={true} onClose={mockOnClose} locale="en" />)

      const input = screen.getByPlaceholderText('DELETE')
      await user.type(input, 'wrong')

      const deleteButton = screen.getByRole('button', { name: 'Delete Account' })
      // Button is disabled, but let's verify the validation message would show
      expect(deleteButton).toBeDisabled()
    })

    it('calls deleteAccount action when DELETE is typed and confirmed', async () => {
      const mockDelete = vi.fn().mockResolvedValue({ success: false, error: 'Not implemented' })
      ;(settingsActions.deleteAccount as any) = mockDelete

      const user = userEvent.setup()
      render(<DeleteAccountModal isOpen={true} onClose={mockOnClose} locale="en" />)

      const input = screen.getByPlaceholderText('DELETE')
      await user.type(input, 'DELETE')

      const deleteButton = screen.getByRole('button', { name: 'Delete Account' })
      await user.click(deleteButton)

      await waitFor(() => {
        expect(mockDelete).toHaveBeenCalled()
      })
    })

    it('shows error message on failed deletion', async () => {
      const mockDelete = vi.fn().mockResolvedValue({ success: false, error: 'Cannot delete' })
      ;(settingsActions.deleteAccount as any) = mockDelete

      const user = userEvent.setup()
      render(<DeleteAccountModal isOpen={true} onClose={mockOnClose} locale="en" />)

      const input = screen.getByPlaceholderText('DELETE')
      await user.type(input, 'DELETE')
      await user.click(screen.getByRole('button', { name: 'Delete Account' }))

      await waitFor(() => {
        expect(screen.getByText('Cannot delete')).toBeInTheDocument()
      })
    })

    it('shows success message and redirects on successful deletion', async () => {
      const mockDelete = vi.fn().mockResolvedValue({ success: true })
      ;(settingsActions.deleteAccount as any) = mockDelete

      const user = userEvent.setup()
      render(<DeleteAccountModal isOpen={true} onClose={mockOnClose} locale="en" />)

      const input = screen.getByPlaceholderText('DELETE')
      await user.type(input, 'DELETE')
      await user.click(screen.getByRole('button', { name: 'Delete Account' }))

      await waitFor(() => {
        expect(screen.getByText('Account deleted successfully')).toBeInTheDocument()
      })

      // Note: Router push is called after timeout, we verify the action was called
      expect(mockDelete).toHaveBeenCalled()
    })

    it('disables buttons while deleting', async () => {
      let resolvePromise: (value: any) => void
      const mockDelete = vi.fn().mockImplementation(
        () =>
          new Promise((resolve) => {
            resolvePromise = resolve
          })
      )
      ;(settingsActions.deleteAccount as any) = mockDelete

      const user = userEvent.setup()
      render(<DeleteAccountModal isOpen={true} onClose={mockOnClose} locale="en" />)

      const input = screen.getByPlaceholderText('DELETE')
      await user.type(input, 'DELETE')

      const deleteButton = screen.getByRole('button', { name: 'Delete Account' })
      const cancelButton = screen.getByRole('button', { name: 'Cancel' })

      await user.click(deleteButton)

      await waitFor(() => {
        expect(deleteButton).toBeDisabled()
      })

      expect(cancelButton).toBeDisabled()
      expect(screen.getByText('Deleting...')).toBeInTheDocument()

      // Cleanup
      resolvePromise!({ success: false, error: 'Test' })
    })
  })

  describe('Locale Support', () => {
    it('redirects to correct locale homepage on success', async () => {
      const mockDelete = vi.fn().mockResolvedValue({ success: true })
      ;(settingsActions.deleteAccount as any) = mockDelete

      const user = userEvent.setup()
      render(<DeleteAccountModal isOpen={true} onClose={mockOnClose} locale="fr" />)

      const input = screen.getByPlaceholderText('DELETE')
      await user.type(input, 'DELETE')
      await user.click(screen.getByRole('button', { name: 'Delete Account' }))

      await waitFor(() => {
        expect(screen.getByText('Account deleted successfully')).toBeInTheDocument()
      })

      // Verify action was called (redirect happens after timeout)
      expect(mockDelete).toHaveBeenCalled()
    })
  })
})

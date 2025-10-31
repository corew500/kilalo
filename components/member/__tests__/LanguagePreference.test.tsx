import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import LanguagePreference from '../LanguagePreference'

// Mock next/navigation
const mockPush = vi.fn()
const mockRefresh = vi.fn()
const mockUsePathname = vi.fn(() => '/en/settings')

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
    refresh: mockRefresh,
  }),
  usePathname: () => mockUsePathname(),
}))

describe('LanguagePreference', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockUsePathname.mockReturnValue('/en/settings')
  })

  it('renders language select with current locale', () => {
    render(<LanguagePreference currentLocale="en" />)

    const select = screen.getByLabelText('Language')
    expect(select).toBeInTheDocument()
    expect(select).toHaveValue('en')
  })

  it('shows English and French options', () => {
    render(<LanguagePreference currentLocale="en" />)

    expect(screen.getByText('English')).toBeInTheDocument()
    expect(screen.getByText('Français')).toBeInTheDocument()
  })

  it('changes language when option selected', async () => {
    const user = userEvent.setup()
    render(<LanguagePreference currentLocale="en" />)

    const select = screen.getByLabelText('Language')
    await user.selectOptions(select, 'fr')

    expect(mockPush).toHaveBeenCalledWith('/fr/settings')
    expect(mockRefresh).toHaveBeenCalled()
  })

  it('does not trigger navigation when selecting current locale', async () => {
    const user = userEvent.setup()
    render(<LanguagePreference currentLocale="en" />)

    const select = screen.getByLabelText('Language')
    await user.selectOptions(select, 'en')

    expect(mockPush).not.toHaveBeenCalled()
    expect(mockRefresh).not.toHaveBeenCalled()
  })

  it('shows loading state while changing language', async () => {
    const user = userEvent.setup()
    render(<LanguagePreference currentLocale="en" />)

    const select = screen.getByLabelText('Language')

    // Initially no loading message
    expect(screen.queryByText('Switching language...')).not.toBeInTheDocument()

    // Change language
    await user.selectOptions(select, 'fr')

    // Loading message appears
    expect(screen.getByText('Switching language...')).toBeInTheDocument()
  })

  it('disables select while changing language', async () => {
    const user = userEvent.setup()
    render(<LanguagePreference currentLocale="en" />)

    const select = screen.getByLabelText('Language') as HTMLSelectElement

    expect(select.disabled).toBe(false)

    await user.selectOptions(select, 'fr')

    expect(select.disabled).toBe(true)
  })

  it('handles French locale correctly', () => {
    render(<LanguagePreference currentLocale="fr" />)

    const select = screen.getByLabelText('Language')
    expect(select).toHaveValue('fr')
  })

  it('replaces locale in different pathname', async () => {
    mockUsePathname.mockReturnValue('/en/profile')

    const user = userEvent.setup()
    render(<LanguagePreference currentLocale="en" />)

    const select = screen.getByLabelText('Language')
    await user.selectOptions(select, 'fr')

    expect(mockPush).toHaveBeenCalledWith('/fr/profile')
  })
})

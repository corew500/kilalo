import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { NextIntlClientProvider } from 'next-intl'
import SignupForm from '../SignupForm'
import * as authActions from '@/app/[locale]/(auth)/actions'

// Mock the auth actions
vi.mock('@/app/[locale]/(auth)/actions', () => ({
  signup: vi.fn(),
}))

const messages = {
  Auth: {
    fields: {
      email: 'Email',
      password: 'Password',
      confirmPassword: 'Confirm Password',
      fullName: 'Full Name',
    },
    actions: {
      createAccount: 'Create Account',
      creatingAccount: 'Creating account...',
    },
    links: {
      signIn: 'Sign in',
    },
    prompts: {
      haveAccount: 'Already have an account?',
    },
    messages: {
      checkEmail: 'Check your email to confirm your account',
      checkSpam: "If you don't see the email, check your spam folder",
    },
    errors: {
      unexpectedError: 'An unexpected error occurred',
    },
  },
}

function renderSignupForm(locale = 'en') {
  return render(
    <NextIntlClientProvider locale={locale} messages={messages}>
      <SignupForm locale={locale} />
    </NextIntlClientProvider>
  )
}

describe('SignupForm', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders all form fields', () => {
    renderSignupForm()

    expect(screen.getByLabelText('Full Name')).toBeInTheDocument()
    expect(screen.getByLabelText('Email')).toBeInTheDocument()
    expect(screen.getByLabelText('Password')).toBeInTheDocument()
    expect(screen.getByLabelText('Confirm Password')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Create Account' })).toBeInTheDocument()
  })

  it('renders sign in link', () => {
    renderSignupForm()

    expect(screen.getByText('Already have an account?')).toBeInTheDocument()
    const signInLink = screen.getByRole('link', { name: 'Sign in' })
    expect(signInLink).toBeInTheDocument()
    expect(signInLink).toHaveAttribute('href', '/en/login')
  })

  it('shows validation error for short full name', async () => {
    const user = userEvent.setup()
    renderSignupForm()

    const fullNameInput = screen.getByLabelText('Full Name')
    const submitButton = screen.getByRole('button', { name: 'Create Account' })

    await user.type(fullNameInput, 'A')
    await user.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText('Full name must be at least 2 characters')).toBeInTheDocument()
    })
  })

  it('shows validation error for short password', async () => {
    const user = userEvent.setup()
    renderSignupForm()

    const fullNameInput = screen.getByLabelText('Full Name')
    const emailInput = screen.getByLabelText('Email')
    const passwordInput = screen.getByLabelText('Password')
    const submitButton = screen.getByRole('button', { name: 'Create Account' })

    await user.type(fullNameInput, 'John Doe')
    await user.type(emailInput, 'john@example.com')
    await user.type(passwordInput, '1234567')
    await user.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText('Password must be at least 8 characters')).toBeInTheDocument()
    })
  })

  it('shows validation error when passwords do not match', async () => {
    const user = userEvent.setup()
    renderSignupForm()

    const fullNameInput = screen.getByLabelText('Full Name')
    const emailInput = screen.getByLabelText('Email')
    const passwordInput = screen.getByLabelText('Password')
    const confirmPasswordInput = screen.getByLabelText('Confirm Password')
    const submitButton = screen.getByRole('button', { name: 'Create Account' })

    await user.type(fullNameInput, 'John Doe')
    await user.type(emailInput, 'john@example.com')
    await user.type(passwordInput, 'password123')
    await user.type(confirmPasswordInput, 'password456')
    await user.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText("Passwords don't match")).toBeInTheDocument()
    })
  })

  it('calls signup action with form data on valid submission', async () => {
    const user = userEvent.setup()
    const mockSignup = vi.mocked(authActions.signup)
    mockSignup.mockResolvedValue({ success: true })

    renderSignupForm()

    const fullNameInput = screen.getByLabelText('Full Name')
    const emailInput = screen.getByLabelText('Email')
    const passwordInput = screen.getByLabelText('Password')
    const confirmPasswordInput = screen.getByLabelText('Confirm Password')
    const submitButton = screen.getByRole('button', { name: 'Create Account' })

    await user.type(fullNameInput, 'John Doe')
    await user.type(emailInput, 'john@example.com')
    await user.type(passwordInput, 'password123')
    await user.type(confirmPasswordInput, 'password123')
    await user.click(submitButton)

    await waitFor(() => {
      expect(mockSignup).toHaveBeenCalledWith('en', 'john@example.com', 'password123', 'John Doe')
    })
  })

  it('displays success message after signup', async () => {
    const user = userEvent.setup()
    const mockSignup = vi.mocked(authActions.signup)
    mockSignup.mockResolvedValue({
      success: true,
      message: 'Check your email to confirm your account',
    })

    renderSignupForm()

    const fullNameInput = screen.getByLabelText('Full Name')
    const emailInput = screen.getByLabelText('Email')
    const passwordInput = screen.getByLabelText('Password')
    const confirmPasswordInput = screen.getByLabelText('Confirm Password')
    const submitButton = screen.getByRole('button', { name: 'Create Account' })

    await user.type(fullNameInput, 'John Doe')
    await user.type(emailInput, 'john@example.com')
    await user.type(passwordInput, 'password123')
    await user.type(confirmPasswordInput, 'password123')
    await user.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText('Check your email to confirm your account')).toBeInTheDocument()
      expect(
        screen.getByText("If you don't see the email, check your spam folder")
      ).toBeInTheDocument()
    })
  })

  it('displays error message when signup fails', async () => {
    const user = userEvent.setup()
    const mockSignup = vi.mocked(authActions.signup)
    mockSignup.mockResolvedValue({ success: false, error: 'Email already in use' })

    renderSignupForm()

    const fullNameInput = screen.getByLabelText('Full Name')
    const emailInput = screen.getByLabelText('Email')
    const passwordInput = screen.getByLabelText('Password')
    const confirmPasswordInput = screen.getByLabelText('Confirm Password')
    const submitButton = screen.getByRole('button', { name: 'Create Account' })

    await user.type(fullNameInput, 'John Doe')
    await user.type(emailInput, 'existing@example.com')
    await user.type(passwordInput, 'password123')
    await user.type(confirmPasswordInput, 'password123')
    await user.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText('Email already in use')).toBeInTheDocument()
    })
  })

  it('shows loading state during submission', async () => {
    const user = userEvent.setup()
    const mockSignup = vi.mocked(authActions.signup)
    mockSignup.mockImplementation(
      () =>
        new Promise((resolve) => {
          setTimeout(() => resolve({ success: true }), 100)
        })
    )

    renderSignupForm()

    const fullNameInput = screen.getByLabelText('Full Name')
    const emailInput = screen.getByLabelText('Email')
    const passwordInput = screen.getByLabelText('Password')
    const confirmPasswordInput = screen.getByLabelText('Confirm Password')
    const submitButton = screen.getByRole('button', { name: 'Create Account' })

    await user.type(fullNameInput, 'John Doe')
    await user.type(emailInput, 'john@example.com')
    await user.type(passwordInput, 'password123')
    await user.type(confirmPasswordInput, 'password123')
    await user.click(submitButton)

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Creating account...' })).toBeInTheDocument()
      expect(submitButton).toBeDisabled()
    })
  })

  it('disables form inputs during submission', async () => {
    const user = userEvent.setup()
    const mockSignup = vi.mocked(authActions.signup)
    mockSignup.mockImplementation(
      () =>
        new Promise((resolve) => {
          setTimeout(() => resolve({ success: true }), 100)
        })
    )

    renderSignupForm()

    const fullNameInput = screen.getByLabelText('Full Name')
    const emailInput = screen.getByLabelText('Email')
    const passwordInput = screen.getByLabelText('Password')
    const confirmPasswordInput = screen.getByLabelText('Confirm Password')
    const submitButton = screen.getByRole('button', { name: 'Create Account' })

    await user.type(fullNameInput, 'John Doe')
    await user.type(emailInput, 'john@example.com')
    await user.type(passwordInput, 'password123')
    await user.type(confirmPasswordInput, 'password123')
    await user.click(submitButton)

    await waitFor(() => {
      expect(fullNameInput).toBeDisabled()
      expect(emailInput).toBeDisabled()
      expect(passwordInput).toBeDisabled()
      expect(confirmPasswordInput).toBeDisabled()
    })
  })

  it('handles unexpected errors gracefully', async () => {
    const user = userEvent.setup()
    const mockSignup = vi.mocked(authActions.signup)
    mockSignup.mockRejectedValue(new Error('Network error'))

    renderSignupForm()

    const fullNameInput = screen.getByLabelText('Full Name')
    const emailInput = screen.getByLabelText('Email')
    const passwordInput = screen.getByLabelText('Password')
    const confirmPasswordInput = screen.getByLabelText('Confirm Password')
    const submitButton = screen.getByRole('button', { name: 'Create Account' })

    await user.type(fullNameInput, 'John Doe')
    await user.type(emailInput, 'john@example.com')
    await user.type(passwordInput, 'password123')
    await user.type(confirmPasswordInput, 'password123')
    await user.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText('An unexpected error occurred')).toBeInTheDocument()
    })
  })

  it('uses correct locale in sign in link', () => {
    renderSignupForm('fr')

    const signInLink = screen.getByRole('link', { name: 'Sign in' })
    expect(signInLink).toHaveAttribute('href', '/fr/login')
  })
})

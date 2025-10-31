import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { NextIntlClientProvider } from 'next-intl'
import LoginForm from '../LoginForm'
import * as authActions from '@/app/[locale]/(auth)/actions'

// Mock the auth actions
vi.mock('@/app/[locale]/(auth)/actions', () => ({
  login: vi.fn(),
}))

const messages = {
  Auth: {
    fields: {
      email: 'Email',
      password: 'Password',
    },
    actions: {
      signIn: 'Sign In',
      signingIn: 'Signing in...',
    },
    links: {
      forgotPassword: 'Forgot password?',
      signUp: 'Sign up',
    },
    prompts: {
      noAccount: "Don't have an account?",
    },
    errors: {
      unexpectedError: 'An unexpected error occurred',
    },
  },
}

function renderLoginForm(locale = 'en') {
  return render(
    <NextIntlClientProvider locale={locale} messages={messages}>
      <LoginForm locale={locale} />
    </NextIntlClientProvider>
  )
}

describe('LoginForm', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders all form fields', () => {
    renderLoginForm()

    expect(screen.getByLabelText('Email')).toBeInTheDocument()
    expect(screen.getByLabelText('Password')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Sign In' })).toBeInTheDocument()
  })

  it('renders forgot password link', () => {
    renderLoginForm()

    const forgotPasswordLink = screen.getByRole('link', { name: 'Forgot password?' })
    expect(forgotPasswordLink).toBeInTheDocument()
    expect(forgotPasswordLink).toHaveAttribute('href', '/en/forgot-password')
  })

  it('renders sign up link', () => {
    renderLoginForm()

    expect(screen.getByText("Don't have an account?")).toBeInTheDocument()
    const signUpLink = screen.getByRole('link', { name: 'Sign up' })
    expect(signUpLink).toBeInTheDocument()
    expect(signUpLink).toHaveAttribute('href', '/en/signup')
  })

  it('shows validation error for short password', async () => {
    const user = userEvent.setup()
    renderLoginForm()

    const emailInput = screen.getByLabelText('Email')
    const passwordInput = screen.getByLabelText('Password')
    const submitButton = screen.getByRole('button', { name: 'Sign In' })

    await user.type(emailInput, 'test@example.com')
    await user.type(passwordInput, '12345')
    await user.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText('Password must be at least 6 characters')).toBeInTheDocument()
    })
  })

  it('calls login action with form data on valid submission', async () => {
    const user = userEvent.setup()
    const mockLogin = vi.mocked(authActions.login)
    mockLogin.mockResolvedValue({ success: true })

    renderLoginForm()

    const emailInput = screen.getByLabelText('Email')
    const passwordInput = screen.getByLabelText('Password')
    const submitButton = screen.getByRole('button', { name: 'Sign In' })

    await user.type(emailInput, 'test@example.com')
    await user.type(passwordInput, 'password123')
    await user.click(submitButton)

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith('en', 'test@example.com', 'password123')
    })
  })

  it('displays error message when login fails', async () => {
    const user = userEvent.setup()
    const mockLogin = vi.mocked(authActions.login)
    mockLogin.mockResolvedValue({ success: false, error: 'Invalid credentials' })

    renderLoginForm()

    const emailInput = screen.getByLabelText('Email')
    const passwordInput = screen.getByLabelText('Password')
    const submitButton = screen.getByRole('button', { name: 'Sign In' })

    await user.type(emailInput, 'test@example.com')
    await user.type(passwordInput, 'wrongpassword')
    await user.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText('Invalid credentials')).toBeInTheDocument()
    })
  })

  it('shows loading state during submission', async () => {
    const user = userEvent.setup()
    const mockLogin = vi.mocked(authActions.login)
    mockLogin.mockImplementation(
      () =>
        new Promise((resolve) => {
          setTimeout(() => resolve({ success: true }), 100)
        })
    )

    renderLoginForm()

    const emailInput = screen.getByLabelText('Email')
    const passwordInput = screen.getByLabelText('Password')
    const submitButton = screen.getByRole('button', { name: 'Sign In' })

    await user.type(emailInput, 'test@example.com')
    await user.type(passwordInput, 'password123')
    await user.click(submitButton)

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Signing in...' })).toBeInTheDocument()
      expect(submitButton).toBeDisabled()
    })
  })

  it('disables form inputs during submission', async () => {
    const user = userEvent.setup()
    const mockLogin = vi.mocked(authActions.login)
    mockLogin.mockImplementation(
      () =>
        new Promise((resolve) => {
          setTimeout(() => resolve({ success: true }), 100)
        })
    )

    renderLoginForm()

    const emailInput = screen.getByLabelText('Email')
    const passwordInput = screen.getByLabelText('Password')
    const submitButton = screen.getByRole('button', { name: 'Sign In' })

    await user.type(emailInput, 'test@example.com')
    await user.type(passwordInput, 'password123')
    await user.click(submitButton)

    await waitFor(() => {
      expect(emailInput).toBeDisabled()
      expect(passwordInput).toBeDisabled()
    })
  })

  it('handles unexpected errors gracefully', async () => {
    const user = userEvent.setup()
    const mockLogin = vi.mocked(authActions.login)
    mockLogin.mockRejectedValue(new Error('Network error'))

    renderLoginForm()

    const emailInput = screen.getByLabelText('Email')
    const passwordInput = screen.getByLabelText('Password')
    const submitButton = screen.getByRole('button', { name: 'Sign In' })

    await user.type(emailInput, 'test@example.com')
    await user.type(passwordInput, 'password123')
    await user.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText('An unexpected error occurred')).toBeInTheDocument()
    })
  })

  it('uses correct locale in forgot password link', () => {
    renderLoginForm('fr')

    const forgotPasswordLink = screen.getByRole('link', { name: 'Forgot password?' })
    expect(forgotPasswordLink).toHaveAttribute('href', '/fr/forgot-password')
  })

  it('uses correct locale in signup link', () => {
    renderLoginForm('fr')

    const signUpLink = screen.getByRole('link', { name: 'Sign up' })
    expect(signUpLink).toHaveAttribute('href', '/fr/signup')
  })
})

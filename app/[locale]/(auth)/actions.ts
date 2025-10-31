'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getTranslations } from 'next-intl/server'

export interface AuthFormState {
  error?: string
  success?: boolean
  message?: string
}

export async function login(
  locale: string,
  email: string,
  password: string
): Promise<AuthFormState> {
  const t = await getTranslations('Auth')
  const supabase = await createClient()

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return {
      error: error.message || t('errors.loginFailed'),
      success: false,
    }
  }

  revalidatePath('/', 'layout')
  redirect(`/${locale}`)
}

export async function signup(
  locale: string,
  email: string,
  password: string,
  fullName: string
): Promise<AuthFormState> {
  const t = await getTranslations('Auth')
  const supabase = await createClient()

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      },
      emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/${locale}/auth/callback`,
    },
  })

  if (error) {
    return {
      error: error.message || t('errors.signupFailed'),
      success: false,
    }
  }

  return {
    success: true,
    message: t('messages.checkEmail'),
  }
}

export async function logout(locale: string): Promise<void> {
  const supabase = await createClient()
  await supabase.auth.signOut()
  revalidatePath('/', 'layout')
  redirect(`/${locale}/login`)
}

export async function resetPassword(locale: string, email: string): Promise<AuthFormState> {
  const t = await getTranslations('Auth')
  const supabase = await createClient()

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/${locale}/auth/reset-password`,
  })

  if (error) {
    return {
      error: error.message || t('errors.resetFailed'),
      success: false,
    }
  }

  return {
    success: true,
    message: t('messages.resetEmailSent'),
  }
}

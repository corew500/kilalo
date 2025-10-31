'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useTranslations } from 'next-intl'
import { signup } from '@/app/[locale]/(auth)/actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, CheckCircle } from 'lucide-react'
import Link from 'next/link'

const signupSchema = z
  .object({
    fullName: z.string().min(2, 'Full name must be at least 2 characters'),
    email: z.string().email('Please enter a valid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  })

type SignupFormData = z.infer<typeof signupSchema>

interface SignupFormProps {
  locale: string
}

export default function SignupForm({ locale }: SignupFormProps) {
  const t = useTranslations('Auth')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  })

  async function onSubmit(data: SignupFormData) {
    setError(null)
    setSuccess(null)
    setIsLoading(true)

    try {
      const result = await signup(locale, data.email, data.password, data.fullName)
      if (result.error) {
        setError(result.error)
      } else if (result.success) {
        setSuccess(result.message || t('messages.checkEmail'))
      }
    } catch (err) {
      setError(t('errors.unexpectedError'))
    } finally {
      setIsLoading(false)
    }
  }

  if (success) {
    return (
      <div className="space-y-6 text-center">
        <div className="flex justify-center">
          <CheckCircle className="h-16 w-16 text-green-500" />
        </div>
        <Alert>
          <AlertDescription className="text-center">{success}</AlertDescription>
        </Alert>
        <p className="text-sm text-muted-foreground">{t('messages.checkSpam')}</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-2">
        <Label htmlFor="fullName">{t('fields.fullName')}</Label>
        <Input
          id="fullName"
          type="text"
          placeholder="John Doe"
          {...register('fullName')}
          disabled={isLoading}
          className={errors.fullName ? 'border-destructive' : ''}
        />
        {errors.fullName && <p className="text-sm text-destructive">{errors.fullName.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">{t('fields.email')}</Label>
        <Input
          id="email"
          type="email"
          placeholder="you@example.com"
          {...register('email')}
          disabled={isLoading}
          className={errors.email ? 'border-destructive' : ''}
        />
        {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">{t('fields.password')}</Label>
        <Input
          id="password"
          type="password"
          placeholder="••••••••"
          {...register('password')}
          disabled={isLoading}
          className={errors.password ? 'border-destructive' : ''}
        />
        {errors.password && <p className="text-sm text-destructive">{errors.password.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword">{t('fields.confirmPassword')}</Label>
        <Input
          id="confirmPassword"
          type="password"
          placeholder="••••••••"
          {...register('confirmPassword')}
          disabled={isLoading}
          className={errors.confirmPassword ? 'border-destructive' : ''}
        />
        {errors.confirmPassword && (
          <p className="text-sm text-destructive">{errors.confirmPassword.message}</p>
        )}
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {isLoading ? t('actions.creatingAccount') : t('actions.createAccount')}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        {t('prompts.haveAccount')}{' '}
        <Link href={`/${locale}/login`} className="font-medium text-primary hover:underline">
          {t('links.signIn')}
        </Link>
      </p>
    </form>
  )
}

'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useTranslations } from 'next-intl'
import { login } from '@/app/[locale]/(auth)/actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2 } from 'lucide-react'
import Link from 'next/link'

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

type LoginFormData = z.infer<typeof loginSchema>

interface LoginFormProps {
  locale: string
}

export default function LoginForm({ locale }: LoginFormProps) {
  const t = useTranslations('Auth')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  async function onSubmit(data: LoginFormData) {
    setError(null)
    setIsLoading(true)

    try {
      const result = await login(locale, data.email, data.password)
      if (result.error) {
        setError(result.error)
      }
    } catch (err) {
      setError(t('errors.unexpectedError'))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

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
        <div className="flex items-center justify-between">
          <Label htmlFor="password">{t('fields.password')}</Label>
          <Link
            href={`/${locale}/forgot-password`}
            className="text-sm text-primary hover:underline"
          >
            {t('links.forgotPassword')}
          </Link>
        </div>
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

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {isLoading ? t('actions.signingIn') : t('actions.signIn')}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        {t('prompts.noAccount')}{' '}
        <Link href={`/${locale}/signup`} className="font-medium text-primary hover:underline">
          {t('links.signUp')}
        </Link>
      </p>
    </form>
  )
}

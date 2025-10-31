'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useSearchParams } from 'next/navigation'
import { resendConfirmationEmail } from '@/app/[locale]/(auth)/actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, CheckCircle2 } from 'lucide-react'
import Link from 'next/link'

const resendSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
})

type ResendFormData = z.infer<typeof resendSchema>

interface ResendConfirmationFormProps {
  locale: string
}

export default function ResendConfirmationForm({ locale }: ResendConfirmationFormProps) {
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const searchParams = useSearchParams()

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<ResendFormData>({
    resolver: zodResolver(resendSchema),
  })

  useEffect(() => {
    const email = searchParams.get('email')
    if (email) {
      setValue('email', email)
    }
  }, [searchParams, setValue])

  async function onSubmit(data: ResendFormData) {
    setError(null)
    setSuccess(false)
    setIsLoading(true)

    try {
      const result = await resendConfirmationEmail(locale, data.email)
      if (result.error) {
        setError(result.error)
      } else {
        setSuccess(true)
      }
    } catch {
      setError('Failed to resend confirmation email. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  if (success) {
    return (
      <div className="space-y-6">
        <Alert className="border-green-200 bg-green-50">
          <CheckCircle2 className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            Confirmation email sent! Check your inbox and click the link to verify your account.
          </AlertDescription>
        </Alert>
        <div className="text-center">
          <Link
            href={`/${locale}/login`}
            className="text-sm font-medium text-primary hover:underline"
          >
            Return to login
          </Link>
        </div>
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
        <Label htmlFor="email">Email address</Label>
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

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {isLoading ? 'Sending...' : 'Resend confirmation email'}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        Already confirmed?{' '}
        <Link href={`/${locale}/login`} className="font-medium text-primary hover:underline">
          Sign in
        </Link>
      </p>
    </form>
  )
}

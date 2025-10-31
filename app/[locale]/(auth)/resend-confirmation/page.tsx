import { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import ResendConfirmationForm from '@/components/auth/ResendConfirmationForm'

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('Auth')
  return {
    title: t('pages.resendConfirmation'),
  }
}

export default async function ResendConfirmationPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const t = await getTranslations('Auth')

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight">{t('pages.resendConfirmation')}</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {t('messages.resendConfirmationHelp')}
          </p>
        </div>
        <ResendConfirmationForm locale={locale} />
      </div>
    </div>
  )
}

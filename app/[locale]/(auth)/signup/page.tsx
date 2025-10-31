import { getTranslations } from 'next-intl/server'
import SignupForm from '@/components/auth/SignupForm'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

interface SignupPageProps {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: SignupPageProps) {
  await params
  const t = await getTranslations('Auth')

  return {
    title: t('pages.signup.title'),
    description: t('pages.signup.description'),
  }
}

export default async function SignupPage({ params }: SignupPageProps) {
  const { locale } = await params
  const t = await getTranslations('Auth')

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 px-4">
      <div className="w-full max-w-md">
        <div className="mb-8">
          <Link
            href={`/${locale}`}
            className="mb-6 inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t('links.backToHome')}
          </Link>
          <h1 className="text-3xl font-bold">{t('pages.signup.heading')}</h1>
          <p className="mt-2 text-muted-foreground">{t('pages.signup.subheading')}</p>
        </div>

        <div className="rounded-lg border border-border bg-card p-8 shadow-sm">
          <SignupForm locale={locale} />
        </div>
      </div>
    </div>
  )
}

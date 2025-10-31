import { getTranslations } from 'next-intl/server'
import LoginForm from '@/components/auth/LoginForm'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

interface LoginPageProps {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: LoginPageProps) {
  await params
  const t = await getTranslations('Auth')

  return {
    title: t('pages.login.title'),
    description: t('pages.login.description'),
  }
}

export default async function LoginPage({ params }: LoginPageProps) {
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
          <h1 className="text-3xl font-bold">{t('pages.login.heading')}</h1>
          <p className="mt-2 text-muted-foreground">{t('pages.login.subheading')}</p>
        </div>

        <div className="rounded-lg border border-border bg-card p-8 shadow-sm">
          <LoginForm locale={locale} />
        </div>
      </div>
    </div>
  )
}

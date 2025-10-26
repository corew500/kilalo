import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function Home() {
  const t = useTranslations('HomePage')

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-background">
      <div className="max-w-4xl w-full space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-5xl font-bold text-foreground">{t('title')}</h1>
          <p className="text-xl text-muted-foreground">
            {t('description')}
          </p>
        </div>

        <div className="flex gap-4 justify-center">
          <Button size="lg" className="bg-teal hover:bg-teal-700">
            {t('getStarted')}
          </Button>
          <Button size="lg" variant="secondary" className="bg-orange hover:bg-orange-600">
            {t('learnMore')}
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          <Card>
            <CardHeader>
              <CardTitle className="text-teal">{t('strategy.title')}</CardTitle>
              <CardDescription>{t('strategy.description')}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                {t('strategy.content')}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-orange">{t('execution.title')}</CardTitle>
              <CardDescription>{t('execution.description')}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                {t('execution.content')}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-forest">{t('growth.title')}</CardTitle>
              <CardDescription>{t('growth.description')}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                {t('growth.content')}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  )
}

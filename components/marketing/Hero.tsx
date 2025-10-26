import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export function Hero() {
  const t = useTranslations('HomePage')

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-background to-muted/50 py-20 md:py-32">
      <div className="container">
        <div className="mx-auto max-w-4xl text-center space-y-8">
          {/* Title */}
          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl text-foreground">
            {t('title')}
          </h1>

          {/* Description */}
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
            {t('description')}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            <Button
              size="lg"
              asChild
              className="bg-teal hover:bg-teal/90 text-white"
            >
              <Link href="#services">{t('getStarted')}</Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              asChild
              className="border-orange text-orange hover:bg-orange hover:text-white"
            >
              <Link href="#learn-more">{t('learnMore')}</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Background decoration */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute left-1/2 top-0 ml-[calc(50%-30rem)] aspect-[1155/678] w-[72.1875rem] -translate-x-1/2 bg-gradient-to-tr from-teal/20 to-orange/20 opacity-30 blur-3xl" />
      </div>
    </section>
  )
}

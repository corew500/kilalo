import { useTranslations } from 'next-intl'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

export function Features() {
  const t = useTranslations('HomePage')

  const features = [
    {
      title: t('strategy.title'),
      description: t('strategy.description'),
      content: t('strategy.content'),
      color: 'text-teal',
      bgColor: 'bg-teal/10',
    },
    {
      title: t('execution.title'),
      description: t('execution.description'),
      content: t('execution.content'),
      color: 'text-orange',
      bgColor: 'bg-orange/10',
    },
    {
      title: t('growth.title'),
      description: t('growth.description'),
      content: t('growth.content'),
      color: 'text-forest',
      bgColor: 'bg-forest/10',
    },
  ]

  return (
    <section className="py-16 md:py-24" id="services">
      <div className="container">
        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="border-2 transition-all hover:shadow-lg hover:-translate-y-1"
              >
                <CardHeader>
                  <div className={`mb-2 inline-flex h-12 w-12 items-center justify-center rounded-lg ${feature.bgColor}`}>
                    <span className={`text-2xl font-bold ${feature.color}`}>
                      {index + 1}
                    </span>
                  </div>
                  <CardTitle className={feature.color}>{feature.title}</CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {feature.content}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

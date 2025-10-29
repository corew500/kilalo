import { BusinessAssessmentCTA } from '@/components/shared/BusinessAssessmentCTA'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { getSiteSettings } from '@/lib/sanity-helpers'
import Link from 'next/link'
import { Metadata } from 'next'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const settings = await getSiteSettings(locale)

  return {
    title: settings?.servicesPageTitle || 'Services | Kilalo',
    description:
      settings?.servicesPageDescription ||
      'Targeted support services for Congolese businesses at any stage. From sales strategy to financial modeling.',
  }
}

export default async function ServicesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const settings = await getSiteSettings(locale)
  const services = [
    {
      title: settings?.servicesStrategyTitle || 'Sales Strategy',
      description:
        settings?.servicesStrategyDescription || 'Build effective sales systems and processes',
      icon: 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6',
    },
    {
      title: settings?.servicesOperationsTitle || 'Market Access',
      description:
        settings?.servicesOperationsDescription ||
        'Connect with customers and distribution channels',
      icon: 'M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
    },
    {
      title: settings?.servicesGrowthTitle || 'Financial Modeling',
      description:
        settings?.servicesGrowthDescription || 'Develop robust financial plans and projections',
      icon: 'M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z',
    },
    {
      title: 'Growth Advisory',
      description: 'Strategic guidance for scaling operations',
      icon: 'M13 10V3L4 14h7v7l9-11h-7z',
    },
  ]

  return (
    <div className="container py-16 md:py-24">
      {/* Hero */}
      <div className="mx-auto mb-16 max-w-3xl text-center">
        <h1 className="mb-4 text-4xl font-bold tracking-tight sm:text-5xl">
          {settings?.servicesHeroTitle || 'Direct Support Services'}
        </h1>
        <p className="text-lg text-muted-foreground">
          {settings?.servicesHeroDescription ||
            'Need hands-on help with specific challenges? We offer targeted support services for businesses at any stage.'}
        </p>
      </div>

      {/* Services Grid */}
      <section className="mb-16">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {services.map((service, index) => (
            <Card key={index} className="text-center transition-shadow hover:shadow-lg">
              <CardHeader>
                <div className="mx-auto mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-teal/10">
                  <svg
                    className="h-6 w-6 text-teal"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path d={service.icon} />
                  </svg>
                </div>
                <CardTitle>{service.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{service.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Button size="lg" variant="outline" asChild>
            <Link href="/contact">Schedule a Consultation</Link>
          </Button>
        </div>
      </section>

      {/* How It Works */}
      <section className="-mx-4 mb-16 rounded-lg bg-muted/30 px-4 py-16 md:-mx-8 md:px-8">
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-12 text-center text-3xl font-bold">How It Works</h2>
          <div className="grid gap-8 md:grid-cols-3">
            <div className="text-center">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-teal/10">
                <span className="text-xl font-bold text-teal">1</span>
              </div>
              <h3 className="mb-2 text-lg font-semibold">Consultation</h3>
              <p className="text-sm text-muted-foreground">
                We assess your specific needs and challenges
              </p>
            </div>
            <div className="text-center">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-teal/10">
                <span className="text-xl font-bold text-teal">2</span>
              </div>
              <h3 className="mb-2 text-lg font-semibold">Custom Plan</h3>
              <p className="text-sm text-muted-foreground">
                We design a targeted support package for your business
              </p>
            </div>
            <div className="text-center">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-teal/10">
                <span className="text-xl font-bold text-teal">3</span>
              </div>
              <h3 className="mb-2 text-lg font-semibold">Implementation</h3>
              <p className="text-sm text-muted-foreground">
                Hands-on support to solve your challenge
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section className="mb-16">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="mb-4 text-3xl font-bold">
            {settings?.successStoriesTitle || 'Success Stories'}
          </h2>
          <p className="mb-12 text-lg text-muted-foreground">
            {settings?.successStoriesSubtitle ||
              "See how we've helped Congolese businesses grow through strategic support"}
          </p>
          <Button size="lg" asChild>
            <Link href={`/${locale}/case-studies`}>
              {settings?.viewAllCaseStudies || 'View All Case Studies'}
            </Link>
          </Button>
        </div>
      </section>

      {/* CTA */}
      <BusinessAssessmentCTA variant="card" />
    </div>
  )
}

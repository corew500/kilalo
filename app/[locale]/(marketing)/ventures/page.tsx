import { client } from '@/sanity/lib/client'
import { VentureCard } from '@/components/shared/VentureCard'
import { BusinessAssessmentCTA } from '@/components/shared/BusinessAssessmentCTA'
import { getLocalizedField } from '@/lib/i18n-helpers'
import { getSiteSettings } from '@/lib/sanity-helpers'
import type { SanityVenture } from '@/types/sanity'

async function getVentures() {
  const data = await client.fetch(`
    {
      "ventures": *[_type == "venture"] | order(order asc) {
        _id,
        nameEn,
        nameFr,
        slug,
        descriptionEn,
        descriptionFr,
        sector,
        location,
        taglineEn,
        taglineFr,
        metricsHighlightEn,
        metricsHighlightFr,
        logo,
        featured,
        caseStudy->{
          _id,
          titleEn,
          titleFr,
          slug
        }
      }
    }
  `)
  return data.ventures
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const settings = await getSiteSettings(locale)

  return {
    title: settings?.venturesPageTitle || 'Our Ventures | Kilalo',
    description:
      settings?.venturesPageDescription ||
      'Congolese businesses creating measurable social and economic impact with Kilalo support.',
  }
}

export default async function VenturesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const settings = await getSiteSettings(locale)
  const ventures = await getVentures()

  return (
    <div className="container py-16 md:py-24">
      {/* Header */}
      <div className="mx-auto mb-16 max-w-3xl text-center">
        <h1 className="mb-4 text-4xl font-bold tracking-tight sm:text-5xl">
          {settings?.venturesHeroTitle || 'Our Ventures'}
        </h1>
        <p className="text-lg text-muted-foreground">
          {settings?.venturesHeroDescription ||
            'Congolese businesses creating measurable social and economic impact. From agro-food supply chains to AI-powered legal access, our portfolio companies are transforming the DRC economy.'}
        </p>
      </div>

      {/* Ventures Grid */}
      {ventures && ventures.length > 0 ? (
        <div className="mb-16 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {ventures.map((venture: SanityVenture) => (
            <VentureCard
              key={venture._id}
              name={getLocalizedField(venture, 'name', locale)}
              slug={venture.slug.current}
              description={getLocalizedField(venture, 'description', locale)}
              sector={venture.sector}
              location={venture.location}
              tagline={getLocalizedField(venture, 'tagline', locale)}
              metricsHighlight={getLocalizedField(venture, 'metricsHighlight', locale)}
              logo={venture.logo}
              featured={venture.featured}
              caseStudy={
                venture.caseStudy
                  ? {
                      ...venture.caseStudy,
                      title: getLocalizedField(venture.caseStudy, 'title', locale),
                    }
                  : undefined
              }
              locale={locale}
            />
          ))}
        </div>
      ) : (
        <div className="py-16 text-center">
          <p className="text-lg text-muted-foreground">
            {settings?.venturesNoVentures || 'Venture profiles coming soon!'}
          </p>
        </div>
      )}

      {/* CTA Section */}
      <BusinessAssessmentCTA variant="card" className="mx-auto max-w-4xl" settings={settings} />
    </div>
  )
}

import type { Metadata } from 'next'
import { client } from '@/sanity/lib/client'
import { urlFor } from '@/sanity/lib/image'
import { getLocalizedField } from '@/lib/i18n-helpers'
import { siteConfig } from '@/lib/seo'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { BusinessAssessmentCTA } from '@/components/shared/BusinessAssessmentCTA'

async function getVenture(slug: string) {
  const data = await client.fetch(
    `
    *[_type == "venture" && slug.current == $slug][0] {
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
      websiteUrl,
      caseStudy->{
        _id,
        titleEn,
        titleFr,
        slug
      }
    }
  `,
    { slug }
  )

  return data
}

export async function generateStaticParams() {
  const slugs = await client.fetch(`
    *[_type == "venture"] {
      "slug": slug.current
    }
  `)

  return slugs.map((item: { slug: string }) => ({
    slug: item.slug,
  }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>
}): Promise<Metadata> {
  const { slug, locale } = await params
  const venture = await getVenture(slug)

  if (!venture) {
    return {
      title: 'Venture Not Found',
    }
  }

  const name = getLocalizedField(venture, 'name', locale)
  const tagline = getLocalizedField(venture, 'tagline', locale)
  const description = getLocalizedField(venture, 'description', locale)
  const metaDescription = tagline || description.substring(0, 155)

  const logoUrl = venture.logo
    ? urlFor(venture.logo).width(1200).height(630).url()
    : siteConfig.ogImage

  return {
    title: name,
    description: metaDescription,
    openGraph: {
      title: `${name} | ${siteConfig.name}`,
      description: metaDescription,
      url: `${siteConfig.url}/${locale}/ventures/${slug}`,
      siteName: siteConfig.name,
      images: [
        {
          url: logoUrl,
          width: 1200,
          height: 630,
          alt: name,
        },
      ],
      locale: siteConfig.locale[locale as 'en' | 'fr'],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${name} | ${siteConfig.name}`,
      description: metaDescription,
      images: [logoUrl],
      creator: siteConfig.social.twitter,
    },
    alternates: {
      canonical: `${siteConfig.url}/${locale}/ventures/${slug}`,
      languages: {
        en: `${siteConfig.url}/en/ventures/${slug}`,
        fr: `${siteConfig.url}/fr/ventures/${slug}`,
      },
    },
  }
}

export default async function VentureDetailPage({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>
}) {
  const { slug, locale } = await params
  const venture = await getVenture(slug)

  if (!venture) {
    notFound()
  }

  const name = getLocalizedField(venture, 'name', locale)
  const tagline = getLocalizedField(venture, 'tagline', locale)
  const description = getLocalizedField(venture, 'description', locale)
  const metricsHighlight = getLocalizedField(venture, 'metricsHighlight', locale)

  return (
    <div className="pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-teal/10 to-background py-16 md:py-24">
        <div className="container">
          <div className="mx-auto max-w-4xl">
            {/* Breadcrumb */}
            <nav className="mb-6 text-sm text-muted-foreground">
              <Link href={`/${locale}/ventures`} className="transition-colors hover:text-teal">
                {locale === 'en' ? 'Ventures' : 'Entreprises'}
              </Link>
              <span className="mx-2">/</span>
              <span>{name}</span>
            </nav>

            <div className="text-center">
              {venture.logo && (
                <div className="mb-6 inline-block rounded-lg bg-white p-6 shadow-sm">
                  <Image
                    src={urlFor(venture.logo).width(300).url()}
                    alt={`${name} logo`}
                    width={300}
                    height={120}
                    className="h-24 w-auto"
                  />
                </div>
              )}
              <h1 className="mb-4 text-4xl font-bold tracking-tight sm:text-5xl">{name}</h1>
              <p className="mb-6 text-xl text-muted-foreground">{tagline}</p>
              <div className="mb-8 flex flex-wrap justify-center gap-3">
                <span className="inline-flex items-center rounded-full bg-teal/10 px-4 py-2 text-sm font-medium text-teal">
                  {venture.sector.replace('-', ' ')}
                </span>
                <span className="inline-flex items-center rounded-full bg-orange/10 px-4 py-2 text-sm font-medium text-orange">
                  {venture.location}
                </span>
                {metricsHighlight && (
                  <span className="inline-flex items-center rounded-full bg-forest/10 px-4 py-2 text-sm font-medium text-forest">
                    {metricsHighlight}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Description */}
      <section className="py-16">
        <div className="container">
          <div className="mx-auto max-w-3xl">
            <p className="text-lg leading-relaxed text-muted-foreground">{description}</p>
          </div>
        </div>
      </section>

      {/* Case Study CTA */}
      {venture.caseStudy && (
        <section className="bg-gradient-to-br from-teal/10 via-background to-orange/10 py-16">
          <div className="container">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="mb-4 text-3xl font-bold">
                {locale === 'en' ? 'Read the Full Story' : "Lire l'Histoire Complète"}
              </h2>
              <p className="mb-8 text-lg text-muted-foreground">
                {locale === 'en'
                  ? `Learn how Kilalo supported ${name} in their growth journey`
                  : `Découvrez comment Kilalo a soutenu ${name} dans leur parcours de croissance`}
              </p>
              <Button size="lg" asChild>
                <Link href={`/${locale}/case-studies/${venture.caseStudy.slug.current}`}>
                  {locale === 'en' ? 'View Case Study →' : "Voir l'Étude de Cas →"}
                </Link>
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* Website Link */}
      {venture.websiteUrl && (
        <section className="py-12">
          <div className="container">
            <div className="mx-auto max-w-3xl text-center">
              <Button variant="outline" size="lg" asChild>
                <a href={venture.websiteUrl} target="_blank" rel="noopener noreferrer">
                  {locale === 'en' ? 'Visit Website →' : 'Visiter le Site Web →'}
                </a>
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-16">
        <div className="container">
          <div className="mx-auto max-w-4xl">
            <BusinessAssessmentCTA variant="card" />
          </div>
        </div>
      </section>

      {/* Back to Ventures */}
      <section className="pb-8">
        <div className="container">
          <div className="text-center">
            <Button variant="outline" asChild>
              <Link href={`/${locale}/ventures`}>
                {locale === 'en' ? '← View All Ventures' : '← Voir Toutes les Entreprises'}
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}

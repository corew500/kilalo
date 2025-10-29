import type { Metadata } from 'next'
import { client } from '@/sanity/lib/client'
import { BusinessAssessmentCTA } from '@/components/shared/BusinessAssessmentCTA'
import { VentureCard } from '@/components/shared/VentureCard'
import { Button } from '@/components/ui/button'
import { getLocalizedField } from '@/lib/i18n-helpers'
import { getSiteSettings } from '@/lib/sanity-helpers'
import { siteConfig } from '@/lib/seo'
import Link from 'next/link'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const isEnglish = locale === 'en'

  const title = isEnglish
    ? 'Empowering DRC Entrepreneurs | Kilalo'
    : 'Autonomiser les entrepreneurs RDC | Kilalo'

  const description = isEnglish
    ? 'Venture studio helping Congolese entrepreneurs scale for-profit solutions to poverty and hunger through structured programs and support.'
    : 'Studio de venture aidant les entrepreneurs congolais à développer des solutions à but lucratif contre la pauvreté et la faim.'

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `${siteConfig.url}/${locale}`,
      siteName: siteConfig.name,
      images: [
        {
          url: siteConfig.ogImage,
          width: 1200,
          height: 630,
          alt: siteConfig.name,
        },
      ],
      locale: siteConfig.locale[locale as 'en' | 'fr'],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [siteConfig.ogImage],
      creator: siteConfig.social.twitter,
    },
    alternates: {
      canonical: `${siteConfig.url}/${locale}`,
      languages: {
        en: `${siteConfig.url}/en`,
        fr: `${siteConfig.url}/fr`,
      },
    },
  }
}

async function getFeaturedData() {
  const data = await client.fetch(`
    {
      "ventures": *[_type == "venture" && featured == true] | order(order asc) [0...4] {
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
      },
      "nextEvent": *[_type == "event" && status == "upcoming" && featured == true] | order(eventDate asc) [0] {
        _id,
        titleEn,
        titleFr,
        descriptionEn,
        descriptionFr,
        eventDate,
        format,
        registrationUrl,
        status,
        speakers
      }
    }
  `)
  return data
}

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const { ventures } = await getFeaturedData()
  const settings = await getSiteSettings(locale)

  return (
    <>
      {/* Hero Section - DRC Focused */}
      <section className="relative overflow-hidden bg-gradient-to-b from-background via-teal/5 to-background py-20 md:py-32">
        <div className="container">
          <div className="mx-auto max-w-4xl space-y-8 text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
              {locale === 'en' ? (
                <>
                  Scaling <span className="text-teal">for-profit solutions</span> to address poverty
                  and hunger in the DRC
                </>
              ) : (
                <>
                  Développer des <span className="text-teal">solutions à but lucratif</span> pour
                  lutter contre la pauvreté et la faim en RDC
                </>
              )}
            </h1>

            <p className="mx-auto max-w-3xl text-lg text-muted-foreground sm:text-xl">
              {settings?.heroSubtitle ||
                'A venture studio helping Congolese entrepreneurs bring structure, clarity, and growth to their businesses through our proven Vision & Structure system.'}
            </p>

            <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
              <Button size="lg" asChild className="bg-orange text-white hover:bg-orange/90">
                <Link href="/work-with-us">
                  {settings?.heroCtaPrimary || 'Start with Free Assessment'}
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                asChild
                className="border-teal text-teal hover:bg-teal hover:text-white"
              >
                <Link href="/programs">{settings?.heroCtaSecondary || 'Explore V2S Program'}</Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Background decoration */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute left-1/2 top-0 ml-[calc(50%-30rem)] aspect-[1155/678] w-[72.1875rem] -translate-x-1/2 bg-gradient-to-tr from-teal/20 to-orange/20 opacity-30 blur-3xl" />
        </div>
      </section>

      {/* What We Do */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="mx-auto max-w-5xl">
            <div className="mb-12 text-center">
              <h2 className="mb-3 text-3xl font-bold">{settings?.whatWeDoTitle || 'What We Do'}</h2>
              <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
                {settings?.whatWeDoSubtitle || 'Three ways we support Congolese entrepreneurs'}
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-3">
              {/* Programs */}
              <div className="text-center">
                <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-teal/10">
                  <svg
                    className="h-8 w-8 text-teal"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <h3 className="mb-2 text-xl font-semibold">
                  {settings?.programsTitle || 'Programs'}
                </h3>
                <p className="mb-4 text-sm text-muted-foreground">
                  {settings?.programsDescription ||
                    '16-week V2S intensive and monthly Hekima Time webinars'}
                </p>
                <Link href="/programs" className="text-sm font-medium text-teal hover:underline">
                  {settings?.programsCta || 'Explore Programs →'}
                </Link>
              </div>

              {/* Services */}
              <div className="text-center">
                <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-orange/10">
                  <svg
                    className="h-8 w-8 text-orange"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="mb-2 text-xl font-semibold">
                  {settings?.servicesTitle || 'Services'}
                </h3>
                <p className="mb-4 text-sm text-muted-foreground">
                  {settings?.servicesDescription ||
                    'Business structuring, strategy, and hands-on support'}
                </p>
                <Link href="/services" className="text-sm font-medium text-orange hover:underline">
                  {settings?.servicesCta || 'Explore Services →'}
                </Link>
              </div>

              {/* Community */}
              <div className="text-center">
                <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-forest/10">
                  <svg
                    className="h-8 w-8 text-forest"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="mb-2 text-xl font-semibold">
                  {settings?.communityTitle || 'Community'}
                </h3>
                <p className="mb-4 text-sm text-muted-foreground">
                  {settings?.communityDescription ||
                    'Network of entrepreneurs, free resources, and monthly events'}
                </p>
                <Link href="/community" className="text-sm font-medium text-forest hover:underline">
                  {settings?.communityCta || 'Join Community →'}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Ventures */}
      <section className="bg-muted/30 py-16 md:py-24">
        <div className="container">
          <div className="mx-auto max-w-6xl">
            <div className="mb-12 text-center">
              <h2 className="mb-3 text-3xl font-bold">
                {settings?.successStoriesTitle || 'Success Stories'}
              </h2>
              <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
                {settings?.successStoriesSubtitle ||
                  'Congolese businesses creating measurable social and economic impact'}
              </p>
            </div>

            {ventures && ventures.length > 0 ? (
              <div className="mb-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {ventures.map((venture: any) => (
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
              <div className="py-12 text-center">
                <p className="text-muted-foreground">
                  {settings?.venturesComingSoon || 'Featured ventures coming soon'}
                </p>
              </div>
            )}

            <div className="text-center">
              <Button variant="outline" size="lg" asChild>
                <Link href="/ventures">{settings?.viewAllVentures || 'View All Ventures →'}</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Three-Audience CTA Section */}
      <section className="bg-muted/30 py-16 md:py-24">
        <div className="container">
          <div className="mx-auto max-w-6xl">
            <div className="mb-12 text-center">
              <h2 className="mb-3 text-3xl font-bold">
                {settings?.howCanWeHelpTitle || 'How Can We Help?'}
              </h2>
              <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
                {settings?.howCanWeHelpSubtitle ||
                  "Whether you're an entrepreneur, investor, or expert — there's a place for you"}
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              <div className="rounded-lg border-2 border-teal/20 bg-background p-8 text-center transition-colors hover:border-teal/40">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-teal/10">
                  <svg
                    className="h-6 w-6 text-teal"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="mb-2 text-xl font-semibold">
                  {settings?.forEntrepreneursTitle || 'For Entrepreneurs'}
                </h3>
                <p className="mb-6 text-sm text-muted-foreground">
                  {settings?.forEntrepreneursDescription ||
                    'Ready to scale your business? Start with a free evaluation to see if V2S is right for you.'}
                </p>
                <Button asChild className="w-full bg-teal hover:bg-teal/90">
                  <Link href="/work-with-us#entrepreneurs">
                    {settings?.forEntrepreneursCta || 'Get Free Assessment'}
                  </Link>
                </Button>
              </div>

              <div className="rounded-lg border-2 border-orange/20 bg-background p-8 text-center transition-colors hover:border-orange/40">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-orange/10">
                  <svg
                    className="h-6 w-6 text-orange"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="mb-2 text-xl font-semibold">
                  {settings?.forPartnersTitle || 'For Partners & Investors'}
                </h3>
                <p className="mb-6 text-sm text-muted-foreground">
                  {settings?.forPartnersDescription ||
                    'Invest in impact. Explore partnership opportunities and co-investment models.'}
                </p>
                <Button
                  variant="outline"
                  asChild
                  className="w-full border-orange text-orange hover:bg-orange hover:text-white"
                >
                  <Link href="/work-with-us#partners">
                    {settings?.forPartnersCta || 'Explore Partnerships'}
                  </Link>
                </Button>
              </div>

              <div className="rounded-lg border-2 border-forest/20 bg-background p-8 text-center transition-colors hover:border-forest/40">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-forest/10">
                  <svg
                    className="h-6 w-6 text-forest"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <h3 className="mb-2 text-xl font-semibold">
                  {settings?.forMentorsTitle || 'For Mentors & Experts'}
                </h3>
                <p className="mb-6 text-sm text-muted-foreground">
                  {settings?.forMentorsDescription ||
                    'Share your expertise. Contribute to V2S program or speak at Hekima Time.'}
                </p>
                <Button
                  variant="outline"
                  asChild
                  className="w-full border-forest text-forest hover:bg-forest hover:text-white"
                >
                  <Link href="/work-with-us#mentors">
                    {settings?.forMentorsCta || 'Join Our Network'}
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="mx-auto max-w-4xl">
            <BusinessAssessmentCTA variant="card" />
          </div>
        </div>
      </section>
    </>
  )
}

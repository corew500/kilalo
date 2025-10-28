import type { Metadata } from 'next'
import { client } from '@/sanity/lib/client'
import { BusinessAssessmentCTA } from '@/components/shared/BusinessAssessmentCTA'
import { EventCard } from '@/components/shared/EventCard'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { getLocalizedField } from '@/lib/i18n-helpers'
import { siteConfig } from '@/lib/seo'
import Link from 'next/link'

async function getProgramsData() {
  const data = await client.fetch(`
    {
      "v2sProgram": *[_type == "program" && programType == "v2s"][0] {
        _id,
        nameEn,
        nameFr,
        shortDescriptionEn,
        shortDescriptionFr,
        duration,
        format,
        eligibilityEn,
        eligibilityFr,
        keyFeatures[]{
          titleEn,
          titleFr,
          descriptionEn,
          descriptionFr
        },
        outcomesEn,
        outcomesFr,
        curriculum[]{
          week,
          toolNameEn,
          toolNameFr,
          descriptionEn,
          descriptionFr
        },
        testimonials[]{
          quoteEn,
          quoteFr,
          author,
          company
        },
        applicationUrl
      },
      "upcomingEvents": *[_type == "event" && status == "upcoming" && series == "hekima-time"] | order(eventDate asc) [0...3] {
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
      },
      "pastEvents": *[_type == "event" && status == "completed" && series == "hekima-time"] | order(eventDate desc) [0...3] {
        _id,
        titleEn,
        titleFr,
        eventDate,
        keyTakeawaysEn,
        keyTakeawaysFr,
        recordingUrl
      }
    }
  `)
  return data
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const isEnglish = locale === 'en'

  const title = isEnglish
    ? 'Programs'
    : 'Programmes'

  const description = isEnglish
    ? 'Transform your business with the 16-week Vision & Structure Program and join monthly Hekima Time community learning sessions.'
    : 'Transformez votre entreprise avec le programme V2S de 16 semaines et rejoignez les sessions communautaires Hekima Time mensuelles.'

  return {
    title,
    description,
    openGraph: {
      title: `${title} | ${siteConfig.name}`,
      description,
      url: `${siteConfig.url}/${locale}/programs`,
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
      title: `${title} | ${siteConfig.name}`,
      description,
      images: [siteConfig.ogImage],
      creator: siteConfig.social.twitter,
    },
    alternates: {
      canonical: `${siteConfig.url}/${locale}/programs`,
      languages: {
        en: `${siteConfig.url}/en/programs`,
        fr: `${siteConfig.url}/fr/programs`,
      },
    },
  }
}

export default async function ProgramsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const { v2sProgram, upcomingEvents, pastEvents } = await getProgramsData()

  return (
    <div className="container py-16 md:py-24">
      {/* Hero */}
      <div className="mx-auto max-w-3xl text-center mb-16">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-4">
          Programs That Transform Businesses
        </h1>
        <p className="text-lg text-muted-foreground">
          From structured accelerator programs to community learning sessions,
          we provide the support Congolese entrepreneurs need to scale.
        </p>
      </div>

      {/* Vision & Structure Program */}
      <section className="mb-24">
        <div className="rounded-lg bg-gradient-to-br from-teal/5 to-orange/5 border-2 border-teal/20 p-8 md:p-12 mb-12">
          <div className="grid gap-8 lg:grid-cols-2 items-center">
            <div>
              <div className="inline-flex items-center rounded-full bg-teal/10 px-3 py-1 text-sm font-medium text-teal mb-4">
                Flagship Program
              </div>
              <h2 className="text-3xl font-bold mb-4">
                {getLocalizedField(v2sProgram, 'name', locale) || 'Vision & Structure Program'}
              </h2>
              <p className="text-lg text-muted-foreground mb-6">
                {getLocalizedField(v2sProgram, 'shortDescription', locale) ||
                  'A 16-week intensive program that transforms businesses through 8 essential tools, from vision clarity to financial modeling.'}
              </p>

              {v2sProgram?.duration && (
                <div className="flex items-center gap-6 text-sm mb-6">
                  <div className="flex items-center gap-2">
                    <svg className="h-5 w-5 text-teal" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{v2sProgram.duration}</span>
                  </div>
                  {v2sProgram.format && (
                    <div className="flex items-center gap-2">
                      <svg className="h-5 w-5 text-teal" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                        <path d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                      <span>{v2sProgram.format}</span>
                    </div>
                  )}
                </div>
              )}

              <BusinessAssessmentCTA variant="default" />
            </div>

            {v2sProgram?.testimonials && v2sProgram.testimonials.length > 0 && (
              <div className="rounded-lg bg-background p-6 border border-teal/20">
                <blockquote className="space-y-4">
                  <p className="text-lg italic">"{getLocalizedField(v2sProgram.testimonials[0], 'quote', locale)}"</p>
                  <footer className="text-sm font-medium">
                    — {v2sProgram.testimonials[0].author}
                    {v2sProgram.testimonials[0].company && `, ${v2sProgram.testimonials[0].company}`}
                  </footer>
                </blockquote>
              </div>
            )}
          </div>
        </div>

        {/* The 8 Tools / Curriculum */}
        {v2sProgram?.curriculum && v2sProgram.curriculum.length > 0 && (
          <div className="mb-12">
            <h3 className="text-2xl font-bold text-center mb-8">The 8 Essential Tools</h3>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {v2sProgram.curriculum.slice(0, 8).map((tool: any, index: number) => (
                <Card key={index} className="border-2 border-teal/10 hover:border-teal/30 transition-colors">
                  <CardHeader>
                    <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-teal/10 mb-3">
                      <span className="text-lg font-bold text-teal">{tool.week || index + 1}</span>
                    </div>
                    <CardTitle className="text-lg">{getLocalizedField(tool, 'toolName', locale)}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{getLocalizedField(tool, 'description', locale)}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Eligibility & Outcomes */}
        <div className="grid gap-8 md:grid-cols-2">
          {v2sProgram?.eligibilityEn && (
            <Card>
              <CardHeader>
                <CardTitle className="text-teal">Who Can Apply?</CardTitle>
                <CardDescription>Eligibility criteria for the V2S Program</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {(locale === 'en' ? v2sProgram.eligibilityEn : v2sProgram.eligibilityFr || v2sProgram.eligibilityEn)?.split('\n').map((item: string, index: number) => (
                    <li key={index} className="flex items-start">
                      <svg className="h-5 w-5 text-teal shrink-0 mr-2 mt-0.5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                        <path d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-sm">{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {v2sProgram?.outcomesEn && (
            <Card>
              <CardHeader>
                <CardTitle className="text-orange">Expected Outcomes</CardTitle>
                <CardDescription>What you'll achieve in the program</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {(locale === 'en' ? v2sProgram.outcomesEn : v2sProgram.outcomesFr || v2sProgram.outcomesEn)?.split('\n').map((item: string, index: number) => (
                    <li key={index} className="flex items-start">
                      <svg className="h-5 w-5 text-orange shrink-0 mr-2 mt-0.5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-sm">{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </div>
      </section>

      {/* Hekima Time Section */}
      <section className="mb-24">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Hekima Time</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Free monthly webinars for Congolese entrepreneurs. Learn from experts,
            connect with peers, and grow your business knowledge.
          </p>
        </div>

        {/* Upcoming Sessions */}
        {upcomingEvents && upcomingEvents.length > 0 && (
          <div className="mb-12">
            <h3 className="text-xl font-semibold mb-6">Upcoming Sessions</h3>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {upcomingEvents.map((event: any) => (
                <EventCard
                  key={event._id}
                  title={getLocalizedField(event, 'title', locale)}
                  description={getLocalizedField(event, 'description', locale)}
                  date={event.eventDate}
                  format={event.format}
                  registrationUrl={event.registrationUrl}
                  status={event.status}
                  speakers={event.speakers}
                />
              ))}
            </div>
          </div>
        )}

        {/* Past Sessions */}
        {pastEvents && pastEvents.length > 0 && (
          <div>
            <h3 className="text-xl font-semibold mb-6">Past Sessions</h3>
            <div className="grid gap-4 md:grid-cols-3">
              {pastEvents.map((event: any) => (
                <Card key={event._id}>
                  <CardHeader>
                    <CardTitle className="text-lg">{getLocalizedField(event, 'title', locale)}</CardTitle>
                    <CardDescription>
                      {new Date(event.eventDate).toLocaleDateString(locale === 'fr' ? 'fr-FR' : 'en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </CardDescription>
                  </CardHeader>
                  {((locale === 'en' ? event.keyTakeawaysEn : event.keyTakeawaysFr) || event.keyTakeawaysEn) && (
                    <CardContent>
                      <p className="text-sm font-medium mb-2">Key Takeaways:</p>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        {((locale === 'en' ? event.keyTakeawaysEn : event.keyTakeawaysFr) || event.keyTakeawaysEn)?.split('\n').slice(0, 3).map((takeaway: string, index: number) => (
                          <li key={index}>• {takeaway}</li>
                        ))}
                      </ul>
                      {event.recordingUrl && (
                        <Button variant="link" asChild className="px-0 mt-3">
                          <a href={event.recordingUrl} target="_blank" rel="noopener noreferrer">
                            Watch Recording →
                          </a>
                        </Button>
                      )}
                    </CardContent>
                  )}
                </Card>
              ))}
            </div>
          </div>
        )}

        <div className="text-center mt-8">
          <Button variant="outline" size="lg" asChild>
            <Link href="/community">View All Hekima Time Sessions →</Link>
          </Button>
        </div>
      </section>

      {/* Final CTA */}
      <BusinessAssessmentCTA variant="card" />
    </div>
  )
}

import { client } from '@/sanity/lib/client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { getLocalizedField } from '@/lib/i18n-helpers'
import type { SanityCaseStudy } from '@/types/sanity'
import Link from 'next/link'

async function getCaseStudies() {
  const caseStudies = await client.fetch(`
    *[_type == "caseStudy"] | order(publishedAt desc) {
      _id,
      titleEn,
      titleFr,
      slug,
      challengeEn,
      challengeFr,
      impactHighlightEn,
      impactHighlightFr,
      venture->{
        _id,
        nameEn,
        nameFr,
        slug,
        sector,
        location
      },
      publishedAt
    }
  `)
  return caseStudies
}

export const metadata = {
  title: 'Case Studies | Kilalo',
  description:
    'Real impact stories from Congolese entrepreneurs transforming their businesses and communities.',
}

export default async function CaseStudiesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const caseStudies = await getCaseStudies()

  return (
    <div className="container py-16 md:py-24">
      {/* Hero */}
      <div className="mx-auto mb-16 max-w-3xl text-center">
        <h1 className="mb-4 text-4xl font-bold tracking-tight sm:text-5xl">Case Studies</h1>
        <p className="text-lg text-muted-foreground">
          Real stories of Congolese entrepreneurs creating measurable impact through structured
          business growth.
        </p>
      </div>

      {/* Case Studies Grid */}
      {caseStudies && caseStudies.length > 0 ? (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {caseStudies.map((study: SanityCaseStudy) => (
            <Card key={study._id} className="flex flex-col">
              <CardHeader>
                {study.venture && (
                  <div className="mb-2 flex items-center gap-2 text-sm text-muted-foreground">
                    <span>{getLocalizedField(study.venture, 'name', locale)}</span>
                    {study.venture.sector && (
                      <>
                        <span>•</span>
                        <span className="capitalize">{study.venture.sector}</span>
                      </>
                    )}
                  </div>
                )}
                <CardTitle className="text-xl">
                  {getLocalizedField(study, 'title', locale)}
                </CardTitle>
                <CardDescription>
                  {getLocalizedField(study, 'challengeEn', locale)?.slice(0, 120)}...
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-1 flex-col justify-end">
                {study.impactHighlightEn && (
                  <div className="mb-4 rounded-lg border border-teal/20 bg-teal/5 p-4">
                    <p className="mb-1 text-sm font-semibold text-teal">Impact Highlight</p>
                    <p className="text-sm">{getLocalizedField(study, 'impactHighlight', locale)}</p>
                  </div>
                )}
                <Button variant="outline" asChild className="w-full">
                  <Link href={`/${locale}/case-studies/${study.slug.current}`}>
                    Read Full Story →
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="py-12 text-center">
          <Card className="mx-auto max-w-md">
            <CardContent className="pt-6">
              <p className="mb-4 text-muted-foreground">
                Case studies coming soon. We're documenting the incredible impact stories from our
                ventures.
              </p>
              <Button variant="outline" asChild>
                <Link href={`/${locale}/ventures`}>View Our Ventures →</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {/* CTA Section */}
      <div className="mt-16 rounded-lg bg-gradient-to-r from-teal/10 to-orange/10 p-8 text-center md:p-12">
        <h2 className="mb-4 text-2xl font-bold">Want to Create Your Own Success Story?</h2>
        <p className="mx-auto mb-6 max-w-2xl text-muted-foreground">
          Join the V2S Program and transform your business with proven systems and hands-on support.
        </p>
        <Button size="lg" asChild className="bg-orange hover:bg-orange/90">
          <Link href={`/${locale}/work-with-us`}>Start with Free Assessment</Link>
        </Button>
      </div>
    </div>
  )
}

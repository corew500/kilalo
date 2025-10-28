import type { Metadata } from 'next'
import { client } from '@/sanity/lib/client'
import { urlFor } from '@/sanity/lib/image'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { getLocalizedField } from '@/lib/i18n-helpers'
import { siteConfig } from '@/lib/seo'
import Link from 'next/link'
import { notFound } from 'next/navigation'

async function getCaseStudy(slug: string) {
  const caseStudy = await client.fetch(
    `*[_type == "caseStudy" && slug.current == $slug][0] {
      _id,
      titleEn,
      titleFr,
      slug,
      challengeEn,
      challengeFr,
      partnershipEn,
      partnershipFr,
      impactEn,
      impactFr,
      whyItMattersEn,
      whyItMattersFr,
      impactHighlightEn,
      impactHighlightFr,
      publishedAt,
      venture->{
        _id,
        nameEn,
        nameFr,
        slug,
        taglineEn,
        taglineFr,
        sector,
        location,
        logo
      }
    }`,
    { slug }
  )
  return caseStudy
}

export async function generateStaticParams() {
  const slugs = await client.fetch(`*[_type == "caseStudy"]{ "slug": slug.current }`)
  return slugs.map((item: { slug: string }) => ({ slug: item.slug }))
}

export async function generateMetadata({
  params
}: {
  params: Promise<{ slug: string; locale: string }>
}): Promise<Metadata> {
  const { slug, locale } = await params
  const caseStudy = await getCaseStudy(slug)

  if (!caseStudy) {
    return {
      title: 'Case Study Not Found',
    }
  }

  const title = getLocalizedField(caseStudy, 'title', locale)
  const challenge = getLocalizedField(caseStudy, 'challenge', locale)
  const impactHighlight = getLocalizedField(caseStudy, 'impactHighlight', locale)
  const description = impactHighlight || challenge?.substring(0, 155) || 'Read this case study from Kilalo'

  const imageUrl = caseStudy.venture?.logo
    ? urlFor(caseStudy.venture.logo).width(1200).height(630).url()
    : siteConfig.ogImage

  return {
    title,
    description,
    openGraph: {
      title: `${title} | ${siteConfig.name}`,
      description,
      url: `${siteConfig.url}/${locale}/case-studies/${slug}`,
      siteName: siteConfig.name,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale: siteConfig.locale[locale as 'en' | 'fr'],
      type: 'article',
      publishedTime: caseStudy.publishedAt,
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} | ${siteConfig.name}`,
      description,
      images: [imageUrl],
      creator: siteConfig.social.twitter,
    },
    alternates: {
      canonical: `${siteConfig.url}/${locale}/case-studies/${slug}`,
      languages: {
        en: `${siteConfig.url}/en/case-studies/${slug}`,
        fr: `${siteConfig.url}/fr/case-studies/${slug}`,
      },
    },
  }
}

export default async function CaseStudyPage({ params }: { params: Promise<{ slug: string; locale: string }> }) {
  const { slug, locale } = await params
  const caseStudy = await getCaseStudy(slug)

  if (!caseStudy) {
    notFound()
  }

  return (
    <div className="container py-16 md:py-24">
      {/* Header */}
      <div className="mx-auto max-w-4xl mb-12">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link href={`/${locale}`} className="hover:text-foreground">
            Home
          </Link>
          <span>→</span>
          <Link href={`/${locale}/case-studies`} className="hover:text-foreground">
            Case Studies
          </Link>
          <span>→</span>
          <span className="text-foreground">{getLocalizedField(caseStudy, 'title', locale)}</span>
        </div>

        {/* Venture Info */}
        {caseStudy.venture && (
          <div className="mb-6">
            <Link
              href={`/${locale}/ventures/${caseStudy.venture.slug.current}`}
              className="inline-flex items-center gap-2 text-sm text-teal hover:text-teal/80 font-medium"
            >
              {getLocalizedField(caseStudy.venture, 'name', locale)}
              {caseStudy.venture.sector && (
                <span className="px-2 py-1 rounded-full bg-teal/10 text-xs">
                  {caseStudy.venture.sector}
                </span>
              )}
            </Link>
            {caseStudy.venture.taglineEn && (
              <p className="text-sm text-muted-foreground mt-1">
                {getLocalizedField(caseStudy.venture, 'tagline', locale)}
              </p>
            )}
          </div>
        )}

        {/* Title */}
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-6">
          {getLocalizedField(caseStudy, 'title', locale)}
        </h1>

        {/* Impact Highlight */}
        {caseStudy.impactHighlightEn && (
          <div className="rounded-lg bg-gradient-to-r from-teal/10 to-orange/10 border-2 border-teal/20 p-6 mb-8">
            <p className="text-sm font-semibold text-teal uppercase tracking-wide mb-2">
              Impact Highlight
            </p>
            <p className="text-xl font-semibold">
              {getLocalizedField(caseStudy, 'impactHighlight', locale)}
            </p>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="mx-auto max-w-4xl space-y-12">
        {/* Challenge */}
        {caseStudy.challengeEn && (
          <section>
            <h2 className="text-2xl font-bold mb-4 text-orange">The Challenge</h2>
            <Card>
              <CardContent className="pt-6">
                <p className="text-lg leading-relaxed whitespace-pre-wrap">
                  {getLocalizedField(caseStudy, 'challenge', locale)}
                </p>
              </CardContent>
            </Card>
          </section>
        )}

        {/* Partnership */}
        {caseStudy.partnershipEn && (
          <section>
            <h2 className="text-2xl font-bold mb-4 text-teal">The Partnership</h2>
            <Card>
              <CardContent className="pt-6">
                <p className="text-lg leading-relaxed whitespace-pre-wrap">
                  {getLocalizedField(caseStudy, 'partnership', locale)}
                </p>
              </CardContent>
            </Card>
          </section>
        )}

        {/* Impact */}
        {caseStudy.impactEn && (
          <section>
            <h2 className="text-2xl font-bold mb-4 text-forest">The Impact</h2>
            <Card>
              <CardContent className="pt-6">
                <p className="text-lg leading-relaxed whitespace-pre-wrap">
                  {getLocalizedField(caseStudy, 'impact', locale)}
                </p>
              </CardContent>
            </Card>
          </section>
        )}

        {/* Why It Matters */}
        {caseStudy.whyItMattersEn && (
          <section>
            <h2 className="text-2xl font-bold mb-4">Why It Matters</h2>
            <Card className="border-2 border-orange/20 bg-gradient-to-br from-orange/5 to-teal/5">
              <CardContent className="pt-6">
                <p className="text-lg leading-relaxed whitespace-pre-wrap">
                  {getLocalizedField(caseStudy, 'whyItMatters', locale)}
                </p>
              </CardContent>
            </Card>
          </section>
        )}

        {/* CTA */}
        <div className="rounded-lg bg-muted/50 p-8 text-center">
          <h3 className="text-2xl font-bold mb-3">Ready to Transform Your Business?</h3>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Start with a free business assessment to see if the V2S Program is right for you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild className="bg-orange hover:bg-orange/90">
              <Link href={`/${locale}/work-with-us`}>Get Free Assessment</Link>
            </Button>
            {caseStudy.venture && (
              <Button size="lg" variant="outline" asChild>
                <Link href={`/${locale}/ventures/${caseStudy.venture.slug.current}`}>
                  Learn More About {getLocalizedField(caseStudy.venture, 'name', locale)} →
                </Link>
              </Button>
            )}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-center pt-8 border-t">
          <Button variant="ghost" asChild>
            <Link href={`/${locale}/case-studies`}>
              ← Back to All Case Studies
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

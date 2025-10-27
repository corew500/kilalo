import { client } from '@/sanity/lib/client'
import { urlFor } from '@/sanity/lib/image'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { BusinessAssessmentCTA } from '@/components/shared/BusinessAssessmentCTA'

async function getVenture(slug: string) {
  const data = await client.fetch(`
    *[_type == "venture" && slug.current == $slug][0] {
      _id,
      name,
      slug,
      description,
      sector,
      location,
      tagline,
      metricsHighlight,
      logo,
      websiteUrl,
      caseStudy->{
        _id,
        title,
        slug
      }
    }
  `, { slug })

  return data
}

export async function generateStaticParams() {
  const slugs = await client.fetch(`
    *[_type == "venture"] {
      "slug": slug.current
    }
  `)

  return slugs.map((item: any) => ({
    slug: item.slug,
  }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const venture = await getVenture(slug)

  if (!venture) {
    return {
      title: 'Venture Not Found',
    }
  }

  return {
    title: `${venture.name} | Kilalo`,
    description: venture.tagline || venture.description,
  }
}

export default async function VentureDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const venture = await getVenture(slug)

  if (!venture) {
    notFound()
  }

  return (
    <div className="pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-teal/10 to-background py-16 md:py-24">
        <div className="container">
          <div className="mx-auto max-w-4xl">
            {/* Breadcrumb */}
            <nav className="mb-6 text-sm text-muted-foreground">
              <Link href="/ventures" className="hover:text-teal transition-colors">
                Ventures
              </Link>
              <span className="mx-2">/</span>
              <span>{venture.name}</span>
            </nav>

            <div className="text-center">
              {venture.logo && (
                <div className="mb-6 inline-block bg-white p-6 rounded-lg shadow-sm">
                  <Image
                    src={urlFor(venture.logo).width(300).url()}
                    alt={`${venture.name} logo`}
                    width={300}
                    height={120}
                    className="h-24 w-auto"
                  />
                </div>
              )}
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-4">
                {venture.name}
              </h1>
              <p className="text-xl text-muted-foreground mb-6">
                {venture.tagline}
              </p>
              <div className="flex flex-wrap gap-3 justify-center mb-8">
                <span className="inline-flex items-center rounded-full bg-teal/10 px-4 py-2 text-sm font-medium text-teal">
                  {venture.sector.replace('-', ' ')}
                </span>
                <span className="inline-flex items-center rounded-full bg-orange/10 px-4 py-2 text-sm font-medium text-orange">
                  {venture.location}
                </span>
                {venture.metricsHighlight && (
                  <span className="inline-flex items-center rounded-full bg-forest/10 px-4 py-2 text-sm font-medium text-forest">
                    {venture.metricsHighlight}
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
            <p className="text-lg text-muted-foreground leading-relaxed">
              {venture.description}
            </p>
          </div>
        </div>
      </section>

      {/* Case Study CTA */}
      {venture.caseStudy && (
        <section className="py-16 bg-gradient-to-br from-teal/10 via-background to-orange/10">
          <div className="container">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="text-3xl font-bold mb-4">Read the Full Story</h2>
              <p className="text-lg text-muted-foreground mb-8">
                Learn how Kilalo supported {venture.name} in their growth journey
              </p>
              <Button size="lg" asChild>
                <Link href={`/case-studies/${venture.caseStudy.slug.current}`}>
                  View Case Study →
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
                  Visit Website →
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
              <Link href="/ventures">← View All Ventures</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}

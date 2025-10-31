import type { Metadata } from 'next'
import { client } from '@/sanity/lib/client'
import { EventCard } from '@/components/shared/EventCard'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { getLocalizedField } from '@/lib/i18n-helpers'
import { siteConfig } from '@/lib/seo'
import { getSiteSettings } from '@/lib/sanity-helpers'
import type { SanityEvent, SanityPost } from '@/types/sanity'
import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import {
  generateCollectionPageSchema,
  generateBreadcrumbSchema,
  renderJsonLd,
} from '@/lib/structured-data'

async function getCommunityData() {
  const data = await client.fetch(`
    {
      "upcomingEvents": *[_type == "event" && series == "hekima-time" && status == "upcoming"] | order(eventDate asc) {
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
      "pastEvents": *[_type == "event" && series == "hekima-time" && status == "completed"] | order(eventDate desc) [0...6] {
        _id,
        titleEn,
        titleFr,
        descriptionEn,
        descriptionFr,
        eventDate,
        format,
        recordingUrl,
        status,
        speakers,
        keyTakeawaysEn,
        keyTakeawaysFr
      },
      "recentPosts": *[_type == "post"] | order(publishedAt desc) [0...3] {
        _id,
        titleEn,
        titleFr,
        slug,
        excerptEn,
        excerptFr,
        publishedAt,
        author->{
          name
        }
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
  const settings = await getSiteSettings(locale)

  const title = settings?.communityPageTitle || 'Community'
  const description =
    settings?.communityPageDescription ||
    'Join the Kilalo community. Free monthly Hekima Time webinars, insights from Congolese entrepreneurs, and networking opportunities.'

  return {
    title,
    description,
    openGraph: {
      title: `${title} | ${siteConfig.name}`,
      description,
      url: `${siteConfig.url}/${locale}/community`,
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
      canonical: `${siteConfig.url}/${locale}/community`,
      languages: {
        en: `${siteConfig.url}/en/community`,
        fr: `${siteConfig.url}/fr/community`,
      },
    },
  }
}

export default async function CommunityPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const { upcomingEvents, pastEvents, recentPosts } = await getCommunityData()
  const settings = await getSiteSettings(locale)
  const t = await getTranslations('Common')

  const collectionSchema = generateCollectionPageSchema({
    name: locale === 'en' ? 'Community' : 'Communauté',
    description:
      locale === 'en'
        ? 'Events, blog posts, and resources for Congolese entrepreneurs'
        : 'Événements, articles de blog et ressources pour les entrepreneurs congolais',
    url: `${siteConfig.url}/${locale}/community`,
    locale,
  })

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: locale === 'en' ? 'Home' : 'Accueil', url: `${siteConfig.url}/${locale}` },
    { name: locale === 'en' ? 'Community' : 'Communauté' },
  ])

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={renderJsonLd(collectionSchema)} />
      <script type="application/ld+json" dangerouslySetInnerHTML={renderJsonLd(breadcrumbSchema)} />
      <div className="container py-16 md:py-24">
        {/* Header */}
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <h1 className="mb-4 text-4xl font-bold tracking-tight sm:text-5xl">
            {settings?.communityHeroTitle || 'Kilalo Community'}
          </h1>
          <p className="text-lg text-muted-foreground">
            {settings?.communityHeroDescription ||
              'Free resources, monthly webinars, and a network of Congolese entrepreneurs building scalable businesses. Everyone is welcome to learn and contribute.'}
          </p>
        </div>

        {/* Hekima Time Section */}
        <section className="mb-20">
          <div className="mb-12 text-center">
            <div className="mb-4 inline-flex items-center justify-center rounded-full bg-teal/10 px-4 py-2">
              <span className="text-sm font-semibold text-teal">Hekima Time</span>
            </div>
            <h2 className="mb-3 text-3xl font-bold">
              {settings?.communityHekimaTimeTitle || 'Free Monthly Webinars for Entrepreneurs'}
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              {settings?.communityHekimaTimeDescription ||
                'Learn from experienced entrepreneurs, business experts, and Kilalo mentors. Every session is recorded and freely available.'}
            </p>
          </div>

          {/* Upcoming Sessions */}
          {upcomingEvents && upcomingEvents.length > 0 && (
            <div className="mb-12">
              <h3 className="mb-6 text-2xl font-semibold">
                {settings?.communityUpcomingTitle || 'Upcoming Sessions'}
              </h3>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {upcomingEvents.map((event: SanityEvent) => (
                  <EventCard
                    key={event._id}
                    title={getLocalizedField(event, 'title', locale)}
                    description={getLocalizedField(event, 'description', locale)}
                    date={event.eventDate}
                    format={event.format}
                    registrationUrl={event.registrationUrl}
                    status={event.status}
                    speakers={event.speakers}
                    translations={{
                      upcoming: t('upcoming'),
                      recorded: t('recorded'),
                      speakers: t('speakers'),
                      registerNow: t('registerNow'),
                      watchRecording: t('watchRecording'),
                    }}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Past Sessions */}
          {pastEvents && pastEvents.length > 0 && (
            <div>
              <h3 className="mb-6 text-2xl font-semibold">
                {settings?.communityPastTitle || 'Past Sessions & Recordings'}
              </h3>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {pastEvents.map((event: SanityEvent) => (
                  <EventCard
                    key={event._id}
                    title={getLocalizedField(event, 'title', locale)}
                    description={getLocalizedField(event, 'description', locale)}
                    date={event.eventDate}
                    format={event.format}
                    recordingUrl={event.recordingUrl}
                    status={event.status}
                    speakers={event.speakers}
                    translations={{
                      upcoming: t('upcoming'),
                      recorded: t('recorded'),
                      speakers: t('speakers'),
                      registerNow: t('registerNow'),
                      watchRecording: t('watchRecording'),
                    }}
                  />
                ))}
              </div>
            </div>
          )}

          {!upcomingEvents?.length && !pastEvents?.length && (
            <div className="rounded-lg bg-muted/30 py-12 text-center">
              <p className="text-muted-foreground">
                {settings?.communityNoUpcomingEvents ||
                  'Hekima Time sessions coming soon! Check back for our schedule.'}
              </p>
            </div>
          )}
        </section>

        {/* Latest Insights */}
        {recentPosts && recentPosts.length > 0 && (
          <section className="-mx-4 mb-20 rounded-lg bg-muted/30 px-4 py-16 md:-mx-8 md:px-8">
            <div className="mb-12 text-center">
              <h2 className="mb-3 text-3xl font-bold">Latest Insights</h2>
              <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
                Stories, lessons, and insights from the Congolese entrepreneurship ecosystem
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {recentPosts.map((post: SanityPost) => (
                <Card key={post._id} className="transition-shadow hover:shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-lg">
                      {getLocalizedField(post, 'title', locale)}
                    </CardTitle>
                    {post.author && <CardDescription>By {post.author.name}</CardDescription>}
                  </CardHeader>
                  <CardContent>
                    <p className="mb-4 text-sm text-muted-foreground">
                      {getLocalizedField(post, 'excerpt', locale)}
                    </p>
                    <Button variant="link" asChild className="h-auto p-0">
                      <Link href={`/${locale}/blog/${post.slug.current}`}>Read more →</Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="mt-8 text-center">
              <Button variant="outline" size="lg" asChild>
                <Link href="/blog">View All Posts →</Link>
              </Button>
            </div>
          </section>
        )}

        {/* Join the Network */}
        <section className="rounded-lg bg-gradient-to-br from-teal/10 via-background to-orange/10 py-16">
          <div className="mx-auto max-w-3xl px-6 text-center">
            <h2 className="mb-4 text-3xl font-bold">
              {settings?.communityJoinTitle || 'Join the Kilalo Network'}
            </h2>
            <p className="mb-8 text-lg text-muted-foreground">
              {settings?.communityJoinDescription ||
                'Stay connected with the community. Get updates on Hekima Time sessions, new resources, and opportunities to engage.'}
            </p>

            <div className="mb-8 grid gap-6 md:grid-cols-3">
              <Card className="border-2 border-teal/20 transition-colors hover:border-teal/40">
                <CardHeader>
                  <div className="mx-auto mb-2 inline-flex h-12 w-12 items-center justify-center rounded-full bg-teal/10">
                    <svg
                      className="h-6 w-6 text-teal"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <CardTitle className="text-base">
                    {settings?.communityJoinBenefit1Title || 'Entrepreneurs'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="mb-4 text-sm text-muted-foreground">
                    {settings?.communityJoinBenefit1Description ||
                      'Learn from peers, access free resources, and explore the V2S program'}
                  </p>
                  <Button size="sm" asChild className="w-full bg-teal hover:bg-teal/90">
                    <Link href="/work-with-us#entrepreneurs">Learn More</Link>
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-2 border-orange/20 transition-colors hover:border-orange/40">
                <CardHeader>
                  <div className="mx-auto mb-2 inline-flex h-12 w-12 items-center justify-center rounded-full bg-orange/10">
                    <svg
                      className="h-6 w-6 text-orange"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <CardTitle className="text-base">
                    {settings?.communityJoinBenefit2Title || 'Partners & Investors'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="mb-4 text-sm text-muted-foreground">
                    {settings?.communityJoinBenefit2Description ||
                      'Explore co-investment opportunities in DRC ventures'}
                  </p>
                  <Button
                    size="sm"
                    variant="outline"
                    asChild
                    className="w-full border-orange text-orange hover:bg-orange hover:text-white"
                  >
                    <Link href="/work-with-us#partners">Partner With Us</Link>
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-2 border-forest/20 transition-colors hover:border-forest/40">
                <CardHeader>
                  <div className="mx-auto mb-2 inline-flex h-12 w-12 items-center justify-center rounded-full bg-forest/10">
                    <svg
                      className="h-6 w-6 text-forest"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </div>
                  <CardTitle className="text-base">
                    {settings?.communityJoinBenefit3Title || 'Mentors & Experts'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="mb-4 text-sm text-muted-foreground">
                    {settings?.communityJoinBenefit3Description ||
                      'Share your expertise through Hekima Time or program mentorship'}
                  </p>
                  <Button
                    size="sm"
                    variant="outline"
                    asChild
                    className="w-full border-forest text-forest hover:bg-forest hover:text-white"
                  >
                    <Link href="/work-with-us#mentors">Join Network</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Newsletter Signup Placeholder */}
            <div className="rounded-lg border-2 border-muted bg-background/60 p-6 backdrop-blur-sm">
              <h3 className="mb-4 text-lg font-semibold">Stay Updated</h3>
              <form className="mx-auto flex max-w-md flex-col gap-3 sm:flex-row">
                <div className="flex-1">
                  <Label htmlFor="email" className="sr-only">
                    Email address
                  </Label>
                  <Input id="email" type="email" placeholder="your@email.com" className="w-full" />
                </div>
                <Button type="submit" className="bg-teal hover:bg-teal/90">
                  {settings?.communityNewsletterCTAButton || 'Subscribe'}
                </Button>
              </form>
              <p className="mt-3 text-xs text-muted-foreground">
                Get notified about upcoming Hekima Time sessions and new resources
              </p>
            </div>
          </div>
        </section>

        {/* Connect on WhatsApp */}
        <section className="mt-16 text-center">
          <div className="inline-block rounded-lg bg-gradient-to-r from-teal/10 to-orange/10 p-8">
            <h3 className="mb-3 text-xl font-semibold">
              {settings?.communitySlackCTATitle || "Questions? Let's Talk"}
            </h3>
            <p className="mb-4 max-w-md text-muted-foreground">
              {settings?.communitySlackCTADescription ||
                'Reach out to our team on WhatsApp for quick answers about programs, community events, or partnership opportunities.'}
            </p>
            <Button
              size="lg"
              variant="outline"
              asChild
              className="border-teal text-teal hover:bg-teal hover:text-white"
            >
              <a href="https://wa.me/your-number" target="_blank" rel="noopener noreferrer">
                <svg className="mr-2 h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                {settings?.communitySlackCTAButton || 'Chat on WhatsApp'}
              </a>
            </Button>
          </div>
        </section>
      </div>
    </>
  )
}

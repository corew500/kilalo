import type { Metadata } from 'next'
import { client } from '@/sanity/lib/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { TeamGrid } from '@/components/shared/TeamGrid'
import { getLocalizedField } from '@/lib/i18n-helpers'
import { siteConfig } from '@/lib/seo'
import { getSiteSettings } from '@/lib/sanity-helpers'
import {
  generateOrganizationSchema,
  generateBreadcrumbSchema,
  renderJsonLd,
} from '@/lib/structured-data'
import type { SanityTeamMember } from '@/types/sanity'

async function getTeamMembers() {
  const members = await client.fetch(`
    *[_type == "teamMember"] | order(order asc) {
      _id,
      name,
      roleEn,
      roleFr,
      bioEn,
      bioFr,
      photo,
      expertiseEn,
      expertiseFr,
      socialLinks
    }
  `)
  return members
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const settings = await getSiteSettings(locale)

  const title = settings?.aboutPageTitle || 'About Us'
  const description =
    settings?.aboutPageDescription ||
    'DRC-focused venture studio scaling for-profit solutions to poverty and hunger through our proven Vision & Structure methodology.'

  return {
    title,
    description,
    openGraph: {
      title: `${title} | ${siteConfig.name}`,
      description,
      url: `${siteConfig.url}/${locale}/about`,
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
      canonical: `${siteConfig.url}/${locale}/about`,
      languages: {
        en: `${siteConfig.url}/en/about`,
        fr: `${siteConfig.url}/fr/about`,
      },
    },
  }
}

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const teamMembers = await getTeamMembers()
  const settings = await getSiteSettings(locale)

  // Localize team members
  const localizedMembers = teamMembers.map((member: SanityTeamMember) => ({
    ...member,
    role: getLocalizedField(member, 'role', locale),
    bio: getLocalizedField(member, 'bio', locale),
    expertise: member[`expertise${locale.charAt(0).toUpperCase()}${locale.slice(1)}`] || [],
  }))

  const organizationSchema = generateOrganizationSchema(locale)
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: locale === 'en' ? 'Home' : 'Accueil', url: `${siteConfig.url}/${locale}` },
    { name: locale === 'en' ? 'About' : 'À propos' },
  ])

  return (
    <>
      {/* Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={renderJsonLd(organizationSchema)}
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={renderJsonLd(breadcrumbSchema)} />

      <div className="container py-16 md:py-24">
        {/* Hero Section */}
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <h1 className="mb-4 text-4xl font-bold tracking-tight sm:text-5xl">
            {settings?.aboutPageTitle || 'About Kilalo'}
          </h1>
          <p className="text-lg text-muted-foreground">
            {settings?.aboutPageDescription ||
              'A venture studio dedicated to scaling for-profit solutions that address poverty and hunger in the Democratic Republic of Congo.'}
          </p>
        </div>

        {/* Our Story Section */}
        <section className="mb-20">
          <div className="mx-auto max-w-4xl">
            <h2 className="mb-6 text-center text-3xl font-bold">
              {settings?.aboutOurStoryTitle || 'Our Story'}
            </h2>
            <div className="prose prose-lg mx-auto">
              <p className="mb-4 leading-relaxed text-muted-foreground">
                {settings?.aboutOurStoryParagraph1 ||
                  'Kilalo was born from a simple observation: the Democratic Republic of Congo is home to some of the most innovative and resilient entrepreneurs in Africa. Yet many of these businesses struggle not from lack of vision or market opportunity, but from the absence of structured systems and strategic clarity needed to scale sustainably.'}
              </p>
              <p className="mb-4 leading-relaxed text-muted-foreground">
                {settings?.aboutOurStoryParagraph2 ||
                  'We saw talented founders building solutions to real problems—hunger, poverty, lack of access to justice—but hitting walls when trying to grow beyond their initial success. They needed more than capital. They needed a structured approach to transform their promising ventures into scalable, sustainable businesses.'}
              </p>
              <p className="leading-relaxed text-muted-foreground">
                {settings?.aboutOurStoryParagraph3 ||
                  "That's why we created Kilalo: a venture studio focused exclusively on Congolese entrepreneurs who are building for-profit solutions to the DRC's most pressing challenges. We combine hands-on mentorship, structured programs, and strategic support to help these businesses achieve their full potential—and create lasting impact across the country."}
              </p>
            </div>
          </div>
        </section>

        {/* Our Approach: Vision & Structure */}
        <section className="-mx-4 mb-20 rounded-lg bg-gradient-to-br from-teal/5 to-orange/5 px-4 py-16 md:-mx-8 md:px-8">
          <div className="mx-auto max-w-4xl">
            <h2 className="mb-6 text-center text-3xl font-bold">
              {settings?.aboutV2SApproachTitle || 'Our Approach: Vision & Structure'}
            </h2>
            <p className="mx-auto mb-12 max-w-3xl text-center text-lg text-muted-foreground">
              {settings?.aboutV2SApproachDescription ||
                'The V2S (Vision & Structure) Program is our proven methodology for transforming promising Congolese businesses into scalable, sustainable enterprises.'}
            </p>

            <div className="mb-12 grid gap-8 md:grid-cols-2">
              <div className="rounded-lg border-2 border-teal/20 bg-background p-6">
                <h3 className="mb-4 text-xl font-semibold text-teal">
                  {settings?.aboutVisionTitle || "Vision: Know Where You're Going"}
                </h3>
                <p className="text-muted-foreground">
                  {settings?.aboutVisionDescription ||
                    'Many businesses fail not because they lack ambition, but because they lack clarity. We help entrepreneurs define a crystal-clear vision for their business—understanding their target market, value proposition, and long-term goals. Vision provides direction and motivation.'}
                </p>
              </div>

              <div className="rounded-lg border-2 border-orange/20 bg-background p-6">
                <h3 className="mb-4 text-xl font-semibold text-orange">
                  {settings?.aboutStructureTitle || 'Structure: Build Systems to Get There'}
                </h3>
                <p className="text-muted-foreground">
                  {settings?.aboutStructureDescription ||
                    'Vision without structure is just a dream. We provide entrepreneurs with 8 essential business tools—from financial modeling to sales strategy—that create the systems needed to execute on their vision consistently and scale sustainably.'}
                </p>
              </div>
            </div>

            <div className="rounded-lg border-2 border-forest/20 bg-background p-8">
              <h3 className="mb-4 text-center text-xl font-semibold text-forest">
                {settings?.aboutEightToolsTitle || 'The 8 Essential Tools'}
              </h3>
              <div className="grid gap-4 md:grid-cols-2">
                {[
                  settings?.aboutTool1 || 'Vision & Mission Clarity',
                  settings?.aboutTool2 || 'Customer Segmentation & Value Proposition',
                  settings?.aboutTool3 || 'Financial Modeling & Unit Economics',
                  settings?.aboutTool4 || 'Sales Process & Pipeline Management',
                  settings?.aboutTool5 || 'Team Structure & Accountability Systems',
                  settings?.aboutTool6 || 'Operational Workflows',
                  settings?.aboutTool7 || 'Market Access & Distribution Strategy',
                  settings?.aboutTool8 || 'Growth Metrics & KPI Tracking',
                ].map((tool, index) => (
                  <div key={index} className="flex items-start">
                    <svg
                      className="mr-2 mt-1 h-6 w-6 shrink-0 text-forest"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-sm font-medium">{tool}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Mission & Vision */}
        <div className="mb-20 grid gap-8 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl text-teal">
                {settings?.aboutMissionTitle || 'Our Mission'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                {settings?.aboutMissionDescription ||
                  'To scale for-profit solutions that address poverty and hunger in the DRC by helping Congolese entrepreneurs bring structure, clarity, and sustainable growth to their businesses.'}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-2xl text-orange">
                {settings?.aboutVisionTitle2 || 'Our Vision'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                {settings?.aboutVisionDescription2 ||
                  'A thriving ecosystem of Congolese-led businesses creating measurable social and economic impact across the DRC—with the systems, structure, and support needed to scale sustainably.'}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Team Section */}
        <div className="mb-20">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold">
              {settings?.aboutTeamTitle || 'Meet Our Team'}
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              {settings?.aboutTeamDescription ||
                'Our diverse team brings together decades of experience across strategy, marketing, leadership, and technology.'}
            </p>
          </div>

          {localizedMembers.length > 0 ? (
            <TeamGrid members={localizedMembers} />
          ) : (
            <div className="py-12 text-center">
              <p className="text-muted-foreground">
                {settings?.aboutTeamComingSoon || 'Team profiles coming soon!'}
              </p>
            </div>
          )}
        </div>

        {/* Partners & Advisors Section */}
        <section className="mb-20">
          <div className="mx-auto max-w-4xl">
            <div className="mb-12 text-center">
              <h2 className="mb-4 text-3xl font-bold">
                {settings?.aboutPartnersTitle || 'Partners & Advisors'}
              </h2>
              <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
                {settings?.aboutPartnersDescription ||
                  'We work with leading organizations and advisors who share our commitment to building sustainable businesses in the DRC.'}
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              <Card className="text-center">
                <CardContent className="pt-6">
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
                      <path d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 className="mb-2 font-semibold">
                    {settings?.aboutStrategicPartnersTitle || 'Strategic Partners'}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {settings?.aboutStrategicPartnersDescription ||
                      'Organizations supporting our mission through funding, expertise, and network access'}
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardContent className="pt-6">
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
                      <path d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </div>
                  <h3 className="mb-2 font-semibold">
                    {settings?.aboutExpertAdvisorsTitle || 'Expert Advisors'}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {settings?.aboutExpertAdvisorsDescription ||
                      'Seasoned entrepreneurs and business leaders guiding our program design and venture support'}
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardContent className="pt-6">
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
                      <path d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="mb-2 font-semibold">
                    {settings?.aboutEcosystemPartnersTitle || 'Ecosystem Partners'}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {settings?.aboutEcosystemPartnersDescription ||
                      'Local and international organizations connecting ventures to markets, resources, and opportunities'}
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="mt-8 text-center">
              <p className="mb-4 text-sm text-muted-foreground">
                {settings?.aboutPartnerCTA || 'Interested in partnering with Kilalo?'}
              </p>
              <a
                href="/work-with-us#partners"
                className="inline-flex items-center justify-center text-sm font-medium text-teal transition-colors hover:text-teal/80"
              >
                {settings?.aboutPartnerLink || 'Learn about partnership opportunities →'}
              </a>
            </div>
          </div>
        </section>

        {/* Values */}
        <div className="rounded-lg bg-gradient-to-r from-teal/10 to-orange/10 p-8 md:p-12">
          <h2 className="mb-8 text-center text-3xl font-bold">
            {settings?.aboutValuesTitle || 'Our Values'}
          </h2>
          <div className="grid gap-6 md:grid-cols-3">
            <div className="text-center">
              <h3 className="mb-2 text-xl font-semibold text-teal">
                {settings?.aboutValue1Title || 'Excellence'}
              </h3>
              <p className="text-sm text-muted-foreground">
                {settings?.aboutValue1Description ||
                  'We strive for excellence in everything we do, delivering exceptional results that exceed expectations.'}
              </p>
            </div>
            <div className="text-center">
              <h3 className="mb-2 text-xl font-semibold text-orange">
                {settings?.aboutValue2Title || 'Innovation'}
              </h3>
              <p className="text-sm text-muted-foreground">
                {settings?.aboutValue2Description ||
                  'We embrace innovation and stay ahead of industry trends to provide cutting-edge solutions.'}
              </p>
            </div>
            <div className="text-center">
              <h3 className="mb-2 text-xl font-semibold text-forest">
                {settings?.aboutValue3Title || 'Partnership'}
              </h3>
              <p className="text-sm text-muted-foreground">
                {settings?.aboutValue3Description ||
                  'We build lasting partnerships based on trust, transparency, and mutual success.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

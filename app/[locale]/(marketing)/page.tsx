import { client } from '@/sanity/lib/client'
import { ImpactMetrics } from '@/components/shared/ImpactMetrics'
import { BusinessAssessmentCTA } from '@/components/shared/BusinessAssessmentCTA'
import { VentureCard } from '@/components/shared/VentureCard'
import { EventCard } from '@/components/shared/EventCard'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

async function getFeaturedData() {
  const data = await client.fetch(`
    {
      "ventures": *[_type == "portfolioCompany" && featured == true] | order(order asc) [0...4] {
        _id,
        name,
        slug,
        description,
        industry,
        partnership,
        logo,
        featured
      },
      "nextEvent": *[_type == "event" && status == "upcoming" && featured == true] | order(eventDate asc) [0] {
        _id,
        title,
        description,
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

export default async function Home() {
  const { ventures, nextEvent } = await getFeaturedData()

  return (
    <>
      {/* Hero Section - DRC Focused */}
      <section className="relative overflow-hidden bg-gradient-to-b from-background via-teal/5 to-background py-20 md:py-32">
        <div className="container">
          <div className="mx-auto max-w-4xl text-center space-y-8">
            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
              Scaling for-profit solutions to address{' '}
              <span className="text-teal">poverty and hunger</span> in the DRC
            </h1>

            <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto">
              A venture studio helping Congolese entrepreneurs bring structure, clarity,
              and growth to their businesses through our proven Vision & Structure system.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
              <Button size="lg" asChild className="bg-orange hover:bg-orange/90 text-white">
                <Link href="/work-with-us">Start with Free Assessment</Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="border-teal text-teal hover:bg-teal hover:text-white">
                <Link href="/programs">Explore V2S Program</Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Background decoration */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute left-1/2 top-0 ml-[calc(50%-30rem)] aspect-[1155/678] w-[72.1875rem] -translate-x-1/2 bg-gradient-to-tr from-teal/20 to-orange/20 opacity-30 blur-3xl" />
        </div>
      </section>

      {/* Impact Metrics Dashboard */}
      <section className="py-16 bg-muted/30">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-3">Our Impact</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Real results from Congolese businesses we've helped scale
            </p>
          </div>
          <ImpactMetrics />
        </div>
      </section>

      {/* Vision & Structure Program Spotlight */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="grid gap-12 lg:grid-cols-2 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-4">
                The Vision & Structure Program
              </h2>
              <p className="text-lg text-muted-foreground mb-6">
                Our 16-week structured program transforms businesses through 8 essential tools.
                From vision clarity to financial modeling, we provide the framework Congolese
                entrepreneurs need to scale sustainably.
              </p>
              <div className="space-y-3 mb-6">
                {[
                  '16-week intensive program',
                  '8 proven business tools',
                  'Hands-on support from experts',
                  'Measurable outcomes and accountability',
                ].map((item, index) => (
                  <div key={index} className="flex items-start">
                    <svg
                      className="h-6 w-6 text-teal shrink-0 mr-2"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path d="M5 13l4 4L19 7" />
                    </svg>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
              <Button size="lg" asChild className="bg-teal hover:bg-teal/90">
                <Link href="/programs">Learn More About V2S</Link>
              </Button>
            </div>
            <div className="rounded-lg bg-gradient-to-br from-teal/10 to-orange/10 p-8 md:p-12">
              <blockquote className="space-y-4">
                <p className="text-lg italic">
                  "The Vision & Structure Program gave us the clarity we needed to
                  transform our operations. We've seen 150% revenue growth and created
                  25 new jobs in our community."
                </p>
                <footer className="text-sm font-medium">
                  — Portfolio Company Founder
                </footer>
              </blockquote>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Ventures */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-3">Success Stories</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Congolese businesses creating measurable social and economic impact
            </p>
          </div>

          {ventures && ventures.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
              {ventures.map((venture: any) => (
                <VentureCard
                  key={venture._id}
                  name={venture.name}
                  slug={venture.slug.current}
                  description={venture.description}
                  industry={venture.industry}
                  partnership={venture.partnership}
                  logo={venture.logo}
                  featured={venture.featured}
                  hasCaseStudy={true}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Featured ventures coming soon</p>
            </div>
          )}

          <div className="text-center">
            <Button variant="outline" size="lg" asChild>
              <Link href="/ventures">View All Ventures →</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Hekima Time Spotlight */}
      {nextEvent && (
        <section className="py-16 md:py-24">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-3">Hekima Time</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Free monthly webinars for Congolese entrepreneurs
              </p>
            </div>

            <div className="max-w-2xl mx-auto">
              <EventCard
                title={nextEvent.title}
                description={nextEvent.description}
                date={nextEvent.eventDate}
                format={nextEvent.format}
                registrationUrl={nextEvent.registrationUrl}
                status={nextEvent.status}
                speakers={nextEvent.speakers}
              />
            </div>

            <div className="text-center mt-8">
              <Button variant="outline" size="lg" asChild>
                <Link href="/community">View All Sessions →</Link>
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* Three-Audience CTA Section */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-3">How Can We Help?</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Whether you're an entrepreneur, investor, or expert — there's a place for you
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <div className="rounded-lg border-2 border-teal/20 bg-background p-8 text-center hover:border-teal/40 transition-colors">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-teal/10 mb-4">
                <svg className="h-6 w-6 text-teal" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                  <path d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">For Entrepreneurs</h3>
              <p className="text-sm text-muted-foreground mb-6">
                Ready to scale your business? Start with a free evaluation to see if V2S is right for you.
              </p>
              <Button asChild className="bg-teal hover:bg-teal/90 w-full">
                <Link href="/work-with-us#entrepreneurs">Get Free Assessment</Link>
              </Button>
            </div>

            <div className="rounded-lg border-2 border-orange/20 bg-background p-8 text-center hover:border-orange/40 transition-colors">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-orange/10 mb-4">
                <svg className="h-6 w-6 text-orange" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                  <path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">For Partners & Investors</h3>
              <p className="text-sm text-muted-foreground mb-6">
                Invest in impact. Explore partnership opportunities and co-investment models.
              </p>
              <Button variant="outline" asChild className="w-full border-orange text-orange hover:bg-orange hover:text-white">
                <Link href="/work-with-us#partners">Explore Partnerships</Link>
              </Button>
            </div>

            <div className="rounded-lg border-2 border-forest/20 bg-background p-8 text-center hover:border-forest/40 transition-colors">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-forest/10 mb-4">
                <svg className="h-6 w-6 text-forest" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                  <path d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">For Mentors & Experts</h3>
              <p className="text-sm text-muted-foreground mb-6">
                Share your expertise. Contribute to V2S program or speak at Hekima Time.
              </p>
              <Button variant="outline" asChild className="w-full border-forest text-forest hover:bg-forest hover:text-white">
                <Link href="/work-with-us#mentors">Join Our Network</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 md:py-24">
        <div className="container">
          <BusinessAssessmentCTA variant="card" />
        </div>
      </section>
    </>
  )
}

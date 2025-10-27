import { BusinessAssessmentCTA } from '@/components/shared/BusinessAssessmentCTA'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import Link from 'next/link'

export const metadata = {
  title: 'Work With Us | Kilalo',
  description: 'Partner with Kilalo. Whether you are an entrepreneur, investor, or mentor - discover how we can work together to build scalable businesses in the DRC.',
}

export default function WorkWithUsPage() {
  return (
    <div className="pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-background via-teal/5 to-background py-20 md:py-32">
        <div className="container">
          <div className="mx-auto max-w-3xl text-center space-y-6">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              Let's Build Together
            </h1>
            <p className="text-lg text-muted-foreground">
              Whether you're an entrepreneur ready to scale, an investor seeking impact,
              or a mentor wanting to contribute — there's a place for you at Kilalo.
            </p>
          </div>
        </div>
      </section>

      {/* Three Audience Paths */}
      <section id="paths" className="py-16 bg-muted/30">
        <div className="container">
          <div className="grid gap-8 md:grid-cols-3">
            {/* Entrepreneurs */}
            <Card className="border-2 border-teal/30 hover:border-teal transition-all hover:shadow-lg">
              <CardHeader className="text-center">
                <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-teal/10 mb-4 mx-auto">
                  <svg className="h-8 w-8 text-teal" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                    <path d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <CardTitle className="text-2xl">For Entrepreneurs</CardTitle>
                <CardDescription>Scale your business with structure and support</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Ready to bring clarity, structure, and growth to your business?
                  Start with a free evaluation to see if our V2S program is right for you.
                </p>
                <Button asChild className="bg-teal hover:bg-teal/90 w-full mb-3">
                  <a href="#entrepreneurs">Learn More</a>
                </Button>
              </CardContent>
            </Card>

            {/* Partners & Investors */}
            <Card className="border-2 border-orange/30 hover:border-orange transition-all hover:shadow-lg">
              <CardHeader className="text-center">
                <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-orange/10 mb-4 mx-auto">
                  <svg className="h-8 w-8 text-orange" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                    <path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <CardTitle className="text-2xl">For Partners & Investors</CardTitle>
                <CardDescription>Invest in impact-driven ventures</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Explore co-investment opportunities, corporate partnerships, and
                  strategic alliances to support Congolese entrepreneurship.
                </p>
                <Button asChild variant="outline" className="w-full mb-3 border-orange text-orange hover:bg-orange hover:text-white">
                  <a href="#partners">Learn More</a>
                </Button>
              </CardContent>
            </Card>

            {/* Mentors & Experts */}
            <Card className="border-2 border-forest/30 hover:border-forest transition-all hover:shadow-lg">
              <CardHeader className="text-center">
                <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-forest/10 mb-4 mx-auto">
                  <svg className="h-8 w-8 text-forest" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                    <path d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <CardTitle className="text-2xl">For Mentors & Experts</CardTitle>
                <CardDescription>Share your expertise with entrepreneurs</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Contribute to the V2S program, speak at Hekima Time, or provide
                  specialized advisory support to portfolio companies.
                </p>
                <Button asChild variant="outline" className="w-full mb-3 border-forest text-forest hover:bg-forest hover:text-white">
                  <a href="#mentors">Learn More</a>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Entrepreneurs Section */}
      <section id="entrepreneurs" className="py-16 md:py-24 scroll-mt-16">
        <div className="container">
          <div className="mx-auto max-w-4xl">
            <div className="text-center mb-12">
              <div className="inline-flex items-center justify-center rounded-full bg-teal/10 px-4 py-2 mb-4">
                <span className="text-sm font-semibold text-teal">For Entrepreneurs</span>
              </div>
              <h2 className="text-3xl font-bold mb-4">
                Ready to Scale Your Business?
              </h2>
              <p className="text-lg text-muted-foreground">
                Our Vision & Structure (V2S) program helps Congolese entrepreneurs bring
                clarity, structure, and sustainable growth to their businesses.
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 mb-12">
              <div>
                <h3 className="text-xl font-semibold mb-4">What You'll Get</h3>
                <div className="space-y-3">
                  {[
                    '16-week structured program',
                    '8 proven business tools',
                    'Hands-on mentorship from experts',
                    'Financial modeling support',
                    'Market access and sales strategy',
                    'Accountability and measurable outcomes',
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
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-4">Who Should Apply</h3>
                <div className="space-y-3 mb-6">
                  {[
                    'Congolese businesses generating revenue',
                    'Committed to addressing poverty/hunger',
                    'Open to learning and implementing structure',
                    'Ready to commit 16 weeks to the program',
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
                        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-sm">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <BusinessAssessmentCTA variant="card" />

            <div className="mt-8 text-center">
              <p className="text-sm text-muted-foreground mb-4">
                Not sure if you're ready for V2S? Join Hekima Time to learn more.
              </p>
              <Button variant="outline" asChild>
                <Link href="/community">Explore Hekima Time →</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Partners & Investors Section */}
      <section id="partners" className="py-16 md:py-24 bg-muted/30 scroll-mt-16">
        <div className="container">
          <div className="mx-auto max-w-4xl">
            <div className="text-center mb-12">
              <div className="inline-flex items-center justify-center rounded-full bg-orange/10 px-4 py-2 mb-4">
                <span className="text-sm font-semibold text-orange">For Partners & Investors</span>
              </div>
              <h2 className="text-3xl font-bold mb-4">
                Invest in Impact
              </h2>
              <p className="text-lg text-muted-foreground">
                Partner with Kilalo to support scalable, for-profit businesses addressing
                poverty and hunger in the DRC.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-3 mb-12">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Co-Investment</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Invest alongside Kilalo in vetted portfolio companies with proven
                    business models and measurable impact.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Corporate Partnerships</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Support the V2S program, sponsor Hekima Time, or provide in-kind
                    resources to our portfolio companies.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Strategic Alliances</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Collaborate on market access, distribution, or capacity building
                    initiatives for Congolese businesses.
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="rounded-lg bg-gradient-to-r from-orange/10 to-teal/10 p-8 text-center">
              <h3 className="text-2xl font-semibold mb-4">Let's Discuss Partnership Opportunities</h3>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                Schedule a call with our team to explore how we can work together to
                create sustainable impact in the DRC.
              </p>
              <Button size="lg" className="bg-orange hover:bg-orange/90">
                <a href="mailto:partnerships@kilalo.org">Contact Our Team</a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Mentors & Experts Section */}
      <section id="mentors" className="py-16 md:py-24 scroll-mt-16">
        <div className="container">
          <div className="mx-auto max-w-4xl">
            <div className="text-center mb-12">
              <div className="inline-flex items-center justify-center rounded-full bg-forest/10 px-4 py-2 mb-4">
                <span className="text-sm font-semibold text-forest">For Mentors & Experts</span>
              </div>
              <h2 className="text-3xl font-bold mb-4">
                Share Your Expertise
              </h2>
              <p className="text-lg text-muted-foreground">
                Join our network of mentors, advisors, and experts helping Congolese
                entrepreneurs build scalable businesses.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-3 mb-12">
              <Card className="border-2 border-forest/20">
                <CardHeader>
                  <CardTitle className="text-lg">V2S Program Mentorship</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Mentor entrepreneurs through the 16-week V2S program in areas like
                    financial modeling, sales, or operations.
                  </p>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    <li>• 4-8 hours per month</li>
                    <li>• Remote or in-person</li>
                    <li>• Cohort-based engagement</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-2 border-forest/20">
                <CardHeader>
                  <CardTitle className="text-lg">Hekima Time Speakers</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Present at our free monthly webinars on topics like leadership,
                    fundraising, or industry-specific challenges.
                  </p>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    <li>• 1-hour commitment</li>
                    <li>• Virtual presentation</li>
                    <li>• Recorded for future access</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-2 border-forest/20">
                <CardHeader>
                  <CardTitle className="text-lg">Advisory Support</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Provide specialized advisory to portfolio companies in areas like
                    legal, technology, supply chain, or HR.
                  </p>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    <li>• Project-based engagement</li>
                    <li>• Flexible time commitment</li>
                    <li>• Direct impact on ventures</li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            <div className="rounded-lg bg-gradient-to-r from-forest/10 to-teal/10 p-8">
              <h3 className="text-2xl font-semibold mb-6 text-center">Join Our Expert Network</h3>
              <form className="max-w-xl mx-auto space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" placeholder="Your name" />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="your@email.com" />
                  </div>
                </div>
                <div>
                  <Label htmlFor="expertise">Area of Expertise</Label>
                  <Input id="expertise" placeholder="e.g., Financial Modeling, Supply Chain, Marketing" />
                </div>
                <div>
                  <Label htmlFor="interest">How would you like to contribute?</Label>
                  <Textarea
                    id="interest"
                    placeholder="Tell us about your interest in mentoring, speaking, or providing advisory support..."
                    rows={4}
                  />
                </div>
                <Button type="submit" className="w-full bg-forest hover:bg-forest/90">
                  Submit Application
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 bg-muted/30">
        <div className="container">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-2xl font-bold mb-4">Still Have Questions?</h2>
            <p className="text-muted-foreground mb-6">
              Our team is here to help. Reach out via email or WhatsApp to learn more
              about working with Kilalo.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="outline" asChild>
                <a href="mailto:hello@kilalo.org">
                  Email Us
                </a>
              </Button>
              <Button size="lg" className="bg-teal hover:bg-teal/90" asChild>
                <a href="https://wa.me/your-number" target="_blank" rel="noopener noreferrer">
                  <svg className="mr-2 h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  WhatsApp
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

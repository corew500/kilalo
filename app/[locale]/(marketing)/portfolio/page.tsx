import { client } from '@/sanity/lib/client'
import imageUrlBuilder from '@sanity/image-url'
import Image from 'next/image'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

const builder = imageUrlBuilder(client)

function urlFor(source: any) {
  return builder.image(source)
}

async function getPortfolioCompanies() {
  const companies = await client.fetch(`
    *[_type == "portfolioCompany"] | order(order asc) {
      _id,
      name,
      slug,
      description,
      industry,
      partnership,
      logo,
      websiteUrl,
      featured,
      testimonial
    }
  `)
  return companies
}

export const metadata = {
  title: 'Portfolio | Kilalo',
  description: 'Discover the companies we partner with to drive business success.',
}

export default async function PortfolioPage() {
  const companies = await getPortfolioCompanies()

  return (
    <div className="container py-16 md:py-24">
      {/* Header */}
      <div className="mx-auto max-w-3xl text-center mb-16">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-4">
          Our Portfolio
        </h1>
        <p className="text-lg text-muted-foreground">
          We're proud to partner with innovative companies across industries.
          Here are some of the businesses we've helped grow and succeed.
        </p>
      </div>

      {/* Portfolio Grid */}
      {companies.length > 0 ? (
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {companies.map((company: any) => (
            <Card key={company._id} className="overflow-hidden transition-all hover:shadow-lg">
              <CardHeader className="pb-4">
                {company.logo && (
                  <div className="mb-4 flex h-24 items-center justify-center bg-muted rounded-lg p-4">
                    <Image
                      src={urlFor(company.logo).width(200).height(100).fit('max').url()}
                      alt={company.logo.alt || company.name}
                      width={200}
                      height={100}
                      className="object-contain"
                    />
                  </div>
                )}
                <CardTitle className="text-xl">{company.name}</CardTitle>
                <CardDescription className="capitalize">
                  {company.industry.replace('-', ' ')}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  {company.description}
                </p>

                {company.partnership && (
                  <div className="inline-flex items-center rounded-full bg-teal/10 px-3 py-1 text-xs font-medium text-teal">
                    {company.partnership.replace('-', ' ')}
                  </div>
                )}

                {company.testimonial?.quote && (
                  <blockquote className="border-l-2 border-teal pl-4 italic text-sm text-muted-foreground">
                    "{company.testimonial.quote}"
                    {company.testimonial.author && (
                      <footer className="mt-2 text-xs not-italic font-medium">
                        — {company.testimonial.author}
                        {company.testimonial.position && `, ${company.testimonial.position}`}
                      </footer>
                    )}
                  </blockquote>
                )}

                {company.websiteUrl && (
                  <Button variant="outline" size="sm" asChild className="w-full">
                    <a href={company.websiteUrl} target="_blank" rel="noopener noreferrer">
                      Visit Website →
                    </a>
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <p className="text-lg text-muted-foreground">
            No portfolio companies to display yet. Check back soon!
          </p>
        </div>
      )}

      {/* CTA Section */}
      <div className="mt-20 rounded-lg bg-gradient-to-r from-teal/10 to-orange/10 p-8 text-center md:p-12">
        <h2 className="text-3xl font-bold mb-4">
          Ready to Join Our Portfolio?
        </h2>
        <p className="text-lg text-muted-foreground mb-6 max-w-2xl mx-auto">
          We're always looking for innovative companies to partner with.
          Let's discuss how we can help your business thrive.
        </p>
        <Button size="lg" asChild className="bg-teal hover:bg-teal/90">
          <Link href="/contact">Get in Touch</Link>
        </Button>
      </div>
    </div>
  )
}

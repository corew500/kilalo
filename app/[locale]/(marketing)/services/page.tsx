import { client } from '@/sanity/lib/client'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

async function getServices() {
  const services = await client.fetch(`
    *[_type == "service"] | order(order asc) {
      _id,
      title,
      slug,
      category,
      description,
      features
    }
  `)
  return services
}

export const metadata = {
  title: 'Services | Kilalo',
  description: 'Explore our comprehensive suite of business solutions.',
}

export default async function ServicesPage() {
  const services = await getServices()

  return (
    <div className="container py-16 md:py-24">
      {/* Header */}
      <div className="mx-auto max-w-3xl text-center mb-16">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-4">
          Our Services
        </h1>
        <p className="text-lg text-muted-foreground">
          Comprehensive solutions tailored to your business needs.
          From strategic planning to execution, we're with you every step of the way.
        </p>
      </div>

      {/* Services Grid */}
      {services.length > 0 ? (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-2 max-w-5xl mx-auto">
          {services.map((service: any) => (
            <Card key={service._id} className="transition-all hover:shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl text-teal">{service.title}</CardTitle>
                <CardDescription className="text-base">{service.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {service.features && service.features.length > 0 && (
                  <ul className="space-y-2">
                    {service.features.map((feature: string, index: number) => (
                      <li key={index} className="flex items-start">
                        <svg
                          className="h-5 w-5 text-teal shrink-0 mt-0.5 mr-2"
                          fill="none"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-sm text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                )}
                <Button variant="outline" asChild className="w-full mt-4">
                  <Link href={`/services/${service.slug.current}`}>
                    Learn More →
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <p className="text-lg text-muted-foreground">
            Services information coming soon!
          </p>
        </div>
      )}

      {/* CTA Section */}
      <div className="mt-20 rounded-lg bg-gradient-to-r from-teal/10 to-orange/10 p-8 text-center md:p-12">
        <h2 className="text-3xl font-bold mb-4">
          Ready to Get Started?
        </h2>
        <p className="text-lg text-muted-foreground mb-6 max-w-2xl mx-auto">
          Let's discuss how our services can help your business achieve its goals.
        </p>
        <Button size="lg" asChild className="bg-teal hover:bg-teal/90">
          <Link href="/contact">Contact Us</Link>
        </Button>
      </div>
    </div>
  )
}

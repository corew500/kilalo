import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import Image from 'next/image'
import imageUrlBuilder from '@sanity/image-url'
import type { SanityImageSource } from '@sanity/image-url/lib/types/types'
import { client } from '@/sanity/lib/client'

const builder = imageUrlBuilder(client)

function urlFor(source: SanityImageSource) {
  return builder.image(source)
}

type SanityImageWithAlt = SanityImageSource & { alt?: string }

interface VentureCardProps {
  name: string
  slug: string
  description: string
  sector?: string
  location?: string
  tagline: string
  metricsHighlight?: string
  logo?: SanityImageWithAlt
  featured?: boolean
  caseStudy?: {
    _id: string
    title: string
    slug: { current: string }
  }
  locale: string
}

export function VentureCard({
  name,
  slug,
  description,
  sector,
  location,
  tagline,
  metricsHighlight,
  logo,
  featured,
  caseStudy,
  locale,
}: VentureCardProps) {
  return (
    <Card className="group flex h-full flex-col overflow-hidden transition-all hover:shadow-lg">
      <CardHeader className="pb-4">
        {featured && (
          <div className="mb-2">
            <span className="inline-flex items-center rounded-full bg-orange/10 px-2 py-1 text-xs font-medium text-orange">
              Featured
            </span>
          </div>
        )}
        {logo && (
          <div className="mb-4 flex h-24 items-center justify-center rounded-lg bg-muted p-4">
            <Image
              src={urlFor(logo).width(200).height(100).fit('max').url()}
              alt={logo.alt || `${name} company logo`}
              width={200}
              height={100}
              className="object-contain transition-transform group-hover:scale-105"
            />
          </div>
        )}
        <CardTitle className="text-xl">{name}</CardTitle>
        <CardDescription className="text-sm">{tagline}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col space-y-4">
        {(sector || location) && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              {sector && <span className="capitalize">{sector.replace('-', ' ')}</span>}
              {sector && location && <span>•</span>}
              {location && <span>{location}</span>}
            </div>
          </div>
        )}

        <p className="flex-1 text-sm text-muted-foreground">{description}</p>

        {metricsHighlight && (
          <div className="inline-flex items-center self-start rounded-full bg-teal/10 px-3 py-1 text-xs font-medium text-teal">
            {metricsHighlight}
          </div>
        )}

        <div className="mt-auto">
          {caseStudy ? (
            <Button variant="outline" asChild className="w-full">
              <Link href={`/${locale}/case-studies/${caseStudy.slug.current}`}>
                Read Case Study →
              </Link>
            </Button>
          ) : (
            <Button variant="ghost" asChild className="w-full">
              <Link href={`/${locale}/ventures/${slug}`}>Learn More →</Link>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import Image from 'next/image'
import imageUrlBuilder from '@sanity/image-url'
import { client } from '@/sanity/lib/client'

const builder = imageUrlBuilder(client)

function urlFor(source: any) {
  return builder.image(source)
}

interface VentureCardProps {
  name: string
  slug: string
  description: string
  industry: string
  partnership: string
  logo?: any
  featured?: boolean
  hasCaseStudy?: boolean
}

export function VentureCard({
  name,
  slug,
  description,
  industry,
  partnership,
  logo,
  featured,
  hasCaseStudy,
}: VentureCardProps) {
  return (
    <Card className="h-full flex flex-col overflow-hidden transition-all hover:shadow-lg group">
      <CardHeader className="pb-4">
        {featured && (
          <div className="mb-2">
            <span className="inline-flex items-center rounded-full bg-orange/10 px-2 py-1 text-xs font-medium text-orange">
              Featured Impact
            </span>
          </div>
        )}
        {logo && (
          <div className="mb-4 flex h-24 items-center justify-center bg-muted rounded-lg p-4">
            <Image
              src={urlFor(logo).width(200).height(100).fit('max').url()}
              alt={logo.alt || name}
              width={200}
              height={100}
              className="object-contain transition-transform group-hover:scale-105"
            />
          </div>
        )}
        <CardTitle className="text-xl">{name}</CardTitle>
        <CardDescription className="capitalize">
          {industry.replace('-', ' ')}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col space-y-4">
        <p className="text-sm text-muted-foreground flex-1">
          {description}
        </p>

        {partnership && (
          <div className="inline-flex items-center rounded-full bg-teal/10 px-3 py-1 text-xs font-medium text-teal self-start">
            {partnership.replace('-', ' ')}
          </div>
        )}

        {hasCaseStudy && (
          <Button variant="outline" asChild className="w-full mt-auto">
            <Link href={`/ventures/${slug}`}>
              Read Case Study →
            </Link>
          </Button>
        )}
      </CardContent>
    </Card>
  )
}

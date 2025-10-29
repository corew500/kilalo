import { client } from '@/sanity/lib/client'
import imageUrlBuilder from '@sanity/image-url'
import type { SanityImageSource } from '@sanity/image-url/lib/types/types'
import Image from 'next/image'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import type { SanityPost } from '@/types/sanity'

const builder = imageUrlBuilder(client)

function urlFor(source: SanityImageSource) {
  return builder.image(source)
}

async function getPosts() {
  const posts = await client.fetch(`
    *[_type == "post"] | order(publishedAt desc) {
      _id,
      title,
      slug,
      excerpt,
      publishedAt,
      coverImage,
      author->{name},
      categories
    }
  `)
  return posts
}

export const metadata = {
  title: 'Blog | Kilalo',
  description: 'Insights, ideas, and stories from the Kilalo team.',
}

export default async function BlogPage() {
  const posts = await getPosts()

  return (
    <div className="container py-16 md:py-24">
      {/* Header */}
      <div className="mx-auto mb-16 max-w-3xl text-center">
        <h1 className="mb-4 text-4xl font-bold tracking-tight sm:text-5xl">Blog & Insights</h1>
        <p className="text-lg text-muted-foreground">
          Expert insights, industry trends, and success stories to help your business thrive.
        </p>
      </div>

      {/* Blog Posts Grid */}
      {posts.length > 0 ? (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post: SanityPost) => (
            <Link key={post._id} href={`/blog/${post.slug.current}`}>
              <Card className="h-full overflow-hidden transition-all hover:shadow-lg">
                {post.coverImage && (
                  <div className="aspect-[16/9] overflow-hidden">
                    <Image
                      src={urlFor(post.coverImage).width(600).height(400).url()}
                      alt={post.coverImage.alt || post.title}
                      width={600}
                      height={400}
                      className="h-full w-full object-cover transition-transform hover:scale-105"
                    />
                  </div>
                )}
                <CardHeader>
                  {post.categories && post.categories.length > 0 && (
                    <div className="mb-2 flex flex-wrap gap-2">
                      {post.categories.slice(0, 2).map((category: string, index: number) => (
                        <span
                          key={index}
                          className="inline-flex items-center rounded-full bg-teal/10 px-2 py-1 text-xs font-medium capitalize text-teal"
                        >
                          {category}
                        </span>
                      ))}
                    </div>
                  )}
                  <CardTitle className="line-clamp-2">{post.title}</CardTitle>
                  <CardDescription>
                    {new Date(post.publishedAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                    {post.author && ` • ${post.author.name}`}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="line-clamp-3 text-sm text-muted-foreground">{post.excerpt}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <div className="py-16 text-center">
          <p className="text-lg text-muted-foreground">
            No blog posts published yet. Check back soon for insights and updates!
          </p>
        </div>
      )}
    </div>
  )
}

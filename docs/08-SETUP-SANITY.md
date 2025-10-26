# Sanity.io CMS Setup Guide

This guide covers setting up Sanity.io as the headless CMS for the Kilalo marketing website with full Next.js 15 App Router integration.

## Table of Contents

1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [Installation](#installation)
4. [Sanity Project Setup](#sanity-project-setup)
5. [Embedding Sanity Studio](#embedding-sanity-studio)
6. [Schema Creation](#schema-creation)
7. [Localized Content](#localized-content)
8. [GROQ Queries](#groq-queries)
9. [TypeScript Integration](#typescript-integration)
10. [Image Optimization](#image-optimization)
11. [Webhooks for ISR](#webhooks-for-isr)
12. [Best Practices](#best-practices)
13. [Troubleshooting](#troubleshooting)
14. [Next Steps](#next-steps)

## Overview

**Sanity.io** is a headless CMS with a powerful structured content platform and a real-time editing environment.

### Why Sanity for Kilalo?

- **Structured Content**: Content as data with customizable schemas
- **Real-time Collaboration**: Multiple editors can work simultaneously
- **Portable Text**: Rich text that's query-able and renderable anywhere
- **GROQ**: Powerful query language for fetching exactly what you need
- **Image Pipeline**: Built-in image optimization and transformations
- **Localization**: First-class support for multilingual content (French/English)
- **Embedded Studio**: Studio runs directly in your Next.js app
- **Type Safety**: Generate TypeScript types from your schema

## Prerequisites

- Next.js 15 project initialized (see [03-SETUP-NEXTJS.md](./03-SETUP-NEXTJS.md))
- Node.js 18+ installed
- Sanity account (free tier available at [sanity.io](https://www.sanity.io))

## Installation

### Step 1: Install Sanity Dependencies

```bash
npm install next-sanity sanity @sanity/vision @sanity/image-url
npm install -D @sanity/types
```

- **next-sanity**: Sanity toolkit for Next.js
- **sanity**: Sanity Studio and core libraries
- **@sanity/vision**: In-studio GROQ query testing tool
- **@sanity/image-url**: Image URL builder for optimized images
- **@sanity/types**: TypeScript types

### Step 2: Initialize Sanity Project

```bash
npx sanity@latest init
```

You'll be prompted:

```
? Select project to use: Create new project
? Your project name: Kilalo
? Use the default dataset configuration? Yes
? Project output path: ./
? Select project template: Clean project with no predefined schema types
? Package manager to use for installing dependencies: npm
```

This creates:
- `sanity.cli.ts` - Sanity CLI configuration
- `sanity.config.ts` - Studio configuration
- Environment variables in `.env.local`

### Step 3: Configure Environment Variables

Add to `.env.local`:

```bash
# Sanity
NEXT_PUBLIC_SANITY_PROJECT_ID="your-project-id"
NEXT_PUBLIC_SANITY_DATASET="production"
SANITY_API_TOKEN="your-api-token"
```

Get your API token from [sanity.io/manage](https://sanity.io/manage) → API → Tokens → Add API Token (Editor permissions).

## Sanity Project Setup

### Step 1: Configure Sanity Studio

Edit `sanity.config.ts`:

```typescript
'use client'

import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { documentInternationalization } from '@sanity/document-internationalization'

// Import schemas
import { post } from './src/sanity/schemas/post'
import { page } from './src/sanity/schemas/page'
import { author } from './src/sanity/schemas/author'
import { category } from './src/sanity/schemas/category'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET!

export default defineConfig({
  name: 'kilalo',
  title: 'Kilalo Content Studio',
  projectId,
  dataset,
  basePath: '/studio',
  plugins: [
    structureTool(),
    visionTool(),
    documentInternationalization({
      supportedLanguages: [
        { id: 'en', title: 'English' },
        { id: 'fr', title: 'French' },
      ],
      schemaTypes: ['post', 'page'],
    }),
  ],
  schema: {
    types: [post, page, author, category],
  },
})
```

### Step 2: Create Sanity Client

Create `src/sanity/lib/client.ts`:

```typescript
import { createClient } from 'next-sanity'

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: '2024-01-01', // Use current date
  useCdn: false, // Set to false for ISR/SSG or tag-based revalidation
  perspective: 'published', // Only fetch published documents
  stega: {
    enabled: false,
    studioUrl: '/studio',
  },
})
```

**Important**: Set `useCdn: false` to ensure fresh data with Next.js caching.

### Step 3: Create Image URL Builder

Create `src/sanity/lib/image.ts`:

```typescript
import imageUrlBuilder from '@sanity/image-url'
import type { Image } from 'sanity'

import { client } from './client'

const builder = imageUrlBuilder(client)

export function urlFor(source: Image) {
  return builder.image(source)
}

// Usage:
// urlFor(post.mainImage).width(800).height(600).url()
```

## Embedding Sanity Studio

### Step 1: Create Studio Route

Create `src/app/studio/[[...tool]]/page.tsx`:

```typescript
import { NextStudio } from 'next-sanity/studio'

import config from '../../../../sanity.config'

export const dynamic = 'force-static'

export { metadata, viewport } from 'next-sanity/studio'

export default function StudioPage() {
  return <NextStudio config={config} />
}
```

### Step 2: Customize Studio Metadata (Optional)

```typescript
import type { Metadata, Viewport } from 'next'
import {
  metadata as studioMetadata,
  viewport as studioViewport,
} from 'next-sanity/studio'
import { NextStudio } from 'next-sanity/studio'

import config from '../../../../sanity.config'

export const dynamic = 'force-static'

export const metadata: Metadata = {
  ...studioMetadata,
  title: 'Kilalo Content Studio',
}

export const viewport: Viewport = {
  ...studioViewport,
  interactiveWidget: 'resizes-content',
}

export default function StudioPage() {
  return <NextStudio config={config} />
}
```

### Step 3: Access Studio

Run `npm run dev` and navigate to `http://localhost:3000/studio`

You should see the Sanity Studio embedded in your Next.js app!

## Schema Creation

### Post Schema

Create `src/sanity/schemas/post.ts`:

```typescript
import { defineField, defineType } from 'sanity'

export const post = defineType({
  name: 'post',
  title: 'Post',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'author',
      title: 'Author',
      type: 'reference',
      to: { type: 'author' },
    }),
    defineField({
      name: 'mainImage',
      title: 'Main Image',
      type: 'image',
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Alternative Text',
          validation: (Rule) => Rule.required(),
        },
      ],
    }),
    defineField({
      name: 'categories',
      title: 'Categories',
      type: 'array',
      of: [{ type: 'reference', to: { type: 'category' } }],
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published At',
      type: 'datetime',
    }),
    defineField({
      name: 'excerpt',
      title: 'Excerpt',
      type: 'text',
      rows: 4,
    }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'blockContent',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      author: 'author.name',
      media: 'mainImage',
    },
    prepare(selection) {
      const { author } = selection
      return { ...selection, subtitle: author && `by ${author}` }
    },
  },
})
```

### Block Content Schema

Create `src/sanity/schemas/blockContent.ts`:

```typescript
import { defineType, defineArrayMember } from 'sanity'

export const blockContent = defineType({
  name: 'blockContent',
  title: 'Block Content',
  type: 'array',
  of: [
    defineArrayMember({
      type: 'block',
      styles: [
        { title: 'Normal', value: 'normal' },
        { title: 'H1', value: 'h1' },
        { title: 'H2', value: 'h2' },
        { title: 'H3', value: 'h3' },
        { title: 'H4', value: 'h4' },
        { title: 'Quote', value: 'blockquote' },
      ],
      lists: [
        { title: 'Bullet', value: 'bullet' },
        { title: 'Numbered', value: 'number' },
      ],
      marks: {
        decorators: [
          { title: 'Strong', value: 'strong' },
          { title: 'Emphasis', value: 'em' },
          { title: 'Code', value: 'code' },
        ],
        annotations: [
          {
            name: 'link',
            type: 'object',
            title: 'Link',
            fields: [
              {
                name: 'href',
                type: 'url',
                validation: (Rule) =>
                  Rule.uri({
                    scheme: ['http', 'https', 'mailto', 'tel'],
                  }),
              },
            ],
          },
        ],
      },
    }),
    defineArrayMember({
      type: 'image',
      options: { hotspot: true },
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Alternative Text',
          validation: (Rule) => Rule.required(),
        },
      ],
    }),
  ],
})
```

### Author Schema

Create `src/sanity/schemas/author.ts`:

```typescript
import { defineField, defineType } from 'sanity'

export const author = defineType({
  name: 'author',
  title: 'Author',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'name',
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'bio',
      title: 'Bio',
      type: 'text',
      rows: 4,
    }),
  ],
})
```

## Localized Content

### Step 1: Install i18n Plugin

```bash
npm install @sanity/document-internationalization
```

### Step 2: Configure in sanity.config.ts

Already added in earlier configuration:

```typescript
import { documentInternationalization } from '@sanity/document-internationalization'

export default defineConfig({
  plugins: [
    documentInternationalization({
      supportedLanguages: [
        { id: 'en', title: 'English' },
        { id: 'fr', title: 'French' },
      ],
      schemaTypes: ['post', 'page'],
    }),
  ],
})
```

### Step 3: Localized Fields Pattern

For field-level localization:

```typescript
defineField({
  name: 'title',
  title: 'Title',
  type: 'object',
  fields: [
    { name: 'en', type: 'string', title: 'English' },
    { name: 'fr', type: 'string', title: 'French' },
  ],
})
```

Or use document-level localization (creates separate documents per language).

## GROQ Queries

### Step 1: Define Queries

Create `src/sanity/lib/queries.ts`:

```typescript
import { defineQuery } from 'next-sanity'

// Get all published posts
export const POSTS_QUERY = defineQuery(`
  *[_type == "post" && defined(slug.current)] | order(publishedAt desc) [0...12] {
    _id,
    title,
    slug,
    publishedAt,
    excerpt,
    mainImage,
    "author": author->name,
    "categories": categories[]->title
  }
`)

// Get single post by slug
export const POST_QUERY = defineQuery(`
  *[_type == "post" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    publishedAt,
    excerpt,
    mainImage,
    body,
    "author": author->{name, image, bio},
    "categories": categories[]->{title, slug}
  }
`)

// Get all post slugs (for generateStaticParams)
export const POST_SLUGS_QUERY = defineQuery(`
  *[_type == "post" && defined(slug.current)]{
    "slug": slug.current
  }
`)

// Get page by slug
export const PAGE_QUERY = defineQuery(`
  *[_type == "page" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    body,
    seo
  }
`)
```

### Step 2: Fetch Data in Server Components

```typescript
// app/blog/page.tsx
import { client } from '@/sanity/lib/client'
import { POSTS_QUERY } from '@/sanity/lib/queries'

export default async function BlogPage() {
  const posts = await client.fetch(
    POSTS_QUERY,
    {},
    {
      next: {
        revalidate: 3600, // Revalidate every hour
        tags: ['post'], // Tag for on-demand revalidation
      },
    }
  )

  return (
    <div>
      <h1>Blog Posts</h1>
      <ul>
        {posts.map((post) => (
          <li key={post._id}>
            <a href={`/blog/${post.slug.current}`}>{post.title}</a>
          </li>
        ))}
      </ul>
    </div>
  )
}
```

### Step 3: Dynamic Routes with Params

```typescript
// app/blog/[slug]/page.tsx
import { notFound } from 'next/navigation'

import { client } from '@/sanity/lib/client'
import { POST_QUERY, POST_SLUGS_QUERY } from '@/sanity/lib/queries'

export async function generateStaticParams() {
  const posts = await client.fetch(POST_SLUGS_QUERY)
  return posts.map((post) => ({
    slug: post.slug,
  }))
}

export default async function PostPage({
  params,
}: {
  params: { slug: string }
}) {
  const post = await client.fetch(
    POST_QUERY,
    { slug: params.slug },
    {
      next: {
        tags: [`post:${params.slug}`],
      },
    }
  )

  if (!post) {
    notFound()
  }

  return (
    <article>
      <h1>{post.title}</h1>
      {/* Render post content */}
    </article>
  )
}
```

## TypeScript Integration

### Step 1: Configure Type Generation

Create `sanity-typegen.json`:

```json
{
  "path": "./src/**/*.{ts,tsx,js,jsx}",
  "schema": "./src/sanity/extract.json",
  "generates": "./src/sanity/types.ts"
}
```

### Step 2: Update package.json Scripts

```json
{
  "scripts": {
    "predev": "npm run typegen",
    "dev": "next dev",
    "prebuild": "npm run typegen",
    "build": "next build",
    "typegen": "sanity schema extract --path=src/sanity/extract.json && sanity typegen generate"
  }
}
```

### Step 3: Generate Types

```bash
npm run typegen
```

This generates `src/sanity/types.ts` with TypeScript types for:
- All schema types
- GROQ query results

### Step 4: Use Generated Types

```typescript
import { client } from '@/sanity/lib/client'
import { POSTS_QUERY } from '@/sanity/lib/queries'
import type { POSTS_QUERYResult } from '@/sanity/types'

const posts = await client.fetch(POSTS_QUERY)
// posts is automatically typed as POSTS_QUERYResult[]
```

## Image Optimization

### Using Sanity Image URLs

```typescript
import { urlFor } from '@/sanity/lib/image'
import type { Image } from 'sanity'

interface PostImageProps {
  image: Image
  alt: string
}

export function PostImage({ image, alt }: PostImageProps) {
  return (
    <img
      src={urlFor(image).width(800).height(600).url()}
      alt={alt}
      loading="lazy"
    />
  )
}
```

### With Next.js Image Component

```typescript
import Image from 'next/image'
import { urlFor } from '@/sanity/lib/image'
import type { Image as SanityImage } from 'sanity'

interface OptimizedImageProps {
  image: SanityImage
  alt: string
}

export function OptimizedImage({ image, alt }: OptimizedImageProps) {
  return (
    <Image
      src={urlFor(image).width(1200).height(630).url()}
      alt={alt}
      width={1200}
      height={630}
      className="rounded-lg"
    />
  )
}
```

### Image Transformations

```typescript
// Crop to aspect ratio
urlFor(image).width(800).height(600).fit('crop').url()

// Auto format (WebP, AVIF)
urlFor(image).auto('format').url()

// Quality
urlFor(image).quality(80).url()

// Multiple transformations
urlFor(image)
  .width(1200)
  .height(630)
  .fit('crop')
  .auto('format')
  .quality(85)
  .url()
```

## Webhooks for ISR

### Step 1: Create Revalidation API Route

Create `src/app/api/revalidate/route.ts`:

```typescript
import { revalidateTag } from 'next/cache'
import { type NextRequest, NextResponse } from 'next/server'
import { parseBody } from 'next-sanity/webhook'

export async function POST(req: NextRequest) {
  try {
    const { body, isValidSignature } = await parseBody<{
      _type: string
      slug?: { current?: string }
    }>(req, process.env.SANITY_WEBHOOK_SECRET)

    if (!isValidSignature) {
      return new Response('Invalid signature', { status: 401 })
    }

    if (!body?._type) {
      return new Response('Bad Request', { status: 400 })
    }

    // Revalidate by type
    revalidateTag(body._type)

    // Revalidate specific document
    if (body.slug?.current) {
      revalidateTag(`${body._type}:${body.slug.current}`)
    }

    return NextResponse.json({
      status: 200,
      revalidated: true,
      now: Date.now(),
      body,
    })
  } catch (err: unknown) {
    console.error(err)
    return new Response(
      err instanceof Error ? err.message : 'Internal Server Error',
      { status: 500 }
    )
  }
}
```

### Step 2: Configure Webhook in Sanity

1. Go to [sanity.io/manage](https://sanity.io/manage)
2. Select your project
3. Go to **API** → **Webhooks**
4. Click **Create webhook**
5. Configure:
   - **Name**: Next.js Revalidation
   - **URL**: `https://your-domain.com/api/revalidate`
   - **Dataset**: production
   - **Trigger on**: Create, Update, Delete
   - **Filter**: `_type == "post" || _type == "page"`
   - **Secret**: Generate and save to `.env.local` as `SANITY_WEBHOOK_SECRET`

### Step 3: Add Environment Variable

```bash
SANITY_WEBHOOK_SECRET="your-webhook-secret"
```

## Best Practices

### 1. Use References for Relationships

```typescript
defineField({
  name: 'author',
  type: 'reference',
  to: [{ type: 'author' }],
})
```

### 2. Add Validation Rules

```typescript
validation: (Rule) => Rule.required().min(10).max(200)
```

### 3. Use Hotspot for Images

```typescript
type: 'image',
options: {
  hotspot: true, // Enables focal point selection
}
```

### 4. Create Reusable Field Groups

```typescript
const seoFields = [
  defineField({
    name: 'metaTitle',
    type: 'string',
    validation: (Rule) => Rule.max(60),
  }),
  defineField({
    name: 'metaDescription',
    type: 'text',
    validation: (Rule) => Rule.max(160),
  }),
]
```

### 5. Use Portable Text for Rich Content

Never use plain `text` for rich content - always use `blockContent`.

### 6. Tag Queries for Granular Revalidation

```typescript
client.fetch(QUERY, params, {
  next: {
    tags: ['post', `post:${slug}`],
  },
})
```

## Troubleshooting

### Issue: Studio Not Loading

**Problem**: `/studio` route shows blank page.

**Solution**:
1. Ensure `dynamic = 'force-static'` is set
2. Check `basePath` in `sanity.config.ts` matches route
3. Clear `.next` cache: `rm -rf .next`

### Issue: Environment Variables Not Found

**Problem**: `projectId` or `dataset` is undefined.

**Solution**:
1. Ensure variables are prefixed with `NEXT_PUBLIC_`
2. Restart dev server after adding variables
3. Check `.env.local` exists and has correct values

### Issue: Type Generation Failing

**Problem**: `npm run typegen` errors.

**Solution**:
1. Ensure `sanity-typegen.json` exists
2. Check schema files have no syntax errors
3. Run `npx sanity schema extract` separately to debug

### Issue: Images Not Displaying

**Problem**: Image URLs return 404.

**Solution**:
1. Verify `projectId` and `dataset` are correct
2. Check image has been uploaded in Studio
3. Ensure image field has `hotspot: true` option

### Issue: GROQ Query Returns Empty

**Problem**: Query returns `[]` or `null`.

**Solution**:
1. Test query in Vision tool (`/studio/vision`)
2. Check document `_type` matches query
3. Ensure documents are published (not drafts)

## Next Steps

After setting up Sanity:

1. **Create content schemas** for all content types
2. **Set up i18n integration**: See [09-SETUP-I18N.md](./09-SETUP-I18N.md)
3. **Configure webhooks** for production deployment
4. **Add content** in Studio
5. **Build blog/pages** using GROQ queries
6. **Deploy to Vercel**: See [11-SETUP-DEPLOYMENT.md](./11-SETUP-DEPLOYMENT.md)

## Resources

- [Sanity Documentation](https://www.sanity.io/docs)
- [next-sanity GitHub](https://github.com/sanity-io/next-sanity)
- [GROQ Cheat Sheet](https://www.sanity.io/docs/query-cheat-sheet)
- [Sanity Schema Types](https://www.sanity.io/docs/schema-types)
- [Portable Text](https://www.sanity.io/docs/presenting-block-text)

# Sanity CMS Query Builder Skill

## Description
Generate type-safe GROQ queries for Sanity CMS with automatic TypeScript inference for the Kilalo project. This skill helps create queries that integrate with the existing i18n system and follow best practices.

## When to Use
- Creating new content queries for Ventures, Programs, Events, Case Studies, or Blog Posts
- Fetching data in Server Components
- Building dynamic routes with `generateStaticParams`
- Querying internationalized content fields

## Input Parameters
- **contentType**: The Sanity schema type (e.g., "venture", "event", "post")
- **fields**: Array of field names to return
- **filters**: Optional GROQ filters (e.g., featured == true)
- **sorting**: Optional sort order
- **limit**: Optional result limit
- **params**: Optional query parameters for dynamic values

## Output
Returns a complete GROQ query using `defineQuery` with:
- Type-safe query definition
- Proper field projections
- Reference expansions (e.g., author->)
- Internationalized field handling
- Usage example in Server Component

## Example Usage

**Input:**
```
Create a query to fetch featured ventures with their case studies
```

**Output:**
```typescript
// Add to sanity/lib/queries.ts

export const FEATURED_VENTURES_WITH_CASE_STUDIES_QUERY = defineQuery(`
  *[_type == "venture" && featured == true && defined(slug.current)] | order(_createdAt desc) [0...6] {
    _id,
    name,
    tagline,
    description,
    slug,
    logo,
    industry,
    stage,
    metricsHighlight,
    "caseStudies": *[_type == "caseStudy" && references(^._id)] | order(publishedAt desc) [0...3] {
      _id,
      title,
      slug,
      excerpt,
      publishedAt
    }
  }
`)

// Usage in Server Component:
import { client } from '@/sanity/lib/client'
import { FEATURED_VENTURES_WITH_CASE_STUDIES_QUERY } from '@/sanity/lib/queries'
import { getLocalizedValue } from '@/lib/i18n-helpers'

export default async function FeaturedVentures({
  params
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const ventures = await client.fetch(FEATURED_VENTURES_WITH_CASE_STUDIES_QUERY)

  return (
    <section>
      {ventures.map((venture) => (
        <article key={venture._id}>
          <h2>{getLocalizedValue(venture.name, locale)}</h2>
          <p>{getLocalizedValue(venture.tagline, locale)}</p>
          <div>
            {venture.caseStudies?.map((cs) => (
              <a key={cs._id} href={`/ventures/${venture.slug.current}/case-studies/${cs.slug.current}`}>
                {getLocalizedValue(cs.title, locale)}
              </a>
            ))}
          </div>
        </article>
      ))}
    </section>
  )
}
```

## Best Practices Applied
1. Always use `defineQuery` for type safety
2. Add queries to `sanity/lib/queries.ts`
3. Use `defined(slug.current)` when filtering by slugs
4. Expand references with `->` operator
5. Use `getLocalizedValue()` for internationalized fields
6. Generate types with `npx sanity@latest typegen generate`

## Related Patterns
- Internationalized fields: `name`, `title`, `description`, `tagline`
- Reference expansion: `"author": author->{ name, image }`
- Reverse references: `*[_type == "x" && references(^._id)]`
- Projections: Use object syntax `{ field1, field2 }` for specific fields

## Validation
After creating a query:
1. Add it to `sanity/lib/queries.ts`
2. Run `npx sanity@latest typegen generate`
3. Verify TypeScript types are generated
4. Test with actual Sanity data
5. Ensure i18n fields work with `getLocalizedValue()`

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

## Dataset Management & Workflow

### Environment Configuration

- **Local development**: Always use `NEXT_PUBLIC_SANITY_DATASET=development` in `.env.local`
- **Vercel production**: Use `NEXT_PUBLIC_SANITY_DATASET=production` in environment variables

### Safe Production Sync Workflow

**CRITICAL**: Never directly edit production dataset in Sanity Studio

1. **Work in development**:

   ```bash
   # Verify you're on development
   grep NEXT_PUBLIC_SANITY_DATASET .env.local
   # Should show: development
   ```

2. **Before syncing to production**:

   ```bash
   # Check which dataset is newer
   npx sanity documents query '*[_type == "siteSettings"][0]._updatedAt' --dataset production
   npx sanity documents query '*[_type == "siteSettings"][0]._updatedAt' --dataset development

   # Backup production first
   npx sanity dataset export production sanity/backups/prod-$(date +%Y%m%d).tar.gz
   ```

3. **Sync to production**:
   ```bash
   # Use safe sync script with confirmations
   ./scripts/sync-to-production.sh
   ```

### Common CLI Commands

```bash
# Query documents
npx sanity documents query '*[_type == "siteSettings"]' --dataset development

# Delete documents
npx sanity documents delete <doc-id> --dataset development

# Export dataset
npx sanity dataset export development backup.tar.gz

# Import dataset (DANGEROUS - always backup first!)
npx sanity dataset import backup.ndjson production --replace

# Emergency rollback
npx sanity dataset import sanity/backups/prod-YYYYMMDD.tar.gz production --replace
```

### Content Types in Sanity

- **Site Settings** (`siteSettings`): Global translations (206 fields × 2 languages)
  - Documents: `siteSettings-en`, `siteSettings-fr`
- **Programs**: V2S Program, Hekima Time
- **Ventures**: Portfolio companies
- **Case Studies**: Success stories
- **Team Members**: Staff profiles
- **Blog Posts**: Articles and insights
- **Events**: Hekima Time sessions
- **Impact Metrics**: Annual metrics

### Protection Rules

1. ✅ Always backup production before syncing
2. ✅ Check timestamps before overwriting
3. ✅ Test changes in development first
4. ✅ Use version control for schema changes
5. ❌ Never sync production → development (can lose work)
6. ❌ Never use `--replace` without backup

See [sanity/WORKFLOW.md](../sanity/WORKFLOW.md) for complete workflow documentation.

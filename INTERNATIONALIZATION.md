# Internationalization (i18n) Guide

This document describes how internationalization is implemented in the Kilalo website for English and French content.

## Overview

The Kilalo website uses a **field-level internationalization approach** with explicit language fields for English (EN) and French (FR). This is a production-ready pattern that works reliably with Next.js 16, Sanity Studio v3, and the next-intl library.

## Architecture

### Frontend (next-intl)
- **Purpose**: UI labels, navigation, buttons, static text
- **Location**: `messages/en.json` and `messages/fr.json`
- **Usage**: Automatic locale routing via Next.js App Router

### Backend (Sanity CMS)
- **Purpose**: Dynamic content (events, programs, ventures, blog posts, case studies)
- **Approach**: Explicit language fields (e.g., `titleEn`, `titleFr`)
- **Reason**: Simple, reliable, no plugin dependencies, works seamlessly with Next.js 16 RSC

## Content Type Schemas

All translatable fields in Sanity use explicit language suffixes:

### Event Schema
```typescript
{
  titleEn: string        // Event Title (English)
  titleFr: string        // Event Title (French)
  descriptionEn: text    // Description (English)
  descriptionFr: text    // Description (French)
  // ... other fields
}
```

### Program Schema
```typescript
{
  nameEn: string                // Program Name (English)
  nameFr: string                // Program Name (French)
  shortDescriptionEn: text      // Short Description (English)
  shortDescriptionFr: text      // Short Description (French)
  // ... other fields
}
```

### Venture Schema
```typescript
{
  nameEn: string                // Company Name (English)
  nameFr: string                // Company Name (French)
  taglineEn: string             // Tagline (English)
  taglineFr: string             // Tagline (French)
  descriptionEn: text           // Short Description (English)
  descriptionFr: text           // Short Description (French)
  metricsHighlightEn: string    // Key Metric (English)
  metricsHighlightFr: string    // Key Metric (French)
  // ... other fields
}
```

### Case Study Schema
```typescript
{
  titleEn: string        // Case Study Title (English)
  titleFr: string        // Case Study Title (French)
  // ... other fields
}
```

### Blog Post Schema
```typescript
{
  titleEn: string        // Title (English)
  titleFr: string        // Title (French)
  excerptEn: text        // Excerpt (English)
  excerptFr: text        // Excerpt (French)
  // ... other fields
}
```

## Helper Functions

The `lib/i18n-helpers.ts` file provides utility functions for working with localized content:

### `getLocalizedField()`
Extracts the correct language version of a field:

```typescript
import { getLocalizedField } from '@/lib/i18n-helpers'

// Example usage in a component
const event = {
  titleEn: 'Workshop',
  titleFr: 'Atelier',
  descriptionEn: 'A great workshop',
  descriptionFr: 'Un excellent atelier'
}

const locale = 'fr'
const title = getLocalizedField(event, 'title', locale)
// Returns: 'Atelier'

const description = getLocalizedField(event, 'description', locale)
// Returns: 'Un excellent atelier'
```

### `groqProjectFields()`
Generates GROQ projection for both languages:

```typescript
import { groqProjectFields } from '@/lib/i18n-helpers'

const projection = groqProjectFields(['title', 'description'])
// Returns: "titleEn, titleFr, descriptionEn, descriptionFr"

// Use in GROQ query:
const query = `*[_type == "event"]{ ${projection} }`
```

### `groqProjectLocale()`
Generates GROQ projection with aliases for a single locale:

```typescript
import { groqProjectLocale } from '@/lib/i18n-helpers'

const projection = groqProjectLocale(['title', 'description'], 'en')
// Returns: '"title": titleEn, "description": descriptionEn'

// Use in GROQ query:
const query = `*[_type == "event"]{ ${projection} }`
```

## GROQ Query Examples

### Fetch all events with both languages
```typescript
const query = `*[_type == "event"] | order(eventDate desc) {
  _id,
  titleEn,
  titleFr,
  descriptionEn,
  descriptionFr,
  eventDate,
  slug
}`
```

### Fetch events for specific locale
```typescript
const query = `*[_type == "event"] | order(eventDate desc) {
  _id,
  "title": titleEn,
  "description": descriptionEn,
  eventDate,
  slug
}`
```

### Using helper function
```typescript
import { groqProjectLocale } from '@/lib/i18n-helpers'

const locale = 'fr'
const fields = groqProjectLocale(['title', 'description'], locale)
const query = `*[_type == "event"] | order(eventDate desc) {
  _id,
  ${fields},
  eventDate,
  slug
}`
```

## Frontend Component Usage

### Example: Event Card Component

```typescript
import { getLocalizedField } from '@/lib/i18n-helpers'
import { useLocale } from 'next-intl'

interface Event {
  titleEn: string
  titleFr: string
  descriptionEn: string
  descriptionFr: string
}

export function EventCard({ event }: { event: Event }) {
  const locale = useLocale()

  const title = getLocalizedField(event, 'title', locale)
  const description = getLocalizedField(event, 'description', locale)

  return (
    <div>
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  )
}
```

### Example: Direct field access

```typescript
// If you know the locale at query time, you can use direct access
export async function getEvents(locale: string) {
  const titleField = locale === 'en' ? 'titleEn' : 'titleFr'
  const descriptionField = locale === 'en' ? 'descriptionEn' : 'descriptionFr'

  const query = `*[_type == "event"] | order(eventDate desc) {
    _id,
    "title": ${titleField},
    "description": ${descriptionField},
    eventDate,
    slug
  }`

  return await client.fetch(query)
}
```

## Slug Generation

All slugs are automatically generated from the English title/name:

```typescript
defineField({
  name: 'slug',
  title: 'Slug',
  type: 'slug',
  options: {
    source: 'titleEn',  // or 'nameEn' for programs/ventures
    maxLength: 96,
  },
  validation: (Rule) => Rule.required(),
}),
```

## Content Entry Workflow

When creating content in Sanity Studio:

1. Fill in the English version of all translatable fields
2. Fill in the French version of all translatable fields
3. Both versions are required (validation enforced)
4. Slug is auto-generated from the English title/name

## Best Practices

1. **Always provide both languages**: All translatable fields require both EN and FR versions
2. **Use helper functions**: Use `getLocalizedField()` in components for consistency
3. **Query efficiently**: Fetch only the language you need when possible
4. **Fallback to English**: The helper function defaults to English if a translation is missing
5. **Maintain consistency**: Keep field naming consistent across content types

## Migration Notes

This implementation uses explicit fields instead of plugins because:
- ✅ Simple and predictable
- ✅ No plugin dependencies or compatibility issues
- ✅ Works seamlessly with Next.js 16 App Router and RSC
- ✅ Production-ready and battle-tested approach
- ✅ Easy to query and maintain
- ✅ TypeScript-friendly with clear field names

## Related Files

- `/sanity/schemaTypes/event.ts` - Event schema
- `/sanity/schemaTypes/program.ts` - Program schema
- `/sanity/schemaTypes/venture.ts` - Venture schema
- `/sanity/schemaTypes/caseStudy.ts` - Case Study schema
- `/sanity/schemaTypes/post.ts` - Blog Post schema
- `/lib/i18n-helpers.ts` - Helper functions
- `/messages/en.json` - English UI translations
- `/messages/fr.json` - French UI translations

# JSDoc Standards - Kilalo Project

## Overview

All public functions and types in the Kilalo project should have JSDoc comments. This improves IDE intellisense and serves as inline documentation.

## Basic Function Documentation

```typescript
/**
 * Brief description of what the function does
 *
 * More detailed explanation if needed. Can span multiple lines
 * and provide context about when and how to use this function.
 *
 * @param paramName - Description of the parameter
 * @param anotherParam - Description of another parameter
 * @returns Description of what the function returns
 *
 * @example
 * const result = myFunction('hello', 42)
 * console.log(result) // "hello: 42"
 */
export function myFunction(paramName: string, anotherParam: number): string {
  return `${paramName}: ${anotherParam}`
}
```

## Type/Interface Documentation

```typescript
/**
 * Represents a localized content object from Sanity CMS
 *
 * This type uses explicit language fields (titleEn, titleFr) rather than
 * nested locale objects. Index signature allows for TypeScript strict mode
 * compatibility when working with dynamic Sanity fields.
 */
export interface SanityVenture {
  /** Unique identifier for the venture */
  _id: string

  /** English name of the venture */
  nameEn: string

  /** French name of the venture */
  nameFr: string

  /** URL-friendly slug for routing */
  slug: SanitySlug

  /** Index signature for strict TypeScript compatibility */
  [key: string]: unknown
}
```

## Real Examples from Kilalo

### i18n Helper Function
```typescript
/**
 * Get the localized value from an object with explicit language fields
 *
 * @param content - Object containing the internationalized fields
 * @param fieldName - Base field name (e.g., 'title', 'description')
 * @param locale - The locale to retrieve ('en' or 'fr')
 * @param fallback - Fallback locale if the requested locale is not found (default: 'en')
 * @returns The localized value or empty string if not found
 *
 * @example
 * const event = { titleEn: 'Workshop', titleFr: 'Atelier' }
 * getLocalizedField(event, 'title', 'fr') // Returns 'Atelier'
 * getLocalizedField(event, 'title', 'en') // Returns 'Workshop'
 */
export function getLocalizedField(
  content: Record<string, unknown> | undefined,
  fieldName: string,
  locale: string,
  fallback: string = 'en'
): string {
  // implementation
}
```

### Sanity Helper Function
```typescript
/**
 * Fetches localized site settings from Sanity CMS
 *
 * Retrieves the single-language site settings document for the specified locale.
 * Each locale has its own document with all translations for that language.
 *
 * @param locale - The locale to fetch settings for ('en' or 'fr')
 * @returns Promise resolving to the site settings document, or undefined if not found
 *
 * @example
 * const settings = await getSiteSettings('en')
 * console.log(settings.siteTitle) // "Kilalo"
 *
 * const frSettings = await getSiteSettings('fr')
 * console.log(frSettings.siteTitle) // "Kilalo"
 */
export async function getSiteSettings(locale: string) {
  // implementation
}
```

## Required Tags

### For Functions
- `@param` - For each parameter (include type if not obvious from TypeScript)
- `@returns` - What the function returns
- `@example` - At least one usage example for complex functions
- `@throws` (optional) - If function can throw specific errors

### For Types/Interfaces
- Description of what the type represents
- Individual field descriptions for important/non-obvious fields
- Notes about special considerations (e.g., index signatures)

## Style Guidelines

1. **First Line**: Brief one-line summary
2. **Detailed Description**: Additional context if needed (separated by blank line)
3. **Tags**: All @param, @returns, @example tags
4. **Examples**: Show realistic usage with expected output
5. **Clarity**: Write for developers unfamiliar with the code
6. **Consistency**: Follow existing patterns in the codebase

## When to Add JSDoc

### Always Document
- Public functions exported from modules
- All types and interfaces
- Complex helper functions
- API routes and server actions

### Optional (but recommended)
- Simple type aliases
- Internal utility functions
- React components (props interfaces should be documented)

### Not Required
- Private functions (not exported)
- Obvious getters/setters
- Test files

## Tools and Validation

JSDoc comments improve:
- VS Code IntelliSense
- TypeScript type checking
- Automated documentation generation
- Code review understanding

## Bad Examples (Don't Do This)

```typescript
// Too brief, no context
/**
 * Gets field
 */
export function getField(obj, name) {}

// Missing @example
/**
 * Complex transformation function
 * @param data - The data
 * @returns The result
 */
export function transform(data) {}

// Redundant with TypeScript
/**
 * @param name - string
 * @param age - number
 * @returns string
 */
export function greet(name: string, age: number): string {}
```

## Good Examples (Do This)

```typescript
/**
 * Transforms raw Sanity data into a display-ready format
 *
 * Handles missing fields gracefully and applies default values
 * for optional properties.
 *
 * @param data - Raw Sanity document
 * @returns Formatted data ready for rendering
 *
 * @example
 * const raw = await client.fetch(query)
 * const formatted = transform(raw)
 * // formatted has all required fields with defaults applied
 */
export function transform(data: SanityDocument): FormattedData {}
```

## Current Coverage

- lib/i18n-helpers.ts: Fully documented ✅
- lib/sanity-helpers.ts: Fully documented ✅
- types/sanity.ts: Needs documentation for 10 interfaces
- components/: Minimal documentation

## Next Steps

Priority for JSDoc additions:
1. All interfaces in types/sanity.ts
2. Shared component prop interfaces
3. Sanity query functions
4. Form validation schemas

/**
 * Helper functions for working with internationalized content from Sanity
 * Uses explicit language fields approach (titleEn, titleFr, etc.)
 */

/**
 * Content object with explicit language fields
 * Each translatable field has separate properties for English and French
 */
export type LocalizedContent = Record<string, string | undefined>

/**
 * Get the localized value from an object with explicit language fields
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
  content: LocalizedContent | undefined,
  fieldName: string,
  locale: string,
  fallback: string = 'en'
): string {
  if (!content) {
    return ''
  }

  // Construct the localized field name (e.g., 'titleEn', 'titleFr')
  const localizedFieldName = `${fieldName}${locale.charAt(0).toUpperCase()}${locale.slice(1)}`
  const localizedValue = content[localizedFieldName]

  // Return the localized value if it exists
  if (localizedValue) {
    return localizedValue
  }

  // Fallback to the fallback locale
  if (locale !== fallback) {
    const fallbackFieldName = `${fieldName}${fallback.charAt(0).toUpperCase()}${fallback.slice(1)}`
    return content[fallbackFieldName] || ''
  }

  return ''
}

/**
 * GROQ projection fragment for explicit language fields
 * Projects both English and French versions of the specified field
 *
 * @example
 * groqProjectFields(['title', 'description'])
 * // Returns: "titleEn, titleFr, descriptionEn, descriptionFr"
 */
export function groqProjectFields(fieldNames: string[]): string {
  return fieldNames.flatMap((field) => [`${field}En`, `${field}Fr`]).join(', ')
}

/**
 * GROQ projection for a single locale
 * Returns aliased field names for cleaner queries
 *
 * @example
 * groqProjectLocale(['title', 'description'], 'en')
 * // Returns: '"title": titleEn, "description": descriptionEn'
 */
export function groqProjectLocale(fieldNames: string[], locale: string): string {
  const suffix = locale.charAt(0).toUpperCase() + locale.slice(1)
  return fieldNames.map((field) => `"${field}": ${field}${suffix}`).join(', ')
}

import { client } from '@/sanity/lib/client'

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
  const settings = await client.fetch(`*[_type == "siteSettings" && language == $locale][0]`, {
    locale,
  })
  return settings
}

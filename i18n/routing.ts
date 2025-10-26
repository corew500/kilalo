import { defineRouting } from 'next-intl/routing'

export const routing = defineRouting({
  // All supported locales
  locales: ['en', 'fr'],

  // Default locale
  defaultLocale: 'en',
})

// Export types for use in components
export type Locale = (typeof routing.locales)[number]

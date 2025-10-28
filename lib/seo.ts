export const siteConfig = {
  name: 'Kilalo',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://kilalo.com',

  description: {
    en: 'Empowering DRC entrepreneurs through venture studio support, business programs, and community building.',
    fr: 'Autonomiser les entrepreneurs de la RDC grâce au soutien de studio de venture, aux programmes d\'affaires et au développement communautaire.',
  },

  ogImage: '/og-image.png',

  social: {
    twitter: '@kilalo',
    linkedin: 'https://linkedin.com/company/kilalo',
  },

  locale: {
    en: 'en_US',
    fr: 'fr_FR',
  },
}

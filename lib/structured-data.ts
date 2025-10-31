/**
 * Structured Data (JSON-LD) helpers for SEO
 * Generates schema.org markup for rich search results
 */

import { siteConfig } from './seo'

export interface OrganizationSchema {
  '@context': 'https://schema.org'
  '@type': 'Organization'
  name: string
  url: string
  logo: string
  description: string
  sameAs: string[]
  contactPoint: {
    '@type': 'ContactPoint'
    contactType: string
    email: string
  }
  address?: {
    '@type': 'PostalAddress'
    streetAddress: string
    addressLocality: string
    addressCountry: string
  }
}

export interface WebsiteSchema {
  '@context': 'https://schema.org'
  '@type': 'WebSite'
  name: string
  url: string
  description: string
  inLanguage: string[]
  potentialAction: {
    '@type': 'SearchAction'
    target: string
    'query-input': string
  }
}

export interface BreadcrumbSchema {
  '@context': 'https://schema.org'
  '@type': 'BreadcrumbList'
  itemListElement: Array<{
    '@type': 'ListItem'
    position: number
    name: string
    item?: string
  }>
}

/**
 * Generate Organization structured data
 */
export function generateOrganizationSchema(locale: string): OrganizationSchema {
  const isEnglish = locale === 'en'

  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Kilalo',
    url: siteConfig.url,
    logo: `${siteConfig.url}/kilalo-logo.png`,
    description: isEnglish
      ? 'Venture studio helping Congolese entrepreneurs scale for-profit solutions to poverty and hunger'
      : 'Studio de venture aidant les entrepreneurs congolais à développer des solutions contre la pauvreté',
    sameAs: [siteConfig.social.twitter, siteConfig.social.linkedin],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'General Inquiries',
      email: 'hello@kilalo.org',
    },
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'N°18 Av. Du Lac, Kyeshero',
      addressLocality: 'Goma, Nord-Kivu',
      addressCountry: 'CD',
    },
  }
}

/**
 * Generate Website structured data
 */
export function generateWebsiteSchema(locale: string): WebsiteSchema {
  const isEnglish = locale === 'en'

  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Kilalo',
    url: `${siteConfig.url}/${locale}`,
    description: isEnglish
      ? 'Empowering DRC entrepreneurs through venture studio programs'
      : 'Autonomiser les entrepreneurs RDC à travers des programmes de studio de venture',
    inLanguage: ['en', 'fr'],
    potentialAction: {
      '@type': 'SearchAction',
      target: `${siteConfig.url}/${locale}/search?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  }
}

/**
 * Generate Breadcrumb structured data
 */
export function generateBreadcrumbSchema(
  items: Array<{ name: string; url?: string }>
): BreadcrumbSchema {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      ...(item.url && { item: item.url }),
    })),
  }
}

/**
 * Generate Article structured data (for blog posts/case studies)
 */
export function generateArticleSchema(params: {
  title: string
  description: string
  url: string
  datePublished: string
  dateModified?: string
  authorName?: string
  images?: string[]
  locale: string
}) {
  const { title, description, url, datePublished, dateModified, authorName, images, locale } =
    params

  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description,
    url,
    datePublished,
    dateModified: dateModified || datePublished,
    author: authorName
      ? {
          '@type': 'Person',
          name: authorName,
        }
      : {
          '@type': 'Organization',
          name: 'Kilalo',
        },
    publisher: {
      '@type': 'Organization',
      name: 'Kilalo',
      logo: {
        '@type': 'ImageObject',
        url: `${siteConfig.url}/kilalo-logo.png`,
      },
    },
    ...(images && images.length > 0 && { image: images }),
    inLanguage: locale,
  }
}

/**
 * Generate CollectionPage structured data (for listing pages)
 */
export function generateCollectionPageSchema(params: {
  name: string
  description: string
  url: string
  locale: string
}) {
  const { name, description, url, locale } = params

  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name,
    description,
    url,
    inLanguage: locale,
    isPartOf: {
      '@type': 'WebSite',
      url: siteConfig.url,
      name: 'Kilalo',
    },
  }
}

/**
 * Render JSON-LD script tag
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function renderJsonLd(data: any) {
  return {
    __html: JSON.stringify(data),
  }
}

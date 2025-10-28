/**
 * SEO and Metadata Utilities
 *
 * Helpers for generating SEO-friendly metadata for Next.js pages.
 * Supports Open Graph, Twitter Cards, and structured data.
 */

import type { Metadata } from 'next'

// ============================================================================
// TYPES
// ============================================================================

export interface PageMetadataProps {
  title?: string
  description?: string
  image?: string
  path?: string
  locale?: string
  type?: 'website' | 'article' | 'profile'
  publishedTime?: string
  modifiedTime?: string
  author?: string
  tags?: string[]
  noIndex?: boolean
}

// ============================================================================
// BASE METADATA
// ============================================================================

export const siteConfig = {
  name: 'Kilalo',
  description:
    'DRC-focused venture studio helping Congolese entrepreneurs scale for-profit solutions that address poverty and hunger.',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://kilalo.org',
  ogImage: '/og-image.png',
  twitterHandle: '@kilalo_org',
  locale: 'en',
  locales: ['en', 'fr'],
} as const

// ============================================================================
// GENERATE PAGE METADATA
// ============================================================================

/**
 * Generate comprehensive metadata for a page
 */
export async function generatePageMetadata({
  title,
  description,
  image = siteConfig.ogImage,
  path = '',
  locale = 'en',
  type = 'website',
  publishedTime,
  modifiedTime,
  author,
  tags,
  noIndex = false,
}: PageMetadataProps = {}): Promise<Metadata> {
  const pageTitle = title ? `${title} | ${siteConfig.name}` : siteConfig.name
  const pageDescription = description || siteConfig.description
  const pageUrl = `${siteConfig.url}${path}`
  const imageUrl = image.startsWith('http') ? image : `${siteConfig.url}${image}`

  return {
    title: pageTitle,
    description: pageDescription,
    applicationName: siteConfig.name,
    keywords: tags,
    authors: author ? [{ name: author }] : undefined,
    creator: siteConfig.name,
    publisher: siteConfig.name,
    metadataBase: new URL(siteConfig.url),
    alternates: {
      canonical: pageUrl,
      languages: {
        en: `${siteConfig.url}/en${path}`,
        fr: `${siteConfig.url}/fr${path}`,
      },
    },
    openGraph: {
      type,
      locale,
      url: pageUrl,
      siteName: siteConfig.name,
      title: pageTitle,
      description: pageDescription,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: title || siteConfig.name,
        },
      ],
      ...(type === 'article' && {
        publishedTime,
        modifiedTime,
        authors: author ? [author] : undefined,
        tags,
      }),
    },
    twitter: {
      card: 'summary_large_image',
      site: siteConfig.twitterHandle,
      creator: siteConfig.twitterHandle,
      title: pageTitle,
      description: pageDescription,
      images: [imageUrl],
    },
    robots: noIndex
      ? {
          index: false,
          follow: false,
        }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
          },
        },
  }
}

// ============================================================================
// STRUCTURED DATA (JSON-LD)
// ============================================================================

/**
 * Generate Organization structured data
 */
export function generateOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: siteConfig.name,
    url: siteConfig.url,
    logo: `${siteConfig.url}/logo.png`,
    description: siteConfig.description,
    address: {
      '@type': 'PostalAddress',
      streetAddress: "N°18 Av. Du Lac, Kyeshero",
      addressLocality: 'Goma',
      addressRegion: 'Nord-Kivu',
      addressCountry: 'CD',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'General Inquiries',
      email: 'hello@kilalo.org',
    },
    sameAs: [
      // Add social media URLs
      // 'https://twitter.com/kilalo_org',
      // 'https://linkedin.com/company/kilalo',
    ],
  }
}

/**
 * Generate Article structured data
 */
export function generateArticleSchema({
  title,
  description,
  image,
  publishedTime,
  modifiedTime,
  author,
  url,
}: {
  title: string
  description: string
  image?: string
  publishedTime: string
  modifiedTime?: string
  author?: string
  url: string
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description,
    image: image ? `${siteConfig.url}${image}` : undefined,
    datePublished: publishedTime,
    dateModified: modifiedTime || publishedTime,
    author: author
      ? {
          '@type': 'Person',
          name: author,
        }
      : {
          '@type': 'Organization',
          name: siteConfig.name,
        },
    publisher: {
      '@type': 'Organization',
      name: siteConfig.name,
      logo: {
        '@type': 'ImageObject',
        url: `${siteConfig.url}/logo.png`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
  }
}

/**
 * Generate Event structured data
 */
export function generateEventSchema({
  name,
  description,
  startDate,
  endDate,
  location,
  image,
  url,
}: {
  name: string
  description: string
  startDate: string
  endDate?: string
  location?: string
  image?: string
  url: string
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name,
    description,
    startDate,
    endDate,
    location: location
      ? {
          '@type': 'Place',
          name: location,
        }
      : undefined,
    image: image ? `${siteConfig.url}${image}` : undefined,
    organizer: {
      '@type': 'Organization',
      name: siteConfig.name,
      url: siteConfig.url,
    },
    url,
  }
}

/**
 * Generate BreadcrumbList structured data
 */
export function generateBreadcrumbSchema(
  items: Array<{ name: string; url: string }>
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${siteConfig.url}${item.url}`,
    })),
  }
}

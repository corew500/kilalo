import type { SanityImageSource } from '@sanity/image-url/lib/types/types'

// Base types

/**
 * Sanity slug type containing the current slug string
 */
export interface SanitySlug {
  _type: 'slug'
  current: string
  [key: string]: unknown
}

/**
 * Sanity image with optional alt text for accessibility
 */
export type SanityImageWithAlt = SanityImageSource & {
  alt?: string
}

// Venture types

/**
 * Venture/business supported by Kilalo
 * Contains bilingual content (English/French) for name, description, and tagline
 */
export interface SanityVenture {
  _id: string
  nameEn: string
  nameFr: string
  slug: SanitySlug
  descriptionEn: string
  descriptionFr: string
  sector: string
  location: string
  taglineEn?: string
  taglineFr?: string
  metricsHighlightEn?: string
  metricsHighlightFr?: string
  logo?: SanityImageWithAlt
  featured?: boolean
  websiteUrl?: string
  caseStudy?: SanityCaseStudyReference
  [key: string]: unknown
}

/**
 * Reference to a case study document
 * Used when ventures link to their case studies
 */
export interface SanityCaseStudyReference {
  _id: string
  titleEn: string
  titleFr: string
  slug: SanitySlug
  [key: string]: unknown
}

/**
 * Full case study document showcasing venture impact and outcomes
 * Contains bilingual challenge descriptions and impact highlights
 */
export interface SanityCaseStudy {
  _id: string
  titleEn: string
  titleFr: string
  slug: SanitySlug
  challengeEn: string
  challengeFr: string
  impactHighlightEn?: string
  impactHighlightFr?: string
  venture?: {
    _id: string
    nameEn: string
    nameFr: string
    slug: SanitySlug
    sector: string
    location: string
    [key: string]: unknown
  }
  publishedAt: string
  [key: string]: unknown
}

// Event types

/**
 * Event document (Hekima Time webinars, workshops, etc.)
 * Contains bilingual content and event status tracking
 */
export interface SanityEvent {
  _id: string
  titleEn: string
  titleFr: string
  descriptionEn?: string
  descriptionFr?: string
  eventDate: string
  format?: string
  registrationUrl?: string
  recordingUrl?: string
  status: 'upcoming' | 'completed' | 'cancelled'
  speakers?: string[] | { name: string; title: string }[]
  keyTakeawaysEn?: string
  keyTakeawaysFr?: string
  series?: string
  [key: string]: unknown
}

// Team member types

/**
 * Team member profile
 * Contains bilingual bio, role, and expertise information
 */
export interface SanityTeamMember {
  _id: string
  name: string
  roleEn: string
  roleFr: string
  bioEn: string
  bioFr: string
  photo?: SanityImageWithAlt
  expertiseEn?: string[]
  expertiseFr?: string[]
  socialLinks?: {
    linkedin?: string
    twitter?: string
    [key: string]: unknown
  }
  [key: string]: unknown
}

// Blog post types

/**
 * Blog post document
 * Supports bilingual content with title, excerpt, and categories
 */
export interface SanityPost {
  _id: string
  title: string
  titleEn?: string
  titleFr?: string
  slug: SanitySlug
  excerpt: string
  excerptEn?: string
  excerptFr?: string
  publishedAt: string
  coverImage?: SanityImageWithAlt
  author?: {
    name: string
    [key: string]: unknown
  }
  categories?: string[]
  [key: string]: unknown
}

// Program types

/**
 * Program document (V2S, Hekima Time, etc.)
 * Contains bilingual content for program details, curriculum, and testimonials
 */
export interface SanityProgram {
  _id: string
  nameEn: string
  nameFr: string
  programType: string
  shortDescriptionEn: string
  shortDescriptionFr: string
  duration?: string
  format?: string
  eligibilityEn?: string
  eligibilityFr?: string
  outcomesEn?: string
  outcomesFr?: string
  keyFeatures?: Array<{
    titleEn: string
    titleFr: string
    descriptionEn: string
    descriptionFr: string
    [key: string]: unknown
  }>
  curriculum?: Array<{
    week?: number
    toolNameEn: string
    toolNameFr: string
    descriptionEn: string
    descriptionFr: string
    [key: string]: unknown
  }>
  testimonials?: Array<{
    quoteEn: string
    quoteFr: string
    author: string
    company?: string
    [key: string]: unknown
  }>
  applicationUrl?: string
  [key: string]: unknown
}

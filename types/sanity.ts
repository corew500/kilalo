import type { SanityImageSource } from '@sanity/image-url/lib/types/types'

// Base types
export interface SanitySlug {
  _type: 'slug'
  current: string
  [key: string]: unknown
}

export type SanityImageWithAlt = SanityImageSource & {
  alt?: string
}

// Venture types
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

export interface SanityCaseStudyReference {
  _id: string
  titleEn: string
  titleFr: string
  slug: SanitySlug
  [key: string]: unknown
}

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

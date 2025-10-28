/**
 * Sanity GROQ Queries
 *
 * Type-safe GROQ queries using defineQuery for automatic TypeScript inference.
 * Run `npx sanity@latest typegen generate` after schema changes.
 */

import { defineQuery } from 'next-sanity'

// ============================================================================
// VENTURES
// ============================================================================

export const VENTURES_QUERY = defineQuery(`
  *[_type == "venture" && defined(slug.current)] | order(_createdAt desc) {
    _id,
    name,
    tagline,
    description,
    slug,
    logo,
    industry,
    stage,
    founded,
    metricsHighlight,
    featured
  }
`)

export const VENTURE_BY_SLUG_QUERY = defineQuery(`
  *[_type == "venture" && slug.current == $slug][0] {
    _id,
    name,
    tagline,
    description,
    slug,
    logo,
    coverImage,
    industry,
    stage,
    founded,
    location,
    website,
    metricsHighlight,
    featured,
    "caseStudies": *[_type == "caseStudy" && references(^._id)] | order(publishedAt desc) {
      _id,
      title,
      slug,
      excerpt,
      publishedAt,
      coverImage
    }
  }
`)

export const FEATURED_VENTURES_QUERY = defineQuery(`
  *[_type == "venture" && featured == true && defined(slug.current)] | order(_createdAt desc) [0...6] {
    _id,
    name,
    tagline,
    description,
    slug,
    logo,
    industry,
    stage,
    metricsHighlight
  }
`)

// ============================================================================
// CASE STUDIES
// ============================================================================

export const CASE_STUDIES_QUERY = defineQuery(`
  *[_type == "caseStudy" && defined(slug.current)] | order(publishedAt desc) {
    _id,
    title,
    slug,
    excerpt,
    publishedAt,
    coverImage,
    "venture": venture->{
      _id,
      name,
      logo,
      industry
    }
  }
`)

export const CASE_STUDY_BY_SLUG_QUERY = defineQuery(`
  *[_type == "caseStudy" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    excerpt,
    publishedAt,
    coverImage,
    problem,
    solution,
    results,
    testimonial,
    "venture": venture->{
      _id,
      name,
      tagline,
      logo,
      industry,
      website
    }
  }
`)

// ============================================================================
// PROGRAMS
// ============================================================================

export const PROGRAMS_QUERY = defineQuery(`
  *[_type == "program"] | order(order asc) {
    _id,
    name,
    shortDescription,
    programType,
    duration,
    icon,
    order
  }
`)

export const PROGRAM_BY_ID_QUERY = defineQuery(`
  *[_type == "program" && _id == $id][0] {
    _id,
    name,
    shortDescription,
    fullDescription,
    programType,
    duration,
    schedule,
    curriculum,
    icon,
    features
  }
`)

// ============================================================================
// EVENTS
// ============================================================================

export const UPCOMING_EVENTS_QUERY = defineQuery(`
  *[_type == "event" && eventDate >= $today && defined(slug.current)] | order(eventDate asc) {
    _id,
    title,
    description,
    slug,
    eventDate,
    eventType,
    location,
    registrationLink
  }
`)

export const PAST_EVENTS_QUERY = defineQuery(`
  *[_type == "event" && eventDate < $today && defined(slug.current)] | order(eventDate desc) [0...$limit] {
    _id,
    title,
    description,
    slug,
    eventDate,
    eventType,
    location,
    recordingUrl
  }
`)

export const EVENT_BY_SLUG_QUERY = defineQuery(`
  *[_type == "event" && slug.current == $slug][0] {
    _id,
    title,
    description,
    slug,
    eventDate,
    eventType,
    location,
    registrationLink,
    recordingUrl,
    speakers,
    topics,
    resources
  }
`)

// ============================================================================
// BLOG POSTS
// ============================================================================

export const POSTS_QUERY = defineQuery(`
  *[_type == "post" && defined(slug.current)] | order(publishedAt desc) [0...$limit] {
    _id,
    title,
    excerpt,
    slug,
    publishedAt,
    coverImage,
    category,
    "author": author->{
      _id,
      name,
      image,
      bio
    }
  }
`)

export const POST_BY_SLUG_QUERY = defineQuery(`
  *[_type == "post" && slug.current == $slug][0] {
    _id,
    title,
    excerpt,
    slug,
    publishedAt,
    coverImage,
    body,
    category,
    tags,
    "author": author->{
      _id,
      name,
      image,
      bio
    }
  }
`)

export const RECENT_POSTS_QUERY = defineQuery(`
  *[_type == "post" && defined(slug.current)] | order(publishedAt desc) [0...3] {
    _id,
    title,
    excerpt,
    slug,
    publishedAt,
    coverImage
  }
`)

// ============================================================================
// IMPACT METRICS
// ============================================================================

export const IMPACT_METRICS_QUERY = defineQuery(`
  *[_type == "impactMetrics"][0] {
    _id,
    year,
    totalVentures,
    activeVentures,
    jobsCreated,
    revenueGenerated,
    livesImpacted,
    programsCompleted,
    mentorshipHours,
    fundingSecured
  }
`)

// ============================================================================
// TEAM MEMBERS
// ============================================================================

export const TEAM_MEMBERS_QUERY = defineQuery(`
  *[_type == "teamMember"] | order(order asc) {
    _id,
    name,
    role,
    bio,
    image,
    linkedIn,
    order
  }
`)

// ============================================================================
// SITE SETTINGS
// ============================================================================

export const SITE_SETTINGS_QUERY = defineQuery(`
  *[_type == "siteSettings"][0] {
    _id,
    heroTitle,
    heroSubtitle,
    aboutSnippet,
    contactEmail,
    contactPhone,
    whatsappNumber,
    socialLinks
  }
`)

// ============================================================================
// DYNAMIC PATHS (for generateStaticParams)
// ============================================================================

export const VENTURE_SLUGS_QUERY = defineQuery(`
  *[_type == "venture" && defined(slug.current)][].slug.current
`)

export const CASE_STUDY_SLUGS_QUERY = defineQuery(`
  *[_type == "caseStudy" && defined(slug.current)][].slug.current
`)

export const POST_SLUGS_QUERY = defineQuery(`
  *[_type == "post" && defined(slug.current)][].slug.current
`)

export const EVENT_SLUGS_QUERY = defineQuery(`
  *[_type == "event" && defined(slug.current)][].slug.current
`)

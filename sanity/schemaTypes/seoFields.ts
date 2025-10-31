import { defineField } from 'sanity'

/**
 * Reusable SEO fields for Sanity content types
 * Provides custom meta titles, descriptions, and OG images
 */
export const seoFields = [
  defineField({
    name: 'seo',
    title: 'SEO Settings',
    type: 'object',
    description: 'Override default SEO metadata (optional - uses title/description if not set)',
    options: {
      collapsible: true,
      collapsed: true,
    },
    fields: [
      defineField({
        name: 'metaTitleEn',
        title: 'Meta Title (English)',
        type: 'string',
        description: 'SEO title for search engines (50-60 characters recommended)',
        validation: (Rule) => Rule.max(60).warning('Keep under 60 characters for best SEO'),
      }),
      defineField({
        name: 'metaTitleFr',
        title: 'Meta Title (French)',
        type: 'string',
        description: 'SEO title for search engines (50-60 characters recommended)',
        validation: (Rule) => Rule.max(60).warning('Keep under 60 characters for best SEO'),
      }),
      defineField({
        name: 'metaDescriptionEn',
        title: 'Meta Description (English)',
        type: 'text',
        description: 'SEO description for search engines (150-160 characters recommended)',
        validation: (Rule) => Rule.max(160).warning('Keep under 160 characters for best SEO'),
        rows: 3,
      }),
      defineField({
        name: 'metaDescriptionFr',
        title: 'Meta Description (French)',
        type: 'text',
        description: 'SEO description for search engines (150-160 characters recommended)',
        validation: (Rule) => Rule.max(160).warning('Keep under 160 characters for best SEO'),
        rows: 3,
      }),
      defineField({
        name: 'ogImage',
        title: 'Social Share Image',
        type: 'image',
        description: 'Custom image for social media sharing (1200x630px recommended)',
        options: {
          hotspot: true,
        },
        fields: [
          {
            name: 'alt',
            type: 'string',
            title: 'Alternative text',
          },
        ],
      }),
      defineField({
        name: 'noIndex',
        title: 'Hide from Search Engines',
        type: 'boolean',
        description: 'Prevent this page from appearing in search results',
        initialValue: false,
      }),
    ],
  }),
]

import { defineField, defineType } from 'sanity'
import { seoFields } from './seoFields'

export const caseStudy = defineType({
  name: 'caseStudy',
  title: 'Case Study',
  type: 'document',
  description: 'Detailed success stories of ventures Kilalo has supported',
  fields: [
    defineField({
      name: 'titleEn',
      title: 'Case Study Title (English)',
      type: 'string',
      description: 'e.g., "Coproad — Strengthening Vision and Driving Growth in Eastern DRC"',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'titleFr',
      title: 'Case Study Title (French)',
      type: 'string',
      description: 'e.g., "Coproad — Strengthening Vision and Driving Growth in Eastern DRC"',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'titleEn',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'venture',
      title: 'Related Venture',
      type: 'reference',
      to: [{ type: 'venture' }],
      description: 'Link to the venture this case study is about',
    }),
    defineField({
      name: 'sector',
      title: 'Sector',
      type: 'string',
      description: 'e.g., "Agriculture (Cocoa)" or "Media & Communications"',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'location',
      title: 'Location',
      type: 'string',
      description: 'e.g., "Beni, DR Congo"',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'program',
      title: 'Program/Partnership Type',
      type: 'string',
      description: 'e.g., "Vision & Structure Program" or "Kilalo Portfolio Partnership"',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'heroImage',
      title: 'Hero Image',
      type: 'image',
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Alternative text',
        },
        {
          name: 'caption',
          type: 'string',
          title: 'Caption',
        },
      ],
    }),
    defineField({
      name: 'challengeEn',
      title: 'The Challenge (English)',
      type: 'array',
      of: [{ type: 'block' }],
      description: 'What problem or opportunity was the company facing?',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'challengeFr',
      title: 'The Challenge (French)',
      type: 'array',
      of: [{ type: 'block' }],
      description: 'What problem or opportunity was the company facing?',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'partnershipEn',
      title: 'The Kilalo Partnership (English)',
      type: 'array',
      of: [{ type: 'block' }],
      description: 'How did Kilalo partner with this venture? What did we provide?',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'partnershipFr',
      title: 'The Kilalo Partnership (French)',
      type: 'array',
      of: [{ type: 'block' }],
      description: 'How did Kilalo partner with this venture? What did we provide?',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'impactEn',
      title: 'The Impact (English)',
      type: 'array',
      of: [{ type: 'block' }],
      description: 'Results achieved and outcomes',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'impactFr',
      title: 'The Impact (French)',
      type: 'array',
      of: [{ type: 'block' }],
      description: 'Results achieved and outcomes',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'quote',
      title: 'Featured Quote',
      type: 'object',
      fields: [
        {
          name: 'textEn',
          type: 'text',
          title: 'Quote Text (English)',
          validation: (Rule) => Rule.required(),
        },
        {
          name: 'textFr',
          type: 'text',
          title: 'Quote Text (French)',
          validation: (Rule) => Rule.required(),
        },
        {
          name: 'author',
          type: 'string',
          title: 'Author',
          validation: (Rule) => Rule.required(),
        },
        {
          name: 'authorTitle',
          type: 'string',
          title: 'Author Title/Position',
        },
      ],
    }),
    defineField({
      name: 'whyItMattersEn',
      title: 'Why It Matters (English)',
      type: 'array',
      of: [{ type: 'block' }],
      description: 'The broader significance of this work',
    }),
    defineField({
      name: 'whyItMattersFr',
      title: 'Why It Matters (French)',
      type: 'array',
      of: [{ type: 'block' }],
      description: 'The broader significance of this work',
    }),
    defineField({
      name: 'impactImages',
      title: 'Impact Images',
      type: 'array',
      of: [
        {
          type: 'image',
          options: {
            hotspot: true,
          },
          fields: [
            {
              name: 'alt',
              type: 'string',
              title: 'Alternative text',
            },
            {
              name: 'caption',
              type: 'string',
              title: 'Caption',
            },
          ],
        },
      ],
      description: 'Photos showing the real-world impact',
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published At',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
    }),
    defineField({
      name: 'featured',
      title: 'Featured Case Study',
      type: 'boolean',
      description: 'Highlight this case study',
      initialValue: false,
    }),
    ...seoFields,
  ],
  orderings: [
    {
      title: 'Published Date (Newest)',
      name: 'publishedDesc',
      by: [{ field: 'publishedAt', direction: 'desc' }],
    },
  ],
  preview: {
    select: {
      titleEn: 'titleEn',
      sector: 'sector',
      media: 'heroImage',
    },
    prepare({ titleEn, sector, media }) {
      return {
        title: titleEn,
        subtitle: sector,
        media,
      }
    },
  },
})

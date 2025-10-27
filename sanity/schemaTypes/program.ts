import { defineField, defineType } from 'sanity'

export const program = defineType({
  name: 'program',
  title: 'Program',
  type: 'document',
  fields: [
    defineField({
      name: 'nameEn',
      title: 'Program Name (English)',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'nameFr',
      title: 'Program Name (French)',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'nameEn',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'shortDescriptionEn',
      title: 'Short Description (English)',
      type: 'text',
      description: 'Brief one-liner (used in cards)',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'shortDescriptionFr',
      title: 'Short Description (French)',
      type: 'text',
      description: 'Brief one-liner (used in cards)',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'fullDescriptionEn',
      title: 'Full Description (English)',
      type: 'array',
      of: [{ type: 'block' }],
      description: 'Detailed program description',
    }),
    defineField({
      name: 'fullDescriptionFr',
      title: 'Full Description (French)',
      type: 'array',
      of: [{ type: 'block' }],
      description: 'Detailed program description',
    }),
    defineField({
      name: 'programType',
      title: 'Program Type',
      type: 'string',
      options: {
        list: [
          { title: 'Vision & Structure (V2S)', value: 'v2s' },
          { title: 'Workshop Series', value: 'workshop' },
          { title: 'Direct Support', value: 'direct-support' },
          { title: 'Mentorship', value: 'mentorship' },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'duration',
      title: 'Duration',
      type: 'string',
      description: 'e.g., "16 weeks", "3 months", "Ongoing"',
    }),
    defineField({
      name: 'format',
      title: 'Format',
      type: 'string',
      description: 'e.g., "In-person + Virtual", "Webinar", "1:1 Consulting"',
    }),
    defineField({
      name: 'eligibilityEn',
      title: 'Eligibility Criteria (English)',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'List of requirements to participate',
    }),
    defineField({
      name: 'eligibilityFr',
      title: 'Eligibility Criteria (French)',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'List of requirements to participate',
    }),
    defineField({
      name: 'keyFeatures',
      title: 'Key Features',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'titleEn',
              type: 'string',
              title: 'Feature Title (English)',
            },
            {
              name: 'titleFr',
              type: 'string',
              title: 'Feature Title (French)',
            },
            {
              name: 'descriptionEn',
              type: 'text',
              title: 'Description (English)',
            },
            {
              name: 'descriptionFr',
              type: 'text',
              title: 'Description (French)',
            },
          ],
        },
      ],
    }),
    defineField({
      name: 'outcomesEn',
      title: 'Expected Outcomes (English)',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'What participants will achieve',
    }),
    defineField({
      name: 'outcomesFr',
      title: 'Expected Outcomes (French)',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'What participants will achieve',
    }),
    defineField({
      name: 'curriculum',
      title: 'Curriculum / Tools',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'week',
              type: 'number',
              title: 'Week Number',
            },
            {
              name: 'toolNameEn',
              type: 'string',
              title: 'Tool/Module Name (English)',
            },
            {
              name: 'toolNameFr',
              type: 'string',
              title: 'Tool/Module Name (French)',
            },
            {
              name: 'descriptionEn',
              type: 'text',
              title: 'Description (English)',
            },
            {
              name: 'descriptionFr',
              type: 'text',
              title: 'Description (French)',
            },
          ],
        },
      ],
    }),
    defineField({
      name: 'testimonials',
      title: 'Testimonials',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'quoteEn',
              type: 'text',
              title: 'Quote (English)',
            },
            {
              name: 'quoteFr',
              type: 'text',
              title: 'Quote (French)',
            },
            {
              name: 'author',
              type: 'string',
              title: 'Author Name',
            },
            {
              name: 'company',
              type: 'string',
              title: 'Company',
            },
          ],
        },
      ],
    }),
    defineField({
      name: 'applicationUrl',
      title: 'Application/Registration URL',
      type: 'url',
      description: 'Link to Calendly, form, or application page',
    }),
    defineField({
      name: 'isActive',
      title: 'Currently Accepting Applications',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'order',
      title: 'Display Order',
      type: 'number',
      validation: (Rule) => Rule.required().integer().min(0),
    }),
  ],
  orderings: [
    {
      title: 'Display Order',
      name: 'orderAsc',
      by: [{ field: 'order', direction: 'asc' }],
    },
  ],
  preview: {
    select: {
      nameEn: 'nameEn',
      subtitle: 'programType',
      order: 'order',
    },
    prepare({ nameEn, subtitle, order }) {
      return {
        title: `${order}. ${nameEn}`,
        subtitle: subtitle?.replace('-', ' '),
      }
    },
  },
})

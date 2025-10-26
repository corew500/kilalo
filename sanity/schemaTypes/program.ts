import { defineField, defineType } from 'sanity'

export const program = defineType({
  name: 'program',
  title: 'Program',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Program Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'name',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'shortDescription',
      title: 'Short Description',
      type: 'text',
      description: 'Brief one-liner (used in cards)',
      validation: (Rule) => Rule.required().max(150),
    }),
    defineField({
      name: 'fullDescription',
      title: 'Full Description',
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
      name: 'eligibility',
      title: 'Eligibility Criteria',
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
              name: 'title',
              type: 'string',
              title: 'Feature Title',
            },
            {
              name: 'description',
              type: 'text',
              title: 'Description',
            },
          ],
        },
      ],
    }),
    defineField({
      name: 'outcomes',
      title: 'Expected Outcomes',
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
              name: 'toolName',
              type: 'string',
              title: 'Tool/Module Name',
            },
            {
              name: 'description',
              type: 'text',
              title: 'Description',
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
              name: 'quote',
              type: 'text',
              title: 'Quote',
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
      title: 'name',
      subtitle: 'programType',
      order: 'order',
    },
    prepare({ title, subtitle, order }) {
      return {
        title: `${order}. ${title}`,
        subtitle: subtitle?.replace('-', ' '),
      }
    },
  },
})

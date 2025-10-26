import { defineField, defineType } from 'sanity'

export const caseStudy = defineType({
  name: 'caseStudy',
  title: 'Case Study',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Case Study Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'company',
      title: 'Company',
      type: 'reference',
      to: [{ type: 'portfolioCompany' }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'sector',
      title: 'Sector',
      type: 'string',
      options: {
        list: [
          { title: 'Agro-Food', value: 'agro-food' },
          { title: 'Technology', value: 'technology' },
          { title: 'Media & Communications', value: 'media' },
          { title: 'Agriculture', value: 'agriculture' },
          { title: 'Education', value: 'education' },
          { title: 'Healthcare', value: 'healthcare' },
          { title: 'Other', value: 'other' },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'location',
      title: 'Location',
      type: 'string',
      description: 'e.g., "Goma, DRC" or "Kinshasa, DRC"',
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
      ],
    }),
    defineField({
      name: 'problem',
      title: 'Problem Statement',
      type: 'text',
      description: 'What challenge was the company facing?',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'solution',
      title: 'Solution',
      type: 'text',
      description: 'Their business model or approach',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'kilaloRole',
      title: "Kilalo's Role",
      type: 'array',
      of: [{ type: 'block' }],
      description: 'What specific support did Kilalo provide?',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'results',
      title: 'Results Achieved',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'metric',
              type: 'string',
              title: 'Metric Name',
              description: 'e.g., "Revenue Growth", "Jobs Created"',
            },
            {
              name: 'value',
              type: 'string',
              title: 'Value',
              description: 'e.g., "150%", "25 jobs"',
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
      name: 'timeline',
      title: 'Timeline',
      type: 'string',
      description: 'e.g., "6 months", "2023-2024"',
    }),
    defineField({
      name: 'founderQuote',
      title: 'Founder/CEO Quote',
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
          title: 'Author',
        },
        {
          name: 'position',
          type: 'string',
          title: 'Position',
        },
      ],
    }),
    defineField({
      name: 'fullStory',
      title: 'Full Story',
      type: 'array',
      of: [
        {
          type: 'block',
        },
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
    }),
    defineField({
      name: 'relatedPost',
      title: 'Related Blog Post',
      type: 'reference',
      to: [{ type: 'post' }],
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
      description: 'Show on homepage',
      initialValue: false,
    }),
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
      title: 'title',
      companyName: 'company.name',
      sector: 'sector',
      media: 'heroImage',
    },
    prepare({ title, companyName, sector, media }) {
      return {
        title: `${title}`,
        subtitle: `${companyName} • ${sector}`,
        media,
      }
    },
  },
})

import { defineField, defineType } from 'sanity'

export const venture = defineType({
  name: 'venture',
  title: 'Venture',
  type: 'document',
  description: 'Portfolio companies showcased on the ventures page',
  fields: [
    defineField({
      name: 'nameEn',
      title: 'Company Name (English)',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'nameFr',
      title: 'Company Name (French)',
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
      name: 'taglineEn',
      title: 'Tagline (English)',
      type: 'string',
      description: 'Short one-liner (e.g., "Strengthening local food supply chains")',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'taglineFr',
      title: 'Tagline (French)',
      type: 'string',
      description: 'Short one-liner (e.g., "Strengthening local food supply chains")',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'logo',
      title: 'Company Logo',
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
      name: 'sector',
      title: 'Sector',
      type: 'string',
      options: {
        list: [
          { title: 'Agro-Food', value: 'agro-food' },
          { title: 'Food & Beverage', value: 'food-beverage' },
          { title: 'Legal Tech', value: 'legal-tech' },
          { title: 'Media & Communications', value: 'media' },
          { title: 'Agriculture', value: 'agriculture' },
          { title: 'Technology', value: 'technology' },
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
      description: 'e.g., "Goma, North Kivu"',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'descriptionEn',
      title: 'Short Description (English)',
      type: 'text',
      description: 'Brief overview for the ventures grid (2-3 sentences)',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'descriptionFr',
      title: 'Short Description (French)',
      type: 'text',
      description: 'Brief overview for the ventures grid (2-3 sentences)',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'metricsHighlightEn',
      title: 'Key Metric Highlight (English)',
      type: 'string',
      description: 'One standout metric (e.g., "45% increase in farmer income")',
    }),
    defineField({
      name: 'metricsHighlightFr',
      title: 'Key Metric Highlight (French)',
      type: 'string',
      description: 'One standout metric (e.g., "45% increase in farmer income")',
    }),
    defineField({
      name: 'websiteUrl',
      title: 'Website URL',
      type: 'url',
    }),
    defineField({
      name: 'caseStudy',
      title: 'Related Case Study',
      type: 'reference',
      to: [{ type: 'caseStudy' }],
      description: 'Link to detailed case study if available',
    }),
    defineField({
      name: 'featured',
      title: 'Featured',
      type: 'boolean',
      description: 'Show on homepage',
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
      subtitle: 'sector',
      media: 'logo',
      order: 'order',
    },
    prepare({ nameEn, subtitle, media, order }) {
      return {
        title: `${order}. ${nameEn}`,
        subtitle,
        media,
      }
    },
  },
})

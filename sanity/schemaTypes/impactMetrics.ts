import { defineField, defineType } from 'sanity'

export const impactMetrics = defineType({
  name: 'impactMetrics',
  title: 'Impact Metrics',
  type: 'document',
  fields: [
    defineField({
      name: 'year',
      title: 'Year',
      type: 'number',
      description: 'Fiscal year for these metrics',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'businessesSupported',
      title: 'Businesses Supported',
      type: 'number',
      description: 'Total number of businesses supported',
      validation: (Rule) => Rule.required().integer().min(0),
    }),
    defineField({
      name: 'hekimaSessions',
      title: 'Hekima Time Sessions',
      type: 'number',
      description: 'Number of Hekima Time sessions hosted',
      validation: (Rule) => Rule.integer().min(0),
    }),
    defineField({
      name: 'sessionsAttendees',
      title: 'Total Session Attendees',
      type: 'number',
      description: 'Cumulative attendance across all sessions',
      validation: (Rule) => Rule.integer().min(0),
    }),
    defineField({
      name: 'regionsServed',
      title: 'Regions Served',
      type: 'number',
      description: 'Number of regions/provinces in DRC',
      validation: (Rule) => Rule.integer().min(0),
    }),
    defineField({
      name: 'jobsCreated',
      title: 'Jobs Created',
      type: 'number',
      description: 'Estimated jobs created through supported businesses',
      validation: (Rule) => Rule.integer().min(0),
    }),
    defineField({
      name: 'revenueGrowth',
      title: 'Average Revenue Growth',
      type: 'string',
      description: 'e.g., "150%" - average for portfolio companies',
    }),
    defineField({
      name: 'totalInvestment',
      title: 'Total Investment Facilitated',
      type: 'string',
      description: 'e.g., "$500K" - total capital raised by portfolio',
    }),
    defineField({
      name: 'programGraduates',
      title: 'Program Graduates',
      type: 'number',
      description: 'Number of businesses that completed V2S program',
      validation: (Rule) => Rule.integer().min(0),
    }),
    defineField({
      name: 'customMetrics',
      title: 'Custom Metrics',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'label',
              type: 'string',
              title: 'Metric Label',
              description: 'e.g., "Impact Stories Published"',
            },
            {
              name: 'value',
              type: 'string',
              title: 'Value',
              description: 'e.g., "24"',
            },
          ],
        },
      ],
    }),
    defineField({
      name: 'isCurrent',
      title: 'Current Year Metrics',
      type: 'boolean',
      description: 'Display these metrics on homepage',
      initialValue: false,
    }),
  ],
  preview: {
    select: {
      year: 'year',
      businesses: 'businessesSupported',
      isCurrent: 'isCurrent',
    },
    prepare({ year, businesses, isCurrent }) {
      return {
        title: `${year} Impact Metrics${isCurrent ? ' (CURRENT)' : ''}`,
        subtitle: `${businesses} businesses supported`,
      }
    },
  },
})

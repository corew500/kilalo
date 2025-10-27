import { defineField, defineType } from 'sanity'

export const event = defineType({
  name: 'event',
  title: 'Event',
  type: 'document',
  fields: [
    defineField({
      name: 'titleEn',
      title: 'Event Title (English)',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'titleFr',
      title: 'Event Title (French)',
      type: 'string',
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
      name: 'series',
      title: 'Event Series',
      type: 'string',
      options: {
        list: [
          { title: 'Hekima Time', value: 'hekima-time' },
          { title: 'Workshop', value: 'workshop' },
          { title: 'Networking', value: 'networking' },
          { title: 'Other', value: 'other' },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'descriptionEn',
      title: 'Description (English)',
      type: 'text',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'descriptionFr',
      title: 'Description (French)',
      type: 'text',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'eventDate',
      title: 'Event Date & Time',
      type: 'datetime',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'duration',
      title: 'Duration (minutes)',
      type: 'number',
      initialValue: 60,
    }),
    defineField({
      name: 'format',
      title: 'Format',
      type: 'string',
      options: {
        list: [
          { title: 'Virtual (Zoom/Teams)', value: 'virtual' },
          { title: 'In-Person', value: 'in-person' },
          { title: 'Hybrid', value: 'hybrid' },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'location',
      title: 'Location',
      type: 'string',
      description: 'Physical address or "Virtual" or "Zoom link will be sent"',
    }),
    defineField({
      name: 'speakers',
      title: 'Speakers',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'name',
              type: 'string',
              title: 'Speaker Name',
            },
            {
              name: 'title',
              type: 'string',
              title: 'Title/Role',
            },
            {
              name: 'photo',
              type: 'image',
              title: 'Photo',
              options: {
                hotspot: true,
              },
            },
          ],
        },
      ],
    }),
    defineField({
      name: 'topicsEn',
      title: 'Topics Covered (English)',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'Key topics or agenda items',
    }),
    defineField({
      name: 'topicsFr',
      title: 'Topics Covered (French)',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'Key topics or agenda items',
    }),
    defineField({
      name: 'registrationUrl',
      title: 'Registration URL',
      type: 'url',
      description: 'Link to registration form or Zoom meeting',
    }),
    defineField({
      name: 'maxAttendees',
      title: 'Maximum Attendees',
      type: 'number',
      description: 'Leave blank for unlimited',
    }),
    defineField({
      name: 'recordingUrl',
      title: 'Recording URL',
      type: 'url',
      description: 'YouTube or Vimeo link (for past events)',
    }),
    defineField({
      name: 'keyTakeawaysEn',
      title: 'Key Takeaways (English)',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'Summary points (for past events)',
    }),
    defineField({
      name: 'keyTakeawaysFr',
      title: 'Key Takeaways (French)',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'Summary points (for past events)',
    }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          { title: 'Upcoming', value: 'upcoming' },
          { title: 'In Progress', value: 'in-progress' },
          { title: 'Completed', value: 'completed' },
          { title: 'Cancelled', value: 'cancelled' },
        ],
      },
      validation: (Rule) => Rule.required(),
      initialValue: 'upcoming',
    }),
    defineField({
      name: 'featured',
      title: 'Featured Event',
      type: 'boolean',
      description: 'Show prominently on homepage',
      initialValue: false,
    }),
  ],
  orderings: [
    {
      title: 'Event Date (Newest)',
      name: 'dateDesc',
      by: [{ field: 'eventDate', direction: 'desc' }],
    },
    {
      title: 'Event Date (Upcoming)',
      name: 'dateAsc',
      by: [{ field: 'eventDate', direction: 'asc' }],
    },
  ],
  preview: {
    select: {
      titleEn: 'titleEn',
      subtitle: 'eventDate',
      series: 'series',
      status: 'status',
    },
    prepare({ titleEn, subtitle, series, status }) {
      const date = subtitle ? new Date(subtitle).toLocaleDateString() : 'No date'
      return {
        title: titleEn,
        subtitle: `${series} • ${date} • ${status}`,
      }
    },
  },
})

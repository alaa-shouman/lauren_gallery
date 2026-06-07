import { defineType, defineField } from 'sanity'

export const experienceCategorySchema = defineType({
  name: 'experienceCategory',
  title: 'Experience Category',
  type: 'document',
  fields: [
    defineField({
      name: 'label',
      title: 'Label',
      type: 'string',
      description: 'Main display label e.g. "Work"',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'accentLabel',
      title: 'Accent Label',
      type: 'string',
      description: 'Italic accent word shown after the label e.g. "experience"',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Key',
      type: 'slug',
      options: { source: 'label' },
      description: 'Stable identifier — used internally to group projects. Do not change after projects are assigned.',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'order',
      title: 'Display Order',
      type: 'number',
      description: 'Lower numbers appear first in the accordion on the site.',
      initialValue: 10,
      validation: (r) => r.required(),
    }),
  ],
  orderings: [
    {
      title: 'Display Order',
      name: 'displayOrder',
      by: [{ field: 'order', direction: 'asc' }],
    },
  ],
  preview: {
    select: { label: 'label', accentLabel: 'accentLabel', order: 'order' },
    prepare({ label, accentLabel, order }: { label?: string; accentLabel?: string; order?: number }) {
      return {
        title: `${label ?? '—'} ${accentLabel ?? ''}`.trim(),
        subtitle: order != null ? `Order: ${order}` : undefined,
      }
    },
  },
})

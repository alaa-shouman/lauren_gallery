import { defineType, defineField } from 'sanity'

export const heroSchema = defineType({
  name: 'hero',
  title: 'Hero',
  type: 'document',
  fields: [
    defineField({
      name: 'headline',
      title: 'Headline — Line 1',
      type: 'string',
      description: 'First dark line, e.g. "Clay, cloth,"',
    }),
    defineField({
      name: 'headlineItalic',
      title: 'Headline — Italic Line',
      type: 'string',
      description: 'Middle terracotta italic line, e.g. "and the quiet"',
    }),
    defineField({
      name: 'headlineSuffix',
      title: 'Headline — Line 3',
      type: 'string',
      description: 'Third dark line, e.g. "of making."',
    }),
    defineField({
      name: 'subheadline',
      title: 'Bio / Subheadline',
      type: 'text',
      rows: 3,
      description: '1–2 sentences shown in the right column beside the heading',
    }),
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'Pill tags shown below the bio, e.g. "Ceramics", "AUB \'21"',
    }),
  ],
  preview: {
    select: { title: 'headline' },
  },
})

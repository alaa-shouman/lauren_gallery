import { defineType, defineField } from 'sanity'

export const heroSchema = defineType({
  name: 'hero',
  title: 'Hero',
  type: 'document',
  fields: [
    defineField({
      name: 'tagline',
      title: 'Tagline',
      type: 'string',
      description: 'e.g. "earth · texture · form"',
    }),
    defineField({
      name: 'headline',
      title: 'Headline — Line 1',
      type: 'string',
      description: 'First line of heading (dark colour), e.g. "Clay, cloth,"',
    }),
    defineField({
      name: 'headlineItalic',
      title: 'Headline — Italic Line',
      type: 'string',
      description: 'Middle italic/accent line (terracotta), e.g. "and the quiet"',
    }),
    defineField({
      name: 'headlineSuffix',
      title: 'Headline — Line 3',
      type: 'string',
      description: 'Third line (dark colour), e.g. "of making."',
    }),
    defineField({
      name: 'subheadline',
      title: 'Bio / Subheadline',
      type: 'text',
      rows: 3,
      description: '1–2 sentences shown in the right column',
    }),
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'Pill tags shown below the bio, e.g. "Ceramics", "AUB \'21"',
    }),
    defineField({
      name: 'ctaLabel',
      title: 'CTA Label',
      type: 'string',
    }),
    defineField({
      name: 'ctaHref',
      title: 'CTA Link',
      type: 'string',
    }),
    defineField({
      name: 'heroImage',
      title: 'Hero Image',
      type: 'image',
      options: { hotspot: true },
      fields: [
        defineField({ name: 'alt', type: 'string', title: 'Alt text' }),
      ],
    }),
    defineField({
      name: 'backgroundTone',
      title: 'Background Tone',
      type: 'string',
      options: {
        list: [
          { title: 'Cream', value: 'cream' },
          { title: 'Warm', value: 'warm' },
          { title: 'Forest', value: 'forest' },
        ],
        layout: 'radio',
      },
      initialValue: 'cream',
    }),
  ],
  preview: {
    select: { title: 'headline' },
  },
})

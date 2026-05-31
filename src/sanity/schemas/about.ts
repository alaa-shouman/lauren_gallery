import { defineType, defineField } from 'sanity'

export const aboutSchema = defineType({
  name: 'about',
  title: 'About',
  type: 'document',
  fields: [
    defineField({
      name: 'sectionLabel',
      title: 'Section Label',
      type: 'string',
      description: 'Small caps label above the heading, e.g. "the maker"',
    }),
    defineField({
      name: 'portrait',
      title: 'Portrait',
      type: 'image',
      options: { hotspot: true },
      fields: [
        defineField({ name: 'alt', type: 'string', title: 'Alt text' }),
      ],
    }),
    defineField({
      name: 'bio',
      title: 'Bio',
      type: 'array',
      of: [
        {
          type: 'block',
          styles: [
            { title: 'Normal', value: 'normal' },
          ],
          marks: {
            decorators: [
              { title: 'Bold', value: 'strong' },
              { title: 'Italic', value: 'em' },
            ],
          },
        },
      ],
    }),
    defineField({
      name: 'signatureImage',
      title: 'Signature Image',
      type: 'image',
      description: 'Optional handwritten signature shown below the bio',
      fields: [
        defineField({ name: 'alt', type: 'string', title: 'Alt text' }),
      ],
    }),
    defineField({
      name: 'processSteps',
      title: 'Process Steps',
      type: 'array',
      description: 'The four steps shown in the "How a piece comes to life" section',
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'number', type: 'string', title: 'Step Number', description: 'e.g. "01"' }),
            defineField({ name: 'title', type: 'string', title: 'Step Title' }),
            defineField({ name: 'description', type: 'text', title: 'Description', rows: 3 }),
          ],
          preview: {
            select: { title: 'title', subtitle: 'number' },
          },
        },
      ],
    }),
  ],
  preview: {
    select: { title: 'sectionLabel', media: 'portrait' },
  },
})

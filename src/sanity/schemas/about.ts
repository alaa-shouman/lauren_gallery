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
      description: 'e.g. "the maker"',
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
            { title: 'Heading', value: 'h2' },
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
      description: 'Optional handwritten signature SVG/PNG',
      fields: [
        defineField({ name: 'alt', type: 'string', title: 'Alt text' }),
      ],
    }),
    defineField({
      name: 'values',
      title: 'Values',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'icon', type: 'string', title: 'Icon (emoji or name)' }),
            defineField({ name: 'label', type: 'string', title: 'Label' }),
            defineField({ name: 'description', type: 'text', title: 'Description', rows: 2 }),
          ],
          preview: {
            select: { title: 'label', subtitle: 'description' },
          },
        },
      ],
    }),
  ],
  preview: {
    select: { title: 'sectionLabel' },
  },
})

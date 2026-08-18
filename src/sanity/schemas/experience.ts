import { defineType, defineField } from 'sanity'
import { slugOptions, slugValidation } from './lib/slug'

export const experienceSchema = defineType({
  name: 'experience',
  title: 'Experience',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Project / Role Title',
      type: 'string',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title', ...slugOptions },
      validation: slugValidation,
    }),
    defineField({
      name: 'studio',
      title: 'Studio / Company',
      type: 'string',
      description: 'e.g. "Studio Heritage" or "Atelier Caldwell"',
    }),
    defineField({
      name: 'year',
      title: 'Year',
      type: 'number',
    }),
    defineField({
      name: 'location',
      title: 'Location',
      type: 'string',
      description: 'e.g. "Beirut, LB" or "London, UK"',
    }),
    defineField({
      name: 'description',
      title: 'Short Description',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'reference',
      to: [{ type: 'experienceCategory' }],
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'company',
      title: 'Company',
      type: 'reference',
      to: [{ type: 'company' }],
      description: 'Only used when the selected category has "Group by company" enabled. Projects without a company appear under an "Other projects" group.',
      options: {
        // Only offer companies that belong to the project's selected category.
        filter: ({ document }) => {
          const categoryRef = (document?.category as { _ref?: string } | undefined)?._ref
          if (!categoryRef) return { filter: 'false' }
          return {
            filter: 'category._ref == $categoryRef',
            params: { categoryRef },
          }
        },
      },
      validation: (r) =>
        r.custom(async (value, context) => {
          const categoryRef = (context.document?.category as { _ref?: string } | undefined)?._ref
          if (!categoryRef) return true
          const client = context.getClient({ apiVersion: '2024-01-01' })
          const hasCompany = await client.fetch<boolean>(
            '*[_id == $id][0].hasCompany',
            { id: categoryRef },
          )
          if (hasCompany && !value) {
            return 'This category groups projects by company — please assign a company (or leave it for the "Other projects" group).'
          }
          return true
        }).warning(),
    }),
    defineField({
      name: 'order',
      title: 'Order',
      type: 'number',
      description: 'Lower numbers appear first within their category',
      initialValue: 10,
    }),
    defineField({
      name: 'coverImage',
      title: 'Cover Image',
      type: 'image',
      options: { hotspot: true },
      fields: [
        defineField({ name: 'alt', type: 'string', title: 'Alt text' }),
      ],
    }),
    defineField({
      name: 'gallery',
      title: 'Gallery',
      type: 'array',
      of: [
        {
          type: 'image',
          options: { hotspot: true },
          fields: [
            defineField({ name: 'alt', type: 'string', title: 'Alt text' }),
            defineField({
              name: 'caption',
              type: 'string',
              title: 'Caption',
              description: 'Optional caption shown below the image in the gallery and lightbox',
            }),
          ],
        },
        {
          type: 'object',
          name: 'galleryDocument',
          title: 'PDF document',
          fields: [
            defineField({
              name: 'title',
              type: 'string',
              title: 'Title',
              description: 'Shown on the tile and in the viewer, e.g. "Floor plans"',
              validation: (r) => r.required(),
            }),
            defineField({
              name: 'file',
              type: 'file',
              title: 'PDF file',
              options: { accept: 'application/pdf' },
              validation: (r) => r.required(),
            }),
            defineField({
              name: 'preview',
              type: 'image',
              title: 'Preview image (optional)',
              description: 'A JPEG/PNG of the cover page, shown as the gallery tile. Without it a generic document tile is shown.',
              options: { hotspot: true },
            }),
            defineField({
              name: 'caption',
              type: 'string',
              title: 'Caption',
              description: 'Optional caption shown below the tile',
            }),
          ],
          preview: {
            select: { title: 'title', media: 'preview' },
            prepare({ title, media }) {
              return { title: title ?? 'PDF document', subtitle: 'PDF', media }
            },
          },
        },
      ],
    }),
    defineField({
      name: 'role',
      title: 'Role / Position',
      type: 'string',
      description: 'e.g. "Senior Designer" or "Interior Lead"',
    }),
    defineField({
      name: 'footprint',
      title: 'Footprint / Size',
      type: 'string',
      description: 'e.g. "220 m²" or "3 floors"',
    }),
    defineField({
      name: 'materials',
      title: 'Materials',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'e.g. "Lime-washed plaster", "Travertine"',
    }),
    defineField({
      name: 'externalUrl',
      title: 'External Link',
      type: 'url',
      description: 'Optional link to external project page',
    }),
    defineField({
      name: 'projectPdf',
      title: 'Project PDF',
      type: 'file',
      description: 'Upload a PDF for this project (e.g. presentation or case study)',
      options: { accept: '.pdf' },
    }),
  ],
  orderings: [
    {
      title: 'Category, then Order',
      name: 'categoryOrder',
      by: [{ field: 'category.order', direction: 'asc' }, { field: 'order', direction: 'asc' }],
    },
  ],
  preview: {
    select: { title: 'title', subtitle: 'category.label', media: 'coverImage' },
  },
})

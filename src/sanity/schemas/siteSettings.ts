import { defineType, defineField } from 'sanity'

export const siteSettingsSchema = defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  fields: [
    defineField({
      name: 'siteTitle',
      title: 'Site Title',
      type: 'string',
      description: 'Used for the browser tab title',
    }),
    defineField({
      name: 'metaDescription',
      title: 'Meta Description',
      type: 'text',
      rows: 3,
      description: 'SEO description shown in search results',
    }),
    defineField({
      name: 'role',
      title: 'Role / Title',
      type: 'string',
      description: 'Shown in the hero label, e.g. "Ceramicist & Textile Artist"',
    }),
    defineField({
      name: 'location',
      title: 'Location',
      type: 'string',
      description: 'Shown in the hero label, e.g. "Beirut, Lebanon"',
    }),
    defineField({
      name: 'email',
      title: 'Email',
      type: 'string',
    }),
    defineField({
      name: 'whatsapp',
      title: 'WhatsApp Number',
      type: 'string',
      description: 'Include country code, no spaces, e.g. "+9613123456"',
    }),
    defineField({
      name: 'linkedin',
      title: 'LinkedIn Profile URL or Handle',
      type: 'string',
      description: 'Full URL or just the handle, e.g. "lauren-khafaji"',
    }),
    defineField({
      name: 'resume',
      title: 'Resume / CV File',
      type: 'file',
      description: 'PDF file for the Download Resume button',
    }),
    defineField({
      name: 'footerTagline',
      title: 'Footer Tagline',
      type: 'string',
    }),
    defineField({
      name: 'socialLinks',
      title: 'Additional Social Links',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'platform', type: 'string', title: 'Platform' }),
            defineField({ name: 'url', type: 'url', title: 'URL' }),
          ],
          preview: { select: { title: 'platform', subtitle: 'url' } },
        },
      ],
    }),
  ],
  preview: {
    select: { title: 'siteTitle' },
  },
})

import groq from 'groq'

export const siteSettingsQuery = groq`
  *[_type == "siteSettings"][0] {
    siteTitle,
    metaDescription,
    socialLinks,
    email,
    contactNote,
    footerTagline,
    role,
    location,
    whatsapp,
    instagram,
    resume { asset-> }
  }
`

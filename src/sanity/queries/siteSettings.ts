import groq from 'groq'

export const siteSettingsQuery = groq`
  *[_id == "siteSettings"][0] {
    siteTitle,
    metaDescription,
    socialLinks,
    email,
    footerTagline,
    role,
    location,
    whatsapp,
    instagram,
    resume { asset-> }
  }
`

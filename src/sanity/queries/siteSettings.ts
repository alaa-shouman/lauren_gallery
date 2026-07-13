import groq from 'groq'

export const siteSettingsQuery = groq`
  *[_id == "siteSettings"][0] {
    name,
    siteTitle,
    metaDescription,
    socialLinks,
    email,
    footerTagline,
    role,
    location,
    whatsapp,
    linkedin,
    resume { asset-> }
  }
`

import groq from 'groq'

export const siteSettingsQuery = groq`
  *[_id == "siteSettings"][0] {
    name,
    siteTitle,
    metaDescription,
    ogImage { asset->, crop, hotspot, alt },
    socialLinks,
    email,
    footerTagline,
    role,
    location,
    whatsapp,
    linkedin,
    instagram,
    resume { asset-> }
  }
`

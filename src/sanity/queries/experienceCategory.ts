import groq from 'groq'

export const allCategoriesQuery = groq`
  *[_type == "experienceCategory"] | order(order asc) {
    _id,
    label,
    accentLabel,
    "slug": slug.current,
    order
  }
`

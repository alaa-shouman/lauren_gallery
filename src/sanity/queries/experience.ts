import groq from 'groq'

export const allExperiencesQuery = groq`
  *[_type == "experience"] | order(category->order asc, order asc) {
    _id,
    title,
    slug,
    studio,
    year,
    location,
    description,
    "category": category-> {
      _id,
      label,
      accentLabel,
      "slug": slug.current,
      order
    },
    order,
    externalUrl,
    coverImage { asset->, alt },
    "galleryCount": count(gallery)
  }
`

export const experienceBySlugQuery = groq`
  *[_type == "experience" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    studio,
    role,
    year,
    location,
    description,
    footprint,
    materials,
    "category": category-> {
      _id,
      label,
      accentLabel,
      "slug": slug.current,
      order
    },
    externalUrl,
    coverImage { asset->, alt },
    gallery[] { asset->, alt, caption },
    projectPdf { asset-> }
  }
`

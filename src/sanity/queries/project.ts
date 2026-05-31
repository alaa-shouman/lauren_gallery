import groq from 'groq'

export const featuredProjectsQuery = groq`
  *[_type == "project" && featured == true] | order(order asc) {
    _id,
    title,
    slug,
    category,
    year,
    coverImage { asset->, alt }
  }
`

export const allProjectsQuery = groq`
  *[_type == "project"] | order(order asc, year desc) {
    _id,
    title,
    slug,
    category,
    year,
    coverImage { asset->, alt }
  }
`

export const projectBySlugQuery = groq`
  *[_type == "project" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    category,
    year,
    description,
    materials,
    dimensions,
    featured,
    coverImage { asset->, alt },
    gallery[] { asset->, alt }
  }
`

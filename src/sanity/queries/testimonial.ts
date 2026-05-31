import groq from 'groq'

export const featuredTestimonialsQuery = groq`
  *[_type == "testimonial" && featured == true] {
    _id,
    quote,
    author,
    role,
    avatar { asset->, alt }
  }
`

export const allTestimonialsQuery = groq`
  *[_type == "testimonial"] {
    _id,
    quote,
    author,
    role,
    avatar { asset->, alt }
  }
`

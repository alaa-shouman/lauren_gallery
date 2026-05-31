import groq from 'groq'

export const allPressQuery = groq`
  *[_type == "press"] | order(date desc) {
    _id,
    publication,
    headline,
    excerpt,
    url,
    date,
    logo { asset->, alt }
  }
`

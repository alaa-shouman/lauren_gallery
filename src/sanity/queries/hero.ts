import groq from 'groq'

export const heroQuery = groq`
  *[_id == "hero"][0] {
    headline,
    headlineItalic,
    headlineSuffix,
    subheadline,
    tags
  }
`

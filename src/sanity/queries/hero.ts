import groq from 'groq'

export const heroQuery = groq`
  *[_type == "hero"][0] {
    tagline,
    headline,
    headlineItalic,
    headlineSuffix,
    subheadline,
    tags,
    ctaLabel,
    ctaHref,
    backgroundTone,
    heroImage { asset->, alt }
  }
`

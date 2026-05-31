import groq from 'groq'

export const heroQuery = groq`
  *[_type == "hero"][0] {
    tagline,
    headline,
    subheadline,
    ctaLabel,
    ctaHref,
    backgroundTone,
    heroImage { asset->, alt }
  }
`

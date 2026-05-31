import groq from 'groq'

export const aboutQuery = groq`
  *[_type == "about"][0] {
    sectionLabel,
    bio,
    values,
    portrait { asset->, alt },
    signatureImage { asset->, alt }
  }
`

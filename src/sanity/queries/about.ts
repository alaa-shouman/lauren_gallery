import groq from 'groq'

export const aboutQuery = groq`
  *[_id == "about"][0] {
    sectionLabel,
    bio,
    processSteps,
    portrait { asset->, alt },
    signatureImage { asset->, alt }
  }
`

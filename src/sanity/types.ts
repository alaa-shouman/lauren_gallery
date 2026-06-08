export interface SanityImage {
  asset: {
    _id: string
    url: string
    metadata?: {
      dimensions: { width: number; height: number }
    }
  }
  alt?: string
}

export interface HeroData {
  headline: string
  headlineItalic?: string
  headlineSuffix?: string
  subheadline: string
  tags?: string[]
}

export interface ProcessStep {
  number: string
  title: string
  description: string
}

export interface AboutData {
  sectionLabel: string
  bio: unknown[]
  processSteps?: ProcessStep[]
  portrait: SanityImage
  signatureImage?: SanityImage
}

export interface ExperienceCategory {
  _id: string
  label: string
  accentLabel: string
  slug: string
  order: number
}

export interface Experience {
  _id: string
  title: string
  slug: { current: string }
  studio?: string
  role?: string
  year?: number
  location?: string
  description?: string
  footprint?: string
  materials?: string[]
  category: ExperienceCategory
  order?: number
  coverImage?: SanityImage
  gallery?: SanityImage[]
  externalUrl?: string
  projectPdf?: { asset: { url: string } }
}

export interface SocialLink {
  platform: string
  url: string
}

export interface SiteSettings {
  siteTitle: string
  metaDescription: string
  socialLinks: SocialLink[]
  email: string
  contactNote: string
  footerTagline: string
  role?: string
  location?: string
  whatsapp?: string
  linkedin?: string
  resume?: { asset: { url: string } }
}

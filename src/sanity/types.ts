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
  tagline: string
  headline: string
  subheadline: string
  ctaLabel: string
  ctaHref: string
  backgroundTone: 'cream' | 'warm' | 'forest'
  heroImage: SanityImage
}

export interface AboutValue {
  icon: string
  label: string
  description: string
}

export interface AboutData {
  sectionLabel: string
  bio: unknown[]
  values: AboutValue[]
  portrait: SanityImage
  signatureImage?: SanityImage
}

export interface Project {
  _id: string
  title: string
  slug: { current: string }
  category: string
  year: number
  coverImage?: SanityImage
  gallery?: SanityImage[]
  description?: unknown[]
  materials?: string[]
  dimensions?: string
  featured?: boolean
}

export interface Testimonial {
  _id: string
  quote: string
  author: string
  role: string
  avatar?: SanityImage
}

export interface PressItem {
  _id: string
  publication: string
  headline: string
  excerpt?: string
  url?: string
  date?: string
  logo?: SanityImage
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
}

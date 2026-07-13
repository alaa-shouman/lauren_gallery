import { useEffect } from 'react'
import {
  HeroSection,
  ExperienceSection,
  AboutSection,
  SocialSection,
} from '@/components/organisms'
import { useSanity } from '@/hooks/useSanity'
import { useDocumentMeta } from '@/hooks/useDocumentMeta'
import { siteSettingsQuery } from '@/sanity/queries/siteSettings'
import type { SiteSettings } from '@/sanity/types'

export function HomePage() {
  const { data: settings } = useSanity<SiteSettings>(siteSettingsQuery)
  useDocumentMeta(settings?.siteTitle, settings?.metaDescription)

  useEffect(() => {
    const target = sessionStorage.getItem('_pendingScroll')
    if (target) {
      sessionStorage.removeItem('_pendingScroll')
      setTimeout(() => {
        document.getElementById(target)?.scrollIntoView({ behavior: 'smooth' })
      }, 120)
    }
  }, [])

  return (
    <main>
      <HeroSection />
      <ExperienceSection />
      <AboutSection />
      <SocialSection />
    </main>
  )
}

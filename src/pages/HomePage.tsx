import { useEffect, useMemo } from 'react'
import {
  HeroSection,
  ExperienceSection,
  AboutSection,
  SocialSection,
} from '@/components/organisms'
import { useSanity } from '@/hooks/useSanity'
import { useSeo, browserSeoOpts } from '@/hooks/useSeo'
import { homeSeo } from '@/lib/seo'
import { siteSettingsQuery } from '@/sanity/queries/siteSettings'
import { aboutQuery } from '@/sanity/queries/about'
import type { SiteSettings, AboutData } from '@/sanity/types'

export function HomePage() {
  const { data: settings } = useSanity<SiteSettings>(siteSettingsQuery)
  const { data: about } = useSanity<AboutData>(aboutQuery)
  const seoMeta = useMemo(
    () => homeSeo(settings ?? undefined, about?.portrait, browserSeoOpts()),
    [settings, about],
  )
  useSeo(seoMeta, settings?.siteTitle)

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

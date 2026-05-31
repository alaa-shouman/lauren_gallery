import { useEffect } from 'react'
import {
  HeroSection,
  ExperienceSection,
  AboutSection,
  SocialSection,
} from '@/components/organisms'

export function HomePage() {
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

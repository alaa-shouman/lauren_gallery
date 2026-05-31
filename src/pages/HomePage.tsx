import { useEffect } from 'react'
import {
  HeroSection,
  WorkSection,
  AboutSection,
  TestimonialsSection,
  PressStrip,
  ContactSection,
} from '@/components/organisms'

export function HomePage() {
  // Honour pending scroll set by cross-page nav links
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
      <WorkSection />
      <AboutSection />
      <TestimonialsSection />
      <PressStrip />
      <ContactSection />
    </main>
  )
}

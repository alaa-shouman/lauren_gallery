import {
  HeroSection,
  FeaturedWorkGrid,
  AboutStrip,
  TestimonialsSection,
  PressStrip,
  ContactTeaser,
} from '@/components/organisms'

export function HomePage() {
  return (
    <main>
      <HeroSection />
      <FeaturedWorkGrid />
      <AboutStrip />
      <TestimonialsSection />
      <PressStrip />
      <ContactTeaser />
    </main>
  )
}

import { Link } from 'react-router-dom'
import { useSanity } from '@/hooks/useSanity'
import { siteSettingsQuery } from '@/sanity/queries/siteSettings'
import { useFadeIn } from '@/hooks/useFadeIn'
import type { SiteSettings } from '@/sanity/types'

export function ContactTeaser() {
  const { data: settings } = useSanity<SiteSettings>(siteSettingsQuery)
  const sectionRef = useFadeIn<HTMLElement>()

  return (
    <section ref={sectionRef} className="fade-up py-24 md:py-32 bg-earth-forest text-earth-cream">
      <div className="mx-auto max-w-[1120px] px-6 text-center">
        <p className="text-xs tracking-[0.2em] text-earth-sage mb-6 uppercase">get in touch</p>

        <h2 className="font-serif italic text-4xl md:text-5xl text-earth-cream mb-6 tracking-[-0.02em] leading-[1.15]">
          {settings?.contactNote ?? "Let's work together."}
        </h2>

        <p className="text-earth-cream/50 font-light mb-10 max-w-md mx-auto">
          Commissions, collaborations, and studio visits welcome.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            to="/contact"
            className="px-8 py-3.5 rounded-full text-sm font-medium bg-earth-terracotta text-white hover:bg-earth-terracotta-dark transition-colors duration-500"
          >
            Start a conversation
          </Link>
          {settings?.email && (
            <a
              href={`mailto:${settings.email}`}
              className="text-sm text-earth-cream/50 hover:text-earth-cream transition-colors duration-300 underline underline-offset-4"
            >
              {settings.email}
            </a>
          )}
        </div>
      </div>
    </section>
  )
}

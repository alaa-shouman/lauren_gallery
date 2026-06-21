import { useSanity } from '@/hooks/useSanity'
import { heroQuery } from '@/sanity/queries/hero'
import { siteSettingsQuery } from '@/sanity/queries/siteSettings'
import type { HeroData, SiteSettings } from '@/sanity/types'

const MOCK_TAGS = ['Ceramics', 'Textiles', 'Surface Design', 'Natural Materials', "AUB '21"]

export function HeroSection() {
  const { data: hero } = useSanity<HeroData>(heroQuery)
  const { data: settings } = useSanity<SiteSettings>(siteSettingsQuery)

  const role = settings?.role ?? 'Ceramicist & Textile Artist'
  const location = settings?.location ?? 'Beirut, Lebanon'
  const line1 = hero?.headline ?? 'Clay, cloth,'
  const lineItalic = hero?.headlineItalic ?? 'and the quiet'
  const line3 = hero?.headlineSuffix ?? 'of making.'
  const bio = hero?.subheadline ?? 'Lauren Khafaji makes handcrafted ceramics, woven textiles, and surface works rooted in natural materials and an honest process.'
  const tags = (hero?.tags && hero.tags.length > 0) ? hero.tags : MOCK_TAGS

  return (
    <section id="hero" className="relative min-h-screen bg-earth-cream overflow-hidden flex items-center">
      <div className="mx-auto max-w-280 w-full px-6 py-28 md:py-0 md:min-h-screen md:flex md:items-center">

        {/* Mobile label */}
        <p className="md:hidden text-xs tracking-[0.22em] text-grey-light font-medium uppercase mb-7">
          — {role} · {location}
        </p>

        <div className="w-full grid md:grid-cols-[3fr_2fr] gap-10 md:gap-16 items-center">

          {/* Left: headline */}
          <div>
            {/* Desktop label */}
            <p className="hidden md:block text-xs tracking-[0.22em] text-grey-light font-medium uppercase mb-8">
              — {role} · {location}
            </p>

            <h1
              className="font-serif leading-[1.05] tracking-[-0.02em]"
              style={{ fontSize: 'clamp(3.2rem, 7vw, 6.5rem)' }}
            >
              <span className="block text-earth-forest">{line1}</span>
              <span className="block italic text-grey-light">{lineItalic}</span>
              <span className="block text-earth-forest">{line3}</span>
            </h1>

            {/* Mobile bio + tags */}
            <p className="md:hidden mt-7 text-base font-light leading-relaxed text-earth-forest max-w-sm">
              {bio}
            </p>
            <div className="md:hidden flex flex-wrap gap-2 mt-6">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="px-4 py-1.5 rounded-full border border-earth-forest/15 text-xs text-grey-mid font-medium"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Right: decorative circles + bio + tags */}
          <div className="hidden md:flex flex-col">
            {/* Decorative circles */}
            <div className="relative h-44 mb-10 self-end w-full max-w-70 ml-auto">
              <div className="absolute right-0 top-0 w-36 h-36 rounded-full bg-earth-sage/50" />
              <div className="absolute right-16 top-14 w-24 h-24 rounded-full bg-earth-terracotta/25" />
            </div>

            <p className="text-base font-light leading-relaxed text-earth-forest mb-7">
              {bio}
            </p>

            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="px-4 py-1.5 rounded-full border border-earth-forest/15 text-xs text-grey-mid font-medium"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* Scroll chevron */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <svg
          className="w-5 h-5 text-earth-forest/25"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </section>
  )
}

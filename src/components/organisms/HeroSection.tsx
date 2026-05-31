import { Link } from 'react-router-dom'
import { urlFor } from '@/sanity/lib/image'
import { useSanity } from '@/hooks/useSanity'
import { heroQuery } from '@/sanity/queries/hero'
import type { HeroData } from '@/sanity/types'
import { cn } from '@/lib/utils'

const bgMap = {
  cream: 'bg-earth-cream',
  warm: 'bg-earth-warm',
  forest: 'bg-earth-forest',
}

export function HeroSection() {
  const { data: hero, loading } = useSanity<HeroData>(heroQuery)

  const bg = bgMap[(hero?.backgroundTone ?? 'cream') as keyof typeof bgMap]
  const isDark = hero?.backgroundTone === 'forest'

  return (
    <section
      className={cn(
        'relative min-h-screen flex items-center overflow-hidden',
        loading ? 'bg-earth-cream' : bg
      )}
    >
      <div className="mx-auto max-w-[1120px] w-full px-6 py-32 md:py-24">
        <div className="relative grid md:grid-cols-[3fr_2fr] gap-12 items-center">

          {/* Left: text */}
          <div className="relative z-10">
            {(hero?.tagline || loading) && (
              <p
                className={cn(
                  'text-xs tracking-[0.25em] font-medium mb-6',
                  isDark ? 'text-earth-sage' : 'text-earth-sage'
                )}
              >
                {hero?.tagline ?? 'earth · texture · form'}
              </p>
            )}

            <h1
              className={cn(
                'font-serif italic leading-[1.1] tracking-[-0.02em] mb-8',
                'text-[clamp(2.8rem,6vw,5.5rem)]',
                isDark ? 'text-earth-cream' : 'text-earth-forest'
              )}
              style={{ fontStyle: 'italic' }}
            >
              {hero?.headline ?? 'Clay, cloth,\nand the quiet\nof making.'}
            </h1>

            <p
              className={cn(
                'text-base md:text-lg font-light leading-relaxed mb-10 max-w-md',
                isDark ? 'text-earth-cream/70' : 'text-earth-forest/65'
              )}
            >
              {hero?.subheadline ?? 'Handmade ceramics, textiles, and surface work rooted in natural materials and honest process.'}
            </p>

            <Link
              to={hero?.ctaHref ?? '/work'}
              className={cn(
                'inline-block px-8 py-3.5 rounded-full text-sm font-medium',
                'bg-earth-terracotta text-white',
                'hover:bg-earth-terracotta-dark',
                'transition-colors duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)]'
              )}
            >
              {hero?.ctaLabel ?? 'View my work'}
            </Link>
          </div>

          {/* Right: image */}
          <div className="relative">
            {hero?.heroImage?.asset ? (
              <div className="relative rounded-2xl overflow-hidden aspect-[3/4] shadow-[0_8px_40px_rgba(28,46,36,0.15)]">
                <img
                  src={urlFor(hero.heroImage).width(800).height(1067).fit('crop').url()}
                  alt={hero.heroImage.alt ?? 'Lauren Mercer work'}
                  className="w-full h-full object-cover"
                  loading="eager"
                />
              </div>
            ) : (
              <div className="rounded-2xl aspect-[3/4] bg-earth-sand animate-pulse" />
            )}
          </div>
        </div>
      </div>

      {/* Scroll chevron */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <svg
          className={cn('w-5 h-5', isDark ? 'text-earth-cream/30' : 'text-earth-forest/30')}
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

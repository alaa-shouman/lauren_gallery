import { Link } from 'react-router-dom'
import { urlFor } from '@/sanity/lib/image'
import { useSanity } from '@/hooks/useSanity'
import { aboutQuery } from '@/sanity/queries/about'
import { PortableTextRenderer } from '@/components/molecules/PortableTextRenderer'
import { useFadeIn } from '@/hooks/useFadeIn'
import type { AboutData } from '@/sanity/types'

export function AboutStrip() {
  const { data: about, loading } = useSanity<AboutData>(aboutQuery)
  const sectionRef = useFadeIn<HTMLElement>()

  const portraitUrl = about?.portrait?.asset
    ? urlFor(about.portrait).width(600).height(800).fit('crop').url()
    : null

  return (
    <section ref={sectionRef} className="fade-up py-24 md:py-32 bg-earth-warm">
      <div className="mx-auto max-w-[1120px] px-6">
        <div className="grid md:grid-cols-2 gap-12 md:gap-20 items-center">

          {/* Portrait */}
          <div className="relative">
            {loading ? (
              <div className="aspect-[3/4] rounded-2xl bg-earth-sand animate-pulse" />
            ) : portraitUrl ? (
              <img
                src={portraitUrl}
                alt={about?.portrait.alt ?? 'Lauren Mercer portrait'}
                className="w-full aspect-[3/4] object-cover rounded-2xl shadow-[0_2px_20px_rgba(28,46,36,0.08)]"
              />
            ) : (
              <div className="aspect-[3/4] rounded-2xl bg-earth-sand flex items-center justify-center text-earth-forest/20 text-sm">
                Portrait image
              </div>
            )}
          </div>

          {/* Text */}
          <div>
            <p className="text-xs tracking-[0.2em] text-earth-sage font-medium mb-4 uppercase">
              {about?.sectionLabel ?? 'the maker'}
            </p>
            <h2 className="font-serif italic text-4xl md:text-5xl text-earth-forest mb-8 tracking-[-0.02em] leading-[1.15]">
              Craft rooted in place and material.
            </h2>

            {loading ? (
              <div className="space-y-3">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-4 bg-earth-sand rounded animate-pulse" style={{ width: `${85 - i * 8}%` }} />
                ))}
              </div>
            ) : about?.bio ? (
              <PortableTextRenderer value={about.bio} />
            ) : (
              <p className="text-earth-forest/65 font-light leading-relaxed">
                Lauren Mercer is a maker working at the intersection of ceramics, textiles, and surface design. Her practice draws from natural materials, slow processes, and the textures of the land.
              </p>
            )}

            {/* Values */}
            {about?.values && about.values.length > 0 && (
              <div className="mt-10 grid grid-cols-3 gap-4">
                {about.values.map((v, i) => (
                  <div key={i} className="bg-earth-cream rounded-xl p-4 shadow-[0_2px_20px_rgba(28,46,36,0.06)]">
                    <span className="block text-xl mb-2">{v.icon}</span>
                    <span className="block text-xs font-medium text-earth-forest mb-1">{v.label}</span>
                    <span className="block text-xs text-earth-forest/50 leading-relaxed">{v.description}</span>
                  </div>
                ))}
              </div>
            )}

            <Link
              to="/about"
              className="inline-block mt-10 text-sm text-earth-terracotta underline underline-offset-4 hover:text-earth-terracotta-dark transition-colors duration-300"
            >
              Learn more →
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

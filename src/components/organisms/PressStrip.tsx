import { useSanity } from '@/hooks/useSanity'
import { allPressQuery } from '@/sanity/queries/press'
import { urlFor } from '@/sanity/lib/image'
import { useFadeIn } from '@/hooks/useFadeIn'
import type { PressItem } from '@/sanity/types'

export function PressStrip() {
  const { data: press, loading } = useSanity<PressItem[]>(allPressQuery)
  const sectionRef = useFadeIn<HTMLElement>()

  if (!loading && (!press || press.length === 0)) return null

  return (
    <section ref={sectionRef} className="fade-up py-16 bg-earth-cream border-y border-earth-sand">
      <div className="mx-auto max-w-[1120px] px-6">
        <p className="text-center text-xs tracking-[0.2em] text-earth-forest/40 mb-10 uppercase">
          as seen in
        </p>

        <div className="flex flex-wrap justify-center items-center gap-10 md:gap-16">
          {loading
            ? Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-8 w-24 bg-earth-sand rounded animate-pulse" />
              ))
            : press?.map((item) =>
                item.logo?.asset ? (
                  <a
                    key={item._id}
                    href={item.url ?? '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={item.publication}
                    className="block grayscale hover:grayscale-0 opacity-50 hover:opacity-100 transition-all duration-500"
                  >
                    <img
                      src={urlFor(item.logo).height(40).url()}
                      alt={item.logo.alt ?? item.publication}
                      className="h-8 object-contain"
                    />
                  </a>
                ) : (
                  <span
                    key={item._id}
                    className="text-sm font-medium text-earth-forest/30 hover:text-earth-forest/60 transition-colors duration-300"
                  >
                    {item.publication}
                  </span>
                )
              )}
        </div>
      </div>
    </section>
  )
}

import { useSanity } from '@/hooks/useSanity'
import { allPressQuery } from '@/sanity/queries/press'
import { urlFor } from '@/sanity/lib/image'
import { useFadeIn } from '@/hooks/useFadeIn'
import type { PressItem } from '@/sanity/types'

const MOCK_PRESS: PressItem[] = [
  { _id: 'mp1', publication: 'Kinfolk', headline: 'The quiet studio of Lauren Mercer', date: '2024-03' },
  { _id: 'mp2', publication: 'Cereal', headline: 'Earth, Form & the Slow Work', date: '2023-11' },
  { _id: 'mp3', publication: 'The Design Files', headline: 'Material Honesty', date: '2023-06' },
  { _id: 'mp4', publication: 'Vogue Living', headline: 'Studio Visit', date: '2022-09' },
]

export function PressStrip() {
  const { data: fetched, loading } = useSanity<PressItem[]>(allPressQuery)
  const press = (fetched && fetched.length > 0) ? fetched : (!loading ? MOCK_PRESS : null)
  const sectionRef = useFadeIn<HTMLElement>()

  if (!loading && !press) return null

  return (
    <section id="press" ref={sectionRef} className="fade-up py-16 bg-earth-cream border-y border-earth-sand">
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

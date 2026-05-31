import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useSanity } from '@/hooks/useSanity'
import { experienceBySlugQuery } from '@/sanity/queries/experience'
import { urlFor } from '@/sanity/lib/image'
import { Lightbox } from '@/components/molecules/Lightbox'
import type { Experience } from '@/sanity/types'

function BackToWork() {
  const navigate = useNavigate()
  function goBack() {
    if (window.history.length > 2) {
      navigate(-1)
    } else {
      sessionStorage.setItem('_pendingScroll', 'work')
      navigate('/')
    }
  }
  return (
    <button
      onClick={goBack}
      className="text-sm text-earth-sage hover:text-earth-forest transition-colors duration-300 mb-8 inline-block"
    >
      ← Back
    </button>
  )
}

const PICSUM_FALLBACK = (seed: string) =>
  `https://picsum.photos/seed/${seed}/900/600`

export function ExperienceDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const { data: exp, loading } = useSanity<Experience>(experienceBySlugQuery, { slug })
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  const allImages = exp
    ? [...(exp.coverImage ? [exp.coverImage] : []), ...(exp.gallery ?? [])]
    : []

  const closeLightbox = () => setLightboxIndex(null)
  const prevImage = () =>
    setLightboxIndex((i) => (i !== null ? (i - 1 + allImages.length) % allImages.length : null))
  const nextImage = () =>
    setLightboxIndex((i) => (i !== null ? (i + 1) % allImages.length : null))

  if (loading) {
    return (
      <main className="min-h-screen bg-earth-cream pt-16">
        <div className="h-[60vh] bg-earth-sand animate-pulse" />
        <div className="mx-auto max-w-280 px-6 py-16">
          <div className="h-12 w-2/3 bg-earth-sand rounded animate-pulse mb-8" />
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-48 bg-earth-sand rounded-xl animate-pulse" />
            ))}
          </div>
        </div>
      </main>
    )
  }

  if (!exp) {
    return (
      <main className="min-h-screen bg-earth-cream pt-24 flex items-center justify-center">
        <div className="text-center">
          <p className="text-earth-forest/40 mb-4">Project not found.</p>
          <BackToWork />
        </div>
      </main>
    )
  }

  const coverUrl = exp.coverImage?.asset
    ? urlFor(exp.coverImage).width(1920).height(1080).fit('crop').url()
    : PICSUM_FALLBACK(slug ?? 'default')

  return (
    <main className="min-h-screen bg-earth-cream">
      {/* Cover */}
      <div
        className="relative h-[55vh] overflow-hidden cursor-zoom-in"
        onClick={() => setLightboxIndex(0)}
      >
        <img
          src={coverUrl}
          alt={exp.coverImage?.alt ?? exp.title}
          className="w-full h-full object-cover"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-earth-forest/20" />
      </div>

      <div className="mx-auto max-w-280 px-6 py-16">
        <BackToWork />

        <h1 className="font-serif italic text-5xl md:text-6xl text-earth-forest tracking-[-0.02em] leading-[1.1] mb-4">
          {exp.title}
        </h1>

        {exp.description && (
          <p className="text-earth-forest/60 font-light text-lg leading-relaxed mb-12 max-w-xl">
            {exp.description}
          </p>
        )}

        <div className="grid md:grid-cols-[1fr_300px] gap-12 md:gap-16 items-start">
          {/* Gallery */}
          <div className="space-y-4">
            {exp.gallery && exp.gallery.length > 0 ? (
              exp.gallery.map((img, i) => {
                const galleryUrl = img.asset
                  ? urlFor(img).width(900).url()
                  : PICSUM_FALLBACK(String(i))
                return (
                  <button
                    key={i}
                    onClick={() => setLightboxIndex(i + 1)}
                    className="block w-full overflow-hidden rounded-xl cursor-zoom-in group"
                    aria-label={`View image ${i + 1} fullscreen`}
                  >
                    <img
                      src={galleryUrl}
                      alt={img.alt ?? `${exp.title} — image ${i + 1}`}
                      loading="lazy"
                      className="w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                    />
                  </button>
                )
              })
            ) : (
              <p className="text-earth-forest/30 text-sm">No gallery images.</p>
            )}
          </div>

          {/* Details */}
          <div className="md:sticky md:top-28">
            <dl className="divide-y divide-earth-sand">
              {[
                { label: 'Category', value: exp.category },
                { label: 'Studio', value: exp.studio },
                { label: 'Year', value: exp.year?.toString() },
                { label: 'Location', value: exp.location },
              ]
                .filter((row) => row.value)
                .map((row) => (
                  <div key={row.label} className="flex justify-between py-3 gap-4">
                    <dt className="text-xs text-earth-forest/40 font-medium uppercase tracking-widest shrink-0">
                      {row.label}
                    </dt>
                    <dd className="text-sm text-earth-forest text-right">{row.value}</dd>
                  </div>
                ))}
            </dl>

            {exp.externalUrl && (
              <a
                href={exp.externalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-8 inline-flex items-center gap-2 text-sm text-earth-terracotta hover:text-earth-forest transition-colors duration-300"
              >
                View external link →
              </a>
            )}
          </div>
        </div>
      </div>

      {lightboxIndex !== null && allImages.length > 0 && (
        <Lightbox
          images={allImages}
          index={lightboxIndex}
          onClose={closeLightbox}
          onPrev={prevImage}
          onNext={nextImage}
        />
      )}
    </main>
  )
}

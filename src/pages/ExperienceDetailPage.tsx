import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useSanity } from '@/hooks/useSanity'
import { experienceBySlugQuery } from '@/sanity/queries/experience'
import { urlFor } from '@/sanity/lib/image'
import { Lightbox } from '@/components/molecules/Lightbox'
import type { Experience } from '@/sanity/types'

const CATEGORY_LABEL: Record<string, string> = {
  work: 'Work Experience',
  freelance: 'Freelance',
  university: 'University',
}

// Picsum seeds per slug for consistent mock images
const PICSUM_SEEDS: Record<string, number[]> = {
  'notting-hill-townhouse':   [237, 338, 447, 554, 661, 772],
  'tribeca-loft-conversion':  [292, 345, 412, 521, 634, 789],
  'hampstead-family-home':    [669, 113, 228, 337, 446, 555],
  'boutique-hotel-suite':     [573, 274, 381, 490, 605, 714],
  'pied-a-terre-cannes':      [617, 199, 308, 417, 526, 635],
  'cotswold-retreat':         [399, 147, 256, 365, 474, 583],
  'vessel-and-void':          [835, 102, 203, 304, 405, 506],
  'surface-studies-florence': [167, 268, 369, 470, 571, 672],
  'natural-pigments-research':[432, 533, 634, 735, 836, 937],
}

function getPicsumUrl(slug: string, index: number, w = 900, h = 700): string {
  const seeds = PICSUM_SEEDS[slug]
  const seed = seeds ? seeds[index % seeds.length] : index * 73 + 42
  return `https://picsum.photos/seed/${seed}/${w}/${h}`
}

function splitTitle(title: string): [string, string] {
  const lastSpace = title.lastIndexOf(' ')
  if (lastSpace === -1) return ['', title]
  return [title.slice(0, lastSpace), title.slice(lastSpace + 1)]
}

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-white rounded-2xl px-5 py-4 border border-earth-sand flex flex-col gap-2">
      <span className="text-[10px] tracking-[0.18em] text-earth-forest/40 uppercase font-medium">
        {label}
      </span>
      <span className="font-serif italic text-xl md:text-2xl text-earth-forest leading-tight">
        {value}
      </span>
    </div>
  )
}

interface GalleryImageProps {
  src: string
  alt: string
  index: number
  total: number
  onClick: () => void
}

function GalleryImage({ src, alt, index, total, onClick }: GalleryImageProps) {
  return (
    <button
      onClick={onClick}
      className="relative aspect-square overflow-hidden rounded-xl bg-earth-sand group block w-full"
      aria-label={`View image ${index + 1} of ${total} fullscreen`}
    >
      <img
        src={src}
        alt={alt}
        loading="lazy"
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
      />
      <span className="absolute top-3 left-3 text-[10px] font-mono tracking-[0.15em] text-white/80 mix-blend-difference">
        {String(index + 1).padStart(2, '0')}/{String(total).padStart(2, '0')}
      </span>
    </button>
  )
}

export function ExperienceDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const { data: exp, loading } = useSanity<Experience>(experienceBySlugQuery, { slug })
  const navigate = useNavigate()
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  function goBack() {
    if (window.history.length > 2) {
      navigate(-1)
    } else {
      sessionStorage.setItem('_pendingScroll', 'work')
      navigate('/')
    }
  }

  // Build gallery image list — use Sanity assets when available, picsum as fallback
  const galleryImages: { src: string; alt: string }[] = (() => {
    if (!slug) return []
    const sanityImages = exp?.gallery ?? []
    const seeds = PICSUM_SEEDS[slug] ?? []
    const count = Math.max(sanityImages.length, seeds.length, 6)
    return Array.from({ length: count }).map((_, i) => {
      const si = sanityImages[i]
      return {
        src: si?.asset ? urlFor(si).width(900).height(700).fit('crop').url() : getPicsumUrl(slug, i),
        alt: si?.alt ?? `${exp?.title ?? 'Project'} — image ${i + 1}`,
      }
    })
  })()

  const closeLightbox = () => setLightboxIndex(null)
  const prevImage = () =>
    setLightboxIndex((i) => (i !== null ? (i - 1 + galleryImages.length) % galleryImages.length : null))
  const nextImage = () =>
    setLightboxIndex((i) => (i !== null ? (i + 1) % galleryImages.length : null))

  const [titleMain, titleAccent] = splitTitle(exp?.title ?? '')
  const categoryLabel = CATEGORY_LABEL[exp?.category ?? ''] ?? exp?.category ?? ''

  if (loading) {
    return (
      <main className="min-h-screen bg-earth-cream pt-16 md:pt-20">
        <div className="h-14 border-b border-earth-sand bg-earth-cream animate-pulse" />
        <div className="mx-auto max-w-280 px-6 py-16 grid md:grid-cols-[3fr_2fr] gap-12">
          <div className="space-y-6">
            <div className="h-4 w-32 bg-earth-sand rounded animate-pulse" />
            <div className="h-20 w-full bg-earth-sand rounded animate-pulse" />
            <div className="h-32 bg-earth-sand rounded animate-pulse" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-earth-sand rounded-2xl animate-pulse" />
            ))}
          </div>
        </div>
      </main>
    )
  }

  if (!exp) {
    return (
      <main className="min-h-screen bg-earth-cream pt-16 md:pt-20 flex items-center justify-center">
        <div className="text-center">
          <p className="text-earth-forest/40 mb-4">Project not found.</p>
          <button onClick={goBack} className="text-sm text-earth-sage hover:text-earth-forest transition-colors">
            ← Back
          </button>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-earth-cream pt-16 md:pt-20">

      {/* ── Sticky secondary bar ── */}
      <div className="sticky top-16 md:top-20 z-30 bg-earth-cream/95 backdrop-blur-sm border-b border-earth-sand/70">
        <div className="mx-auto max-w-280 px-6 h-14 flex items-center justify-between">
          <button
            onClick={goBack}
            className="flex items-center gap-2 bg-earth-forest text-earth-cream text-xs font-medium px-5 py-2.5 rounded-full hover:bg-earth-terracotta transition-colors duration-300"
          >
            ← Back to projects
          </button>

          <div className="flex items-center gap-3">
            {exp?.projectPdf?.asset?.url && (
              <a
                href={exp.projectPdf.asset.url}
                download
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 border border-earth-forest/20 text-earth-forest text-xs font-medium px-5 py-2.5 rounded-full hover:bg-earth-forest hover:text-earth-cream transition-colors duration-300"
                onClick={(e) => e.stopPropagation()}
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5 5-5M12 15V3" />
                </svg>
                Download PDF
              </a>
            )}
            <div className="text-right">
              <p className="text-[10px] tracking-[0.18em] text-earth-terracotta uppercase font-medium leading-none mb-1">
                {categoryLabel}
              </p>
              <p className="text-[10px] tracking-[0.12em] text-earth-forest/40 uppercase leading-none">
                {[exp.studio, exp.year].filter(Boolean).join(' · ')}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Main content ── */}
      <div className="mx-auto max-w-280 px-6 pt-14 pb-10">
        <div className="grid md:grid-cols-[3fr_2fr] gap-10 md:gap-16 items-start">

          {/* Left: title + description */}
          <div>
            <p className="text-[10px] tracking-[0.18em] text-earth-terracotta uppercase font-medium mb-5">
              — {categoryLabel}
            </p>

            <h1 className="font-serif leading-none tracking-[-0.02em] mb-4"
              style={{ fontSize: 'clamp(2.8rem, 5.5vw, 5rem)' }}
            >
              <span className="block text-earth-forest">{titleMain}</span>
              <span className="block italic text-earth-terracotta">{titleAccent}</span>
            </h1>

            {(exp.studio || exp.role) && (
              <p className="font-serif italic text-earth-forest/45 text-lg mb-8">
                {[exp.studio, exp.role].filter(Boolean).join(', ')}
              </p>
            )}

            {exp.description && (
              <p className="text-earth-forest/65 font-light leading-relaxed text-base md:text-[1.05rem] max-w-lg">
                {exp.description}
              </p>
            )}
          </div>

          {/* Right: info cards + materials */}
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-3">
              {exp.year && <InfoCard label="Year" value={String(exp.year)} />}
              {exp.location && <InfoCard label="Where" value={exp.location} />}
              {exp.footprint && <InfoCard label="Footprint" value={exp.footprint} />}
              <InfoCard
                label="Photos"
                value={`${galleryImages.length} image${galleryImages.length !== 1 ? 's' : ''}`}
              />
            </div>

            {exp.materials && exp.materials.length > 0 && (
              <div>
                <p className="text-[10px] tracking-[0.18em] text-earth-forest/40 uppercase font-medium mb-3">
                  — Materials
                </p>
                <div className="flex flex-wrap gap-2">
                  {exp.materials.map((m) => (
                    <span
                      key={m}
                      className="px-3.5 py-1.5 rounded-full border border-earth-forest/15 text-xs text-earth-forest/60 font-medium"
                    >
                      {m}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Gallery ── */}
      {galleryImages.length > 0 && (
        <div className="border-t border-earth-sand mt-4">
          <div className="mx-auto max-w-280 px-6 pt-12 pb-20">
            <div className="flex items-baseline justify-between mb-8">
              <h2 className="font-serif text-2xl md:text-3xl text-earth-forest">
                Project <span className="italic text-earth-terracotta">gallery</span>
              </h2>
              <span className="text-[10px] tracking-[0.18em] text-earth-forest/35 uppercase hidden md:block">
                {galleryImages.length} image{galleryImages.length !== 1 ? 's' : ''} · tap to enlarge
              </span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
              {galleryImages.map((img, i) => (
                <GalleryImage
                  key={i}
                  src={img.src}
                  alt={img.alt}
                  index={i}
                  total={galleryImages.length}
                  onClick={() => setLightboxIndex(i)}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {lightboxIndex !== null && galleryImages.length > 0 && (
        <Lightbox
          images={galleryImages}
          index={lightboxIndex}
          onClose={closeLightbox}
          onPrev={prevImage}
          onNext={nextImage}
        />
      )}
    </main>
  )
}

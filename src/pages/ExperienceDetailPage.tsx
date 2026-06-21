import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useSanity } from '@/hooks/useSanity'
import { experienceBySlugQuery, allExperiencesQuery } from '@/sanity/queries/experience'
import { urlFor } from '@/sanity/lib/image'
import { Lightbox } from '@/components/molecules/Lightbox'
import { useFadeIn } from '@/hooks/useFadeIn'
import type { Experience } from '@/sanity/types'


const PICSUM_SEEDS: Record<string, number[]> = {
  'notting-hill-townhouse': [237, 338, 447, 554, 661, 772],
  'tribeca-loft-conversion': [292, 345, 412, 521, 634, 789],
  'hampstead-family-home': [669, 113, 228, 337, 446, 555],
  'boutique-hotel-suite': [573, 274, 381, 490, 605, 714],
  'pied-a-terre-cannes': [617, 199, 308, 417, 526, 635],
  'cotswold-retreat': [399, 147, 256, 365, 474, 583],
  'vessel-and-void': [835, 102, 203, 304, 405, 506],
  'surface-studies-florence': [167, 268, 369, 470, 571, 672],
  'natural-pigments-research': [432, 533, 634, 735, 836, 937],
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

/* ── Screen-only components ─────────────────────────────────────────────────── */

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-white rounded-2xl px-5 py-4 border border-earth-sand flex flex-col gap-2">
      <span className="text-[10px] tracking-[0.18em] text-grey-light uppercase font-medium">{label}</span>
      <span className="font-serif italic text-xl md:text-2xl text-earth-forest leading-tight">{value}</span>
    </div>
  )
}

function GalleryImage({ src, alt, caption, index, total, onClick }: {
  src: string; alt: string; caption?: string; index: number; total: number; onClick: () => void
}) {
  return (
    <figure className="group">
      <button
        onClick={onClick}
        className="relative aspect-square overflow-hidden rounded-xl bg-earth-sand block w-full"
        aria-label={`View image ${index + 1} of ${total} fullscreen`}
      >
        <img
          src={src}
          alt={alt}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
        />
      </button>
      {/* Editorial label — figure index + optional caption, always visible */}
      <figcaption className="mt-2.5 flex gap-2.5">
        <span className="shrink-0 pt-px text-[10px] font-mono tracking-[0.15em] text-grey-light tabular-nums">
          {String(index + 1).padStart(2, '0')}
        </span>
        {caption && (
          <span className="text-xs text-grey-mid font-light leading-snug line-clamp-2">
            {caption}
          </span>
        )}
      </figcaption>
    </figure>
  )
}

/* ── Icons ──────────────────────────────────────────────────────────────────── */

function DownloadIcon() {
  return (
    <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5 5-5M12 15V3" />
    </svg>
  )
}

/* ── Page ────────────────────────────────────────────────────────────────────── */

export function ExperienceDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const { data: exp, loading } = useSanity<Experience>(experienceBySlugQuery, { slug })
  const { data: allExps } = useSanity<Experience[]>(allExperiencesQuery)
  const navigate = useNavigate()
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
  const [pdfBusy, setPdfBusy] = useState(false)

  // Sliding to another project keeps this component mounted — reset scroll
  // to the top so each project starts at its header, not mid-page.
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [slug])

  // Animation refs for premium scroll reveal
  const contentRef = useFadeIn<HTMLDivElement>()
  const galleryRef = useFadeIn<HTMLDivElement>()
  const navRef = useFadeIn<HTMLDivElement>()

  function goBack() {
    if (window.history.length > 2) {
      navigate(-1)
    } else {
      sessionStorage.setItem('_pendingScroll', 'work')
      navigate('/')
    }
  }

  const galleryImages: { src: string; alt: string; caption?: string }[] = (() => {
    if (!slug) return []
    const sanityImages = exp?.gallery?.filter((img) => img?.asset) ?? []
    
    if (sanityImages.length > 0) {
      return sanityImages.map((si, i) => ({
        src: urlFor(si).width(900).height(700).fit('crop').url(),
        alt: si.alt ?? `${exp?.title ?? 'Project'} — image ${i + 1}`,
        caption: si.caption,
      }))
    } else {
      const seeds = PICSUM_SEEDS[slug] ?? []
      const count = Math.max(seeds.length, 6)
      return Array.from({ length: count }).map((_, i) => ({
        src: getPicsumUrl(slug, i),
        alt: `${exp?.title ?? 'Project'} — image ${i + 1}`,
        caption: undefined,
      }))
    }
  })()


  // Find next/prev projects based on all experiences list
  const currentIdx = allExps ? allExps.findIndex((e) => e.slug.current === slug) : -1
  const prevExp = currentIdx > 0 ? allExps?.[currentIdx - 1] : null
  const nextExp = currentIdx >= 0 && currentIdx < (allExps?.length ?? 0) - 1 ? allExps?.[currentIdx + 1] : null

  const closeLightbox = () => setLightboxIndex(null)
  const prevImage = () =>
    setLightboxIndex((i) => (i !== null ? (i - 1 + galleryImages.length) % galleryImages.length : null))
  const nextImage = () =>
    setLightboxIndex((i) => (i !== null ? (i + 1) % galleryImages.length : null))

  const [titleMain, titleAccent] = splitTitle(exp?.title ?? '')
  const categoryLabel = exp?.category
    ? `${exp.category.label} ${exp.category.accentLabel}`.trim()
    : ''
  const hasSanityPdf = Boolean(exp?.projectPdf?.asset?.url)

  async function handleGeneratePdf() {
    if (!exp || pdfBusy) return
    setPdfBusy(true)
    try {
      // react-pdf expects Node's Buffer global, which the browser lacks.
      // Polyfill it before the engine loads. Kept in this lazy path so it
      // never touches the main bundle.
      const { Buffer } = await import('buffer')
      ;(globalThis as typeof globalThis & { Buffer?: unknown }).Buffer ??= Buffer

      // Lazy-load the PDF engine (~1MB) only when actually requested,
      // so it never weighs on initial page load.
      const [{ pdf }, { ProjectPdfDocument }] = await Promise.all([
        import('@react-pdf/renderer'),
        import('@/components/pdf/ProjectPdfDocument'),
      ])
      const blob = await pdf(
        <ProjectPdfDocument
          titleMain={titleMain}
          titleAccent={titleAccent}
          categoryLabel={categoryLabel}
          studio={exp.studio}
          role={exp.role}
          year={exp.year}
          location={exp.location}
          footprint={exp.footprint}
          materials={exp.materials}
          description={exp.description}
          images={galleryImages}
        />
      ).toBlob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `Lauren-Khafaji-${exp.slug.current}.pdf`
      document.body.appendChild(a)
      a.click()
      a.remove()
      URL.revokeObjectURL(url)
    } catch (err) {
      console.error('PDF generation failed', err)
    } finally {
      setPdfBusy(false)
    }
  }

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
          <p className="text-grey-light mb-4">Project not found.</p>
          <button onClick={goBack} className="text-sm text-grey-light hover:text-earth-forest transition-colors">
            ← Back
          </button>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-earth-cream pt-16 md:pt-20 print:pt-0 print:min-h-0 print:bg-white">

      {/* ══════════════════════════════════════════════
          SCREEN LAYOUT — hidden entirely during print
          ══════════════════════════════════════════════ */}
      <div className="screen-only">

        {/* Sticky secondary bar */}
        <div className="sticky top-16 md:top-20 z-30 bg-earth-cream/95 backdrop-blur-sm border-b border-earth-sand/70">
          <div className="mx-auto max-w-280 px-6 py-3 sm:py-0 min-h-14 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:h-14">
            <button
              onClick={goBack}
              className="flex w-full sm:w-auto items-center justify-center gap-2 bg-earth-forest text-earth-cream text-xs font-medium px-5 py-2.5 rounded-full hover:bg-earth-terracotta transition-colors duration-300"
            >
              ← Back to projects
            </button>

            <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
              <div className="text-left sm:text-right hidden sm:block">
                <p className="text-[10px] tracking-[0.18em] text-earth-terracotta uppercase font-medium leading-none mb-1">
                  {categoryLabel}
                </p>
                <p className="text-[10px] tracking-[0.12em] text-grey-light uppercase leading-none">
                  {[exp.studio, exp.year].filter(Boolean).join(' · ')}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div ref={contentRef} className="fade-up mx-auto max-w-280 px-6 pt-10 pb-10">
          <div className="grid md:grid-cols-[3fr_2fr] gap-10 md:gap-16 items-start">
            <div>
              <p className="text-[10px] tracking-[0.18em] text-earth-terracotta uppercase font-medium mb-5">
                — {categoryLabel}
              </p>
              <div className="flex flex-col gap-4 md:gap-6 mb-6">
                <h1
                  className="font-serif leading-tight tracking-[-0.02em]"
                  style={{ fontSize: 'clamp(2.8rem, 5.5vw, 5rem)' }}
                >
                  <span className="text-earth-forest">{titleMain} </span>
                  <span className="italic text-earth-terracotta">{titleAccent}</span>
                </h1>
                
                <div className="shrink-0 flex">
                  {hasSanityPdf ? (
                    <a
                      href={exp.projectPdf!.asset.url}
                      download
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex w-fit items-center justify-center gap-2 border border-earth-forest/20 text-earth-forest text-xs font-medium px-5 py-2.5 rounded-full hover:bg-earth-forest hover:text-earth-cream transition-colors duration-300"
                    >
                      <DownloadIcon />
                      Download PDF
                    </a>
                  ) : (
                    <button
                      onClick={handleGeneratePdf}
                      disabled={pdfBusy}
                      className="inline-flex w-fit items-center justify-center gap-2 border border-earth-forest/20 text-earth-forest text-xs font-medium px-5 py-2.5 rounded-full hover:bg-earth-forest hover:text-earth-cream transition-colors duration-300 disabled:opacity-50 disabled:cursor-wait"
                    >
                      <DownloadIcon />
                      {pdfBusy ? 'Generating…' : 'Download PDF'}
                    </button>
                  )}
                </div>
              </div>
              {(exp.studio || exp.role) && (
                <p className="font-serif italic text-grey-mid text-lg mb-8">
                  {[exp.studio, exp.role].filter(Boolean).join(', ')}
                </p>
              )}
              {exp.description && (
                <p className="text-earth-forest font-light leading-relaxed text-base md:text-[1.05rem] max-w-lg">
                  {exp.description}
                </p>
              )}
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-3">
                {exp.year && <InfoCard label="Year" value={String(exp.year)} />}
                {exp.location && <InfoCard label="Where" value={exp.location} />}
                {exp.footprint && <InfoCard label="Footprint" value={exp.footprint} />}
                <InfoCard label="Photos" value={`${galleryImages.length} image${galleryImages.length !== 1 ? 's' : ''}`} />
              </div>
              {exp.materials && exp.materials.length > 0 && (
                <div>
                  <p className="text-[10px] tracking-[0.18em] text-grey-light uppercase font-medium mb-3">
                    — Materials
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {exp.materials.map((m) => (
                      <span key={m} className="px-3.5 py-1.5 rounded-full border border-earth-forest/15 text-xs text-grey-mid font-medium">
                        {m}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Gallery */}
        {galleryImages.length > 0 && (
          <div ref={galleryRef} className="fade-up border-t border-earth-sand mt-4">
            <div className="mx-auto max-w-280 px-6 pt-12 pb-20">
              <div className="flex items-baseline justify-between mb-8">
                <h2 className="font-serif text-2xl md:text-3xl text-earth-forest">
                  Project <span className="italic text-earth-terracotta">gallery</span>
                </h2>
                <span className="text-[10px] tracking-[0.18em] text-grey-light uppercase hidden md:block">
                  {galleryImages.length} image{galleryImages.length !== 1 ? 's' : ''} · tap to enlarge
                </span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
                {galleryImages.map((img, i) => (
                  <GalleryImage
                    key={i}
                    src={img.src}
                    alt={img.alt}
                    caption={img.caption}
                    index={i}
                    total={galleryImages.length}
                    onClick={() => setLightboxIndex(i)}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Project to Project Navigation */}
        <div ref={navRef} className="fade-up border-t border-earth-sand bg-earth-cream/40">
          <div className="mx-auto max-w-280 px-6 py-16">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 items-center border-b border-earth-sand/50 pb-8 sm:border-none sm:pb-0">
              {/* Previous Project */}
              <div className="flex flex-col items-start w-full">
                {prevExp ? (
                  <Link
                    to={`/experience/${prevExp.slug.current}`}
                    className="group flex items-center gap-4 w-full text-left"
                  >
                    <div className="shrink-0 w-24 h-16 rounded-xl overflow-hidden bg-earth-sand border border-earth-sand shadow-[0_1px_6px_rgba(26,26,26,0.03)]">
                      <img
                        src={prevExp.coverImage?.asset
                          ? urlFor(prevExp.coverImage).width(150).height(100).fit('crop').url()
                          : `https://picsum.photos/seed/${prevExp.title.length * 13}/150/100`}
                        alt={prevExp.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.05]"
                      />
                    </div>
                    <div className="min-w-0">
                      <span className="text-[10px] tracking-[0.18em] text-grey-light uppercase font-medium block mb-1">
                        ← Previous Project
                      </span>
                      <h4 className="font-serif text-lg text-earth-forest truncate group-hover:text-earth-terracotta transition-colors duration-300">
                        {prevExp.title}
                      </h4>
                    </div>
                  </Link>
                ) : (
                  <span className="text-grey-light/60 text-[10px] tracking-[0.18em] uppercase font-medium">First Project</span>
                )}
              </div>

              {/* Next Project */}
              <div className="flex flex-col items-end text-right w-full">
                {nextExp ? (
                  <Link
                    to={`/experience/${nextExp.slug.current}`}
                    className="group flex items-center justify-end gap-4 w-full text-right"
                  >
                    <div className="min-w-0">
                      <span className="text-[10px] tracking-[0.18em] text-grey-light uppercase font-medium block mb-1">
                        Next Project →
                      </span>
                      <h4 className="font-serif text-lg text-earth-forest truncate group-hover:text-earth-terracotta transition-colors duration-300">
                        {nextExp.title}
                      </h4>
                    </div>
                    <div className="shrink-0 w-24 h-16 rounded-xl overflow-hidden bg-earth-sand border border-earth-sand shadow-[0_1px_6px_rgba(26,26,26,0.03)]">
                      <img
                        src={nextExp.coverImage?.asset
                          ? urlFor(nextExp.coverImage).width(150).height(100).fit('crop').url()
                          : `https://picsum.photos/seed/${nextExp.title.length * 13}/150/100`}
                        alt={nextExp.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.05]"
                      />
                    </div>
                  </Link>
                ) : (
                  <span className="text-grey-light/60 text-[10px] tracking-[0.18em] uppercase font-medium">Last Project</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Lightbox */}
        {lightboxIndex !== null && galleryImages.length > 0 && (
          <Lightbox
            images={galleryImages}
            index={lightboxIndex}
            onClose={closeLightbox}
            onPrev={prevImage}
            onNext={nextImage}
          />
        )}
      </div>

      {/* ══════════════════════════════════════════════
          PRINT LAYOUT — hidden on screen, shown in print
          Clean, self-contained, no CSS tricks needed
          ══════════════════════════════════════════════ */}
      <div className="print-only print-layout">

        {/* Project header */}
        <div className="print-header">
          <p className="print-eyebrow">
            {[categoryLabel, exp.studio, exp.year, exp.location].filter(Boolean).join(' · ')}
          </p>
          <h1 className="print-title">
            {titleMain && <span>{titleMain} </span>}
            <em>{titleAccent}</em>
          </h1>
          {(exp.studio || exp.role) && (
            <p className="print-subtitle">
              {[exp.studio, exp.role].filter(Boolean).join(', ')}
            </p>
          )}
        </div>

        {/* Description + meta */}
        <div className="print-body">
          {exp.description && (
            <p className="print-description">{exp.description}</p>
          )}

          <div className="print-meta">
            {exp.year && (
              <div className="print-meta-item">
                <span className="print-meta-label">Year</span>
                <span className="print-meta-value">{exp.year}</span>
              </div>
            )}
            {exp.location && (
              <div className="print-meta-item">
                <span className="print-meta-label">Location</span>
                <span className="print-meta-value">{exp.location}</span>
              </div>
            )}
            {exp.footprint && (
              <div className="print-meta-item">
                <span className="print-meta-label">Footprint</span>
                <span className="print-meta-value">{exp.footprint}</span>
              </div>
            )}
            {exp.materials && exp.materials.length > 0 && (
              <div className="print-meta-item print-meta-full">
                <span className="print-meta-label">Materials</span>
                <span className="print-meta-value">{exp.materials.join(' · ')}</span>
              </div>
            )}
          </div>
        </div>

        {/* Gallery */}
        {galleryImages.length > 0 && (
          <div className="print-gallery-section">
            <div className="print-gallery-header">
              <h2 className="print-gallery-title">Project <em>gallery</em></h2>
              <span className="print-gallery-count">{galleryImages.length} images</span>
            </div>
            <div className="print-gallery-grid">
              {galleryImages.map((img, i) => (
                <div key={i} className="print-gallery-item">
                  <img src={img.src} alt={img.alt} loading="eager" />
                  {img.caption && (
                    <p className="print-gallery-caption">{img.caption}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Single-line print footer */}
        <div className="print-footer-line">
          <span>Lauren Khafaji</span>
          <span className="print-footer-dot">·</span>
          <span>{exp.title}</span>
          <span className="print-footer-dot">·</span>
          <span>{categoryLabel}</span>
          {exp.year && <><span className="print-footer-dot">·</span><span>{exp.year}</span></>}
        </div>
      </div>
    </main>
  )
}

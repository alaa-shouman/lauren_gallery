import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useSanity } from '@/hooks/useSanity'
import { projectBySlugQuery } from '@/sanity/queries/project'
import { urlFor } from '@/sanity/lib/image'
import { PortableTextRenderer } from '@/components/molecules/PortableTextRenderer'
import { Lightbox } from '@/components/molecules/Lightbox'
import type { Project } from '@/sanity/types'

export function ProjectDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const { data: project, loading } = useSanity<Project>(projectBySlugQuery, { slug })
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  const allImages = project
    ? [project.coverImage, ...(project.gallery ?? [])].filter(Boolean)
    : []

  const openLightbox = (i: number) => setLightboxIndex(i)
  const closeLightbox = () => setLightboxIndex(null)
  const prevImage = () =>
    setLightboxIndex((i) => (i !== null ? (i - 1 + allImages.length) % allImages.length : null))
  const nextImage = () =>
    setLightboxIndex((i) => (i !== null ? (i + 1) % allImages.length : null))

  if (loading) {
    return (
      <main className="min-h-screen bg-earth-cream pt-16">
        <div className="h-[60vh] bg-earth-sand animate-pulse" />
        <div className="mx-auto max-w-[1120px] px-6 py-16">
          <div className="h-12 w-2/3 bg-earth-sand rounded animate-pulse mb-8" />
          <div className="grid md:grid-cols-2 gap-12">
            <div className="space-y-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-48 bg-earth-sand rounded-xl animate-pulse" />
              ))}
            </div>
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-4 bg-earth-sand rounded animate-pulse" style={{ width: `${80 - i * 10}%` }} />
              ))}
            </div>
          </div>
        </div>
      </main>
    )
  }

  if (!project) {
    return (
      <main className="min-h-screen bg-earth-cream pt-24 flex items-center justify-center">
        <div className="text-center">
          <p className="text-earth-forest/40 mb-4">Project not found.</p>
          <Link to="/work" className="text-earth-terracotta underline underline-offset-4 text-sm">
            ← Back to work
          </Link>
        </div>
      </main>
    )
  }

  const coverUrl = project.coverImage?.asset
    ? urlFor(project.coverImage).width(1920).height(1080).fit('crop').url()
    : null

  return (
    <main className="min-h-screen bg-earth-cream">
      {/* Cover image */}
      {coverUrl && (
        <div
          className="relative h-[60vh] overflow-hidden cursor-zoom-in"
          onClick={() => openLightbox(0)}
        >
          <img
            src={coverUrl}
            alt={project.coverImage.alt ?? project.title}
            className="w-full h-full object-cover"
            loading="eager"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-earth-forest/20" />
        </div>
      )}

      <div className="mx-auto max-w-[1120px] px-6 py-16">
        {/* Back link */}
        <Link
          to="/work"
          className="text-sm text-earth-sage hover:text-earth-forest transition-colors duration-300 mb-8 inline-block"
        >
          ← Back to work
        </Link>

        {/* Title */}
        <h1 className="font-serif italic text-5xl md:text-6xl text-earth-forest tracking-[-0.02em] leading-[1.1] mb-12">
          {project.title}
        </h1>

        <div className="grid md:grid-cols-[1fr_340px] gap-12 md:gap-16 items-start">
          {/* Gallery strip */}
          <div className="space-y-4">
            {project.gallery && project.gallery.length > 0 ? (
              project.gallery.map((img, i) => {
                const galleryUrl = img.asset
                  ? urlFor(img).width(900).url()
                  : null
                return galleryUrl ? (
                  <button
                    key={i}
                    onClick={() => openLightbox(i + 1)}
                    className="block w-full overflow-hidden rounded-xl cursor-zoom-in group"
                    aria-label={`View ${img.alt ?? `image ${i + 1}`} fullscreen`}
                  >
                    <img
                      src={galleryUrl}
                      alt={img.alt ?? `${project.title} — image ${i + 1}`}
                      loading="lazy"
                      className="w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                    />
                  </button>
                ) : null
              })
            ) : (
              <p className="text-earth-forest/30 text-sm">No gallery images.</p>
            )}
          </div>

          {/* Sticky details */}
          <div className="md:sticky md:top-28">
            <dl className="divide-y divide-earth-sand mb-8">
              {[
                { label: 'Category', value: project.category },
                { label: 'Year', value: project.year?.toString() },
                { label: 'Dimensions', value: project.dimensions },
                { label: 'Materials', value: project.materials?.join(', ') },
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

            {project.description && (
              <PortableTextRenderer value={project.description} />
            )}
          </div>
        </div>
      </div>

      {/* Lightbox */}
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

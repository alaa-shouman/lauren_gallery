import { useEffect, useCallback } from 'react'
import { urlFor } from '@/sanity/lib/image'
import type { SanityImage } from '@/sanity/types'

interface LightboxProps {
  images: SanityImage[]
  index: number
  onClose: () => void
  onPrev: () => void
  onNext: () => void
}

export function Lightbox({ images, index, onClose, onPrev, onNext }: LightboxProps) {
  const image = images[index]

  const handleKey = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft') onPrev()
      if (e.key === 'ArrowRight') onNext()
    },
    [onClose, onPrev, onNext]
  )

  useEffect(() => {
    document.addEventListener('keydown', handleKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handleKey)
      document.body.style.overflow = ''
    }
  }, [handleKey])

  if (!image?.asset) return null

  return (
    <dialog
      open
      className="fixed inset-0 z-[100] m-0 max-w-none w-full h-full bg-earth-forest/95 backdrop-blur-sm flex items-center justify-center p-4 md:p-8"
      onClick={onClose}
      aria-modal="true"
      aria-label="Image lightbox"
    >
      <div className="relative max-w-5xl w-full" onClick={(e) => e.stopPropagation()}>
        <img
          src={urlFor(image).width(1600).url()}
          alt={image.alt ?? `Gallery image ${index + 1}`}
          className="w-full max-h-[80vh] object-contain rounded-xl"
        />

        {image.alt && (
          <p className="mt-4 text-center text-sm text-earth-cream/50">{image.alt}</p>
        )}

        {/* Counter */}
        <p className="absolute top-4 left-1/2 -translate-x-1/2 text-xs text-earth-cream/40 tracking-widest">
          {index + 1} / {images.length}
        </p>
      </div>

      {/* Close */}
      <button
        onClick={onClose}
        aria-label="Close lightbox"
        className="absolute top-5 right-5 text-earth-cream/60 hover:text-earth-cream transition-colors duration-300"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {/* Prev */}
      {images.length > 1 && (
        <>
          <button
            onClick={(e) => { e.stopPropagation(); onPrev() }}
            aria-label="Previous image"
            className="absolute left-4 top-1/2 -translate-y-1/2 text-earth-cream/60 hover:text-earth-cream transition-colors duration-300 p-2"
          >
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onNext() }}
            aria-label="Next image"
            className="absolute right-4 top-1/2 -translate-y-1/2 text-earth-cream/60 hover:text-earth-cream transition-colors duration-300 p-2"
          >
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </>
      )}
    </dialog>
  )
}

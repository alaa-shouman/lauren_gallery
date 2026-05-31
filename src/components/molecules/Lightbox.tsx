import { useEffect, useCallback, useState, useRef } from 'react'

interface LightboxImage {
  src: string
  alt: string
}

interface LightboxProps {
  images: LightboxImage[]
  index: number
  onClose: () => void
  onPrev: () => void
  onNext: () => void
}

const MIN_SCALE = 1
const MAX_SCALE = 4
const ZOOM_STEP = 0.5

export function Lightbox({ images, index, onClose, onPrev, onNext }: LightboxProps) {
  const image = images[index]
  const [scale, setScale] = useState(1)
  const imgRef = useRef<HTMLImageElement>(null)

  const resetZoom = useCallback(() => setScale(1), [])

  const zoomIn = useCallback(
    () => setScale((s) => Math.min(s + ZOOM_STEP, MAX_SCALE)),
    []
  )
  const zoomOut = useCallback(
    () => setScale((s) => Math.max(s - ZOOM_STEP, MIN_SCALE)),
    []
  )

  // Reset zoom when image changes
  useEffect(() => { setScale(1) }, [index])

  const handleKey = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft') { resetZoom(); onPrev() }
      if (e.key === 'ArrowRight') { resetZoom(); onNext() }
      if (e.key === '+' || e.key === '=') zoomIn()
      if (e.key === '-') zoomOut()
    },
    [onClose, onPrev, onNext, resetZoom, zoomIn, zoomOut]
  )

  const handleWheel = useCallback(
    (e: WheelEvent) => {
      e.preventDefault()
      setScale((s) => {
        const delta = e.deltaY < 0 ? ZOOM_STEP : -ZOOM_STEP
        return Math.min(MAX_SCALE, Math.max(MIN_SCALE, s + delta))
      })
    },
    []
  )

  useEffect(() => {
    document.addEventListener('keydown', handleKey)
    document.body.style.overflow = 'hidden'
    const el = imgRef.current
    if (el) el.addEventListener('wheel', handleWheel, { passive: false })
    return () => {
      document.removeEventListener('keydown', handleKey)
      document.body.style.overflow = ''
      if (el) el.removeEventListener('wheel', handleWheel)
    }
  }, [handleKey, handleWheel])

  if (!image) return null

  const isZoomed = scale > 1

  return (
    <dialog
      open
      className="fixed inset-0 z-100 m-0 max-w-none w-full h-full bg-earth-forest/95 backdrop-blur-sm flex items-center justify-center p-4 md:p-8"
      onClick={() => { if (!isZoomed) onClose() }}
      aria-modal="true"
      aria-label="Image lightbox"
    >
      {/* Image container */}
      <div
        className="relative max-w-5xl w-full flex items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          ref={imgRef}
          src={image.src}
          alt={image.alt}
          className="max-h-[80vh] object-contain rounded-xl select-none"
          style={{
            transform: `scale(${scale})`,
            transition: 'transform 0.2s ease',
            cursor: isZoomed ? 'zoom-out' : 'default',
            maxWidth: '100%',
          }}
          draggable={false}
          onClick={isZoomed ? resetZoom : undefined}
        />

        {image.alt && !isZoomed && (
          <p className="absolute -bottom-8 left-0 right-0 text-center text-sm text-earth-cream/50">
            {image.alt}
          </p>
        )}
      </div>

      {/* Counter */}
      <p className="absolute top-5 left-1/2 -translate-x-1/2 text-xs text-earth-cream/40 tracking-widest pointer-events-none">
        {index + 1} / {images.length}
      </p>

      {/* Close */}
      <button
        onClick={onClose}
        aria-label="Close lightbox"
        className="absolute top-5 right-5 text-earth-cream/60 hover:text-earth-cream transition-colors duration-200 p-1"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {/* Zoom controls */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex items-center gap-1 bg-earth-forest/60 rounded-full px-3 py-1.5 backdrop-blur-sm">
        <button
          onClick={(e) => { e.stopPropagation(); zoomOut() }}
          disabled={scale <= MIN_SCALE}
          aria-label="Zoom out"
          className="w-7 h-7 flex items-center justify-center text-earth-cream/70 hover:text-earth-cream disabled:opacity-30 transition-colors duration-200"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0zM8 11h6" />
          </svg>
        </button>
        <span className="text-[10px] text-earth-cream/50 tabular-nums w-8 text-center">
          {Math.round(scale * 100)}%
        </span>
        <button
          onClick={(e) => { e.stopPropagation(); zoomIn() }}
          disabled={scale >= MAX_SCALE}
          aria-label="Zoom in"
          className="w-7 h-7 flex items-center justify-center text-earth-cream/70 hover:text-earth-cream disabled:opacity-30 transition-colors duration-200"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0zM11 8v6M8 11h6" />
          </svg>
        </button>
      </div>

      {/* Prev / Next */}
      {images.length > 1 && (
        <>
          <button
            onClick={(e) => { e.stopPropagation(); resetZoom(); onPrev() }}
            aria-label="Previous image"
            className="absolute left-3 top-1/2 -translate-y-1/2 text-earth-cream/60 hover:text-earth-cream transition-colors duration-200 p-3"
          >
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); resetZoom(); onNext() }}
            aria-label="Next image"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-earth-cream/60 hover:text-earth-cream transition-colors duration-200 p-3"
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

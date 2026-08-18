import { useEffect, useCallback, useState, useRef } from 'react'
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch'
import type { ReactZoomPanPinchContentRef } from 'react-zoom-pan-pinch'

interface LightboxImage {
  src: string
  alt: string
  caption?: string
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

export function Lightbox({ images, index, onClose, onPrev, onNext }: LightboxProps) {
  const image = images[index]
  const [scale, setScale] = useState(1)
  const transformRef = useRef<ReactZoomPanPinchContentRef>(null)

  const zoomIn = useCallback(() => transformRef.current?.zoomIn(), [])
  const zoomOut = useCallback(() => transformRef.current?.zoomOut(), [])

  // Changing image remounts TransformWrapper via key={index}; mirror that by
  // resetting the tracked scale during render (React's adjust-state-on-prop-change pattern).
  const [prevIndex, setPrevIndex] = useState(index)
  if (prevIndex !== index) {
    setPrevIndex(index)
    setScale(1)
  }

  const handleKey = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft') onPrev()
      if (e.key === 'ArrowRight') onNext()
      if (e.key === '+' || e.key === '=') zoomIn()
      if (e.key === '-') zoomOut()
    },
    [onClose, onPrev, onNext, zoomIn, zoomOut]
  )

  useEffect(() => {
    document.addEventListener('keydown', handleKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handleKey)
      document.body.style.overflow = ''
    }
  }, [handleKey])

  if (!image) return null

  const isZoomed = scale > 1.01

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
        className="relative max-w-5xl w-full h-[75vh]"
        onClick={(e) => e.stopPropagation()}
        style={{ touchAction: 'none' }}
      >
        <TransformWrapper
          key={index}
          ref={transformRef}
          minScale={MIN_SCALE}
          maxScale={MAX_SCALE}
          centerOnInit
          doubleClick={{ mode: 'toggle' }}
          onTransform={(_ref, state) => setScale(state.scale)}
        >
          <TransformComponent
            wrapperStyle={{ width: '100%', height: '100%' }}
            contentStyle={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <img
              src={image.src}
              alt={image.alt}
              className="max-h-full max-w-full object-contain rounded-xl select-none"
              style={{ cursor: isZoomed ? 'grab' : 'zoom-in' }}
              draggable={false}
            />
          </TransformComponent>
        </TransformWrapper>

        {image.caption && !isZoomed && (
          <div className="absolute -bottom-10 left-0 right-0 flex flex-col items-center gap-0.5 px-4 pointer-events-none">
            <p className="text-center text-sm text-earth-cream/80 font-light leading-snug max-w-lg">
              {image.caption}
            </p>
          </div>
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
      <div
        className="absolute bottom-5 left-1/2 -translate-x-1/2 flex items-center gap-1 bg-earth-forest/60 rounded-full px-3 py-1.5 backdrop-blur-sm"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={zoomOut}
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
          onClick={zoomIn}
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
            onClick={(e) => { e.stopPropagation(); onPrev() }}
            aria-label="Previous image"
            className="absolute left-3 top-1/2 -translate-y-1/2 text-earth-cream/60 hover:text-earth-cream transition-colors duration-200 p-3"
          >
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onNext() }}
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

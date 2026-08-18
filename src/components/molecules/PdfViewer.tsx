import { useEffect } from 'react'

interface PdfViewerProps {
  url: string
  title: string
  onClose: () => void
}

/**
 * Fullscreen PDF overlay using the browser's native PDF renderer in an
 * iframe. Only mounted on viewports where inline PDF rendering is reliable —
 * mobile taps open the file in a new tab instead (see ExperienceDetailPage).
 */
export function PdfViewer({ url, title, onClose }: PdfViewerProps) {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handleKey)
      document.body.style.overflow = ''
    }
  }, [onClose])

  return (
    <dialog
      open
      className="fixed inset-0 z-100 m-0 max-w-none w-full h-full bg-earth-forest/95 backdrop-blur-sm flex flex-col p-4 md:p-8"
      aria-modal="true"
      aria-label={`PDF viewer — ${title}`}
    >
      <div className="flex items-center justify-between gap-4 mb-3">
        <p className="text-sm text-earth-cream/80 font-light truncate">{title}</p>
        <div className="flex items-center gap-2 shrink-0">
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-earth-cream/60 hover:text-earth-cream border border-earth-cream/20 rounded-full px-4 py-1.5 transition-colors duration-200"
          >
            Open in new tab
          </a>
          <button
            onClick={onClose}
            aria-label="Close PDF viewer"
            className="text-earth-cream/60 hover:text-earth-cream transition-colors duration-200 p-1"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
      <iframe src={url} title={title} className="flex-1 w-full rounded-xl bg-white" />
    </dialog>
  )
}

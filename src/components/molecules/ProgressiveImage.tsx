import { useState } from 'react'
import { cn } from '@/lib/utils'

interface ProgressiveImageProps {
  src: string
  alt: string
  /** Base64 blur-up placeholder (Sanity `metadata.lqip`). */
  lqip?: string
  /** Natural width / height ratio; reserves layout space so nothing shifts on load. */
  aspectRatio?: number
  className?: string
  loading?: 'lazy' | 'eager'
}

/**
 * Blur-up image: renders the tiny lqip placeholder (or a skeleton pulse when
 * absent) sized to the image's natural aspect ratio, then fades the full
 * image in once it loads. The container matches the image ratio exactly, so
 * object-cover never crops.
 */
export function ProgressiveImage({ src, alt, lqip, aspectRatio, className, loading = 'lazy' }: ProgressiveImageProps) {
  const [loaded, setLoaded] = useState(false)

  return (
    <div
      className={cn('relative overflow-hidden bg-earth-sand', !loaded && !lqip && 'animate-pulse', className)}
      style={aspectRatio ? { aspectRatio } : undefined}
    >
      {lqip && !loaded && (
        <img
          src={lqip}
          alt=""
          aria-hidden
          className="absolute inset-0 w-full h-full object-cover blur-md scale-105"
        />
      )}
      <img
        src={src}
        alt={alt}
        loading={loading}
        onLoad={() => setLoaded(true)}
        className={cn(
          'relative w-full h-full object-cover transition-opacity duration-500',
          loaded ? 'opacity-100' : 'opacity-0',
        )}
      />
    </div>
  )
}

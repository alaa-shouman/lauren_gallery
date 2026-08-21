import imageUrlBuilder from '@sanity/image-url'
import type { SanityImageSource } from '@sanity/image-url/lib/types/types'
import { client } from './client'

const builder = imageUrlBuilder(client)

export function urlFor(source: SanityImageSource) {
  return builder.image(source)
}

/** Display ratio of a Sanity image — the Studio crop rect, when set, wins over the file's own dimensions. */
export function imageAspectRatio(img: {
  asset: { metadata?: { dimensions: { width: number; height: number } } }
  crop?: { top: number; bottom: number; left: number; right: number }
}): number | undefined {
  const dims = img.asset.metadata?.dimensions
  if (!dims) return undefined
  const c = img.crop
  const w = dims.width * (1 - (c?.left ?? 0) - (c?.right ?? 0))
  const h = dims.height * (1 - (c?.top ?? 0) - (c?.bottom ?? 0))
  return h > 0 ? w / h : undefined
}

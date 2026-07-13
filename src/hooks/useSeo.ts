import { useEffect } from 'react'
import { urlFor } from '@/sanity/lib/image'
import { seoToHeadTags, type SeoMeta, type SeoOpts } from '@/lib/seo'
import type { SanityImage } from '@/sanity/types'

/** Absolute site origin: the configured domain, or the current origin as a fallback. */
function resolveSiteUrl(): string {
  const raw = import.meta.env.VITE_SITE_URL as string | undefined
  const configured = raw?.replace(/\/+$/, '')
  return configured || (typeof window !== 'undefined' ? window.location.origin : '')
}

/** SeoOpts for the browser — sizes Sanity images to absolute CDN URLs via urlFor. */
export function browserSeoOpts(): SeoOpts {
  return {
    siteUrl: resolveSiteUrl(),
    imageUrl: (img: SanityImage | undefined, w: number, h: number) =>
      img?.asset ? urlFor(img).width(w).height(h).fit('crop').url() : null,
  }
}

/**
 * Applies a SeoMeta to the document head at runtime (client navigation). Sets
 * <title> and upserts description/OG/Twitter/canonical/JSON-LD tags, all marked
 * with `data-seo` so the freshly-mounted page fully replaces the previous set
 * (including any statically prerendered tags). No head-management library.
 */
export function useSeo(meta: SeoMeta | null, siteName?: string) {
  useEffect(() => {
    if (!meta) return
    const tags = seoToHeadTags(meta, resolveSiteUrl(), siteName)

    document.title = meta.title

    // Drop previously-managed (or prerendered) tags, except the <title> element.
    document.head.querySelectorAll('[data-seo]').forEach((el) => {
      if (el.tagName !== 'TITLE') el.remove()
    })

    const created: Element[] = []
    for (const t of tags) {
      if (t.tag === 'title') continue
      const el = document.createElement(t.tag)
      el.setAttribute('data-seo', t.key)
      for (const [k, v] of Object.entries(t.attrs)) el.setAttribute(k, v)
      if (t.content) el.textContent = t.content
      document.head.appendChild(el)
      created.push(el)
    }

    return () => created.forEach((el) => el.remove())
  }, [meta, siteName])
}

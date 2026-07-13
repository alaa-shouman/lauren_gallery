/**
 * Framework-agnostic SEO metadata builders.
 *
 * This module is imported by BOTH the browser (runtime `useSeo` hook) and the
 * Node build script (`scripts/prerender-seo.ts`), so it must stay pure:
 * - no `import.meta` / `process` access,
 * - no DOM,
 * - only type-only imports from app code (erased in Node via --experimental-strip-types).
 *
 * Callers inject the environment via `SeoOpts`: the absolute site origin and an
 * image-URL builder (browser passes a `urlFor`-based fn; Node passes its own).
 */
import type { SiteSettings, Experience, SanityImage } from '@/sanity/types'

export interface SeoMeta {
  title: string
  description: string
  /** Path only, e.g. '/' or '/experience/foo'. Combined with siteUrl for canonical/og:url. */
  canonicalPath: string
  ogType: 'website' | 'article'
  imageUrl?: string
  imageAlt?: string
  jsonLd: Record<string, unknown>[]
}

export interface SeoOpts {
  /** Absolute origin, e.g. "https://example.com". Empty string if unknown yet. */
  siteUrl: string
  /** Returns an absolute (https) image URL sized w×h, or null if no image. */
  imageUrl: (img: SanityImage | undefined, w: number, h: number) => string | null
}

/** A serializable head tag, used to upsert DOM (runtime) or emit HTML (build). */
export interface HeadTag {
  tag: 'title' | 'meta' | 'link' | 'script'
  attrs: Record<string, string>
  content?: string
  /** Stable key used to dedupe/replace. */
  key: string
}

const OG_W = 1200
const OG_H = 630
const DEFAULT_OG_PATH = '/og-default.jpg'

function clean<T extends Record<string, unknown>>(obj: T): T {
  for (const k of Object.keys(obj)) {
    const v = obj[k]
    if (v === undefined || v === null || v === '' || (Array.isArray(v) && v.length === 0)) delete obj[k]
  }
  return obj
}

function handleToUrl(value: string | undefined, base: string): string | undefined {
  if (!value) return undefined
  const v = value.trim()
  if (!v) return undefined
  if (v.startsWith('http')) return v
  return base + v.replace(/^@/, '')
}

function sameAs(settings: SiteSettings | undefined): string[] {
  if (!settings) return []
  const out: string[] = []
  const li = handleToUrl(settings.linkedin, 'https://linkedin.com/in/')
  const ig = handleToUrl(settings.instagram, 'https://instagram.com/')
  if (li) out.push(li)
  if (ig) out.push(ig)
  for (const s of settings.socialLinks ?? []) {
    if (s?.url) out.push(s.url)
  }
  return Array.from(new Set(out))
}

function personLd(settings: SiteSettings | undefined, opts: SeoOpts, image?: string | null): Record<string, unknown> {
  return clean({
    '@type': 'Person',
    name: settings?.name,
    jobTitle: settings?.role,
    email: settings?.email,
    url: opts.siteUrl || undefined,
    address: settings?.location ? { '@type': 'PostalAddress', addressLocality: settings.location } : undefined,
    image: image || undefined,
    sameAs: sameAs(settings),
  })
}

// ─── Home ────────────────────────────────────────────────────────────────────

export function homeSeo(
  settings: SiteSettings | undefined,
  aboutPortrait: SanityImage | undefined,
  opts: SeoOpts,
): SeoMeta {
  const title = settings?.siteTitle ?? 'Lauren Al Khafaji — Interior Architecture'
  const description = settings?.metaDescription ?? settings?.footerTagline ?? ''
  const img =
    opts.imageUrl(settings?.ogImage, OG_W, OG_H) ??
    opts.imageUrl(aboutPortrait, OG_W, OG_H) ??
    (opts.siteUrl ? opts.siteUrl + DEFAULT_OG_PATH : undefined)

  const website = clean({
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: title,
    url: opts.siteUrl || undefined,
  })
  const person = { '@context': 'https://schema.org', ...personLd(settings, opts, img) }

  return {
    title,
    description,
    canonicalPath: '/',
    ogType: 'website',
    imageUrl: img ?? undefined,
    imageAlt: settings?.ogImage?.alt ?? aboutPortrait?.alt ?? settings?.name,
    jsonLd: [website, person],
  }
}

// ─── Project detail ──────────────────────────────────────────────────────────

export function experienceSeo(
  exp: Experience,
  settings: SiteSettings | undefined,
  opts: SeoOpts,
): SeoMeta {
  const siteTitle = settings?.siteTitle
  const title = siteTitle ? `${exp.title} — ${siteTitle}` : exp.title
  const description = exp.description ?? settings?.metaDescription ?? ''
  const canonicalPath = `/experience/${exp.slug.current}`
  const cover = opts.imageUrl(exp.coverImage, OG_W, OG_H)
  const abs = (p: string) => (opts.siteUrl ? opts.siteUrl + p : p)

  const creativeWork = clean({
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: exp.title,
    description: exp.description || undefined,
    url: opts.siteUrl ? abs(canonicalPath) : undefined,
    image: cover || undefined,
    dateCreated: exp.year ? String(exp.year) : undefined,
    keywords: exp.materials && exp.materials.length ? exp.materials.join(', ') : undefined,
    locationCreated: exp.location ? { '@type': 'Place', name: exp.location } : undefined,
    creator: settings?.name ? { '@type': 'Person', name: settings.name } : undefined,
  })

  const catLabel = exp.category
    ? `${exp.category.label} ${exp.category.accentLabel}`.trim()
    : undefined
  const breadcrumb = clean({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: opts.siteUrl || undefined },
      catLabel
        ? { '@type': 'ListItem', position: 2, name: catLabel, item: opts.siteUrl ? abs('/#designs') : undefined }
        : undefined,
      { '@type': 'ListItem', position: catLabel ? 3 : 2, name: exp.title, item: opts.siteUrl ? abs(canonicalPath) : undefined },
    ].filter(Boolean),
  })

  return {
    title,
    description,
    canonicalPath,
    ogType: 'article',
    imageUrl: cover ?? undefined,
    imageAlt: exp.coverImage?.alt ?? exp.title,
    jsonLd: [creativeWork, breadcrumb],
  }
}

// ─── Head tag construction (shared serialization) ────────────────────────────

export function seoToHeadTags(meta: SeoMeta, siteUrl: string, siteName?: string): HeadTag[] {
  const canonical = siteUrl ? siteUrl + meta.canonicalPath : ''
  const tags: HeadTag[] = []

  tags.push({ tag: 'title', attrs: {}, content: meta.title, key: 'title' })
  tags.push({ tag: 'meta', attrs: { name: 'description', content: meta.description }, key: 'meta:description' })
  if (canonical) tags.push({ tag: 'link', attrs: { rel: 'canonical', href: canonical }, key: 'canonical' })

  const og: Record<string, string | undefined> = {
    'og:type': meta.ogType,
    'og:title': meta.title,
    'og:description': meta.description,
    'og:site_name': siteName,
    'og:url': canonical || undefined,
    'og:image': meta.imageUrl,
    'og:image:alt': meta.imageUrl ? meta.imageAlt : undefined,
  }
  for (const [property, content] of Object.entries(og)) {
    if (content) tags.push({ tag: 'meta', attrs: { property, content }, key: property })
  }

  const tw: Record<string, string | undefined> = {
    'twitter:card': meta.imageUrl ? 'summary_large_image' : 'summary',
    'twitter:title': meta.title,
    'twitter:description': meta.description,
    'twitter:image': meta.imageUrl,
  }
  for (const [name, content] of Object.entries(tw)) {
    if (content) tags.push({ tag: 'meta', attrs: { name, content }, key: name })
  }

  meta.jsonLd.forEach((ld, i) => {
    tags.push({
      tag: 'script',
      attrs: { type: 'application/ld+json' },
      content: JSON.stringify(ld),
      key: `jsonld:${i}`,
    })
  })

  return tags
}

// ─── HTML serialization (used by the build-time prerender) ───────────────────

function escapeHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}

export function renderHeadTagsToHtml(tags: HeadTag[]): string {
  return tags
    .map((t) => {
      const attrs = Object.entries(t.attrs)
        .map(([k, v]) => `${k}="${escapeHtml(v)}"`)
        .join(' ')
      const dataAttr = `data-seo="${t.key}"`
      if (t.tag === 'title') return `<title ${dataAttr}>${escapeHtml(t.content ?? '')}</title>`
      if (t.tag === 'script') {
        // Escape "<" to keep the JSON from breaking out of the <script> element.
        const safe = (t.content ?? '').replace(/</g, '\\u003c')
        return `<script ${attrs} ${dataAttr}>${safe}</script>`
      }
      return `<${t.tag} ${attrs} ${dataAttr} />`
    })
    .join('\n    ')
}

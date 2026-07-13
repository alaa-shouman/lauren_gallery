/**
 * Post-build SEO prerender.
 *
 * The app is a client-rendered SPA, so crawlers/social scrapers see an empty
 * shell. This script injects the correct <head> (title, description, OG,
 * Twitter, canonical, JSON-LD) per route into the built HTML, and emits
 * sitemap.xml + robots.txt. The page body still hydrates client-side.
 *
 * Run AFTER `vite build`:  node --experimental-strip-types scripts/prerender-seo.ts
 * Reuses the same SEO builders as the runtime hook (src/lib/seo.ts) so the
 * static <head> and the client-navigation <head> never drift.
 */
import fs from 'node:fs'
import path from 'node:path'
import { createClient } from '@sanity/client'
import imageUrlBuilder from '@sanity/image-url'
import {
  homeSeo,
  experienceSeo,
  seoToHeadTags,
  renderHeadTagsToHtml,
  type SeoOpts,
} from '../src/lib/seo.ts'
import type { SiteSettings, Experience, SanityImage } from '../src/sanity/types.ts'

type ExpDoc = Experience & { _updatedAt?: string }

const PROJECT_ID = process.env.SANITY_PROJECT_ID || process.env.VITE_SANITY_PROJECT_ID || 'q89j9p90'
const DATASET = process.env.SANITY_DATASET || process.env.VITE_SANITY_DATASET || 'production'

// Absolute origin for canonical/og:url/sitemap. Uses SITE_URL, else the Vercel
// deploy URL, else empty (absolute-URL tags are then omitted until a domain is set).
const SITE_URL = (
  process.env.SITE_URL ||
  process.env.VITE_SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : '') ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : '')
).replace(/\/+$/, '')

const client = createClient({ projectId: PROJECT_ID, dataset: DATASET, apiVersion: '2024-01-01', useCdn: true })
const builder = imageUrlBuilder(client)

const opts: SeoOpts = {
  siteUrl: SITE_URL,
  imageUrl: (img, w, h) => (img?.asset ? builder.image(img).width(w).height(h).fit('crop').url() : null),
}

const SETTINGS_Q = `*[_id == "siteSettings"][0]{
  name, siteTitle, metaDescription, ogImage{asset->, alt}, socialLinks, email, role, location, linkedin, instagram, footerTagline
}`
const ABOUT_Q = `*[_id == "about"][0]{ portrait{asset->, alt} }`
const EXPERIENCES_Q = `*[_type == "experience" && defined(slug.current)]{
  _id, title, slug, description, year, location, materials,
  coverImage{asset->, alt},
  category->{ label, accentLabel, "slug": slug.current },
  _updatedAt
}`

function injectHead(template: string, tagsHtml: string): string {
  return template
    // Idempotent: strip any previously-injected SEO tags first.
    .replace(/<title[^>]*data-seo=[^>]*>[\s\S]*?<\/title>/gi, '')
    .replace(/<script[^>]*data-seo=[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<(?:meta|link)[^>]*data-seo=[^>]*?>/gi, '')
    // Then remove the static baseline title + description so we don't duplicate.
    .replace(/<title[^>]*>[\s\S]*?<\/title>/i, '')
    .replace(/<meta\s+name=["']description["'][^>]*>/i, '')
    .replace('</head>', `    ${tagsHtml}\n  </head>`)
}

async function main() {
  const dist = path.resolve(import.meta.dirname, '..', 'dist')
  const indexPath = path.join(dist, 'index.html')
  if (!fs.existsSync(indexPath)) {
    throw new Error(`[seo] ${indexPath} not found — run "vite build" first.`)
  }
  const template = fs.readFileSync(indexPath, 'utf8')

  const [settings, about, experiences] = await Promise.all([
    client.fetch<SiteSettings | undefined>(SETTINGS_Q),
    client.fetch<{ portrait?: SanityImage } | undefined>(ABOUT_Q),
    client.fetch<ExpDoc[]>(EXPERIENCES_Q),
  ])
  const siteName = settings?.siteTitle

  // Home
  const homeTags = renderHeadTagsToHtml(seoToHeadTags(homeSeo(settings, about?.portrait, opts), SITE_URL, siteName))
  fs.writeFileSync(indexPath, injectHead(template, homeTags))

  // Each project
  for (const exp of experiences ?? []) {
    const tags = renderHeadTagsToHtml(seoToHeadTags(experienceSeo(exp, settings, opts), SITE_URL, siteName))
    const dir = path.join(dist, 'experience', exp.slug.current)
    fs.mkdirSync(dir, { recursive: true })
    fs.writeFileSync(path.join(dir, 'index.html'), injectHead(template, tags))
  }
  console.log(`[seo] injected head into home + ${experiences?.length ?? 0} project pages`)

  // sitemap.xml + robots.txt (need an absolute origin)
  if (SITE_URL) {
    const rows = [
      { loc: '/', lastmod: undefined as string | undefined },
      ...(experiences ?? []).map((e) => ({ loc: `/experience/${e.slug.current}`, lastmod: e._updatedAt })),
    ]
    const xml =
      `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
      rows
        .map((u) => `  <url><loc>${SITE_URL}${u.loc}</loc>${u.lastmod ? `<lastmod>${u.lastmod.slice(0, 10)}</lastmod>` : ''}</url>`)
        .join('\n') +
      `\n</urlset>\n`
    fs.writeFileSync(path.join(dist, 'sitemap.xml'), xml)
    fs.writeFileSync(path.join(dist, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${SITE_URL}/sitemap.xml\n`)
    console.log(`[seo] wrote sitemap.xml (${rows.length} urls) + robots.txt for ${SITE_URL}`)
  } else {
    console.log('[seo] SITE_URL not set — kept static robots.txt, skipped sitemap.xml (set SITE_URL/VITE_SITE_URL when the domain is ready)')
  }
}

main().catch((err) => {
  console.error('[seo] prerender failed:', err)
  process.exit(1)
})

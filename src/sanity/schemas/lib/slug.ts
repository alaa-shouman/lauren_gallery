import type { SlugRule } from 'sanity'

// Sanity's slug type accepts anything typed by hand, so both the "Generate"
// button and manual input must funnel through the same normaliser, and
// validation must reject legacy values that never did.
const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/['’]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 96)
}

export const slugOptions = { slugify, maxLength: 96 }

export function slugValidation(r: SlugRule) {
  return r.required().custom((slug) => {
    const current = slug?.current
    if (!current) return true // required() already reports the missing case
    if (!SLUG_PATTERN.test(current)) {
      return 'Use only lowercase letters, numbers and hyphens (no spaces) — click "Generate" to fix'
    }
    return true
  })
}

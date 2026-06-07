import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSanity } from '@/hooks/useSanity'
import { allExperiencesQuery } from '@/sanity/queries/experience'
import { urlFor } from '@/sanity/lib/image'
import { cn } from '@/lib/utils'
import type { Experience } from '@/sanity/types'

const PICSUM_SEEDS: Record<string, string> = {
  'notting-hill-townhouse': '237',
  'tribeca-loft-conversion': '292',
  'hampstead-family-home': '669',
  'boutique-hotel-suite': '573',
  'pied-a-terre-cannes': '617',
  'cotswold-retreat': '399',
  'vessel-and-void': '835',
  'surface-studies-florence': '167',
  'natural-pigments-research': '432',
}

function getPicsumUrl(slug: string, index: number): string {
  const seed = PICSUM_SEEDS[slug] ?? String(index * 73 + 42)
  return `https://picsum.photos/seed/${seed}/300/300`
}

interface ExperienceTabProps {
  exp: Experience & { galleryCount?: number }
  index: number
  onClick: () => void
}

function ExperienceTab({ exp, index, onClick }: ExperienceTabProps) {
  const imageUrl = exp.coverImage?.asset
    ? urlFor(exp.coverImage).width(300).height(300).fit('crop').url()
    : getPicsumUrl(exp.slug.current, index)

  const count = exp.galleryCount ?? 0
  const imageLabel = count > 0 ? String(count).padStart(2, '0') + ' images' : null

  return (
    <button
      onClick={onClick}
      className={cn(
        'w-full text-left bg-white rounded-2xl p-4 md:p-5',
        'flex items-center gap-4 md:gap-6',
        'shadow-[0_1px_12px_rgba(26,26,26,0.06)]',
        'hover:shadow-[0_4px_24px_rgba(26,26,26,0.10)]',
        'transition-shadow duration-300 group'
      )}
    >
      {/* Thumbnail */}
      <div className="shrink-0 w-16 h-16 md:w-36 md:h-24 rounded-xl overflow-hidden bg-earth-sand">
        <img
          src={imageUrl}
          alt={exp.coverImage?.alt ?? exp.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
          loading="lazy"
        />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <h4 className="font-serif text-lg md:text-xl text-earth-forest leading-tight mb-1 truncate">
          {exp.title}
        </h4>
        <p className="text-xs text-earth-forest/45 mb-2">
          {[exp.studio, exp.year, exp.location].filter(Boolean).join(' · ')}
        </p>
        {exp.description && (
          <p className="hidden md:block text-sm text-earth-forest/55 font-light leading-snug line-clamp-1">
            {exp.description}
          </p>
        )}
      </div>

      {/* Right: image count + CTA */}
      <div className="shrink-0 flex items-center gap-3 md:gap-4">
        {imageLabel && (
          <span className="hidden md:block text-xs text-earth-forest/35 font-mono tracking-wide">
            {imageLabel}
          </span>
        )}
        <span className="flex items-center justify-center w-10 h-10 md:w-auto md:h-auto md:px-5 md:py-2.5 rounded-full bg-earth-forest text-earth-cream text-xs font-medium whitespace-nowrap gap-1.5 transition-colors duration-300 group-hover:bg-earth-terracotta">
          <span className="hidden md:inline">View project</span>
          <span>→</span>
        </span>
      </div>
    </button>
  )
}

const CATEGORY_META: Record<string, { label: string; accentLabel: string; index: string }> = {
  work: { label: 'Work', accentLabel: 'experience', index: '01' },
  freelance: { label: 'Freelance', accentLabel: 'commissions', index: '02' },
  university: { label: 'University', accentLabel: 'projects', index: '03' },
}

const MOCK_EXPERIENCES: (Experience & { galleryCount: number })[] = [
  { _id: 'w1', title: 'Notting Hill Townhouse', slug: { current: 'notting-hill-townhouse' }, studio: 'Studio Heritage', year: 2024, location: 'London, UK', description: 'A complete refurbishment of a four-storey Victorian townhouse.', category: 'work', order: 1, galleryCount: 6 },
  { _id: 'w2', title: 'Tribeca Loft Conversion', slug: { current: 'tribeca-loft-conversion' }, studio: 'Atelier Caldwell', year: 2023, location: 'New York, US', description: 'A two-floor loft for a film editor, carved out of a former printing house.', category: 'work', order: 2, galleryCount: 5 },
  { _id: 'w3', title: 'Hampstead Family Home', slug: { current: 'hampstead-family-home' }, studio: 'Norden & Co.', year: 2022, location: 'London, UK', description: 'A 1930s Arts & Crafts house, gently modernised for a family of five.', category: 'work', order: 3, galleryCount: 4 },
  { _id: 'f1', title: 'Boutique Hotel Suite', slug: { current: 'boutique-hotel-suite' }, studio: 'Maison Verte · Soho', year: 2025, location: 'London, UK', description: 'A signature suite for an eight-room boutique hotel.', category: 'freelance', order: 1, galleryCount: 5 },
  { _id: 'f2', title: 'Pied-à-Terre', slug: { current: 'pied-a-terre-cannes' }, studio: 'Côte Apartment · Cannes', year: 2024, location: 'Cannes, FR', description: 'A two-bedroom apartment overlooking the Croisette.', category: 'freelance', order: 2, galleryCount: 6 },
  { _id: 'f3', title: 'Cotswold Retreat', slug: { current: 'cotswold-retreat' }, studio: 'Birch House · Private', year: 2023, location: 'Cotswolds, UK', description: 'A weekend cottage for a couple who wanted to bring outside in.', category: 'freelance', order: 3, galleryCount: 4 },
  { _id: 'u1', title: 'Vessel & Void', slug: { current: 'vessel-and-void' }, studio: 'AUB Final Project', year: 2021, location: 'Beirut, LB', description: 'Final-year thesis exploring negative space in ceramic form.', category: 'university', order: 1, galleryCount: 8 },
  { _id: 'u2', title: 'Surface Studies', slug: { current: 'surface-studies-florence' }, studio: 'Exchange Studio', year: 2020, location: 'Florence, IT', description: 'Semester residency — surface texture and natural pigments.', category: 'university', order: 2, galleryCount: 5 },
  { _id: 'u3', title: 'Natural Pigments Research', slug: { current: 'natural-pigments-research' }, studio: 'Research Grant', year: 2019, location: 'Beirut, LB', description: 'Archival study of plant-based dye traditions in the Levant.', category: 'university', order: 3, galleryCount: 3 },
]

const CATEGORY_ORDER = ['work', 'freelance', 'university'] as const

interface CategoryAccordionProps {
  cat: string
  items: (Experience & { galleryCount?: number })[]
  isOpen: boolean
  onToggle: () => void
  onSelectExp: (exp: Experience) => void
}

function CategoryAccordion({ cat, items, isOpen, onToggle, onSelectExp }: CategoryAccordionProps) {
  const meta = CATEGORY_META[cat]
  const dateRange = items.length > 0
    ? `${Math.min(...items.map(e => e.year ?? 9999))} — ${Math.max(...items.map(e => e.year ?? 0))}`
    : null

  return (
    <div className="border border-earth-sand rounded-2xl overflow-hidden">
      {/* Accordion header — click to toggle */}
      <button
        onClick={onToggle}
        className={cn(
          'w-full flex items-center justify-between px-6 py-5 transition-colors duration-200',
          isOpen ? 'bg-earth-forest text-earth-cream' : 'bg-white hover:bg-earth-warm text-earth-forest'
        )}
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-4">
          <span className={cn(
            'inline-flex shrink-0 items-center whitespace-nowrap text-xs font-mono tracking-widest transition-colors duration-200',
            isOpen ? 'text-earth-cream/40' : 'text-earth-sage'
          )}>
            — {meta.index}
          </span>
          <h3 className="min-w-0 font-serif text-2xl md:text-3xl leading-none">
            {cat === 'freelance' ? (
              <>
                <span className={cn('italic transition-colors duration-200', isOpen ? 'text-earth-terracotta' : 'text-earth-terracotta')}>
                  {meta.label}{' '}
                </span>
                <span>{meta.accentLabel}</span>
              </>
            ) : (
              <>
                <span>{meta.label} </span>
                <span className="italic text-earth-terracotta">{meta.accentLabel}</span>
              </>
            )}
          </h3>
        </div>

        <div className="flex items-center gap-4">
          <span className={cn(
            'hidden md:block text-xs tracking-wide transition-colors duration-200',
            isOpen ? 'text-earth-cream/40' : 'text-earth-forest/35'
          )}>
            {items.length} {items.length === 1 ? 'project' : 'projects'}
            {dateRange && ` · ${dateRange}`}
          </span>

          {/* Chevron */}
          <span className={cn(
            'flex items-center justify-center w-8 h-8 rounded-full border transition-all duration-300',
            isOpen
              ? 'border-earth-cream/20 text-earth-cream'
              : 'border-earth-forest/20 text-earth-forest'
          )}>
            <svg
              className={cn('w-4 h-4 transition-transform duration-300', isOpen && 'rotate-180')}
              fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
            </svg>
          </span>
        </div>
      </button>

      {/* Accordion body */}
      <div className={cn(
        'overflow-hidden transition-all duration-500 ease-in-out',
        isOpen ? 'max-h-500 opacity-100' : 'max-h-0 opacity-0'
      )}>
        <div className="p-4 md:p-5 space-y-3 bg-earth-cream/60">
          {items.map((exp, i) => (
            <ExperienceTab
              key={exp._id}
              exp={exp}
              index={i}
              onClick={() => onSelectExp(exp)}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export function ExperienceSection() {
  const { data: fetched, loading } = useSanity<(Experience & { galleryCount: number })[]>(allExperiencesQuery)
  const experiences = (fetched && fetched.length > 0) ? fetched : (!loading ? MOCK_EXPERIENCES : null)
  const navigate = useNavigate()

  // Track which categories are open — all closed by default
  const [openCategories, setOpenCategories] = useState<Set<string>>(new Set())

  function toggleCategory(cat: string) {
    setOpenCategories((prev) => {
      const next = new Set(prev)
      if (next.has(cat)) {
        next.delete(cat)
      } else {
        next.add(cat)
      }
      return next
    })
  }

  const grouped = useMemo(() => {
    if (!experiences) return {}
    const g: Record<string, typeof experiences> = {}
    for (const exp of experiences) {
      if (!g[exp.category]) g[exp.category] = []
      g[exp.category].push(exp)
    }
    return g
  }, [experiences])

  function handleSelectExp(exp: Experience) {
    navigate(`/experience/${exp.slug.current}`)
  }

  return (
    <section id="designs" className="py-24 md:py-32 bg-earth-cream">
      <div className="mx-auto max-w-280 px-6">

        {/* Section heading */}
        <div className="mb-12 md:mb-16">
          <p className="text-xs tracking-[0.2em] text-earth-sage uppercase font-medium mb-4">
            — Portfolio
          </p>
          <h2 className="font-serif leading-none tracking-[-0.02em]"
            style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)' }}
          >
            <span className="text-earth-forest">My </span>
            <span className="italic text-earth-terracotta">experience</span>
          </h2>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-20 bg-earth-sand rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {CATEGORY_ORDER.map((cat) => {
              const items = grouped[cat]
              if (!items || items.length === 0) return null
              return (
                <CategoryAccordion
                  key={cat}
                  cat={cat}
                  items={items}
                  isOpen={openCategories.has(cat)}
                  onToggle={() => toggleCategory(cat)}
                  onSelectExp={handleSelectExp}
                />
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}

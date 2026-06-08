import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSanity } from '@/hooks/useSanity'
import { allExperiencesQuery } from '@/sanity/queries/experience'
import { allCategoriesQuery } from '@/sanity/queries/experienceCategory'
import { urlFor } from '@/sanity/lib/image'
import { cn } from '@/lib/utils'
import type { Experience, ExperienceCategory } from '@/sanity/types'

// ─── ExperienceTab ─────────────────────────────────────────────────────────────

interface ExperienceTabProps {
  exp: Experience & { galleryCount?: number }
  index: number
  onClick: () => void
}

function ExperienceTab({ exp, index, onClick }: ExperienceTabProps) {
  const imageUrl = exp.coverImage?.asset
    ? urlFor(exp.coverImage).width(300).height(300).fit('crop').url()
    : `https://picsum.photos/seed/${index * 73 + 42}/300/300`

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
        <p className="text-xs text-grey-light mb-2">
          {[exp.studio, exp.year, exp.location].filter(Boolean).join(' · ')}
        </p>
        {exp.description && (
          <p className="hidden md:block text-sm text-grey-mid font-light leading-snug line-clamp-1">
            {exp.description}
          </p>
        )}
      </div>

      {/* Right: image count + CTA */}
      <div className="shrink-0 flex items-center gap-3 md:gap-4">
        {imageLabel && (
          <span className="hidden md:block text-xs text-grey-light font-mono tracking-wide">
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

// ─── CategoryAccordion ─────────────────────────────────────────────────────────

interface CategoryAccordionProps {
  cat: ExperienceCategory
  index: number
  items: (Experience & { galleryCount?: number })[]
  isOpen: boolean
  onToggle: () => void
  onSelectExp: (exp: Experience) => void
}

function CategoryAccordion({ cat, index, items, isOpen, onToggle, onSelectExp }: CategoryAccordionProps) {
  const displayIndex = String(index + 1).padStart(2, '0')

  const dateRange = items.length > 0
    ? `${Math.min(...items.map(e => e.year ?? 9999))} — ${Math.max(...items.map(e => e.year ?? 0))}`
    : null

  return (
    <div className="border border-earth-sand rounded-2xl overflow-hidden">
      {/* Accordion header */}
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
            isOpen ? 'text-earth-cream/40' : 'text-grey-light'
          )}>
            — {displayIndex}
          </span>
          <h3 className="min-w-0 font-serif text-2xl md:text-3xl leading-none">
            <span>{cat.label} </span>
            <span className={cn('italic transition-colors duration-200', isOpen ? 'text-earth-cream/35' : 'text-grey-mid')}>{cat.accentLabel}</span>
          </h3>
        </div>

        <div className="flex items-center gap-4">
          <span className={cn(
            'hidden md:block text-xs tracking-wide transition-colors duration-200',
            isOpen ? 'text-earth-cream/40' : 'text-grey-light'
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

// ─── ExperienceSection ─────────────────────────────────────────────────────────

export function ExperienceSection() {
  const { data: fetchedExperiences, loading: loadingExp } = useSanity<(Experience & { galleryCount: number })[]>(allExperiencesQuery)
  const { data: fetchedCategories, loading: loadingCat } = useSanity<ExperienceCategory[]>(allCategoriesQuery)

  const loading = loadingExp || loadingCat

  const categories = fetchedCategories ?? []

  const navigate = useNavigate()
  const [openCategories, setOpenCategories] = useState<Set<string>>(new Set())

  function toggleCategory(id: string) {
    setOpenCategories((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  // Group experiences by category _id
  const grouped = useMemo(() => {
    const list = fetchedExperiences ?? []
    const g: Record<string, typeof list> = {}
    for (const exp of list) {
      if (!exp.category?._id) continue
      if (!g[exp.category._id]) g[exp.category._id] = []
      g[exp.category._id].push(exp)
    }
    return g
  }, [fetchedExperiences])

  function handleSelectExp(exp: Experience) {
    navigate(`/experience/${exp.slug.current}`)
  }

  return (
    <section id="designs" className="py-24 md:py-32 bg-earth-cream">
      <div className="mx-auto max-w-280 px-6">

        {/* Section heading */}
        <div className="mb-12 md:mb-16">
          <p className="text-xs tracking-[0.2em] text-grey-light uppercase font-medium mb-4">
            — Portfolio
          </p>
          <h2 className="font-serif leading-none tracking-[-0.02em]"
            style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)' }}
          >
            <span className="text-earth-forest">My </span>
            <span className="italic text-earth">experience</span>
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
            {(categories ?? []).map((cat, i) => {
              const items = grouped[cat._id] ?? []
              return (
                <CategoryAccordion
                  key={cat._id}
                  cat={cat}
                  index={i}
                  items={items}
                  isOpen={openCategories.has(cat._id)}
                  onToggle={() => toggleCategory(cat._id)}
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

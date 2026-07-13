import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSanity } from '@/hooks/useSanity'
import { allExperiencesQuery } from '@/sanity/queries/experience'
import { allCategoriesQuery } from '@/sanity/queries/experienceCategory'
import { allCompaniesQuery } from '@/sanity/queries/company'
import { urlFor } from '@/sanity/lib/image'
import { cn } from '@/lib/utils'
import type { Experience, ExperienceCategory, Company } from '@/sanity/types'

type ExperienceWithCount = Experience & { galleryCount?: number }

// A group of projects shown under a company row inside a company-based category.
// `id` is the company `_id`, or `__other__:<categoryId>` for the unassigned bucket.
interface CompanyGroup {
  id: string
  name: string
  logo?: Company['logo']
  items: ExperienceWithCount[]
}

function yearRange(items: ExperienceWithCount[]): string | null {
  const years = items.map((e) => e.year).filter((y): y is number => typeof y === 'number')
  if (years.length === 0) return null
  const min = Math.min(...years)
  const max = Math.max(...years)
  return min === max ? String(min) : `${min} — ${max}`
}

function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      className={cn('w-4 h-4 transition-transform duration-300', open && 'rotate-180')}
      fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
    </svg>
  )
}

// ─── ExperienceTab ─────────────────────────────────────────────────────────────

interface ExperienceTabProps {
  exp: ExperienceWithCount
  index: number
  onClick: () => void
}

function ExperienceTab({ exp, index, onClick }: ExperienceTabProps) {
  const imageUrl = exp.coverImage?.asset?._id
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

// ─── CompanyAccordion (nested level, company-based categories only) ─────────────

interface CompanyAccordionProps {
  group: CompanyGroup
  isOpen: boolean
  onToggle: () => void
  onSelectExp: (exp: Experience) => void
}

function CompanyAccordion({ group, isOpen, onToggle, onSelectExp }: CompanyAccordionProps) {
  const dateRange = yearRange(group.items)
  const logoUrl = group.logo?.asset?._id
    ? urlFor(group.logo).width(96).height(96).fit('crop').url()
    : null

  return (
    <div className="border border-earth-sand/70 rounded-xl overflow-hidden bg-white">
      {/* Company header */}
      <button
        onClick={onToggle}
        aria-expanded={isOpen}
        className={cn(
          'w-full flex items-center justify-between gap-4 px-4 md:px-5 py-4 transition-colors duration-200',
          isOpen ? 'bg-earth-warm' : 'hover:bg-earth-warm/60'
        )}
      >
        <div className="flex items-center gap-4 min-w-0 text-left">
          {/* Logo or monogram */}
          <span className="shrink-0 w-10 h-10 rounded-lg overflow-hidden bg-earth-sand flex items-center justify-center">
            {logoUrl ? (
              <img src={logoUrl} alt={group.logo?.alt ?? group.name} className="w-full h-full object-cover" loading="lazy" />
            ) : (
              <span className="font-serif text-earth-forest text-base">{group.name.charAt(0)}</span>
            )}
          </span>
          <div className="min-w-0">
            <h4 className="font-serif text-lg md:text-xl text-earth-forest leading-tight truncate">
              {group.name}
            </h4>
            <p className="text-xs text-grey-light">
              {group.items.length} {group.items.length === 1 ? 'project' : 'projects'}
              {dateRange && ` · ${dateRange}`}
            </p>
          </div>
        </div>

        <span className="shrink-0 flex items-center justify-center w-8 h-8 rounded-full border border-earth-forest/20 text-earth-forest transition-all duration-300">
          <Chevron open={isOpen} />
        </span>
      </button>

      {/* Company body — projects */}
      <div className={cn(
        'grid transition-all duration-500 ease-in-out',
        isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
      )}>
        <div className="overflow-hidden min-h-0">
          <div className="p-3 md:p-4 space-y-3 bg-earth-cream/60">
            {group.items.map((exp, i) => (
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
    </div>
  )
}

// ─── CategoryAccordion ─────────────────────────────────────────────────────────

interface CategoryAccordionProps {
  cat: ExperienceCategory
  index: number
  items: ExperienceWithCount[]           // flat list — used for non-company categories
  companyGroups?: CompanyGroup[]         // present only for company-based categories
  isOpen: boolean
  onToggle: () => void
  openCompanies: Set<string>
  onToggleCompany: (id: string) => void
  onSelectExp: (exp: Experience) => void
}

function CategoryAccordion({
  cat, index, items, companyGroups, isOpen, onToggle, openCompanies, onToggleCompany, onSelectExp,
}: CategoryAccordionProps) {
  const displayIndex = String(index + 1).padStart(2, '0')

  const useCompanies = Boolean(cat.hasCompany && companyGroups)
  const allItems = useCompanies ? companyGroups!.flatMap((g) => g.items) : items
  const dateRange = yearRange(allItems)

  const count = useCompanies ? companyGroups!.length : items.length
  const countLabel = useCompanies
    ? `${count} ${count === 1 ? 'company' : 'companies'}`
    : `${count} ${count === 1 ? 'project' : 'projects'}`

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
            {countLabel}
            {dateRange && ` · ${dateRange}`}
          </span>

          {/* Chevron */}
          <span className={cn(
            'flex items-center justify-center w-8 h-8 rounded-full border transition-all duration-300',
            isOpen
              ? 'border-earth-cream/20 text-earth-cream'
              : 'border-earth-forest/20 text-earth-forest'
          )}>
            <Chevron open={isOpen} />
          </span>
        </div>
      </button>

      {/* Accordion body */}
      <div className={cn(
        'grid transition-all duration-500 ease-in-out',
        isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
      )}>
        <div className="overflow-hidden min-h-0">
          <div className="p-4 md:p-5 space-y-3 bg-earth-cream/60">
            {useCompanies
              ? companyGroups!.map((group) => (
                  <CompanyAccordion
                    key={group.id}
                    group={group}
                    isOpen={openCompanies.has(group.id)}
                    onToggle={() => onToggleCompany(group.id)}
                    onSelectExp={onSelectExp}
                  />
                ))
              : items.map((exp, i) => (
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
    </div>
  )
}

// ─── ExperienceSection ─────────────────────────────────────────────────────────

export function ExperienceSection() {
  const { data: fetchedExperiences, loading: loadingExp } = useSanity<ExperienceWithCount[]>(allExperiencesQuery)
  const { data: fetchedCategories, loading: loadingCat } = useSanity<ExperienceCategory[]>(allCategoriesQuery)
  const { data: fetchedCompanies, loading: loadingCo } = useSanity<Company[]>(allCompaniesQuery)

  const loading = loadingExp || loadingCat || loadingCo

  const categories = fetchedCategories ?? []

  const navigate = useNavigate()
  const [openCategories, setOpenCategories] = useState<Set<string>>(new Set())
  const [openCompanies, setOpenCompanies] = useState<Set<string>>(new Set())

  function toggleCategory(id: string) {
    setOpenCategories((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  function toggleCompany(id: string) {
    setOpenCompanies((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  // Group experiences by category _id (used for non-company categories).
  const grouped = useMemo(() => {
    const list = fetchedExperiences ?? []
    const g: Record<string, ExperienceWithCount[]> = {}
    for (const exp of list) {
      if (!exp.category?._id) continue
      if (!g[exp.category._id]) g[exp.category._id] = []
      g[exp.category._id].push(exp)
    }
    return g
  }, [fetchedExperiences])

  // For company-based categories, build the ordered list of company groups,
  // plus an "Other projects" bucket for projects with no company assigned.
  const companyGroupsByCategory = useMemo(() => {
    const cats = fetchedCategories ?? []
    const cos = fetchedCompanies ?? []
    const exps = fetchedExperiences ?? []
    const result: Record<string, CompanyGroup[]> = {}

    for (const cat of cats) {
      if (!cat.hasCompany) continue
      const catExps = exps.filter((e) => e.category?._id === cat._id)
      const catCompanies = cos.filter((c) => c.categoryId === cat._id) // already ordered by query

      const groups: CompanyGroup[] = []
      for (const co of catCompanies) {
        const items = catExps.filter((e) => e.company?._id === co._id)
        if (items.length === 0) continue // hide empty companies
        groups.push({ id: co._id, name: co.name, logo: co.logo, items })
      }

      const orphans = catExps.filter((e) => !e.company?._id)
      if (orphans.length > 0) {
        groups.push({ id: `__other__:${cat._id}`, name: 'Other projects', items: orphans })
      }

      result[cat._id] = groups
    }
    return result
  }, [fetchedCategories, fetchedCompanies, fetchedExperiences])

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
            {categories.map((cat, i) => (
              <CategoryAccordion
                key={cat._id}
                cat={cat}
                index={i}
                items={grouped[cat._id] ?? []}
                companyGroups={cat.hasCompany ? (companyGroupsByCategory[cat._id] ?? []) : undefined}
                isOpen={openCategories.has(cat._id)}
                onToggle={() => toggleCategory(cat._id)}
                openCompanies={openCompanies}
                onToggleCompany={toggleCompany}
                onSelectExp={handleSelectExp}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

import { useState, useMemo } from 'react'
import { useSanity } from '@/hooks/useSanity'
import { allProjectsQuery } from '@/sanity/queries/project'
import { ProjectCard } from '@/components/molecules/ProjectCard'
import { useFadeIn } from '@/hooks/useFadeIn'
import { cn } from '@/lib/utils'
import type { Project } from '@/sanity/types'

const CATEGORIES = [
  { label: 'all', value: 'all' },
  { label: 'ceramics', value: 'ceramics' },
  { label: 'textiles', value: 'textiles' },
  { label: 'surface', value: 'surface' },
  { label: 'installation', value: 'installation' },
  { label: 'editorial', value: 'editorial' },
]

const MOCK_PROJECTS: Project[] = [
  { _id: 'm1', title: 'River Clay Series', slug: { current: 'river-clay-series' }, category: 'ceramics', year: 2024, featured: true },
  { _id: 'm2', title: 'Loom & Linen', slug: { current: 'loom-and-linen' }, category: 'textiles', year: 2024, featured: true },
  { _id: 'm3', title: 'Stone Ground Surface', slug: { current: 'stone-ground-surface' }, category: 'surface', year: 2023, featured: true },
  { _id: 'm4', title: 'Still Collection', slug: { current: 'still-collection' }, category: 'installation', year: 2023, featured: false },
  { _id: 'm5', title: 'Earth & Light', slug: { current: 'earth-and-light' }, category: 'editorial', year: 2023, featured: false },
  { _id: 'm6', title: 'Vessel Forms', slug: { current: 'vessel-forms' }, category: 'ceramics', year: 2022, featured: false },
]

export function WorkSection() {
  const { data: fetched, loading } = useSanity<Project[]>(allProjectsQuery)
  const projects = (fetched && fetched.length > 0) ? fetched : (!loading ? MOCK_PROJECTS : null)

  const [activeCategory, setActiveCategory] = useState('all')
  const headingRef = useFadeIn<HTMLDivElement>()

  const filtered = useMemo(() => {
    if (!projects) return []
    if (activeCategory === 'all') return projects
    return projects.filter((p) => p.category === activeCategory)
  }, [projects, activeCategory])

  const availableCategories = useMemo(() => {
    if (!projects) return CATEGORIES
    const present = new Set(projects.map((p) => p.category))
    return CATEGORIES.filter((c) => c.value === 'all' || present.has(c.value))
  }, [projects])

  return (
    <section id="work" className="py-24 md:py-32 bg-earth-cream">
      <div className="mx-auto max-w-[1120px] px-6">
        <div ref={headingRef} className="fade-up mb-12">
          <p className="text-xs tracking-[0.2em] text-earth-sage font-medium mb-4 uppercase">portfolio</p>
          <h2 className="font-serif italic text-5xl md:text-6xl text-earth-forest tracking-[-0.02em] leading-[1.1] mb-4">
            work
          </h2>
          <p className="text-earth-forest/50 font-light max-w-sm">
            A selection of ceramics, textiles, and surface projects.
          </p>
        </div>

        {/* Filter pills */}
        <div className="flex flex-wrap gap-2 mb-12">
          {availableCategories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setActiveCategory(cat.value)}
              className={cn(
                'px-5 py-2 rounded-full text-sm font-medium transition-all duration-300',
                activeCategory === cat.value
                  ? 'bg-earth-terracotta text-white shadow-sm'
                  : 'bg-earth-sand text-earth-forest hover:bg-earth-warm'
              )}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Grid */}
        {loading ? (
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="rounded-2xl bg-earth-sand animate-pulse break-inside-avoid"
                style={{ height: `${280 + (i % 3) * 80}px` }}
              />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-24 text-center text-earth-forest/40 text-sm">
            No projects in this category yet.
          </div>
        ) : (
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
            {filtered.map((project, i) => (
              <div key={project._id} className="break-inside-avoid">
                <ProjectCard project={project} priority={i < 3} />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

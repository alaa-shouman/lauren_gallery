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

export function WorkPage() {
  const { data: projects, loading } = useSanity<Project[]>(allProjectsQuery)
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
    <main className="min-h-screen bg-earth-cream pt-24">
      <div className="mx-auto max-w-[1120px] px-6 py-16">
        {/* Header */}
        <div ref={headingRef} className="fade-up mb-12">
          <h1 className="font-serif italic text-5xl md:text-6xl text-earth-forest tracking-[-0.02em] leading-[1.1] mb-4">
            work
          </h1>
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
            {Array.from({ length: 9 }).map((_, i) => (
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
    </main>
  )
}

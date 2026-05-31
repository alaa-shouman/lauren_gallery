import { Link } from 'react-router-dom'
import { useSanity } from '@/hooks/useSanity'
import { featuredProjectsQuery } from '@/sanity/queries/project'
import { ProjectCard } from '@/components/molecules/ProjectCard'
import { useFadeIn } from '@/hooks/useFadeIn'
import type { Project } from '@/sanity/types'

export function FeaturedWorkGrid() {
  const { data: projects, loading } = useSanity<Project[]>(featuredProjectsQuery)
  const headingRef = useFadeIn<HTMLDivElement>()

  const skeletons = Array.from({ length: 4 })

  return (
    <section className="py-24 md:py-32 bg-earth-cream">
      <div className="mx-auto max-w-[1120px] px-6">
        <div ref={headingRef} className="fade-up flex items-end justify-between mb-12">
          <h2 className="font-serif italic text-4xl md:text-5xl text-earth-forest tracking-[-0.02em] leading-[1.15]">
            selected work
          </h2>
          <Link
            to="/work"
            className="text-sm text-earth-terracotta underline underline-offset-4 hover:text-earth-terracotta-dark transition-colors duration-300 hidden md:inline"
          >
            View all work →
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {skeletons.map((_, i) => (
              <div
                key={i}
                className={`rounded-2xl bg-earth-sand animate-pulse aspect-[4/5] ${i === 0 ? 'md:col-span-2' : ''}`}
              />
            ))}
          </div>
        ) : projects && projects.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {projects.map((project, i) => (
              <ProjectCard
                key={project._id}
                project={project}
                className={i === 0 ? 'col-span-2 md:col-span-2' : ''}
                priority={i === 0}
              />
            ))}
          </div>
        ) : (
          <div className="py-24 text-center text-earth-forest/40 text-sm">
            No featured projects yet. Add some in Sanity Studio.
          </div>
        )}

        <div className="mt-8 text-center md:hidden">
          <Link
            to="/work"
            className="text-sm text-earth-terracotta underline underline-offset-4"
          >
            View all work →
          </Link>
        </div>
      </div>
    </section>
  )
}

import { Link } from 'react-router-dom'
import { urlFor } from '@/sanity/lib/image'
import { cn } from '@/lib/utils'
import type { Project } from '@/sanity/types'

interface ProjectCardProps {
  project: Project
  className?: string
  priority?: boolean
}

export function ProjectCard({ project, className, priority = false }: ProjectCardProps) {
  const imageUrl = project.coverImage?.asset
    ? urlFor(project.coverImage).width(1200).height(900).fit('crop').url()
    : null

  return (
    <Link
      to={`/work/${project.slug.current}`}
      className={cn(
        'group relative block overflow-hidden rounded-2xl bg-earth-sand',
        'shadow-[0_2px_20px_rgba(28,46,36,0.06)]',
        className
      )}
    >
      <div className="aspect-[4/5] relative overflow-hidden">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={project.coverImage?.alt ?? project.title}
            loading={priority ? 'eager' : 'lazy'}
            className="w-full h-full object-cover transition-transform duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)] group-hover:scale-[1.04]"
          />
        ) : (
          <div className="w-full h-full bg-earth-sand" />
        )}

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-earth-forest/70 via-earth-forest/10 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-500" />

        {/* Text */}
        <div className="absolute bottom-0 left-0 right-0 p-5 translate-y-0 group-hover:-translate-y-0.5 transition-transform duration-500">
          <span className="block text-xs text-earth-sage uppercase tracking-widest mb-1.5">
            {project.category}
          </span>
          <h3 className="font-serif italic text-earth-cream text-xl leading-tight">
            {project.title}
          </h3>
          {project.year && (
            <span className="block text-xs text-earth-cream/50 mt-1">{project.year}</span>
          )}
        </div>
      </div>
    </Link>
  )
}

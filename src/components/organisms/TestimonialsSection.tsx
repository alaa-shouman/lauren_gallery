import { useState } from 'react'
import { useSanity } from '@/hooks/useSanity'
import { featuredTestimonialsQuery } from '@/sanity/queries/testimonial'
import { useFadeIn } from '@/hooks/useFadeIn'
import type { Testimonial } from '@/sanity/types'

const MOCK_TESTIMONIALS: Testimonial[] = [
  { _id: 'mt1', quote: 'Working with Lauren transformed the feel of our space. Every piece carries a quiet intentionality that we hadn\'t found anywhere else.', author: 'Sarah K.', role: 'Interior designer, Melbourne' },
  { _id: 'mt2', quote: 'Lauren\'s ceramics are unlike anything I\'ve encountered — they hold the memory of the earth they came from. Utterly beautiful.', author: 'James W.', role: 'Collector' },
  { _id: 'mt3', quote: 'The commission process was collaborative, thoughtful, and resulted in pieces that feel completely at home in our environment.', author: 'Mia T.', role: 'Architect' },
]

export function TestimonialsSection() {
  const { data: fetched, loading } = useSanity<Testimonial[]>(featuredTestimonialsQuery)
  const testimonials = (fetched && fetched.length > 0) ? fetched : (!loading ? MOCK_TESTIMONIALS : null)
  const [active, setActive] = useState(0)
  const sectionRef = useFadeIn<HTMLElement>()

  const current = testimonials?.[active]

  return (
    <section id="testimonials" ref={sectionRef} className="fade-up py-24 md:py-32 bg-earth-warm">
      <div className="mx-auto max-w-[1120px] px-6">
        <div className="max-w-2xl mx-auto text-center relative">
          {/* Decorative quote mark */}
          <span
            className="absolute -top-8 left-1/2 -translate-x-1/2 font-serif text-[8rem] leading-none text-earth-terracotta/20 select-none pointer-events-none"
            aria-hidden="true"
          >
            "
          </span>

          {loading ? (
            <div className="space-y-4 py-8">
              <div className="h-5 bg-earth-sand rounded animate-pulse w-3/4 mx-auto" />
              <div className="h-5 bg-earth-sand rounded animate-pulse w-4/5 mx-auto" />
              <div className="h-5 bg-earth-sand rounded animate-pulse w-2/3 mx-auto" />
            </div>
          ) : current ? (
            <div className="relative z-10 pt-12">
              <p className="font-serif italic text-xl md:text-2xl text-earth-forest leading-relaxed mb-8">
                "{current.quote}"
              </p>
              <div className="w-8 h-px bg-earth-terracotta mx-auto mb-5" />
              <p className="text-sm font-medium text-earth-forest">{current.author}</p>
              {current.role && (
                <p className="text-xs text-earth-forest/50 mt-1">{current.role}</p>
              )}
            </div>
          ) : null}

          {/* Dots */}
          {testimonials && testimonials.length > 1 && (
            <div className="flex justify-center gap-2 mt-10">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActive(i)}
                  aria-label={`Testimonial ${i + 1}`}
                  className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                    i === active ? 'bg-earth-terracotta w-4' : 'bg-earth-forest/20'
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

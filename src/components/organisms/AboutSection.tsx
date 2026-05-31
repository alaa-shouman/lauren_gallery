import { urlFor } from '@/sanity/lib/image'
import { useSanity } from '@/hooks/useSanity'
import { aboutQuery } from '@/sanity/queries/about'
import { PortableTextRenderer } from '@/components/molecules/PortableTextRenderer'
import { useFadeIn } from '@/hooks/useFadeIn'
import type { AboutData } from '@/sanity/types'

const PROCESS_STEPS = [
  { number: '01', title: 'Gather', description: 'Every piece begins with material — clay pulled from the earth, fibres sourced directly from small producers.' },
  { number: '02', title: 'Shape', description: 'Forms emerge slowly, guided by hand and attention. No shortcuts, no rush.' },
  { number: '03', title: 'Fire', description: 'The kiln transforms raw material into something permanent. Each firing is a conversation.' },
  { number: '04', title: 'Finish', description: 'Surface, texture, and colour are considered last — completing the object\'s character.' },
]

const MOCK_VALUES = [
  { icon: '🌿', label: 'Natural materials', description: 'Only what the earth provides — clay, fibre, pigment.' },
  { icon: '🤲', label: 'Slow process', description: 'Patience as a practice; no shortcuts in the studio.' },
  { icon: '♻️', label: 'Honest making', description: 'Work that shows its process, never hiding the hand.' },
]

export function AboutSection() {
  const { data: about, loading } = useSanity<AboutData>(aboutQuery)
  const bioRef = useFadeIn<HTMLDivElement>()
  const processRef = useFadeIn<HTMLDivElement>()

  const portraitUrl = about?.portrait?.asset
    ? urlFor(about.portrait).width(800).height(1067).fit('crop').url()
    : null

  const values = about?.values && about.values.length > 0 ? about.values : MOCK_VALUES

  return (
    <section id="about">
      {/* Bio block */}
      <div className="py-24 md:py-32 bg-earth-warm">
        <div className="mx-auto max-w-[1120px] px-6">
          <div ref={bioRef} className="fade-up grid md:grid-cols-2 gap-16 items-start">
            {/* Portrait */}
            <div>
              {loading ? (
                <div className="aspect-[3/4] rounded-2xl bg-earth-sand animate-pulse" />
              ) : portraitUrl ? (
                <img
                  src={portraitUrl}
                  alt={about?.portrait.alt ?? 'Lauren Khafaji'}
                  className="w-full aspect-[3/4] object-cover rounded-2xl shadow-[0_2px_20px_rgba(28,46,36,0.08)]"
                  loading="lazy"
                />
              ) : (
                <div className="aspect-[3/4] rounded-2xl bg-earth-sand flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full border-2 border-earth-forest/10" />
                </div>
              )}
            </div>

            {/* Bio */}
            <div className="md:pt-8">
              <p className="text-xs tracking-[0.2em] text-earth-sage uppercase mb-4">
                {about?.sectionLabel ?? 'the maker'}
              </p>
              <h2 className="font-serif italic text-5xl md:text-6xl text-earth-forest tracking-[-0.02em] leading-[1.1] mb-10">
                About Lauren Khafaji
              </h2>

              {loading ? (
                <div className="space-y-3">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="h-4 bg-earth-sand rounded animate-pulse" style={{ width: `${90 - i * 5}%` }} />
                  ))}
                </div>
              ) : about?.bio ? (
                <PortableTextRenderer value={about.bio} />
              ) : (
                <p className="text-earth-forest/65 font-light leading-relaxed">
                  Lauren Khafaji is a maker working with clay, fibre, and surface. Her studio practice spans ceramics, hand-woven textiles, and material-led surface design — each discipline informing the others.
                  <br /><br />
                  Based in the hills, she draws from the quiet rhythms of nature: the texture of bark, the weight of river stones, the way light falls through linen. Her work is an invitation to slow down and notice.
                </p>
              )}

              {about?.signatureImage?.asset && (
                <img
                  src={urlFor(about.signatureImage).height(80).url()}
                  alt={about.signatureImage.alt ?? 'Lauren Khafaji signature'}
                  className="mt-8 h-16 object-contain opacity-60"
                />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Process block */}
      <div className="py-24 bg-earth-cream">
        <div className="mx-auto max-w-[1120px] px-6">
          <div ref={processRef} className="fade-up">
            <p className="text-xs tracking-[0.2em] text-earth-sage uppercase mb-4">the process</p>
            <h3 className="font-serif italic text-4xl md:text-5xl text-earth-forest tracking-[-0.02em] leading-[1.15] mb-16">
              How a piece comes to life
            </h3>

            <div className="grid md:grid-cols-2 gap-12">
              {PROCESS_STEPS.map((step) => (
                <div key={step.number} className="relative pl-8">
                  <span className="absolute left-0 top-0 font-serif italic text-[5rem] leading-none text-earth-terracotta/15 select-none -translate-y-4">
                    {step.number}
                  </span>
                  <div className="relative z-10 pt-8">
                    <h4 className="font-serif italic text-2xl text-earth-forest mb-3">{step.title}</h4>
                    <p className="text-earth-forest/60 font-light leading-relaxed">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Values block */}
      <div className="py-24 bg-earth-warm">
        <div className="mx-auto max-w-[1120px] px-6">
          <p className="text-xs tracking-[0.2em] text-earth-sage uppercase mb-4">what guides the work</p>
          <h3 className="font-serif italic text-4xl text-earth-forest mb-12 tracking-[-0.02em]">
            Values
          </h3>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
            {values.map((v, i) => (
              <div
                key={i}
                className="bg-earth-cream rounded-2xl p-6 shadow-[0_2px_20px_rgba(28,46,36,0.06)]"
              >
                <span className="block text-2xl mb-3">{v.icon}</span>
                <h4 className="font-medium text-earth-forest mb-2">{v.label}</h4>
                <p className="text-sm text-earth-forest/55 leading-relaxed">{v.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

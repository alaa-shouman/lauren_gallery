import { useState, type FormEvent } from 'react'
import { useSanity } from '@/hooks/useSanity'
import { siteSettingsQuery } from '@/sanity/queries/siteSettings'
import { useFadeIn } from '@/hooks/useFadeIn'
import { cn } from '@/lib/utils'
import type { SiteSettings } from '@/sanity/types'

type FormState = 'idle' | 'submitting' | 'success' | 'error'

const inputClass =
  'w-full bg-transparent border-b border-earth-cream/20 pb-3 text-earth-cream placeholder-earth-cream/30 focus:outline-none focus:border-earth-terracotta transition-colors duration-300 font-light text-sm'

const SOCIAL_ICONS: Record<string, string> = {
  instagram: 'IG',
  twitter: 'TW',
  linkedin: 'LI',
  pinterest: 'PI',
}

export function ContactSection() {
  const { data: settings } = useSanity<SiteSettings>(siteSettingsQuery)
  const formRef = useFadeIn<HTMLDivElement>()

  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [status, setStatus] = useState<FormState>('idle')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setStatus('submitting')
    // Simulated submit — replace with real backend or Formspree in production
    await new Promise((resolve) => setTimeout(resolve, 1200))
    setStatus('success')
    setForm({ name: '', email: '', message: '' })
  }

  return (
    <section id="contact" className="bg-earth-forest text-earth-cream">
      <div className="mx-auto max-w-[1120px] px-6">
        <div className="grid md:grid-cols-2 min-h-[600px]">

          {/* Left: info */}
          <div className="flex flex-col justify-center py-20 md:pr-16">
            <p className="text-xs tracking-[0.2em] text-earth-sage mb-6 uppercase">get in touch</p>
            <h2 className="font-serif italic text-4xl md:text-5xl text-earth-cream tracking-[-0.02em] leading-[1.1] mb-8">
              Let's make something together.
            </h2>
            <p className="text-earth-cream/55 font-light leading-relaxed mb-10 max-w-sm">
              {settings?.contactNote ?? 'Commissions, studio collaborations, and press enquiries welcome. I aim to respond within two working days.'}
            </p>

            {settings?.email && (
              <a
                href={`mailto:${settings.email}`}
                className="text-earth-terracotta hover:text-earth-cream transition-colors duration-300 text-sm mb-8 inline-block"
              >
                {settings.email}
              </a>
            )}

            {settings?.socialLinks && settings.socialLinks.length > 0 && (
              <div className="flex gap-4 mt-2">
                {settings.socialLinks.map((s) => (
                  <a
                    key={s.platform}
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 rounded-full border border-earth-cream/20 flex items-center justify-center text-xs text-earth-cream/50 hover:text-earth-cream hover:border-earth-cream/60 transition-all duration-300"
                    aria-label={s.platform}
                  >
                    {SOCIAL_ICONS[s.platform.toLowerCase()] ?? s.platform.slice(0, 2).toUpperCase()}
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Right: form */}
          <div className="flex flex-col justify-center py-20 md:pl-16 md:border-l border-earth-cream/10">
            <div ref={formRef} className="fade-up max-w-md w-full">
              <h3 className="font-serif italic text-3xl text-earth-cream mb-10 tracking-[-0.02em]">
                Send a message
              </h3>

              {status === 'success' ? (
                <div className="py-12 text-center">
                  <p className="text-earth-terracotta font-serif italic text-xl mb-2">Thank you.</p>
                  <p className="text-earth-cream/50 text-sm">I'll be in touch soon.</p>
                  <button
                    onClick={() => setStatus('idle')}
                    className="mt-8 text-xs text-earth-sage underline underline-offset-4"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-8">
                  <div>
                    <label htmlFor="name" className="block text-xs tracking-widest text-earth-cream/40 mb-3 uppercase">
                      Name
                    </label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      required
                      autoComplete="name"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="Your name"
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-xs tracking-widest text-earth-cream/40 mb-3 uppercase">
                      Email
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      autoComplete="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="your@email.com"
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-xs tracking-widest text-earth-cream/40 mb-3 uppercase">
                      Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      required
                      rows={5}
                      value={form.message}
                      onChange={handleChange}
                      placeholder="Tell me about your project..."
                      className={cn(inputClass, 'resize-none')}
                    />
                  </div>

                  {status === 'error' && (
                    <p className="text-xs text-earth-terracotta">
                      Something went wrong. Please try emailing directly.
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={status === 'submitting'}
                    className={cn(
                      'w-full py-4 rounded-full text-sm font-medium transition-all duration-500',
                      'bg-earth-terracotta text-white',
                      status === 'submitting'
                        ? 'opacity-60 cursor-not-allowed'
                        : 'hover:bg-earth-terracotta-dark'
                    )}
                  >
                    {status === 'submitting' ? 'Sending…' : 'Send message'}
                  </button>
                </form>
              )}
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}

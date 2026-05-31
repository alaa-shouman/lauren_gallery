import { Link } from 'react-router-dom'
import { useSanity } from '@/hooks/useSanity'
import { siteSettingsQuery } from '@/sanity/queries/siteSettings'
import type { SiteSettings } from '@/sanity/types'

export function Footer() {
  const { data: settings } = useSanity<SiteSettings>(siteSettingsQuery)

  return (
    <footer className="bg-earth-forest text-earth-cream">
      <div className="mx-auto max-w-[1120px] px-6 py-16">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-10">
          <div>
            <p className="font-serif italic text-2xl mb-3 text-earth-cream">Lauren Mercer</p>
            <p className="text-earth-cream/50 text-sm leading-relaxed max-w-xs">
              {settings?.footerTagline ?? 'earth · texture · form'}
            </p>
          </div>

          <div className="flex flex-col md:items-end gap-4">
            <nav className="flex gap-6">
              {[
                { label: 'work', href: '/work' },
                { label: 'about', href: '/about' },
                { label: 'contact', href: '/contact' },
              ].map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className="text-sm text-earth-cream/60 hover:text-earth-cream transition-colors duration-300"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {settings?.socialLinks && settings.socialLinks.length > 0 && (
              <div className="flex gap-4">
                {settings.socialLinks.map((s) => (
                  <a
                    key={s.platform}
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-earth-cream/40 hover:text-earth-terracotta transition-colors duration-300 uppercase tracking-widest"
                  >
                    {s.platform}
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-earth-cream/10 flex flex-col md:flex-row justify-between gap-2">
          <p className="text-xs text-earth-cream/30">
            &copy; {new Date().getFullYear()} Lauren Mercer. All rights reserved.
          </p>
          {settings?.email && (
            <a
              href={`mailto:${settings.email}`}
              className="text-xs text-earth-cream/40 hover:text-earth-terracotta transition-colors duration-300"
            >
              {settings.email}
            </a>
          )}
        </div>
      </div>
    </footer>
  )
}

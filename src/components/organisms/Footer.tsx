import { useNavigate, useLocation } from 'react-router-dom'
import { useSanity } from '@/hooks/useSanity'
import { siteSettingsQuery } from '@/sanity/queries/siteSettings'
import type { SiteSettings } from '@/sanity/types'

function scrollToSection(sectionId: string) {
  document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' })
}

export function Footer() {
  const { data: settings } = useSanity<SiteSettings>(siteSettingsQuery)
  const navigate = useNavigate()
  const location = useLocation()
  const isHome = location.pathname === '/'

  function handleFooterLink(sectionId: string) {
    if (isHome) {
      scrollToSection(sectionId)
    } else {
      sessionStorage.setItem('_pendingScroll', sectionId)
      navigate('/')
    }
  }

  return (
    <footer className="bg-earth-forest text-earth-cream">
      <div className="mx-auto max-w-[1120px] px-6 py-16">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-10">
          <div>
            <button
              onClick={() => handleFooterLink('hero')}
              className="font-serif italic text-2xl mb-3 text-earth-cream hover:text-earth-terracotta transition-colors duration-300"
            >
              Lauren Khafaji
            </button>
            <p className="text-earth-cream/50 text-sm leading-relaxed max-w-xs">
              {settings?.footerTagline ?? 'earth · texture · form'}
            </p>
          </div>

          <div className="flex flex-col md:items-end gap-4">
            <nav className="flex gap-6">
              {(['Designs', 'About Me', 'Contact info'] as const).map((section) => (
                <button
                  key={section}
                  onClick={() => handleFooterLink(section)}
                  className="text-sm text-earth-cream/60 hover:text-earth-cream transition-colors duration-300"
                >
                  {section}
                </button>
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
            &copy; {new Date().getFullYear()} Lauren Khafaji. All rights reserved.
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

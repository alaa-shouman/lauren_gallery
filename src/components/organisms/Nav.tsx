import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { cn } from '@/lib/utils'

const NAV_LINKS = [
  { label: 'Designs', section: 'designs' },
  { label: 'About Me', section: 'about' },
  { label: 'Contact info', section: 'contact' },
]

function scrollToSection(sectionId: string) {
  document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' })
}

export function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('')
  const location = useLocation()
  const navigate = useNavigate()
  const isHome = location.pathname === '/'

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setMenuOpen(false)
  }, [location.pathname])

  // Track active section via IntersectionObserver when on home page
  useEffect(() => {
    if (!isHome) {
      setActiveSection('')
      return
    }
    const sectionIds = ['hero', 'designs', 'about', 'testimonials', 'press', 'contact']
    const observers: IntersectionObserver[] = []

    sectionIds.forEach((id) => {
      const el = document.getElementById(id)
      if (!el) return
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveSection(id) },
        { rootMargin: '-35% 0px -35% 0px', threshold: 0 }
      )
      obs.observe(el)
      observers.push(obs)
    })

    return () => observers.forEach((obs) => obs.disconnect())
  }, [isHome])

  function handleNavClick(sectionId: string) {
    setMenuOpen(false)
    if (isHome) {
      scrollToSection(sectionId)
    } else {
      sessionStorage.setItem('_pendingScroll', sectionId)
      navigate('/')
    }
  }

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-500',
        scrolled ? 'bg-earth-cream/95 backdrop-blur-sm shadow-[0_1px_0_rgba(28,46,36,0.08)]' : 'bg-transparent'
      )}
    >
      <nav className="mx-auto max-w-[1120px] px-6 flex items-center justify-between h-16 md:h-20">
        <Link
          to="/"
          onClick={() => isHome && scrollToSection('hero')}
          className="font-serif italic text-earth-forest text-xl tracking-tight hover:text-earth-terracotta transition-colors duration-300"
        >
          Lauren Khafaji
        </Link>

        {/* Desktop nav */}
        <ul className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <li key={link.section}>
              <button
                onClick={() => handleNavClick(link.section)}
                className={cn(
                  'text-sm font-medium transition-colors duration-300',
                  activeSection === link.section
                    ? 'text-earth-terracotta'
                    : 'text-earth-forest/70 hover:text-earth-forest'
                )}
              >
                {link.label}
              </button>
            </li>
          ))}
        </ul>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMenuOpen((v) => !v)}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          className="md:hidden flex flex-col gap-1.5 p-2"
        >
          <span className={cn('block h-px w-6 bg-earth-forest transition-all duration-300', menuOpen && 'rotate-45 translate-y-[7px]')} />
          <span className={cn('block h-px w-6 bg-earth-forest transition-all duration-300', menuOpen && 'opacity-0')} />
          <span className={cn('block h-px w-6 bg-earth-forest transition-all duration-300', menuOpen && '-rotate-45 -translate-y-[7px]')} />
        </button>
      </nav>

      {/* Mobile drawer */}
      <div className={cn('md:hidden overflow-hidden transition-all duration-500 bg-earth-cream', menuOpen ? 'max-h-64' : 'max-h-0')}>
        <ul className="flex flex-col px-6 pb-6 gap-5">
          {NAV_LINKS.map((link) => (
            <li key={link.section}>
              <button
                onClick={() => handleNavClick(link.section)}
                className={cn(
                  'text-lg font-medium transition-colors duration-300',
                  activeSection === link.section ? 'text-earth-terracotta' : 'text-earth-forest/70'
                )}
              >
                {link.label}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </header>
  )
}

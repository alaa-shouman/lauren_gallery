import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { Nav, Footer } from '@/components/organisms'
import { HomePage } from '@/pages/HomePage'
import { ExperienceDetailPage } from '@/pages/ExperienceDetailPage'

function ScrollToTop() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    if (!hash) {
      window.scrollTo(0, 0)
    }
  }, [pathname, hash])
  return null
}

function NotFound() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-earth-cream text-center px-6">
      <p className="text-xs tracking-[0.2em] text-earth-sage mb-4 uppercase">404</p>
      <h1 className="font-serif italic text-5xl text-earth-forest mb-6 tracking-[-0.02em]">
        Page not found.
      </h1>
      <p className="text-earth-forest/50 font-light mb-10">
        This page has wandered off into the studio.
      </p>
      <a
        href="/"
        className="px-8 py-3.5 rounded-full text-sm font-medium bg-earth-terracotta text-white hover:bg-earth-terracotta-dark transition-colors duration-500"
      >
        Back home
      </a>
    </main>
  )
}

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Nav />
      {children}
      <Footer />
    </>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/experience/:slug" element={<ExperienceDetailPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  )
}

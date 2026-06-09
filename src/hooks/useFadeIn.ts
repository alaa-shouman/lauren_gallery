import { useCallback, useRef } from 'react'

export function useFadeIn<T extends HTMLElement>() {
  const observerRef = useRef<IntersectionObserver | null>(null)

  const ref = useCallback((node: T | null) => {
    if (observerRef.current) {
      observerRef.current.disconnect()
      observerRef.current = null
    }

    if (node) {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            node.classList.add('in-view')
            observer.unobserve(node)
          }
        },
        { threshold: 0.1 }
      )
      observer.observe(node)
      observerRef.current = observer
    }
  }, [])

  return ref
}

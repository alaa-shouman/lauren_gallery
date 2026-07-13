import { useEffect } from 'react'

/**
 * Sets the document <title> and <meta name="description"> from Sanity-driven
 * values. Each page calls this with its own values; because routes swap page
 * components, the freshly-mounted page always wins — no head-management library
 * needed. Empty/undefined values are ignored so we never blank out a good title.
 */
export function useDocumentMeta(title?: string, description?: string) {
  useEffect(() => {
    if (title) document.title = title
  }, [title])

  useEffect(() => {
    if (!description) return
    let tag = document.head.querySelector<HTMLMetaElement>('meta[name="description"]')
    if (!tag) {
      tag = document.createElement('meta')
      tag.name = 'description'
      document.head.appendChild(tag)
    }
    tag.content = description
  }, [description])
}

import { Font } from '@react-pdf/renderer'

/**
 * Registers the brand fonts (Playfair Display + DM Sans) for react-pdf.
 * TTF files are bundled in /public/fonts so generation has no network dependency.
 * Call once before rendering a PDF document.
 */
let registered = false

export function registerPdfFonts() {
  if (registered) return
  registered = true

  Font.register({
    family: 'Playfair Display',
    fonts: [
      { src: '/fonts/playfair-400.ttf', fontWeight: 400, fontStyle: 'normal' },
      { src: '/fonts/playfair-400-italic.ttf', fontWeight: 400, fontStyle: 'italic' },
    ],
  })

  Font.register({
    family: 'DM Sans',
    fonts: [
      { src: '/fonts/dmsans-300.ttf', fontWeight: 300, fontStyle: 'normal' },
      { src: '/fonts/dmsans-400.ttf', fontWeight: 400, fontStyle: 'normal' },
      { src: '/fonts/dmsans-500.ttf', fontWeight: 500, fontStyle: 'normal' },
    ],
  })

  // Avoid awkward hyphenation breaks in the PDF
  Font.registerHyphenationCallback((word) => [word])
}

import { Document, Page, View, Text, Image, StyleSheet } from '@react-pdf/renderer'
import { registerPdfFonts } from './registerPdfFonts'

registerPdfFonts()

export interface PdfGalleryImage {
  src: string
  alt: string
  caption?: string
}

export interface ProjectPdfProps {
  titleMain: string
  titleAccent: string
  categoryLabel: string
  studio?: string
  role?: string
  year?: number
  location?: string
  footprint?: string
  materials?: string[]
  description?: string
  images: PdfGalleryImage[]
}

/* ── Brand palette ─────────────────────────────────────── */
const COLOR = {
  forest: '#111111',
  terracotta: '#a89880',
  greyMid: '#555555',
  greyLight: '#999999',
  rule: '#111111',
  ruleLight: '#e0e0de',
  caption: '#666666',
}

const styles = StyleSheet.create({
  page: {
    fontFamily: 'DM Sans',
    color: COLOR.forest,
    backgroundColor: '#ffffff',
    paddingTop: 34,
    paddingBottom: 48,
    paddingHorizontal: 36,
  },

  /* Header */
  header: {
    borderBottomWidth: 1,
    borderBottomColor: COLOR.rule,
    paddingBottom: 10,
    marginBottom: 12,
  },
  eyebrow: {
    fontFamily: 'DM Sans',
    fontWeight: 500,
    fontSize: 7,
    letterSpacing: 1.6,
    textTransform: 'uppercase',
    color: COLOR.terracotta,
    marginBottom: 6,
  },
  title: {
    fontFamily: 'Playfair Display',
    fontWeight: 400,
    fontSize: 26,
    lineHeight: 1.1,
    color: COLOR.forest,
  },
  titleAccent: {
    fontFamily: 'Playfair Display',
    fontStyle: 'italic',
    color: COLOR.terracotta,
  },
  subtitle: {
    fontFamily: 'Playfair Display',
    fontStyle: 'italic',
    fontSize: 10.5,
    color: COLOR.greyMid,
    marginTop: 6,
  },

  /* Body: description + meta */
  body: {
    flexDirection: 'row',
    borderBottomWidth: 0.7,
    borderBottomColor: COLOR.ruleLight,
    paddingBottom: 12,
    marginBottom: 12,
  },
  description: {
    flex: 1.9,
    fontFamily: 'DM Sans',
    fontWeight: 300,
    fontSize: 9.5,
    lineHeight: 1.55,
    color: COLOR.forest,
    paddingRight: 18,
  },
  meta: {
    flex: 1,
    flexDirection: 'column',
    gap: 8,
  },
  metaItem: {
    flexDirection: 'column',
    gap: 2,
  },
  metaLabel: {
    fontFamily: 'DM Sans',
    fontWeight: 500,
    fontSize: 6,
    letterSpacing: 1.3,
    textTransform: 'uppercase',
    color: COLOR.greyLight,
  },
  metaValue: {
    fontFamily: 'Playfair Display',
    fontStyle: 'italic',
    fontSize: 11,
    color: COLOR.forest,
  },

  /* Gallery */
  galleryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    borderBottomWidth: 0.7,
    borderBottomColor: COLOR.ruleLight,
    paddingBottom: 7,
    marginBottom: 10,
  },
  galleryTitle: {
    fontFamily: 'Playfair Display',
    fontWeight: 400,
    fontSize: 13,
    color: COLOR.forest,
  },
  galleryTitleAccent: {
    fontFamily: 'Playfair Display',
    fontStyle: 'italic',
    color: COLOR.terracotta,
  },
  galleryCount: {
    fontFamily: 'DM Sans',
    fontSize: 6.5,
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: COLOR.greyLight,
  },
  /* Gallery fills the remaining page height so there's no bottom whitespace */
  gallerySection: {
    flexGrow: 1,
    flexDirection: 'column',
  },
  galleryRows: {
    flexGrow: 1,
    flexDirection: 'column',
    gap: 9,
  },
  galleryRow: {
    flexGrow: 1,
    flexDirection: 'row',
    gap: 9,
  },
  galleryCell: {
    flex: 1,
    flexDirection: 'column',
  },
  imageWrap: {
    flexGrow: 1,
    borderRadius: 3,
    overflow: 'hidden',
  },
  galleryImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  captionRow: {
    flexDirection: 'row',
    marginTop: 4,
    gap: 4,
    flexShrink: 0,
  },
  captionIndex: {
    fontFamily: 'DM Sans',
    fontWeight: 500,
    fontSize: 6,
    letterSpacing: 0.8,
    color: COLOR.greyLight,
    paddingTop: 0.5,
  },
  caption: {
    flex: 1,
    fontFamily: 'DM Sans',
    fontWeight: 300,
    fontSize: 6.8,
    lineHeight: 1.25,
    color: COLOR.caption,
    maxLines: 2,
    textOverflow: 'ellipsis',
  },

  /* Footer */
  footer: {
    position: 'absolute',
    bottom: 20,
    left: 36,
    right: 36,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 0.7,
    borderTopColor: COLOR.ruleLight,
    paddingTop: 7,
  },
  footerText: {
    fontFamily: 'DM Sans',
    fontSize: 7,
    letterSpacing: 0.5,
    color: COLOR.greyLight,
  },
})

function chunk<T>(arr: T[], size: number): T[][] {
  const out: T[][] = []
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size))
  return out
}

export function ProjectPdfDocument(props: ProjectPdfProps) {
  const {
    titleMain, titleAccent, categoryLabel, studio, role,
    year, location, footprint, materials, description, images,
  } = props

  const metaItems: { label: string; value: string }[] = []
  if (year) metaItems.push({ label: 'Year', value: String(year) })
  if (location) metaItems.push({ label: 'Where', value: location })
  if (footprint) metaItems.push({ label: 'Footprint', value: footprint })
  if (materials && materials.length > 0) metaItems.push({ label: 'Materials', value: materials.join(' · ') })

  const subtitle = [studio, role].filter(Boolean).join(', ')
  const footerParts = ['Lauren Khafaji', `${titleMain} ${titleAccent}`.trim(), categoryLabel]
  if (year) footerParts.push(String(year))

  // 2 images per row in the PDF (larger than the 3-up web grid)
  const COLS = 2
  const rows = chunk(images, COLS)

  return (
    <Document
      title={`${titleMain} ${titleAccent}`.trim()}
      author="Lauren Khafaji"
      subject={categoryLabel}
    >
      <Page size="A4" style={styles.page} wrap={false}>
        {/* Header */}
        <View style={styles.header}>
          {categoryLabel ? <Text style={styles.eyebrow}>{categoryLabel}</Text> : null}
          <Text style={styles.title}>
            {titleMain ? `${titleMain} ` : ''}
            <Text style={styles.titleAccent}>{titleAccent}</Text>
          </Text>
          {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
        </View>

        {/* Body */}
        {(description || metaItems.length > 0) && (
          <View style={styles.body}>
            {description ? <Text style={styles.description}>{description}</Text> : <View style={styles.description} />}
            <View style={styles.meta}>
              {metaItems.map((m) => (
                <View key={m.label} style={styles.metaItem}>
                  <Text style={styles.metaLabel}>{m.label}</Text>
                  <Text style={styles.metaValue}>{m.value}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Gallery — grows to fill the remaining page height */}
        {images.length > 0 && (
          <View style={styles.gallerySection}>
            <View style={styles.galleryHeader}>
              <Text style={styles.galleryTitle}>
                Project <Text style={styles.galleryTitleAccent}>gallery</Text>
              </Text>
              <Text style={styles.galleryCount}>
                {images.length} image{images.length !== 1 ? 's' : ''}
              </Text>
            </View>

            <View style={styles.galleryRows}>
              {rows.map((row, r) => (
                <View key={r} style={styles.galleryRow}>
                  {row.map((img, c) => {
                    const index = r * COLS + c
                    return (
                      <View key={index} style={styles.galleryCell}>
                        <View style={styles.imageWrap}>
                          {/* eslint-disable-next-line jsx-a11y/alt-text */}
                          <Image style={styles.galleryImage} src={img.src} />
                        </View>
                        <View style={styles.captionRow}>
                          <Text style={styles.captionIndex}>
                            {String(index + 1).padStart(2, '0')}
                          </Text>
                          {img.caption ? <Text style={styles.caption}>{img.caption}</Text> : null}
                        </View>
                      </View>
                    )
                  })}
                  {/* Keep equal cell width when the last row is incomplete */}
                  {row.length < COLS &&
                    Array.from({ length: COLS - row.length }).map((_, i) => (
                      <View key={`spacer-${i}`} style={styles.galleryCell} />
                    ))}
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Footer (repeats on every page) */}
        <View style={styles.footer} fixed>
          <Text style={styles.footerText}>{footerParts.join('  ·  ')}</Text>
          <Text
            style={styles.footerText}
            render={({ pageNumber, totalPages }) =>
              totalPages > 1 ? `${pageNumber} / ${totalPages}` : ''
            }
          />
        </View>
      </Page>
    </Document>
  )
}

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
  terracotta: '#8c9196',
  greyMid: '#555555',
  greyLight: '#999999',
  rule: '#111111',
  ruleLight: '#e0e0de',
  caption: '#666666',
  sand: '#e5e5e5'
}

const styles = StyleSheet.create({
  page: {
    fontFamily: 'DM Sans',
    color: COLOR.forest,
    backgroundColor: '#ffffff',
    paddingTop: 48,
    paddingBottom: 80, // Space for footer
    paddingHorizontal: 36,
  },
  
  /* Top Section (3fr / 2fr split) */
  topSection: {
    flexDirection: 'row',
    marginBottom: 40,
    gap: 24,
  },
  leftCol: {
    flex: 3,
    flexDirection: 'column',
    paddingRight: 16,
  },
  rightCol: {
    flex: 2,
    flexDirection: 'column',
  },
  eyebrow: {
    fontFamily: 'DM Sans',
    fontWeight: 500,
    fontSize: 8,
    letterSpacing: 1.8,
    textTransform: 'uppercase',
    color: COLOR.terracotta,
    marginBottom: 16,
  },
  title: {
    fontFamily: 'Playfair Display',
    fontWeight: 400,
    fontSize: 34,
    lineHeight: 1.1,
    color: COLOR.forest,
    marginBottom: 10,
  },
  titleAccent: {
    fontFamily: 'Playfair Display',
    fontStyle: 'italic',
    color: COLOR.terracotta,
  },
  subtitle: {
    fontFamily: 'Playfair Display',
    fontStyle: 'italic',
    fontSize: 12,
    color: COLOR.greyMid,
    marginBottom: 18,
  },
  description: {
    fontFamily: 'DM Sans',
    fontWeight: 300,
    fontSize: 10,
    lineHeight: 1.55,
    color: COLOR.forest,
  },

  /* Meta Cards */
  metaCardsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 20,
  },
  infoCard: {
    width: '47%', 
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: COLOR.sand,
    borderRadius: 8,
    padding: 10,
    flexDirection: 'column',
  },
  infoCardLabel: {
    fontFamily: 'DM Sans',
    fontWeight: 500,
    fontSize: 6,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    color: COLOR.greyLight,
    marginBottom: 4,
  },
  infoCardValue: {
    fontFamily: 'Playfair Display',
    fontStyle: 'italic',
    fontSize: 11,
    color: COLOR.forest,
  },

  /* Materials */
  materialsLabel: {
    fontFamily: 'DM Sans',
    fontWeight: 500,
    fontSize: 6,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    color: COLOR.greyLight,
    marginBottom: 8,
  },
  materialsTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  materialTag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLOR.sand,
  },
  materialTagText: {
    fontFamily: 'DM Sans',
    fontWeight: 500,
    fontSize: 6.5,
    color: COLOR.greyMid,
  },

  /* Gallery Section */
  gallerySection: {
    borderTopWidth: 1,
    borderTopColor: COLOR.ruleLight,
    paddingTop: 24,
  },
  galleryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 16,
  },
  galleryTitle: {
    fontFamily: 'Playfair Display',
    fontSize: 18,
    color: COLOR.forest,
  },
  galleryTitleAccent: {
    fontFamily: 'Playfair Display',
    fontStyle: 'italic',
    color: COLOR.terracotta,
  },
  galleryCount: {
    fontFamily: 'DM Sans',
    fontSize: 7,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    color: COLOR.greyLight,
    paddingBottom: 2,
  },
  galleryGrid: {
    flexDirection: 'column',
    gap: 12,
  },
  galleryRow: {
    flexDirection: 'row',
    gap: 12,
  },
  galleryCell: {
    width: '31.33%', // 3 columns
    flexDirection: 'column',
  },
  galleryImage: {
    width: '100%',
    height: 165, // Square aspect ratio
    objectFit: 'cover',
    borderRadius: 6,
  },
  captionRow: {
    flexDirection: 'row',
    marginTop: 6,
    gap: 4,
  },
  captionIndex: {
    fontFamily: 'DM Sans',
    fontWeight: 500,
    fontSize: 7,
    letterSpacing: 1,
    color: COLOR.greyLight,
    paddingTop: 0.5,
  },
  captionText: {
    flex: 1,
    fontFamily: 'DM Sans',
    fontWeight: 300,
    fontSize: 7,
    lineHeight: 1.3,
    color: COLOR.caption,
  },

  /* Footer */
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerText: {
    fontFamily: 'DM Sans',
    fontSize: 7,
    letterSpacing: 1,
    color: COLOR.greyLight,
  },
  footerDot: {
    fontFamily: 'DM Sans',
    fontSize: 7,
    color: COLOR.greyLight,
    marginHorizontal: 8,
  }
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
  metaItems.push({ label: 'Photos', value: `${images.length} image${images.length !== 1 ? 's' : ''}` })

  const subtitle = [studio, role].filter(Boolean).join(', ')
  const footerParts = ['Lauren Khafaji', `${titleMain} ${titleAccent}`.trim(), categoryLabel]
  if (year) footerParts.push(String(year))

  const Footer = () => (
    <View style={styles.footer} fixed>
      {footerParts.map((part, i) => (
        <View key={i} style={{ flexDirection: 'row', alignItems: 'center' }}>
           {i > 0 && <Text style={styles.footerDot}>·</Text>}
           <Text style={styles.footerText}>{part}</Text>
        </View>
      ))}
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
         <Text style={styles.footerDot}>·</Text>
         <Text style={styles.footerText} render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}`} />
      </View>
    </View>
  )

  const galleryRows = chunk(images, 3)

  return (
    <Document
      title={`${titleMain} ${titleAccent}`.trim()}
      author="Lauren Khafaji"
      subject={categoryLabel}
    >
      <Page size="A4" style={styles.page}>
        
        {/* Top Section (Mimics Web 3fr/2fr) */}
        <View style={styles.topSection}>
          <View style={styles.leftCol}>
            {categoryLabel && <Text style={styles.eyebrow}>— {categoryLabel}</Text>}
            <Text style={styles.title}>
              {titleMain ? `${titleMain} ` : ''}
              <Text style={styles.titleAccent}>{titleAccent}</Text>
            </Text>
            {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
            {description && <Text style={styles.description}>{description}</Text>}
          </View>

          <View style={styles.rightCol}>
            <View style={styles.metaCardsGrid}>
              {metaItems.map(m => (
                <View key={m.label} style={styles.infoCard}>
                   <Text style={styles.infoCardLabel}>{m.label}</Text>
                   <Text style={styles.infoCardValue}>{m.value}</Text>
                </View>
              ))}
            </View>
            
            {materials && materials.length > 0 && (
              <View>
                <Text style={styles.materialsLabel}>— Materials</Text>
                <View style={styles.materialsTags}>
                  {materials.map(m => (
                    <View key={m} style={styles.materialTag}>
                      <Text style={styles.materialTagText}>{m}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}
          </View>
        </View>

        {/* Gallery Section */}
        {images.length > 0 && (
          <View style={styles.gallerySection}>
            <View style={styles.galleryHeader}>
              <Text style={styles.galleryTitle}>Project <Text style={styles.galleryTitleAccent}>gallery</Text></Text>
              <Text style={styles.galleryCount}>{images.length} images</Text>
            </View>

            <View style={styles.galleryGrid}>
              {galleryRows.map((row, r) => (
                <View key={r} style={styles.galleryRow} wrap={false}>
                  {row.map((img, c) => {
                    const index = r * 3 + c
                    return (
                      <View key={c} style={styles.galleryCell}>
                        {/* eslint-disable-next-line jsx-a11y/alt-text */}
                        <Image src={img.src} style={styles.galleryImage} />
                        <View style={styles.captionRow}>
                          <Text style={styles.captionIndex}>{String(index + 1).padStart(2, '0')}</Text>
                          {img.caption && <Text style={styles.captionText}>{img.caption}</Text>}
                        </View>
                      </View>
                    )
                  })}
                </View>
              ))}
            </View>
          </View>
        )}

        <Footer />
      </Page>
    </Document>
  )
}

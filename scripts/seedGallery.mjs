import { createClient } from '@sanity/client'

const client = createClient({
  projectId: 'q89j9p90',
  dataset: 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_WRITE_TOKEN,
  useCdn: false,
})

const DOC_ID = '16636b86-8599-4305-90ff-5813f5abdc3f' // notting-hill-townhouse / "Design 3"

// Seeds match PICSUM_SEEDS['notting-hill-townhouse'] so the look is consistent
const IMAGES = [
  { seed: 237, alt: 'Entrance hall with limewashed walls', caption: 'Entrance hall — limewashed plaster catches the morning light off the original stone floor.' },
  { seed: 338, alt: 'Living room seating arrangement', caption: 'The living room, anchored by a low travertine table and a pair of restored mid-century armchairs.' },
  { seed: 447, alt: 'Kitchen detail', caption: 'Kitchen joinery in oiled oak, paired with a single slab of honed Calacatta for the island.' },
  { seed: 554, alt: 'Staircase and landing', caption: 'A sculptural oak staircase winds up to the landing, lit from a concealed rooflight above.' },
  { seed: 661, alt: 'Primary bedroom', caption: 'Primary bedroom — soft wool textiles and a hand-plastered headboard wall in warm stone.' },
  { seed: 772, alt: 'Bathroom with natural stone', caption: 'The principal bathroom, wrapped floor to ceiling in tumbled travertine.' },
]

async function uploadSeed({ seed, alt, caption }) {
  const url = `https://picsum.photos/seed/${seed}/1400/1050`
  const res = await fetch(url)
  if (!res.ok) throw new Error(`fetch ${seed} failed: ${res.status}`)
  const buf = Buffer.from(await res.arrayBuffer())
  const asset = await client.assets.upload('image', buf, { filename: `${seed}.jpg` })
  return {
    _type: 'image',
    _key: `g_${seed}`,
    asset: { _type: 'reference', _ref: asset._id },
    alt,
    caption,
  }
}

const gallery = []
for (const img of IMAGES) {
  process.stdout.write(`uploading ${img.seed}… `)
  gallery.push(await uploadSeed(img))
  console.log('done')
}

await client.patch(DOC_ID).set({ gallery }).commit()
console.log(`\n✓ Patched ${DOC_ID} with ${gallery.length} captioned gallery images.`)

// One-off image import: re-encodes the client's job photos to WebP (strips EXIF/GPS), resizes, and writes
// descriptive file names into public/images/realisations. Usage:
//   node scripts/process-images.mjs <work_results dir>
// Illustrative photos (public/images/photos) are free-licence stock listed in public/images/photos/CREDITS.md;
// vector illustrations are produced by scripts/process-vectors.mjs.
import sharp from 'sharp'
import { mkdir } from 'node:fs/promises'
import path from 'node:path'

const [, , workDir] = process.argv
if (!workDir) {
  console.error('Usage: node scripts/process-images.mjs <work_results dir>')
  process.exit(1)
}

const out = path.resolve('public/images')
await mkdir(`${out}/realisations`, { recursive: true })

/** client before/after pairs and on-site photos (see docs/02 §5) */
const work = {
  before1: 'lavabo-avant', after1: 'lavabo-apres',
  before2: 'cuisine-avant', after2: 'cuisine-apres',
  before5: 'four-avant', after5: 'four-apres',
  before6: 'tiroir-avant', after6: 'tiroir-apres',
  before7: 'fenetre-avant', after7: 'fenetre-apres',
  before8: 'baignoire-avant', after8: 'baignoire-apres',
  before9: 'salle-de-bain-avant', after9: 'salle-de-bain-apres',
  before10: 'vasque-sanitaires-avant', after10: 'vasque-sanitaires-apres',
  before11: 'wc-lavabo-avant', after11: 'wc-lavabo-apres',
  before12: 'parking-abords-avant', after12: 'parking-abords-apres',
  work1: 'salle-de-reunion', work2: 'kitchenette-bureau', work3: 'evier-cuisine',
  work4: 'bureau-espace-de-vie', work5: 'salle-de-formation',
}

async function convert(src, dest, max) {
  const info = await sharp(src)
    .rotate() // honour EXIF orientation before metadata is dropped
    .resize({ width: max, height: max, fit: 'inside', withoutEnlargement: true })
    .webp({ quality: 82 })
    .toFile(dest)
  console.log(`${path.basename(dest)}  ${info.width}x${info.height}  ${Math.round(info.size / 1024)} KB`)
}

for (const [src, name] of Object.entries(work)) {
  await convert(path.join(workDir, `${src}.jpg`), `${out}/realisations/${name}.webp`, 1600)
}

// One-off import of the client's vector illustrations (JPG on a white background) into transparent WebP:
// the white background is flood-filled from the image border and made transparent, then the illustration
// is cropped, trimmed and resized. Usage:
//   node scripts/process-vectors.mjs <vectors dir>
import sharp from 'sharp'
import { mkdir } from 'node:fs/promises'
import path from 'node:path'

const [, , srcDir] = process.argv
if (!srcDir) {
  console.error('Usage: node scripts/process-vectors.mjs <vectors dir>')
  process.exit(1)
}

const out = path.resolve('public/images/illustrations')
await mkdir(out, { recursive: true })

/** crop and erase boxes are in source pixels; omit `crop` to keep the whole image */
const jobs = [
  { src: 'vector2', name: 'equipe-agents-entretien', max: 1600 },
  { src: 'vector1', name: 'agent-lavage-vitres', max: 1400, crop: { left: 2650, top: 60, width: 950, height: 1900 } },
  {
    src: 'vector3',
    name: 'binome-vitrage',
    max: 1400,
    crop: { left: 1950, top: 1450, width: 1750, height: 2250 },
    // neighbouring kitchen counter (top right) and wash basin (bottom left) of the source sheet
    erase: [
      { left: 3200, top: 1400, width: 500, height: 450 },
      { left: 1900, top: 3380, width: 340, height: 400 },
    ],
  },
  { src: 'vector4', name: 'produits-desinfection', max: 1600, crop: { left: 250, top: 150, width: 2900, height: 2450 } },
  { src: 'vector4', name: 'seau-produits', max: 1600, crop: { left: 3350, top: 150, width: 3150, height: 2450 } },
]

const isLight = (r, g, b, min) => r >= min && g >= min && b >= min && Math.max(r, g, b) - Math.min(r, g, b) < 18

async function cutout(file, crop, erase = []) {
  let img = sharp(file).rotate()
  if (crop) img = img.extract(crop)
  const { data, info } = await img.ensureAlpha().raw().toBuffer({ resolveWithObject: true })
  const { width: w, height: h } = info
  const ox = crop?.left ?? 0
  const oy = crop?.top ?? 0
  for (const r of erase) {
    for (let y = Math.max(0, r.top - oy); y < Math.min(h, r.top - oy + r.height); y++)
      for (let x = Math.max(0, r.left - ox); x < Math.min(w, r.left - ox + r.width); x++) data.fill(255, (y * w + x) * 4, (y * w + x) * 4 + 4)
  }
  const bg = new Uint8Array(w * h)
  const stack = []
  const push = (i) => {
    if (bg[i]) return
    const o = i * 4
    if (!isLight(data[o], data[o + 1], data[o + 2], 236)) return
    bg[i] = 1
    stack.push(i)
  }
  for (let x = 0; x < w; x++) {
    push(x)
    push((h - 1) * w + x)
  }
  for (let y = 0; y < h; y++) {
    push(y * w)
    push(y * w + w - 1)
  }
  while (stack.length) {
    const i = stack.pop()
    const x = i % w
    if (x > 0) push(i - 1)
    if (x < w - 1) push(i + 1)
    if (i >= w) push(i - w)
    if (i < w * (h - 1)) push(i + w)
  }
  // enclosed pure-white holes (e.g. inside a bucket handle) are background too
  const seen = new Uint8Array(w * h)
  for (let s = 0; s < w * h; s++) {
    if (bg[s] || seen[s]) continue
    const o = s * 4
    if (!isLight(data[o], data[o + 1], data[o + 2], 250)) continue
    const comp = [s]
    seen[s] = 1
    for (let k = 0; k < comp.length; k++) {
      const i = comp[k]
      const x = i % w
      for (const n of [x > 0 ? i - 1 : -1, x < w - 1 ? i + 1 : -1, i - w, i + w]) {
        if (n < 0 || n >= w * h || seen[n] || bg[n]) continue
        const p = n * 4
        if (!isLight(data[p], data[p + 1], data[p + 2], 250)) continue
        seen[n] = 1
        comp.push(n)
      }
    }
    if (comp.length > 4000) for (const i of comp) bg[i] = 1
  }
  for (let i = 0; i < w * h; i++) {
    const o = i * 4
    if (bg[i]) {
      data[o + 3] = 0
      continue
    }
    // soften the anti-aliased light fringe next to the removed background
    const x = i % w
    const nearBg = (x > 0 && bg[i - 1]) || (x < w - 1 && bg[i + 1]) || (i >= w && bg[i - w]) || (i < w * (h - 1) && bg[i + w])
    if (nearBg) {
      const m = Math.min(data[o], data[o + 1], data[o + 2])
      if (m > 190) data[o + 3] = Math.round(Math.min(1, (255 - m) / 65) * 255)
    }
  }
  return sharp(data, { raw: { width: w, height: h, channels: 4 } })
}

for (const job of jobs) {
  const cut = await cutout(path.join(srcDir, `${job.src}.jpg`), job.crop, job.erase)
  const trimmed = await cut.png().toBuffer().then((b) => sharp(b).trim({ threshold: 1 }).toBuffer())
  const info = await sharp(trimmed)
    .resize({ width: job.max, height: job.max, fit: 'inside', withoutEnlargement: true })
    .webp({ quality: 86, alphaQuality: 90, effort: 6 })
    .toFile(`${out}/${job.name}.webp`)
  console.log(`${job.name}.webp  ${info.width}x${info.height}  ${Math.round(info.size / 1024)} KB`)
}

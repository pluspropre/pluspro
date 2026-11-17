'use client'
import { createSupabaseBrowserClient } from '@/lib/supabase/browser'

export type Uploaded = { path: string; width: number; height: number }

/** Resize + re-encode to WebP (drops EXIF/GPS) then upload to the public "media" bucket. */
export async function compressAndUpload(file: File, folder: string, onStatus?: (s: string) => void): Promise<Uploaded> {
  onStatus?.('Optimisation…')
  const { default: compress } = await import('browser-image-compression')
  const webp = await compress(file, {
    maxWidthOrHeight: 2400,
    fileType: 'image/webp',
    initialQuality: 0.82,
    maxSizeMB: 0.6,
    useWebWorker: true,
    onProgress: (p) => onStatus?.(`Optimisation… ${Math.round(p)} %`),
  })
  const bitmap = await createImageBitmap(webp)
  const size = { width: bitmap.width, height: bitmap.height }
  bitmap.close()
  onStatus?.('Envoi…')
  const path = `${folder}/${crypto.randomUUID()}.webp`
  const supabase = createSupabaseBrowserClient()
  const { error } = await supabase.storage.from('media').upload(path, webp, { contentType: 'image/webp', cacheControl: '31536000' })
  if (error) throw error
  return { path, ...size }
}

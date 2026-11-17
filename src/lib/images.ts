import { publicEnv } from '@/lib/env'

/**
 * Resolves an image path stored in the database: absolute site paths ("/images/…", seeded photos shipped
 * with the site) are returned as-is; anything else is a key in the Supabase "media" bucket.
 */
export function mediaUrl(path: string | null | undefined): string | null {
  if (!path) return null
  if (path.startsWith('/') || path.startsWith('http')) return path
  const base = publicEnv.NEXT_PUBLIC_SUPABASE_URL
  if (!base) return null
  return `${base}/storage/v1/object/public/media/${path}`
}

export function isStoragePath(path: string | null | undefined): path is string {
  return Boolean(path && !path.startsWith('/') && !path.startsWith('http'))
}

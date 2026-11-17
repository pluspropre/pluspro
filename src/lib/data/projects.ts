import 'server-only'
import { cacheLife, cacheTag } from 'next/cache'
import { getPublicClient } from '@/lib/supabase/public'
import { fallbackProjects } from '@/content/fallback'
import type { Tables } from '@/lib/supabase/database.types'

export type Project = Pick<
  Tables<'projects'>,
  | 'id'
  | 'title'
  | 'description'
  | 'service_slug'
  | 'city'
  | 'before_path'
  | 'before_alt'
  | 'after_path'
  | 'after_alt'
  | 'width'
  | 'height'
  | 'performed_on'
  | 'is_featured'
>

async function fetchProjects(): Promise<Project[]> {
  'use cache'
  cacheTag('projects')
  cacheLife('hours')
  const supabase = getPublicClient()
  if (!supabase) return fallbackProjects
  const { data, error } = await supabase
    .from('projects')
    .select(
      'id, title, description, service_slug, city, before_path, before_alt, after_path, after_alt, width, height, performed_on, is_featured',
    )
    .eq('is_published', true)
    .order('sort_order', { ascending: true })
    .order('performed_on', { ascending: false, nullsFirst: false })
  if (error) {
    console.error('[data] projects', error.message)
    return []
  }
  return data
}

export async function getProjects(opts: { service?: string; featured?: boolean; limit?: number } = {}) {
  let list = await fetchProjects()
  if (opts.service) list = list.filter((p) => p.service_slug === opts.service)
  if (opts.featured) {
    const featured = list.filter((p) => p.is_featured && p.before_path)
    list = featured.length > 0 ? featured : list.filter((p) => p.before_path)
  }
  return opts.limit ? list.slice(0, opts.limit) : list
}

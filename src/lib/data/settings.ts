import 'server-only'
import { cacheLife, cacheTag } from 'next/cache'
import { getPublicClient } from '@/lib/supabase/public'
import { defaultSettings, parseSettings, type SiteSettings } from '@/lib/settings'

export async function getSettings(): Promise<SiteSettings> {
  'use cache'
  cacheTag('settings')
  cacheLife('hours')
  const supabase = getPublicClient()
  if (!supabase) return defaultSettings
  const { data, error } = await supabase.from('site_settings').select('*').eq('id', 1).maybeSingle()
  if (error) {
    console.error('[data] settings', error.message)
    return defaultSettings
  }
  return parseSettings(data)
}

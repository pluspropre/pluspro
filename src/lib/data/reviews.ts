import 'server-only'
import { cacheLife, cacheTag } from 'next/cache'
import { getPublicClient } from '@/lib/supabase/public'
import { fallbackReviews } from '@/content/fallback'
import type { Tables } from '@/lib/supabase/database.types'

export type Review = Pick<
  Tables<'reviews'>,
  'id' | 'author_name' | 'author_context' | 'rating' | 'content' | 'source' | 'source_url' | 'review_date' | 'service_slugs' | 'is_featured'
>
export type ReviewStats = { count: number; average: number | null }

async function fetchReviews(): Promise<Review[]> {
  'use cache'
  cacheTag('reviews')
  cacheLife('hours')
  const supabase = getPublicClient()
  if (!supabase) return fallbackReviews
  const { data, error } = await supabase
    .from('reviews')
    .select('id, author_name, author_context, rating, content, source, source_url, review_date, service_slugs, is_featured')
    .eq('is_published', true)
    .order('sort_order', { ascending: true })
    .order('review_date', { ascending: false, nullsFirst: false })
  if (error) {
    console.error('[data] reviews', error.message)
    return []
  }
  return data
}

/** Published reviews. With `service`, reviews tagged with it first, falling back to featured ones. */
export async function getReviews(opts: { service?: string; limit?: number } = {}): Promise<Review[]> {
  const all = await fetchReviews()
  let list = all
  if (opts.service) {
    const tagged = all.filter((r) => r.service_slugs.includes(opts.service!))
    list = tagged.length > 0 ? tagged : all.filter((r) => r.is_featured).length > 0 ? all.filter((r) => r.is_featured) : all
  }
  return opts.limit ? list.slice(0, opts.limit) : list
}

export async function getReviewStats(): Promise<ReviewStats> {
  const all = await fetchReviews()
  if (all.length === 0) return { count: 0, average: null }
  const average = Math.round((all.reduce((sum, r) => sum + r.rating, 0) / all.length) * 10) / 10
  return { count: all.length, average }
}

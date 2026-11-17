import 'server-only'
import { cacheLife, cacheTag } from 'next/cache'
import { getPublicClient } from '@/lib/supabase/public'
import type { Tables } from '@/lib/supabase/database.types'

export const POSTS_PER_PAGE = 9

export type Category = Tables<'post_categories'>
export type PostSummary = Pick<
  Tables<'posts'>,
  'id' | 'slug' | 'title' | 'excerpt' | 'cover_path' | 'cover_alt' | 'published_at' | 'updated_at' | 'reading_minutes' | 'service_slugs'
> & { category: Pick<Category, 'slug' | 'name'> | null }
export type PostImage = Pick<Tables<'post_images'>, 'id' | 'path' | 'alt' | 'caption' | 'width' | 'height'>
export type Post = PostSummary &
  Pick<Tables<'posts'>, 'content_html' | 'seo_title' | 'seo_description' | 'author_name'> & { images: PostImage[] }

const summaryColumns =
  'id, slug, title, excerpt, cover_path, cover_alt, published_at, updated_at, reading_minutes, service_slugs, category:post_categories(slug, name)'

const defaultCategories: Category[] = [
  { id: 'c1', slug: 'conseils', name: 'Conseils', description: 'Nos conseils d’entretien pour garder vos locaux propres plus longtemps.', sort_order: 1 },
  { id: 'c2', slug: 'chantiers-realises', name: 'Chantiers réalisés', description: 'Avant / après et retours d’expérience sur nos interventions à Strasbourg.', sort_order: 2 },
  { id: 'c3', slug: 'vie-de-l-entreprise', name: 'Vie de l’entreprise', description: 'Les actualités de l’équipe +Propre.', sort_order: 3 },
]

export async function getCategories(): Promise<Category[]> {
  'use cache'
  cacheTag('posts')
  cacheLife('hours')
  const supabase = getPublicClient()
  if (!supabase) return defaultCategories
  const { data, error } = await supabase.from('post_categories').select('*').order('sort_order')
  if (error) {
    console.error('[data] categories', error.message)
    return []
  }
  return data
}

/** Published posts (scheduled ones appear once `published_at` has passed; lists expire hourly). */
export async function getPublishedPosts(
  opts: { page?: number; category?: string; service?: string; limit?: number } = {},
): Promise<{ posts: PostSummary[]; total: number }> {
  'use cache'
  cacheTag('posts')
  cacheLife('hours')
  const supabase = getPublicClient()
  if (!supabase) return { posts: [], total: 0 }
  const limit = opts.limit ?? POSTS_PER_PAGE
  const page = Math.max(1, opts.page ?? 1)
  let categoryId: string | null = null
  if (opts.category) {
    const { data: cat } = await supabase.from('post_categories').select('id').eq('slug', opts.category).maybeSingle()
    if (!cat) return { posts: [], total: 0 }
    categoryId = cat.id
  }
  let query = supabase
    .from('posts')
    .select(summaryColumns, { count: 'exact' })
    .eq('status', 'published')
    .lte('published_at', new Date().toISOString())
    .order('published_at', { ascending: false })
    .range((page - 1) * limit, page * limit - 1)
  if (categoryId) query = query.eq('category_id', categoryId)
  if (opts.service) query = query.contains('service_slugs', [opts.service])
  const { data, error, count } = await query
  if (error) {
    console.error('[data] posts', error.message)
    return { posts: [], total: 0 }
  }
  return { posts: data as unknown as PostSummary[], total: count ?? 0 }
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  'use cache'
  cacheTag('posts', `post:${slug}`)
  cacheLife('hours')
  const supabase = getPublicClient()
  if (!supabase) return null
  const { data, error } = await supabase
    .from('posts')
    .select(
      `${summaryColumns}, content_html, seo_title, seo_description, author_name, images:post_images(id, path, alt, caption, width, height, sort_order)`,
    )
    .eq('slug', slug)
    .eq('status', 'published')
    .lte('published_at', new Date().toISOString())
    .maybeSingle()
  if (error) {
    console.error('[data] post', error.message)
    return null
  }
  if (!data) return null
  const post = data as unknown as Post & { images: (PostImage & { sort_order: number })[] }
  post.images = [...post.images].sort((a, b) => a.sort_order - b.sort_order)
  return post
}

/** Slugs + last modification, for generateStaticParams and the sitemap. */
export async function getAllPostSlugs(): Promise<{ slug: string; updated_at: string }[]> {
  'use cache'
  cacheTag('posts')
  cacheLife('hours')
  const supabase = getPublicClient()
  if (!supabase) return []
  const { data, error } = await supabase
    .from('posts')
    .select('slug, updated_at')
    .eq('status', 'published')
    .lte('published_at', new Date().toISOString())
  if (error) return []
  return data
}

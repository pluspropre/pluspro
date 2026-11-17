'use server'
import { revalidatePath, updateTag } from 'next/cache'
import { z } from 'zod'
import { adminContext, NOT_ALLOWED, zodFieldErrors, type ActionResult } from '@/lib/admin/action'
import { renderPostHtml } from '@/lib/admin/renderPost'
import { isStoragePath } from '@/lib/images'
import { pingIndexNow } from '@/lib/indexnow'
import type { Json } from '@/lib/supabase/database.types'
import { postSchema } from '@/lib/validation/post'

function refresh(slugs: string[]) {
  updateTag('posts')
  slugs.forEach((s) => updateTag(`post:${s}`))
  revalidatePath('/sitemap.xml')
  revalidatePath('/admin/articles')
}

export async function savePost(input: unknown): Promise<ActionResult<{ id: string; slug: string }>> {
  const ctx = await adminContext()
  if (!ctx) return NOT_ALLOWED
  const parsed = postSchema.safeParse(input)
  if (!parsed.success) return { ok: false, error: 'Certains champs sont à corriger.', fieldErrors: zodFieldErrors(parsed.error.issues) }
  const { id, images, content_json, ...v } = parsed.data

  if (v.status === 'published' && !v.published_at) v.published_at = new Date().toISOString()

  // slug must be unique
  const { data: clash } = await ctx.supabase.from('posts').select('id').eq('slug', v.slug).maybeSingle()
  if (clash && clash.id !== id) return { ok: false, error: 'Cette adresse est déjà utilisée.', fieldErrors: { slug: 'Adresse déjà utilisée par un autre article.' } }

  const { html, minutes } = renderPostHtml(content_json)
  const row = {
    ...v,
    excerpt: v.excerpt || null,
    cover_alt: v.cover_alt || null,
    seo_title: v.seo_title || null,
    seo_description: v.seo_description || null,
    content_json: (content_json ?? null) as Json,
    content_html: html,
    reading_minutes: minutes,
  }

  let postId = id
  let oldSlug: string | null = null
  let oldCover: string | null = null
  if (id) {
    const { data: old } = await ctx.supabase.from('posts').select('slug, cover_path').eq('id', id).maybeSingle()
    oldSlug = old?.slug ?? null
    oldCover = old?.cover_path ?? null
    const { error } = await ctx.supabase.from('posts').update(row).eq('id', id)
    if (error) return { ok: false, error: 'Enregistrement impossible.' }
  } else {
    const { data, error } = await ctx.supabase.from('posts').insert({ ...row, created_by: ctx.admin.id }).select('id').single()
    if (error || !data) return { ok: false, error: 'Enregistrement impossible.' }
    postId = data.id
  }

  // gallery: replace the rows, delete files no longer used
  const { data: oldImages } = await ctx.supabase.from('post_images').select('path').eq('post_id', postId!)
  await ctx.supabase.from('post_images').delete().eq('post_id', postId!)
  if (images.length) {
    await ctx.supabase.from('post_images').insert(
      images.map((img, i) => ({ post_id: postId!, path: img.path, alt: img.alt, caption: img.caption || null, width: img.width ?? null, height: img.height ?? null, sort_order: i })),
    )
  }
  const keep = new Set([...images.map((i) => i.path), row.cover_path])
  const orphans = [...(oldImages ?? []).map((i) => i.path), oldCover].filter((p): p is string => isStoragePath(p) && !keep.has(p))
  if (orphans.length) await ctx.supabase.storage.from('media').remove(orphans)

  refresh([v.slug, ...(oldSlug && oldSlug !== v.slug ? [oldSlug] : [])])
  if (v.status === 'published' && v.published_at && new Date(v.published_at) <= new Date()) {
    void pingIndexNow([`/actualites/${v.slug}`, '/actualites'])
  }
  const message =
    v.status === 'published'
      ? new Date(v.published_at!) > new Date()
        ? 'Article programmé.'
        : 'Article publié.'
      : v.status === 'archived'
        ? 'Article archivé.'
        : 'Brouillon enregistré.'
  return { ok: true, data: { id: postId!, slug: v.slug }, message }
}

export async function deletePost(id: string): Promise<ActionResult> {
  const ctx = await adminContext()
  if (!ctx) return NOT_ALLOWED
  if (!z.uuid().safeParse(id).success) return { ok: false, error: 'Article introuvable.' }
  const { data: old } = await ctx.supabase.from('posts').select('slug, cover_path, post_images(path)').eq('id', id).maybeSingle()
  const { error } = await ctx.supabase.from('posts').delete().eq('id', id)
  if (error) return { ok: false, error: 'Suppression impossible.' }
  const files = [old?.cover_path, ...((old?.post_images as { path: string }[] | undefined) ?? []).map((i) => i.path)].filter(isStoragePath)
  if (files.length) await ctx.supabase.storage.from('media').remove(files)
  refresh(old?.slug ? [old.slug] : [])
  return { ok: true }
}

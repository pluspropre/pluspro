'use server'
import { revalidatePath, updateTag } from 'next/cache'
import { z } from 'zod'
import { adminContext, NOT_ALLOWED, zodFieldErrors, type ActionResult } from '@/lib/admin/action'
import { reviewSchema } from '@/lib/validation/review'

function refresh() {
  updateTag('reviews')
  revalidatePath('/admin/avis')
}

export async function saveReview(input: unknown): Promise<ActionResult<{ id: string }>> {
  const ctx = await adminContext()
  if (!ctx) return NOT_ALLOWED
  const parsed = reviewSchema.safeParse(input)
  if (!parsed.success) return { ok: false, error: 'Certains champs sont à corriger.', fieldErrors: zodFieldErrors(parsed.error.issues) }
  const { id, ...v } = parsed.data
  const row = { ...v, author_context: v.author_context || null, source_url: v.source_url || null, review_date: v.review_date || null }
  if (id) {
    const { error } = await ctx.supabase.from('reviews').update(row).eq('id', id)
    if (error) return { ok: false, error: 'Enregistrement impossible.' }
    refresh()
    return { ok: true, data: { id } }
  }
  const { data: last } = await ctx.supabase.from('reviews').select('sort_order').order('sort_order', { ascending: false }).limit(1).maybeSingle()
  const { data, error } = await ctx.supabase.from('reviews').insert({ ...row, sort_order: (last?.sort_order ?? 0) + 1 }).select('id').single()
  if (error || !data) return { ok: false, error: 'Enregistrement impossible.' }
  refresh()
  return { ok: true, data: { id: data.id } }
}

const idSchema = z.uuid()

export async function toggleReview(id: string, field: 'is_published' | 'is_featured', value: boolean): Promise<ActionResult> {
  const ctx = await adminContext()
  if (!ctx) return NOT_ALLOWED
  if (!idSchema.safeParse(id).success) return { ok: false, error: 'Avis introuvable.' }
  const patch = field === 'is_published' ? { is_published: value } : { is_featured: value }
  const { error } = await ctx.supabase.from('reviews').update(patch).eq('id', id)
  if (error) return { ok: false, error: 'Mise à jour impossible.' }
  refresh()
  return { ok: true }
}

export async function moveReview(id: string, direction: 'up' | 'down'): Promise<ActionResult> {
  const ctx = await adminContext()
  if (!ctx) return NOT_ALLOWED
  const { data: list } = await ctx.supabase.from('reviews').select('id').order('sort_order').order('created_at')
  if (!list) return { ok: false, error: 'Mise à jour impossible.' }
  const i = list.findIndex((r) => r.id === id)
  const j = direction === 'up' ? i - 1 : i + 1
  if (i < 0 || j < 0 || j >= list.length) return { ok: true }
  ;[list[i], list[j]] = [list[j], list[i]]
  await Promise.all(list.map((r, idx) => ctx.supabase.from('reviews').update({ sort_order: idx + 1 }).eq('id', r.id)))
  refresh()
  return { ok: true }
}

export async function deleteReview(id: string): Promise<ActionResult> {
  const ctx = await adminContext()
  if (!ctx) return NOT_ALLOWED
  if (!idSchema.safeParse(id).success) return { ok: false, error: 'Avis introuvable.' }
  const { error } = await ctx.supabase.from('reviews').delete().eq('id', id)
  if (error) return { ok: false, error: 'Suppression impossible.' }
  refresh()
  return { ok: true }
}

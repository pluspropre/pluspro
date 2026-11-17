'use server'
import { revalidatePath, updateTag } from 'next/cache'
import { z } from 'zod'
import { adminContext, NOT_ALLOWED, zodFieldErrors, type ActionResult } from '@/lib/admin/action'
import { isStoragePath } from '@/lib/images'
import { pingIndexNow } from '@/lib/indexnow'
import { projectSchema } from '@/lib/validation/project'

function refresh() {
  updateTag('projects')
  revalidatePath('/admin/realisations')
}

export async function saveProject(input: unknown): Promise<ActionResult<{ id: string }>> {
  const ctx = await adminContext()
  if (!ctx) return NOT_ALLOWED
  const parsed = projectSchema.safeParse(input)
  if (!parsed.success) return { ok: false, error: 'Certains champs sont à corriger.', fieldErrors: zodFieldErrors(parsed.error.issues) }
  const { id, ...v } = parsed.data
  const row = {
    ...v,
    description: v.description || null,
    city: v.city || null,
    performed_on: v.performed_on || null,
    before_alt: v.before_path ? v.before_alt || null : null,
  }

  let saved: string
  if (id) {
    const { data: old } = await ctx.supabase.from('projects').select('before_path, after_path').eq('id', id).maybeSingle()
    const { error } = await ctx.supabase.from('projects').update(row).eq('id', id)
    if (error) return { ok: false, error: 'Enregistrement impossible.' }
    // remove replaced images from storage
    const orphans = [old?.before_path, old?.after_path].filter((p) => isStoragePath(p) && p !== row.before_path && p !== row.after_path)
    if (orphans.length) await ctx.supabase.storage.from('media').remove(orphans as string[])
    saved = id
  } else {
    const { data: last } = await ctx.supabase.from('projects').select('sort_order').order('sort_order', { ascending: false }).limit(1).maybeSingle()
    const { data, error } = await ctx.supabase
      .from('projects')
      .insert({ ...row, sort_order: (last?.sort_order ?? 0) + 1, created_by: ctx.admin.id })
      .select('id')
      .single()
    if (error || !data) return { ok: false, error: 'Enregistrement impossible.' }
    saved = data.id
  }
  refresh()
  if (row.is_published) void pingIndexNow(['/realisations'])
  return { ok: true, data: { id: saved }, message: row.is_published ? 'Réalisation publiée.' : 'Brouillon enregistré.' }
}

const idSchema = z.uuid()

export async function toggleProject(id: string, field: 'is_published' | 'is_featured', value: boolean): Promise<ActionResult> {
  const ctx = await adminContext()
  if (!ctx) return NOT_ALLOWED
  if (!idSchema.safeParse(id).success) return { ok: false, error: 'Réalisation introuvable.' }
  const patch = field === 'is_published' ? { is_published: value } : { is_featured: value }
  const { error } = await ctx.supabase.from('projects').update(patch).eq('id', id)
  if (error) return { ok: false, error: 'Mise à jour impossible.' }
  refresh()
  return { ok: true }
}

export async function moveProject(id: string, direction: 'up' | 'down'): Promise<ActionResult> {
  const ctx = await adminContext()
  if (!ctx) return NOT_ALLOWED
  const { data: list } = await ctx.supabase.from('projects').select('id, sort_order').order('sort_order').order('created_at')
  if (!list) return { ok: false, error: 'Mise à jour impossible.' }
  const i = list.findIndex((p) => p.id === id)
  const j = direction === 'up' ? i - 1 : i + 1
  if (i < 0 || j < 0 || j >= list.length) return { ok: true }
  const reordered = [...list]
  ;[reordered[i], reordered[j]] = [reordered[j], reordered[i]]
  await Promise.all(reordered.map((p, idx) => ctx.supabase.from('projects').update({ sort_order: idx + 1 }).eq('id', p.id)))
  refresh()
  return { ok: true }
}

export async function deleteProject(id: string): Promise<ActionResult> {
  const ctx = await adminContext()
  if (!ctx) return NOT_ALLOWED
  if (!idSchema.safeParse(id).success) return { ok: false, error: 'Réalisation introuvable.' }
  const { data: old } = await ctx.supabase.from('projects').select('before_path, after_path').eq('id', id).maybeSingle()
  const { error } = await ctx.supabase.from('projects').delete().eq('id', id)
  if (error) return { ok: false, error: 'Suppression impossible.' }
  const files = [old?.before_path, old?.after_path].filter(isStoragePath)
  if (files.length) await ctx.supabase.storage.from('media').remove(files)
  refresh()
  return { ok: true }
}

'use server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { z } from 'zod'
import { adminContext, NOT_ALLOWED, type ActionResult } from '@/lib/admin/action'

const id = z.uuid()

/** The only change allowed on a lead besides erasure: remembering it has been opened. */
export async function markLeadRead(leadId: string, read = true): Promise<ActionResult> {
  const ctx = await adminContext()
  if (!ctx) return NOT_ALLOWED
  if (!id.safeParse(leadId).success) return { ok: false, error: 'Demande introuvable.' }
  const { error } = await ctx.supabase
    .from('quote_requests')
    .update({ read_at: read ? new Date().toISOString() : null })
    .eq('id', leadId)
  if (error) return { ok: false, error: 'Mise à jour impossible.' }
  revalidatePath('/admin', 'layout')
  return { ok: true }
}

/** Right to erasure (RGPD): permanently deletes the request. */
export async function deleteLead(leadId: string): Promise<ActionResult> {
  const ctx = await adminContext()
  if (!ctx) return NOT_ALLOWED
  if (!id.safeParse(leadId).success) return { ok: false, error: 'Demande introuvable.' }
  const { error } = await ctx.supabase.from('quote_requests').delete().eq('id', leadId)
  if (error) return { ok: false, error: 'Suppression impossible.' }
  revalidatePath('/admin', 'layout')
  redirect('/admin/demandes')
}

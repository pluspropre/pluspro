'use server'
import { revalidatePath, updateTag } from 'next/cache'
import { adminContext, NOT_ALLOWED, zodFieldErrors, type ActionResult } from '@/lib/admin/action'
import { settingsSchema } from '@/lib/validation/settings'

export async function saveSettings(input: unknown): Promise<ActionResult> {
  const ctx = await adminContext()
  if (!ctx) return NOT_ALLOWED
  const parsed = settingsSchema.safeParse(input)
  if (!parsed.success) return { ok: false, error: 'Certains champs sont à corriger.', fieldErrors: zodFieldErrors(parsed.error.issues) }
  const v = parsed.data
  const { error } = await ctx.supabase
    .from('site_settings')
    .update({
      google_review_url: v.google_review_url || null,
      reviews_summary_label: v.reviews_summary_label,
      show_review_stats: v.show_review_stats,
      figures: v.figures,
      show_eco_products: v.show_eco_products,
      contract_terms: v.contract_terms || null,
      opening_hours: v.opening_hours,
      hours_note: v.hours_note || null,
      legal_form: v.legal_form || null,
      publication_director: v.publication_director || null,
    })
    .eq('id', 1)
  if (error) return { ok: false, error: 'Enregistrement impossible.' }
  updateTag('settings')
  revalidatePath('/admin/parametres')
  return { ok: true, message: 'Configuration enregistrée. Le site est à jour.' }
}

import { z } from 'zod'
import { figureSchema, openingDaySchema } from '@/lib/settings'

export const settingsSchema = z.object({
  google_review_url: z.url('Lien invalide (il doit commencer par https://).').optional().or(z.literal('')),
  reviews_summary_label: z.string().trim().min(2).max(80),
  show_review_stats: z.boolean(),
  figures: z.array(figureSchema).max(8),
  show_eco_products: z.boolean(),
  contract_terms: z.string().trim().max(400).optional(),
  opening_hours: z.array(openingDaySchema).length(7),
  hours_note: z.string().trim().max(200).optional(),
  legal_form: z.string().trim().max(160).optional(),
  publication_director: z.string().trim().max(120).optional(),
})
export type SettingsInput = z.infer<typeof settingsSchema>

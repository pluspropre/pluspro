import { z } from 'zod'
import { serviceSlugs } from '@/content/services'

export const reviewSources = [
  { value: 'google', label: 'Google' },
  { value: 'facebook', label: 'Facebook' },
  { value: 'pagesjaunes', label: 'PagesJaunes' },
  { value: 'trustpilot', label: 'Trustpilot' },
  { value: 'direct', label: 'Direct (client)' },
  { value: 'other', label: 'Autre' },
] as const

const slugs = serviceSlugs as unknown as [string, ...string[]]

export const reviewSchema = z.object({
  id: z.uuid().optional(),
  author_name: z.string().trim().min(2, 'Indiquez le nom affiché (prénom + initiale).').max(80),
  author_context: z.string().trim().max(120).optional(),
  rating: z.coerce.number().int().min(1, 'Note de 1 à 5.').max(5, 'Note de 1 à 5.'),
  content: z.string().trim().min(3, 'Collez le texte de l’avis.').max(3000),
  source: z.enum(['google', 'facebook', 'pagesjaunes', 'trustpilot', 'direct', 'other']),
  source_url: z.url('Lien invalide.').optional().or(z.literal('')),
  review_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional().or(z.literal('')),
  service_slugs: z.array(z.enum(slugs)).default([]),
  is_published: z.boolean(),
  is_featured: z.boolean(),
})
export type ReviewInput = z.infer<typeof reviewSchema>

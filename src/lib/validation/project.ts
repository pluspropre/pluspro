import { z } from 'zod'
import { serviceSlugs } from '@/content/services'

const slugs = serviceSlugs as unknown as [string, ...string[]]

export const projectSchema = z
  .object({
    id: z.uuid().optional(),
    title: z.string().trim().min(3, 'Donnez un titre (3 caractères minimum).').max(160),
    description: z.string().trim().max(600).optional(),
    service_slug: z.enum(slugs, { error: 'Choisissez le service.' }),
    city: z.string().trim().max(80).optional(),
    performed_on: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional().or(z.literal('')),
    before_path: z.string().max(300).nullable(),
    before_alt: z.string().trim().max(200).optional(),
    after_path: z.string({ error: 'La photo « après » est obligatoire.' }).min(1, 'La photo « après » est obligatoire.').max(300),
    after_alt: z.string().trim().min(3, 'Décrivez la photo « après » (texte alternatif).').max(200),
    width: z.number().int().positive().nullable(),
    height: z.number().int().positive().nullable(),
    is_published: z.boolean(),
    is_featured: z.boolean(),
  })
  .refine((v) => !v.before_path || (v.before_alt?.length ?? 0) >= 3, {
    message: 'Décrivez la photo « avant » (texte alternatif).',
    path: ['before_alt'],
  })

export type ProjectInput = z.infer<typeof projectSchema>

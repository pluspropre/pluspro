import { z } from 'zod'
import { serviceSlugs } from '@/content/services'

const slugs = serviceSlugs as unknown as [string, ...string[]]

export const postSchema = z.object({
  id: z.uuid().optional(),
  title: z.string().trim().min(3, 'Donnez un titre.').max(200),
  slug: z
    .string()
    .trim()
    .min(3, 'Adresse trop courte.')
    .max(90)
    .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, 'Lettres minuscules, chiffres et tirets uniquement.'),
  excerpt: z.string().trim().max(300).optional(),
  category_id: z.uuid().nullable(),
  service_slugs: z.array(z.enum(slugs)).default([]),
  cover_path: z.string().max(300).nullable(),
  cover_alt: z.string().trim().max(200).optional(),
  content_json: z.unknown(),
  seo_title: z.string().trim().max(70).optional(),
  seo_description: z.string().trim().max(170).optional(),
  status: z.enum(['draft', 'published', 'archived']),
  published_at: z.iso.datetime({ offset: true }).nullable(),
  images: z
    .array(
      z.object({
        path: z.string().max(300),
        alt: z.string().trim().max(200).default(''),
        caption: z.string().trim().max(200).optional(),
        width: z.number().int().nullable().optional(),
        height: z.number().int().nullable().optional(),
      }),
    )
    .max(30)
    .default([]),
})
export type PostInput = z.infer<typeof postSchema>

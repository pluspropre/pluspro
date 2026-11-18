import { z } from 'zod'
import { serviceSlugs } from '@/content/services'

export const frequencyOptions = [
  { value: 'quotidienne', label: 'Quotidienne' },
  { value: 'plusieurs-par-semaine', label: 'Plusieurs fois par semaine' },
  { value: 'hebdomadaire', label: 'Hebdomadaire' },
  { value: 'bimensuelle', label: 'Bimensuelle' },
  { value: 'mensuelle', label: 'Mensuelle' },
  { value: 'ponctuelle', label: 'Ponctuelle' },
] as const

export const typeValues = [...serviceSlugs, 'autre'] as unknown as [string, ...string[]]
const frequencyValues = frequencyOptions.map((o) => o.value) as [string, ...string[]]

export const ONE_OFF_TYPES = ['fin-de-bail', 'nettoyage-avant-vente', 'fin-de-chantier']

const optionalCount = z
  .union([z.literal(''), z.coerce.number().int().min(0, 'Nombre invalide').max(500, 'Nombre invalide')])
  .optional()

export const step1Schema = z.object({
  type: z.enum(typeValues, { error: 'Choisissez le type de prestation.' }),
  client: z.enum(['pro', 'particulier'], { error: 'Précisez si vous êtes un professionnel ou un particulier.' }),
})

export const step2Schema = z.object({
  surface: z.coerce
    .number({ error: 'Indiquez la surface en m² (un nombre).' })
    .int('Indiquez un nombre entier de m².')
    .min(1, 'Indiquez la surface en m².')
    .max(100000, 'Surface invalide.'),
  frequency: z.enum(frequencyValues, { error: 'Choisissez une fréquence.' }),
  postalCode: z.string().trim().regex(/^\d{5}$/, 'Code postal à 5 chiffres.'),
  city: z.string().trim().min(2, 'Indiquez la ville.').max(80),
  sanitaires: optionalCount,
  cuisines: optionalCount,
  bureaux: optionalCount,
  fenetres: optionalCount,
  startDate: z.string().trim().max(20).optional(),
})

export const step3Schema = z.object({
  fullName: z.string().trim().min(2, 'Indiquez votre nom et prénom.').max(120),
  company: z.string().trim().max(120).optional(),
  jobTitle: z.string().trim().max(120).optional(),
  email: z.email('Adresse e-mail invalide.').trim().max(160),
  phone: z
    .string()
    .trim()
    .regex(/^(?:\+33\s?|0)[1-9](?:[\s.-]?\d{2}){4}$/, 'Numéro de téléphone français invalide (ex. 06 12 34 56 78).'),
  address: z.string().trim().max(200).optional(),
  message: z.string().trim().max(2000, '2 000 caractères maximum.').optional(),
  consent: z.literal(true, { error: 'Votre accord est nécessaire pour traiter la demande.' }),
})

export const quoteSchema = step1Schema.extend(step2Schema.shape).extend(step3Schema.shape)
export type QuoteInput = z.infer<typeof quoteSchema>

/** Extra anti-spam fields sent with the form, validated by the server action only. */
export const antiSpamSchema = z.object({
  website: z.string().max(0, 'spam').optional(), // honeypot
  startedAt: z.coerce.number().int().positive(),
  turnstileToken: z.string().optional(),
  sourcePath: z.string().max(200).optional(),
})

export function labelOf(list: readonly { value: string; label: string }[], value: string | undefined | null) {
  return list.find((o) => o.value === value)?.label ?? value ?? ''
}

import { z } from 'zod'
import { days, type DayKey } from '@/content/site'

export const figureSchema = z.object({
  key: z.string().min(1).max(40),
  prefix: z.string().max(4).default(''),
  value: z.string().min(1).max(10),
  suffix: z.string().max(8).default(''),
  label: z.string().min(1).max(80),
  description: z.string().max(240).default(''),
  enabled: z.boolean().default(true),
})
export type Figure = z.infer<typeof figureSchema>

export const openingDaySchema = z.object({
  day: z.enum(days.map((d) => d.key) as [DayKey, ...DayKey[]]),
  open: z.boolean(),
  opens: z.string().regex(/^\d{2}:\d{2}$/).default('08:00'),
  closes: z.string().regex(/^\d{2}:\d{2}$/).default('19:00'),
})
export type OpeningDay = z.infer<typeof openingDaySchema>

export type SiteSettings = {
  googleReviewUrl: string | null
  reviewsSummaryLabel: string
  showReviewStats: boolean
  figures: Figure[]
  showEcoProducts: boolean
  contractTerms: string | null
  openingHours: OpeningDay[]
  hoursNote: string | null
  legalForm: string | null
  publicationDirector: string | null
}

export const defaultFigures: Figure[] = [
  {
    key: 'sites',
    prefix: '+',
    value: '120',
    suffix: '',
    label: 'sites suivis chaque année',
    description:
      'Bureaux, cabinets, commerces, copropriétés : des sites entretenus toute l’année, avec le même niveau d’exigence.',
    enabled: true,
  },
  {
    key: 'quote',
    prefix: '',
    value: '24',
    suffix: 'h',
    label: 'pour recevoir votre devis',
    description: 'Décrivez vos locaux : vous recevez une proposition chiffrée et détaillée sous 24h.',
    enabled: true,
  },
  {
    key: 'availability',
    prefix: '',
    value: '7',
    suffix: 'j/7',
    label: 'plages d’intervention',
    description: 'Tôt le matin, en soirée ou le week-end : nous nous adaptons à vos horaires d’ouverture.',
    enabled: true,
  },
  {
    key: 'team',
    prefix: '',
    value: '100',
    suffix: '%',
    label: 'équipe déclarée et assurée',
    description: 'Des agents déclarés, assurés et formés à vos protocoles.',
    enabled: true,
  },
]

export const defaultSettings: SiteSettings = {
  googleReviewUrl: null,
  reviewsSummaryLabel: 'Avis clients vérifiés',
  showReviewStats: true,
  figures: defaultFigures,
  showEcoProducts: true,
  contractTerms: null,
  openingHours: [],
  hoursNote: null,
  legalForm: null,
  publicationDirector: null,
}

type SettingsRow = {
  google_review_url: string | null
  reviews_summary_label: string
  show_review_stats: boolean
  figures: unknown
  show_eco_products: boolean
  contract_terms: string | null
  opening_hours: unknown
  hours_note: string | null
  legal_form: string | null
  publication_director: string | null
}

export function parseSettings(row: SettingsRow | null): SiteSettings {
  if (!row) return defaultSettings
  const figures = z.array(figureSchema).safeParse(row.figures)
  const hours = z.array(openingDaySchema).safeParse(row.opening_hours)
  return {
    googleReviewUrl: row.google_review_url,
    reviewsSummaryLabel: row.reviews_summary_label,
    showReviewStats: row.show_review_stats,
    figures: figures.success ? figures.data : defaultFigures,
    showEcoProducts: row.show_eco_products,
    contractTerms: row.contract_terms?.trim() || null,
    openingHours: hours.success ? hours.data : [],
    hoursNote: row.hours_note?.trim() || null,
    legalForm: row.legal_form?.trim() || null,
    publicationDirector: row.publication_director?.trim() || null,
  }
}

export function enabledFigure(settings: SiteSettings, key: string): Figure | undefined {
  return settings.figures.find((f) => f.key === key && f.enabled)
}

/** Groups consecutive days with identical hours: "Lundi – Vendredi : 08:00 – 19:00". */
export function summariseHours(hours: OpeningDay[]): { days: string; hours: string }[] {
  const open = days.map((d) => ({ ...d, slot: hours.find((h) => h.day === d.key) }))
  const groups: { from: string; to: string; hours: string }[] = []
  for (const d of open) {
    const label = d.slot?.open ? `${d.slot.opens.replace(':', 'h')} – ${d.slot.closes.replace(':', 'h')}` : 'Fermé'
    const last = groups.at(-1)
    if (last && last.hours === label) last.to = d.label
    else groups.push({ from: d.label, to: d.label, hours: label })
  }
  if (groups.length === 1 && groups[0].hours === 'Fermé') return []
  return groups.map((g) => ({ days: g.from === g.to ? g.from : `${g.from} – ${g.to}`, hours: g.hours }))
}

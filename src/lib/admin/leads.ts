import { getService } from '@/content/services'
import type { Tables } from '@/lib/supabase/database.types'
import { frequencyOptions, labelOf } from '@/lib/validation/quote'

/** Labels of fields removed from the form (18/11/2026), kept so older requests still read well in the admin. */
export const legacyLabels = {
  surface: [
    { value: 'moins-100', label: 'Moins de 100 m²' },
    { value: '100-300', label: '100 à 300 m²' },
    { value: '300-1000', label: '300 à 1 000 m²' },
    { value: 'plus-1000', label: 'Plus de 1 000 m²' },
  ],
  callback: [
    { value: 'matin', label: 'Le matin' },
    { value: 'midi', label: 'Le midi' },
    { value: 'apres-midi', label: 'L’après-midi' },
    { value: 'indifferent', label: 'Indifférent' },
  ],
  access: [
    { value: 'ascenseur', label: 'Ascenseur' },
    { value: 'parking', label: 'Parking' },
    { value: 'badge', label: 'Badge / code d’accès' },
  ],
}

export type Lead = Tables<'quote_requests'>

export function leadService(l: Pick<Lead, 'service_slug'>) {
  return l.service_slug === 'autre' ? 'Autre besoin' : (getService(l.service_slug ?? '')?.name ?? 'Non précisé')
}

/** New requests store "250 m²"; older ones a range code, optionally followed by "(250 m²)". */
export function leadSurface(l: Pick<Lead, 'surface'>) {
  if (!l.surface) return ''
  const [code, ...rest] = l.surface.split(' ')
  const range = legacyLabels.surface.find((o) => o.value === code)
  return range ? `${range.label}${rest.length ? ` ${rest.join(' ')}` : ''}` : l.surface
}

export const leadFrequency = (l: Pick<Lead, 'frequency'>) => labelOf(frequencyOptions, l.frequency)
export const leadCallback = (l: Pick<Lead, 'callback_time'>) => (l.callback_time ? labelOf(legacyLabels.callback, l.callback_time) : '')

/** "06 12 34 56 78" → "+33612345678" for tel: and WhatsApp links. */
export function e164(phone: string) {
  const digits = phone.replace(/[^\d+]/g, '')
  if (digits.startsWith('+')) return digits
  if (digits.startsWith('0')) return `+33${digits.slice(1)}`
  return digits
}

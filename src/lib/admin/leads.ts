import { getService } from '@/content/services'
import type { Tables } from '@/lib/supabase/database.types'
import { callbackOptions, frequencyOptions, labelOf, surfaceOptions } from '@/lib/validation/quote'

export type Lead = Tables<'quote_requests'>

export function leadService(l: Pick<Lead, 'service_slug'>) {
  return l.service_slug === 'autre' ? 'Autre besoin' : (getService(l.service_slug ?? '')?.name ?? 'Non précisé')
}

export function leadSurface(l: Pick<Lead, 'surface'>) {
  if (!l.surface) return ''
  const [code, ...rest] = l.surface.split(' ')
  return `${labelOf(surfaceOptions, code)}${rest.length ? ` ${rest.join(' ')}` : ''}`
}

export const leadFrequency = (l: Pick<Lead, 'frequency'>) => labelOf(frequencyOptions, l.frequency)
export const leadCallback = (l: Pick<Lead, 'callback_time'>) => (l.callback_time ? labelOf(callbackOptions, l.callback_time) : '')

/** "06 12 34 56 78" → "+33612345678" for tel: and WhatsApp links. */
export function e164(phone: string) {
  const digits = phone.replace(/[^\d+]/g, '')
  if (digits.startsWith('+')) return digits
  if (digits.startsWith('0')) return `+33${digits.slice(1)}`
  return digits
}

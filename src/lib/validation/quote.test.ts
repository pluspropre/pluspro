import { describe, expect, it } from 'vitest'
import { antiSpamSchema, quoteSchema, step1Schema, step3Schema } from './quote'

const valid = {
  type: 'cabinets-medicaux',
  client: 'pro',
  surface: '100-300',
  frequency: 'hebdomadaire',
  postalCode: '67000',
  city: 'Strasbourg',
  fullName: 'Jean Dupont',
  email: 'jean@example.fr',
  phone: '06 12 34 56 78',
  consent: true,
}

describe('quote schema', () => {
  it('accepts a complete request', () => {
    expect(quoteSchema.safeParse(valid).success).toBe(true)
  })
  it('treats an unselected optional radio (null) as empty', () => {
    expect(quoteSchema.safeParse({ ...valid, callbackTime: null, acces: false }).success).toBe(true)
  })
  it('requires consent', () => {
    const r = quoteSchema.safeParse({ ...valid, consent: false })
    expect(r.success).toBe(false)
  })
  it('rejects unknown services and bad postal codes', () => {
    expect(step1Schema.safeParse({ type: 'piscine', client: 'pro' }).success).toBe(false)
    expect(quoteSchema.safeParse({ ...valid, postalCode: '6700' }).success).toBe(false)
  })
  it('validates French phone numbers', () => {
    const phone = (p: string) => step3Schema.shape.phone.safeParse(p).success
    expect(phone('0612345678')).toBe(true)
    expect(phone('+33 6 12 34 56 78')).toBe(true)
    expect(phone('12345')).toBe(false)
  })
  it('flags the honeypot', () => {
    expect(antiSpamSchema.safeParse({ website: 'http://spam', startedAt: 1 }).success).toBe(false)
    expect(antiSpamSchema.safeParse({ website: '', startedAt: 1 }).success).toBe(true)
  })
})

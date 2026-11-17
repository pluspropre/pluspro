import { describe, expect, it } from 'vitest'
import { services } from '@/content/services'
import { defaultSettings } from '@/lib/settings'
import { breadcrumbLd, businessGraph, faqLd, serviceLd } from './jsonld'

describe('JSON-LD builders', () => {
  it('describes the local business without self-serving review markup', () => {
    const g = businessGraph({ ...defaultSettings, openingHours: [{ day: 'Mo', open: true, opens: '08:00', closes: '18:00' }] })
    const biz = g['@graph'][0] as Record<string, unknown>
    expect(biz.telephone).toBe('+33765551111')
    expect(biz).not.toHaveProperty('aggregateRating')
    expect(biz.openingHoursSpecification).toHaveLength(1)
  })
  it('builds breadcrumbs with absolute URLs', () => {
    const b = breadcrumbLd([{ name: 'Accueil', path: '/' }, { name: 'Services', path: '/services' }])
    expect(b.itemListElement[1].item).toBe('https://www.plus-propre.fr/services')
  })
  it('emits a Service and a FAQPage for every service page', () => {
    for (const s of services) {
      expect(serviceLd(s).provider).toEqual({ '@id': 'https://www.plus-propre.fr/#business' })
      expect(faqLd(s.faq).mainEntity.length).toBeGreaterThanOrEqual(4)
    }
  })
})

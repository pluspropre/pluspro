import { describe, expect, it } from 'vitest'
import { defaultSettings, enabledFigure, parseSettings, summariseHours } from './settings'

describe('settings', () => {
  it('falls back to defaults on invalid JSON columns', () => {
    const s = parseSettings({
      google_review_url: null,
      reviews_summary_label: 'x',
      show_review_stats: true,
      figures: 'oops',
      show_eco_products: true,
      contract_terms: '  ',
      opening_hours: null,
      hours_note: null,
      legal_form: null,
      publication_director: null,
    })
    expect(s.figures).toEqual(defaultSettings.figures)
    expect(s.contractTerms).toBeNull()
    expect(s.openingHours).toEqual([])
  })
  it('hides figures the admin has not confirmed', () => {
    const s = { ...defaultSettings, figures: defaultSettings.figures.map((f) => ({ ...f, enabled: f.key !== 'sites' })) }
    expect(enabledFigure(s, 'sites')).toBeUndefined()
    expect(enabledFigure(s, 'quote')?.value).toBe('24')
  })
  it('groups consecutive days with the same hours', () => {
    const week = ['Mo', 'Tu', 'We', 'Th', 'Fr'].map((day) => ({ day: day as 'Mo', open: true, opens: '08:00', closes: '19:00' }))
    expect(summariseHours([...week, { day: 'Sa', open: false, opens: '08:00', closes: '12:00' }])).toEqual([
      { days: 'Lundi – Vendredi', hours: '08h00 – 19h00' },
      { days: 'Samedi – Dimanche', hours: 'Fermé' },
    ])
    expect(summariseHours([])).toEqual([])
  })
})

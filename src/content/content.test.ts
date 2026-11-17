import { describe, expect, it } from 'vitest'
import { getGeneralFaq, getHomeFaq } from './faq'
import { services } from './services'

const words = (s: string) => s.split(/\s+/).filter(Boolean).length

describe('content rules (CLAUDE.md §9)', () => {
  const all = JSON.stringify(services) + JSON.stringify(getGeneralFaq()) + JSON.stringify(getHomeFaq())
  it('never promises 24/7 or "satisfaction visée"', () => {
    expect(all).not.toMatch(/24\s*\/\s*7/)
    expect(all.toLowerCase()).not.toContain('satisfaction visée')
  })
  it('has 9 service pages with unique slugs and valid meta lengths', () => {
    expect(services).toHaveLength(9)
    expect(new Set(services.map((s) => s.slug)).size).toBe(9)
    for (const s of services) {
      expect(s.metaTitle.length).toBeLessThanOrEqual(60)
      expect(s.metaDescription.length).toBeGreaterThanOrEqual(120)
      expect(s.metaDescription.length).toBeLessThanOrEqual(160)
      expect(s.related.every((r) => services.some((x) => x.slug === r))).toBe(true)
    }
  })
  it('gives each service page at least 500 words of specific content', () => {
    for (const s of services) {
      const text = [s.intro, s.hook.text, ...s.painPoints, ...s.method.flatMap((m) => [m.title, m.text]), ...s.tasks.flatMap((t) => t.items), ...s.frequencies.map((f) => f.text), ...s.faq.flatMap((f) => [f.q, f.a])].join(' ')
      expect(words(text)).toBeGreaterThanOrEqual(500)
    }
  })
  it('uses the admin contract terms in the FAQ and never a placeholder', () => {
    expect(JSON.stringify(getHomeFaq())).not.toContain('À COMPLÉTER')
    expect(JSON.stringify(getHomeFaq('Engagement de 3 mois minimum.'))).toContain('Engagement de 3 mois minimum.')
  })
})

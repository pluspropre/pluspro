import { describe, expect, it } from 'vitest'
import { formatRating, initials, readingTime, slugify, truncate } from './utils'

describe('slugify', () => {
  it('handles French accents, apostrophes and punctuation', () => {
    expect(slugify('Fin de bail à Strasbourg : la check-list')).toBe('fin-de-bail-a-strasbourg-la-check-list')
    expect(slugify('L’hygiène en cabinet médical ?')).toBe('l-hygiene-en-cabinet-medical')
    expect(slugify('Œuvre & cœur')).toBe('oeuvre-coeur')
  })
  it('never produces leading/trailing or double dashes', () => {
    expect(slugify('  --Bonjour   !! -- ')).toBe('bonjour')
  })
})

describe('readingTime', () => {
  it('counts ~200 words per minute with a minimum of 1', () => {
    expect(readingTime('<p>court</p>')).toBe(1)
    expect(readingTime(`<p>${'mot '.repeat(600)}</p>`)).toBe(3)
  })
})

describe('helpers', () => {
  it('formats ratings the French way', () => expect(formatRating(4.8)).toBe('4,8'))
  it('builds initials', () => expect(initials('Isabelle B.')).toBe('IB'))
  it('truncates on word boundaries', () => expect(truncate('Une phrase assez longue', 12)).toBe('Une phrase…'))
})

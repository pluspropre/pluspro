export const CONSENT_COOKIE = 'pp_consent'
export const CONSENT_VERSION = 2
export const CONSENT_MAX_AGE = 60 * 60 * 24 * 182 // ≈ 6 months

export type ConsentState = { v: number; ts: number; external: boolean; marketing: boolean }

export function parseConsent(raw: string | undefined | null): ConsentState | null {
  if (!raw) return null
  try {
    const parsed = JSON.parse(decodeURIComponent(raw)) as Partial<ConsentState>
    if (parsed.v !== CONSENT_VERSION || typeof parsed.ts !== 'number') return null
    if (Date.now() - parsed.ts > CONSENT_MAX_AGE * 1000) return null
    return { v: parsed.v, ts: parsed.ts, external: Boolean(parsed.external), marketing: parsed.marketing === true }
  } catch {
    return null
  }
}

export function serializeConsent(external: boolean, marketing = false): string {
  return encodeURIComponent(JSON.stringify({ v: CONSENT_VERSION, ts: Date.now(), external, marketing }))
}

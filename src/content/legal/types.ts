/**
 * Typed structure of the legal pages (/mentions-legales, /politique-de-confidentialite).
 * Text in blocks may contain inline links written as `[label](/path)` or `[label](https://…)`;
 * the renderer converts them to links. No other markdown is allowed.
 */

export type LegalSection = { id: string; title: string; blocks: LegalBlock[] }

export type LegalBlock =
  | { type: 'p'; text: string }
  | { type: 'ul'; items: string[] }
  | { type: 'table'; head: string[]; rows: string[][] }

export type LegalDoc = {
  title: string
  /** ISO date, e.g. 2026-11-12 */
  lastUpdated: string
  intro?: string
  sections: LegalSection[]
}

/** Values managed by the admin in the settings screen, passed at render time. */
export type LegalParams = { legalForm?: string | null; publicationDirector?: string | null }

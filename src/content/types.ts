export type ServiceGroup = 'secteur' | 'ponctuel'

export type ServiceSlug =
  | 'cabinets-medicaux'
  | 'centres-de-formation'
  | 'bureaux'
  | 'commerces'
  | 'coproprietes'
  | 'locations-courte-duree'
  | 'fin-de-bail'
  | 'nettoyage-avant-vente'
  | 'fin-de-chantier'

export type FaqItem = { q: string; a: string }

export type Service = {
  slug: ServiceSlug
  group: ServiceGroup
  order: number
  /** true until the copy is validated by the client after the interview */
  draft: boolean
  /** menu label, e.g. "Cabinets médicaux" */
  name: string
  /** one-liner used on cards and in the mega-menu */
  short: string
  /** "Nettoyage de cabinets médicaux à Strasbourg" */
  h1: string
  /** ≤ 60 characters */
  metaTitle: string
  /** 140–160 characters */
  metaDescription: string
  /** answer-first intro paragraph: what / for whom / where / how fast (2–3 sentences) */
  intro: string
  /** names the client's problem */
  hook: { title: string; text: string }
  /** 3–4 bullets for "Vous connaissez ça ?" */
  painPoints: string[]
  /** 3–5 steps of our protocol */
  method: { title: string; text: string }[]
  /** what we clean, by zone */
  tasks: { area: string; items: string[] }[]
  /** e.g. Quotidien, 3×/semaine, Hebdomadaire, Ponctuel */
  frequencies: { label: string; text: string }[]
  /** 3 short trust chips / guarantees */
  guarantees: string[]
  /** 4–6 questions, answers 40–80 words, self-contained */
  faq: FaqItem[]
  /** value used by /devis?type= */
  quotePrefill: { type: ServiceSlug; frequency?: string }
  /** related service slugs (2–3) */
  related: ServiceSlug[]
  photo: { src: string; alt: string }
  /** internal reference only (not rendered as a meta tag) */
  keywords: string[]
}

# 05 — Pages, navigation & content

All visible content is **French**, vouvoiement, concrete, no superlatives that can't be proven. Copy below is a
**draft brief**: final sector copy is written after the 30-minute client interview. Mark unvalidated copy with
`draft: true` in content files and list it in the QA checklist.

## 1. Sitemap

```
/                                   Accueil
/services                           Nos services (hub: Secteurs + Prestations ponctuelles)
  /services/cabinets-medicaux
  /services/centres-de-formation
  /services/bureaux
  /services/commerces
  /services/coproprietes
  /services/locations-courte-duree
  /services/fin-de-bail
  /services/nettoyage-avant-vente
  /services/fin-de-chantier
/realisations                       Nos réalisations (avant/après, CMS)
/a-propos                           À propos
/actualites                         Actualités (blog list, paginated ?page=2)
  /actualites/categorie/{conseils|chantiers-realises|vie-de-l-entreprise}
  /actualites/{slug}
/devis                              Demande de devis (funnel)
  /devis/merci                      Thank-you (noindex)
/mentions-legales
/politique-de-confidentialite
/admin/...                          Private (noindex, disallowed)
/contact  → 308 /devis
```

Why `/services/{slug}` (flat, one level): matches the "Services" menu and breadcrumb ("Accueil › Services › Cabinets
médicaux"), short URLs, one dynamic route. The Secteurs / Prestations ponctuelles grouping is a navigation concept,
stored as `group` in content.

## 2. Navigation

- **Header**: Accueil · Services ▾ (mega-menu: Secteurs | Prestations ponctuelles | Tous nos services) · Réalisations ·
  À propos · Actualités · [Demander un devis]
- **Footer**: see `04` §4. Every service page is linked from the footer (internal linking).
- **Breadcrumbs** on every page except home.
- **Contextual links**: each service page links to 2–3 related services, the Réalisations filtered by that service,
  and related articles (same `service_slug` tag).

## 3. Business facts (`src/content/site.ts`) — single source of truth

```ts
export const site = {
  name: '+Propre',
  legalName: '[À COMPLÉTER : raison sociale]',
  url: 'https://www.plus-propre.fr',
  phone: { display: '07 65 55 11 11', e164: '+33765551111' },
  email: 'contact@plus-propre.fr',
  address: { street: '7 Rue de Koenigshoffen', postalCode: '67000', city: 'Strasbourg', region: 'Grand Est', country: 'FR' },
  geo: { lat: null, lng: null },            // fill from Google Business Profile pin
  areaServed: ['Strasbourg', 'Eurométropole de Strasbourg'], // + communes once confirmed
  hours: null,                               // e.g. [{ days: ['Mo','Tu','We','Th','Fr'], opens: '08:00', closes: '19:00' }]
  social: {
    instagram: 'https://www.instagram.com/plus_propre.fr/',
    facebook: 'https://www.facebook.com/people/Pluspropre/61576653958810/',
    linkedin: 'https://www.linkedin.com/company/propre-nettoyage/',
  },
  promises: { quoteDelay: '24h', availability: '7j/7' },
  figures: [ /* only client-validated figures, see 01 §4 */ ],
  siret: '99292494400018',
  vat: 'FR01992924944',
} as const
```

## 4. Page specifications

Every page: one H1, breadcrumbs (except home), final CTA block, JSON-LD per `07`, metadata per `07` §3.

### 4.1 Accueil `/`

Sections and motion: `04` §5. Content notes:
- Hero sub: "Bureaux, cabinets médicaux, commerces, copropriétés : des prestations sur mesure, une équipe formée et un devis sous 24h."
- Services grid cards link to `/services/bureaux`, `/services/cabinets-medicaux`, `/services/coproprietes`; tile → `/services`.
- Why cards copy (from mockup): *Un interlocuteur unique* — "Un seul contact pour le planning, les ajustements et les
  imprévus. Joignable, réactif, sans chaîne de décisions." · *Une équipe stable et formée* — "Les mêmes agents
  interviennent chez vous, formés à vos locaux, à vos accès et à vos exigences." · *Hygiène renforcée* — "Des
  protocoles adaptés aux cabinets médicaux et aux zones sensibles : surfaces de contact, sanitaires, salles d'attente."
- Home FAQ (4): visite sur place · interventions hors horaires · engagement de durée · produits utilisés (mockup texts).
- Add a short **"Zone d'intervention"** line in the stats or final CTA: "Strasbourg et l'Eurométropole" (+ communes).

### 4.2 Services hub `/services`

- H1 "Nos services de nettoyage à Strasbourg"; intro 2–3 sentences.
- Section **Secteurs** (6 cards, contrat régulier) and **Prestations ponctuelles** (3 cards) — card = photo/placeholder,
  title, one-liner, link.
- "Comment ça se passe" (reuse Process), reviews strip, FAQ (general), final CTA.

### 4.3 Service page template `/services/[slug]`

Content type (`src/content/services.ts`):

```ts
type Service = {
  slug: string; group: 'secteur' | 'ponctuel'; order: number; draft: boolean
  name: string                 // "Cabinets médicaux" (menu label)
  h1: string                   // "Nettoyage de cabinets médicaux à Strasbourg"
  metaTitle: string            // ≤ 60 chars
  metaDescription: string      // 140–160 chars
  hook: { title: string; text: string }   // names the client's problem
  painPoints: string[]         // 3–4 bullets "Vous connaissez…"
  method: { title: string; text: string }[]   // 3–5 steps of our protocol
  tasks: { area: string; items: string[] }[]  // what we clean, by zone (checklist)
  frequencies: { label: string; text: string }[] // e.g. Quotidien, 3×/semaine, Hebdomadaire, Ponctuel
  guarantees: string[]         // e.g. "Interventions hors heures de consultation"
  faq: { q: string; a: string }[]   // 4–6, answers 40–80 words, self-contained
  quotePrefill: { type: string }    // value used by /devis?type=
  related: string[]            // slugs
  photo?: { src: string; alt: string }
  keywords: string[]           // internal reference only (not a meta tag)
}
```

Page sections (in order):
1. **Hero (compact)**: breadcrumb, eyebrow (group name), H1, hook text, 2 CTAs ("Demander un devis pour {name}" →
   `/devis?type={slug}`, phone), 3 trust chips, photo/placeholder.
2. **"Vous connaissez ça ?"** — pain points.
3. **Notre méthode** — numbered steps (reuse Process visual).
4. **Ce que nous nettoyons** — checklist grid by zone.
5. **Fréquences possibles** — cards.
6. **Réalisations** — before/after or gallery filtered by `service_slug` (hidden if none).
7. **Avis** — reviews tagged with this service (fallback: featured reviews).
8. **FAQ du secteur** — accordion + `FAQPage` JSON-LD.
9. **Services liés** — 2–3 cards.
10. **Final CTA** pre-filled.

### 4.4 Draft briefs for the 9 service pages

Target queries are candidates to validate in Search Console after launch (no volume data was available).

| Slug | H1 | Hook (problem) | Key content points | Target queries |
|---|---|---|---|---|
| `cabinets-medicaux` | Nettoyage de cabinets médicaux à Strasbourg | Vos patients jugent l'hygiène dès la salle d'attente ; le ménage ne peut pas gêner les consultations. | Protocoles renforcés, désinfection des points de contact (poignées, interrupteurs, accoudoirs, TPE), sanitaires, salle d'attente, gestion des déchets non-DASRI, interventions avant/après consultations, confidentialité, produits virucides adaptés (norme EN 14476 — **only if client confirms**) | nettoyage cabinet médical Strasbourg, entretien cabinet médical, ménage cabinet kiné/dentaire Strasbourg |
| `centres-de-formation` | Nettoyage de centres de formation à Strasbourg | Des salles prêtes chaque matin, quel que soit l'enchaînement des sessions. | Remise en état des salles entre sessions, tables/chaises, tableaux, sanitaires à fort passage, espaces pause/cuisine, flexibilité de planning | nettoyage centre de formation Strasbourg, entretien salles de formation |
| `bureaux` | Nettoyage de bureaux à Strasbourg | Des espaces de travail nets sans perturber vos équipes. | Régularité, discrétion, tôt le matin ou le soir, postes de travail, open-spaces, salles de réunion, cuisine, sanitaires, vitres intérieures, interlocuteur unique | nettoyage bureaux Strasbourg, entreprise nettoyage bureaux Strasbourg, entretien locaux professionnels |
| `commerces` | Nettoyage de commerces et boutiques à Strasbourg | Une boutique impeccable à l'ouverture, une vitrine qui donne envie d'entrer. | Vitrines, sols selon revêtement, cabines, réserves, avant ouverture, centre-ville (accès, horaires de livraison) | nettoyage magasin Strasbourg, nettoyage vitrine Strasbourg, entretien boutique |
| `coproprietes` | Entretien de copropriétés à Strasbourg | Des parties communes entretenues et des résidents qui le remarquent ; un suivi simple pour le syndic. | Halls, cages d'escalier, ascenseurs, vitres des communs, sortie des conteneurs (si demandé), cahier de passage / compte rendu au syndic, interlocuteur unique | entretien parties communes Strasbourg, nettoyage copropriété Strasbourg, nettoyage cage d'escalier |
| `locations-courte-duree` | Ménage pour locations courte durée à Strasbourg | Rotation rapide entre deux voyageurs : un logement parfait à chaque arrivée. | Check-list photo, linge (à confirmer : fourniture/blanchisserie), réapprovisionnement consommables, signalement des dégâts, créneaux 11h–15h, week-ends | ménage Airbnb Strasbourg, nettoyage location courte durée Strasbourg |
| `fin-de-bail` | Nettoyage de fin de bail à Strasbourg | Un logement prêt pour l'état des lieux de sortie, pour récupérer votre dépôt de garantie. | Cuisine (four, hotte, frigo), salle de bain (calcaire), vitres, placards, sols, plinthes ; before/after (four, lavabo, baignoire) | nettoyage fin de bail Strasbourg, ménage état des lieux sortie |
| `nettoyage-avant-vente` | Nettoyage avant vente immobilière à Strasbourg | Un bien qui se présente au mieux pour les photos et les visites. | Remise en état complète, vitres, détails qui font la différence en photo, coordination avec l'agence | nettoyage avant vente maison Strasbourg, ménage avant visite |
| `fin-de-chantier` | Nettoyage de fin de chantier à Strasbourg | Poussières, traces de peinture et de plâtre : un lieu prêt à être livré. | Dépoussiérage complet, décapage traces, vitres et menuiseries (before/after fenêtre), sols, évacuation petits déchets (à confirmer), pour particuliers, artisans et promoteurs | nettoyage fin de chantier Strasbourg, nettoyage après travaux |

Avoid thin/duplicate pages: each page needs ≥ 500 words of **specific** content, its own FAQ and its own photos when
available. Don't create city-variation doorway pages.

### 4.5 Réalisations `/realisations`

- H1 "Nos réalisations" + intro (no working notes!).
- Filter chips by service (client-side filter on prerendered list; URL `?service=fin-de-bail` for shareability).
- Grid of project cards: before/after mini-slider or single photo, title (unique), service tag, city, short description.
- Click opens a lightbox (accessible dialog, Escape closes, focus trap) with the full slider.
- Data: Supabase `projects` (published), ordered by `sort_order`, then `performed_on desc`.
- JSON-LD: `CollectionPage` + `ImageObject`s are optional; at minimum `BreadcrumbList`.

### 4.6 À propos `/a-propos`

- H1 "À propos de +Propre". Story (who, since when — ask client), mission, how we work (Écoute et analyse; Protocole et
  régularité), priorities (Hygiène médicale; Rigueur & traçabilité; Respect des surfaces; Relation continue),
  validated figures, zone d'intervention (list of communes + optional click-to-load map, consent-gated), team photo,
  social links, general FAQ (6 questions from the current site, updated: 24h, 7j/7), final CTA.
- This page is the main **entity page** for AI search: state clearly who +Propre is, where, what, for whom, since when.

### 4.7 Actualités

- **List** `/actualites`: H1 "Actualités", category filter (links to category pages), featured latest post large, then
  grid 3 columns, 9 per page, pagination with real links (`?page=2`, canonical to itself, `rel` links not needed).
- **Category** `/actualites/categorie/[slug]`: H1 = category name, description, same grid.
- **Article** `/actualites/[slug]`: breadcrumb; category tag; H1; date published (and "Mis à jour le" if updated);
  author ("L'équipe +Propre" by default); reading time; cover image (priority); body (prose styles: h2/h3, lists,
  quotes, images with captions); **gallery** (grid + lightbox); share buttons (LinkedIn, Facebook, WhatsApp, copy link
  — plain links/`navigator.share`, no third-party scripts); related service CTA; 3 related posts; JSON-LD `BlogPosting`.
- Seed articles to draft (client validates): "3 réflexes pour garder vos locaux propres plus longtemps" (from the
  current Conseils section) and one "Chantier réalisé" using the oven before/after.

### 4.8 Devis `/devis` — quote funnel

Goal: fewer abandons, more complete requests (audit A12). **Need first, contact last.** 3 steps + review.

| Step | Title | Fields | Required |
|---|---|---|---|
| 1 | Votre besoin | **Type de prestation** as large selectable cards (the 9 services + "Autre") · **Client** : Professionnel / Particulier | type, client |
| 2 | Vos locaux | **Surface** (chips: < 100 m², 100–300, 300–1 000, > 1 000, or exact m²) · **Fréquence** (Quotidienne, Plusieurs fois par semaine, Hebdomadaire, Bimensuelle, Mensuelle, Ponctuelle) — hidden/defaulted to *Ponctuelle* for one-off services · **Code postal + ville** · optional details: nb sanitaires, cuisines/kitchenettes, bureaux/salles, surface vitrée, accès (ascenseur, parking, badge), date souhaitée de démarrage | surface, frequency (if recurring), postal code |
| 3 | Vos coordonnées | Nom et prénom · Société + fonction (if Professionnel) · E-mail · Téléphone · Moment préféré pour être rappelé (matin / midi / après-midi / indifférent) · Message · **Consent checkbox** (unchecked): "J'accepte que +Propre utilise ces informations pour traiter ma demande de devis et me recontacter. Voir la [politique de confidentialité]." · Turnstile widget · hidden honeypot | name, email, phone, consent |

Behaviour:
- Progress indicator "Étape n sur 3" + bar; Back/Next; per-step zod validation with inline French errors linked via
  `aria-describedby`; focus moves to the step heading on step change; errors summarised at top on submit.
- **Prefill** from query params: `/devis?type=cabinets-medicaux&surface=100-300&frequence=hebdomadaire` (from service
  CTAs and the home quote bar). If `type` and surface/frequency are prefilled, start on the first incomplete step.
- Persist progress in `sessionStorage` (cleared on success).
- Submit via server action `submitQuote` (see `03` §4): on success redirect to `/devis/merci`; on failure keep data
  and show a retry message with the phone number.
- Side panel (desktop) / top (mobile): "Devis gratuit sous 24h · Sans engagement · Visite sur place si besoin", phone
  link, 1 short review.
- Home quote bar button label: **"Continuer ma demande"** (not "Voir mon estimation").
- Track conversion: `track('quote_submitted', { type })` with Vercel Analytics custom events (requires Vercel Pro; if
  on Hobby, the `/devis/merci` page view is the conversion).

Emails (Resend, React Email templates, French):
- To +Propre: subject "Nouvelle demande de devis — {type} — {ville}", all fields in a table, reply-to = prospect.
- To prospect: "Votre demande de devis +Propre" — summary, "nous revenons vers vous sous 24h", phone, no marketing.

### 4.9 Legal pages

Content and structure in `08`. Simple prose layout, H1, table of contents for the privacy policy, last-updated date.

### 4.10 404 and errors

`not-found.tsx`: H1 "Page introuvable", links to home, services, devis, phone; returns **HTTP 404**. `error.tsx`
friendly message + retry. Both `noindex`.

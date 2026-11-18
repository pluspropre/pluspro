# 01 — Project brief

## 1. The client

| | |
|---|---|
| Brand | **+Propre** (written with the plus sign; wordmark "+PROPRE") |
| Activity | Professional cleaning (B2B first, some B2C one-off jobs) |
| Address | 7 Rue de Koenigshoffen, 67000 Strasbourg, France |
| SIRET | 992 924 944 00018 |
| VAT (TVA intracom.) | FR01992924944 |
| Phone | 07 65 55 11 11 → E.164 `+33765551111` |
| Email | contact@plus-propre.fr |
| Website | https://www.plus-propre.fr (apex `plus-propre.fr` redirects to `www`) |
| Instagram | https://www.instagram.com/plus_propre.fr/ — ~12.4k followers, most active channel |
| Facebook | https://www.facebook.com/people/Pluspropre/61576653958810/ |
| LinkedIn | https://www.linkedin.com/company/propre-nettoyage/ (public URL — **not** the `/uas/login…` admin link used today) |
| Client signatory | Heddi Nouralieva (signed the quote on 01/11/2026) |
| Service area | Strasbourg and surroundings (Eurométropole) — exact list of communes to confirm |

Target audiences, in priority order:

1. **Medical practices** (cabinets médicaux) — hygiene protocols, discretion, out-of-hours work
2. **Property managers / co-ownerships** (syndics, copropriétés) — common areas, reliability, reporting
3. **Offices & open spaces**, **training centres**, **shops**
4. **Short-term rental hosts** and **private individuals** for one-off jobs (end of lease, pre-sale, post-construction)

Positioning to convey: *a structured, serious company working for demanding professionals* — not a generic cleaning
template. Tone: confident, concrete, warm, vouvoiement, no exaggerated claims.

## 2. Scope (from signed quote "Devis AD202610-16 — Évolution et modernisation du site", 30/10/2026)

The client asked for four things; the quote adds a technical foundation, a redesign and an admin area.

| # | Deliverable | Notes |
|---|---|---|
| 1 | **Premium visual redesign, animations, UX** | Stronger typography, palette refined from the logo colours, logo showcased, airy layout with contrasted sections. Subtle animations (reveal on scroll, animated key figures, smooth page transitions, hover reactions). Light & fast on mobile; animations auto-disabled with reduced motion. Redesigned quote funnel: **need first** (premises type, surface, frequency), **contact details last**. Fix every issue found in the audit (see `02`). |
| 2 | **Admin area** | Private, secure, usable from computer **and phone**: write/publish articles with photos without technical skills; save drafts and **schedule** publication; **add before/after photos to "Réalisations" from the phone right after a job**; edit/remove any content. **Plus (decided after the quote): manage client reviews** (see #4). |
| 3 | **Legal & RGPD** | Mentions légales, privacy policy, CNIL-compliant cookie banner, consent checkbox on the quote form. Texts prepared by us, validated by the client. |
| 4 | **Reviews** | Originally "automatic Google reviews". **Decision (12/11/2026): no Google API.** Reviews are entered and managed in the admin (they can come from Google, Facebook or other platforms). Display: average rating + total count at the top, carousel of full reviews, "Laisser un avis" button opening the Google review page, reviews also shown on the relevant sector pages. |
| 5 | **Sector page template + 9 pages, copy included** | Menu groups **Secteurs** (6) and **Prestations ponctuelles** (3). Each page: hook naming the client's problem, method, possible frequencies, sector mini-FAQ, reviews, intervention photos, CTA to a quote pre-filled with the right sector. Copy written by us from a 30-minute interview with the client. |
| 6 | **Blog "Actualités"** | List page, article page with photos and gallery, categories (*Conseils*, *Chantiers réalisés*, *Vie de l'entreprise*), share buttons. Each article has its own SEO title/description. |
| 7 | **SEO foundation** | Migration to Next.js (server-rendered pages), unique title/description per page, social previews (Open Graph), sitemap, local business structured data, redirects. **Existing URLs must keep working.** |

### Sector pages (exact list from the quote)

**Secteurs**
1. Cabinets médicaux — reinforced hygiene protocols, contact points, interventions outside consultation hours
2. Centres de formation — rooms reset between sessions, high-traffic sanitary facilities
3. Bureaux & open-spaces — regularity, discretion, early morning or evening interventions
4. Commerces & boutiques — shop windows, floors, store always impeccable at opening
5. Copropriétés — common areas, stairwells, follow-up with the syndic
6. Locations courte durée — fast turnover between guests, linen, checklist

**Prestations ponctuelles**
7. Fin de bail / location — home ready for the check-out inventory, deposit recovery
8. Nettoyage avant vente — property looking its best for photos and visits
9. Fin de chantier — dust, paint and plaster traces, windows: a place ready to be handed over

### Out of scope (ask before doing)

- Online payment, client portal, booking calendar, price calculator (the mockup button "Voir mon estimation" must **not**
  promise an automatic price — see `05` §Quote funnel)
- Multilingual site (French only)
- Automatic import of reviews from Google/Facebook APIs
- Paid ads, social media management, logo redesign (we use a refined wordmark; a vector logo is requested from the client)

## 3. Success criteria

- More quote requests (primary KPI: submitted quote forms / month; secondary: phone clicks, email clicks)
- Every public page indexable with unique metadata; sector pages ranking for "nettoyage {secteur} Strasbourg" queries
- Lighthouse mobile ≥ 90 performance, ≥ 95 accessibility/best practices, 100 SEO on all templates
- Core Web Vitals "Good" (LCP < 2.5 s, INP < 200 ms, CLS < 0.1) on real-user data after launch
- Client can publish an article and a before/after from a phone without help

## 4. Client inputs

These are needed from the client. Until received, use the marked placeholder and keep this list updated.
**Blocking** items must be resolved before going live.

| Item | Needed for | Placeholder | Blocking |
|---|---|---|---|
| Legal form (EI, SASU, SARL…), share capital if company, RCS/RNE/RM registration | Mentions légales | `[À COMPLÉTER : forme juridique]` | Yes |
| Publication director (name) | Mentions légales | `[À COMPLÉTER : directeur de la publication]` | Yes |
| Opening hours / phone availability | Footer, JSON-LD `openingHoursSpecification`, contact | omit field | No |
| List of communes served | Zone section, JSON-LD `areaServed` | "Strasbourg et Eurométropole" | No |
| Validation of key figures: "+120 sites suivis chaque année", "7j/7", "devis sous 24h", "équipe déclarée et assurée", eco-labelled products | Home stats, hero chips | keep only validated figures | Yes |
| Minimum contract duration & notice period | FAQ "Y a-t-il un engagement de durée ?" | `[À COMPLÉTER : durée d'engagement minimale et préavis]` | Yes |
| Team photo (agent in uniform, ideally cut-out PNG, ≥ 1400 px tall) | Hero visual | branded SVG silhouette from mockup | No |
| Photos per sector (medical room, building hall, shop, training room…) | Service cards, sector pages | branded gradient placeholder | No |
| **Original-resolution** versions of the before/after photos (current files are 591×1280) | Before/after slider, gallery | current files | No |
| Vector logo (SVG/AI/PDF) | Header, favicon, OG images | mockup wordmark (`+` + "PROPRE") | No |
| Google review URL ("Demander des avis" link from Google Business Profile) | "Laisser un avis" button | link to Google search of the business | No |
| Existing reviews to import (text, first name + initial, rating, platform, date) + permission | Reviews seed | the 3 reviews currently on the live site | No |
| 30-minute interview notes | Sector page copy | drafts in `src/content/services.ts` flagged `draft: true` | Yes (for final copy) |
| Insurance (RC Pro) insurer & policy, if they want it shown | Trust section, legal | omit | No |
| Access: Supabase project, Vercel project, domain DNS (for Resend), Google Search Console, Cloudflare (Turnstile) | Setup | — | Yes |

## 5. Key decisions log

| Date | Decision |
|---|---|
| 01/11/2026 | Quote signed: all items accepted |
| 12/11/2026 | Backend = **one new Supabase project** for admin, blog, gallery, reviews, quote requests |
| 12/11/2026 | Reviews are **admin-managed** (multi-platform), no Google API |
| 12/11/2026 | The current GitHub repo (`pluspropre/pluspro`) is the technical baseline; the live site is the content reference (it is slightly newer than the repo) |
| 12/11/2026 | All work happens on branch `develop`; merging `develop` → `main` triggers the production deploy on Vercel |
| 12/11/2026 | Legal name **+PROPRE**, SIREN 992 924 944. Legal form, publication director, key figures, minimum contract length, opening hours and the Google review link are **managed by the client in the admin Configuration tab** (no code change needed) |
| 12/11/2026 | Client supplied a team photo and 8 illustrative photos (now in `public/images/photos`); the existing raster logo was redrawn as an SVG mark (`public/images/brand/logo-mark.svg`) |
| 18/11/2026 | Client supplied the official logo; the mark is now cropped from it as a transparent PNG (`public/images/brand/logo-mark.png`, also `logo.png`, `src/app/icon.png`, `apple-icon.png`), replacing the SVG redraw |
| 12/11/2026 | Quote requests are a **read-only inbox** in the admin: no confirm/cancel workflow; the team contacts the prospect by phone/e-mail. Only "mark unread", CSV export and RGPD deletion |

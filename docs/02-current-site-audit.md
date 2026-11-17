# 02 — Current site audit

Snapshot taken 12/11/2026 of the GitHub repo (`main`, single commit `f64a2ed4 "maj"`, 16/11/2025) and of the live
site https://www.plus-propre.fr.

## 1. Technical baseline

| Aspect | Current state | Problem |
|---|---|---|
| Framework | Create React App (`react-scripts` 5, deprecated), React 19, react-router-dom 7, TypeScript 4.9 | Client-side rendering only: crawlers receive `<div id="root"></div>`. CRA is unmaintained. |
| Routing | `BrowserRouter`; routes `/`, `/a-propos`, `/realisations`, `/devis` | `/contact` is linked (home CTA band) but has **no route** → blank page. Every unknown URL returns HTTP 200 (soft 404), including `/sitemap.xml`. |
| Metadata | One static `<title>` and description in `public/index.html` | Same title/description on every page; no Open Graph, no canonical, no structured data |
| `robots.txt` | `User-agent: * / Disallow:` | No sitemap reference; no sitemap exists |
| Manifest | CRA default ("React App", theme `#000000`) | Unbranded |
| Favicon | `index.html` points to `favicon.svg` which doesn't exist in the repo (live serves `favicon.ico`) | Broken in repo |
| Styling | Plain CSS per page; tokens in `src/styles.css` (with Russian comments); unused `App.css`, `index.css` | Dead CSS |
| Quote form | 4-step form in `src/pages/Devis.tsx`, posts JSON to Formspree `https://formspree.io/f/mzzyzkjq` | Asks 5 personal fields first; no consent checkbox; no anti-spam; **bugs**: `errors['Numéro de Телефон']` and `getFieldClass('Surface totale (м²)')` contain **Cyrillic characters**, so the phone error message and the surface error style never display |
| Analytics | Live bundle includes Vercel Web Analytics (`/_vercel/insights`) | Not present in repo code → repo is behind the deployment |
| Repo hygiene | **No `.gitignore`; 38,341 files of `node_modules/` are committed**. Repo is **public** on GitHub | Must untrack `node_modules`, add `.gitignore`, never commit secrets |
| Images | 23 files in `src/assets` (stock photos, up to 1.1 MB PNG), imported raw | No responsive images, no lazy-loading strategy, stock imagery |

### Live vs repo differences (live is newer)

The live site has, and the repo does not: a **"Avis de nos clients"** section with three hard-coded Google reviews and
links (`https://share.google/…`), Vercel Analytics, the email in the top bar, "devis sous 24h" (repo says 48h),
"Strasbourg et dans les environs". Decision: we don't need the newer code — the new site is a rebuild. **Use the live
site as the content reference** and this document as the inventory.

## 2. URL inventory (must keep working)

| URL | Current content | New site |
|---|---|---|
| `/` | Home | Home (redesigned) |
| `/a-propos` | About + FAQ | About (redesigned), FAQ moved/duplicated per `05` |
| `/realisations` | Photo gallery, labelled "Services" in the menu | Réalisations (before/after gallery, CMS-driven) |
| `/devis` | Quote form | Quote funnel (redesigned) |
| `/contact` | Blank page (bug, but linked) | **308 → `/devis`** |

No other URLs were ever published. Apex `plus-propre.fr` currently 307-redirects to `www` — switch to a permanent
redirect in Vercel domain settings (see `10`).

## 3. Content inventory (live site, to migrate and rewrite)

Reusable content (rewrite to the new tone; facts must stay consistent):

- **Hero**: "La propreté, notre engagement. Votre confiance, notre fierté." Badge "Nettoyage professionnel à Strasbourg et dans les environs".
- **Services list**: Bureaux et open-spaces, Cabinets médicaux, Commerces et boutiques, Copropriétés, Locations courte durée, Fins de bail / chantier.
- **Engagements**: plans de passage précis; produits adaptés, écolabellisés si pertinent; créneaux souples du ponctuel au quotidien; équipe formée, déclarée et assurée.
- **Pourquoi +Propre**: suivi clair, sur mesure, réactif.
- **Process**: 1 Demande de devis → 2 Analyse et proposition (visite si besoin) → 3 Lancement et suivi.
- **Conseils pratiques**: 3 reflexes (zones prioritaires, espaces rangés, petites habitudes) → becomes a blog article.
- **À propos**: équipe agile, nettoyage professionnel & résidentiel; écoute et analyse; protocole et régularité;
  stats "+120 sites suivis chaque année", "24h délai moyen de réponse", "7j/7 plages d'intervention"; priorities:
  hygiène médicale, rigueur & traçabilité, respect des surfaces, relation continue.
- **FAQ (6)**: demande de devis; visite sur place; produits utilisés; interventions hors horaires; engagement de durée; besoin urgent.
- **Reviews (3, Google)**: Isabelle B. (Bureaux à Strasbourg) — "Très satisfaite des services : travail soigné, rapide
  et toujours professionnel. Je recommande sans hésiter !"; Sabrina O. (Commerce de centre-ville) — "Nous avons fait
  appel à cette entreprise pour l'entretien de nos locaux, c'est le début d'une longue collaboration. Entreprise sérieuse
  et investie, je recommande les yeux fermés…" (truncated on the live site — get the full text); Pauline L. (Locaux
  professionnels) — "Prestation de qualité. Entreprise sérieuse." → seed data for the `reviews` table.
- **Footer**: tagline "Entretien de bureaux, commerces et espaces de vie avec un suivi simple et clair."

## 4. Issues to fix (from the audit in the signed quote + code review)

Each must be verified fixed before go-live (also listed in the roadmap QA phase).

| # | Issue | Fix |
|---|---|---|
| A1 | No mentions légales / privacy policy (legal obligation, LCEN; fines up to €75k/€375k) | Pages + footer links (`08`) |
| A2 | Working note left online on Réalisations: "Vous pourrez ensuite remplacer ces visuels par vos propres photos avant / après." | Removed; gallery is CMS-driven with real photos |
| A3 | LinkedIn link points to the LinkedIn login page | Use `https://www.linkedin.com/company/propre-nettoyage/` |
| A4 | Header social icons point to `https://facebook.com` and `https://instagram.com` (generic) | Real profile URLs from `src/content/site.ts` |
| A5 | Stock photos (smiling woman with bucket, heart-shaped gloves, a **bedroom** for "Sur mesure") | Real photos or branded placeholders only |
| A6 | Gallery duplicates ("Salle de bain" ×3, "Postes de travail" ×2, "Open-space" ×2) | One entry per real project, unique titles |
| A7 | Hard-coded reviews, one truncated, no average or count | Admin-managed reviews, full text, computed average + count |
| A8 | Contradictory promises "24/7" vs "7j/7"; "100 % satisfaction visée"; "48h" vs "24h" | 7j/7, devis sous 24h, drop "satisfaction visée" |
| A9 | Typo "Réponse devis24h" | Fixed by redesign |
| A10 | "Services" menu item leads to a photo gallery; no page per sector | Services hub + 9 service pages + Réalisations |
| A11 | Menu keeps "À propos" highlighted on other pages | Active state from `usePathname()`, `aria-current="page"` |
| A12 | Quote form asks personal data first | Need-first funnel (`05`) |
| A13 | Footer / "Réseaux" block nearly empty | Full footer (contact, services, legal, social, zone) |
| A14 | Logo small, contains English "Cleaning company" | French wordmark, prominent |
| A15 | CSR: empty HTML for crawlers and AI assistants | Next.js server rendering |
| A16 | Same title/description everywhere; no social preview; no local business data | `07` |
| A17 | `/contact` blank; soft 404s | Redirect + real `not-found` returning 404 |
| A18 | Form bugs (Cyrillic keys), no consent, no spam protection | New funnel with zod, consent, Turnstile, honeypot |
| A19 | `node_modules` committed, no `.gitignore`, public repo | Phase 0 cleanup |
| A20 | Facebook page category is "Dry cleaning" (Химчистка/Pressing) | Client action: change to "Cleaning service" (off-site checklist in `07`) |

## 5. Photo inventory

### Client photos — `assets/work_results/` (real +Propre jobs, phone shots, low resolution)

| Files | Orientation | Subject | Quality / use |
|---|---|---|---|
| `before1` / `after1` | portrait 590×1280 | Bathroom washbasin | Good pair → Locations courte durée / Fin de bail |
| `before2` / `after2` | portrait | Kitchen worktop & appliances | Good pair → Fin de bail / Locations |
| `before3` / `after3` | before 960×1280, after portrait | Cluttered stock room / laundry | Weak: "after" still cluttered → don't feature |
| `before4` / `after4` | before 960×1280, after portrait | Small WC with damaged floor tiles | Weak: floor damage remains → don't feature |
| `before5` / `after5` | **landscape** 1280×591 | Oven interior | Excellent pair → hero example of the before/after slider; Fin de bail |
| `before6` / `after6` | portrait | Drawer / cutlery organiser | OK → Fin de bail |
| `before7` / `after7` | portrait | Window and frame | Good → Fin de chantier / vitres |
| `before8` / `after8` | portrait | Bathtub | Good → Locations / Fin de bail |
| `before9` / `after9` | portrait | Bathroom washbasin & shower | Good → Locations / Fin de bail |
| `work1` | portrait | Meeting room with round table | Bureaux |
| `work2` | portrait | Kitchenette | Bureaux / Locations |
| `work3` | portrait | Kitchen sink corner | Locations |
| `work4` | portrait | Office / living area | Bureaux |
| `work5` | portrait 960×1280 | Training room, chairs on tables | Centres de formation (strong) |

Observations:
- All photos are **residential/office interiors**; nothing yet for medical practices, building halls, shops → use
  branded placeholders and request photos (`01` §4).
- Resolution is low (≈ 590 px wide). Fine for cards ≤ 400 CSS px wide on 1× and acceptable on 2×; avoid using them
  full-bleed. Request originals.
- Faces / personal items / addresses: none visible, but strip EXIF anyway when importing.
- Import plan: Phase 3 copies them to `public/images/realisations/` for static sections **and** seeds them into the
  Supabase `projects` table (uploaded to the `media` bucket) so the client can manage them afterwards. Name files
  descriptively (`four-avant.jpg`, `four-apres.jpg`, …) — file names are a minor image-SEO signal.

### Old repo assets — `src/assets/` (all to be **dropped**)

Stock photos (`woman1/2/3`, `love.jpg`, `lebed.jpg`, `home.png`, `equipe.jpg`, `equip2.jpeg`, `conseil.jpg`,
`cons2.jpg`) and the `realis1-9.jpg` gallery images (not demonstrably +Propre work, criticised in the audit).
Keep only the logo (`public/logo.jpg`, 1488×1488, blue circle + "+PROPRE / CLEANING COMPANY") as a reference until a
vector logo arrives; the new header uses the mockup wordmark.

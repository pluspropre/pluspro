# 07 — SEO & AI search optimisation

Goal: be the obvious answer for "entreprise / société de nettoyage à Strasbourg" and sector queries, in Google
(classic + local pack + AI Overviews/AI Mode) and in AI assistants (ChatGPT search, Perplexity, Claude, Copilot/Bing,
Gemini). The same foundations serve both: **server-rendered, well-structured, factual, consistent content about a
clearly identified local business.**

## 1. Technical foundations (all mandatory)

| Item | Implementation |
|---|---|
| Server-rendered HTML | Every public page prerendered; content (FAQ answers, carousel slides, tabs) present in the HTML, never fetched client-side |
| `metadataBase` | `new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.plus-propre.fr')` in root layout |
| Canonical | Absolute, self-referencing on every indexable page (`alternates.canonical`); strips query params except `?page=` on blog lists |
| Host | `www.plus-propre.fr` only. Apex → www **308** (Vercel domain setting). HTTPS only |
| Trailing slash | None (Next default). Keep consistent in sitemap and links |
| Language | `<html lang="fr">`, `openGraph.locale = 'fr_FR'`. No hreflang (single language) |
| Status codes | Real 404 via `notFound()`; 308 for permanent redirects; no soft 404s |
| Robots meta | `index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1` on public pages; `noindex` on `/admin/**`, `/devis/merci`, search/filter variants, preview deployments |
| Sitemap | `app/sitemap.ts`: static routes + 9 services + published posts (with `lastModified = updated_at`) + category pages + `/realisations`. Exclude noindex pages |
| robots.txt | `app/robots.ts` (see §6) with `Sitemap: https://www.plus-propre.fr/sitemap.xml` |
| Images | `next/image`, descriptive French `alt`, explicit `sizes`, `priority` only on the LCP image, descriptive file names |
| Performance | Core Web Vitals budgets in `09` — page experience matters for local competition |
| Internal links | Header mega-menu, footer service links, breadcrumbs, related services/posts, contextual links in copy |
| Structured data | JSON-LD per §4, validated with Google Rich Results Test + validator.schema.org |
| Social previews | Open Graph + Twitter card on every page, generated OG images (§3) |
| Manifest/icons | `app/manifest.ts` (name "+Propre", theme `#0B1B3F`, background `#FFFFFF`), `icon.png` 192 px, `apple-icon.png` 180 px |

## 2. Redirects

In `next.config.ts`:

```ts
async redirects() {
  return [
    { source: '/contact', destination: '/devis', permanent: true },
    // old-site URL still indexed by Google (reported by the client, 22/11/2026)
    { source: '/a-propos-de-nous', destination: '/a-propos', permanent: true },
    // safety nets for likely typed/legacy paths
    { source: '/services/:slug/', destination: '/services/:slug', permanent: true },
    { source: '/blog', destination: '/actualites', permanent: true },
    { source: '/blog/:slug', destination: '/actualites/:slug', permanent: true },
  ]
}
```

Existing URLs `/`, `/a-propos`, `/realisations`, `/devis` keep the same paths (no redirect needed). After launch, check
Google Search Console → Pages for any 404 coming from old links and add redirects. If a post slug changes in the admin,
store the old slug in a `post_redirects` table (optional enhancement) or warn the editor that the URL changes.

## 3. Metadata per page

Use a helper `buildMetadata({ title, description, path, image?, noindex? })` in `lib/seo/metadata.ts`. Root layout
sets `title.template = '%s | +Propre'` and `title.default`. Keep titles ≤ 60 characters, descriptions 140–160.

| Page | `<title>` | Description (draft) |
|---|---|---|
| `/` | Entreprise de nettoyage à Strasbourg \| +Propre (absolute) | Nettoyage de bureaux, cabinets médicaux, commerces et copropriétés à Strasbourg et alentours. Équipe formée et assurée, interventions 7j/7, devis gratuit sous 24h. |
| `/services` | Nos services de nettoyage à Strasbourg | Bureaux, cabinets médicaux, centres de formation, commerces, copropriétés, locations courte durée, fins de bail et de chantier : découvrez nos prestations. |
| `/services/{slug}` | from `services.ts` `metaTitle` (e.g. "Nettoyage de cabinets médicaux à Strasbourg") | from `metaDescription` |
| `/realisations` | Nos réalisations : avant / après | Photos avant / après de nos interventions de nettoyage à Strasbourg : cuisines, salles de bain, bureaux, fins de chantier… |
| `/a-propos` | À propos de +Propre, nettoyage à Strasbourg | Qui sommes-nous ? Une équipe de nettoyage professionnel à Strasbourg : méthode, engagements, zone d'intervention et questions fréquentes. |
| `/actualites` | Actualités et conseils nettoyage | Conseils d'entretien, chantiers réalisés et vie de l'entreprise : les actualités de +Propre à Strasbourg. |
| `/actualites/{slug}` | `seo_title ?? title` | `seo_description ?? excerpt` |
| `/devis` | Demande de devis gratuit | Décrivez vos locaux en 3 étapes : recevez un devis de nettoyage détaillé et gratuit sous 24h. Sans engagement. |
| `/mentions-legales` | Mentions légales | Mentions légales du site plus-propre.fr. |
| `/politique-de-confidentialite` | Politique de confidentialité | Comment +Propre collecte et protège vos données personnelles. |

### Open Graph images

- Default `app/opengraph-image.tsx` (1200×630, `next/og`): mint gradient, "+PROPRE" wordmark, tagline.
- Template OG for service pages and posts: `app/(site)/services/[slug]/opengraph-image.tsx` and
  `actualites/[slug]/opengraph-image.tsx` (title on brand background, or the post cover). Fonts: bundle Inter Tight
  800 TTF in `src/assets/fonts` for `ImageResponse`.
- `openGraph`: `type` (`website` / `article`), `siteName: '+Propre'`, `locale: 'fr_FR'`, `url`, `images`.
  For articles add `publishedTime`, `modifiedTime`, `section`. `twitter.card = 'summary_large_image'`.

## 4. Structured data (JSON-LD)

Render with a `<JsonLd data={…} />` server component (`<script type="application/ld+json">`, escape `<`).
Use stable `@id`s so entities connect across pages.

### Site-wide (root layout): Organization/LocalBusiness + WebSite

```json
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": ["LocalBusiness", "ProfessionalService"],
      "@id": "https://www.plus-propre.fr/#business",
      "name": "+Propre",
      "alternateName": ["Plus Propre", "+Propre Nettoyage"],
      "description": "Entreprise de nettoyage professionnel à Strasbourg : bureaux, cabinets médicaux, centres de formation, commerces, copropriétés, locations courte durée, fins de bail et de chantier.",
      "url": "https://www.plus-propre.fr/",
      "logo": "https://www.plus-propre.fr/images/brand/logo.png",
      "image": "https://www.plus-propre.fr/opengraph-image",
      "telephone": "+33765551111",
      "email": "contact@plus-propre.fr",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "7 Rue de Koenigshoffen",
        "postalCode": "67000",
        "addressLocality": "Strasbourg",
        "addressRegion": "Grand Est",
        "addressCountry": "FR"
      },
      "areaServed": [
        { "@type": "City", "name": "Strasbourg" },
        { "@type": "AdministrativeArea", "name": "Eurométropole de Strasbourg" }
      ],
      "knowsAbout": ["nettoyage de bureaux", "nettoyage de cabinets médicaux", "entretien de copropriétés", "nettoyage de fin de chantier", "nettoyage de fin de bail"],
      "sameAs": [
        "https://www.instagram.com/plus_propre.fr/",
        "https://www.facebook.com/people/Pluspropre/61576653958810/",
        "https://www.linkedin.com/company/propre-nettoyage/"
      ],
      "identifier": { "@type": "PropertyValue", "propertyID": "SIRET", "value": "99292494400018" },
      "vatID": "FR01992924944",
      "priceRange": "€€",
      "hasOfferCatalog": { "@id": "https://www.plus-propre.fr/services#catalog" }
    },
    {
      "@type": "WebSite",
      "@id": "https://www.plus-propre.fr/#website",
      "url": "https://www.plus-propre.fr/",
      "name": "+Propre",
      "inLanguage": "fr-FR",
      "publisher": { "@id": "https://www.plus-propre.fr/#business" }
    }
  ]
}
```

Add `geo` (lat/lng from the Google Business Profile pin), `openingHoursSpecification` and the Google Maps URL in
`hasMap` once known. Generate this object from `src/content/site.ts` — never hand-maintain two copies.

**Reviews in structured data:** Google does **not** show review stars for a business's reviews of itself
("self-serving reviews" on LocalBusiness/Organization) and the reviews here are hand-entered. **Do not add
`aggregateRating`/`review` to the LocalBusiness markup.** Show reviews as visible HTML (which AI systems and users
read); the stars in Google results come from the Google Business Profile.

### Per page

| Page | Types |
|---|---|
| All inner pages | `BreadcrumbList` (matches visible breadcrumbs) + `WebPage` (`isPartOf` #website, `about` #business) |
| `/services` | `OfferCatalog` `@id …/services#catalog` listing the 9 `Service`s |
| `/services/{slug}` | `Service` (`name`, `serviceType`, `description`, `provider: {@id #business}`, `areaServed`, `url`, `offers` without price or with `priceSpecification` only if the client provides prices) + `FAQPage` with the sector FAQ |
| `/a-propos` | `AboutPage` + `FAQPage` |
| `/actualites/{slug}` | `BlogPosting` (`headline`, `description`, `image` [≥1200 px wide], `datePublished`, `dateModified`, `author` {`@type: Organization` or `Person` with name}, `publisher` #business, `mainEntityOfPage`, `articleSection`, `inLanguage: fr-FR`) |
| `/actualites` | `Blog` / `CollectionPage` with `blogPost` items (optional) |
| `/realisations` | `CollectionPage` (optional `ImageObject` list with `creditText: "+Propre"`) |
| `/devis` | `ContactPage` (optional) |

Note: FAQ rich results are now shown mainly for authoritative health/government sites, so `FAQPage` won't produce
snippets here — keep it anyway: it's cheap, accurate, and helps machines map questions to answers.

## 5. Local SEO (on-site + off-site)

On-site:
- NAP (name, address, phone) identical everywhere: footer, contact, JSON-LD, Google Business Profile, Facebook,
  Instagram, LinkedIn, directories. Format phone the same way ("07 65 55 11 11").
- "Strasbourg" in H1/title of home and service pages, naturally — no keyword stuffing.
- A zone section listing the communes actually served (validated by client), on À propos + home.
- Embed of Google Map only on À propos, **click-to-load** behind consent (`08`).

Off-site checklist for the client (document in a hand-over note; not code):
- **Google Business Profile**: verify ownership; primary category "Service de nettoyage" / "Entreprise de nettoyage";
  secondary categories as relevant (e.g. "Service de nettoyage de bureaux" — choose from the GBP list); services list =
  the 9 services; service area; hours; phone; website `https://www.plus-propre.fr/?utm_source=google&utm_medium=organic&utm_campaign=gbp`;
  real photos (the before/after); weekly posts (reuse blog articles); answer every review. Get the "Demander des
  avis" short link → admin setting `google_review_url`.
- **Facebook**: change page category from "Pressing / Dry cleaning" to "Service de nettoyage"; add address & hours.
- **LinkedIn**: complete company page (website, industry "Services aux bâtiments", location).
- **Directories (consistent NAP)**: PagesJaunes, Bing Places, Apple Business Connect, Waze (optional), societe.com/
  annuaire-entreprises data is automatic from SIRET.
- **Reviews**: QR code card to hand to clients after jobs; ask satisfied clients for a Google review mentioning the
  service and city naturally.
- **Google Search Console** (domain property) + **Bing Webmaster Tools** (import from GSC): submit sitemap on launch.

## 6. AI search optimisation (GEO / AEO)

AI assistants answer from content they can fetch and parse, preferring clear, factual, consistent, recent sources,
and the classic search indexes (Google, Bing) they build on. Actions:

1. **Crawlability for AI bots** — `app/robots.ts`:

   ```ts
   export default function robots(): MetadataRoute.Robots {
     const isProd = process.env.VERCEL_ENV === 'production'
     if (!isProd) return { rules: [{ userAgent: '*', disallow: '/' }] }
     return {
       rules: [
         // /devis/merci is NOT disallowed on purpose: it carries a noindex meta that crawlers must be able to read
         { userAgent: '*', allow: '/', disallow: ['/admin', '/api/'] },
         // explicitly welcome search/answer bots (same rules; listed for clarity)
         { userAgent: ['OAI-SearchBot', 'ChatGPT-User', 'GPTBot', 'PerplexityBot', 'Perplexity-User',
                       'ClaudeBot', 'Claude-User', 'Claude-SearchBot', 'Google-Extended', 'Applebot-Extended',
                       'Bingbot', 'DuckAssistBot'], allow: '/', disallow: ['/admin', '/api/'] },
       ],
       sitemap: 'https://www.plus-propre.fr/sitemap.xml',
       host: 'https://www.plus-propre.fr',
     }
   }
   ```
   Training bots (`GPTBot`, `Google-Extended`, `Applebot-Extended`, `ClaudeBot`) are allowed by default — a small local
   business benefits from being known. Confirm with the client; if they object, disallow only those training agents
   (search agents must stay allowed). Also check Vercel Firewall / bot protection doesn't block them.

2. **`/llms.txt`** — a short Markdown file (route handler `app/llms.txt/route.ts` generated from `site.ts` and
   `services.ts`): who +Propre is, location, service area, contact, list of service pages with one-line descriptions,
   links to À propos, FAQ, Réalisations, Devis. Low cost, emerging convention.

3. **Answer-first content** on every service page and article: the first paragraph answers "what / for whom / where /
   how fast" in 2–3 sentences; FAQs with self-contained 40–80-word answers; scannable lists and tables (frequencies,
   tasks by zone). Use question-style H2/H3 where natural ("Combien de temps dure un nettoyage de fin de bail ?").

4. **Entity clarity & consistency**: identical name, address, phone, service list and figures on the site, JSON-LD,
   GBP and socials. The À propos page states facts explicitly (creation year, team size range, insurance, zone, types
   of clients). `sameAs` links all profiles.

5. **Freshness & authorship**: visible "Publié le / Mis à jour le" dates on articles (and `dateModified` in JSON-LD),
   author shown. Regular articles (≥ 2 / month suggested): seasonal tips, "chantier réalisé" case studies with
   before/after photos, sector guides (e.g. "Hygiène en cabinet médical : ce qu'il faut nettoyer et à quelle fréquence").

6. **Bing matters** (it feeds ChatGPT search and Copilot): verify in Bing Webmaster Tools and implement **IndexNow**:
   on publish/update of a post or project, the server action POSTs the URL to `https://api.indexnow.org/indexnow`
   with a key file served at `/{key}.txt` (fire-and-forget, production only).

7. **No cloaking, no hidden text, no AI-generated filler.** Content must be specific to +Propre (real methods, real
   photos, real zone). That specificity is what AI answers quote.

## 7. Content plan seeds (blog)

Categories: Conseils · Chantiers réalisés · Vie de l'entreprise. First 6 article ideas (client validates):
1. 3 réflexes pour garder vos locaux propres plus longtemps (from current site)
2. Fin de bail à Strasbourg : la check-list ménage pour récupérer sa caution
3. Cabinet médical : quelles zones désinfecter et à quelle fréquence ?
4. Avant / après : remise en état d'un four encrassé (chantier réalisé)
5. Copropriété : comment bien choisir sa société d'entretien des parties communes
6. Location courte durée : organiser le ménage entre deux voyageurs

## 8. Launch & monitoring

- Before launch: crawl the preview with Screaming Frog (or `npx linkinator`) — no broken links, every page has
  unique title/description/H1, canonicals correct, JSON-LD valid.
- Launch day: submit sitemap in GSC and Bing; inspect key URLs ("Request indexing") for home + 9 services.
- Weeks 1–4: monitor GSC coverage (404s → redirects), Core Web Vitals, queries; adjust titles of pages with
  impressions but low CTR.

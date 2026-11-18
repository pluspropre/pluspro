# 11 — Implementation roadmap

Work through the phases in order on branch `develop`. Each phase ends with the Definition of Done from `CLAUDE.md`.
Tick boxes as tasks are completed (commit the updated file with the work). If a task is blocked by a client input
(`01` §4), use the documented placeholder and continue.

---

## Phase 0 — Repo hygiene & scaffold

- [x] Add `.gitignore` (`10` §3); `git rm -r --cached node_modules`
- [x] Delete CRA app files and stock assets (`10` §3, `02` §5); keep `public/logo.jpg` and `docs/`
- [x] Scaffold Next.js in place: `npx create-next-app@latest` in a temp folder (TypeScript, ESLint, Tailwind, App Router,
      `src/` dir, Turbopack, import alias `@/*`), move files into the repo root, reconcile `package.json`
      (name `pluspropre`, `"private": true`, `"engines": { "node": ">=22" }`)
- [x] Scripts: `dev`, `build`, `start`, `lint`, `typecheck`, `test`, `test:e2e`, `format`
- [x] Prettier + `prettier-plugin-tailwindcss`; ESLint flat config incl. `jsx-a11y`
- [x] Vitest + Testing Library setup; Playwright setup (`tests/e2e`)
- [x] `src/lib/env.ts` (zod-validated env), `.env.example`
- [x] `next.config.ts`: `cacheComponents`, `images.remotePatterns` (Supabase), `images.formats`, security `headers()`,
      `redirects()` (`07` §2), preview `X-Robots-Tag`
- [x] GitHub Actions CI (`09` §4) — workflow written, runs once pushed
- [x] New `README.md`
- [ ] **User action**: Vercel settings switched to Next.js preset (`10` §4) before pushing develop

**Accept when**: `npm run build` passes, a placeholder home renders, CI green, no `node_modules` tracked.

## Phase 1 — Design system & layout shell

- [x] Fonts via `next/font` (Inter, Inter Tight, Instrument Serif) as CSS variables
- [x] `globals.css`: Tailwind v4 `@theme` tokens (`04` §2), base styles, `.ph-img` g1–g6 placeholders, bubble, text-stroke, keyframes (`ping`, `float`, `rise`)
- [x] UI components: Button (3 variants + arrow swap), Eyebrow, SectionHeading (accent word), Badge, Chip, Media (image + placeholder fallback), Stars, Accordion, Field/Select, Breadcrumbs, JsonLd
- [x] `src/content/site.ts`, `navigation.ts`
- [x] Header (floating glass pill, scroll states, hide on scroll down, progress bar, sliding indicator, active state from pathname, mega-menu, burger menu ≤ 900 px, skip link)
- [x] Footer (columns, socials, legal links, "Gestion des cookies", watermark + product SVGs)
- [x] Motion infra: `gsap.ts` registration, `SmoothScroll` (Lenis + ScrollTrigger sync), `Reveal`, `CountUp`, `Magnetic`, `BubbleCursor`, `Preloader`; reduced-motion & touch guards
- [x] Root layout: `lang="fr"`, metadata defaults (`07` §3), site-wide JSON-LD (`07` §4), Vercel Analytics + Speed Insights
- [x] `not-found.tsx` (404), `error.tsx`, `manifest.ts`, `icon.png`, `apple-icon.png`, default `opengraph-image.tsx`

**Accept when**: header/footer match the mockup at 1440/1024/768/375; keyboard nav of menus works; reduced motion disables Lenis & effects; JS-disabled page is fully readable.

## Phase 2 — Supabase foundation

- [ ] **User action**: create Supabase project (EU region), share URL + keys; disable sign-ups
- [x] `supabase init`; migration `0001_init.sql` with schema + RLS + storage bucket/policies (`06` §2)
- [x] `seed.sql` (categories, 3 reviews, settings)
- [x] Generated `database.types.ts`; clients `public.ts`, `server.ts`, `browser.ts`, `admin.ts`; `src/proxy.ts`; `requireAdmin()`
- [x] Data layer `src/lib/data/*` with `'use cache'` + tags: `getPublishedPosts`, `getPostBySlug`, `getCategories`, `getProjects({ service?, featured? })`, `getReviews({ service?, featured? })`, `getReviewStats`, `getSettings`
- [x] RLS tests (`09` §3)

**Accept when**: local `supabase db reset` works; RLS tests pass; data functions return typed results.

## Phase 3 — Home page

- [x] Copy good client photos into `public/images/realisations/` with descriptive names (compressed, EXIF stripped); write `scripts/seed-projects.ts` to upload them to Supabase `projects` (`06` §2 Seed)
- [x] Sections 1–13 (`04` §5) with motion: Hero, QuoteBar (→ `/devis?…`), Services grid, Why stack, Stats, Before/After (featured projects), Process, Sectors rail, Reviews (Supabase), Latest posts (Supabase, hidden if none), FAQ, Final CTA
- [x] Mockup fixes: "L'avant, l'après", "Continuer ma demande", only validated figures
- [x] Home metadata + JSON-LD

**Accept when**: visual parity with the mockup on desktop; mobile layout per mockup media queries; Lighthouse budgets met; content visible without JS.

## Phase 4 — Services

- [x] `src/content/services.ts` with the 9 services (`05` §4.3–4.4), drafts flagged `draft: true`
- [x] `/services` hub
- [ ] `/services/[slug]` template (all sections), `generateStaticParams`, `dynamicParams = false`, `generateMetadata`, `Service` + `FAQPage` + `BreadcrumbList` JSON-LD, per-service OG image
- [x] Reviews and projects filtered by service slug; related services

**Accept when**: 9 pages build statically, each with unique metadata, ≥ 500 words (drafts), valid JSON-LD; mega-menu and footer link to all.

## Phase 5 — Quote funnel

- [x] zod schema `lib/validation/quote.ts` (shared)
- [x] `QuoteWizard` (3 steps, prefill from search params, sessionStorage persistence, a11y focus management, error summary)
- [x] Turnstile widget (test keys locally), honeypot, min-time check
- [x] Server action `submitQuote`: validate → verify Turnstile → throttle → insert `quote_requests` (secret client) → Resend emails (React Email templates) → redirect `/devis/merci`
- [x] `/devis/merci` (noindex) with next steps + links
- [ ] E2E tests: happy path, validation, prefill

**Accept when**: a test submission on the preview arrives in the DB and the inbox; no personal data in logs; works on mobile Safari.

## Phase 6 — Admin panel

- [x] `/admin/login` (password + reset), `(protected)` layout with requireAdmin, admin shell (mobile bottom nav + desktop sidebar), noindex
- [x] Image pipeline component `ImageUploader` (compress → WebP, EXIF strip, progress, camera capture) (`06` §4)
- [x] Réalisations CRUD (mobile-first), publish/feature toggles, reorder
- [x] Articles CRUD with Tiptap, gallery, SEO panel, slug handling, draft/schedule/publish, preview, autosave
- [x] Avis CRUD + stats; Paramètres (Google review link, stats toggle)
- [x] Demandes (leads): list, detail, status, notes, delete, CSV export
- [x] Every mutation: zod + requireAdmin + `updateTag` (+ IndexNow ping in production for public URLs)
- [x] Dashboard counters & quick actions

**Accept when**: on a phone, an admin can log in, photograph a before/after, publish it, and see it on `/realisations` within seconds; a scheduled article appears after its date (≤ 1 h).

## Phase 7 — Blog (public)

- [x] `/actualites` list (featured + grid + pagination), category pages
- [x] `/actualites/[slug]` (prose styles, cover, gallery + lightbox, share links, related posts, service CTA)
- [ ] `generateStaticParams` for existing posts; `BlogPosting` JSON-LD; OG image per post
- [x] Sitemap includes posts and categories
- [x] Draft 2 seed articles (`05` §4.7) for client validation

**Accept when**: publishing in admin updates list, article, home "Actualités" and sitemap without redeploy.

## Phase 8 — Réalisations, À propos, legal, consent

- [x] `/realisations` (filters, cards, lightbox slider) — no working notes, no duplicates
- [x] `/a-propos` (story, method, priorities, figures, zone, team, FAQ, consent-gated map)
- [x] `/mentions-legales`, `/politique-de-confidentialite` (`08`), placeholders tracked
- [x] Cookie consent component + `ConsentGate` + footer "Gestion des cookies"
- [x] Lead retention job (`08` §5)

**Accept when**: legal pages complete except client placeholders; consent behaviour matches `08` §3.

## Phase 9 — SEO & AI layer audit

- [x] Metadata helper used everywhere; titles/descriptions per `07` §3; canonicals
- [x] `robots.ts` (env-aware), `sitemap.ts`, `llms.txt` route, IndexNow key file + ping helper
- [ ] JSON-LD for every template validated
- [x] Internal linking review (footer, related, breadcrumbs)
- [ ] Crawl of the preview: no broken links, no duplicate titles, no missing alt

## Phase 10 — QA & launch

- [ ] Cross-browser/device: Chrome, Safari (macOS + iOS), Firefox, Android Chrome; 375 → 1920 px
- [ ] Accessibility pass (axe + manual keyboard + VoiceOver quick check)
- [ ] Lighthouse CI budgets met on all templates
- [ ] Audit issues A1–A20 verified (`02` §4)
- [ ] Client review round on the preview; corrections
- [ ] Go-live checklist (`10` §5), merge `develop → main`, post-launch monitoring (`07` §8)
- [ ] Hand-over note for the client: admin how-to (with screenshots), off-site SEO checklist (`07` §5)

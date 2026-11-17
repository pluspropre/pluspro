# CLAUDE.md — +Propre website (plus-propre.fr)

Operating guide for Claude Code. Read this first, then the doc relevant to your task in `docs/`.

## What this project is

Rebuild of **plus-propre.fr**, the website of **+Propre**, a professional cleaning company in **Strasbourg (67)**.
The current site is a Create React App SPA (client-side rendered, invisible to most crawlers). The new site is a
**Next.js (App Router) + Supabase** application with a premium animated design, one page per client sector, a blog,
an admin area, admin-managed reviews, legal/RGPD compliance, and strong SEO / AI-search foundations.

- **All website content is in French.** Code, comments, commit messages, and docs are in English.
- The scope is fixed by a signed quote. See `docs/01-project-brief.md`. Don't add features outside that scope without asking.
- Design source of truth: `docs/design-reference/Main.dc.html` (home page mockup) + `docs/04-design-system.md`.

## Documentation map

| File | Read when |
|---|---|
| `docs/README.md` | Index and reading order |
| `docs/01-project-brief.md` | Always (business context, scope, client inputs still missing) |
| `docs/02-current-site-audit.md` | Migrating content, preserving URLs, knowing what to fix |
| `docs/03-architecture.md` | Before writing any code (stack, folders, rendering, caching, env vars) |
| `docs/04-design-system.md` | Any UI or animation work |
| `docs/05-pages-and-content.md` | Building a page (sections, copy briefs, quote funnel) |
| `docs/06-supabase-and-admin.md` | Database, RLS, storage, auth, admin panel |
| `docs/07-seo-and-ai-search.md` | Metadata, JSON-LD, sitemap, robots, local SEO, AI search |
| `docs/08-legal-rgpd.md` | Legal pages, cookie consent, form consent, data retention |
| `docs/09-quality-and-testing.md` | Performance budgets, a11y, tests, CI, code conventions |
| `docs/10-git-and-deployment.md` | Branching, Vercel settings, env per environment, go-live |
| `docs/11-implementation-roadmap.md` | **The ordered task list.** Work phase by phase; tick boxes as you go |

## Stack (summary — details in `docs/03-architecture.md`)

- Next.js 16 (App Router, React 19, TypeScript strict, Turbopack) on **Vercel**
- Tailwind CSS v4 (design tokens in `@theme`) + small hand-written CSS for complex effects
- GSAP 3 + ScrollTrigger + `@gsap/react`, Lenis smooth scroll — progressive enhancement only
- Supabase (Postgres, Auth, Storage) in an **EU region** — `@supabase/ssr` for auth-aware clients
- react-hook-form + zod, Resend (email), Cloudflare Turnstile (anti-spam), Tiptap (admin rich text)
- Vercel Web Analytics + Speed Insights
- Vitest (unit), Playwright + axe (e2e/a11y), ESLint, Prettier

## Commands

```bash
npm run dev          # local dev server (Turbopack)
npm run build        # production build — must pass before any commit that touches app code
npm run lint         # ESLint
npm run typecheck    # tsc --noEmit
npm run test         # Vitest
npm run test:e2e     # Playwright (needs `npm run build && npm run start` or dev server)
npm run test:db      # migrations + seed + RLS tests on a bare local Postgres (no Docker on this machine)
supabase db push --include-seed   # deploy migrations + seed to the linked hosted project (Supabase CLI)
supabase gen types typescript --linked > src/lib/supabase/database.types.ts
```

(Keep this list in sync with `package.json`.) For any Supabase work, follow the installed skills in
`.claude/skills/supabase*` (security-definer helpers live in the unexposed `private` schema; explicit grants; RLS on
every table).

## Non-negotiable rules

1. **Server-render all public content.** Every word a visitor or crawler should read must be in the initial HTML.
   Animations never hide content from no-JS clients (no SSR `opacity:0` on text without a JS-applied class).
2. **Preserve existing URLs:** `/`, `/a-propos`, `/realisations`, `/devis`. Redirect `/contact` → `/devis` (308).
   See `docs/07-seo-and-ai-search.md#redirects`.
3. **Every page** exports `metadata`/`generateMetadata` with a unique title, description, canonical, and Open Graph data,
   and emits the JSON-LD described in `docs/07`.
4. **Respect `prefers-reduced-motion`**: disable Lenis, scroll scrubbing, pinning, parallax, cursor, preloader.
5. **Secrets:** this GitHub repo is **public**. Never commit keys, `.env*` files (except `.env.example`), client personal
   data, or the signed quote PDF. The Supabase secret/service key is server-only (`import 'server-only'`).
6. **RLS on every Supabase table.** Public reads only see published rows. Writes go through admin-checked server actions.
7. **Phone photos are uploaded by the client** — strip EXIF/GPS and resize client-side before upload (`docs/06`).
8. **Photos:** real +Propre job photos first (`public/images/realisations`). Illustrative images: the client's vector
   illustrations (`public/images/illustrations`, cut out by `scripts/process-vectors.mjs`) and high-resolution
   free-licence (Unsplash/Pexels) photos in `public/images/photos`, sources listed in `public/images/photos/CREDITS.md`
   (decision 16/11/2026, replacing the low-resolution set of 12/11). Fall back to the branded gradient placeholder
   (`<Placeholder>`).
9. **Copy consistency:** quote turnaround = **sous 24h**; availability = **7j/7** (never "24/7"); never "satisfaction visée".
   Business facts live in one place: `src/content/site.ts`.
10. **Accessibility:** WCAG 2.2 AA. Keyboard-operable sliders/carousels/menus, visible focus, labels on every field.
11. **Legal placeholders** are written as `[À COMPLÉTER : …]` and listed in `docs/01-project-brief.md#client-inputs`.
    Never invent legal identifiers, statistics, reviews or certifications.
12. Work on `develop` (or short-lived `feat/*` branches off `develop`). Never push to `main`; `main` deploys to production.
    Commit only when the user asks.

## Definition of done (per task)

- `npm run typecheck && npm run lint && npm run test && npm run build` all pass
- Page renders correctly at 375px, 768px, 1280px, 1440px; no horizontal scroll
- Works with JS disabled (content visible, links work) and with reduced motion
- Lighthouse (mobile) on the touched page: Performance ≥ 90, Accessibility ≥ 95, Best Practices ≥ 95, SEO = 100
- Metadata + JSON-LD present and valid (Rich Results Test / schema validator for new templates)
- Roadmap checkbox ticked in `docs/11-implementation-roadmap.md`

## Code conventions (short)

- Server Components by default; `'use client'` only for interactivity/animation leaves.
- Data access only through `src/lib/data/*` (typed, cached). No Supabase calls inside UI components.
- Mutations only through server actions in `src/app/**/actions.ts`, validated with zod, admin-checked.
- Content that the client doesn't edit (service pages, FAQ, legal) lives in typed TS files in `src/content/`.
- Names: components `PascalCase.tsx`, utilities `camelCase.ts`, route folders in French kebab-case (they are URLs).
- Use `next/image` for every raster image, with explicit `sizes` and meaningful French `alt` text.

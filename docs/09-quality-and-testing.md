# 09 — Quality, performance, accessibility & testing

## 1. Performance budgets (mobile, Lighthouse "Moto G Power"/slow 4G profile)

| Metric | Budget |
|---|---|
| LCP | < 2.5 s (lab target < 2.0 s) |
| CLS | < 0.05 |
| INP / TBT | INP < 200 ms field; TBT < 200 ms lab |
| JS shipped on home (gz, first load) | ≤ 180 KB including React, GSAP core + ScrollTrigger, Lenis |
| Hero image | ≤ 120 KB (AVIF/WebP via `next/image`, `priority`, correct `sizes`) |
| Fonts | 3 families via `next/font`, only used weights; `preload` Inter + Inter Tight; Instrument Serif not preloaded |
| Lighthouse | Perf ≥ 90, A11y ≥ 95, Best Practices ≥ 95, SEO 100 on every template |

Techniques:
- Server Components by default; client components only for interactive leaves (nav, quote wizard, sliders,
  carousels, motion wrappers). Lazy-load below-the-fold heavy client components with `next/dynamic` when needed.
- The hero H1 is the LCP candidate on most viewports → render it immediately, animate with transforms only after
  hydration; preloader limited to ≤ 1 s and first visit (see `04` §6).
- Pinned/sticky sections: reserve layout space to avoid CLS; images always have width/height or aspect-ratio.
- Bubbles/floats are CSS animations (compositor); pause them when offscreen (`IntersectionObserver` toggling
  a class) to save battery.
- Third-party scripts: only Vercel analytics (tiny, deferred) and Turnstile (loaded on `/devis` only).
- `next/image` `remotePatterns` for Supabase; `images.formats = ['image/avif','image/webp']`.

## 2. Accessibility (WCAG 2.2 AA)

- Semantic landmarks (`header`, `nav`, `main`, `footer`), one H1, logical heading order, skip link.
- Colour contrast: body `#3A4660` on white ≈ 9:1 ✓; `teal-ink` only for large text; small teal text uses `teal-dk`;
  CTA = ink on green ✓; never white text on green/teal.
- Focus visible everywhere (`outline: 2px solid #2346C2; outline-offset: 3px`), including custom controls; target
  size ≥ 24×24 px (most are 44+).
- Menus/mega-menu/burger: keyboard operable, Escape closes, focus returns to trigger, `aria-expanded`.
- Carousel: buttons labelled, no auto-rotation; slides reachable without dragging.
- Before/after: native range input → keyboard & screen-reader friendly.
- Decorative SVG/bubbles/cursor: `aria-hidden="true"`.
- Forms: visible labels, `autocomplete` attributes (`name`, `email`, `tel`, `organization`, `postal-code`,
  `address-level2`), errors with `aria-invalid` + `aria-describedby`, error summary, no time limits.
- Reduced motion fully honoured; no flashing content.
- Admin: same standards (it's used on phones in the field).

## 3. Testing strategy

| Layer | Tool | What |
|---|---|---|
| Static | `tsc --noEmit`, ESLint (`next/core-web-vitals`, `@typescript-eslint`, `jsx-a11y`), Prettier check | Every commit (CI) |
| Unit | Vitest + Testing Library | zod schemas (quote/post/project/review), `slugify` with French accents, `readingTime`, metadata builder, JSON-LD builders (snapshot), consent reducer, quote wizard step logic |
| Database | Vitest against local Supabase (`supabase start`) or pgTAP | RLS: anon sees only published; anon cannot read leads; non-admin cannot write; storage policies |
| E2E | Playwright (Chromium + WebKit mobile viewport) | Home renders with JS disabled; nav + mega-menu keyboard; quote funnel happy path (Turnstile test keys, Resend mocked via env flag) and validation errors; prefill from `/devis?type=fin-de-bail`; `/contact` → `/devis` 308; unknown URL → 404; admin login → create review → visible on home after revalidation; cookie banner refuse/accept |
| Accessibility | `@axe-core/playwright` on every public template | No serious/critical violations |
| SEO | Playwright assertions | Each template has unique `<title>`, meta description, canonical, one H1, valid JSON-LD (`JSON.parse` + required keys); `robots.txt` and `sitemap.xml` content |
| Performance | Lighthouse CI (`@lhci/cli`) on the Vercel preview URL for `/`, `/services/bureaux`, `/actualites/{seed-post}`, `/devis` | Budgets above (assert, warn on minor) |

## 4. CI (GitHub Actions)

`.github/workflows/ci.yml` on pull requests to `develop` and `main`:
1. `npm ci` (Node 22)
2. `npm run typecheck && npm run lint && npm run test`
3. `npm run build` (with dummy public env vars; build must not require secrets — data functions tolerate a missing
   Supabase at build by catching and returning empty lists **only** when `CI=true`, or use a local Supabase service
   container)
4. Optional job: Playwright against the Vercel preview (`deployment_status` event) + Lighthouse CI.

Never put real secrets in workflow files; use GitHub encrypted secrets if a job needs them. The repo is public.

## 5. Code conventions

- TypeScript strict; no `any` (use `unknown` + narrowing); zod at all boundaries (forms, actions, env, query params).
- Components: small, typed props, named exports (default export only where Next requires it: pages, layouts).
- Tailwind classes ordered by `prettier-plugin-tailwindcss`; use `cn()` (clsx + tailwind-merge) for conditional classes.
  Complex effects (bubbles, ph gradients, clip-path wipes, text-stroke) live in `globals.css` as named component classes.
- Server actions return `{ ok: true, data } | { ok: false, error: string, fieldErrors?: Record<string,string> }`.
- Dates: store UTC (`timestamptz`), display with `Intl.DateTimeFormat('fr-FR', { timeZone: 'Europe/Paris' })`.
- French typography in copy: non-breaking space before `: ; ? !` and inside « » (use ` ` / `&nbsp;`), apostrophe `’`.
- Commits: Conventional Commits (`feat:`, `fix:`, `chore:`, `docs:`), English, small and focused.
- No dead code, no commented-out blocks, no console logs in committed code (except server error logging).

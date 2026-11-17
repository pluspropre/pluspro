# +Propre — plus-propre.fr (v2)

Website of **+Propre**, professional cleaning in Strasbourg. Next.js 16 (App Router, Cache Components) + Supabase,
deployed on Vercel. The full specification lives in [`docs/`](docs/README.md); working rules for contributors and AI
agents are in [`CLAUDE.md`](CLAUDE.md).

## What's inside

- **Public site** (French, server-rendered): home (animated, from `docs/design-reference`), 9 service pages + hub,
  Réalisations (before/after), À propos, Actualités (blog), quote funnel `/devis`, legal pages, cookie consent.
- **Admin** `/admin` (only the +Propre team has accounts — visitors never sign in):
  - **Devis**: read-only inbox of quote requests as cards; open one to call / e-mail / SMS / WhatsApp the client.
    No confirm/cancel workflow — the only actions are "mark unread", CSV export and RGPD deletion.
  - **Réalisations**: before/after from the phone camera (compressed to WebP in the browser, EXIF/GPS removed).
  - **Articles**: rich-text editor, gallery, SEO panel, draft / schedule / publish, preview, autosave.
  - **Avis**: reviews copied from Google/Facebook/…, average & count computed automatically.
  - **Configuration**: confirm/edit key figures (+120 sites, 24h, 7j/7, 100 %), minimum contract length (FAQ),
    opening hours (footer, À propos, Google structured data), Google review link, legal form & publication director.

## Getting started

```bash
npm install
cp .env.example .env.local   # fill in the Supabase values (see below)
npm run dev                  # http://localhost:3000
```

Without Supabase variables the public site still renders (reviews and Réalisations fall back to the seed data in
`src/content/fallback.ts`); the quote form and the admin need a Supabase project.

| Script | Purpose |
|---|---|
| `npm run dev` / `build` / `start` | Next.js |
| `npm run typecheck` · `lint` · `test` | TypeScript, ESLint, Vitest (unit) |
| `npm run test:db` | Applies migrations + seed to a scratch **local Postgres** and runs the RLS test suite (no Docker needed) |
| `npm run test:e2e` | Playwright + axe (builds must be running: `npm run build && npm run start`) |
| `npm run format` | Prettier |

## Supabase (CLI)

The schema, RLS policies, storage bucket and retention job are versioned in `supabase/migrations`; seed data in
`supabase/seed.sql`. Never edit the hosted schema from the dashboard.

Hosted project: **Plus Propre** (`fxfwrkeyzswytdvwxbzy`, Paris). This checkout is already linked.

```bash
supabase login
supabase link --project-ref fxfwrkeyzswytdvwxbzy
supabase db push --include-seed            # applies migrations + seed to the hosted project
supabase gen types typescript --linked > src/lib/supabase/database.types.ts
```

Auth settings (sign-ups disabled, 10-character passwords, site URL `https://www.plus-propre.fr`, redirect URLs
`http://localhost:3000/**` and `https://www.plus-propre.fr/**`) are versioned in `supabase/config.toml` and applied with
`supabase config push`.

`SUPABASE_SECRET_KEY` must hold a server key: the new `sb_secret_…` key (Dashboard → Project Settings → API Keys —
the CLI only shows it masked) or the legacy `service_role` key.

**Adding an admin**: Authentication → Users → *Invite user* (or *Add user*), then promote the account (new users are
`viewer` and cannot access anything until promoted):

```bash
supabase db query --linked "update public.profiles set role = 'admin', full_name = 'Prénom Nom' where id = (select id from auth.users where email = 'contact@plus-propre.fr');"
```

## Deployment

See [`docs/10-git-and-deployment.md`](docs/10-git-and-deployment.md): Vercel framework preset **Next.js**, env vars
from `.env.example`, region `cdg1`. Work happens on `develop`; merging into `main` deploys production.

## Images

Real job photos live in `public/images/realisations/` (also seeded as Réalisations). Illustrative photos supplied by
the client are in `public/images/photos/`. `scripts/process-images.mjs` re-encodes source photos to WebP and strips
metadata.

# 10 — Git workflow & deployment

## 1. Current setup (12/11/2026)

- GitHub repo: `https://github.com/pluspropre/pluspro` — **public**. Default branch `main`.
- Vercel project deploys `main` to production at `https://www.plus-propre.fr` (apex redirects to www, currently 307).
- The current Vercel project is configured for **Create React App** (output directory `build`).
- Branch **`develop`** created locally from `main` (commit `f64a2ed4`) to hold the whole v2 rebuild.

## 2. Branching model

```
main      ── production (Vercel Production). Only receives merges from develop via PR.
develop   ── integration branch for v2. Every push = a Vercel Preview deployment.
feat/*    ── optional short-lived branches off develop (e.g. feat/quote-funnel), merged back via PR.
```

- Never commit directly to `main`. Never force-push `main` or `develop`.
- Commit/push only when the user asks (see `CLAUDE.md`).
- First push of develop: `git push -u origin develop`.
- Release: open PR `develop → main`, wait for CI + preview checks, run the go-live checklist (§5), **merge commit** (keeps
  history of the rebuild), Vercel deploys production automatically.

## 3. Phase 0 repo cleanup (first commits on develop)

1. Add a proper `.gitignore` (Next.js + Node + env + OS + Supabase):
   ```
   node_modules/
   .next/
   out/
   build/
   coverage/
   playwright-report/
   test-results/
   .vercel/
   .env
   .env.*
   !.env.example
   *.log
   .DS_Store
   supabase/.branches/
   supabase/.temp/
   *.tsbuildinfo
   next-env.d.ts
   ```
2. `git rm -r --cached node_modules` — untracks the 38k committed files (they stay on disk). This makes the next
   commit large but the repo healthy going forward. History still contains them; rewriting history is not worth it.
3. Remove CRA files (`src/index.tsx`, `src/App.tsx`, `src/pages`, `src/components`, CSS, `public/index.html`,
   `public/manifest.json`, `logo192/512.png`, `src/assets/*` stock images, `react-scripts`, `web-vitals`, testing-library
   deps for CRA) and scaffold Next.js in place (see roadmap Phase 0). Keep `public/logo.jpg` until a vector logo arrives.
4. Replace `README.md` with a project README (setup, scripts, env, links to docs).

## 4. Vercel configuration (must be done before the first develop deploy builds Next.js)

In Vercel → Project → Settings:

| Setting | Value |
|---|---|
| Framework Preset | **Next.js** (was Create React App) |
| Build Command / Output Directory / Install Command | **Clear any overrides** (CRA used `build`; Next.js must use the default `.next`) |
| Node.js Version | 22.x (or 24.x) |
| Root Directory | repository root (unchanged) |
| Production Branch | `main` |
| Functions region | `cdg1` (Paris) |
| Environment Variables | All from `03` §6, scoped Production / Preview / Development. Preview uses the same Supabase project unless a staging project is created (recommended later). `NEXT_PUBLIC_SITE_URL` only for Production. |
| Deployment Protection | Enable Vercel Authentication for **Preview** deployments (client gets a shareable link) |
| Domains | `www.plus-propre.fr` primary; `plus-propre.fr` → redirect to www with **308 (permanent)** |
| Web Analytics / Speed Insights | Enabled (already used) |

Note: changing the framework preset affects production builds too. Production keeps serving its last successful
deployment until a new `main` deploy happens, so changing it now is safe **as long as nobody merges to `main`** before
v2 is ready. If a hotfix to the old CRA site is ever needed in between, temporarily set the override back, or use a
per-branch build command via `vercel.json` — prefer avoiding hotfixes.

Optional `vercel.json`:

```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "regions": ["cdg1"],
  "crons": []
}
```

### Resend & email DNS

Verify the sending domain (`plus-propre.fr` or subdomain `send.plus-propre.fr`) in Resend: add the SPF/DKIM (and
recommended DMARC) records at the DNS provider (wherever `plus-propre.fr` DNS is hosted — check with the client; if
DNS is on Vercel, add records in Vercel → Domains). Existing mailbox MX records for `contact@` must not be touched.

## 5. Go-live checklist (before merging develop → main)

Content & legal
- [ ] All `[À COMPLÉTER …]` placeholders resolved (`grep -r "À COMPLÉTER" src content` returns nothing)
- [ ] Legal pages validated by the client; cookie banner works (refuse/accept/customise, footer link)
- [ ] Service page copy validated (`draft: false` everywhere); figures validated
- [ ] Audit issues A1–A20 (`02` §4) verified fixed
- [ ] At least 6 projects in Réalisations, 3+ reviews, 1–2 articles published

Technical
- [ ] Vercel settings per §4; env vars set for Production; Supabase migrations pushed to the production project; admin
      users invited with roles
- [ ] Resend domain verified; test quote submitted from the preview reaches `contact@plus-propre.fr`
- [ ] Turnstile production keys set; honeypot/min-time checks working
- [ ] CI green; Lighthouse budgets met on preview; axe clean
- [ ] `/`, `/a-propos`, `/realisations`, `/devis` return 200; `/contact` → 308 `/devis`; random URL → 404
- [ ] `robots.txt` (production rules) and `sitemap.xml` correct; preview deployments are `noindex`
- [ ] OG previews checked (LinkedIn Post Inspector, Facebook Sharing Debugger, WhatsApp)
- [ ] JSON-LD validated (Rich Results Test) for home, a service page, an article

Launch
- [ ] Merge PR develop → main; watch the production build
- [ ] Smoke test production (pages, form, admin login, image upload from a phone)
- [ ] Submit sitemap to Google Search Console and Bing Webmaster Tools; request indexing of home + services
- [ ] Update Google Business Profile website link and Facebook/LinkedIn/Instagram links if needed

## 6. Rollback

Vercel → Deployments → previous production deployment → **Instant Rollback** (seconds, no rebuild). Then fix on
`develop` and redeploy. Database migrations must be backward compatible (additive) so a rollback of the frontend never
breaks on the new schema.

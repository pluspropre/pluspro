# +Propre website v2 — documentation

This folder is the complete specification for rebuilding **plus-propre.fr**. It was written so that Claude Code
(or any developer) can implement the project end to end without other context.

## Reading order

1. [`01-project-brief.md`](01-project-brief.md) — who the client is, what was sold, what is still missing from the client
2. [`02-current-site-audit.md`](02-current-site-audit.md) — the existing CRA site: what to keep, fix, drop; URLs to preserve
3. [`03-architecture.md`](03-architecture.md) — tech stack, folder structure, rendering & caching, env vars, security
4. [`04-design-system.md`](04-design-system.md) — tokens, typography, components, motion choreography from the mockup
5. [`05-pages-and-content.md`](05-pages-and-content.md) — sitemap, navigation, each page's sections and French copy briefs
6. [`06-supabase-and-admin.md`](06-supabase-and-admin.md) — schema, RLS, storage, auth, admin panel screens
7. [`07-seo-and-ai-search.md`](07-seo-and-ai-search.md) — technical SEO, structured data, local SEO, AI search (GEO)
8. [`08-legal-rgpd.md`](08-legal-rgpd.md) — mentions légales, privacy policy, cookie consent, retention
9. [`09-quality-and-testing.md`](09-quality-and-testing.md) — performance, accessibility, testing, CI, conventions
10. [`10-git-and-deployment.md`](10-git-and-deployment.md) — branches, Vercel configuration, go-live and rollback
11. [`11-implementation-roadmap.md`](11-implementation-roadmap.md) — phased checklist with acceptance criteria

## Other material

- `design-reference/` — exported home-page mockup (open with `python3 -m http.server` inside the folder, then
  `http://localhost:8000/Main.dc.html`). Treat it as a **reference**, not code to copy: replicate values in our components.
- Client photos (before/after and on-site work): `../../assets/work_results/` relative to this folder
  (i.e. `/Users/amrsunja/dev/code/plus_propre/assets/work_results/` on the author's machine). They are copied into the repo
  during Phase 3 (see roadmap). Inventory in `02-current-site-audit.md#photo-inventory`.
- The signed quote (`Devis AD202610-16`) is **not** stored in this public repo; its content is summarised in `01`.

## Glossary (French terms used in the code and content)

| French | Meaning |
|---|---|
| Devis | Quote / estimate request |
| Réalisations | Portfolio of completed jobs (before/after photos) |
| Actualités | Blog / news |
| Secteurs | Client sectors (recurring contracts): medical practices, offices… |
| Prestations ponctuelles | One-off services: end of lease, pre-sale cleaning, end of construction |
| Mentions légales | Legal notice (mandatory in France, LCEN law) |
| Politique de confidentialité | Privacy policy (RGPD = GDPR) |
| Copropriété / syndic | Co-owned residential building / its property manager |
| Fin de bail | End of tenancy (cleaning before check-out inventory, "état des lieux") |
| Fin de chantier | Post-construction cleaning |
| Location courte durée | Short-term rental (Airbnb-type) |
| Parties communes | Common areas of a building |

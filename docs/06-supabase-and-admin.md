# 06 — Supabase & admin panel

One **new Supabase project** (client decision) powers: admin authentication, blog, Réalisations gallery, reviews,
quote requests, site settings, and image storage.

## 1. Project setup

1. Create project in region **Paris (eu-west-3)** (fallback Frankfurt). Name `plus-propre`. Save the DB password in
   the client's password manager, not in the repo.
2. Auth → Providers → Email: enable; **disable "Allow new users to sign up"**. Set Site URL `https://www.plus-propre.fr`
   and redirect URLs (`http://localhost:3000/**`, the Vercel preview pattern, production).
   Customise email templates in French (invite, reset password).
3. Invite admin users (client + developer). After first login, set their `profiles.role` to `admin` (SQL or seed).
4. Local development: `npx supabase init` (already in repo after Phase 2), `npx supabase start`, `npx supabase db reset`.
   Link to the remote with `npx supabase link --project-ref <ref>` and deploy migrations with `npx supabase db push`.
   **Never edit the remote schema in the dashboard** — always via migrations committed in `supabase/migrations`.
5. Generate types after every migration: `npx supabase gen types typescript --local > src/lib/supabase/database.types.ts`.
6. Backups: Free plan has no PITR; schedule a weekly `supabase db dump` (GitHub Action to a private location) or move
   to Pro if the client wants managed backups. Note: Free projects pause after 7 days of inactivity — the public site
   reads data on cache misses, so traffic keeps it alive, but recommend **Pro** for a business site.

## 2. Schema (initial migration)

```sql
-- extensions
create extension if not exists citext;

-- ---------- profiles & roles ----------
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  role text not null default 'editor' check (role in ('admin','editor')),
  created_at timestamptz not null default now()
);

create or replace function public.is_admin() returns boolean
language sql stable security definer set search_path = '' as $$
  select exists (select 1 from public.profiles p where p.id = auth.uid() and p.role in ('admin','editor'));
$$;

-- auto-create profile on signup/invite
create or replace function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  insert into public.profiles (id, full_name) values (new.id, new.raw_user_meta_data->>'full_name');
  return new;
end $$;
create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();

-- updated_at helper
create or replace function public.set_updated_at() returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end $$;

-- ---------- blog ----------
create table public.post_categories (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  description text,
  sort_order int not null default 0
);

create type public.post_status as enum ('draft','published','archived');

create table public.posts (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  title text not null,
  excerpt text,                               -- also used as meta description fallback (≤ 160 chars)
  content_json jsonb,                          -- Tiptap document (editing)
  content_html text,                           -- sanitised HTML (rendering)
  cover_path text,                             -- storage path in bucket 'media'
  cover_alt text,
  category_id uuid references public.post_categories(id) on delete set null,
  service_slugs text[] not null default '{}',  -- links article ↔ service pages
  status public.post_status not null default 'draft',
  published_at timestamptz,                    -- future date = scheduled
  seo_title text,
  seo_description text,
  author_name text not null default 'L''équipe +Propre',
  reading_minutes int,
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint published_needs_date check (status <> 'published' or published_at is not null)
);
create index posts_public_idx on public.posts (status, published_at desc);
create trigger posts_updated before update on public.posts for each row execute function public.set_updated_at();

create table public.post_images (               -- article gallery
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.posts(id) on delete cascade,
  path text not null, alt text not null default '', caption text,
  width int, height int, sort_order int not null default 0
);

-- ---------- réalisations ----------
create table public.projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  service_slug text,                            -- one of the 9 service slugs (validated in zod)
  city text default 'Strasbourg',
  before_path text, before_alt text,            -- nullable: single-photo projects allowed
  after_path text not null, after_alt text not null,
  width int, height int,                        -- of the after image, for aspect ratio
  performed_on date,
  is_featured boolean not null default false,   -- shown in home slider
  is_published boolean not null default false,
  sort_order int not null default 0,
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger projects_updated before update on public.projects for each row execute function public.set_updated_at();

-- ---------- reviews (admin-managed, multi-platform) ----------
create type public.review_source as enum ('google','facebook','pagesjaunes','trustpilot','direct','other');

create table public.reviews (
  id uuid primary key default gen_random_uuid(),
  author_name text not null,                    -- display form, e.g. "Isabelle B." (first name + initial)
  author_context text,                          -- e.g. "Bureaux à Strasbourg"
  rating smallint not null check (rating between 1 and 5),
  content text not null,
  source public.review_source not null default 'google',
  source_url text,                              -- link to the original review if available
  review_date date,
  service_slugs text[] not null default '{}',   -- show on these service pages
  is_published boolean not null default true,
  is_featured boolean not null default false,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger reviews_updated before update on public.reviews for each row execute function public.set_updated_at();

create view public.review_stats with (security_invoker = true) as
  select count(*)::int as review_count, round(avg(rating)::numeric, 1) as rating_avg
  from public.reviews where is_published;

-- ---------- quote requests (leads) ----------
create type public.lead_status as enum ('new','contacted','quoted','won','lost','spam');

create table public.quote_requests (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  status public.lead_status not null default 'new',
  service_slug text, client_type text check (client_type in ('pro','particulier')),
  surface text, frequency text, postal_code text, city text,
  details jsonb not null default '{}',          -- sanitaires, cuisines, bureaux, vitrage, accès, start date…
  full_name text not null, company text, job_title text,
  email citext not null, phone text not null, callback_time text, message text,
  consent_at timestamptz not null, consent_version text not null,
  source_path text, utm jsonb,
  admin_notes text,
  last_contact_at timestamptz
);
create index quote_requests_created_idx on public.quote_requests (created_at desc);

-- ---------- settings (single row) ----------
create table public.site_settings (
  id int primary key default 1 check (id = 1),
  google_review_url text,                       -- "Laisser un avis" target
  reviews_summary_label text default 'Avis clients vérifiés',
  show_review_stats boolean not null default true,
  updated_at timestamptz not null default now()
);
insert into public.site_settings (id) values (1) on conflict do nothing;
```

### RLS policies

```sql
alter table public.profiles        enable row level security;
alter table public.post_categories enable row level security;
alter table public.posts           enable row level security;
alter table public.post_images     enable row level security;
alter table public.projects        enable row level security;
alter table public.reviews         enable row level security;
alter table public.quote_requests  enable row level security;
alter table public.site_settings   enable row level security;

-- profiles
create policy "own profile or admin" on public.profiles for select to authenticated
  using (id = (select auth.uid()) or (select public.is_admin()));
create policy "admin manages profiles" on public.profiles for update to authenticated
  using ((select public.is_admin())) with check ((select public.is_admin()));

-- public read (anon + authenticated)
create policy "read categories" on public.post_categories for select using (true);
create policy "read published posts" on public.posts for select
  using (status = 'published' and published_at <= now());
create policy "read images of published posts" on public.post_images for select
  using (exists (select 1 from public.posts p where p.id = post_id and p.status = 'published' and p.published_at <= now()));
create policy "read published projects" on public.projects for select using (is_published);
create policy "read published reviews"  on public.reviews  for select using (is_published);
create policy "read settings" on public.site_settings for select using (true);

-- admin full access (one policy per table; repeat for each)
create policy "admin all posts" on public.posts for all to authenticated
  using ((select public.is_admin())) with check ((select public.is_admin()));
-- … same "admin all" policy for post_categories, post_images, projects, reviews, site_settings

-- leads: no public access at all. Inserts are done server-side with the secret key (bypasses RLS).
create policy "admin reads leads"   on public.quote_requests for select to authenticated using ((select public.is_admin()));
create policy "admin updates leads" on public.quote_requests for update to authenticated
  using ((select public.is_admin())) with check ((select public.is_admin()));
create policy "admin deletes leads" on public.quote_requests for delete to authenticated using ((select public.is_admin()));
```

Write an automated RLS test (SQL or Vitest against local Supabase): anon can read only published rows, anon cannot
read `quote_requests`, a non-admin authenticated user cannot write.

### Storage

- Bucket **`media`**, **public** read (images on the public site), file size limit 10 MB, allowed MIME
  `image/jpeg, image/png, image/webp, image/avif`.
- Path convention: `posts/{postId}/{uuid}.webp`, `projects/{projectId}/{before|after}-{uuid}.webp`.
- Policies on `storage.objects`:

```sql
create policy "admins upload media" on storage.objects for insert to authenticated
  with check (bucket_id = 'media' and (select public.is_admin()));
create policy "admins update media" on storage.objects for update to authenticated
  using (bucket_id = 'media' and (select public.is_admin()));
create policy "admins delete media" on storage.objects for delete to authenticated
  using (bucket_id = 'media' and (select public.is_admin()));
```

- Public URL: `${SUPABASE_URL}/storage/v1/object/public/media/{path}`; served through `next/image`
  (`images.remotePatterns` for `<ref>.supabase.co/storage/v1/object/public/**`).
- When a record or image is replaced/deleted, delete the old object (server action) to avoid orphans.
- Draft content images are publicly reachable by URL (unguessable UUID paths). Acceptable for this site; note it.

### Seed (`supabase/seed.sql`)

- Categories: `conseils` "Conseils", `chantiers-realises` "Chantiers réalisés", `vie-de-l-entreprise` "Vie de l'entreprise".
- The 3 current reviews (see `02` §3) with `source = 'google'`, published.
- No personal data, no leads.
- Client photos: a one-off script `scripts/seed-projects.ts` (uses the secret key locally) that compresses and uploads
  the good before/after pairs from `assets/work_results` and inserts `projects` rows (titles/descriptions in French,
  service slug per the table in `02` §5). Run against production once, after the client validates titles.

## 3. Supabase clients in Next.js

- `lib/supabase/public.ts` — `createClient(url, publishableKey, { auth: { persistSession: false } })`; used inside
  `'use cache'` data functions. Typed with `Database`.
- `lib/supabase/server.ts` — `createServerClient` from `@supabase/ssr` with Next `cookies()`; used in admin pages and
  server actions (queries run as the logged-in user → RLS applies).
- `lib/supabase/browser.ts` — `createBrowserClient`; used only in admin client components (uploads).
- `lib/supabase/admin.ts` — secret key, `import 'server-only'`; used only by `submitQuote` and scripts.
- `src/proxy.ts` — matcher `['/admin/:path*']`: refreshes the session cookie (per the current `@supabase/ssr` Next.js
  guide) and redirects to `/admin/login?next=…` when there's no user. Also sets `X-Robots-Tag: noindex`.
- `lib/auth/requireAdmin.ts` — `const { data: { user } } = await supabase.auth.getUser()`; checks `profiles.role`;
  `redirect('/admin/login')` or throws 403 in actions.

## 4. Admin panel (`/admin`)

Audience: non-technical client, **often on a phone right after a job**. Priorities: big touch targets, few fields,
French UI, clear statuses, autosave of drafts, no jargon. Separate visual style from the public site: plain, fast,
no GSAP/Lenis. Use the same tokens (ink/green/mint) and Inter.

### Screens

| Route | Purpose | Key features |
|---|---|---|
| `/admin/login` | Sign in | Email + password, "Mot de passe oublié" (Supabase reset flow), generic error messages, rate-limited by Supabase |
| `/admin` | Tableau de bord | Counters: nouvelles demandes, articles publiés/programmés/brouillons, réalisations, avis. Big buttons: **"+ Ajouter une réalisation"**, "+ Nouvel article", "+ Ajouter un avis". Last 5 leads. |
| `/admin/realisations` | List projects | Thumbnails, published toggle, featured toggle, drag-to-reorder (or up/down buttons on mobile), filter by service |
| `/admin/realisations/nouveau`, `/[id]` | Create/edit project | **Mobile-first form**: 2 big photo slots "Photo AVANT" / "Photo APRÈS" using `<input type="file" accept="image/*" capture="environment">` (+ "choisir dans la galerie"), live preview with mini slider, title, service (select of 9), ville, date (default today), description (optional), alt texts auto-suggested ("Avant nettoyage — {title}") and editable, Publier / Enregistrer en brouillon |
| `/admin/articles` | List posts | Status badges: Brouillon / Programmé (date) / Publié / Archivé; search; filter category |
| `/admin/articles/nouveau`, `/[id]` | Edit post | Title → slug auto (editable, uniqueness check), category, linked services, cover image + alt, excerpt (counter 160), **Tiptap editor** (H2, H3, bold, italic, lists, quote, link, image with alt+caption, no colors/fonts), gallery uploader (multi-select, reorder, alt per image), SEO panel (title ≤ 60, description ≤ 160, Google preview), **publication**: "Publier maintenant" / "Programmer" (date-time picker, Europe/Paris) / "Enregistrer le brouillon"; "Prévisualiser" (admin-only preview route rendering the public template with the draft). Autosave draft every 10 s when dirty. Warn on leaving with unsaved changes. |
| `/admin/avis` | List reviews | Rating, source badge, published/featured toggles, reorder; shows computed average & count |
| `/admin/avis/nouveau`, `/[id]` | Edit review | Author display name (help text: "Prénom + initiale"), context, rating (5 big stars), text, source (Google, Facebook, PagesJaunes, Trustpilot, Direct, Autre), link to original, date, linked services, published, featured |
| `/admin/demandes` | Leads | Table/cards: date, name, service, city, status; filters by status; detail view with all fields, click-to-call/mail, status change, internal notes, `last_contact_at`; **Supprimer** (RGPD) and **Exporter CSV**; mark as spam |
| `/admin/parametres` | Settings | Google review link, show/hide review stats, admin users list (read-only + link to invite via Supabase, or an invite action using the secret key) |

All admin pages: `export const metadata = { robots: { index: false, follow: false } }`, dynamic rendering, server
actions with `requireAdmin()` and zod. After each mutation call `updateTag()` for the affected tags (`posts`,
`post:{slug}`, `projects`, `reviews`, `settings`) and `revalidatePath('/sitemap.xml')` when posts change.

### Image pipeline (client-side, before upload)

1. User picks/takes photo (JPEG/HEIC on iPhone — Safari converts HEIC to JPEG when picked through a file input in most
   cases; if `image/heic` arrives, convert with `heic2any` lazily, or show a friendly error).
2. `browser-image-compression`: `maxWidthOrHeight: 2400`, `fileType: 'image/webp'`, `initialQuality: 0.82`,
   `useWebWorker: true`. Re-encoding through canvas **removes EXIF including GPS** (privacy: photos are taken at
   clients' premises) while honouring orientation.
3. Read width/height, upload with the browser client to `media/...` (show progress), then submit the form with the
   returned path + dimensions.
4. Target result: ≤ 400 KB per image. `next/image` serves AVIF/WebP at the right size to visitors.

### Rich text

- Store Tiptap JSON (`content_json`) for editing, and on save render to HTML on the server
  (`@tiptap/html` `generateHTML`) then sanitise with `sanitize-html` (allowlist: p, h2, h3, ul, ol, li, strong, em,
  blockquote, a[href|rel|target], img[src|alt|width|height], figure, figcaption). Only `content_html` is rendered.
- Images inside the body come from the `media` bucket; render with `next/image` by parsing (or render the JSON tree
  with React components instead of HTML — acceptable alternative giving full control over `next/image`).
- Compute `reading_minutes` (≈ 200 words/min) on save.

### Validation schemas (zod, shared)

`lib/validation/post.ts`, `project.ts`, `review.ts`, `quote.ts`. French error messages. The same schema validates the
client form and the server action.

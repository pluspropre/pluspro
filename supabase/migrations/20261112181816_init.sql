-- +Propre website — initial schema (docs/06-supabase-and-admin.md)
-- Admin-only application: visitors never authenticate. Public reads are limited to published rows;
-- every write goes through an authenticated admin (RLS) or the server-only secret key (quote inserts).

create extension if not exists citext with schema extensions;

-- Security-definer helpers live in a schema that is NOT exposed through the Data API.
create schema if not exists private;
revoke all on schema private from public;
grant usage on schema private to authenticated, anon;

-- ============================================================================
-- profiles & roles
-- ============================================================================
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text,
  role text not null default 'viewer' check (role in ('admin', 'editor', 'viewer')),
  created_at timestamptz not null default now()
);
comment on table public.profiles is 'Back-office users. Invited only (sign-ups disabled); new users start as viewer and must be promoted to admin.';

create or replace function private.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.profiles p
    where p.id = (select auth.uid()) and p.role in ('admin', 'editor')
  );
$$;
revoke all on function private.is_admin() from public;
grant execute on function private.is_admin() to authenticated, anon;

create or replace function private.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, full_name) values (new.id, new.raw_user_meta_data ->> 'full_name');
  return new;
end;
$$;
revoke all on function private.handle_new_user() from public;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function private.handle_new_user();

create or replace function private.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ============================================================================
-- blog
-- ============================================================================
create table public.post_categories (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  name text not null,
  description text,
  sort_order int not null default 0
);

create type public.post_status as enum ('draft', 'published', 'archived');

create table public.posts (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  title text not null check (char_length(title) between 1 and 200),
  excerpt text check (char_length(excerpt) <= 300),
  content_json jsonb,
  content_html text,
  cover_path text,
  cover_alt text,
  category_id uuid references public.post_categories (id) on delete set null,
  service_slugs text[] not null default '{}',
  status public.post_status not null default 'draft',
  published_at timestamptz,
  seo_title text,
  seo_description text,
  author_name text not null default 'L''équipe +Propre',
  reading_minutes int,
  created_by uuid references auth.users (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint published_needs_date check (status <> 'published' or published_at is not null)
);
create index posts_public_idx on public.posts (status, published_at desc);
create index posts_category_idx on public.posts (category_id);
create index posts_created_by_idx on public.posts (created_by);
create trigger posts_updated before update on public.posts
  for each row execute function private.set_updated_at();

create table public.post_images (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.posts (id) on delete cascade,
  path text not null,
  alt text not null default '',
  caption text,
  width int,
  height int,
  sort_order int not null default 0
);
create index post_images_post_idx on public.post_images (post_id, sort_order);

-- ============================================================================
-- réalisations (before / after)
-- ============================================================================
create table public.projects (
  id uuid primary key default gen_random_uuid(),
  title text not null check (char_length(title) between 1 and 160),
  description text,
  service_slug text,
  city text default 'Strasbourg',
  before_path text,
  before_alt text,
  after_path text not null,
  after_alt text not null,
  width int,
  height int,
  performed_on date,
  is_featured boolean not null default false,
  is_published boolean not null default false,
  sort_order int not null default 0,
  created_by uuid references auth.users (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index projects_public_idx on public.projects (is_published, sort_order, performed_on desc);
create index projects_created_by_idx on public.projects (created_by);
create trigger projects_updated before update on public.projects
  for each row execute function private.set_updated_at();

-- ============================================================================
-- reviews (admin-managed, multi-platform — no Google API)
-- ============================================================================
create type public.review_source as enum ('google', 'facebook', 'pagesjaunes', 'trustpilot', 'direct', 'other');

create table public.reviews (
  id uuid primary key default gen_random_uuid(),
  author_name text not null check (char_length(author_name) between 1 and 80),
  author_context text,
  rating smallint not null check (rating between 1 and 5),
  content text not null check (char_length(content) between 1 and 3000),
  source public.review_source not null default 'google',
  source_url text,
  review_date date,
  service_slugs text[] not null default '{}',
  is_published boolean not null default true,
  is_featured boolean not null default false,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index reviews_public_idx on public.reviews (is_published, sort_order);
create trigger reviews_updated before update on public.reviews
  for each row execute function private.set_updated_at();

create view public.review_stats with (security_invoker = true) as
  select count(*)::int as review_count, round(avg(rating)::numeric, 1) as rating_avg
  from public.reviews
  where is_published;

-- ============================================================================
-- quote requests (devis) — read-only inbox for the admin
-- Visitors never have an account: rows are inserted server-side with the secret key.
-- The admin reads them and contacts the prospect by phone / e-mail (no confirm / cancel flow).
-- ============================================================================
create table public.quote_requests (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  service_slug text,
  client_type text check (client_type in ('pro', 'particulier')),
  surface text,
  frequency text,
  postal_code text,
  city text,
  details jsonb not null default '{}',
  full_name text not null,
  company text,
  job_title text,
  email extensions.citext not null,
  phone text not null,
  callback_time text,
  message text,
  consent_at timestamptz not null,
  consent_version text not null,
  source_path text,
  utm jsonb,
  read_at timestamptz
);
create index quote_requests_created_idx on public.quote_requests (created_at desc);
create index quote_requests_email_idx on public.quote_requests (email, created_at desc);

-- ============================================================================
-- site settings (single row) — the admin "Configuration" tab
-- ============================================================================
create table public.site_settings (
  id int primary key default 1 check (id = 1),
  google_review_url text,
  reviews_summary_label text not null default 'Avis clients vérifiés',
  show_review_stats boolean not null default true,
  -- key figures shown on the site; each one can be confirmed (enabled) and edited by the admin
  figures jsonb not null default '[
    {"key":"sites","prefix":"+","value":"120","suffix":"","label":"sites suivis chaque année","description":"Bureaux, cabinets, commerces, copropriétés : des sites entretenus toute l’année, avec le même niveau d’exigence.","enabled":true},
    {"key":"quote","prefix":"","value":"24","suffix":"h","label":"pour recevoir votre devis","description":"Décrivez vos locaux : vous recevez une proposition chiffrée et détaillée sous 24h.","enabled":true},
    {"key":"availability","prefix":"","value":"7","suffix":"j/7","label":"plages d’intervention","description":"Tôt le matin, en soirée ou le week-end : nous nous adaptons à vos horaires d’ouverture.","enabled":true},
    {"key":"team","prefix":"","value":"100","suffix":"%","label":"équipe déclarée et assurée","description":"Des agents déclarés, assurés et formés à vos protocoles.","enabled":true}
  ]'::jsonb,
  show_eco_products boolean not null default true,
  -- minimum contract length / notice period, shown in the FAQ
  contract_terms text,
  -- opening hours: [{ "day": "Mo", "open": true, "opens": "08:00", "closes": "19:00" }, …]
  opening_hours jsonb not null default '[]'::jsonb,
  hours_note text,
  legal_form text,
  publication_director text,
  updated_at timestamptz not null default now(),
  constraint figures_is_array check (jsonb_typeof(figures) = 'array'),
  constraint hours_is_array check (jsonb_typeof(opening_hours) = 'array')
);
create trigger site_settings_updated before update on public.site_settings
  for each row execute function private.set_updated_at();
insert into public.site_settings (id) values (1) on conflict do nothing;

-- ============================================================================
-- grants (explicit: new tables are not necessarily exposed to the Data API by default)
-- ============================================================================
revoke all on all tables in schema public from anon, authenticated;

grant select on public.post_categories, public.posts, public.post_images, public.projects,
  public.reviews, public.review_stats, public.site_settings to anon, authenticated;

grant insert, update, delete on public.post_categories, public.posts, public.post_images,
  public.projects, public.reviews to authenticated;
grant update on public.site_settings to authenticated;
grant select, update on public.profiles to authenticated;

-- leads: no anon access at all; the admin may read, mark as read, and erase (RGPD)
grant select, delete on public.quote_requests to authenticated;
grant update (read_at) on public.quote_requests to authenticated;

-- ============================================================================
-- row level security
-- ============================================================================
alter table public.profiles enable row level security;
alter table public.post_categories enable row level security;
alter table public.posts enable row level security;
alter table public.post_images enable row level security;
alter table public.projects enable row level security;
alter table public.reviews enable row level security;
alter table public.quote_requests enable row level security;
alter table public.site_settings enable row level security;

-- profiles
create policy "own profile or admin" on public.profiles for select to authenticated
  using (id = (select auth.uid()) or (select private.is_admin()));
create policy "admin manages profiles" on public.profiles for update to authenticated
  using ((select private.is_admin())) with check ((select private.is_admin()));

-- public reads
create policy "read categories" on public.post_categories for select to anon, authenticated
  using (true);
create policy "read published posts" on public.posts for select to anon, authenticated
  using ((status = 'published' and published_at <= now()) or (select private.is_admin()));
create policy "read images of published posts" on public.post_images for select to anon, authenticated
  using (
    (select private.is_admin())
    or exists (
      select 1 from public.posts p
      where p.id = post_id and p.status = 'published' and p.published_at <= now()
    )
  );
create policy "read published projects" on public.projects for select to anon, authenticated
  using (is_published or (select private.is_admin()));
create policy "read published reviews" on public.reviews for select to anon, authenticated
  using (is_published or (select private.is_admin()));
create policy "read settings" on public.site_settings for select to anon, authenticated
  using (true);

-- admin writes
create policy "admin inserts categories" on public.post_categories for insert to authenticated
  with check ((select private.is_admin()));
create policy "admin updates categories" on public.post_categories for update to authenticated
  using ((select private.is_admin())) with check ((select private.is_admin()));
create policy "admin deletes categories" on public.post_categories for delete to authenticated
  using ((select private.is_admin()));

create policy "admin inserts posts" on public.posts for insert to authenticated
  with check ((select private.is_admin()));
create policy "admin updates posts" on public.posts for update to authenticated
  using ((select private.is_admin())) with check ((select private.is_admin()));
create policy "admin deletes posts" on public.posts for delete to authenticated
  using ((select private.is_admin()));

create policy "admin inserts post images" on public.post_images for insert to authenticated
  with check ((select private.is_admin()));
create policy "admin updates post images" on public.post_images for update to authenticated
  using ((select private.is_admin())) with check ((select private.is_admin()));
create policy "admin deletes post images" on public.post_images for delete to authenticated
  using ((select private.is_admin()));

create policy "admin inserts projects" on public.projects for insert to authenticated
  with check ((select private.is_admin()));
create policy "admin updates projects" on public.projects for update to authenticated
  using ((select private.is_admin())) with check ((select private.is_admin()));
create policy "admin deletes projects" on public.projects for delete to authenticated
  using ((select private.is_admin()));

create policy "admin inserts reviews" on public.reviews for insert to authenticated
  with check ((select private.is_admin()));
create policy "admin updates reviews" on public.reviews for update to authenticated
  using ((select private.is_admin())) with check ((select private.is_admin()));
create policy "admin deletes reviews" on public.reviews for delete to authenticated
  using ((select private.is_admin()));

create policy "admin updates settings" on public.site_settings for update to authenticated
  using ((select private.is_admin())) with check ((select private.is_admin()));

-- leads
create policy "admin reads leads" on public.quote_requests for select to authenticated
  using ((select private.is_admin()));
create policy "admin marks leads read" on public.quote_requests for update to authenticated
  using ((select private.is_admin())) with check ((select private.is_admin()));
create policy "admin deletes leads" on public.quote_requests for delete to authenticated
  using ((select private.is_admin()));

-- ============================================================================
-- storage: public "media" bucket, admin-only writes
-- ============================================================================
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('media', 'media', true, 10485760, array['image/jpeg', 'image/png', 'image/webp', 'image/avif'])
on conflict (id) do nothing;

create policy "admins read media objects" on storage.objects for select to authenticated
  using (bucket_id = 'media' and (select private.is_admin()));
create policy "admins upload media" on storage.objects for insert to authenticated
  with check (bucket_id = 'media' and (select private.is_admin()));
create policy "admins update media" on storage.objects for update to authenticated
  using (bucket_id = 'media' and (select private.is_admin()))
  with check (bucket_id = 'media' and (select private.is_admin()));
create policy "admins delete media" on storage.objects for delete to authenticated
  using (bucket_id = 'media' and (select private.is_admin()));

-- ============================================================================
-- data retention (docs/08 §5): prospects kept 3 years after the request
-- ============================================================================
create or replace function private.purge_expired_leads()
returns int
language plpgsql
security definer
set search_path = ''
as $$
declare
  deleted int;
begin
  delete from public.quote_requests
  where created_at < now() - interval '3 years';
  get diagnostics deleted = row_count;
  return deleted;
end;
$$;
revoke all on function private.purge_expired_leads() from public, anon, authenticated;

-- Schedule monthly when pg_cron is available (hosted Supabase); skipped on bare Postgres.
do $$
begin
  if exists (select 1 from pg_available_extensions where name = 'pg_cron') then
    create extension if not exists pg_cron;
    perform cron.schedule('purge-expired-leads', '0 3 1 * *', 'select private.purge_expired_leads()');
  end if;
end;
$$;

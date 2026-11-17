-- RLS / privilege test suite (docs/06 §2, docs/09 §3). Runs on the bare-Postgres harness.
-- Each block raises an exception on failure; psql stops at the first error.
\set ON_ERROR_STOP 1

-- fixtures -------------------------------------------------------------------
insert into auth.users (id, email) values
  ('00000000-0000-0000-0000-0000000000ad', 'admin@test.local'),
  ('00000000-0000-0000-0000-0000000000b0', 'viewer@test.local');
update public.profiles set role = 'admin' where id = '00000000-0000-0000-0000-0000000000ad';

insert into public.projects (title, after_path, after_alt, is_published) values
  ('Projet publié', 'projects/a/after.webp', 'Après', true),
  ('Projet brouillon', 'projects/b/after.webp', 'Après', false);
insert into public.reviews (author_name, rating, content, is_published) values ('Caché X.', 1, 'Avis masqué', false);
insert into public.posts (slug, title, status, published_at) values
  ('publie', 'Publié', 'published', now() - interval '1 day'),
  ('programme', 'Programmé', 'published', now() + interval '1 day');
insert into public.quote_requests (full_name, email, phone, consent_at, consent_version)
values ('Jean Test', 'jean@test.local', '0600000000', now(), 'test');

-- T1 new users are not admins --------------------------------------------------
do $$ begin
  if (select role from public.profiles where id = '00000000-0000-0000-0000-0000000000b0') <> 'viewer' then
    raise exception 'T1: new user should default to viewer';
  end if;
end $$;

-- T2 anon sees only published rows --------------------------------------------
set role anon;
select set_config('test.uid', '', false);
do $$ begin
  if exists (select 1 from public.projects where not is_published) then raise exception 'T2: anon sees unpublished projects'; end if;
  if not exists (select 1 from public.projects where title = 'Projet publié') then raise exception 'T2: anon cannot see published projects'; end if;
  if (select count(*) from public.reviews) <> 3 then raise exception 'T2: anon sees unpublished reviews'; end if;
  if (select count(*) from public.posts) <> 1 then raise exception 'T2: anon sees drafts or scheduled posts'; end if;
  if (select review_count from public.review_stats) <> 3 then raise exception 'T2: review_stats counts hidden reviews'; end if;
  if (select count(*) from public.site_settings) <> 1 then raise exception 'T2: anon cannot read settings'; end if;
end $$;

-- T3 anon cannot read leads ----------------------------------------------------
do $$ begin
  perform 1 from public.quote_requests;
  raise exception 'T3: anon could read quote_requests';
exception when insufficient_privilege then null;
end $$;

-- T4 anon cannot write ---------------------------------------------------------
do $$ begin
  insert into public.reviews (author_name, rating, content) values ('Spam', 5, 'x');
  raise exception 'T4: anon could insert a review';
exception when insufficient_privilege then null;
end $$;
do $$ begin
  insert into public.quote_requests (full_name, email, phone, consent_at, consent_version)
  values ('x', 'x@x.x', '0', now(), 'x');
  raise exception 'T4: anon could insert a lead directly';
exception when insufficient_privilege then null;
end $$;
do $$ begin
  insert into storage.objects (bucket_id, name) values ('media', 'x.webp');
  raise exception 'T4: anon could upload to storage';
exception when insufficient_privilege then null;
end $$;
reset role;

-- T5 a signed-in non-admin cannot write or read leads --------------------------
set role authenticated;
select set_config('test.uid', '00000000-0000-0000-0000-0000000000b0', false);
do $$ begin
  insert into public.reviews (author_name, rating, content) values ('Viewer', 5, 'x');
  raise exception 'T5: viewer could insert a review';
exception when insufficient_privilege then null;
end $$;
do $$ begin
  if (select count(*) from public.quote_requests) <> 0 then raise exception 'T5: viewer can read leads'; end if;
  if exists (select 1 from public.projects where not is_published) then raise exception 'T5: viewer sees unpublished projects'; end if;
  update public.profiles set role = 'admin' where id = '00000000-0000-0000-0000-0000000000b0';
  if (select role from public.profiles where id = '00000000-0000-0000-0000-0000000000b0') = 'admin' then
    raise exception 'T5: viewer promoted themselves';
  end if;
end $$;
do $$ begin
  insert into storage.objects (bucket_id, name) values ('media', 'y.webp');
  raise exception 'T5: viewer could upload to storage';
exception when insufficient_privilege then null;
end $$;
reset role;

-- T6 admin can manage content, read leads, mark them read and erase them -------
set role authenticated;
select set_config('test.uid', '00000000-0000-0000-0000-0000000000ad', false);
do $$ begin
  insert into public.reviews (author_name, rating, content) values ('Admin R.', 4, 'Ajouté par l’admin');
  if not exists (select 1 from public.projects where not is_published) then raise exception 'T6: admin should see drafts'; end if;
  if (select count(*) from public.quote_requests) <> 1 then raise exception 'T6: admin cannot read leads'; end if;
  update public.quote_requests set read_at = now();
  if (select read_at from public.quote_requests limit 1) is null then raise exception 'T6: admin cannot mark lead read'; end if;
  update public.site_settings set contract_terms = 'Test' where id = 1;
  insert into storage.objects (bucket_id, name) values ('media', 'projects/ok.webp');
end $$;
-- leads are read-only apart from read_at: no editing of the prospect's data
do $$ begin
  update public.quote_requests set full_name = 'Modifié';
  raise exception 'T6: admin could edit lead contents';
exception when insufficient_privilege then null;
end $$;
do $$ begin
  delete from public.quote_requests;
  if (select count(*) from public.quote_requests) <> 0 then raise exception 'T6: admin cannot erase a lead'; end if;
end $$;
reset role;

-- T7 retention purge removes leads older than 3 years --------------------------
insert into public.quote_requests (full_name, email, phone, consent_at, consent_version, created_at)
values ('Ancien', 'old@test.local', '0', now(), 'test', now() - interval '4 years'),
       ('Récent', 'new@test.local', '0', now(), 'test', now());
do $$ begin
  if private.purge_expired_leads() <> 1 then raise exception 'T7: purge did not delete exactly one lead'; end if;
end $$;

-- T8 the server-only secret key (service_role) can record a quote request ------
set role service_role;
do $$ begin
  insert into public.quote_requests (full_name, email, phone, consent_at, consent_version)
  values ('Serveur', 'server@test.local', '0', now(), 'test');
  if (select count(*) from public.quote_requests where email = 'server@test.local') <> 1 then
    raise exception 'T8: service_role cannot insert/read leads';
  end if;
end $$;
reset role;

\echo 'RLS tests: all passed'

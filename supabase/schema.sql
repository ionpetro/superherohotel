-- ============================================================================
-- Superhero® Startup Directory — database setup
-- Run this once in the Supabase SQL Editor for project jiheduuzilqqcrfyzibl:
--   Dashboard → SQL Editor → New query → paste → Run
-- It is idempotent: safe to run more than once.
-- ============================================================================

create table if not exists public.superhero_startups (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  tagline text not null default '',
  description text not null default '',
  logo_url text,
  website text,
  location text,
  batch text,                              -- e.g. "Spring 2026"
  status text not null default 'active',   -- active | raising | public | acquired
  industry text,                           -- primary category
  tags text[] not null default '{}',
  team_size int,
  founded_year int,
  is_hiring boolean not null default false,
  is_top boolean not null default false,
  linkedin_url text,
  twitter_url text,
  founder_name text,
  founder_role text,
  founder_bio text,
  founder_image_url text,
  submitter_email text,
  approved boolean not null default true,
  created_at timestamptz not null default now()
);

create index if not exists superhero_startups_approved_idx
  on public.superhero_startups (approved, created_at desc);
create index if not exists superhero_startups_industry_idx
  on public.superhero_startups (industry);
create index if not exists superhero_startups_batch_idx
  on public.superhero_startups (batch);

alter table public.superhero_startups enable row level security;

-- Public can read approved startups.
drop policy if exists "superhero_startups_select_approved" on public.superhero_startups;
create policy "superhero_startups_select_approved"
  on public.superhero_startups for select
  to anon, authenticated
  using (approved = true);

-- Anyone can submit a startup (forced approved = true so it appears immediately).
drop policy if exists "superhero_startups_insert_public" on public.superhero_startups;
create policy "superhero_startups_insert_public"
  on public.superhero_startups for insert
  to anon, authenticated
  with check (approved = true);

-- ----------------------------------------------------------------------------
-- Founders (one-to-many; a startup can have several founders)
-- ----------------------------------------------------------------------------
create table if not exists public.superhero_startup_founders (
  id uuid primary key default gen_random_uuid(),
  startup_id uuid not null references public.superhero_startups(id) on delete cascade,
  name text not null,
  role text,
  bio text,
  image_url text,
  linkedin_url text,
  twitter_url text,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists superhero_founders_startup_idx
  on public.superhero_startup_founders (startup_id, sort_order);

alter table public.superhero_startup_founders enable row level security;

drop policy if exists "superhero_founders_select" on public.superhero_startup_founders;
create policy "superhero_founders_select"
  on public.superhero_startup_founders for select
  to anon, authenticated
  using (exists (
    select 1 from public.superhero_startups s
    where s.id = startup_id and s.approved = true
  ));

drop policy if exists "superhero_founders_insert" on public.superhero_startup_founders;
create policy "superhero_founders_insert"
  on public.superhero_startup_founders for insert
  to anon, authenticated
  with check (exists (
    select 1 from public.superhero_startups s
    where s.id = startup_id and s.approved = true
  ));

-- ----------------------------------------------------------------------------
-- Storage: public bucket for uploaded startup logos
-- ----------------------------------------------------------------------------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('startup-logos', 'startup-logos', true, 2097152,
        array['image/png','image/jpeg','image/webp','image/svg+xml','image/gif'])
on conflict (id) do update
  set public = excluded.public,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "startup_logos_anon_insert" on storage.objects;
create policy "startup_logos_anon_insert"
  on storage.objects for insert
  to anon, authenticated
  with check (bucket_id = 'startup-logos');

drop policy if exists "startup_logos_public_select" on storage.objects;
create policy "startup_logos_public_select"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'startup-logos');

-- ----------------------------------------------------------------------------
-- Seed data (only inserts if the table is empty)
-- ----------------------------------------------------------------------------
insert into public.superhero_startups
  (slug, name, tagline, description, website, batch, status, industry, tags, founded_year, is_hiring, is_top, submitter_email)
select * from (values
('gamerplug', 'Gamerplug', 'Find your people to game with.',
 'Gamerplug helps gamers find teammates and friends who actually match — by game, skill level, platform, and schedule. Build a profile, get matched, and squad up across the titles you play instead of grinding solo with random fills.',
 'https://gamerplug.app', 'Spring 2026', 'active', 'Consumer',
 array['Consumer','Gaming','Social'], 2024, true, true,
 'support@gamerplug.app')
) as seed
where not exists (select 1 from public.superhero_startups);

-- Gamerplug founders
insert into public.superhero_startup_founders (startup_id, name, role, sort_order)
select s.id, f.name, 'Co-founder', f.ord
from public.superhero_startups s,
  (values ('Stephan', 0), ('Ion', 1), ('Abed', 2), ('Hunter', 3)) as f(name, ord)
where s.slug = 'gamerplug'
  and not exists (
    select 1 from public.superhero_startup_founders ff where ff.startup_id = s.id
  );

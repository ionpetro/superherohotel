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
-- Seed data (only inserts if the table is empty)
-- ----------------------------------------------------------------------------
insert into public.superhero_startups
  (slug, name, tagline, description, website, location, batch, status, industry, tags, team_size, founded_year, is_hiring, is_top, linkedin_url, twitter_url, founder_name, founder_role, founder_bio)
select * from (values
('frontier-tower', 'Frontier Tower', 'A vertical village for builders in San Francisco.',
 'Frontier Tower is a 16-floor vertical village in downtown San Francisco bringing together founders, researchers, and artists working on bleeding-edge technology. Home to 700+ members and 100+ events per month, it is the physical hub of the Superhero ecosystem.',
 'https://frontiertower.io', 'San Francisco, CA, USA', 'Spring 2026', 'active', 'Community',
 array['Community','Real Estate','Events'], 24, 2025, true, true, 'https://linkedin.com', 'https://x.com',
 'The Frontier Team', 'Founders', 'A collective of operators who built the place they wished existed when they first landed in SF.'),
('superhero', 'Superhero®', 'The hotel for founders & VCs.',
 'Superhero is a founder-operated hotel and residency in San Francisco designed to plug you into the startup ecosystem from day one. From community programming to investor access, every detail is built to give new founders the network and support they need.',
 'https://superhero.hotel', 'San Francisco, CA, USA', 'Spring 2026', 'active', 'Hospitality',
 array['Hospitality','Community','Startups'], 12, 2026, true, true, 'https://linkedin.com', 'https://x.com',
 'Superhero Founders', 'Founder/CEO', 'We landed in SF with zero network and no warm intros. We built Superhero because we wished a place like this had existed for us.'),
('lumina-labs', 'Lumina Labs', 'On-device AI agents for the desktop.',
 'Lumina Labs builds private, local-first AI agents that automate repetitive desktop workflows without sending your data to the cloud. Their runtime ships with a permission system that keeps every action auditable.',
 'https://lumina.example.com', 'San Francisco, CA, USA', 'Winter 2026', 'raising', 'B2B',
 array['B2B','AI','Productivity'], 6, 2025, true, false, 'https://linkedin.com', 'https://x.com',
 'Priya Nair', 'Founder/CEO', 'Former ML infra lead. Obsessed with making AI useful without surrendering privacy.'),
('voltway', 'Voltway', 'Battery swap network for electric fleets.',
 'Voltway operates a network of automated battery-swap stations for last-mile delivery fleets, cutting downtime from hours to under two minutes. Now live in three Bay Area cities.',
 'https://voltway.example.com', 'Oakland, CA, USA', 'Fall 2025', 'active', 'Hardware',
 array['Hardware','Climate','Logistics'], 18, 2024, true, false, 'https://linkedin.com', 'https://x.com',
 'Marcus Lee', 'Co-founder/CEO', 'Mechanical engineer turned founder, previously scaled charging hardware at a Series C startup.'),
('papertrail', 'Papertrail', 'Compliance copilot for fintech teams.',
 'Papertrail turns messy regulatory requirements into a living checklist your whole company can act on. It connects to your stack, flags gaps, and drafts the evidence auditors ask for.',
 'https://papertrail.example.com', 'New York, NY, USA', 'Winter 2026', 'raising', 'Fintech',
 array['Fintech','B2B','Compliance'], 9, 2025, false, false, 'https://linkedin.com', 'https://x.com',
 'Dana Whitfield', 'Founder/CEO', 'Ex-compliance officer who got tired of spreadsheets and decided to fix the problem at the root.'),
('mycelia', 'Mycelia', 'Marketplace for carbon-negative building materials.',
 'Mycelia connects developers with verified suppliers of mushroom-based insulation, hempcrete, and other carbon-negative materials, with embodied-carbon data built into every listing.',
 'https://mycelia.example.com', 'Portland, OR, USA', 'Fall 2025', 'active', 'Climate',
 array['Climate','Marketplace','Construction'], 7, 2024, true, false, 'https://linkedin.com', 'https://x.com',
 'Sofia Reyes', 'Co-founder/CEO', 'Materials scientist building the supply chain for a lower-carbon built environment.'),
('relaytic', 'Relaytic', 'Realtime analytics for robotics fleets.',
 'Relaytic gives robotics companies a single dashboard to monitor, debug, and update fleets in the field. Stream telemetry, replay incidents, and ship over-the-air fixes in minutes.',
 'https://relaytic.example.com', 'San Francisco, CA, USA', 'Winter 2026', 'raising', 'B2B',
 array['B2B','Robotics','Infrastructure'], 5, 2025, true, false, 'https://linkedin.com', 'https://x.com',
 'Kenji Watanabe', 'Founder/CTO', 'Robotics engineer who spent five years debugging fleets the hard way and decided to build better tools.'),
('halcyon-health', 'Halcyon Health', 'Longevity clinics, member-first.',
 'Halcyon runs membership longevity clinics that combine advanced diagnostics with a coaching layer, giving members a clear, data-driven plan to extend their healthspan.',
 'https://halcyon.example.com', 'Austin, TX, USA', 'Fall 2025', 'active', 'Healthcare',
 array['Healthcare','Consumer','Longevity'], 22, 2023, false, true, 'https://linkedin.com', 'https://x.com',
 'Dr. Amara Okonkwo', 'Founder/CEO', 'Physician-scientist focused on translating longevity research into everyday clinical practice.'),
('ledgerline', 'Ledgerline', 'Stablecoin payouts for global contractors.',
 'Ledgerline lets companies pay international contractors in stablecoins with automatic local-currency off-ramps and built-in tax documentation. Payouts settle in seconds, not days.',
 'https://ledgerline.example.com', 'Singapore', 'Winter 2026', 'raising', 'Fintech',
 array['Fintech','Crypto','Payments'], 8, 2025, true, false, 'https://linkedin.com', 'https://x.com',
 'Wei Zhang', 'Co-founder/CEO', 'Payments infra veteran building the rails for borderless work.'),
('studioloop', 'Studioloop', 'AI video editor for short-form creators.',
 'Studioloop turns long recordings into a week of short-form posts, automatically cutting, captioning, and reframing clips for every platform from a single upload.',
 'https://studioloop.example.com', 'Los Angeles, CA, USA', 'Spring 2026', 'active', 'Consumer',
 array['Consumer','AI','Media'], 4, 2026, true, false, 'https://linkedin.com', 'https://x.com',
 'Tara Solis', 'Founder/CEO', 'Creator-turned-founder who edited 1,000+ videos by hand before automating the whole pipeline.'),
('gridwise', 'Gridwise', 'Demand-response software for home batteries.',
 'Gridwise aggregates thousands of home batteries into a virtual power plant, paying homeowners to share stored energy when the grid needs it most.',
 'https://gridwise.example.com', 'Denver, CO, USA', 'Fall 2025', 'active', 'Climate',
 array['Climate','Energy','B2B'], 14, 2024, false, false, 'https://linkedin.com', 'https://x.com',
 'Owen Brooks', 'Co-founder/CEO', 'Grid engineer turning distributed batteries into a cleaner, more resilient power system.'),
('quillbase', 'Quillbase', 'Knowledge base that writes itself.',
 'Quillbase listens to your team''s tickets, chats, and calls, then drafts and maintains a self-updating internal knowledge base so answers are never more than one search away.',
 'https://quillbase.example.com', 'Remote', 'Winter 2026', 'raising', 'B2B',
 array['B2B','AI','Productivity'], 5, 2025, true, false, 'https://linkedin.com', 'https://x.com',
 'Nadia Farouk', 'Founder/CEO', 'Support-ops leader who automated her own team out of repetitive questions.')
) as seed
where not exists (select 1 from public.superhero_startups);

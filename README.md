# Superhero® Startup Directory

A startup directory for the Superhero® / Frontier Tower ecosystem, built with
Next.js 16 (App Router) and Supabase. Browse the companies being built in the
community, open a full profile for each, and submit your own startup.

## Features

- **Directory** (`/`) — searchable, filterable list of startups with a YC-style
  facet sidebar (Top Companies, Is Hiring, Industry, Batch) and client-side
  instant filtering + sorting.
- **Startup profile** (`/startups/[slug]`) — full company page with description,
  founder card, and a details sidebar (founded, batch, team size, status,
  location, links).
- **Submit a startup** (`/submit`) — a Server Action–backed form. Submissions
  are written straight to Supabase and appear in the directory immediately.

## Stack

- Next.js 16 (App Router, Server Components, Server Actions)
- Supabase (Postgres + Row Level Security) via `@supabase/ssr`
- Tailwind CSS v4 with a custom warm-cream Superhero palette
- Fonts: Geist (sans) + Fraunces (display serif)

## Setup

1. Install dependencies:

   ```bash
   pnpm install
   ```

2. Environment variables — `.env.local` (already configured):

   ```
   NEXT_PUBLIC_SUPABASE_URL=...
   NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=...
   ```

3. Create the database — run [`supabase/schema.sql`](./supabase/schema.sql)
   once in the Supabase **SQL Editor**. It creates the `superhero_startups`
   table, RLS policies, indexes, and seed data (idempotent).

4. Run the dev server:

   ```bash
   pnpm dev
   ```

## Database

Single table: `public.superhero_startups`. RLS:

- **Read** — anyone can read rows where `approved = true`.
- **Insert** — anyone can submit a startup (forced `approved = true` so it shows
  immediately). There is intentionally **no** public `update`/`delete` policy.

The app only ever uses the publishable (anon) key — no service-role key is used
anywhere, so it is safe on the server.

import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";

export const STARTUPS_TABLE = "superhero_startups";
export const FOUNDERS_TABLE = "superhero_startup_founders";

export type Founder = {
  id: string;
  name: string;
  role: string | null;
  bio: string | null;
  image_url: string | null;
  linkedin_url: string | null;
  twitter_url: string | null;
  sort_order: number;
};

export type Startup = {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  logo_url: string | null;
  website: string | null;
  location: string | null;
  batch: string | null;
  status: string;
  industry: string | null;
  tags: string[];
  team_size: number | null;
  founded_year: number | null;
  is_hiring: boolean;
  is_top: boolean;
  linkedin_url: string | null;
  twitter_url: string | null;
  founder_name: string | null;
  founder_role: string | null;
  founder_bio: string | null;
  founder_image_url: string | null;
  created_at: string;
};

export type StartupWithFounders = Startup & { founders: Founder[] };

const COLUMNS =
  "id, slug, name, tagline, description, logo_url, website, location, batch, status, industry, tags, team_size, founded_year, is_hiring, is_top, linkedin_url, twitter_url, founder_name, founder_role, founder_bio, founder_image_url, created_at";

async function getSupabase() {
  const cookieStore = await cookies();
  return createClient(cookieStore);
}

/** Fetch every approved startup. The directory is small, so we filter/sort in-memory. */
export async function getAllStartups(): Promise<Startup[]> {
  const supabase = await getSupabase();
  const { data, error } = await supabase
    .from(STARTUPS_TABLE)
    .select(COLUMNS)
    .eq("approved", true)
    .order("is_top", { ascending: false })
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Failed to load startups:", error.message);
    return [];
  }
  return (data ?? []) as Startup[];
}

export async function getStartupBySlug(
  slug: string,
): Promise<StartupWithFounders | null> {
  const supabase = await getSupabase();
  const { data, error } = await supabase
    .from(STARTUPS_TABLE)
    .select(COLUMNS)
    .eq("approved", true)
    .eq("slug", slug)
    .maybeSingle();

  if (error) {
    console.error("Failed to load startup:", error.message);
    return null;
  }
  if (!data) return null;

  const startup = data as Startup;

  const { data: founderRows, error: foundersError } = await supabase
    .from(FOUNDERS_TABLE)
    .select("id, name, role, bio, image_url, linkedin_url, twitter_url, sort_order")
    .eq("startup_id", startup.id)
    .order("sort_order", { ascending: true });

  if (foundersError) {
    console.error("Failed to load founders:", foundersError.message);
  }

  let founders = (founderRows ?? []) as Founder[];

  // Fall back to the legacy single-founder fields if no founder rows exist.
  if (founders.length === 0 && startup.founder_name) {
    founders = [
      {
        id: "legacy",
        name: startup.founder_name,
        role: startup.founder_role,
        bio: startup.founder_bio,
        image_url: startup.founder_image_url,
        linkedin_url: startup.linkedin_url,
        twitter_url: startup.twitter_url,
        sort_order: 0,
      },
    ];
  }

  return { ...startup, founders };
}

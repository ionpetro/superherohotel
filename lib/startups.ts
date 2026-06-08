import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";

export const STARTUPS_TABLE = "superhero_startups";

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

export async function getStartupBySlug(slug: string): Promise<Startup | null> {
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
  return (data as Startup) ?? null;
}

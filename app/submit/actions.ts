"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { STARTUPS_TABLE } from "@/lib/startups";

export type SubmitState = {
  error: string | null;
  fieldErrors?: Record<string, string>;
};

function slugify(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

function str(formData: FormData, key: string): string {
  return (formData.get(key) as string | null)?.trim() ?? "";
}

const VALID_STATUSES = new Set(["active", "raising", "public", "acquired"]);

export async function createStartup(
  _prev: SubmitState,
  formData: FormData,
): Promise<SubmitState> {
  const name = str(formData, "name");
  const tagline = str(formData, "tagline");

  const fieldErrors: Record<string, string> = {};
  if (!name) fieldErrors.name = "Startup name is required.";
  if (name.length > 80) fieldErrors.name = "Keep the name under 80 characters.";
  if (!tagline) fieldErrors.tagline = "A one-line description is required.";
  if (tagline.length > 140)
    fieldErrors.tagline = "Keep the tagline under 140 characters.";

  if (Object.keys(fieldErrors).length > 0) {
    return { error: "Please fix the highlighted fields.", fieldErrors };
  }

  let website = str(formData, "website");
  if (website && !/^https?:\/\//i.test(website)) {
    website = `https://${website}`;
  }

  const teamSizeRaw = str(formData, "team_size");
  const foundedRaw = str(formData, "founded_year");
  const statusRaw = str(formData, "status");

  const tags = str(formData, "tags")
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean)
    .slice(0, 6);

  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  // Build a unique slug.
  const base = slugify(name) || "startup";
  let slug = base;
  for (let attempt = 0; attempt < 5; attempt++) {
    const { data: existing } = await supabase
      .from(STARTUPS_TABLE)
      .select("id")
      .eq("slug", slug)
      .maybeSingle();
    if (!existing) break;
    slug = `${base}-${(attempt + 2).toString()}`;
  }

  const record = {
    slug,
    name,
    tagline,
    description: str(formData, "description") || tagline,
    logo_url: str(formData, "logo_url") || null,
    website: website || null,
    location: str(formData, "location") || null,
    batch: str(formData, "batch") || null,
    status: VALID_STATUSES.has(statusRaw) ? statusRaw : "active",
    industry: str(formData, "industry") || null,
    tags,
    team_size: teamSizeRaw ? Math.max(1, parseInt(teamSizeRaw, 10) || 1) : null,
    founded_year: foundedRaw ? parseInt(foundedRaw, 10) || null : null,
    is_hiring: formData.get("is_hiring") === "on",
    linkedin_url: str(formData, "linkedin_url") || null,
    twitter_url: str(formData, "twitter_url") || null,
    founder_name: str(formData, "founder_name") || null,
    founder_role: str(formData, "founder_role") || null,
    founder_bio: str(formData, "founder_bio") || null,
    submitter_email: str(formData, "submitter_email") || null,
    approved: true,
  };

  const { error } = await supabase.from(STARTUPS_TABLE).insert(record);

  if (error) {
    console.error("Insert failed:", error.message);
    return {
      error:
        "Something went wrong saving your startup. Please try again in a moment.",
    };
  }

  revalidatePath("/");
  redirect(`/startups/${slug}?submitted=1`);
}

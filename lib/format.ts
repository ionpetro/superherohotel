/** Pure, environment-agnostic helpers safe to import from client or server. */

/** A deterministic warm-toned gradient for letter-avatars, derived from a string. */
export function avatarGradient(seed: string): { from: string; to: string } {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash * 31 + seed.charCodeAt(i)) % 360;
  }
  const h1 = hash;
  const h2 = (hash + 38) % 360;
  return {
    from: `hsl(${h1} 45% 58%)`,
    to: `hsl(${h2} 50% 42%)`,
  };
}

/**
 * Normalize a user-entered URL into an absolute one. Values like
 * "linkedin.com/in/abed42" lack a protocol and would otherwise resolve
 * relative to the current page. Returns null for empty input.
 */
export function externalHref(url: string | null | undefined): string | null {
  const trimmed = url?.trim();
  if (!trimmed) return null;
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  if (/^\/\//.test(trimmed)) return `https:${trimmed}`;
  return `https://${trimmed.replace(/^\/+/, "")}`;
}

/** A bare handle has no protocol, domain dot, or path slash — just "abed42" or "@abed42". */
function isHandle(value: string): boolean {
  return !/[./]/.test(value) || /^@/.test(value);
}

/**
 * Build a social profile href from either a full link or a bare handle.
 * "linkedin.com/in/abed42" / "https://…" → used as-is (protocol added if missing);
 * "abed42" or "@abed42" → expanded to the platform's profile URL.
 */
export function socialHref(
  value: string | null | undefined,
  platform: "linkedin" | "twitter",
): string | null {
  const trimmed = value?.trim();
  if (!trimmed) return null;
  if (isHandle(trimmed)) {
    const handle = trimmed.replace(/^@/, "");
    if (!handle) return null;
    return platform === "linkedin"
      ? `https://linkedin.com/in/${handle}`
      : `https://x.com/${handle}`;
  }
  return externalHref(trimmed);
}

export function initials(name: string): string {
  return name
    .replace(/[^a-zA-Z0-9 ]/g, "")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("");
}

export const STATUS_LABELS: Record<string, string> = {
  active: "Active",
  raising: "Raising",
  public: "Public",
  acquired: "Acquired",
};

export const STATUS_DOT: Record<string, string> = {
  active: "#3f9d5a",
  raising: "#c2622d",
  public: "#3f9d5a",
  acquired: "#756c5e",
};

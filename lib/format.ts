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

import { avatarGradient, initials } from "@/lib/format";

export function LogoAvatar({
  name,
  logoUrl,
  size = 56,
  rounded = "rounded-2xl",
}: {
  name: string;
  logoUrl?: string | null;
  size?: number;
  rounded?: string;
}) {
  if (logoUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={logoUrl}
        alt={`${name} logo`}
        width={size}
        height={size}
        className={`${rounded} object-cover border border-line bg-surface shrink-0`}
        style={{ width: size, height: size }}
      />
    );
  }

  const { from, to } = avatarGradient(name);
  return (
    <div
      className={`${rounded} flex items-center justify-center shrink-0 text-white font-semibold border border-black/5`}
      style={{
        width: size,
        height: size,
        background: `linear-gradient(140deg, ${from}, ${to})`,
        fontSize: Math.round(size * 0.36),
      }}
      aria-hidden
    >
      {initials(name)}
    </div>
  );
}

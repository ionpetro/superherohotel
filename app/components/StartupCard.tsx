import Link from "next/link";
import type { Startup } from "@/lib/startups";
import { LogoAvatar } from "./LogoAvatar";
import { Pill } from "./Pill";

export function StartupCard({ startup }: { startup: Startup }) {
  return (
    <Link
      href={`/startups/${startup.slug}`}
      className="group flex gap-4 px-5 py-5 transition-colors hover:bg-surface-2 sm:gap-5 sm:px-6"
    >
      <LogoAvatar name={startup.name} logoUrl={startup.logo_url} size={56} />

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-baseline gap-x-2.5 gap-y-1">
          <h3 className="text-[17px] font-semibold tracking-tight text-ink group-hover:underline decoration-line-strong underline-offset-2">
            {startup.name}
          </h3>
          {startup.location && (
            <span className="text-[13px] text-muted">{startup.location}</span>
          )}
          {startup.is_top && (
            <span title="Top company" className="text-[13px]">
              💎
            </span>
          )}
        </div>

        <p className="mt-1 line-clamp-2 text-[14px] leading-relaxed text-ink-soft">
          {startup.tagline}
        </p>

        <div className="mt-3 flex flex-wrap items-center gap-1.5">
          {startup.industry && <Pill>{startup.industry}</Pill>}
          {startup.is_hiring && <Pill variant="outline">Hiring</Pill>}
          {startup.tags.slice(0, 2).map((t) => (
            <Pill key={t} variant="outline">
              {t}
            </Pill>
          ))}
        </div>
      </div>
    </Link>
  );
}

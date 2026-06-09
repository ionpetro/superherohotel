import Link from "next/link";
import { notFound } from "next/navigation";
import { getStartupBySlug } from "@/lib/startups";
import { STATUS_LABELS, STATUS_DOT } from "@/lib/format";
import { SiteNav } from "@/app/components/SiteNav";
import { SiteFooter } from "@/app/components/SiteFooter";
import { LogoAvatar } from "@/app/components/LogoAvatar";
import { Pill } from "@/app/components/Pill";

export const dynamic = "force-dynamic";

export async function generateMetadata(props: PageProps<"/startups/[slug]">) {
  const { slug } = await props.params;
  const startup = await getStartupBySlug(slug);
  if (!startup) return { title: "Startup not found — Superhero®" };
  return {
    title: `${startup.name} — Superhero® Startup Directory`,
    description: startup.tagline,
  };
}

export default async function StartupPage(props: PageProps<"/startups/[slug]">) {
  const { slug } = await props.params;
  const { submitted } = await props.searchParams;
  const startup = await getStartupBySlug(slug);
  if (!startup) notFound();

  const cleanUrl = startup.website?.replace(/^https?:\/\//, "");

  return (
    <>
      <SiteNav />

      <main className="flex-1">
        <div className="mx-auto max-w-5xl px-5 py-8 sm:px-8 sm:py-10">
          {submitted && (
            <div className="mb-6 flex items-center gap-2.5 rounded-xl border border-line bg-surface px-4 py-3 text-[14px] text-ink">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-ink text-cream text-[11px]">
                ✓
              </span>
              Your startup is live in the directory. Welcome to Superhero®.
            </div>
          )}
          {/* Breadcrumb */}
          <nav className="mb-7 flex items-center gap-2 text-[13px] text-muted">
            <Link href="/" className="text-accent hover:underline">
              Home
            </Link>
            <span>›</span>
            <Link href="/" className="text-accent hover:underline">
              Companies
            </Link>
            <span>›</span>
            <span className="text-ink-soft">{startup.name}</span>
          </nav>

          <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_320px]">
            {/* Main column */}
            <div>
              <div className="flex items-start gap-5">
                <LogoAvatar
                  name={startup.name}
                  logoUrl={startup.logo_url}
                  size={72}
                />
                <div className="min-w-0">
                  <h1 className="text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
                    {startup.name}
                  </h1>
                  <p className="mt-1.5 text-[16px] text-ink-soft">
                    {startup.tagline}
                  </p>
                  <div className="mt-3 flex flex-wrap items-center gap-1.5">
                    <Pill>
                      <span
                        className="h-1.5 w-1.5 rounded-full"
                        style={{
                          backgroundColor:
                            STATUS_DOT[startup.status] ?? "#756c5e",
                        }}
                      />
                      {STATUS_LABELS[startup.status] ?? startup.status}
                    </Pill>
                    {startup.industry && <Pill>{startup.industry}</Pill>}
                    {startup.location && <Pill>{startup.location}</Pill>}
                  </div>
                </div>
              </div>

              {/* Sub nav row */}
              <div className="mt-7 flex items-center justify-between border-b border-line pb-3">
                <span className="text-[15px] font-semibold text-ink">
                  Company
                </span>
                {startup.website && (
                  <a
                    href={startup.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-[14px] text-accent hover:underline"
                  >
                    <LinkIcon />
                    {cleanUrl}
                  </a>
                )}
              </div>

              {/* Description */}
              <div className="mt-7 space-y-4 text-[15px] leading-[1.7] text-ink-soft">
                {startup.description.split("\n\n").map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>

              {/* Tags */}
              {startup.tags.length > 0 && (
                <div className="mt-8 flex flex-wrap gap-1.5">
                  {startup.tags.map((t) => (
                    <Pill key={t} variant="outline">
                      {t}
                    </Pill>
                  ))}
                </div>
              )}

              {/* Founder */}
              {startup.founder_name && (
                <div className="mt-12">
                  <h2 className="text-2xl font-semibold tracking-tight text-ink">
                    {startup.team_size && startup.team_size > 1
                      ? "Active Founders"
                      : "Founder"}
                  </h2>
                  <div className="mt-5 rounded-2xl border border-line bg-surface p-6">
                    <div className="flex items-start gap-4">
                      <LogoAvatar
                        name={startup.founder_name}
                        logoUrl={startup.founder_image_url}
                        size={56}
                        rounded="rounded-full"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-[17px] font-semibold text-ink">
                            {startup.founder_name}
                          </h3>
                        </div>
                        {startup.founder_role && (
                          <p className="text-[13px] text-muted">
                            {startup.founder_role}
                          </p>
                        )}
                        {startup.founder_bio && (
                          <p className="mt-3 text-[14px] leading-relaxed text-ink-soft">
                            {startup.founder_bio}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar card */}
            <aside className="lg:sticky lg:top-24 lg:self-start">
              <div className="rounded-2xl border border-line bg-surface p-6">
                <div className="flex items-center gap-3 pb-5">
                  <LogoAvatar
                    name={startup.name}
                    logoUrl={startup.logo_url}
                    size={40}
                    rounded="rounded-xl"
                  />
                  <span className="text-lg font-semibold text-ink">
                    {startup.name}
                  </span>
                </div>

                <dl className="space-y-3.5 border-t border-line pt-5 text-[14px]">
                  {startup.founded_year && (
                    <Row label="Founded" value={String(startup.founded_year)} />
                  )}
                  {startup.batch && <Row label="Batch" value={startup.batch} />}
                  {startup.team_size && (
                    <Row label="Team Size" value={String(startup.team_size)} />
                  )}
                  <Row
                    label="Status"
                    value={
                      <span className="inline-flex items-center gap-1.5">
                        <span
                          className="h-2 w-2 rounded-full"
                          style={{
                            backgroundColor:
                              STATUS_DOT[startup.status] ?? "#756c5e",
                          }}
                        />
                        {STATUS_LABELS[startup.status] ?? startup.status}
                      </span>
                    }
                  />
                  {startup.location && (
                    <Row label="Location" value={startup.location} />
                  )}
                </dl>

                <div className="mt-6 flex flex-wrap gap-2 border-t border-line pt-5">
                  {startup.website && (
                    <SocialLink href={startup.website} label="Website">
                      <LinkIcon />
                    </SocialLink>
                  )}
                  {startup.linkedin_url && (
                    <SocialLink href={startup.linkedin_url} label="LinkedIn">
                      <span className="text-[13px] font-bold">in</span>
                    </SocialLink>
                  )}
                  {startup.twitter_url && (
                    <SocialLink href={startup.twitter_url} label="X">
                      <span className="text-[13px] font-bold">𝕏</span>
                    </SocialLink>
                  )}
                </div>
              </div>

              <Link
                href="/submit"
                className="mt-4 flex w-full items-center justify-center rounded-xl border border-line-strong bg-cream-deep px-4 py-3 text-[14px] font-medium text-ink transition-colors hover:bg-cream"
              >
                Submit your startup →
              </Link>
            </aside>
          </div>
        </div>
      </main>

      <SiteFooter />
    </>
  );
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <dt className="text-muted">{label}:</dt>
      <dd className="text-right font-medium text-ink">{value}</dd>
    </div>
  );
}

function SocialLink({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      title={label}
      className="flex h-9 w-9 items-center justify-center rounded-lg border border-line-strong bg-surface text-ink-soft transition-colors hover:bg-cream-deep"
    >
      {children}
    </a>
  );
}

function LinkIcon() {
  return (
    <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none">
      <path
        d="M8 12a3 3 0 004.24 0l2.5-2.5a3 3 0 00-4.24-4.24L9.5 6.26"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M12 8a3 3 0 00-4.24 0l-2.5 2.5a3 3 0 004.24 4.24L10.5 13.74"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

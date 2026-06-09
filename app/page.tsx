import Link from "next/link";
import { getAllStartups } from "@/lib/startups";
import { SiteNav } from "./components/SiteNav";
import { DirectoryClient } from "./components/DirectoryClient";
import { SiteFooter } from "./components/SiteFooter";

export const dynamic = "force-dynamic";

function facetCounts(values: (string | null)[]) {
  const map = new Map<string, number>();
  for (const v of values) {
    if (!v) continue;
    map.set(v, (map.get(v) ?? 0) + 1);
  }
  return [...map.entries()]
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
}

export default async function Home() {
  const startups = await getAllStartups();

  const industries = facetCounts(startups.map((s) => s.industry));
  const hiringCount = startups.filter((s) => s.is_hiring).length;
  const topCount = startups.filter((s) => s.is_top).length;

  return (
    <>
      <SiteNav />

      <main className="flex-1">
        {/* Hero */}
        <section className="bg-dots border-b border-line">
          <div className="mx-auto max-w-6xl px-5 py-16 text-center sm:px-8 sm:py-24">
            <span className="inline-flex items-center gap-2 rounded-full bg-cream-deep px-3.5 py-1.5 text-[12px] font-medium uppercase tracking-wider text-ink-soft">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" />
              The Superhero® ecosystem
            </span>
            <h1 className="mx-auto mt-6 max-w-3xl font-display text-5xl font-medium italic leading-[1.05] tracking-tight text-ink sm:text-7xl">
              Startup Directory
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-[16px] leading-relaxed text-ink-soft sm:text-[18px]">
              The companies being built across Frontier Tower and the Superhero®
              community. Discover what founders are shipping — and{" "}
              <Link href="/submit" className="font-medium text-ink underline decoration-line-strong underline-offset-2 hover:decoration-ink">
                add the project you&apos;re building
              </Link>
              .
            </p>
          </div>
        </section>

        {/* Directory */}
        <section className="mx-auto max-w-6xl px-5 py-10 sm:px-8 sm:py-14">
          <DirectoryClient
            startups={startups}
            industries={industries}
            hiringCount={hiringCount}
            topCount={topCount}
          />
        </section>
      </main>

      <SiteFooter />
    </>
  );
}

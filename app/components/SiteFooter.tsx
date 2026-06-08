import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-line bg-surface-2">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-5 py-10 text-[13px] text-muted sm:flex-row sm:px-8">
        <div className="flex items-center gap-2.5">
          <span className="flex h-6 w-6 items-center justify-center rounded-md bg-ink text-cream font-display text-sm leading-none">
            S
          </span>
          <span>
            Superhero<sup className="text-[8px]">®</sup> — the hotel for founders
            &amp; VCs.
          </span>
        </div>
        <div className="flex items-center gap-6">
          <Link href="/" className="hover:text-ink transition-colors">
            Directory
          </Link>
          <Link href="/submit" className="hover:text-ink transition-colors">
            Submit
          </Link>
          <a
            href="https://frontiertower.io"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-ink transition-colors"
          >
            Frontier Tower
          </a>
        </div>
      </div>
    </footer>
  );
}

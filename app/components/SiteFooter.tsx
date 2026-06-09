import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-line bg-surface-2">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-5 py-10 text-[13px] text-muted sm:flex-row sm:px-8">
        <div className="flex items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/superhero-logo.svg"
            alt="Superhero"
            className="h-5 w-auto"
            width={120}
            height={20}
          />
          <span>— the hotel for founders &amp; VCs.</span>
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

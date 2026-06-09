import Link from "next/link";

export function SiteNav() {
  return (
    <header className="sticky top-0 z-40 border-b border-line/70 bg-cream/85 backdrop-blur-md">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-8">
        <Link href="/" className="flex items-center group" aria-label="Superhero home">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/superhero-logo.svg"
            alt="Superhero"
            className="h-7 w-auto"
            width={170}
            height={28}
          />
        </Link>

        <div className="hidden items-center gap-7 text-[14px] text-ink-soft sm:flex">
          <Link href="/" className="hover:text-ink transition-colors">
            Directory
          </Link>
          <a
            href="https://frontiertower.io"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-ink transition-colors"
          >
            Frontier Tower
          </a>
          <a
            href="https://superhero.hotel"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-ink transition-colors"
          >
            About
          </a>
        </div>

        <Link
          href="/submit"
          className="rounded-full bg-ink px-4 py-2 text-[13px] font-medium text-cream transition-transform hover:scale-[1.03] active:scale-95"
        >
          Submit a startup
        </Link>
      </nav>
    </header>
  );
}

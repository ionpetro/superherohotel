"use client";

import { useMemo, useState } from "react";
import type { Startup } from "@/lib/startups";
import { StartupCard } from "./StartupCard";

type Facet = { name: string; count: number };

export function DirectoryClient({
  startups,
  industries,
  hiringCount,
  topCount,
}: {
  startups: Startup[];
  industries: Facet[];
  hiringCount: number;
  topCount: number;
}) {
  const [query, setQuery] = useState("");
  const [selectedIndustries, setSelectedIndustries] = useState<string[]>([]);
  const [onlyHiring, setOnlyHiring] = useState(false);
  const [onlyTop, setOnlyTop] = useState(false);
  const [sort, setSort] = useState<"default" | "newest" | "name">("default");

  function toggle(list: string[], value: string): string[] {
    return list.includes(value)
      ? list.filter((v) => v !== value)
      : [...list, value];
  }

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let result = startups.filter((s) => {
      if (onlyHiring && !s.is_hiring) return false;
      if (onlyTop && !s.is_top) return false;
      if (selectedIndustries.length && !selectedIndustries.includes(s.industry ?? ""))
        return false;
      if (q) {
        const haystack = [
          s.name,
          s.tagline,
          s.description,
          s.location,
          s.industry,
          ...(s.tags ?? []),
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    });

    if (sort === "name") {
      result = [...result].sort((a, b) => a.name.localeCompare(b.name));
    } else if (sort === "newest") {
      result = [...result].sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
      );
    }
    return result;
  }, [startups, query, selectedIndustries, onlyHiring, onlyTop, sort]);

  const hasFilters =
    selectedIndustries.length > 0 || onlyHiring || onlyTop || query.length > 0;

  return (
    <div>
      {/* Sort row */}
      <div className="mb-4 flex items-center justify-end gap-3">
        <label className="text-[14px] text-muted">Sort by</label>
        <div className="relative">
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as typeof sort)}
            className="cursor-pointer rounded-lg border border-line-strong bg-surface py-2 pl-3 pr-9 text-[14px] text-ink shadow-sm focus:border-ink focus:outline-none"
          >
            <option value="default">Default</option>
            <option value="newest">Newest</option>
            <option value="name">Name (A–Z)</option>
          </select>
          <svg
            className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
            viewBox="0 0 20 20"
            fill="none"
          >
            <path
              d="M6 8l4 4 4-4"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[260px_1fr]">
        {/* Sidebar */}
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-2xl border border-line bg-surface p-5">
            <CheckRow
              label="💎 Top Companies"
              count={topCount}
              checked={onlyTop}
              onChange={() => setOnlyTop((v) => !v)}
            />
            <CheckRow
              label="Is Hiring"
              count={hiringCount}
              checked={onlyHiring}
              onChange={() => setOnlyHiring((v) => !v)}
            />

            <Divider />

            <FacetGroup title="Industry">
              {industries.map((f) => (
                <CheckRow
                  key={f.name}
                  label={f.name}
                  count={f.count}
                  checked={selectedIndustries.includes(f.name)}
                  onChange={() =>
                    setSelectedIndustries((l) => toggle(l, f.name))
                  }
                />
              ))}
            </FacetGroup>

            {hasFilters && (
              <>
                <Divider />
                <button
                  onClick={() => {
                    setQuery("");
                    setSelectedIndustries([]);
                    setOnlyHiring(false);
                    setOnlyTop(false);
                  }}
                  className="text-[13px] font-medium text-ink hover:underline"
                >
                  Clear all filters
                </button>
              </>
            )}
          </div>
        </aside>

        {/* Results */}
        <div>
          <div className="rounded-2xl border border-line bg-surface p-2">
            <div className="relative">
              <svg
                className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted"
                viewBox="0 0 20 20"
                fill="none"
              >
                <circle
                  cx="9"
                  cy="9"
                  r="6"
                  stroke="currentColor"
                  strokeWidth="1.6"
                />
                <path
                  d="M14 14l3 3"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                />
              </svg>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search startups, tags, locations…"
                className="w-full rounded-xl bg-transparent py-3.5 pl-12 pr-4 text-[15px] text-ink placeholder:text-muted focus:outline-none"
              />
            </div>
          </div>

          <p className="mt-4 px-1 text-[14px] text-muted">
            Showing <span className="text-ink-soft font-medium">{filtered.length}</span>{" "}
            of {startups.length} companies
          </p>

          <div className="mt-3 overflow-hidden rounded-2xl border border-line bg-surface divide-y divide-line">
            {filtered.length === 0 ? (
              <div className="px-6 py-16 text-center">
                <p className="text-[15px] text-ink-soft">No startups match your filters.</p>
                <p className="mt-1 text-[14px] text-muted">
                  Try clearing a filter or searching for something else.
                </p>
              </div>
            ) : (
              filtered.map((s) => <StartupCard key={s.id} startup={s} />)
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function CheckRow({
  label,
  count,
  checked,
  onChange,
}: {
  label: string;
  count: number;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-2.5 py-1.5 text-[14px] text-ink-soft select-none">
      <span
        className={`flex h-[18px] w-[18px] items-center justify-center rounded-[5px] border transition-colors ${
          checked ? "border-ink bg-ink" : "border-line-strong bg-surface"
        }`}
      >
        {checked && (
          <svg viewBox="0 0 16 16" className="h-3 w-3 text-cream" fill="none">
            <path
              d="M3.5 8.5l3 3 6-6.5"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </span>
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="sr-only"
      />
      <span className="flex-1">{label}</span>
      <span className="rounded bg-cream-deep px-1.5 py-0.5 text-[11px] text-muted">
        {count}
      </span>
    </label>
  );
}

function FacetGroup({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h4 className="mb-1.5 text-[13px] font-semibold uppercase tracking-wide text-ink">
        {title}
      </h4>
      {children}
    </div>
  );
}

function Divider() {
  return <div className="my-4 h-px bg-line" />;
}

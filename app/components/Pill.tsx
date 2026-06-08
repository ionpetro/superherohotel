export function Pill({
  children,
  variant = "soft",
}: {
  children: React.ReactNode;
  variant?: "soft" | "ink" | "outline";
}) {
  const styles = {
    soft: "bg-cream-deep text-ink-soft border border-line",
    ink: "bg-ink text-cream border border-ink",
    outline: "bg-transparent text-ink-soft border border-line-strong",
  }[variant];

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-[11px] font-medium uppercase tracking-wide ${styles}`}
    >
      {children}
    </span>
  );
}

export function BatchPill({ batch }: { batch: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-md border border-line bg-cream-deep py-1 pl-1 pr-2.5 text-[11px] font-medium uppercase tracking-wide text-ink-soft">
      <span className="flex h-4 w-4 items-center justify-center rounded-[3px] bg-accent text-[9px] font-bold text-white leading-none">
        S
      </span>
      {batch}
    </span>
  );
}

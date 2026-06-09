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

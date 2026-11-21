const kes = new Intl.NumberFormat("en-KE", {
  style: "currency",
  currency: "KES",
  currencyDisplay: "code",
  maximumFractionDigits: 0,
});

export function formatKES(value: number | null): string {
  if (value === null) return "Not yet reported";
  return kes.format(value);
}

export function formatCompactKES(value: number): string {
  if (value >= 1_000_000) return `KES ${(value / 1_000_000).toFixed(0)}M`;
  if (value >= 1_000) return `KES ${Math.round(value / 1_000)}K`;
  return `KES ${value}`;
}

export function formatDate(iso: string): string {
  const date = new Date(`${iso}T00:00:00Z`);
  if (Number.isNaN(date.getTime())) return iso;
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}

export function formatPercent(received: number | null, target: number | null): string {
  if (received === null || target === null || target <= 0) return "—";
  const pct = (received / target) * 100;
  if (pct === 0) return "0%";
  if (pct < 0.1) return "<0.1%";
  return `${pct.toFixed(pct < 10 ? 1 : 0)}%`;
}

/** Honest progress width: never render a visible bar for a zero balance. */
export function progressWidth(received: number | null, target: number | null): string {
  if (received === null || target === null || target <= 0 || received <= 0) return "0%";
  return `${Math.min(100, Math.max(0.6, (received / target) * 100))}%`;
}

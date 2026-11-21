import { formatDate, formatKES, formatPercent, progressWidth } from "@/lib/format";

/**
 * Truthful funding meter. Received is the only state BBVF can evidence today;
 * pending and disbursed are shown as explicitly not yet reconciled rather than
 * invented. Width is computed server-side from published figures.
 */
export function ProgressLedger({
  target,
  received,
  supporters,
  reportedOn,
  tone = "light",
}: {
  target: number | null;
  received: number | null;
  supporters: number | null;
  reportedOn: string;
  tone?: "light" | "dark";
}) {
  const dark = tone === "dark";

  return (
    <div>
      <div className="flex items-baseline justify-between gap-4">
        <p className={`font-display text-2xl ${dark ? "text-bone" : "text-ink"}`}>
          {formatKES(received)}
        </p>
        <p className={`text-xs ${dark ? "text-bone/65" : "text-ink/65"}`}>
          of {formatKES(target)} target
        </p>
      </div>

      <div
        className={`mt-3 h-1.5 w-full overflow-hidden rounded-full ${
          dark ? "bg-bone/15" : "bg-ink/10"
        }`}
        role="img"
        aria-label={`Funding recorded: ${formatPercent(received, target)} of the target`}
      >
        <div
          className="h-full rounded-full bg-clay"
          style={{ width: progressWidth(received, target) }}
        />
      </div>

      <div
        className={`mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-[0.68rem] ${
          dark ? "text-bone/60" : "text-ink/65"
        }`}
      >
        <span>{formatPercent(received, target)} recorded</span>
        <span aria-hidden="true">·</span>
        <span>
          {supporters ?? 0} supporter{supporters === 1 ? "" : "s"}
        </span>
        <span aria-hidden="true">·</span>
        <span>Snapshot {formatDate(reportedOn)}</span>
      </div>

      <p
        className={`mt-3 text-[0.68rem] leading-relaxed ${
          dark ? "text-bone/60" : "text-ink/65"
        }`}
      >
        This is the amount displayed on the public campaign page on the date
        shown. Pending and disbursed balances are published only after finance
        reconciliation.
      </p>
    </div>
  );
}

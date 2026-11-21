type Glyph = "child" | "elder" | "disability" | "veteran";

/**
 * Abstract, non-photographic programme marks. They avoid stock imagery of
 * beneficiaries — the spec forbids publishing identifiable people without
 * recorded consent — while still giving each programme a distinct identity.
 */
export function ProgramGlyph({
  glyph,
  className = "h-full w-full",
}: {
  glyph: Glyph;
  className?: string;
}) {
  const common = {
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.1,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };

  return (
    <svg viewBox="0 0 200 200" className={className} aria-hidden="true" focusable="false">
      <g opacity="0.28" stroke="currentColor" strokeWidth="0.6">
        <circle cx="100" cy="100" r="82" fill="none" />
        <circle cx="100" cy="100" r="60" fill="none" />
        <path d="M18 100h164M100 18v164" />
      </g>

      {glyph === "child" && (
        <g {...common}>
          <path d="M58 132V94l42-30 42 30v38" />
          <path d="M58 132h84" />
          <path d="M86 132v-24a14 14 0 0 1 28 0v24" />
          <circle cx="100" cy="62" r="9" />
          <path d="M74 152h52M82 164h36" opacity="0.5" />
        </g>
      )}

      {glyph === "elder" && (
        <g {...common}>
          <circle cx="88" cy="66" r="15" />
          <path d="M70 96c8-8 28-8 36 0l6 30" />
          <path d="M76 126l-10 40M112 126l12 40" />
          <path d="M132 72v84M120 72h24" />
          <path d="M126 92c-6-6-14-2-14 6s14 14 14 14 14-6 14-14-8-12-14-6Z" opacity="0.55" />
        </g>
      )}

      {glyph === "disability" && (
        <g {...common}>
          <circle cx="100" cy="58" r="13" />
          <path d="M100 74v38h30l12 34" />
          <circle cx="118" cy="132" r="26" />
          <path d="M92 92 74 118" />
          <path d="M64 150h28" opacity="0.45" />
        </g>
      )}

      {glyph === "veteran" && (
        <g {...common}>
          <circle cx="92" cy="58" r="14" />
          <path d="M92 74v44l-14 42M92 118l16 42" />
          <path d="M74 92h40l10 34" />
          <path d="M138 66l10 10-10 10-10-10 10-10Z" />
          <path d="M138 86v38" opacity="0.55" />
          <path d="M120 158h44" opacity="0.4" />
        </g>
      )}
    </svg>
  );
}

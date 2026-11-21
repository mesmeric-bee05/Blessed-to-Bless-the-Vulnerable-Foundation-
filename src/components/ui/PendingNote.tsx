import { Shield } from "@/components/ui/icons";

export function PendingNote({
  title,
  children,
  tone = "light",
}: {
  title: string;
  children: React.ReactNode;
  tone?: "light" | "dark";
}) {
  const dark = tone === "dark";
  return (
    <div
      className={`flex gap-3 rounded-2xl border p-5 ${
        dark
          ? "border-bone/15 bg-bone/[0.04]"
          : "border-ink/10 bg-paper/60"
      }`}
    >
      <Shield
        className={`mt-0.5 h-5 w-5 shrink-0 ${dark ? "text-ochre" : "text-sage"}`}
      />
      <div>
        <p
          className={`text-[0.7rem] font-semibold uppercase tracking-[0.14em] ${
            dark ? "text-ochre" : "text-ink/65"
          }`}
        >
          {title}
        </p>
        <div
          className={`mt-1.5 text-xs leading-relaxed ${
            dark ? "text-bone/70" : "text-ink/70"
          }`}
        >
          {children}
        </div>
      </div>
    </div>
  );
}

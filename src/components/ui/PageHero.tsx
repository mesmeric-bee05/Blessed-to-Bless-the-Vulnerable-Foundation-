import type { ReactNode } from "react";

export function PageHero({
  eyebrow,
  title,
  intro,
  meta,
  children,
}: {
  eyebrow: string;
  title: ReactNode;
  intro?: ReactNode;
  meta?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <header className="relative overflow-hidden border-b border-ink/10 bg-bone">
      <div className="woven pointer-events-none absolute inset-0 opacity-50" aria-hidden="true" />
      <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[radial-gradient(circle,rgba(217,162,83,0.22),transparent_70%)] blur-2xl" aria-hidden="true" />
      <div className="wrap relative z-10 pb-14 pt-14 md:pb-20 md:pt-20">
        <p className="eyebrow text-clay">{eyebrow}</p>
        <h1 className="display-sm mt-4 max-w-4xl text-ink">{title}</h1>
        {intro && (
          <div className="lede mt-6 max-w-2xl">
            {typeof intro === "string" ? <p>{intro}</p> : intro}
          </div>
        )}
        {meta && (
          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-ink/65">
            {meta}
          </div>
        )}
        {children && <div className="mt-9">{children}</div>}
      </div>
    </header>
  );
}

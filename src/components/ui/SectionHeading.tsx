import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowUpRight } from "@/components/ui/icons";

export function SectionHeading({
  eyebrow,
  title,
  description,
  action,
  tone = "light",
  align = "left",
}: {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  action?: { label: string; href: string };
  tone?: "light" | "dark";
  align?: "left" | "center";
}) {
  const dark = tone === "dark";
  return (
    <div
      className={`flex flex-col gap-6 md:flex-row md:items-end md:justify-between ${
        align === "center" ? "text-center md:flex-col md:items-center" : ""
      }`}
    >
      <div className={align === "center" ? "max-w-2xl" : "max-w-2xl"}>
        {eyebrow && (
          <p className={`eyebrow ${dark ? "text-ochre" : "text-clay"}`}>{eyebrow}</p>
        )}
        <h2
          className={`display-sm mt-3 ${dark ? "text-bone" : "text-ink"}`}
        >
          {title}
        </h2>
        {description && (
          <p
            className={`mt-4 max-w-xl text-sm leading-relaxed md:text-base ${
              dark ? "text-bone/65" : "text-ink/65"
            } ${align === "center" ? "mx-auto" : ""}`}
          >
            {description}
          </p>
        )}
      </div>
      {action && (
        <Link
          href={action.href}
          className={`group inline-flex shrink-0 items-center gap-1.5 border-b pb-1 text-sm font-semibold transition-colors ${
            dark
              ? "border-bone/25 text-bone hover:border-ochre hover:text-ochre"
              : "border-ink/20 text-ink hover:border-clay hover:text-clay"
          }`}
        >
          {action.label}
          <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </Link>
      )}
    </div>
  );
}

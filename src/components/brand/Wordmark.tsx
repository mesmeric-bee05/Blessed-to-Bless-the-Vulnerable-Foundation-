import Link from "next/link";
import { site } from "@/content/site";

export function Seal({ className = "h-10 w-10" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 48"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <circle cx="24" cy="24" r="22.5" fill="none" stroke="currentColor" strokeWidth="1.2" />
      <circle cx="24" cy="24" r="16.5" fill="none" stroke="currentColor" strokeWidth="0.8" opacity="0.55" />
      <g stroke="currentColor" strokeWidth="0.7" opacity="0.5">
        <path d="M8 24h32M24 8v32M13 13l22 22M35 13 13 35" />
      </g>
      <path
        d="M24 12.5c3.6 3.2 6 6.8 6 10.4a6 6 0 1 1-12 0c0-3.6 2.4-7.2 6-10.4Z"
        fill="currentColor"
        opacity="0.92"
      />
      <path d="M24 30.5v6" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

export function Wordmark({ tone = "ink" }: { tone?: "ink" | "bone" }) {
  const colour = tone === "ink" ? "text-ink" : "text-bone";
  return (
    <Link
      href="/"
      className={`group flex items-center gap-3 ${colour}`}
      aria-label={`${site.name} — home`}
    >
      <span className="text-clay transition-transform duration-500 group-hover:rotate-[14deg]">
        <Seal className="h-9 w-9 sm:h-10 sm:w-10 md:h-11 md:w-11" />
      </span>
      <span className="flex min-w-0 flex-col leading-none">
        <span className="font-display text-[1.25rem] font-semibold tracking-tight sm:text-[1.35rem] md:text-[1.5rem]">
          BBVF
        </span>
        <span className="mt-1 hidden max-w-[11rem] text-[0.52rem] font-medium uppercase leading-[1.35] tracking-[0.12em] opacity-75 sm:block md:max-w-[13rem] md:tracking-[0.14em]">
          Blessed to Bless the Vulnerable Foundation
        </span>
      </span>
    </Link>
  );
}

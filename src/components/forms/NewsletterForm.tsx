"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Check } from "@/components/ui/icons";

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [error, setError] = useState<string | null>(null);
  const [startedAt] = useState(() => Date.now());

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "sending") return;
    setError(null);

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
      setError("Enter a valid email address.");
      return;
    }
    if (!consent) {
      setError("Please confirm you agree to receive updates.");
      return;
    }

    setStatus("sending");
    try {
      const response = await fetch("/api/forms/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          consent,
          startedAt,
          sourcePage: window.location.pathname,
          policyVersion: "2026-11-21",
        }),
      });
      const payload = (await response.json()) as {
        ok?: boolean;
        error?: string;
      };
      if (!response.ok || !payload.ok) {
        setError(payload.error ?? "Something went wrong. Please try again.");
        setStatus("error");
        return;
      }
      setStatus("done");
    } catch {
      setError("Network error. Please check your connection and try again.");
      setStatus("error");
    }
  }

  if (status === "done") {
    return (
      <div
        role="status"
        className="flex items-start gap-3 rounded-xl border border-ochre/30 bg-ochre/10 p-4"
      >
        <Check className="mt-0.5 h-5 w-5 shrink-0 text-ochre" />
        <p className="text-xs leading-relaxed text-bone/80">
          You&rsquo;re subscribed. Every message includes a one-click
          unsubscribe link.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate>
      <div className="flex flex-col gap-2">
        <label htmlFor="footer-email" className="sr-only">
          Email address
        </label>
        <div className="flex overflow-hidden rounded-full border border-bone/20 bg-bone/[0.06] focus-within:border-ochre/70">
          <input
            id="footer-email"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@example.com"
            aria-invalid={Boolean(error) || undefined}
            aria-describedby={error ? "footer-newsletter-error" : undefined}
            className="min-w-0 flex-1 bg-transparent px-4 py-3 text-sm text-bone placeholder:text-bone/60 focus:outline-none"
          />
          <button
            type="submit"
            disabled={status === "sending"}
            className="m-1 inline-flex shrink-0 items-center gap-1.5 rounded-full bg-ochre px-4 text-xs font-semibold text-ink transition-colors hover:bg-[#e6b167] disabled:opacity-60"
          >
            {status === "sending" ? "…" : "Join"}
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>

        <label className="flex items-start gap-2 text-[0.68rem] leading-relaxed text-bone/65">
          <input
            type="checkbox"
            checked={consent}
            onChange={(event) => setConsent(event.target.checked)}
            className="mt-0.5 h-3.5 w-3.5 shrink-0 accent-[var(--color-ochre)]"
          />
          <span>
            I agree to receive occasional BBVF updates. See the{" "}
            <Link href="/policies/privacy" className="underline underline-offset-2">
              privacy notice
            </Link>
            .
          </span>
        </label>

        {error && (
          <p id="footer-newsletter-error" role="alert" className="text-xs text-ochre">
            {error}
          </p>
        )}
      </div>
    </form>
  );
}

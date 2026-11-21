"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Check, Lock, Shield } from "@/components/ui/icons";

type Method = "mpesa" | "card";

const KES_PRESETS = [500, 1000, 2500, 5000, 10000];
const USD_PRESETS = [10, 25, 50, 100, 250];

export function DonationCheckout({
  availability,
  initialMethod = "mpesa",
  campaignSlug,
}: {
  availability: { mpesa: boolean; card: boolean };
  initialMethod?: Method;
  campaignSlug?: string;
}) {
  const [method, setMethod] = useState<Method>(initialMethod);
  const [amount, setAmount] = useState<string>("1000");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [consent, setConsent] = useState(false);
  const [status, setStatus] = useState<"idle" | "sending" | "pending" | "error">("idle");
  const [message, setMessage] = useState<string | null>(null);
  const [reference, setReference] = useState<string | null>(null);
  const [startedAt] = useState(() => Date.now());

  const currency = method === "card" ? "USD" : "KES";
  const presets = method === "card" ? USD_PRESETS : KES_PRESETS;
  const available = method === "mpesa" ? availability.mpesa : availability.card;

  function chooseMethod(next: Method) {
    setMethod(next);
    setAmount(next === "card" ? "25" : "1000");
    setStatus("idle");
    setMessage(null);
    setReference(null);
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "sending") return;
    setMessage(null);

    const numeric = Number(amount);
    if (!Number.isFinite(numeric) || numeric <= 0) {
      setMessage("Enter an amount.");
      setStatus("error");
      return;
    }
    if (!consent) {
      setMessage("Please confirm you have read the privacy notice.");
      setStatus("error");
      return;
    }

    setStatus("sending");
    try {
      const response = await fetch("/api/donations/intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: numeric,
          method,
          email,
          name: name || undefined,
          phone: phone || undefined,
          campaignSlug,
          consent,
          startedAt,
        }),
      });
      const payload = (await response.json()) as {
        ok?: boolean;
        error?: string;
        reference?: string;
        redirectUrl?: string;
        message?: string;
      };

      if (!response.ok || !payload.ok) {
        setMessage(payload.error ?? "We could not start the donation.");
        setStatus("error");
        return;
      }

      setReference(payload.reference ?? null);
      if (payload.redirectUrl) {
        window.location.assign(payload.redirectUrl);
        return;
      }
      setMessage(payload.message ?? null);
      setStatus("pending");
    } catch {
      setMessage("Network error. Please check your connection and try again.");
      setStatus("error");
    }
  }

  if (!availability.mpesa && !availability.card) {
    return (
      <div className="rounded-2xl border border-dashed border-ink/25 bg-bone/60 p-6">
        <div className="flex items-center gap-2 text-ink/70">
          <Lock className="h-5 w-5" />
          <p className="text-[0.65rem] font-semibold uppercase tracking-[0.14em]">
            Not open yet
          </p>
        </div>
        <h2 className="mt-4 font-display text-2xl text-ink">
          No payment rail is connected here.
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-ink/70">
          BBVF will not show a checkout that cannot settle, refund or reconcile.
          Until the merchant accounts are verified and the webhooks are live, use
          the{" "}
          <a
            href="https://jamii.esoqo.com/o/blessed-to-bless-the-vulnerable-foundation"
            target="_blank"
            rel="noopener noreferrer"
            className="text-clay underline underline-offset-2"
          >
            verified Our Jamii route
          </a>
          .
        </p>
      </div>
    );
  }

  if (status === "pending") {
    return (
      <div role="status" className="rounded-2xl border border-clay/25 bg-clay/[0.06] p-6">
        <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-clay text-paper">
          <Check className="h-5 w-5" />
        </span>
        <h2 className="mt-4 font-display text-2xl text-ink">Check your phone</h2>
        <p className="mt-2 text-sm leading-relaxed text-ink/75">
          {message ??
            "Enter your M-Pesa PIN only in the prompt on your phone. Nothing is credited until the payment is verified."}
        </p>
        {reference && (
          <p className="mt-4 text-xs text-ink/65">
            Reference: <span className="font-mono">{reference}</span>
          </p>
        )}
      </div>
    );
  }

  const inputClass =
    "w-full rounded-xl border border-ink/15 bg-paper px-4 py-3 text-sm text-ink placeholder:text-ink/55 focus:border-clay focus:outline-none";
  const labelClass =
    "mb-1.5 block text-[0.72rem] font-semibold uppercase tracking-[0.12em] text-ink/70";

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div className="grid gap-3 sm:grid-cols-2">
        {(
          [
            { key: "mpesa", label: "M-Pesa", detail: "Kenya · KES", open: availability.mpesa },
            { key: "card", label: "Card", detail: "International · USD", open: availability.card },
          ] as const
        ).map((option) => (
          <button
            key={option.key}
            type="button"
            onClick={() => chooseMethod(option.key)}
            aria-pressed={method === option.key}
            disabled={!option.open}
            className={`rounded-xl border p-4 text-left transition-colors disabled:opacity-50 ${
              method === option.key
                ? "border-clay bg-clay/[0.06]"
                : "border-ink/15 bg-paper hover:border-ink/30"
            }`}
          >
            <span className="block text-sm font-semibold text-ink">{option.label}</span>
            <span className="mt-0.5 block text-[0.68rem] text-ink/60">
              {option.open ? option.detail : "Not connected"}
            </span>
          </button>
        ))}
      </div>

      <div>
        <p className={labelClass}>Amount ({currency})</p>
        <div className="flex flex-wrap gap-2">
          {presets.map((preset) => (
            <button
              key={preset}
              type="button"
              onClick={() => setAmount(String(preset))}
              aria-pressed={amount === String(preset)}
              className={`rounded-full border px-4 py-2 text-xs font-semibold ${
                amount === String(preset)
                  ? "border-ink bg-ink text-bone"
                  : "border-ink/15 text-ink hover:border-ink/35"
              }`}
            >
              {preset.toLocaleString("en-KE")}
            </button>
          ))}
        </div>
        <input
          aria-label={`Amount in ${currency}`}
          type="number"
          min={method === "card" ? 5 : 10}
          max={method === "card" ? 25000 : 1000000}
          step="1"
          value={amount}
          onChange={(event) => setAmount(event.target.value)}
          className={`${inputClass} mt-3`}
          required
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="donor-name" className={labelClass}>
            Name (optional)
          </label>
          <input
            id="donor-name"
            type="text"
            autoComplete="name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="donor-email" className={labelClass}>
            Email for your receipt <span aria-hidden="true">*</span>
          </label>
          <input
            id="donor-email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className={inputClass}
            required
          />
        </div>
      </div>

      {method === "mpesa" && (
        <div>
          <label htmlFor="donor-phone" className={labelClass}>
            Safaricom number <span aria-hidden="true">*</span>
          </label>
          <input
            id="donor-phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            placeholder="0712 345 678"
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            className={inputClass}
            required
          />
          <p className="mt-1.5 text-xs text-ink/60">
            Used only to send the STK prompt. Never enter your PIN on this site.
          </p>
        </div>
      )}

      <label className="flex items-start gap-2.5 text-xs leading-relaxed text-ink/70">
        <input
          type="checkbox"
          checked={consent}
          onChange={(event) => setConsent(event.target.checked)}
          className="mt-0.5 h-4 w-4 accent-[var(--color-clay)]"
          required
        />
        <span>
          I have read the{" "}
          <Link href="/policies/privacy" className="text-clay underline underline-offset-2">
            privacy notice
          </Link>{" "}
          and the{" "}
          <Link href="/policies/donations" className="text-clay underline underline-offset-2">
            donation terms
          </Link>
          . I understand a receipt is issued only after the payment is verified.
        </span>
      </label>

      {message && status === "error" && (
        <div role="alert" className="rounded-xl border border-clay/30 bg-clay/[0.06] p-4 text-xs text-clay-dark">
          {message}
        </div>
      )}

      <button
        type="submit"
        disabled={status === "sending" || !available}
        className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-clay px-6 py-3.5 text-sm font-semibold text-paper transition-colors hover:bg-clay-dark disabled:opacity-60"
      >
        {status === "sending"
          ? "Starting…"
          : method === "mpesa"
            ? `Send M-Pesa prompt for ${currency} ${Number(amount || 0).toLocaleString("en-KE")}`
            : `Continue to secure card checkout`}
        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
      </button>

      <p className="flex items-start gap-1.5 text-[0.68rem] leading-relaxed text-ink/60">
        <Shield className="mt-0.5 h-3.5 w-3.5 shrink-0" />
        Card details are entered on the provider&rsquo;s hosted page, never on a
        BBVF server. BBVF never asks for your M-Pesa PIN.
      </p>
    </form>
  );
}

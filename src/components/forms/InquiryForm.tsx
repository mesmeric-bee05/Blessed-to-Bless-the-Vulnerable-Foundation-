"use client";

import { useState } from "react";
import Link from "next/link";
import type { FormKind } from "@/lib/forms";
import { ArrowRight, Check, Shield } from "@/components/ui/icons";

type FieldKey =
  | "fullName"
  | "email"
  | "phone"
  | "organisation"
  | "amountBand"
  | "method"
  | "topic"
  | "message";

export type InquiryFormProps = {
  kind: FormKind;
  submitLabel?: string;
  show?: Partial<Record<FieldKey, boolean>>;
  messageLabel?: string;
  messagePlaceholder?: string;
  messageHint?: string;
  requiredMessage?: boolean;
  consentNote?: string;
  tone?: "light" | "dark";
  compact?: boolean;
};

const AMOUNT_BANDS = [
  "Under KES 1,000",
  "KES 1,000 – 5,000",
  "KES 5,000 – 25,000",
  "KES 25,000 – 100,000",
  "Above KES 100,000",
  "Institutional / grant",
  "Prefer not to say",
];

const METHODS = [
  "M-Pesa",
  "Card (international)",
  "Bank transfer",
  "Recurring / monthly",
  "In kind supplies",
  "Not sure yet",
];

const TOPICS = [
  "General enquiry",
  "Programmes and referrals",
  "Donations and receipts",
  "Volunteering",
  "Partnership",
  "Media and press",
  "Accessibility",
  "Privacy request",
  "Report a concern",
];

const defaultShow: Record<FieldKey, boolean> = {
  fullName: true,
  email: true,
  phone: false,
  organisation: false,
  amountBand: false,
  method: false,
  topic: false,
  message: true,
};

type Values = {
  fullName: string;
  email: string;
  phone: string;
  organisation: string;
  amountBand: string;
  method: string;
  topic: string;
  message: string;
  website: string;
};

const emptyValues = (topic = ""): Values => ({
  fullName: "",
  email: "",
  phone: "",
  organisation: "",
  amountBand: "",
  method: "",
  topic,
  message: "",
  website: "",
});

export function InquiryForm({
  kind,
  submitLabel = "Send",
  show,
  messageLabel = "Your message",
  messagePlaceholder = "Tell us what you need us to know…",
  messageHint,
  requiredMessage = true,
  consentNote,
  tone = "light",
  compact = false,
}: InquiryFormProps) {
  const visible = { ...defaultShow, ...show };
  const dark = tone === "dark";

  const [values, setValues] = useState<Values>(() =>
    emptyValues(kind === "accessibility" ? "Accessibility" : ""),
  );
  const [consent, setConsent] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<
    "idle" | "sending" | "done" | "error"
  >("idle");
  const [serverError, setServerError] = useState<string | null>(null);
  const [reference, setReference] = useState<string | null>(null);
  const [startedAt] = useState(() => Date.now());

  function update(key: keyof Values, value: string) {
    setValues((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => {
      if (!prev[key]) return prev;
      const next = { ...prev };
      delete next[key];
      return next;
    });
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "sending") return;
    setServerError(null);

    const nextErrors: Record<string, string> = {};
    if (visible.fullName && values.fullName.trim().length < 2) {
      nextErrors.fullName = "Please enter your name.";
    }
    if (visible.email && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(values.email)) {
      nextErrors.email = "Enter a valid email address.";
    }
    if (visible.organisation && values.organisation.trim().length < 2) {
      nextErrors.organisation = "Please tell us your organisation's name.";
    }
    if (visible.amountBand && !values.amountBand) {
      nextErrors.amountBand = "Please choose an amount band.";
    }
    if (visible.method && !values.method) {
      nextErrors.method = "Please choose a method.";
    }
    if (requiredMessage && values.message.trim().length < 20) {
      nextErrors.message = "Please give us at least a sentence or two (20 characters).";
    }
    if ((kind === "contact" || kind === "volunteer" || kind === "partner" || kind === "institutional" || kind === "donation-notify" || kind === "accessibility") && !consent) {
      nextErrors.consent = "Please confirm you have read the privacy notice.";
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      const first = Object.keys(nextErrors)[0];
      document.getElementById(`${kind}-${first}`)?.focus();
      return;
    }

    setStatus("sending");
    try {
      const response = await fetch(`/api/forms/${kind}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values,
          consent,
          startedAt,
          sourcePage: window.location.pathname,
          policyVersion: "2026-11-21",
        }),
      });

      const payload = (await response.json()) as {
        ok?: boolean;
        error?: string;
        fields?: Record<string, string>;
        reference?: string;
      };

      if (!response.ok || !payload.ok) {
        if (payload.fields) setErrors(payload.fields);
        setServerError(payload.error ?? "Something went wrong. Please try again.");
        setStatus("error");
        return;
      }

      setReference(payload.reference ?? null);
      setStatus("done");
    } catch {
      setServerError("Network error. Please check your connection and try again.");
      setStatus("error");
    }
  }

  const inputClass = `w-full rounded-xl border px-4 py-3 text-sm transition-colors focus:outline-none ${
    dark
      ? "border-bone/20 bg-bone/[0.06] text-bone placeholder:text-bone/60 focus:border-ochre"
      : "border-ink/15 bg-paper text-ink placeholder:text-ink/60 focus:border-clay"
  }`;

  const labelClass = `mb-1.5 block text-[0.72rem] font-semibold uppercase tracking-[0.12em] ${
    dark ? "text-bone/70" : "text-ink/70"
  }`;

  const errorClass = `mt-1.5 text-xs ${dark ? "text-ochre" : "text-clay"}`;

  if (status === "done") {
    return (
      <div
        role="status"
        className={`rounded-2xl border p-6 ${
          dark
            ? "border-ochre/30 bg-ochre/10 text-bone"
            : "border-clay/25 bg-clay/[0.06] text-ink"
        }`}
      >
        <span
          className={`inline-flex h-10 w-10 items-center justify-center rounded-full ${
            dark ? "bg-ochre text-ink" : "bg-clay text-paper"
          }`}
        >
          <Check className="h-5 w-5" />
        </span>
        <h3 className="mt-4 font-display text-2xl">Recorded</h3>
        <p className={`mt-2 text-sm leading-relaxed ${dark ? "text-bone/75" : "text-ink/70"}`}>
          {kind === "safeguarding"
            ? "Your concern has been logged for the safeguarding reviewer. If someone is in immediate danger, contact the Kenyan emergency services now."
            : "Thank you. Our team will follow up using the contact details you provided."}
        </p>
        {reference && (
          <p className={`mt-4 text-xs ${dark ? "text-bone/65" : "text-ink/65"}`}>
            Your reference:{" "}
            <span className="font-mono tracking-tight">{reference}</span>. Keep it
            for your records.
          </p>
        )}
        <button
          type="button"
          onClick={() => {
            setStatus("idle");
            setReference(null);
            setValues(emptyValues());
            setConsent(false);
          }}
          className={`mt-5 text-xs font-semibold underline underline-offset-4 ${
            dark ? "text-ochre" : "text-clay"
          }`}
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className={compact ? "" : "space-y-5"}>
      <div className={compact ? "space-y-4" : "grid gap-5 sm:grid-cols-2"}>
        {visible.fullName && (
          <div className={visible.email ? "" : "sm:col-span-2"}>
            <label htmlFor={`${kind}-fullName`} className={labelClass}>
              Full name {kind !== "safeguarding" && <span aria-hidden="true">*</span>}
            </label>
            <input
              id={`${kind}-fullName`}
              name="fullName"
              type="text"
              autoComplete="name"
              value={values.fullName}
              onChange={(event) => update("fullName", event.target.value)}
              className={inputClass}
              aria-invalid={Boolean(errors.fullName) || undefined}
              aria-describedby={errors.fullName ? `${kind}-fullName-error` : undefined}
              required={kind !== "safeguarding"}
            />
            {errors.fullName && (
              <p id={`${kind}-fullName-error`} className={errorClass}>
                {errors.fullName}
              </p>
            )}
          </div>
        )}

        {visible.email && (
          <div>
            <label htmlFor={`${kind}-email`} className={labelClass}>
              Email address {kind !== "safeguarding" && <span aria-hidden="true">*</span>}
            </label>
            <input
              id={`${kind}-email`}
              name="email"
              type="email"
              inputMode="email"
              autoComplete="email"
              value={values.email}
              onChange={(event) => update("email", event.target.value)}
              className={inputClass}
              aria-invalid={Boolean(errors.email) || undefined}
              aria-describedby={errors.email ? `${kind}-email-error` : undefined}
              required={kind !== "safeguarding"}
            />
            {errors.email && (
              <p id={`${kind}-email-error`} className={errorClass}>
                {errors.email}
              </p>
            )}
          </div>
        )}

        {visible.phone && (
          <div>
            <label htmlFor={`${kind}-phone`} className={labelClass}>
              Phone (optional)
            </label>
            <input
              id={`${kind}-phone`}
              name="phone"
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              value={values.phone}
              onChange={(event) => update("phone", event.target.value)}
              className={inputClass}
            />
          </div>
        )}

        {visible.organisation && (
          <div>
            <label htmlFor={`${kind}-organisation`} className={labelClass}>
              Organisation <span aria-hidden="true">*</span>
            </label>
            <input
              id={`${kind}-organisation`}
              name="organisation"
              type="text"
              autoComplete="organization"
              value={values.organisation}
              onChange={(event) => update("organisation", event.target.value)}
              className={inputClass}
              aria-invalid={Boolean(errors.organisation) || undefined}
              required
            />
            {errors.organisation && (
              <p className={errorClass}>{errors.organisation}</p>
            )}
          </div>
        )}

        {visible.amountBand && (
          <div>
            <label htmlFor={`${kind}-amountBand`} className={labelClass}>
              Indicative amount <span aria-hidden="true">*</span>
            </label>
            <select
              id={`${kind}-amountBand`}
              name="amountBand"
              value={values.amountBand}
              onChange={(event) => update("amountBand", event.target.value)}
              className={inputClass}
              aria-invalid={Boolean(errors.amountBand) || undefined}
              required
            >
              <option value="">Choose a band</option>
              {AMOUNT_BANDS.map((band) => (
                <option key={band} value={band}>
                  {band}
                </option>
              ))}
            </select>
            {errors.amountBand && <p className={errorClass}>{errors.amountBand}</p>}
          </div>
        )}

        {visible.method && (
          <div>
            <label htmlFor={`${kind}-method`} className={labelClass}>
              Preferred method <span aria-hidden="true">*</span>
            </label>
            <select
              id={`${kind}-method`}
              name="method"
              value={values.method}
              onChange={(event) => update("method", event.target.value)}
              className={inputClass}
              aria-invalid={Boolean(errors.method) || undefined}
              required
            >
              <option value="">Choose a method</option>
              {METHODS.map((method) => (
                <option key={method} value={method}>
                  {method}
                </option>
              ))}
            </select>
            {errors.method && <p className={errorClass}>{errors.method}</p>}
          </div>
        )}

        {visible.topic && (
          <div className={compact ? "" : "sm:col-span-2"}>
            <label htmlFor={`${kind}-topic`} className={labelClass}>
              Subject
            </label>
            <select
              id={`${kind}-topic`}
              name="topic"
              value={values.topic}
              onChange={(event) => update("topic", event.target.value)}
              className={inputClass}
            >
              <option value="">Choose a subject</option>
              {TOPICS.map((topic) => (
                <option key={topic} value={topic}>
                  {topic}
                </option>
              ))}
            </select>
          </div>
        )}

        {visible.message && (
          <div className={compact ? "" : "sm:col-span-2"}>
            <label htmlFor={`${kind}-message`} className={labelClass}>
              {messageLabel} {requiredMessage && <span aria-hidden="true">*</span>}
            </label>
            <textarea
              id={`${kind}-message`}
              name="message"
              rows={compact ? 4 : 5}
              value={values.message}
              onChange={(event) => update("message", event.target.value)}
              placeholder={messagePlaceholder}
              className={`${inputClass} resize-y`}
              aria-invalid={Boolean(errors.message) || undefined}
              aria-describedby={
                errors.message
                  ? `${kind}-message-error`
                  : messageHint
                    ? `${kind}-message-hint`
                    : undefined
              }
              required={requiredMessage}
            />
            {messageHint && !errors.message && (
              <p
                id={`${kind}-message-hint`}
                className={`mt-1.5 text-xs ${dark ? "text-bone/60" : "text-ink/65"}`}
              >
                {messageHint}
              </p>
            )}
            {errors.message && (
              <p id={`${kind}-message-error`} className={errorClass}>
                {errors.message}
              </p>
            )}
          </div>
        )}
      </div>

      {kind !== "safeguarding" && (
        <label
          className={`flex items-start gap-2.5 text-xs leading-relaxed ${
            dark ? "text-bone/65" : "text-ink/65"
          }`}
        >
          <input
            id={`${kind}-consent`}
            type="checkbox"
            checked={consent}
            onChange={(event) => setConsent(event.target.checked)}
            aria-invalid={Boolean(errors.consent) || undefined}
            className="mt-0.5 h-4 w-4 shrink-0 accent-[var(--color-clay)]"
          />
          <span>
            {consentNote ??
              "I have read the privacy notice and agree that BBVF may use these details to respond to my message."}{" "}
            <Link
              href="/policies/privacy"
              className={`underline underline-offset-2 ${dark ? "text-ochre" : "text-clay"}`}
            >
              Privacy notice
            </Link>
            .
          </span>
        </label>
      )}
      {errors.consent && <p className={errorClass}>{errors.consent}</p>}

      {/* Honeypot: hidden from people and assistive technology, tempting to bots. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label htmlFor={`${kind}-website`}>Website</label>
        <input
          id={`${kind}-website`}
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          onChange={(event) => update("website", event.target.value)}
        />
      </div>

      {serverError && (
        <div
          role="alert"
          className={`rounded-xl border p-4 text-xs leading-relaxed ${
            dark
              ? "border-ochre/40 bg-ochre/10 text-bone/85"
              : "border-clay/30 bg-clay/[0.06] text-clay-dark"
          }`}
        >
          {serverError}
        </div>
      )}

      <div className="flex flex-col gap-3 pt-1 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="submit"
          disabled={status === "sending"}
          className={`group inline-flex items-center justify-center gap-2 rounded-full px-6 py-3.5 text-sm font-semibold transition-all disabled:opacity-60 ${
            dark
              ? "bg-ochre text-ink hover:bg-[#e6b167]"
              : "bg-ink text-bone hover:bg-ink-3"
          }`}
        >
          {status === "sending" ? "Sending…" : submitLabel}
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </button>
        <p
          className={`flex items-center gap-1.5 text-[0.68rem] ${
            dark ? "text-bone/60" : "text-ink/65"
          }`}
        >
          <Shield className="h-3.5 w-3.5" />
          Encrypted in transit. Never share PINs or card numbers.
        </p>
      </div>
    </form>
  );
}

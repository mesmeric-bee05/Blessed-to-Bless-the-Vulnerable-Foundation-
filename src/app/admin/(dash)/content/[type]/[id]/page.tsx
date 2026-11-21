import Link from "next/link";
import { notFound } from "next/navigation";
import { requireStaff, canPublish } from "@/lib/auth";
import { dbSelect } from "@/lib/rest";
import {
  CONTENT_STATUSES,
  contentTypes,
  isContentTypeKey,
} from "@/lib/content-types";
import { saveContentAction } from "@/app/admin/actions";

export const dynamic = "force-dynamic";

const errorMessages: Record<string, string> = {
  title: "The title is too short.",
  body: "That body is too large to save.",
  status: "Unknown status.",
  permission: "Your role cannot publish content. Save as approved for a publisher to review.",
  legal: "A policy cannot be published until legal review is recorded.",
  save: "The database rejected the change.",
};

export default async function EditContentPage({
  params,
  searchParams,
}: {
  params: Promise<{ type: string; id: string }>;
  searchParams: Promise<{ saved?: string; error?: string }>;
}) {
  const session = await requireStaff();
  const { type, id } = await params;
  const { saved, error } = await searchParams;
  if (!isContentTypeKey(type)) notFound();

  const definition = contentTypes[type];
  const rows = await dbSelect<Record<string, unknown>>(
    definition.table,
    `select=*&id=eq.${encodeURIComponent(id)}&limit=1`,
  );
  const row = rows[0];
  if (!row) notFound();

  const title = String(row[definition.titleField] ?? "");
  const summary = String(row[definition.summaryField] ?? "");
  const body = definition.bodyField ? String(row[definition.bodyField] ?? "") : "";
  const status = String(row.status ?? "draft");
  const legalReviewed = Boolean(row.legal_reviewed);
  const publisher = canPublish(session.role);

  return (
    <div className="max-w-3xl">
      <Link href="/admin/content" className="text-xs font-semibold text-clay">
        ← All content
      </Link>
      <h1 className="mt-3 font-display text-3xl text-ink">
        Edit {definition.label.toLowerCase().replace(/s$/, "")}
      </h1>
      <p className="mt-1 font-mono text-[0.68rem] text-ink/55">{id}</p>

      {saved && (
        <p
          role="status"
          className="mt-5 rounded-xl border border-sage/30 bg-sage/10 p-4 text-xs text-sage-dark"
        >
          Saved. Changes are live only if the status is published.
        </p>
      )}
      {error && (
        <p
          role="alert"
          className="mt-5 rounded-xl border border-clay/30 bg-clay/[0.06] p-4 text-xs text-clay-dark"
        >
          {errorMessages[error] ?? "Something went wrong."}
        </p>
      )}

      <form action={saveContentAction} className="mt-6 space-y-5">
        <input type="hidden" name="type" value={type} />
        <input type="hidden" name="id" value={id} />

        <div>
          <label
            htmlFor="title"
            className="mb-1.5 block text-[0.72rem] font-semibold uppercase tracking-[0.12em] text-ink/70"
          >
            {definition.titleField === "question" ? "Question" : "Title"}
          </label>
          <input
            id="title"
            name={`field_${definition.titleField}`}
            defaultValue={title}
            required
            minLength={3}
            className="w-full rounded-xl border border-ink/15 bg-paper px-4 py-3 text-sm text-ink focus:border-clay focus:outline-none"
          />
        </div>

        <div>
          <label
            htmlFor="summary"
            className="mb-1.5 block text-[0.72rem] font-semibold uppercase tracking-[0.12em] text-ink/70"
          >
            {definition.summaryField === "answer" ? "Answer" : "Summary"}
          </label>
          <textarea
            id="summary"
            name={`field_${definition.summaryField}`}
            defaultValue={summary}
            rows={4}
            className="w-full rounded-xl border border-ink/15 bg-paper px-4 py-3 text-sm text-ink focus:border-clay focus:outline-none"
          />
        </div>

        {definition.bodyField && (
          <div>
            <label
              htmlFor="body"
              className="mb-1.5 block text-[0.72rem] font-semibold uppercase tracking-[0.12em] text-ink/70"
            >
              {definition.bodyLabel ?? "Body (Markdown)"}
            </label>
            <textarea
              id="body"
              name="body"
              defaultValue={body}
              rows={16}
              className="w-full rounded-xl border border-ink/15 bg-paper px-4 py-3 font-mono text-xs leading-relaxed text-ink focus:border-clay focus:outline-none"
            />
          </div>
        )}

        <div>
          <label
            htmlFor="status"
            className="mb-1.5 block text-[0.72rem] font-semibold uppercase tracking-[0.12em] text-ink/70"
          >
            Status
          </label>
          <select
            id="status"
            name="status"
            defaultValue={status}
            className="w-full rounded-xl border border-ink/15 bg-paper px-4 py-3 text-sm text-ink focus:border-clay focus:outline-none"
          >
            {CONTENT_STATUSES.map((option) => (
              <option key={option} value={option}>
                {option.replace(/_/g, " ")}
              </option>
            ))}
          </select>
          <p className="mt-1.5 text-xs leading-relaxed text-ink/60">
            {publisher
              ? "Publishing records you as the approver, with the current time."
              : "Your role cannot publish; a content editor or super administrator must publish this."}
          </p>
        </div>

        {definition.requiresLegalReview && (
          <label className="flex items-start gap-2.5 rounded-xl border border-ink/15 bg-paper p-4 text-xs leading-relaxed text-ink/75">
            <input
              type="checkbox"
              name="legal_reviewed"
              defaultChecked={legalReviewed}
              className="mt-0.5 h-4 w-4 accent-[var(--color-clay)]"
            />
            <span>
              Legal review is recorded. A policy cannot be published without it,
              and the public site does not show an unreviewed policy.
            </span>
          </label>
        )}

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="submit"
            className="rounded-full bg-ink px-6 py-3.5 text-sm font-semibold text-bone hover:bg-ink-3"
          >
            Save changes
          </button>
          <Link
            href="/admin/content"
            className="rounded-full border border-ink/15 px-6 py-3.5 text-sm font-semibold text-ink hover:border-clay hover:text-clay"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}

import Link from "next/link";
import { requireStaff } from "@/lib/auth";
import { dbSelect } from "@/lib/rest";
import { contentTypes, type ContentTypeKey } from "@/lib/content-types";

export const dynamic = "force-dynamic";

type Row = {
  id: string;
  status: string;
  updated_at?: string;
  title?: string;
  question?: string;
};

const statusStyle: Record<string, string> = {
  published: "bg-sage/15 text-sage-dark",
  approved: "bg-ochre/25 text-ink",
  needs_review: "bg-clay/15 text-clay-dark",
  draft: "bg-bone text-ink/70",
  archived: "bg-ink/10 text-ink/60",
  rejected: "bg-clay/25 text-clay-dark",
};

export default async function ContentListPage() {
  await requireStaff();

  const entries = await Promise.all(
    (Object.keys(contentTypes) as ContentTypeKey[]).map(async (key) => {
      const definition = contentTypes[key];
      const rows = await dbSelect<Row>(
        definition.table,
        `select=id,status,updated_at,${definition.titleField}&order=updated_at.desc&limit=50`,
      );
      return { definition, rows };
    }),
  );

  return (
    <div>
      <h1 className="font-display text-3xl text-ink">Content</h1>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink/70">
        A row is public only when its status is <strong>published</strong> and,
        where required, an approver is recorded. Saving a publish records you as
        the approver and writes to the audit log.
      </p>

      <div className="mt-8 space-y-10">
        {entries.map(({ definition, rows }) => (
          <section key={definition.key}>
            <div className="flex items-baseline justify-between gap-4">
              <h2 className="font-display text-xl text-ink">{definition.label}</h2>
              <span className="text-xs text-ink/55">{rows.length} rows</span>
            </div>
            <div className="mt-3 overflow-hidden rounded-2xl border border-ink/10 bg-paper">
              {rows.length === 0 && (
                <p className="p-5 text-sm text-ink/65">
                  No rows yet. Run the seed script or create the first entry.
                </p>
              )}
              {rows.map((row) => {
                const title =
                  (definition.titleField === "question" ? row.question : row.title) ??
                  "Untitled";
                return (
                  <div
                    key={row.id}
                    className="flex flex-wrap items-center gap-3 border-b border-ink/10 px-5 py-4 last:border-b-0"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-ink">{title}</p>
                      <p className="mt-0.5 text-[0.65rem] text-ink/55">
                        {row.updated_at
                          ? `Updated ${new Date(row.updated_at).toLocaleDateString("en-GB")}`
                          : "Not dated"}
                      </p>
                    </div>
                    <span
                      className={`rounded-full px-3 py-1 text-[0.6rem] font-semibold uppercase tracking-wide ${
                        statusStyle[row.status] ?? "bg-bone text-ink/70"
                      }`}
                    >
                      {row.status.replace(/_/g, " ")}
                    </span>
                    <Link
                      href={`/admin/content/${definition.key}/${row.id}`}
                      className="rounded-full border border-ink/15 px-4 py-2 text-xs font-semibold text-ink hover:border-clay hover:text-clay"
                    >
                      Edit
                    </Link>
                  </div>
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}

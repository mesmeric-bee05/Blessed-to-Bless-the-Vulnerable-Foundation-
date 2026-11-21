import { canTriage, requireStaff } from "@/lib/auth";
import { dbSelect } from "@/lib/rest";
import { updateSubmissionAction } from "@/app/admin/actions";

export const dynamic = "force-dynamic";

type Submission = {
  id: string;
  reference: string;
  full_name: string | null;
  email: string | null;
  message: string;
  state: string;
  created_at: string;
  organisation?: string | null;
};

const groups = [
  { table: "contact_submissions", label: "Contact" },
  { table: "volunteer_applications", label: "Volunteer" },
  { table: "partnership_inquiries", label: "Partnership" },
  { table: "institutional_inquiries", label: "Institutional" },
  { table: "donation_intents", label: "Donation interest" },
] as const;

const states = ["new", "in_triage", "actioned", "closed", "spam"] as const;

export default async function SubmissionsPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string; error?: string }>;
}) {
  const session = await requireStaff();
  const { saved, error } = await searchParams;
  const triage = canTriage(session.role);

  const results = await Promise.all(
    groups.map(async (group) => ({
      ...group,
      rows: await dbSelect<Submission>(
        group.table,
        `select=id,reference,full_name,email,message,state,created_at&order=created_at.desc&limit=40`,
      ),
    })),
  );

  const safeguardingVisible =
    session.role === "super_admin" || session.role === "safeguarding_reviewer";
  const safeguarding = safeguardingVisible
    ? await dbSelect<Submission>(
        "safeguarding_reports",
        "select=id,reference,full_name,email,message,state,created_at&order=created_at.desc&limit=40",
      )
    : [];

  return (
    <div>
      <h1 className="font-display text-3xl text-ink">Submissions</h1>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink/70">
        Personal data from the website&rsquo;s forms. Only the roles that need a
        queue can read it, and every state change is logged.
      </p>

      {saved && (
        <p role="status" className="mt-5 rounded-xl border border-sage/30 bg-sage/10 p-4 text-xs text-sage-dark">
          State updated.
        </p>
      )}
      {error && (
        <p role="alert" className="mt-5 rounded-xl border border-clay/30 bg-clay/[0.06] p-4 text-xs text-clay-dark">
          That update was not valid.
        </p>
      )}

      {safeguarding.length > 0 && (
        <section className="mt-8 rounded-2xl border border-clay/30 bg-clay/[0.04] p-5">
          <h2 className="font-display text-xl text-ink">Safeguarding reports</h2>
          <p className="mt-1 text-xs text-ink/70">
            Handled only by the safeguarding reviewer and super administrators.
            Do not forward the contents outside that group.
          </p>
          <div className="mt-4 space-y-3">
            {safeguarding.map((item) => (
              <SubmissionCard
                key={item.id}
                item={item}
                table="safeguarding_reports"
                triage={triage || session.role === "safeguarding_reviewer"}
              />
            ))}
          </div>
        </section>
      )}

      <div className="mt-10 space-y-10">
        {results.map((group) => (
          <section key={group.table}>
            <div className="flex items-baseline justify-between">
              <h2 className="font-display text-xl text-ink">{group.label}</h2>
              <span className="text-xs text-ink/55">{group.rows.length}</span>
            </div>
            <div className="mt-3 space-y-3">
              {group.rows.length === 0 && (
                <p className="rounded-xl border border-ink/10 bg-paper p-5 text-sm text-ink/65">
                  Nothing in this queue.
                </p>
              )}
              {group.rows.map((item) => (
                <SubmissionCard
                  key={item.id}
                  item={item}
                  table={group.table}
                  triage={triage}
                />
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}

function SubmissionCard({
  item,
  table,
  triage,
}: {
  item: Submission;
  table: string;
  triage: boolean;
}) {
  return (
    <article className="rounded-2xl border border-ink/10 bg-paper p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-ink">
            {item.full_name ?? "No name given"}
            <span className="ml-2 font-mono text-[0.62rem] font-normal text-ink/55">
              {item.reference}
            </span>
          </p>
          <p className="mt-0.5 text-[0.68rem] text-ink/60">
            {item.email ?? "No email"} ·{" "}
            {new Date(item.created_at).toLocaleString("en-GB")}
          </p>
        </div>
        {triage ? (
          <form action={updateSubmissionAction} className="flex items-center gap-2">
            <input type="hidden" name="table" value={table} />
            <input type="hidden" name="id" value={item.id} />
            <select
              name="state"
              defaultValue={item.state}
              className="rounded-lg border border-ink/15 bg-paper px-2 py-1.5 text-xs"
            >
              {states.map((state) => (
                <option key={state} value={state}>
                  {state.replace(/_/g, " ")}
                </option>
              ))}
            </select>
            <button
              type="submit"
              className="rounded-full bg-ink px-3 py-1.5 text-[0.68rem] font-semibold text-bone"
            >
              Update
            </button>
          </form>
        ) : (
          <span className="rounded-full bg-bone px-3 py-1 text-[0.6rem] font-semibold uppercase tracking-wide text-ink/70">
            {item.state.replace(/_/g, " ")}
          </span>
        )}
      </div>
      <p className="mt-3 whitespace-pre-wrap text-xs leading-relaxed text-ink/75">
        {item.message}
      </p>
    </article>
  );
}

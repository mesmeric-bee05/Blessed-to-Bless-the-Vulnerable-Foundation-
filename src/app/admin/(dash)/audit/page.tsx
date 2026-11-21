import { requireStaff } from "@/lib/auth";
import { dbSelect } from "@/lib/rest";

export const dynamic = "force-dynamic";

type AuditRow = {
  id: number;
  action: string;
  entity: string;
  entity_id: string | null;
  actor_role: string | null;
  created_at: string;
  diff: unknown;
};

export default async function AuditPage() {
  const session = await requireStaff();
  if (session.role !== "super_admin" && session.role !== "read_only_auditor") {
    return (
      <div className="rounded-2xl border border-clay/30 bg-paper p-8">
        <h1 className="font-display text-2xl text-ink">Restricted</h1>
        <p className="mt-2 text-sm text-ink/70">
          The audit log is visible to super administrators and read-only auditors.
        </p>
      </div>
    );
  }

  const rows = await dbSelect<AuditRow>(
    "audit_log",
    "select=id,action,entity,entity_id,actor_role,created_at,diff&order=created_at.desc&limit=100",
  );

  return (
    <div>
      <h1 className="font-display text-3xl text-ink">Audit log</h1>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink/70">
        Append-only. Database triggers record campaign, policy, media,
        leadership and donation-method changes; the CMS records content and
        triage actions here as well.
      </p>

      <div className="mt-6 overflow-x-auto rounded-2xl border border-ink/10 bg-paper">
        <table className="w-full min-w-[720px] text-left text-xs">
          <thead className="border-b border-ink/10 text-[0.6rem] uppercase tracking-wide text-ink/60">
            <tr>
              <th className="px-4 py-3">When</th>
              <th className="px-4 py-3">Actor role</th>
              <th className="px-4 py-3">Action</th>
              <th className="px-4 py-3">Entity</th>
              <th className="px-4 py-3">Record</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-ink/65">
                  No audit entries yet.
                </td>
              </tr>
            )}
            {rows.map((row) => (
              <tr key={row.id} className="border-b border-ink/10 last:border-b-0">
                <td className="px-4 py-3 text-ink/70">
                  {new Date(row.created_at).toLocaleString("en-GB")}
                </td>
                <td className="px-4 py-3 text-ink/70">
                  {(row.actor_role ?? "system").replace(/_/g, " ")}
                </td>
                <td className="px-4 py-3 font-medium text-ink">{row.action}</td>
                <td className="px-4 py-3 text-ink/70">{row.entity}</td>
                <td className="px-4 py-3 font-mono text-[0.62rem] text-ink/60">
                  {row.entity_id ?? "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

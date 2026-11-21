"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  canEditContent,
  canPublish,
  canTriage,
  getStaffSession,
  signInStaff,
  signOutStaff,
} from "@/lib/auth";
import { dbInsert, dbUpdate, eq, isDbConfigured } from "@/lib/rest";
import {
  contentTypes,
  isContentStatus,
  isContentTypeKey,
} from "@/lib/content-types";

const SUBMISSION_TABLES = [
  "contact_submissions",
  "volunteer_applications",
  "partnership_inquiries",
  "institutional_inquiries",
  "donation_intents",
  "safeguarding_reports",
] as const;

const SUBMISSION_STATES = ["new", "in_triage", "actioned", "closed", "spam"] as const;

function loginError(message: string, next: string): never {
  redirect(`/admin/login?error=${encodeURIComponent(message)}&next=${encodeURIComponent(next)}`);
}

export async function signInAction(formData: FormData): Promise<void> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const next = String(formData.get("next") ?? "/admin");
  const safeNext = next.startsWith("/admin") ? next : "/admin";

  if (!email || password.length < 8) {
    loginError("Enter your staff email and password.", safeNext);
  }
  if (!isDbConfigured()) {
    loginError("The database is not configured in this environment.", safeNext);
  }

  const result = await signInStaff(email, password);
  if (!result.ok) loginError(result.error, safeNext);

  redirect(safeNext);
}

export async function signOutAction(): Promise<void> {
  await signOutStaff();
  redirect("/admin/login");
}

function revalidateAdmin(): void {
  revalidatePath("/admin");
  revalidatePath("/admin/content");
  revalidatePath("/admin/submissions");
  revalidatePath("/admin/donations");
  revalidatePath("/admin/audit");
}

export async function saveContentAction(formData: FormData): Promise<void> {
  const session = await getStaffSession();
  if (!session) redirect("/admin/login");
  if (!canEditContent(session.role)) redirect("/admin?denied=1");

  const type = String(formData.get("type") ?? "");
  const id = String(formData.get("id") ?? "");
  if (!isContentTypeKey(type) || !id) redirect("/admin/content");

  const definition = contentTypes[type];
  const status = String(formData.get("status") ?? "draft");
  if (!isContentStatus(status)) redirect(`/admin/content/${type}/${id}?error=status`);

  const title = String(formData.get(`field_${definition.titleField}`) ?? "").trim();
  const summary = String(formData.get(`field_${definition.summaryField}`) ?? "").trim();
  if (title.length < 3) redirect(`/admin/content/${type}/${id}?error=title`);

  const patch: Record<string, unknown> = {
    [definition.titleField]: title,
    [definition.summaryField]: summary,
    status,
  };

  if (definition.bodyField) {
    const body = String(formData.get("body") ?? "");
    if (body.length > 60_000) redirect(`/admin/content/${type}/${id}?error=body`);
    patch[definition.bodyField] = body;
  }

  if (status === "published") {
    if (!canPublish(session.role)) {
      redirect(`/admin/content/${type}/${id}?error=permission`);
    }
    if (definition.requiresLegalReview) {
      const legal = formData.get("legal_reviewed") === "on";
      patch.legal_reviewed = legal;
      if (!legal) redirect(`/admin/content/${type}/${id}?error=legal`);
    }
    if (definition.requiresApproval) {
      patch.approved_by = session.userId;
      patch.approved_at = new Date().toISOString();
    }
  }

  const saved = await dbUpdate(definition.table, `id=${eq(id)}`, patch);
  if (!saved) redirect(`/admin/content/${type}/${id}?error=save`);

  await dbInsert(
    "audit_log",
    {
      actor_id: session.userId,
      action: "content_update",
      entity: definition.table,
      entity_id: id,
      diff: { status, title },
    },
    { ignoreDuplicates: false },
  );

  revalidateAdmin();
  redirect(`/admin/content/${type}/${id}?saved=1`);
}

export async function updateSubmissionAction(formData: FormData): Promise<void> {
  const session = await getStaffSession();
  if (!session) redirect("/admin/login");
  if (!canTriage(session.role)) redirect("/admin?denied=1");

  const table = String(formData.get("table") ?? "");
  const id = String(formData.get("id") ?? "");
  const state = String(formData.get("state") ?? "");

  if (
    !(SUBMISSION_TABLES as readonly string[]).includes(table) ||
    !id ||
    !(SUBMISSION_STATES as readonly string[]).includes(state)
  ) {
    redirect("/admin/submissions?error=invalid");
  }

  const patch: Record<string, unknown> = { state };
  if (table === "safeguarding_reports") {
    patch.reviewer_id = session.userId;
    patch.reviewed_at = new Date().toISOString();
  }

  await dbUpdate(table, `id=${eq(id)}`, patch);
  await dbInsert(
    "audit_log",
    {
      actor_id: session.userId,
      action: "submission_state",
      entity: table,
      entity_id: id,
      diff: { state },
    },
    { ignoreDuplicates: false },
  );

  revalidateAdmin();
  redirect("/admin/submissions?saved=1");
}

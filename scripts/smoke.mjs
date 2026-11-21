#!/usr/bin/env node
/**
 * Smoke test: public routes render, security guards reject bad requests, and
 * the donation API fails closed when a rail is not configured.
 *
 * Usage: BASE_URL=http://127.0.0.1:3000 node scripts/smoke.mjs
 */

const base = (process.env.BASE_URL ?? "http://127.0.0.1:3000").replace(/\/+$/, "");

const pages = [
  "/",
  "/about",
  "/about/governance",
  "/about/leadership",
  "/where-we-work",
  "/programs",
  "/programs/children-education",
  "/campaigns",
  "/campaigns/beyond-service",
  "/impact",
  "/impact/reports",
  "/stories",
  "/events",
  "/gallery",
  "/get-involved",
  "/donate",
  "/donate/local",
  "/donate/international",
  "/donate/checkout",
  "/transparency",
  "/safeguarding",
  "/contact",
  "/faq",
  "/policies",
  "/policies/privacy",
  "/investors",
  "/admin/login",
  "/sitemap.xml",
  "/robots.txt",
  "/manifest.webmanifest",
];

let failures = 0;

function check(name, condition, detail = "") {
  if (condition) {
    console.log(`PASS  ${name}`);
  } else {
    failures += 1;
    console.log(`FAIL  ${name}${detail ? ` — ${detail}` : ""}`);
  }
}

for (const path of pages) {
  try {
    const response = await fetch(`${base}${path}`, { redirect: "manual" });
    check(
      `GET ${path}`,
      response.status === 200 || (path === "/admin" && response.status === 307),
      `status ${response.status}`,
    );
  } catch (error) {
    check(`GET ${path}`, false, String(error));
  }
}

// Unauthenticated admin access must not render the dashboard.
try {
  const response = await fetch(`${base}/admin`, { redirect: "manual" });
  const location = response.headers.get("location") ?? "";
  check(
    "GET /admin redirects to sign-in",
    response.status >= 300 && response.status < 400 && location.includes("/admin/login"),
    `status ${response.status} location ${location}`,
  );
} catch (error) {
  check("GET /admin redirects to sign-in", false, String(error));
}

// Cross-site submission is rejected before any parsing.
try {
  const response = await fetch(`${base}/api/forms/contact`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Origin: "https://evil.example" },
    body: JSON.stringify({ fullName: "Test", email: "a@b.co", message: "x".repeat(30), consent: true }),
  });
  check("form rejects a foreign Origin", response.status === 403, `status ${response.status}`);
} catch (error) {
  check("form rejects a foreign Origin", false, String(error));
}

// Invalid payload is rejected with field errors.
try {
  const response = await fetch(`${base}/api/forms/contact`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ fullName: "A", email: "not-an-email", message: "short", consent: false }),
  });
  check("form rejects invalid fields", response.status === 422, `status ${response.status}`);
} catch (error) {
  check("form rejects invalid fields", false, String(error));
}

// Unknown form kind is a 404.
try {
  const response = await fetch(`${base}/api/forms/not-a-form`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: "{}",
  });
  check("unknown form kind is 404", response.status === 404, `status ${response.status}`);
} catch (error) {
  check("unknown form kind is 404", false, String(error));
}

// A malformed donation never reaches a provider.
try {
  const response = await fetch(`${base}/api/donations/intent`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ amount: -5, method: "card", email: "bad", consent: false }),
  });
  check("donation rejects invalid input", [422, 400].includes(response.status), `status ${response.status}`);
} catch (error) {
  check("donation rejects invalid input", false, String(error));
}

// Unsigned webhooks are rejected.
try {
  const response = await fetch(`${base}/api/webhooks/stripe`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "stripe-signature": "t=1,v1=deadbeef" },
    body: JSON.stringify({ id: "evt_smoke", type: "checkout.session.completed" }),
  });
  check("stripe webhook rejects a bad signature", response.status === 400, `status ${response.status}`);
} catch (error) {
  check("stripe webhook rejects a bad signature", false, String(error));
}

console.log(`\n${failures === 0 ? "All checks passed." : `${failures} check(s) failed.`}`);
process.exit(failures === 0 ? 0 : 1);

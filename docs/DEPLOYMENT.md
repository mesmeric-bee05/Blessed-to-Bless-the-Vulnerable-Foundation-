# Deployment

The site runs on two hosts, both from the same reviewed source:

| Host | Purpose | URL |
| --- | --- | --- |
| Freebuff Sites | Canonical deployment used for review | `https://bbvf-website-z2zbp7.freebuff.site` |
| Vercel | Client's existing project | `https://blessed-to-bless-the-vulnerable-fou.vercel.app` |

## Environment variables

Set these in **both** hosts (Sites → Secrets, Vercel → Settings → Environment
Variables):

| Variable | Notes |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Optional. The final custom domain, once it exists. Without it, each host advertises its own origin. |
| `NEXT_PUBLIC_SITE_STATUS` | `live`. `prelaunch` is only for a private staging build and closes indexing. |
| `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` | Forms, CMS and donations. |
| `FORM_HASH_PEPPER` | Long random string for hashed abuse signals. |
| `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `CARD_CURRENCY` | Card giving. See `docs/PAYMENTS.md`. |
| `MPESA_*` | M-Pesa via Daraja. See `docs/PAYMENTS.md`. |

No payment rail is enabled by a variable alone: the code refuses to take money
until the provider credentials exist and the webhook secret verifies.

## Vercel bootstrap (temporary)

The Vercel project builds from
`mesmeric-bee05/Blessed-to-Bless-the-Vulnerable-Foundation-`. This session could
not commit the new JPEGs through its repository connection, so the deployment
bootstraps itself:

1. `vercel.json` overrides `installCommand` with `bash scripts/vercel-sync.sh && npm ci`.
2. That script applies `bbvf-sync.patch` (published by the canonical deployment)
   when the source still predates this redesign, and downloads the artwork into
   `public/` when it is missing.
3. `next build` then runs normally and the finished deployment serves every
   image from its own origin.

Both steps are skipped when the files are already present, and a failure aborts
the build rather than shipping an incomplete site.

### Removing the bootstrap

1. Download `bbvf-website-source.zip` from the project chat — it contains the
   complete source **including** `public/art` and `public/photos`.
2. Commit that tree to the GitHub repository.
3. Delete `scripts/vercel-sync.sh`, remove the `installCommand` line from
   `vercel.json`, and remove `public/bbvf-sync.patch` from the canonical
   deployment.

After that every host builds from its own repository with no external step.

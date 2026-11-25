#!/usr/bin/env bash
# Bootstrap for a deployment created from a repository that does not yet carry
# the updated site source or its photographs.
#
# The reviewed source is published as a patch by the canonical deployment, and
# the JPEGs (including the 640/960px responsive variants) are copied from the
# same origin, so the built site serves every image from its own domain.
#
# The patch step is idempotent rather than gated on a hand-written marker:
#   * it applies when the patch applies cleanly to this checkout,
#   * it skips when the same patch is already present (reverse-apply check),
#   * it fails the build when neither is true, because that means the repository
#     and the published patch have diverged and shipping either one alone would
#     publish a half-updated site.
#
# Remove this script and the installCommand in vercel.json once the files are
# committed to this repository.
set -euo pipefail

ORIGIN="${BBVF_SYNC_ORIGIN:-https://bbvf-website-z2zbp7.freebuff.site}"

echo "[vercel-sync] fetching the published source patch"
curl -fsSL --retry 3 --max-time 180 -o /tmp/bbvf-sync.patch "$ORIGIN/bbvf-sync.patch"

if git apply --check --whitespace=nowarn /tmp/bbvf-sync.patch 2>/dev/null; then
  echo "[vercel-sync] applying the reviewed site source"
  git apply --whitespace=nowarn /tmp/bbvf-sync.patch
elif git apply --check --reverse --whitespace=nowarn /tmp/bbvf-sync.patch 2>/dev/null; then
  echo "[vercel-sync] site source is already at the published revision"
else
  echo "[vercel-sync] ERROR: the published patch does not apply to this commit." >&2
  echo "[vercel-sync] The repository has diverged from the reviewed source." >&2
  exit 1
fi

mkdir -p public/photos
echo "[vercel-sync] ensuring photography is present"
for name in community-support hero-school hero-supplies service-children service-elderly service-disability service-veterans campaign-ageing campaign-veterans campaign-barriers campaign-school; do
  for file in "$name.jpg" "$name-640.jpg" "$name-960.jpg"; do
    if [ ! -s "public/photos/$file" ]; then
      curl -fsSL --retry 3 --max-time 120 -o "public/photos/$file" "$ORIGIN/photos/$file"
    fi
  done
done

echo "[vercel-sync] ready"

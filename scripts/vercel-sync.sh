#!/usr/bin/env bash
# Bootstrap for a deployment created from a repository that does not yet carry
# the updated site source or its photographs.
#
# The reviewed source is published as a patch by the canonical deployment, and
# the JPEGs (including the 640/960px responsive variants) are copied from the
# same origin, so the built site serves every image from its own domain. If the
# patch cannot be applied the build stops: shipping a half-updated site would be
# worse than a failed deployment.
#
# Remove this script and the installCommand in vercel.json once the files are
# committed to this repository.
set -euo pipefail

ORIGIN="${BBVF_SYNC_ORIGIN:-https://bbvf-website-z2zbp7.freebuff.site}"

curl -fsSL --retry 3 --max-time 120 -o /tmp/bbvf-sync.patch "$ORIGIN/bbvf-sync.patch"
if ! git apply --check --whitespace=nowarn /tmp/bbvf-sync.patch; then
  echo "[vercel-sync] the reviewed source patch does not apply; regenerate it" >&2
  exit 1
fi

if [ -f src/components/ui/Photo.tsx ] && grep -q "tap-target" src/app/globals.css; then
  echo "[vercel-sync] site source already current"
else
  echo "[vercel-sync] applying the reviewed site source"
  git apply --whitespace=nowarn /tmp/bbvf-sync.patch
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

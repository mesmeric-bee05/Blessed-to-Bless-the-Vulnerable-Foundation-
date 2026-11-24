#!/usr/bin/env bash
# Bootstrap for a deployment created from a repository that does not yet carry
# the updated site source or its photographs.
#
# The reviewed source is published as a patch by the canonical deployment, and
# the JPEGs (including the 640/960px responsive variants) are copied from the
# same origin, so the built site serves every image from its own domain. Both
# steps are skipped once the files are present, and any failure aborts the build
# instead of shipping an incomplete site.
#
# Remove this script and the installCommand in vercel.json once the files are
# committed to this repository.
set -euo pipefail

ORIGIN="${BBVF_SYNC_ORIGIN:-https://bbvf-website-z2zbp7.freebuff.site}"

needs_source() {
  [ ! -f src/content/service-art.ts ] || ! grep -q "campaignPhotos" src/content/service-art.ts
}

if needs_source; then
  echo "[vercel-sync] applying the reviewed site source"
  curl -fsSL --retry 3 --max-time 120 -o /tmp/bbvf-sync.patch "$ORIGIN/bbvf-sync.patch"
  git apply --whitespace=nowarn /tmp/bbvf-sync.patch
else
  echo "[vercel-sync] site source already current"
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

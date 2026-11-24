#!/usr/bin/env bash
# Bootstrap for a deployment created from a repository that does not yet carry
# the updated site source or its artwork.
#
# The reviewed source is published as a patch by the canonical deployment, and
# the JPEGs are copied from the same origin, so the built site serves every
# image from its own domain. Both steps are skipped once the files are present,
# and any failure aborts the build instead of shipping an incomplete site.
#
# Remove this script and the installCommand in vercel.json once the files are
# committed to this repository.
set -euo pipefail

ORIGIN="${BBVF_SYNC_ORIGIN:-https://bbvf-website-z2zbp7.freebuff.site}"

needs_source() {
  [ ! -f src/content/service-art.ts ] || ! grep -q "fieldPhotos" src/content/service-art.ts
}

if needs_source; then
  echo "[vercel-sync] applying the reviewed site source"
  curl -fsSL --retry 3 --max-time 120 -o /tmp/bbvf-sync.patch "$ORIGIN/bbvf-sync.patch"
  git apply --whitespace=nowarn /tmp/bbvf-sync.patch
else
  echo "[vercel-sync] site source already current"
fi

mkdir -p public/art public/photos
echo "[vercel-sync] ensuring artwork is present"
for name in amputee-veterans children-education disability-inclusion distribution elderly-care field-supplies hero-field; do
  if [ ! -s "public/art/$name.jpg" ]; then
    curl -fsSL --retry 3 --max-time 120 -o "public/art/$name.jpg" "$ORIGIN/art/$name.jpg"
  fi
done
if [ ! -s public/photos/community-support.jpg ]; then
  curl -fsSL --retry 3 --max-time 120 -o public/photos/community-support.jpg "$ORIGIN/photos/community-support.jpg"
fi

echo "[vercel-sync] ready"

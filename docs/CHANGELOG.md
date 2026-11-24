# Changelog

## 24 November 2026 — responsive pass

**Phones download a third of the bytes.** Every photograph ships 640px and
960px variants beside the full-size file (`npm run media:sizes`), offered through
`srcset`/`sizes` by the new `Photo` component. A 390px phone now receives the
640px file; a desktop still gets the full crop. The collapsed service panels no
longer download their photographs at all.

**iOS no longer zooms into forms.** Inputs, selects and textareas render at 16px
on screens below 768px, which stops Safari's automatic zoom-on-focus. Combined
with `viewport-fit=cover` and safe-area padding, forms stay still on notched
phones.

**Tap targets.** Breadcrumbs, footer links, policy links and inline CTAs now
render at least 32px tall, above the WCAG 2.2 24px minimum.

**Form submit buttons use the brand green** on light surfaces, matching every
other primary action on the site.

**Verified at 320, 360, 390, 414 and 768px:** no horizontal scrolling on any
page, no clipped content, and no layout shift from the photograph swap
(intrinsic width and height are always set).

### How this repository reaches Vercel

This repository is still the original scaffold. A deployment therefore applies
the reviewed source patch and copies the photographs during its install step
(`scripts/vercel-sync.sh`), and the build stops with a clear error if the patch
no longer applies. Committing the site source here, then deleting that script
and the `installCommand` in `vercel.json`, removes the indirection.

## 24 November 2026

**Photography replaces every illustration.** The four service cards, the
three hero frames, the gallery and the four campaign pages now use real
photographs. BBVF's own photograph opens the hero, the field band and the
gallery, and is labelled "Photograph supplied by BBVF". The rest are licensed
photographs labelled "Representative photograph", recorded in
`docs/MEDIA-CREDITS.md`. No generated image remains on the site.

**Every campaign has its own image,** keyed by campaign slug in
`campaignPhotos` so a CMS copy change cannot detach it.

**Intake forms fixed.** Every message form sent two columns that only exist on
the donations table, so the database rejected the insert and the site answered
with a retry message. Each form now writes exactly the columns its own table
declares, and the newsletter no longer sends an intake reference it has no
column for. All eight forms verified end to end.

**Navigation no longer wraps** at 1280–1440 px, and the brand palette is applied
consistently (blue for navigation and links, green for actions).

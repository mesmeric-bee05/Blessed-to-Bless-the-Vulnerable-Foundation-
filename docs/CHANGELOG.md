# Changelog

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
